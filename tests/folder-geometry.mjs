import assert from 'node:assert/strict';
import {folderFrame} from '../src/app/folder-geometry.mjs';
for(const [width,height,cardWidth,cardHeight] of [[296,418,140.8,117.04],[366,500,171.6,140],[744,500,230,140],[952,560,200,185],[1000,560,200,185],[976,440,200,185]]){
 const a=folderFrame(0,width,height,cardWidth,cardHeight),b=folderFrame(1,width,height,cardWidth,cardHeight);
 for(let i=0;i<4;i++){assert.equal(a.cards[i].count,0);assert.equal(b.cards[i].count,1);const c=b.cards[i];assert.ok(c.x+width/2>=-1);assert.ok(c.x+width/2+cardWidth<=width+1);assert.ok(c.y>=-1);assert.ok(c.y+cardHeight<=height);for(let j=i+1;j<4;j++){const d=b.cards[j];assert.ok(c.x+cardWidth<=d.x||d.x+cardWidth<=c.x||c.y+cardHeight<=d.y||d.y+cardHeight<=c.y)}}
 assert.deepEqual(folderFrame(0,width,height,cardWidth,cardHeight),a);
}
console.log('Six phone/tablet/desktop folder layouts: bounded cards, no overlap, count endpoints and reverse reset passed.');
