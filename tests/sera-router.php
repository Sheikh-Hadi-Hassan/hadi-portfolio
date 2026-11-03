<?php
declare(strict_types=1);
require __DIR__.'/../public/intellignce-support/provider-router.php';
function check(bool $v):void{if(!$v)throw new RuntimeException('Router contract failed');}
$base=['enabled'=>true,'free_verified'=>true,'unbilled_confirmed'=>true,'paid'=>false,'capabilities'=>['json'],'remaining'=>1,'provider'=>'mock'];$calls=0;$state=['answers'=>['objective'=>'brand refresh']];
$r=new SeraProviderRouter([$base,$base],['mock'=>function($m,$s,$limits)use(&$calls,$state){check($s===$state);check($limits['max_output_tokens']===400);if(++$calls===1)throw new RuntimeException('private upstream diagnostic');return ['answer'=>'Draft suggestion','facts'=>[]];}]);
check($r->respond($state,false)['code']==='AI_CONSENT_REQUIRED');check($calls===0);check($r->respond($state,true)['ok']);check($calls===2);check($state['answers']['objective']==='brand refresh');
foreach([['paid'=>true],['free_verified'=>false],['remaining'=>0],['enabled'=>false],['circuit_until'=>time()+1000],['unbilled_confirmed'=>false],['capabilities'=>'corrupt']] as $override){$r=new SeraProviderRouter([array_replace($base,$override)],['mock'=>function(){throw new RuntimeException('Must not call');}]);check($r->respond($state,true)['attempts']===0);}
$r=new SeraProviderRouter([$base,$base,$base],['mock'=>fn()=>['answer'=>'','facts'=>[]]],1);$result=$r->respond($state,true);check($result['attempts']===1);check($result['code']==='AI_RESPONSE_INVALID');
check((new SeraProviderRouter([],[]))->respond($state,true)['fallback']==='questionnaire');
echo "PASS: backend policy mock failover, immutable context, consent, zero-paid/free eligibility gates, quota/circuit exclusions, bounded invalid-response retry and all-unavailable fallback. No remote adapters enabled.\n";

$order=[];$r=new SeraProviderRouter([array_replace($base,['provider'=>'gemini']),array_replace($base,['provider'=>'groq'])],['gemini'=>function()use(&$order){$order[]='gemini';return ['answer'=>'Gemini','facts'=>[]];},'groq'=>function($model,$state,$limits)use(&$order){check($limits['max_output_tokens']===100);$order[]='groq';return ['answer'=>'Groq','facts'=>[]];}],2,['providerPriorities'=>['groq','gemini'],'contextChars'=>1000,'outputTokens'=>100]);check($r->respond(['answers'=>['goal'=>'retained']],true)['answer']==='Groq');check($order===['groq']);check($r->respond(['long'=>str_repeat('x',2000)],true)['code']==='CONTEXT_LIMIT');check(count($order)===1);echo "PASS: approved provider order and bounded context/output policy; over-budget context makes no provider call.\n";

$badCalls=0;$safe=fn()=>['answer'=>'Safe','facts'=>[]];
foreach([['answers'=>["bad"=>"\xff"]],['value'=>INF]] as $invalid){$result=(new SeraProviderRouter([$base],['mock'=>function()use(&$badCalls){$badCalls++;}]))->respond($invalid,true);check($result['code']==='QUESTIONNAIRE_STATE_INVALID'&&$result['attempts']===0);}
$cycle=[];$cycle['self']=&$cycle;check((new SeraProviderRouter([],[]))->respond($cycle,true)['code']==='QUESTIONNAIRE_STATE_INVALID');unset($cycle);
foreach([['providerPriorities'=>[['private'=>'ignored']]],['providerPriorities'=>['mock','mock']],['outputTokens'=>[]],['contextChars'=>'1200']] as $policy){$result=(new SeraProviderRouter([$base],['mock'=>$safe],2,$policy))->respond($state,true);check($result['code']==='PROVIDER_CONFIGURATION_INVALID'&&$result['attempts']===0);}
$invalidRows=[null,'corrupt',['provider'=>[]],array_replace($base,['provider'=>['mock']]),array_replace($base,['remaining'=>'100']),array_replace($base,['circuit_until'=>[]])];
$result=(new SeraProviderRouter($invalidRows+[],['mock'=>$safe]))->respond($state,true);check($result['attempts']===0);
foreach([['answer'=>'Safe','facts'=>['bad']],['answer'=>'Safe','facts'=>['named'=>['key'=>'k','value'=>'v']]],['answer'=>'Safe','facts'=>[],'private'=>'no']] as $badReply){check((new SeraProviderRouter([$base],['mock'=>fn()=>$badReply]))->respond($state,true)['code']==='AI_RESPONSE_INVALID');}
check($badCalls===0);check($state['answers']['objective']==='brand refresh');
echo "PASS: invalid UTF-8/non-finite/cyclic state, malformed policies/registry and nested response schemas fail closed without lost answers or calls.\n";
