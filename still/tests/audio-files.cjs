const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const media=[],revoked=[];let nextUrl=0;
class Media{constructor(){this.events={};this.paused=true;media.push(this);}set src(value){this.url=value;}addEventListener(name,fn){this.events[name]=fn;}emit(name){this.events[name]?.({});}pause(){this.paused=true;}async play(){this.paused=false;}removeAttribute(){}load(){}}
const context={Audio:Media,window:{AudioContext:function(){}},URL:{createObjectURL:()=>`blob:${++nextUrl}`,revokeObjectURL:u=>revoked.push(u)},setTimeout,clearTimeout,setInterval,Math,Promise};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../audio.js'),'utf8')+'\nthis.engine=new FocusAudio();',context);
(async()=>{
 const e=context.engine;let ended=0;
 const first=e.setFile({}, {loop:false,autoplay:false,onEnded:()=>ended++});media[0].emit('loadedmetadata');assert.equal(await first,true);assert.equal(e.file.loop,false);e.file.onended();assert.equal(ended,1);assert.equal(e.file.paused,true);
 e.active=true;const single=e.setFile({});media[1].emit('loadedmetadata');assert.equal(await single,true);assert.equal(e.file.loop,true);assert.equal(e.file.paused,false);assert.ok(revoked.includes('blob:1'));
 const slow=e.setFile({}),fast=e.setFile({});media[3].emit('loadedmetadata');await fast;media[2].emit('loadedmetadata');assert.equal(await slow,false);assert.equal(e.file,media[3]);assert.ok(revoked.includes('blob:3'));
 const pending=e.setFile({});e.clearFile();media[4].emit('loadedmetadata');assert.equal(await pending,false);assert.equal(e.file,null);
 const bad=e.setFile({});media[5].emit('error');await assert.rejects(bad,/could not be read/);assert.ok(revoked.includes('blob:6'));
 const ramps=[];e.ctx={currentTime:0};e.master={gain:{}};e.synthGain={gain:{}};e.smooth=(param,value)=>ramps.push({param,value});e.attachFile=()=>{};e.active=true;
 const muted=e.setFile({}, {autoplay:false});media[6].emit('loadedmetadata');await muted;assert.equal(e.active,false);assert.ok(ramps.some(r=>r.param===e.master.gain&&r.value===0));
 console.log('Audio-file checks passed: playlist end callbacks, repeat-one playback, stale-load cancellation, pending-load removal, object-URL cleanup, and invalid-file errors.');
})().catch(error=>{console.error(error);process.exitCode=1;});
