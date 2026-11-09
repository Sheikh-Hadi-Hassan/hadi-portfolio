<?php
declare(strict_types=1);
require_once __DIR__.'/CredentialVault.php';
require_once dirname(__DIR__,2).'/public/intellignce-support/provider-adapters.php';
require_once dirname(__DIR__,2).'/public/intellignce-support/provider-router.php';
require_once dirname(__DIR__,2).'/public/intellignce-support/provider-transport.php';
require_once dirname(__DIR__,2).'/public/intellignce-support/provider-ledger.php';
require_once dirname(__DIR__,2).'/public/intellignce-support/public-config.php';
/** Private composition root. No HTTP endpoint or browser-provided activation flags. */
final class SeraPrivateProviderRuntime {
 public function __construct(private SeraCredentialVault $vault,private SeraProviderLedger $ledger,private array $registry,private ?array $approved,private $transport,private $authorizeDiagnostics,private bool $activationApproved=false,private bool $custodyVerified=false){}
 public function readiness():array{try{$allowed=($this->authorizeDiagnostics)('provider.runtime.diagnose');}catch(Throwable $e){$allowed=false;}if($allowed!==true)throw new RuntimeException('PROVIDER_DIAGNOSTIC_FORBIDDEN');return ['activated'=>$this->activationApproved&&$this->custodyVerified,'code'=>!$this->custodyVerified?'KEY_CUSTODY_UNVERIFIED':(!$this->activationApproved?'ACTIVATION_NOT_AUTHORIZED':'LIVE_ACCEPTANCE_STILL_REQUIRED'),'paidInference'=>false,'liveConnectionTested'=>false];}
 public function respond(array $state,bool $consent,?array $requestApproved=null):array{
  if(!$consent)return ['ok'=>false,'code'=>'AI_CONSENT_REQUIRED','fallback'=>'questionnaire'];
  if(!$this->activationApproved||!$this->custodyVerified)return ['ok'=>false,'code'=>'PROVIDER_ACTIVATION_DISABLED','fallback'=>'questionnaire'];
  $approved=$requestApproved??$this->approved;if($approved!==null&&!seraPublicConfigValid($approved))return ['ok'=>false,'code'=>'PUBLIC_CONFIG_INVALID','fallback'=>'questionnaire'];
  try{$adapters=seraProviderAdapters($this->transport,fn($provider)=>$this->vault->resolve($provider),true,$approved);$adapters=seraBudgetedAdapters($adapters,$this->ledger,fn()=>time());$router=new SeraProviderRouter($this->registry,$adapters,3,seraRuntimePolicy($approved));return $router->respond(seraProviderSafeState($state),true);}catch(Throwable $e){return ['ok'=>false,'code'=>'PROVIDER_RUNTIME_UNAVAILABLE','fallback'=>'questionnaire'];}
 }
}
