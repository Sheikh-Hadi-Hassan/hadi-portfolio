<?php
declare(strict_types=1);
// Private metadata only. Unknown external results never refund quota automatically.
final class SeraProviderLedger {
 public function __construct(private string $file,private bool $storageVerified=false){}
 private function mutate(callable $fn):mixed{
  if(!$this->storageVerified||!is_dir(dirname($this->file))||is_link($this->file)||!str_starts_with(basename($this->file),'sera-usage-'))throw new RuntimeException('PROVIDER_LEDGER_BLOCKED');
  $existed=is_file($this->file);$h=fopen($this->file,'c+');if(!$h)throw new RuntimeException('PROVIDER_LEDGER_UNAVAILABLE');if(!$existed&&!chmod($this->file,0600)){fclose($h);throw new RuntimeException('PROVIDER_LEDGER_BLOCKED');}
  try{if(!flock($h,LOCK_EX))throw new RuntimeException('PROVIDER_LEDGER_UNAVAILABLE');$bytes=stream_get_contents($h,65537);if(strlen($bytes)>65536)throw new RuntimeException('PROVIDER_LEDGER_INVALID');if($bytes===''&&$existed)throw new RuntimeException('PROVIDER_LEDGER_INVALID');$data=$bytes===''?[]:json_decode($bytes,true);if(!is_array($data))throw new RuntimeException('PROVIDER_LEDGER_INVALID');$result=$fn($data);$text=json_encode($data,JSON_THROW_ON_ERROR);if(strlen($text)>65536)throw new RuntimeException('PROVIDER_LEDGER_CAPACITY');rewind($h);if(fwrite($h,$text)!==strlen($text)||!ftruncate($h,strlen($text))||!fflush($h)||!function_exists('fsync')||!fsync($h))throw new RuntimeException('PROVIDER_LEDGER_UNAVAILABLE');return $result;}finally{flock($h,LOCK_UN);fclose($h);}
 }
 public function reserve(string $id,string $period,int $limit,int $now):bool{
  if(!preg_match('/^[a-zA-Z0-9_-]{1,80}$/',$id)||!preg_match('/^[a-zA-Z0-9_-]{1,80}$/',$period)||$limit<1)throw new RuntimeException('PROVIDER_LEDGER_INVALID');
  return $this->mutate(function(&$data)use($id,$period,$limit,$now){$row=$data[$id]??['period'=>$period,'used'=>0,'failures'=>0,'circuitUntil'=>0,'successes'=>0];if(($row['circuitUntil']??0)>$now)return false;if(($row['period']??'')!==$period)$row=['period'=>$period,'used'=>0,'failures'=>0,'circuitUntil'=>0,'successes'=>0];if(!is_int($row['used']??null)||$row['used']<0||$row['used']>=$limit)return false;$row['used']++;$data[$id]=$row;return true;});
 }
 public function outcome(string $id,bool $success,int $now):void{$this->mutate(function(&$data)use($id,$success,$now){if(!isset($data[$id]))throw new RuntimeException('PROVIDER_LEDGER_INVALID');$row=&$data[$id];if($success){$row['successes']=($row['successes']??0)+1;$row['failures']=0;$row['circuitUntil']=0;}else{$row['failures']=($row['failures']??0)+1;if($row['failures']>=2)$row['circuitUntil']=$now+60;}});}
}
function seraBudgetedAdapters(array $adapters,SeraProviderLedger $ledger,callable $clock):array{
 $result=[];foreach($adapters as $provider=>$adapter)$result[$provider]=static function(array $model,array $state,array $limits)use($adapter,$ledger,$clock){if(!is_string($model['id']??null)||!is_string($model['quotaPeriod']??null)||!is_int($model['quotaLimit']??null)||!$ledger->reserve($model['id'],$model['quotaPeriod'],$model['quotaLimit'],$clock()))throw new RuntimeException('PROVIDER_QUOTA_OR_CIRCUIT_BLOCKED');try{$reply=$adapter($model,$state,$limits);$ledger->outcome($model['id'],true,$clock());return $reply;}catch(Throwable $e){$ledger->outcome($model['id'],false,$clock());throw $e;}};return $result;
}
