<?php
declare(strict_types=1);
// Inactive unless a trusted backend verifies the actual web runtime and owner authorizes activation.
function seraHttpsTransport(bool $runtimeVerified=false):callable{
 if(!$runtimeVerified||!extension_loaded('curl'))throw new RuntimeException('PROVIDER_TRANSPORT_UNVERIFIED');
 return static function(string $url,array $headers,string $body,array $policy):array{
  $gemini=(bool)preg_match('~^https://generativelanguage\.googleapis\.com/v1beta/models/[a-zA-Z0-9._-]{1,100}:generateContent$~',$url);$groq=$url==='https://api.groq.com/openai/v1/chat/completions';$openrouter=$url==='https://openrouter.ai/api/v1/chat/completions';
  if((!$gemini&&!$groq&&!$openrouter)||strlen($body)>16000||!array_is_list($headers)||count($headers)!==2||$headers[0]!=='Content-Type: application/json'||!is_string($headers[1])||strpbrk($headers[1],"\r\n\0")!==false||strlen($headers[1])>2100||!str_starts_with($headers[1],$gemini?'x-goog-api-key: ':'Authorization: Bearer '))throw new RuntimeException('PROVIDER_REQUEST_INVALID');
  $handle=curl_init($url);$buffer='';$oversized=false;try{curl_setopt_array($handle,[CURLOPT_POST=>true,CURLOPT_HTTPHEADER=>$headers,CURLOPT_POSTFIELDS=>$body,CURLOPT_FOLLOWLOCATION=>false,CURLOPT_MAXREDIRS=>0,CURLOPT_PROTOCOLS=>CURLPROTO_HTTPS,CURLOPT_SSL_VERIFYPEER=>true,CURLOPT_SSL_VERIFYHOST=>2,CURLOPT_CONNECTTIMEOUT=>2,CURLOPT_TIMEOUT=>min(6,max(1,(int)($policy['timeout_seconds']??6))),CURLOPT_WRITEFUNCTION=>static function($handle,$chunk)use(&$buffer,&$oversized){if(strlen($buffer)+strlen($chunk)>65536){$oversized=true;return 0;}$buffer.=$chunk;return strlen($chunk);}]);$ok=curl_exec($handle);if($oversized)throw new RuntimeException('AI_RESPONSE_INVALID');if($ok===false)throw new RuntimeException('PROVIDER_UNAVAILABLE');return ['status'=>(int)curl_getinfo($handle,CURLINFO_HTTP_CODE),'body'=>$buffer];}finally{curl_close($handle);}
 };
}
function seraProviderSafeState(array $state):array{
 $private=static fn($key)=>(bool)preg_match('/email|phone|name|address|contact|token|secret|api.?key/i',(string)$key);
 $walk=function($value,$depth=0)use(&$walk,$private){if($depth>5)return null;if(is_array($value)){if(isset($value['key'])&&$private($value['key']))return null;$result=[];foreach(array_slice($value,0,40,true) as $key=>$item){if($private($key))continue;$clean=$walk($item,$depth+1);if($clean!==null)$result[$key]=$clean;}return $result;}if(is_string($value)){$value=preg_replace('/[\w.+-]+@[\w.-]+\.[a-z]{2,}|(?:\+?\d[\s().-]*){7,}|https?:\/\/\S+/i','[private detail removed]',$value);preg_match('/^.{0,500}/us',$value,$clipped);return $clipped[0]??'';}if(is_bool($value)||is_int($value)||is_float($value))return $value;return null;};
 return $walk(array_intersect_key($state,array_flip(['question','answers','facts','summary','service','selectedService'])));
}
