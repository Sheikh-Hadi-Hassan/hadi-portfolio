<?php
declare(strict_types=1);
function seraRelevantFacts(array $facts,string $question,int $maxChars=1800):array{
 $words=preg_split('/[^\p{L}\p{N}]+/u',strtolower($question),-1,PREG_SPLIT_NO_EMPTY)?:[];$rank=[];
 foreach($facts as $f){if(!is_array($f)||!is_string($f['title']??null)||!is_string($f['summary']??null)||!is_string($f['source']??null)||!str_starts_with($f['source'],'/'))continue;$text=strtolower($f['title'].' '.$f['summary']);$score=0;foreach(array_unique($words) as $w)if(strlen($w)>=3&&str_contains($text,$w))$score++;if($score)$rank[]=['score'=>$score,'fact'=>$f];}
 usort($rank,fn($a,$b)=>$b['score']<=>$a['score']);$out=[];$size=0;foreach(array_slice($rank,0,3) as $item){$f=$item['fact'];$n=strlen(json_encode($f));if($size+$n>$maxChars)continue;$size+=$n;$out[]=$f;}return $out;
}
