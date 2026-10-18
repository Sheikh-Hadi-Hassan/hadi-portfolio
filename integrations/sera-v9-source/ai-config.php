<?php
declare(strict_types=1);
function loadAIConfig():array{
 $config=[];$found=false;
 foreach([__DIR__.'/private-config.php',dirname(__DIR__).'/hadi-ai-config.php',dirname(__DIR__,2).'/hadi-ai-config.php'] as $path){if(is_file($path)){$value=require $path;if(is_array($value)){$config=$value;$found=true;break;}}}
 foreach(['gemini_key'=>'GEMINI_API_KEY','model'=>'GEMINI_MODEL'] as $field=>$env){$value=getenv($env);if(!empty($value)&&empty($config[$field]))$config[$field]=trim($value);}
 foreach(['enabled'=>'SERA_AI_ENABLED','unbilled_project_confirmed'=>'SERA_UNBILLED_PROJECT_CONFIRMED'] as $field=>$env){if(!array_key_exists($field,$config)&&getenv($env)!==false)$config[$field]=filter_var(getenv($env),FILTER_VALIDATE_BOOLEAN);}
 $config['model']=$config['model']??'gemini-3.5-flash-lite';$config['_config_found']=$found||!empty(getenv('GEMINI_API_KEY'));return $config;
}
function aiChecks(array $config):array{return ['config_found'=>($config['_config_found']??false)===true,'enabled'=>($config['enabled']??false)===true,'unbilled_project_confirmed'=>($config['unbilled_project_confirmed']??false)===true,'api_key_present'=>is_string($config['gemini_key']??null)&&strlen(trim($config['gemini_key']))>20&&!preg_match('/PASTE_|YOUR_|REPLACE_|EXAMPLE/i',$config['gemini_key']),'model_allowed'=>in_array($config['model']??'',freeModels(),true),'curl_available'=>function_exists('curl_init'),'knowledge_readable'=>is_readable(__DIR__.'/knowledge.json'),'policy_readable'=>is_readable(__DIR__.'/sales-policy.txt')];}
function freeModels():array{return ['gemini-3.5-flash-lite','gemini-3.1-flash-lite','gemini-3.8-flash','gemini-2.5-flash-lite','gemini-2.5-flash'];}
function configurationCode(array $checks):string{foreach(['config_found'=>'CONFIG_MISSING','enabled'=>'AI_DISABLED','unbilled_project_confirmed'=>'FREE_PROJECT_NOT_CONFIRMED','api_key_present'=>'KEY_MISSING','model_allowed'=>'MODEL_CONFIGURATION','curl_available'=>'CURL_MISSING','knowledge_readable'=>'KNOWLEDGE_MISSING','policy_readable'=>'POLICY_MISSING'] as $check=>$code)if(!$checks[$check])return $code;return 'READY';}
