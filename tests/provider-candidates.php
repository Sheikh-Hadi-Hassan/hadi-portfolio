<?php
declare(strict_types=1);
require __DIR__.'/../public/intellignce-support/provider-router.php';
$c=json_decode(file_get_contents(__DIR__.'/../docs/admin/provider-candidates.json'),true,512,JSON_THROW_ON_ERROR);
if($c['paid_budget_usd']!==0||$c['automatic_import']!==false||count($c['models'])!==2)throw new RuntimeException('CANDIDATE_POLICY_INVALID');
foreach($c['models'] as $m){foreach(['enabled','free_verified','unbilled_confirmed','privacy_approved','evaluation_passed','live_test_authorized'] as $flag)if($m[$flag]!==false)throw new RuntimeException('CANDIDATE_MUST_REMAIN_DISABLED');if($m['account_quota']!==null||$m['remaining']!==0)throw new RuntimeException('ACCOUNT_QUOTA_NOT_VERIFIED');}
$calls=0;$router=new SeraProviderRouter($c['models'],['gemini'=>function()use(&$calls){$calls++;},'groq'=>function()use(&$calls){$calls++;}]);$state=['answers'=>['goal'=>'Preserved inquiry']];$r=$router->respond($state,true);if($calls!==0||$r['attempts']!==0||$r['fallback']!=='questionnaire'||$state['answers']['goal']!=='Preserved inquiry')throw new RuntimeException('CANDIDATE_ACTIVATION_LEAK');
echo "PASS: two documentation candidates remain disabled, no account quotas guessed, budget zero, zero credential resolution or provider calls.\n";
