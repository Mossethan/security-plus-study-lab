const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const media=[],revoked=[],fadeTimers=[];let nextUrl=0;
class Media{constructor(){this.events={};this.paused=true;media.push(this);}set src(value){this.url=value;}addEventListener(name,fn){this.events[name]=fn;}emit(name){this.events[name]?.({});}pause(){this.paused=true;}async play(){this.paused=false;}removeAttribute(){}load(){}}
const context={Audio:Media,window:{AudioContext:function(){}},URL:{createObjectURL:()=>`blob:${++nextUrl}`,revokeObjectURL:u=>revoked.push(u)},setTimeout:(fn,ms)=>(ms===1550||ms===50)?fadeTimers.push(fn):setTimeout(fn,ms),clearTimeout,setInterval,Math,Promise};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../audio.js'),'utf8')+'\nthis.engine=new FocusAudio();',context);
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
 fading.ctx={currentTime:12,state:'running',resume:async()=>{fading.ctx.state='running';},suspend:async()=>{suspends++;fading.ctx.state='suspended';}};
 fading.master={gain:{}};fading.output={gain:{cancelScheduledValues:t=>automation.push(['cancel',t]),setValueAtTime:(v,t)=>automation.push(['set',v,t]),setValueCurveAtTime:(curve,t,d)=>automation.push(['curve',Array.from(curve),t,d])}};
 fading.outputFade={from:0,to:0,start:12,duration:0};
 fading.init=()=>{};fading.apply=()=>{};fading.smooth=()=>{};fading.schedule=()=>{};fading.scheduler=1;fading.file=new Media();await fading.play();fading.ctx.currentTime=13;
 const pause=fading.pause();assert.equal(fading.active,false);assert.equal(fading.file.paused,false);assert.equal(suspends,0);
 const envelope=automation.at(-1);assert.equal(envelope[0],'curve');assert.equal(envelope[1][0],1);assert.equal(envelope[1].at(-1),0);assert.equal(envelope[2],13);assert.equal(envelope[3],1.5);
 assert.ok(envelope[1].every((v,i,a)=>i===0||v<=a[i-1]));
 // A wall-clock timeout must not cut off a slower mobile audio clock.
 fading.ctx.currentTime=13.6;fadeTimers.shift()();await Promise.resolve();assert.equal(suspends,0);assert.equal(fading.file.paused,false);
 fading.ctx.currentTime=14.5;fadeTimers.shift()();await pause;assert.equal(fading.file.paused,true);assert.equal(suspends,1);assert.equal(fading.pausing,false);
 await fading.play();fading.ctx.currentTime=15;const interrupted=fading.pause();fading.ctx.currentTime=15.5;await fading.play();
 assert.ok(Math.abs(automation.at(-1)[1][0]-.75)<.001);fadeTimers.shift()();await interrupted;assert.equal(fading.file.paused,false);assert.equal(suspends,1);assert.equal(fading.active,true);
 const oldPause=fading.pause(),newPause=fading.pause();fadeTimers.shift()();await oldPause;assert.equal(suspends,1);assert.equal(fading.file.paused,false);fading.ctx.currentTime=17;fadeTimers.shift()();await newPause;assert.equal(suspends,2);
 await fading.play();const osPause=fading.pause();fading.ctx.state='interrupted';fadeTimers.shift()();await osPause;assert.equal(fading.file.paused,true);assert.equal(suspends,3);
 // A late context resume or media-play completion cannot undo a newer pause.
 const originalResume=fading.ctx.resume,originalMediaPlay=fading.file.play;let finishResume;
 fading.ctx.resume=()=>new Promise(resolve=>{finishResume=resolve;});
 const lateResume=fading.play(),pauseDuringResume=fading.pause();finishResume();await lateResume;assert.equal(fading.active,false);fadeTimers.shift()();await pauseDuringResume;
 fading.ctx.resume=originalResume;let finishMedia,signalMedia;const enteredMedia=new Promise(resolve=>{signalMedia=resolve;});
 fading.file.play=()=>new Promise(resolve=>{finishMedia=resolve;signalMedia();});const lateMedia=fading.play();await enteredMedia;
 const pauseDuringMedia=fading.pause();finishMedia();await lateMedia;assert.equal(fading.active,false);fading.ctx.currentTime+=2;fadeTimers.shift()();await pauseDuringMedia;
 let rejectMedia,signalFailure;const enteredFailure=new Promise(resolve=>{signalFailure=resolve;});fading.file.play=()=>new Promise((resolve,reject)=>{rejectMedia=reject;signalFailure();});const failedOldPlay=fading.play();await enteredFailure;const latestPause=fading.pause();rejectMedia(Error('Old play aborted'));await failedOldPlay;assert.equal(fading.active,false);fading.ctx.currentTime+=2;fadeTimers.shift()();await latestPause;fading.file.play=originalMediaPlay;
 // Verify the real graph keeps imported audio audible with all optional layers at zero.
 const param=()=>({value:0,events:[],setTargetAtTime(value){this.value=value;},cancelScheduledValues(){},setValueAtTime(v){this.value=v;},setValueCurveAtTime(curve,start,duration){this.events.push({curve:Array.from(curve),start,duration});}});
 function audioNode(){const n={connections:[],connect(target){this.connections.push(target);return target;},disconnect(){},start(){},stop(){}};for(const key of ['gain','frequency','Q','threshold','knee','ratio','attack','release'])n[key]=param();return n;}
 context.window.AudioContext=class{constructor(){this.sampleRate=10;this.currentTime=0;this.state='suspended';this.destination=audioNode();}async resume(){this.state='running';}createGain(){return audioNode();}createDynamicsCompressor(){return audioNode();}createOscillator(){return audioNode();}createBiquadFilter(){return audioNode();}createConvolver(){return audioNode();}createBufferSource(){return audioNode();}createMediaElementSource(){return audioNode();}createBuffer(channels,length){return {getChannelData:()=>new Float32Array(length)};}};
 const graph=vm.runInContext('new FocusAudio()',context);await graph.preparePlayback();assert.equal(graph.active,false);assert.equal(graph.master.gain.value,0);assert.equal(graph.output.gain.value,0);assert.equal(graph.scheduler,undefined);graph.file=new Media();graph.attachFile();graph.apply({music:0,texture:0,pulse:0});
 assert.equal(graph.musicGain.gain.value,0);assert.equal(graph.noiseGain.gain.value,0);assert.equal(graph.pulseDepth.gain.value,0);assert.equal(graph.pulseGain.gain.value,1);assert.equal(graph.fileGain.gain.value,.65);
 assert.equal(graph.fileSource.connections[0],graph.fileGain);assert.equal(graph.fileGain.connections[0],graph.pulseGain);assert.equal(graph.pulseGain.connections[0],graph.master);assert.equal(graph.tone.connections[0],graph.musicGain);assert.equal(graph.wet.connections[0],graph.musicGain);
 assert.equal(graph.master.connections[0],graph.limiter);assert.equal(graph.limiter.connections[0],graph.output);assert.equal(graph.output.connections[0],graph.ctx.destination);
 graph.active=true;graph.fadeOutput(1,.3);graph.ctx.currentTime=1;graph.active=false;graph.pausing=true;graph.fadeOutput(0,1.5);const fadeEvents=graph.output.gain.events.length;graph.apply({volume:50});assert.equal(graph.master.gain.value,.325);assert.equal(graph.output.gain.events.length,fadeEvents);assert.equal(graph.output.gain.events.at(-1).curve.at(-1),0);
 graph.apply({music:30,texture:18,pulse:10});assert.ok(graph.musicGain.gain.value>0);assert.ok(graph.noiseGain.gain.value>0);assert.ok(graph.pulseDepth.gain.value>0);assert.equal(graph.fileGain.gain.value,.65);
 for(const rate of [8,10,12,16,20,32,40]){graph.apply({rate,pulse:20});assert.equal(graph.pulseOsc.frequency.value,rate);assert.equal(graph.pulseGain.gain.value,.9);assert.equal(graph.pulseDepth.gain.value,.1);}
 graph.apply({pulse:50});assert.equal(graph.pulseGain.gain.value-graph.pulseDepth.gain.value,.5);assert.equal(graph.pulseGain.gain.value+graph.pulseDepth.gain.value,1);graph.apply({pulse:0});assert.equal(graph.pulseGain.gain.value,1);assert.equal(graph.pulseDepth.gain.value,0);
 console.log('Audio-file checks passed: post-compressor output fade, all-layer routing, mobile audio-clock delay, interrupted context, mixer isolation, smooth resume and overlapping-pause cancellation, playlist end callbacks, repeat-one playback, stale-load cancellation, object-URL cleanup, and invalid-file errors.');
})().catch(error=>{console.error(error);process.exitCode=1;});
