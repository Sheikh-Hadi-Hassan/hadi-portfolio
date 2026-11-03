<?php
declare(strict_types=1);
// Backend-only policy core. No endpoints, credentials or remote adapters are enabled here.
final class SeraProviderRouter {
 public function __construct(private array $registry, private array $adapters, private int $maxAttempts=2) {}
 public function respond(array $state, bool $consent):array {
  if(!$consent)return ['ok'=>false,'code'=>'AI_CONSENT_REQUIRED','fallback'=>'questionnaire'];
  $context=json_encode($state,JSON_THROW_ON_ERROR);if(strlen($context)>12000)return ['ok'=>false,'code'=>'CONTEXT_LIMIT','fallback'=>'questionnaire'];
  $attempts=0;$errors=[];
  foreach($this->registry as $model){
   if(($model['enabled']??false)!==true||($model['free_verified']??false)!==true||($model['unbilled_confirmed']??false)!==true||($model['paid']??true)!==false||(!is_array($model['capabilities']??null)||!in_array('json',$model['capabilities'],true))||($model['remaining']??0)<1||($model['circuit_until']??0)>time())continue;
   $adapter=$this->adapters[$model['provider']??'']??null;if(!is_callable($adapter))continue;
   if($attempts >= min(3,max(0,$this->maxAttempts)))break;$attempts++;
   try{$reply=$adapter($model,json_decode($context,true),['max_output_tokens'=>400,'timeout_seconds'=>6]);
    if(!is_array($reply)||!is_string($reply['answer']??null)||!trim($reply['answer'])||strlen($reply['answer'])>2000||!is_array($reply['facts']??null)){$errors[]='AI_RESPONSE_INVALID';continue;}
    return ['ok'=>true,'answer'=>$reply['answer'],'facts'=>$reply['facts'],'attempts'=>$attempts];
   }catch(Throwable $e){$errors[]='PROVIDER_UNAVAILABLE';}
  }
  return ['ok'=>false,'code'=>$errors?end($errors):'FREE_MODELS_UNAVAILABLE','fallback'=>'questionnaire','attempts'=>$attempts];
 }
}
