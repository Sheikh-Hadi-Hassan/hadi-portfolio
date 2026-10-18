<?php
declare(strict_types=1);
// Rendering helpers only. No public routes, authentication changes or backend writes.
function ih_escape(mixed $v):string{return htmlspecialchars((string)$v,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8');}
function ih_fields(array $values):string{
    $html='<table role="presentation" style="width:100%;border-collapse:collapse">';
    foreach($values as $label=>$value){
        if($value===null||$value===''||$value===[])continue;
        if(is_array($value)){
            $value=array_is_list($value)?implode(', ',array_map(fn($v)=>is_scalar($v)?(string)$v:json_encode($v),$value)):null;
            if($value===null){$html.='<tr><td colspan="2" style="padding:18px 0;color:#baa1d0;font-size:13px">'.ih_escape($label).'</td></tr><tr><td colspan="2">'.ih_fields($values[$label]).'</td></tr>';continue;}
        }
        $html.='<tr><td style="padding:13px 16px 13px 0;border-bottom:1px solid #392e41;color:#b8adbf;vertical-align:top;width:34%;font:13px Arial">'.ih_escape($label).'</td><td style="padding:13px 0;border-bottom:1px solid #392e41;color:#f3eef7;font:14px/1.6 Arial;overflow-wrap:anywhere">'.nl2br(ih_escape($value)).'</td></tr>';
    }return $html.'</table>';
}
function ih_email(array $lead,bool $visitor=false):string{
    $reference=(string)($lead['reference']??'');$booked=($lead['status']??'')==='Booked';
    $title=$visitor?($booked?'Your conversation is booked.':'Your brief is with Hadi.'):($booked?'A new conversation.':'A new project to explore.');
    $intro=$visitor?'Thank you for sharing your project. Keep this reference with your enquiry.':'The details below are ready to review. Reply directly to the sender to continue the conversation.';
    $fields=['Reference'=>$reference,'Name'=>$lead['name']??'','Email'=>$lead['email']??'','Phone'=>$lead['phone']??'','Business'=>$lead['company']??'','Services'=>$lead['services']??[],'Meeting time'=>$lead['slot']??'','Time zone'=>$lead['timezone']??'','Notes'=>$lead['notes']??''];
    $brief=$lead['answers']['_consultation']['brief']??$lead['brief']??[];
    $meet=$lead['meetUrl']??'';$button='';if(is_string($meet)&&preg_match('~^https://meet\.google\.com/[a-z-]+$~',$meet))$button='<p style="margin:28px 0"><a href="'.ih_escape($meet).'" style="display:inline-block;background:#d8baf2;color:#25152e;padding:14px 20px;border-radius:8px;text-decoration:none;font:bold 14px Arial">Join Google Meet ↗</a></p>';
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#100d14;color:#f3eef7;font:15px/1.7 Arial,sans-serif"><table role="presentation" width="100%" style="background:#100d14"><tr><td style="padding:32px 16px"><table role="presentation" style="width:100%;max-width:640px;margin:auto;background:#1b1422;border:1px solid #392e41;border-radius:16px"><tr><td style="padding:32px"><p style="color:#d8baf2;font:bold 12px Arial;letter-spacing:3px;margin:0 0 40px">INTELLIGNCE</p><h1 style="font:normal 32px/1.2 Arial;letter-spacing:-1px;margin:0 0 18px">'.ih_escape($title).'</h1><p style="color:#b8adbf;margin:0 0 26px">'.ih_escape($intro).'</p>'.ih_fields($fields).($brief?'<h2 style="font:normal 20px Arial;margin-top:30px">Project brief</h2>'.ih_fields($brief):'').$button.'<p style="color:#b8adbf;border-top:1px solid #392e41;padding-top:24px;margin-top:32px;font-size:12px">Hadi Hassan · INTELLIGNCE<br><a style="color:#d8baf2" href="mailto:hadi@intellignce.net">hadi@intellignce.net</a> · <a style="color:#d8baf2" href="https://hadi.intellignce.net/">View portfolio</a></p></td></tr></table></td></tr></table></body></html>';
}
function ih_portal_details(array $lead):string{
    // Call ONLY within the existing authenticated portal. Never expose lead data publicly.
    return '<section class="ih-lead-detail"><h2>Project details</h2>'.ih_fields(['Reference'=>$lead['reference']??'','Status'=>$lead['status']??'','Name'=>$lead['name']??'','Email'=>$lead['email']??'','Phone'=>$lead['phone']??'','Business'=>$lead['company']??'','Services'=>$lead['services']??[],'Notes'=>$lead['notes']??'','Brief'=>$lead['answers']['_consultation']['brief']??$lead['brief']??[]]).'</section>';
}
