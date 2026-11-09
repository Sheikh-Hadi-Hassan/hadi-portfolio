<?php
declare(strict_types=1);
// Fixed caller-owned directory. Stores only counters keyed by an HMAC, never raw IP/key/content.
function claimBudget(array $c,string $dir):bool{
 $key=$c['request_hmac_key']??$c['gemini_key']??'';
 if(!is_string($key)||strlen($key)<32||!is_dir($dir)||is_link($dir)||(fileperms($dir)&0077)!==0)return false;
 $file=$dir.'/daily.json';if(is_link($file)||(is_file($file)&&(stat($file)['nlink']!==1||filesize($file)>65536)))return false;
 $f=@fopen($file,'c+');if(!$f)return false;
 try{if(!flock($f,LOCK_EX)||!chmod($file,0600)||fstat($f)['nlink']!==1)return false;$bytes=stream_get_contents($f,65537);if($bytes===false||strlen($bytes)>65536)return false;$usage=$bytes===''?[]:json_decode($bytes,true);if(!is_array($usage))return false;
  $today=gmdate('Y-m-d');if(($usage['day']??'')!==$today)$usage=['day'=>$today,'total'=>0,'ips'=>[]];if(!is_int($usage['total']??null)||$usage['total']<0||!is_array($usage['ips']??null)||count($usage['ips'])>100)return false;
  foreach($usage['ips'] as $hash=>$count)if(!is_string($hash)||!preg_match('/^[a-f0-9]{64}$/D',$hash)||!is_int($count)||$count<0)return false;
  $ip=hash_hmac('sha256',$_SERVER['REMOTE_ADDR']??'unknown',$key);$limit=max(1,min(100,(int)($c['daily_limit']??30)));if($usage['total']>=$limit||($usage['ips'][$ip]??0)>=min(20,$limit))return false;
  $usage['total']++;$usage['ips'][$ip]=($usage['ips'][$ip]??0)+1;$body=json_encode($usage,JSON_THROW_ON_ERROR);rewind($f);return ftruncate($f,0)&&fwrite($f,$body)===strlen($body)&&fflush($f)&&function_exists('fsync')&&fsync($f);
 }catch(Throwable $e){return false;}finally{flock($f,LOCK_UN);fclose($f);}
}
