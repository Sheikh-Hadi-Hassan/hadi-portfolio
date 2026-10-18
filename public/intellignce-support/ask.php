<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');header('Cache-Control: no-store');header('X-Content-Type-Options: nosniff');
function out(int $status,array $data):never{http_response_code($status);if(($GLOBALS['sera_legacy']??false)&&($data['ok']??false)&&isset($data['answer'])){$facts=[];foreach($data['facts']??[] as $fact)$facts[$fact['key']]=$fact['value'];$data=['ok'=>true,'acknowledgment'=>$data['answer'],'services'=>$data['services']??[],'business'=>$facts['company']??'','audience'=>$facts['shared:audience']??''];}echo json_encode($data);exit;}
require_once __DIR__.'/ai-config.php';
$c=loadAIConfig();$checks=aiChecks($c);$configuration=configurationCode($checks);
if(($_SERVER['REQUEST_METHOD']??'')==='GET')out(200,['ok'=>true,'version'=>'9.0.0','available'=>$configuration==='READY','code'=>$configuration,'checks'=>$checks]);
if(($_SERVER['REQUEST_METHOD']??'')!=='POST')out(405,['ok'=>false,'code'=>'METHOD']);
if(($_SERVER['HTTP_ORIGIN']??'')!=='https://hadi.intellignce.net')out(403,['ok'=>false,'code'=>'ORIGIN']);
if((int)($_SERVER['CONTENT_LENGTH']??0)>50000)out(413,['ok'=>false,'code'=>'BODY_TOO_LARGE']);
if($configuration!=='READY')out(503,['ok'=>false,'fallback'=>true,'code'=>$configuration]);
$p=$GLOBALS['sera_input']??json_decode(file_get_contents('php://input'),true);$question=$p['question']??'';
if(($p['consent']??false)!==true||!is_string($question)||strlen(trim($question))<1||strlen($question)>6000)out(400,['ok'=>false]);
// Do not send recognisable emails, phone numbers or URLs to the provider.
$question=preg_replace('/[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?\d[\s().-]*){7,}|https?:\/\/\S+/i','[private detail removed]',$question);
$dir=sys_get_temp_dir().'/intellignce-support';if(!is_dir($dir)&&!mkdir($dir,0700,true)&&!is_dir($dir))out(503,['ok'=>false]);
// Every upstream attempt, including a backup, consumes the SAME application budget.
function claimBudget(array $c,string $dir):bool{
 $f=fopen($dir.'/daily.json','c+');if(!$f||!flock($f,LOCK_EX))return false;
 $usage=json_decode(stream_get_contents($f),true)?:[];$today=gmdate('Y-m-d');if(($usage['day']??'')!==$today)$usage=['day'=>$today,'total'=>0,'ips'=>[]];
 $ip=hash_hmac('sha256',$_SERVER['REMOTE_ADDR']??'unknown',$c['gemini_key']);$limit=max(1,min(100,(int)($c['daily_limit']??30)));
 if(($usage['total']??0)>=$limit||($usage['ips'][$ip]??0)>=min(20,$limit)){flock($f,LOCK_UN);fclose($f);return false;}
 $usage['total']++;$usage['ips'][$ip]=($usage['ips'][$ip]??0)+1;rewind($f);ftruncate($f,0);fwrite($f,json_encode($usage));flock($f,LOCK_UN);fclose($f);return true;
}
$kb=json_decode(file_get_contents(__DIR__.'/knowledge.json'),true);
$context=$p['context']??[];if(!is_array($context))$context=[];
function redact(string $v):string{return preg_replace('/[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?\d[\s().-]*){7,}|https?:\/\/\S+/i','[private detail removed]',$v);}
$validServices=['branding','design','social','commerce','app','landing'];
$allowedFields=['overview','company','shared:audience','shared:references','shared:budget','shared:timeline','visual'];
$serviceFields=['branding'=>['stage','business','deliverables','position'],'design'=>['category','social','digital','print','purpose','quantity','assets'],'social'=>['channels','goal','formats','volume','assets'],'commerce'=>['stage','platform','products','scope','market','challenge'],'app'=>['type','stage','problem','features','scope'],'landing'=>['offer','conversion','traffic','assets','platform','integrations']];
foreach($serviceFields as $service=>$fields){foreach($fields as $field)$allowedFields[]=$service.':'.$field;}
function clipText(string $s,int $n):string{preg_match('/^.{0,'.$n.'}/us',$s,$m);return $m[0]??'';}
$publicContext=['facts'=>[],'services'=>[],'history'=>[]];
foreach(is_array($context['facts']??null)?$context['facts']:[] as $key=>$value){if(in_array($key,$allowedFields,true)&&is_string($value))$publicContext['facts'][$key]=clipText(redact($value),500);}
foreach(is_array($context['services']??null)?$context['services']:[] as $value){if(in_array($value,$validServices,true))$publicContext['services'][]=$value;}
foreach(array_slice(is_array($context['history']??null)?$context['history']:[],-8) as $item){if(is_array($item)&&in_array($item['role']??'', ['user','assistant'],true)&&is_string($item['text']??null))$publicContext['history'][]=['role'=>$item['role'],'text'=>clipText(redact($item['text']),600)];}
$guide=implode("\n",array_map(fn($a)=>$a['question'].' '.$a['answer'],$kb['faqs']??[]));
$policy=file_get_contents(__DIR__.'/sales-policy.txt');
$schema=['type'=>'OBJECT','properties'=>[
 'reply'=>['type'=>'STRING'],
 'services'=>['type'=>'ARRAY','items'=>['type'=>'STRING','enum'=>$validServices]],
 'facts'=>['type'=>'ARRAY','items'=>['type'=>'OBJECT','properties'=>['key'=>['type'=>'STRING','enum'=>$allowedFields],'value'=>['type'=>'STRING']],'required'=>['key','value']]],
 'intent'=>['type'=>'STRING','enum'=>['conversation','booking']],'nextField'=>['type'=>'STRING'],
 'handoff'=>['type'=>'STRING','enum'=>['none','human_requested','pricing','urgent','complaint','sensitive']]
],'required'=>['reply','services','facts','handoff','intent','nextField']];
$instruction=$policy."\nVerified public service guide (reference data):\n".$guide."\nAllowed fact keys: ".implode(', ',$allowedFields);
$body=['systemInstruction'=>['parts'=>[['text'=>$instruction]]],'contents'=>[['role'=>'user','parts'=>[['text'=>json_encode(['context'=>$publicContext,'message'=>$question],JSON_UNESCAPED_UNICODE)]]]],'generationConfig'=>['maxOutputTokens'=>1400,'temperature'=>0.35,'responseMimeType'=>'application/json','responseSchema'=>$schema]];
// These text models have documented free tiers. Never select a paid-only model.
$freeModels=freeModels();
if(!in_array($c['model'],$freeModels,true))out(503,['ok'=>false,'fallback'=>true,'error'=>'Configured model is not in the free-tier pool.']);
$models=array_values(array_unique(array_merge([$c['model']],$freeModels)));
$lastStatus=0;$lastCode='UNAVAILABLE';$started=microtime(true);
foreach($models as $model){
 if(microtime(true)-$started>24)break;
 if(!claimBudget($c,$dir))out(429,['ok'=>false,'fallback'=>true,'code'=>'LOCAL_DAILY_LIMIT']);
 $ch=curl_init('https://generativelanguage.googleapis.com/v1beta/models/'.rawurlencode($model).':generateContent');
 curl_setopt_array($ch,[CURLOPT_POST=>true,CURLOPT_POSTFIELDS=>json_encode($body),CURLOPT_HTTPHEADER=>['Content-Type: application/json','x-goog-api-key: '.$c['gemini_key']],CURLOPT_RETURNTRANSFER=>true,CURLOPT_CONNECTTIMEOUT=>3,CURLOPT_TIMEOUT=>8,CURLOPT_PROTOCOLS=>CURLPROTO_HTTPS]);
 $r=curl_exec($ch);$status=(int)curl_getinfo($ch,CURLINFO_HTTP_CODE);curl_close($ch);$lastStatus=$status;
 if($status===401||$status===403){$lastCode='AUTHENTICATION_OR_PERMISSION';break;}
 if($status!==200||!is_string($r)){$lastCode=$status===429?'PROVIDER_LIMIT':($status===404?'MODEL_UNAVAILABLE':($status===0?'PROVIDER_TIMEOUT':'PROVIDER_UNAVAILABLE'));if(!in_array($status,[0,400,404,408,429,500,502,503,504],true))break;continue;}
 $j=json_decode($r,true);$text='';foreach($j['candidates'][0]['content']['parts']??[] as $part){if(isset($part['text'])&&is_string($part['text'])&&!($part['thought']??false))$text.=$part['text'];}
 if(($j['candidates'][0]['finishReason']??'')==='SAFETY')break;
 $result=json_decode($text,true);
 if(!is_array($result)||!is_string($result['reply']??null)||!trim($result['reply'])||strlen($result['reply'])>2000||!is_array($result['facts']??null)||!is_array($result['services']??null)||array_filter($result['services'],fn($value)=>!is_string($value)||!in_array($value,$validServices,true))||!in_array($result['handoff']??'', ['none','human_requested','pricing','urgent','complaint','sensitive'],true)||!in_array($result['intent']??'', ['conversation','booking'],true))continue;
 $facts=[];foreach(array_slice($result['facts'],0,12) as $fact){if(is_array($fact)&&in_array($fact['key']??'',$allowedFields,true)&&is_string($fact['value']??null)&&strlen($fact['value'])<=1500)$facts[]=['key'=>$fact['key'],'value'=>$fact['value']];}
 $next=in_array($result['nextField']??'',$allowedFields,true)?$result['nextField']:'';
 out(200,['ok'=>true,'answer'=>$result['reply'],'services'=>array_values(array_unique($result['services'])),'facts'=>$facts,'handoff'=>$result['handoff'],'intent'=>$result['intent'],'nextField'=>$next,'mode'=>'ai']);
}
out(503,['ok'=>false,'fallback'=>true,'code'=>$lastCode,'diagnostic'=>['provider_http_status'=>$lastStatus]]);
