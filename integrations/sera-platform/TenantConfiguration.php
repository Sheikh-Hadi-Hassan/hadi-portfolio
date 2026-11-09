<?php
declare(strict_types=1);
/** Private backend foundation. No HTTP endpoint, authentication provider or public embed activation. */
final class SeraTenantContext {
 private function __construct(private readonly string $tenant,private readonly string $subject,private readonly array $permissions){}
 public static function authenticate(callable $trustedAuthenticator,string $requestedTenant):self{
  if(!preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/D',$requestedTenant))throw new RuntimeException('TENANT_UNAUTHORIZED');
  try{$identity=$trustedAuthenticator();}catch(Throwable $e){throw new RuntimeException('TENANT_UNAUTHORIZED');}
  if(!is_array($identity)||($identity['authenticated']??false)!==true||!is_string($identity['subject']??null)||!preg_match('/^[a-zA-Z0-9_.:@-]{1,100}$/D',$identity['subject'])||!is_array($identity['memberships']??null)||!array_is_list($identity['memberships'])||count($identity['memberships'])>100)throw new RuntimeException('TENANT_UNAUTHORIZED');
  $matches=array_values(array_filter($identity['memberships'],fn($m)=>is_array($m)&&($m['tenantId']??null)===$requestedTenant));
  if(count($matches)!==1)throw new RuntimeException('TENANT_UNAUTHORIZED');$permissions=$matches[0]['permissions']??null;
  if(!is_array($permissions)||!array_is_list($permissions)||array_filter($permissions,fn($p)=>!is_string($p)||!in_array($p,['configuration.read','configuration.write'],true))||count(array_unique($permissions))!==count($permissions))throw new RuntimeException('TENANT_UNAUTHORIZED');
  return new self($requestedTenant,$identity['subject'],$permissions);
 }
 public function tenantId():string{return $this->tenant;}
 public function subject():string{return $this->subject;}
 public function requirePermission(string $permission):void{if(!in_array($permission,$this->permissions,true))throw new RuntimeException('TENANT_FORBIDDEN');}
 public function __serialize():array{throw new RuntimeException('TENANT_CONTEXT_NOT_TRANSFERABLE');}
 public function __unserialize(array $data):void{throw new RuntimeException('TENANT_CONTEXT_NOT_TRANSFERABLE');}
}
/** Adapter must bind tenantId to its storage partition and commit callback atomically. No production adapter is assumed. */
interface SeraTenantRepository {
 public function read(string $tenantId):?array;
 public function transact(string $tenantId,callable $update):array;
}
final class SeraTenantConfiguration {
 public function __construct(private SeraTenantRepository $repository,private bool $storageVerified=false,private bool $writesApproved=false){}
 private static function fields(array $value,array $allowed):void{if(array_diff(array_keys($value),$allowed))throw new RuntimeException('TENANT_CONFIG_INVALID');}
 public static function validate(array $document):void{
  self::fields($document,['schemaVersion','businessName','siteUrl','services','offers']);
  if(($document['schemaVersion']??null)!==1||!is_string($document['businessName']??null)||!trim($document['businessName'])||strlen($document['businessName'])>100||!is_string($document['siteUrl']??null)||strlen($document['siteUrl'])>300||!filter_var($document['siteUrl'],FILTER_VALIDATE_URL))throw new RuntimeException('TENANT_CONFIG_INVALID');
  $url=parse_url($document['siteUrl']);if(($url['scheme']??'')!=='https'||!isset($url['host'])||isset($url['user'])||isset($url['pass'])||isset($url['query'])||isset($url['fragment']))throw new RuntimeException('TENANT_CONFIG_INVALID');
  foreach(['services','offers'] as $field){$rows=$document[$field]??null;if(!is_array($rows)||!array_is_list($rows)||count($rows)>20)throw new RuntimeException('TENANT_CONFIG_INVALID');$seen=[];foreach($rows as $row){if(!is_array($row))throw new RuntimeException('TENANT_CONFIG_INVALID');self::fields($row,['id','title','description']);if(!is_string($row['id']??null)||!preg_match('/^[a-z][a-z0-9_-]{1,63}$/D',$row['id'])||isset($seen[$row['id']])||!is_string($row['title']??null)||!trim($row['title'])||strlen($row['title'])>100||!is_string($row['description']??null)||strlen($row['description'])>1000)throw new RuntimeException('TENANT_CONFIG_INVALID');$seen[$row['id']]=true;}}
  try{$bytes=json_encode($document,JSON_THROW_ON_ERROR);}catch(Throwable $e){throw new RuntimeException('TENANT_CONFIG_INVALID');}if(strlen($bytes)>32768)throw new RuntimeException('TENANT_CONFIG_INVALID');
 }
 private function guard(SeraTenantContext $context,bool $write=false):void{if(!$this->storageVerified)throw new RuntimeException('TENANT_STORAGE_UNVERIFIED');$context->requirePermission('configuration.read');if($write){$context->requirePermission('configuration.write');if(!$this->writesApproved)throw new RuntimeException('TENANT_WRITES_DISABLED');}}
 private function record(?array $record,string $tenant):array{
  if($record===null)return ['schemaVersion'=>1,'tenantId'=>$tenant,'revision'=>0,'document'=>null,'operations'=>[]];
  if(array_diff(array_keys($record),['schemaVersion','tenantId','revision','document','operations'])||($record['schemaVersion']??null)!==1||($record['tenantId']??null)!==$tenant||!is_int($record['revision']??null)||$record['revision']<1||!is_array($record['document']??null)||!is_array($record['operations']??null)||count($record['operations'])!==$record['revision']||count($record['operations'])>500)throw new RuntimeException('TENANT_RECORD_INVALID');
  self::validate($record['document']);foreach($record['operations'] as $id=>$op)if(!is_string($id)||!preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/D',$id)||!is_array($op)||array_diff(array_keys($op),['hash','subject','revision'])||!is_string($op['hash']??null)||!preg_match('/^[a-f0-9]{64}$/D',$op['hash'])||!is_string($op['subject']??null)||!is_int($op['revision']??null)||$op['revision']<1||$op['revision']>$record['revision'])throw new RuntimeException('TENANT_RECORD_INVALID');return $record;
 }
 public function read(SeraTenantContext $context):array{$this->guard($context);try{$record=$this->record($this->repository->read($context->tenantId()),$context->tenantId());}catch(Throwable $e){throw new RuntimeException('TENANT_CONFIG_UNAVAILABLE');}return ['revision'=>$record['revision'],'document'=>$record['document'],'status'=>'private_draft'];}
 public function save(SeraTenantContext $context,array $document,int $expectedRevision,string $operationId):array{
  $this->guard($context,true);self::validate($document);if($expectedRevision<0||!preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/D',$operationId))throw new RuntimeException('TENANT_CONFIG_INVALID');
  $hash=hash('sha256',json_encode([$context->tenantId(),$context->subject(),$document,$expectedRevision],JSON_THROW_ON_ERROR));$replayed=false;
  try{$saved=$this->repository->transact($context->tenantId(),function(?array $current)use($context,$document,$expectedRevision,$operationId,$hash,&$replayed):array{$record=$this->record($current,$context->tenantId());if(isset($record['operations'][$operationId])){if($record['operations'][$operationId]['hash']!==$hash||$record['operations'][$operationId]['subject']!==$context->subject())throw new RuntimeException('TENANT_OPERATION_MISMATCH');$replayed=true;return $record;}if($record['revision']!==$expectedRevision)throw new RuntimeException('TENANT_REVISION_CONFLICT');if($record['revision']>=500)throw new RuntimeException('TENANT_ARCHIVE_REQUIRED');$record['revision']++;$record['document']=$document;$record['operations'][$operationId]=['hash'=>$hash,'subject'=>$context->subject(),'revision'=>$record['revision']];return $record;});$saved=$this->record($this->repository->read($context->tenantId()),$context->tenantId());if(!isset($saved['operations'][$operationId])||$saved['operations'][$operationId]['hash']!==$hash)throw new RuntimeException('TENANT_SAVE_UNCONFIRMED');return ['ok'=>true,'status'=>'private_draft','revision'=>$saved['operations'][$operationId]['revision'],'replayed'=>$replayed];
  }catch(Throwable $e){if(in_array($e->getMessage(),['TENANT_OPERATION_MISMATCH','TENANT_REVISION_CONFLICT','TENANT_ARCHIVE_REQUIRED','TENANT_RECORD_INVALID'],true))throw new RuntimeException($e->getMessage());return ['ok'=>false,'status'=>'reconciliation_required','code'=>'TENANT_SAVE_UNCONFIRMED','operationId'=>$operationId];}
 }
}
