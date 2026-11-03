<?php
declare(strict_types=1);
/** Private backend library only. No HTTP endpoint. Production credential writes remain disconnected. */
final class SeraCredentialVault {
 public function __construct(private string $directory,private string $documentRoot,private $authorize,private $keyProvider,private bool $custodyVerified=false){}
 private function guard(string $permission):string{
  if(!$this->custodyVerified||!extension_loaded('sodium'))throw new RuntimeException('VAULT_CUSTODY_UNVERIFIED');
  try{$actor=($this->authorize)($permission);}catch(Throwable $e){throw new RuntimeException('VAULT_FORBIDDEN');}
  if(!is_string($actor)||!preg_match('/^[a-zA-Z0-9@._-]{1,100}$/',$actor))throw new RuntimeException('VAULT_FORBIDDEN');
  $root=realpath($this->directory);$public=realpath($this->documentRoot);
  if(!$root||!$public||$root===$public||str_starts_with($root,$public.DIRECTORY_SEPARATOR)||is_link($this->directory)||(fileperms($root)&0077)!==0)throw new RuntimeException('VAULT_STORAGE_UNSAFE');
  foreach(['credentials.json','vault.lock'] as $name){$p=$root.'/'.$name;if(is_link($p)||(is_file($p)&&((fileperms($p)&0077)!==0||stat($p)['nlink']!==1)))throw new RuntimeException('VAULT_STORAGE_UNSAFE');}
  return $actor;
 }
 private function key():string{try{$key=($this->keyProvider)();}catch(Throwable $e){throw new RuntimeException('VAULT_KEY_UNAVAILABLE');}if(!is_string($key)||strlen($key)!==SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_KEYBYTES)throw new RuntimeException('VAULT_KEY_UNAVAILABLE');return $key;}
 private function transaction(callable $operation):mixed{
  $lock=fopen($this->directory.'/vault.lock','c+');if(!$lock)throw new RuntimeException('VAULT_STORAGE_FAILED');chmod($this->directory.'/vault.lock',0600);
  try{if(!flock($lock,LOCK_EX))throw new RuntimeException('VAULT_BUSY');$file=$this->directory.'/credentials.json';$data=['schemaVersion'=>1,'revision'=>0,'providers'=>[],'audit'=>[],'operations'=>[]];
   if(is_file($file)){$bytes=file_get_contents($file);if($bytes===false||strlen($bytes)>262144)throw new RuntimeException('VAULT_CORRUPT');$data=json_decode($bytes,true);if(!is_array($data)||($data['schemaVersion']??0)!==1||!is_int($data['revision']??null)||!is_array($data['providers']??null)||!is_array($data['audit']??null)||!is_array($data['operations']??null))throw new RuntimeException('VAULT_CORRUPT');}
   return $operation($data,$file);
  }finally{flock($lock,LOCK_UN);fclose($lock);}
 }
 private function commit(array $data,string $file):void{
  $bytes=json_encode($data,JSON_THROW_ON_ERROR);if(strlen($bytes)>262144)throw new RuntimeException('VAULT_CAPACITY');$temp=$this->directory.'/.vault-'.bin2hex(random_bytes(12));$h=fopen($temp,'x');if(!$h)throw new RuntimeException('VAULT_STORAGE_FAILED');
  try{if(!chmod($temp,0600)||fwrite($h,$bytes)!==strlen($bytes)||!fflush($h)||!function_exists('fsync')||!fsync($h))throw new RuntimeException('VAULT_STORAGE_FAILED');}catch(Throwable $e){if(is_file($temp))unlink($temp);throw new RuntimeException('VAULT_STORAGE_FAILED');}finally{fclose($h);}
  try{if(file_get_contents($temp)!==$bytes||!rename($temp,$file)||file_get_contents($file)!==$bytes)throw new RuntimeException('VAULT_OUTCOME_UNCERTAIN');}finally{if(is_file($temp))unlink($temp);}
 }
 public function change(string $id,string $action,?string $secret,int $expectedRevision,string $operationId):array{
  $actor=$this->guard('provider.credentials.write');if(!preg_match('/^[a-z][a-z0-9_-]{2,63}$/',$id)||!in_array($action,['rotate','revoke'],true)||!preg_match('/^[a-f0-9-]{36}$/i',$operationId)||$expectedRevision<0||($action==='rotate'&&(!is_string($secret)||strlen($secret)<8||strlen($secret)>2048||!preg_match('/^[\x21-\x7e]+$/',$secret)))||($action==='revoke'&&$secret!==null))throw new RuntimeException('VAULT_VALIDATION');
  $key=$this->key();try{return $this->transaction(function($data,$file)use($id,$action,$secret,$expectedRevision,$operationId,$actor,$key){
   $hash=hash_hmac('sha256',json_encode([$id,$action,$secret,$expectedRevision,$actor],JSON_THROW_ON_ERROR),$key);
   if(isset($data['operations'][$operationId])){if(!hash_equals($data['operations'][$operationId]['hash'],$hash))throw new RuntimeException('VAULT_OPERATION_MISMATCH');return $data['operations'][$operationId]['result']+['replayed'=>true];}
   if($data['revision']!==$expectedRevision)throw new RuntimeException('VAULT_REVISION_CONFLICT');if(count($data['audit'])>=500)throw new RuntimeException('VAULT_CAPACITY');
   $version=($data['providers'][$id]['version']??0)+1;$row=['version'=>$version,'status'=>$action==='rotate'?'active':'revoked','suffix'=>$action==='rotate'?substr($secret,-4):''];
   if($action==='rotate'){$nonce=random_bytes(SODIUM_CRYPTO_AEAD_XCHACHA20POLY1305_IETF_NPUBBYTES);$row['nonce']=base64_encode($nonce);$row['ciphertext']=base64_encode(sodium_crypto_aead_xchacha20poly1305_ietf_encrypt($secret,$id.':'.$version,$nonce,$key));}
   $data['providers'][$id]=$row;$data['revision']++;$data['audit'][]=['actor'=>$actor,'provider'=>$id,'action'=>$action,'version'=>$version,'at'=>gmdate('c'),'operationId'=>$operationId];$result=['revision'=>$data['revision'],'version'=>$version,'status'=>$row['status']];$data['operations'][$operationId]=['hash'=>$hash,'result'=>$result];$this->commit($data,$file);return $result;
  });}finally{sodium_memzero($key);}
 }
 public function masked():array{$this->guard('provider.credentials.read');return $this->transaction(function($data){$rows=[];foreach($data['providers'] as $id=>$row)$rows[]=['id'=>$id,'version'=>$row['version'],'status'=>$row['status'],'credential'=>$row['status']==='active'?'••••'.$row['suffix']:'revoked'];return ['revision'=>$data['revision'],'providers'=>$rows,'audit'=>$data['audit']];});}
 public function resolve(string $id):string{$this->guard('provider.credentials.use');$key=$this->key();try{return $this->transaction(function($data)use($id,$key){$row=$data['providers'][$id]??null;if(!$row||$row['status']!=='active')throw new RuntimeException('VAULT_CREDENTIAL_UNAVAILABLE');try{$value=sodium_crypto_aead_xchacha20poly1305_ietf_decrypt(base64_decode($row['ciphertext'],true),$id.':'.$row['version'],base64_decode($row['nonce'],true),$key);}catch(Throwable $e){throw new RuntimeException('VAULT_DECRYPT_FAILED');}if(!is_string($value))throw new RuntimeException('VAULT_DECRYPT_FAILED');return $value;});}finally{sodium_memzero($key);}}
}
