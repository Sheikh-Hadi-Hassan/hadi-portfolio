<?php
declare(strict_types=1);
require __DIR__.'/../public/intellignce-support/public-config.php';
function ok(bool $v):void{if(!$v)throw new RuntimeException('Public configuration contract failed');}
$fixture=json_decode(file_get_contents(__DIR__.'/../docs/admin/public-config-fixture.json'),true);ok(seraPublicConfigValid($fixture));$bad=$fixture;$bad['records'][0]['kind']='provider';ok(!seraPublicConfigValid($bad));$bad=$fixture;$bad['records'][0]['data']['apiKey']='private';ok(!seraPublicConfigValid($bad));
ok(str_contains(seraApprovedTone($fixture),'short answers'));ok(!str_contains(seraApprovedTone($fixture),'Approved studio welcome'));
$dir=sys_get_temp_dir().'/sera-config-'.bin2hex(random_bytes(8));mkdir($dir);try{file_put_contents($dir.'/runtime-config.json','corrupt');file_put_contents($dir.'/runtime-config.previous.json',json_encode($fixture));ok(seraLoadPublicConfig($dir)['releaseId']===$fixture['releaseId']);file_put_contents($dir.'/runtime-config.previous.json','{}');ok(seraLoadPublicConfig($dir)===null);}finally{foreach(glob($dir.'/*') as $f)unlink($f);rmdir($dir);}echo "PASS: backend public config validation and corrupt-current/valid-previous fallback; both invalid use built-in fallback.\n";
