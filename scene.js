import * as T from './vendor/three.module.js';
import { Reflector } from './vendor/Reflector.js';
export function createRoom({textures=true,reflection=true}={}){
const scene=new T.Scene();scene.background=new T.Color('#cbd7d8');const ceiling=new T.Group();scene.add(ceiling);const blockers=[];const lamps=[];let mirror;
function tex(kind){if(!textures)return null;const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d'),im=ctx.createImageData(256,256);let seed=49;for(let i=0;i<im.data.length;i+=4){seed=(1664525*seed+1013904223)>>>0;let n=seed/4294967296;let v=kind==='fabric'?145+n*80:165+n*18;im.data[i]=im.data[i+1]=im.data[i+2]=v;im.data[i+3]=255;}ctx.putImageData(im,0,0);let t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(kind==='fabric'?8:3,kind==='fabric'?8:3);t.colorSpace=T.SRGBColorSpace;return t;}
const stone=tex('stone'),fabric=tex('fabric');const mat=(c,r=.7,m=0,map=null)=>new T.MeshStandardMaterial({color:c,roughness:r,metalness:m,map});
const floor=mat('#7a7b77',.57,0,stone),wall=mat('#777e79',.8,0,stone),dark=mat('#202827',.62),black=mat('#202423',.3,.55),orange=mat('#d75431',.85,0,fabric),silver=mat('#d4d6d1',.22,.94),wood=mat('#a79b80',.45),emit=new T.MeshStandardMaterial({color:'#fff4cb',emissive:'#ffd292',emissiveIntensity:3});
function mesh(g,m,x,y,z,parent=scene){let o=new T.Mesh(g,m);o.position.set(x,y,z);o.castShadow=!m.transparent;o.receiveShadow=true;parent.add(o);return o;}
function box(w,h,d,m,x,y,z,parent=scene){return mesh(new T.BoxGeometry(w,h,d),m,x,y,z,parent)}
function cyl(r,h,m,x,y,z,parent=scene){return mesh(new T.CylinderGeometry(r,r,h,48),m,x,y,z,parent)}
function block(x,z,w,d){blockers.push({x,z,w,d});}
box(7.6,.18,9.6,floor,0,-.1,0);for(let x=-3.8;x<=3.81;x+=.95)box(.009,.003,9.6,mat('#b0b0a8'),x,.001,0);for(let z=-4.8;z<=4.81;z+=1.2)box(7.6,.003,.009,mat('#b0b0a8'),0,.002,z);
box(.16,3.4,9.6,wall,-3.88,1.7,0);block(-3.9,0,.18,9.6);
for(let z=-4.8;z<4.8;z+=1.2)box(.012,3.35,.014,dark,-3.79,1.7,z);
for(let y=1.13;y<3.4;y+=1.13)box(.012,.012,9.6,dark,-3.79,y,0);
// Entry wall leaves a generous open doorway at the front centre.
box(2.6,3.4,.16,wall,-2.5,1.7,4.88);box(2.6,3.4,.16,wall,2.5,1.7,4.88);block(-2.5,4.88,2.6,.16);block(2.5,4.88,2.6,.16);
box(7.6,.18,9.6,dark,0,3.48,0,ceiling);
// Tall glazing and slim anodised mullions, with an abstract planted courtyard beyond.
const glass=new T.MeshPhysicalMaterial({color:'#c4e2dc',transparent:true,opacity:.12,roughness:.08,metalness:.1,side:T.DoubleSide,depthWrite:false});
box(7.6,.68,.18,wall,0,.34,-4.88);box(7.6,.25,.18,wall,0,3.28,-4.88);box(7.6,2.48,.035,glass,0,1.92,-4.8);block(0,-4.9,7.6,.2);
box(.18,.65,9.6,wall,3.88,.325,0);box(.18,.25,9.6,wall,3.88,3.28,0);box(.025,2.5,9.6,glass,3.8,1.93,0);block(3.9,0,.2,9.6);
for(let x=-3.8;x<=3.81;x+=1.9)box(.055,2.6,.08,silver,x,1.94,-4.77);
for(let z=-4.8;z<=4.81;z+=1.92)box(.08,2.6,.055,silver,3.77,1.94,z);
box(7.6,.055,.08,silver,0,1.55,-4.77);box(.08,.055,9.6,silver,3.77,1.55,0);
box(20,.15,20,mat('#c4bfa5'),3,-.2,-9);box(20,3,.2,mat('#e4e1ce'),1,1,-9);for(let x=-8;x<10;x+=2)box(1.4,1.5,.03,mat('#9dbaaf'),x,1.3,-8.88);
function plant(x,z,s=1){cyl(.28*s,.48*s,mat('#aaa99b'),x,.24*s,z);box(.045*s,1.9*s,.045*s,wood,x,1.22*s,z);const leafM=[mat('#4b673d',.85),mat('#6d824b',.8),mat('#8c995e',.85)];for(let i=0;i<48;i++){const a=i*2.399;const h=1.05+(i%7)*.17;const radius=.16+((i*17)%11)*.036;const branch=box(.018*s,.65*s,.018*s,wood,x+Math.cos(a)*radius*.5*s,h*s,z+Math.sin(a)*radius*.5*s);branch.rotation.z=Math.cos(a)*.7;branch.rotation.x=Math.sin(a)*.7;for(let j=0;j<3;j++){const o=mesh(new T.SphereGeometry(.15*s,6,4),leafM[i%3],x+Math.cos(a+j*.3)*radius*s,(h+.15*j)*s,z+Math.sin(a+j*.3)*radius*s);o.scale.set(.48,1,.22);o.rotation.set(.45,a,.5);}}}
for(let x=-4;x<10;x+=1.7)plant(x,-6.4,1.1);for(let z=-4;z<6;z+=2.2)plant(5.5,z,1.1);
// Elliptical overhead mirror: real-time planar reflections, slightly below the charcoal ceiling.
const oval=new T.Shape();oval.absellipse(0,0,3.15,3.62,0,Math.PI*2,false,0);const mg=new T.ShapeGeometry(oval,128);
if(reflection){mirror=new Reflector(mg,{color:0xc3c8c6,textureWidth:1024,textureHeight:1024,clipBias:.003});mirror.rotation.x=Math.PI/2;mirror.position.set(-.22,3.365,-.65);ceiling.add(mirror);}else{mirror=mesh(mg,silver,-.22,3.365,-.65,ceiling);mirror.rotation.x=Math.PI/2;}
function ellipseLine(rx,rz,y,z,material,parent=ceiling,tube=.018){const pts=[];for(let i=0;i<=128;i++){let a=i/128*Math.PI*2;pts.push(new T.Vector3(Math.cos(a)*rx,y,z+Math.sin(a)*rz));}return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts,true),128,tube,8,true),material,-.22,0,0,parent)}
ellipseLine(3.16,3.63,3.35,-.65,black);ellipseLine(3.21,3.68,3.345,-.65,emit,ceiling,.012);
const ring=ellipseLine(1.85,2.05,2.84,-.7,black,ceiling,.025);ellipseLine(1.85,2.05,2.825,-.7,emit,ceiling,.008);
for(let x of [-1.65,1.23])box(.009,.52,.009,black,x,3.1,-.7,ceiling);
for(let x of [-3.45,3.4])for(let z=-3.6;z<4;z+=2){box(.065,.05,1.35,black,x,3.31,z,ceiling);box(.028,.012,1.15,emit,x,3.277,z,ceiling);}
// Upholstered kidney-shaped islands, faithfully retaining the red-orange curved silhouette.
function bench(x,z,rot,s=1){const group=new T.Group();group.position.set(x,0,z);group.rotation.y=rot;scene.add(group);let shape=new T.Shape();shape.moveTo(-1.22,-.45);shape.bezierCurveTo(-1.8,-.08,-1.55,.75,-.45,.78);shape.bezierCurveTo(.4,.8,1.7,.38,1.45,-.32);shape.bezierCurveTo(1.25,-.9,.55,-.55,.12,-.35);shape.bezierCurveTo(-.55,-.03,-.7,-.8,-1.22,-.45);let geo=new T.ExtrudeGeometry(shape,{depth:.35,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.10,bevelThickness:.1,curveSegments:36});geo.rotateX(-Math.PI/2);const seat=mesh(geo,orange,0,.38,0,group);seat.scale.setScalar(s);for(let a of [-.92,.92])for(let b of [-.28,.28])cyl(.045,.32,black,a*s,.16,b*s,group);block(x,z,2.75*s,1.22*s);return group;}
bench(-.35,2.65,-.22,1);bench(-1.5,-.2,.12,.95);bench(.85,-2.25,.7,.82);bench(-1.55,-3.2,-.65,.65);
function laptop(x,y,z,rot){const g=new T.Group();g.position.set(x,y,z);g.rotation.y=rot;scene.add(g);box(.47,.021,.32,silver,0,0,0,g);const screen=box(.47,.3,.018,black,0,.155,-.13,g);screen.rotation.x=-.23;const face=box(.425,.255,.004,mat('#283f45',.3,.2),0,.157,-.115,g);face.rotation.x=-.23;for(let i=0;i<3;i++)box(.25-i*.05,.008,.004,mat('#a2c0b2'),-.04,.24-i*.045,-.091,g);box(.15,.002,.09,dark,0,.014,.075,g);}
function table(x,z){cyl(.5,.055,silver,x,.72,z);cyl(.34,.67,silver,x,.35,z);block(x,z,.9,.9);laptop(x-.08,.76,z,.3);cyl(.065,.14,mat('#d8ccb3'),x+.27,.82,z+.05);}
table(-1.45,1.12);table(.6,-.55);laptop(-.2,.88,2.7,-.3);laptop(1,.79,-2.15,.7);
// Right-hand work counter and stools.
box(.65,.09,4.7,wood,3.22,1.08,.2);block(3.22,.2,.65,4.7);for(let z of [-1.6,1.7]){box(.065,1.05,.065,black,3.2,.52,z);}
for(let z of [-1.3,.2,1.65]){cyl(.25,.09,black,2.67,.79,z);for(let dx of [-.17,.17])for(let dz of [-.17,.17])box(.033,.76,.033,black,2.67+dx,.38,z+dz);box(.44,.29,.05,dark,2.67,.98,z+.2);block(2.67,z,.5,.5);}laptop(3.2,1.14,-.8,-Math.PI/2);
// Large wall display, generated abstract presentation with no photo content.
box(.08,1.65,2.8,black,-3.75,1.94,-1.1);let screenMat=mat('#d0d4bd',.5);if(textures){let c=document.createElement('canvas');c.width=1024;c.height=600;const ct=c.getContext('2d');ct.fillStyle='#e6e5d6';ct.fillRect(0,0,1024,600);ct.fillStyle='#2f473f';ct.font='32px sans-serif';ct.fillText('A place for bright ideas.',65,95);ct.font='15px sans-serif';ct.fillText('GATHER  /  CONNECT  /  CREATE',65,140);for(let i=0;i<18;i++){ct.beginPath();ct.fillStyle=i%3?'#cd6546':'#82947b';ct.arc(95+(i%9)*101,260+Math.floor(i/9)*110,23,0,7);ct.fill();}ct.fillStyle='#969b8d';ct.fillRect(65,490,880,2);ct.font='14px sans-serif';ct.fillText('OVAL STUDIO                                       SPATIAL EXPLORATIONS',65,535);let t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;screenMat=new T.MeshBasicMaterial({map:t});}const display=mesh(new T.PlaneGeometry(2.66,1.5),screenMat,-3.702,1.94,-1.1);display.rotation.y=Math.PI/2;
// Low stone stools by the presentation wall.
for(let z of [-3.8,1.15]){cyl(.28,.45,mat('#b2b0a2'),-3.2,.225,z);block(-3.2,z,.6,.6);}
if(textures){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');const grad=ctx.createRadialGradient(64,64,8,64,64,64);grad.addColorStop(0,'rgba(15,20,15,.36)');grad.addColorStop(.5,'rgba(15,20,15,.18)');grad.addColorStop(1,'rgba(15,20,15,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,128,128);const shadowMat=new T.MeshBasicMaterial({map:new T.CanvasTexture(c),transparent:true,depthWrite:false});for(const b of blockers.filter(b=>b.w<3.3&&b.d<2)){let o=mesh(new T.PlaneGeometry(b.w+.7,b.d+.65),shadowMat,b.x,.012,b.z);o.rotation.x=-Math.PI/2;o.castShadow=false;}}
const hemi=new T.HemisphereLight('#e9f2f3','#85765b',2);scene.add(hemi);const sun=new T.DirectionalLight('#fff0d1',3.2);sun.position.set(7,6,-7);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-9,right:9,top:9,bottom:-9,near:.1,far:30});sun.shadow.bias=-.0004;sun.shadow.normalBias=.025;scene.add(sun);
for(let z of [-3,0,3]){const l=new T.PointLight('#ffd4a0',10,8,2);l.position.set(-.5,3.05,z);scene.add(l);lamps.push(l);}
function canStand(x,z){if(Math.abs(x)>3.5||z< -4.5||z>5.7)return false;return !blockers.some(b=>Math.abs(x-b.x)<b.w/2+.18&&Math.abs(z-b.z)<b.d/2+.18);}
function setEvening(on){sun.intensity=on?.18:3.2;hemi.intensity=on?.65:2;lamps.forEach(l=>l.intensity=on?28:10);scene.background.set(on?'#88959d':'#cbd7d8');emit.emissiveIntensity=on?5:3;}
return{scene,ceiling,mirror,blockers,canStand,setEvening,sun,lamps};}
