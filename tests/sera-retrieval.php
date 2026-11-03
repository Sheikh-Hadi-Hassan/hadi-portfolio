<?php
require __DIR__.'/../public/intellignce-support/retrieval.php';
$kb=json_decode(file_get_contents(__DIR__.'/../public/intellignce-support/knowledge-registry.json'),true);
if(count($kb)!==16||!str_contains(seraRelevantFacts($kb,'Morganics')[0]['source'],'morganics'))throw new Exception('Relevant project missing');
if(seraRelevantFacts($kb,'nonexistentxyz')!==[]||seraRelevantFacts($kb,'brand',0)!==[]||count(seraRelevantFacts($kb,'brand design'))>3)throw new Exception('Retrieval bounds failed');
echo "PASS: backend source-referenced retrieval selects relevant facts, caps three results/context size and abstains on unknown query.\n";
