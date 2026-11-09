<?php
declare(strict_types=1);require __DIR__.'/../public/intellignce-support/provider-ledger.php';
function ledgerReject(callable $f,string $code):void{try{$f();}catch(RuntimeException $e){if($e->getMessage()===$code)return;throw $e;}throw new RuntimeException('Unsafe ledger accepted');}
$root=sys_get_temp_dir().'/ledger-secure-'.bin2hex(random_bytes(8));mkdir($root,0700);$file=$root.'/sera-usage-test.json';$victim=$root.'/victim';file_put_contents($victim,'unchanged');chmod($victim,0600);
try{
 symlink($victim,$file);ledgerReject(fn()=>(new SeraProviderLedger($file,true))->reserve('model','period',1,1),'PROVIDER_LEDGER_BLOCKED');unlink($file);
 link($victim,$file);ledgerReject(fn()=>(new SeraProviderLedger($file,true))->reserve('model','period',1,1),'PROVIDER_LEDGER_BLOCKED');unlink($file);if(file_get_contents($victim)!=='unchanged')throw new RuntimeException('Linked file changed');
 file_put_contents($file,'{}');chmod($file,0644);ledgerReject(fn()=>(new SeraProviderLedger($file,true))->reserve('model','period',1,1),'PROVIDER_LEDGER_BLOCKED');chmod($file,0600);
 foreach([['period'=>'period','used'=>0,'failures'=>'bad','circuitUntil'=>0,'successes'=>0],['period'=>'period','used'=>0,'failures'=>0,'circuitUntil'=>0,'successes'=>0,'secret'=>'unexpected']] as $row){$bytes=json_encode(['model'=>$row]);file_put_contents($file,$bytes);ledgerReject(fn()=>(new SeraProviderLedger($file,true))->reserve('model','period',1,1),'PROVIDER_LEDGER_INVALID');if(file_get_contents($file)!==$bytes)throw new RuntimeException('Corrupt ledger overwritten');}
 unlink($file);chmod($root,0755);ledgerReject(fn()=>(new SeraProviderLedger($file,true))->reserve('model','period',1,1),'PROVIDER_LEDGER_BLOCKED');chmod($root,0700);$ledger=new SeraProviderLedger($file,true);if(!$ledger->reserve('model','period',1,1)||(fileperms($file)&0777)!==0600)throw new RuntimeException('Private ledger creation failed');if($ledger->reserve('model','period',1,1))throw new RuntimeException('Quota lost');
}finally{foreach(glob($root.'/*') as $f)unlink($f);rmdir($root);}
echo "PASS: quota ledger rejects symlinks/hardlinks, permissive storage, corrupt counters/unknown metadata without modifying targets; private creation and quota preserved. Local filesystem only.\n";
