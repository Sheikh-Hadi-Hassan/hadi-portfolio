<?php
declare(strict_types=1);
// The runtime object can only come from existing trusted private PHP configuration.
// No browser flags, filenames, code strings or callable names are accepted.
function seraRouterConfigured(array $config):bool{return array_key_exists('provider_runtime',$config);}
function seraRouterValid(array $config):bool{return class_exists('SeraPrivateProviderRuntime',false)&&($config['provider_runtime']??null) instanceof SeraPrivateProviderRuntime;}
function seraRoutedResponse(mixed $runtime,array $state,bool $consent,array $allowedFields):array{
 if(!$consent)return ['ok'=>false,'fallback'=>true,'code'=>'AI_CONSENT_REQUIRED'];
 if(!class_exists('SeraPrivateProviderRuntime',false)||!($runtime instanceof SeraPrivateProviderRuntime))return ['ok'=>false,'fallback'=>true,'code'=>'PROVIDER_RUNTIME_INVALID'];
 try{$reply=$runtime->respond($state,true);}catch(Throwable $e){return ['ok'=>false,'fallback'=>true,'code'=>'PROVIDER_RUNTIME_UNAVAILABLE'];}
 if(($reply['ok']??false)!==true){$code=$reply['code']??'';return ['ok'=>false,'fallback'=>true,'code'=>in_array($code,['PROVIDER_ACTIVATION_DISABLED','PUBLIC_CONFIG_INVALID','PROVIDER_RUNTIME_UNAVAILABLE','FREE_MODELS_UNAVAILABLE','PROVIDER_BUDGET_BLOCKED','PROVIDER_RATE_LIMITED','PROVIDER_UNAVAILABLE','AI_RESPONSE_INVALID','CONTEXT_LIMIT'],true)?$code:'PROVIDER_UNAVAILABLE'];}
 $facts=[];foreach($reply['facts']??[] as $f)if(is_array($f)&&is_string($f['key']??null)&&in_array($f['key'],$allowedFields,true)&&is_string($f['value']??null)&&strlen($f['value'])<=300)$facts[]=$f;
 return ['ok'=>true,'answer'=>$reply['answer'],'facts'=>$facts,'services'=>[],'handoff'=>'none','intent'=>'conversation','nextField'=>'','mode'=>'ai_routed'];
}
