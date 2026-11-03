<?php
declare(strict_types=1);
require __DIR__.'/../public/intellignce-support/provider-router.php';
function check(bool $v):void{if(!$v)throw new RuntimeException('Router contract failed');}
$base=['enabled'=>true,'free_verified'=>true,'unbilled_confirmed'=>true,'paid'=>false,'capabilities'=>['json'],'remaining'=>1,'provider'=>'mock'];$calls=0;$state=['answers'=>['objective'=>'brand refresh']];
$r=new SeraProviderRouter([$base,$base],['mock'=>function($m,$s,$limits)use(&$calls,$state){check($s===$state);check($limits['max_output_tokens']===400);if(++$calls===1)throw new RuntimeException('private upstream diagnostic');return ['answer'=>'Draft suggestion','facts'=>[]];}]);
check($r->respond($state,false)['code']==='AI_CONSENT_REQUIRED');check($calls===0);check($r->respond($state,true)['ok']);check($calls===2);check($state['answers']['objective']==='brand refresh');
foreach([['paid'=>true],['free_verified'=>false],['remaining'=>0],['enabled'=>false],['circuit_until'=>time()+1000],['unbilled_confirmed'=>false]] as $override){$r=new SeraProviderRouter([array_replace($base,$override)],['mock'=>function(){throw new RuntimeException('Must not call');}]);check($r->respond($state,true)['attempts']===0);}
$r=new SeraProviderRouter([$base,$base,$base],['mock'=>fn()=>['answer'=>'','facts'=>[]]],1);$result=$r->respond($state,true);check($result['attempts']===1);check($result['code']==='AI_RESPONSE_INVALID');
check((new SeraProviderRouter([],[]))->respond($state,true)['fallback']==='questionnaire');
echo "PASS: backend policy mock failover, immutable context, consent, zero-paid/free eligibility gates, quota/circuit exclusions, bounded invalid-response retry and all-unavailable fallback. No remote adapters enabled.\n";
