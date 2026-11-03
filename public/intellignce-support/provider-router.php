<?php
declare(strict_types=1);
// Backend-only policy core. No endpoints, credentials or remote adapters are enabled here.
final class SeraProviderRouter {
 public function __construct(private array $registry, private array $adapters, private int $maxAttempts=2, private array $policy=[]) {}
 public function respond(array $state, bool $consent):array {
  if(!$consent)return ['ok'=>false,'code'=>'AI_CONSENT_REQUIRED','fallback'=>'questionnaire'];
  try{$context=json_encode($state,JSON_THROW_ON_ERROR);}catch(Throwable $e){return ['ok'=>false,'code'=>'QUESTIONNAIRE_STATE_INVALID','fallback'=>'questionnaire','attempts'=>0];}
  if(!$this->validPolicy())return ['ok'=>false,'code'=>'PROVIDER_CONFIGURATION_INVALID','fallback'=>'questionnaire','attempts'=>0];if(strlen($context)>min(12000,max(1000,(int)($this->policy['contextChars']??12000))))return ['ok'=>false,'code'=>'CONTEXT_LIMIT','fallback'=>'questionnaire'];
  $attempts=0;$errors=[];
  $models=array_values(array_filter($this->registry,static fn($m)=>is_array($m)&&is_string($m['provider']??null)&&preg_match('/^[a-z][a-z0-9_-]{0,63}$/',$m['provider'])&&is_int($m['remaining']??null)&&$m['remaining']>=0&&(!isset($m['circuit_until'])||(is_int($m['circuit_until'])&&$m['circuit_until']>=0))));$order=$this->policy['providerPriorities']??[];if(is_array($order))usort($models,static fn($a,$b)=>(array_search($a['provider']??'',$order,true)===false?99:array_search($a['provider'],$order,true))<=>(array_search($b['provider']??'',$order,true)===false?99:array_search($b['provider'],$order,true)));
  foreach($models as $model){
   if(($model['enabled']??false)!==true||($model['free_verified']??false)!==true||($model['unbilled_confirmed']??false)!==true||($model['paid']??true)!==false||(!is_array($model['capabilities']??null)||!in_array('json',$model['capabilities'],true))||($model['remaining']??0)<1||($model['circuit_until']??0)>time())continue;
   $adapter=$this->adapters[$model['provider']??'']??null;if(!is_callable($adapter))continue;
   if($attempts >= min(3,max(0,$this->maxAttempts)))break;$attempts++;
   try{$reply=$adapter($model,json_decode($context,true),['max_output_tokens'=>min(400,max(1,(int)($this->policy['outputTokens']??400))),'timeout_seconds'=>6]);
    if(!is_array($reply)||!is_string($reply['answer']??null)||!trim($reply['answer'])||strlen($reply['answer'])>2000||!$this->validFacts($reply['facts']??null)||array_diff(array_keys($reply),['answer','facts'])){$errors[]='AI_RESPONSE_INVALID';continue;}
    return ['ok'=>true,'answer'=>$reply['answer'],'facts'=>$reply['facts'],'attempts'=>$attempts];
   }catch(Throwable $e){$errors[]=($e instanceof SeraProviderFailure)?$e->getMessage():'PROVIDER_UNAVAILABLE';}
  }
  return ['ok'=>false,'code'=>$errors?end($errors):'FREE_MODELS_UNAVAILABLE','fallback'=>'questionnaire','attempts'=>$attempts];
 }
 private function validPolicy():bool{
  foreach(['contextChars','outputTokens'] as $field)if(isset($this->policy[$field])&&!is_int($this->policy[$field]))return false;
  $order=$this->policy['providerPriorities']??[];
  if(!is_array($order)||!array_is_list($order)||count($order)>20)return false;
  foreach($order as $provider)if(!is_string($provider)||!preg_match('/^[a-z][a-z0-9_-]{0,63}$/',$provider))return false;
  return count(array_unique($order))===count($order);
 }
 private function validFacts(mixed $facts):bool{
  if(!is_array($facts)||!array_is_list($facts)||count($facts)>12)return false;
  foreach($facts as $fact)if(!is_array($fact)||array_diff(array_keys($fact),['key','value'])||!is_string($fact['key']??null)||!is_string($fact['value']??null)||strlen($fact['key'])>80||strlen($fact['value'])>300)return false;
  return true;
 }
}
