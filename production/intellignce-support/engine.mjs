export function findAnswer(message,knowledge){
 const text=String(message).toLowerCase().trim();
 const ranked=knowledge.faqs.map(f=>({f,score:f.keywords.reduce((s,k)=>s+(text.includes(k)?k.length:0),0)})).sort((a,b)=>b.score-a.score);
 return ranked[0]?.score?ranked[0].f:{id:'unknown',answer:'I don’t have a confirmed answer to that yet. You can describe your project in the consultation or ask Hadi directly. I won’t guess about prices, deadlines or commitments.',action:'human'};
}
export function readDraft(raw,now=Date.now()){try{const d=JSON.parse(raw);if(!d||!Array.isArray(d.messages)||now-d.savedAt>86400000)return [];return d.messages.filter(x=>['user','assistant'].includes(x.role)&&typeof x.text==='string').slice(-24).map(x=>({...x,text:x.text.slice(0,2000)}));}catch{return [];}}
