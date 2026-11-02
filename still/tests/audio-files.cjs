const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const media=[],revoked=[],fadeTimers=[];let nextUrl=0;
class Media{constructor(){this.events={};this.paused=true;media.push(this);}set src(value){this.url=value;}addEventListener(name,fn){this.events[name]=fn;}emit(name){this.events[name]?.({});}pause(){this.paused=true;}async play(){this.paused=false;}removeAttribute(){}load(){}}
const context={Audio:Media,window:{AudioContext:function(){}},URL:{createObjectURL:()=>`blob:${++nextUrl}`,revokeObjectURL:u=>revoked.push(u)},setTimeout:(fn,ms)=>ms===1550?fadeTimers.push(fn):setTimeout(fn,ms),clearTimeout,setInterval,Math,Promise};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../audio.js'),'utf8')+'\nthis.engine=new FocusAudio();',context);
(async()=>{
 const e=context.engine;let ended=0;
 const first=e.setFile({}, {loop:false,autoplay:false,onEnded:()=>ended++});media[0].emit('loadedmetadata');assert.equal(await first,true);assert.equal(e.file.loop,false);e.file.onended();assert.equal(ended,1);assert.equal(e.file.paused,true);
 e.active=true;const single=e.setFile({});media[1].emit('loadedmetadata');assert.equal(await single,true);assert.equal(e.file.loop,true);assert.equal(e.file.paused,false);assert.ok(revoked.includes('blob:1'));
 const slow=e.setFile({}),fast=e.setFile({});media[3].emit('loadedmetadata');await fast;media[2].emit('loadedmetadata');assert.equal(await slow,false);assert.equal(e.file,media[3]);assert.ok(revoked.includes('blob:3'));
 const pending=e.setFile({});e.clearFile();media[4].emit('loadedmetadata');assert.equal(await pending,false);assert.equal(e.file,null);
 const bad=e.setFile({});media[5].emit('error');await assert.rejects(bad,/could not be read/);assert.ok(revoked.includes('blob:6'));
 const ramps=[];e.ctx={currentTime:0};e.master={gain:{}};e.synthGain={gain:{}};e.smooth=(param,value)=>ramps.push({param,value});e.attachFile=()=>{};e.active=true;
 const muted=e.setFile({}, {autoplay:false});media[6].emit('loadedmetadata');await muted;assert.equal(e.active,false);assert.ok(ramps.some(r=>r.param===e.master.gain&&r.value===0));
 const fading=vm.runInContext('new FocusAudio()',context),automation=[];let suspends=0;
 fading.ctx={currentTime:12,resume:async()=>{},suspend:async()=>{suspends++;}};
 fading.master={gain:{value:.4,cancelAndHoldAtTime:t=>automation.push(['hold',t]),linearRampToValueAtTime:(value,t)=>automation.push(['ramp',value,t])}};
 fading.init=()=>{};fading.apply=()=>{};fading.schedule=()=>{};fading.scheduler=1;fading.file=new Media();await fading.play();
 const pause=fading.pause();assert.equal(fading.active,false);assert.equal(fading.file.paused,false);assert.equal(suspends,0);assert.deepEqual(automation.at(-1),['ramp',0,13.5]);
 fadeTimers.shift()();await pause;assert.equal(fading.file.paused,true);assert.equal(suspends,1);
 await fading.play();const interrupted=fading.pause();await fading.play();fadeTimers.shift()();await interrupted;assert.equal(fading.file.paused,false);assert.equal(suspends,1);assert.equal(fading.active,true);
 const oldPause=fading.pause(),newPause=fading.pause();fadeTimers.shift()();await oldPause;assert.equal(suspends,1);assert.equal(fading.file.paused,false);fadeTimers.shift()();await newPause;assert.equal(suspends,2);
 const fallback=[];fading.master.gain={value:.2,cancelScheduledValues:t=>fallback.push(['cancel',t]),setValueAtTime:(v,t)=>fallback.push(['set',v,t])};fading.holdMasterGain();assert.deepEqual(fallback,[['cancel',12],['set',.2,12]]);
 // Verify the real graph keeps imported audio audible with all optional layers at zero.
 const param=()=>({value:0,setTargetAtTime(value){this.value=value;}});
 function audioNode(){const n={connections:[],connect(target){this.connections.push(target);return target;},disconnect(){},start(){},stop(){}};for(const key of ['gain','frequency','Q','threshold','knee','ratio','attack','release'])n[key]=param();return n;}
 context.window.AudioContext=class{constructor(){this.sampleRate=10;this.currentTime=0;this.destination=audioNode();}createGain(){return audioNode();}createDynamicsCompressor(){return audioNode();}createOscillator(){return audioNode();}createBiquadFilter(){return audioNode();}createConvolver(){return audioNode();}createBufferSource(){return audioNode();}createMediaElementSource(){return audioNode();}createBuffer(channels,length){return {getChannelData:()=>new Float32Array(length)};}};
 const graph=vm.runInContext('new FocusAudio()',context);graph.init();graph.file=new Media();graph.attachFile();graph.apply({music:0,texture:0,pulse:0});
 assert.equal(graph.musicGain.gain.value,0);assert.equal(graph.noiseGain.gain.value,0);assert.equal(graph.pulseDepth.gain.value,0);assert.equal(graph.pulseGain.gain.value,1);assert.equal(graph.fileGain.gain.value,.65);
 assert.equal(graph.fileSource.connections[0],graph.fileGain);assert.equal(graph.fileGain.connections[0],graph.pulseGain);assert.equal(graph.pulseGain.connections[0],graph.master);assert.equal(graph.tone.connections[0],graph.musicGain);assert.equal(graph.wet.connections[0],graph.musicGain);
 graph.apply({music:30,texture:18,pulse:10});assert.ok(graph.musicGain.gain.value>0);assert.ok(graph.noiseGain.gain.value>0);assert.ok(graph.pulseDepth.gain.value>0);assert.equal(graph.fileGain.gain.value,.65);
 console.log('Audio-file checks passed: 1.5-second pause ramp, delayed MP3 pause/suspend, resume and overlapping-pause cancellation, gain fallback, playlist end callbacks, repeat-one playback, stale-load cancellation, object-URL cleanup, and invalid-file errors.');
})().catch(error=>{console.error(error);process.exitCode=1;});
