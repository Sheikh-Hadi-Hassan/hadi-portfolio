const clamp=v=>Math.max(0,Math.min(1,v));
const ease=v=>{v=clamp(v);return v*v*(3-2*v)};
export function folderFrame(progress,width,height,cardWidth,cardHeight,mobileLayout,total=4){
 const mobile=mobileLayout??width<=900,gap=mobile?(total>4?12:16):(total>4?24:32);
 const cards=Array.from({length:total},(_,i)=>{const start=.06+i*(.44/Math.max(1,total-1)),t=ease((progress-start)/.36);const lastCentered=mobile&&total%2&&i===total-1;const x=mobile?(lastCentered?-cardWidth/2:i%2===0?-cardWidth-gap/2:gap/2):-(cardWidth*total+gap*(total-1))/2+i*(cardWidth+gap);const y=mobile?(total>4?0:Math.max(0,height/2-270))+Math.floor(i/2)*(cardHeight+gap):height/2-220;const startY=height/2-(mobile?100:146)+i*3;return {x:-cardWidth/2+(x+cardWidth/2)*t,y:startY+(y-startY)*t,rotation:(i-(total-1)/2)*3*(1-t),count:ease((progress-start)/.48)};});
 const mobileFlap=total>4?Math.ceil(total/2)*(cardHeight+gap)-gap+8-(height/2-28):(height<460?80:52);
 return {cards,flap:(mobile?mobileFlap:52)*ease((progress-.06)/.7)};
}
