<?php
// Install as <website-root>/api/leads.php. Keep the config outside public_html.
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function fail(int $code,string $message,string $delivery='not_sent'):never{http_response_code($code);echo json_encode(['ok'=>false,'error'=>$message,'delivery'=>$delivery]);exit;}
if(($_SERVER['REQUEST_METHOD']??'')==='GET'){$path=dirname(__DIR__,2).'/hadi-leads-config.php';$c=is_file($path)?require $path:[];$available=is_array($c)&&preg_match('~^https://script\.google\.com/macros/s/[A-Za-z0-9_-]+/exec$~',$c['url']??'')&&strlen($c['key']??'')>=32;echo json_encode(['ok'=>true,'available'=>(bool)$available]);exit;}
if($_SERVER['REQUEST_METHOD']!=='POST')fail(405,'Use the enquiry form.');
$origin=$_SERVER['HTTP_ORIGIN']??'';
if($origin!=='https://hadi.intellignce.net')fail(403,'Open the form on hadi.intellignce.net.');
if((int)($_SERVER['CONTENT_LENGTH']??0)>60000)fail(413,'Please shorten your enquiry.');
$configPath=dirname(__DIR__,2).'/hadi-leads-config.php';
if(!is_file($configPath))fail(503,'Online enquiries are being connected. Please email hadi@intellignce.net for now.');
$config=require $configPath;
if(!is_array($config)||!preg_match('~^https://script\.google\.com/macros/s/[A-Za-z0-9_-]+/exec$~',$config['url']??'')||strlen($config['key']??'')<32)fail(503,'Enquiry setup is incomplete. Please email hadi@intellignce.net.');
$p=json_decode(file_get_contents('php://input'),true);
if(!is_array($p)||!in_array($p['action']??'',['availability','enquiry','booking'],true))fail(400,'Invalid request.');
if(!empty($p['website']))fail(400,'Unable to accept this request.');
// Per-IP rolling rate limit, held outside the web root. No private data in public files.
$dir=sys_get_temp_dir().'/hadi-lead-limits';if(!is_dir($dir)&&!mkdir($dir,0700,true)&&!is_dir($dir))fail(503,'Please try again later.');
$ip=$_SERVER['REMOTE_ADDR']??'unknown';$f=fopen($dir.'/'.hash_hmac('sha256',$ip,$config['key']).'.json','c+');if(!$f||!flock($f,LOCK_EX))fail(503,'Please try again.');
$times=json_decode(stream_get_contents($f),true)?:[];$times=array_values(array_filter($times,fn($t)=>$t>time()-600));
if(count($times)>=60){flock($f,LOCK_UN);fclose($f);fail(429,'Too many requests. Please wait a few minutes.');}
$times[]=time();rewind($f);ftruncate($f,0);fwrite($f,json_encode($times));flock($f,LOCK_UN);fclose($f);
$p['key']=$config['key'];$ch=curl_init($config['url']);
curl_setopt_array($ch,[CURLOPT_POST=>true,CURLOPT_POSTFIELDS=>json_encode($p),CURLOPT_HTTPHEADER=>['Content-Type: application/json'],CURLOPT_RETURNTRANSFER=>true,CURLOPT_FOLLOWLOCATION=>true,CURLOPT_MAXREDIRS=>3,CURLOPT_TIMEOUT=>55,CURLOPT_PROTOCOLS=>CURLPROTO_HTTPS,CURLOPT_REDIR_PROTOCOLS=>CURLPROTO_HTTPS]);
$response=curl_exec($ch);$status=curl_getinfo($ch,CURLINFO_HTTP_CODE);curl_close($ch);
$result=is_string($response)?json_decode($response,true):null;
if($status!==200||!is_array($result)||!array_key_exists('ok',$result))fail(502,'Unable to confirm your request. Please try again with the same form.','unknown');
if(!$result['ok'])http_response_code(400);
echo json_encode($result);
