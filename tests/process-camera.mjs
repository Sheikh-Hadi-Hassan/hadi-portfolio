import assert from 'node:assert/strict';
import {PerspectiveCamera,OrthographicCamera,Vector3,REVISION} from 'three';
import {resizeProcessCamera} from '../src/app/process-camera.mjs';
assert.equal(REVISION,'185');
for(const camera of [new PerspectiveCamera(50,1,.1,100),new OrthographicCamera(-4.5,4.5,4.5,-4.5,1,1000)]){camera.position.z=10;camera.updateMatrixWorld();for(const [w,h] of [[140,240],[160,160],[180,400],[350,200],[720,400],[390,844],[1024,768]]){resizeProcessCamera(camera,w,h);const origin=new Vector3(0,0,0).project(camera),x=new Vector3(1,0,0).project(camera),y=new Vector3(0,1,0).project(camera);assert.ok(Math.abs((x.x-origin.x)*w-(y.y-origin.y)*h)<1e-7,'Projected units must remain equal: no stretching');assert.ok(Number.isFinite(camera.projectionMatrix.elements[0]));}resizeProcessCamera(camera,0,0);assert.ok(Number.isFinite(camera.projectionMatrix.elements[0]));}
console.log('Three.js r185: perspective/orthographic projections preserve proportions across seven viewport ratios.');
