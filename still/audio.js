'use strict';
class FocusAudio {
  constructor() { this.ctx=null; this.nodes=[]; this.voices=[]; this.nextNote=0; this.step=0; this.seed=Math.floor(Math.random()*10000); this.file=null; this.fileUrl=null; this.fileRequest=0; this.playbackRequest=0; this.active=false; this.settings={music:65,texture:30,pulse:12,rate:16,volume:45,textureType:'brown',preset:'study'}; }
  random(){this.seed=(this.seed*1664525+1013904223)>>>0;return this.seed/4294967296;}
  init(){
    if(this.ctx)return;
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)throw new Error('This browser does not support Web Audio. Try a current desktop browser.');
    this.ctx=new AC(); const c=this.ctx;
    this.master=c.createGain();this.master.gain.value=0;
    this.limiter=c.createDynamicsCompressor();this.limiter.threshold.value=-18;this.limiter.knee.value=18;this.limiter.ratio.value=5;this.limiter.attack.value=.015;this.limiter.release.value=.3;
    this.master.connect(this.limiter).connect(c.destination);
    this.musicGain=c.createGain();this.musicGain.connect(this.master);
    this.pulseGain=c.createGain();this.pulseGain.connect(this.musicGain);
    this.pulseOsc=c.createOscillator();this.pulseOsc.type='sine';this.pulseDepth=c.createGain();this.pulseOsc.connect(this.pulseDepth).connect(this.pulseGain.gain);this.pulseOsc.start();
    this.synthGain=c.createGain();this.synthGain.gain.value=this.file?0:1;
    this.tone=c.createBiquadFilter();this.tone.type='lowpass';this.tone.Q.value=.3;this.synthGain.connect(this.tone).connect(this.pulseGain);
    // Short, diffuse, stereo reverb: no downloaded audio and no obvious repeat.
    this.reverb=c.createConvolver();const impulse=c.createBuffer(2,c.sampleRate*3,c.sampleRate);
    for(let ch=0;ch<2;ch++){const data=impulse.getChannelData(ch);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,3)*.35;}
    this.reverb.buffer=impulse;this.wet=c.createGain();this.wet.gain.value=.36;this.synthGain.connect(this.reverb).connect(this.wet).connect(this.pulseGain);
    this.noiseGain=c.createGain();this.noiseGain.connect(this.master);this.noises={};
    ['brown','pink','rain'].forEach(kind=>{
      const length=c.sampleRate*17, buffer=c.createBuffer(2,length,c.sampleRate);
      for(let ch=0;ch<2;ch++){
        const data=buffer.getChannelData(ch);let last=0,b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
        for(let i=0;i<length;i++){
          const white=Math.random()*2-1;
          if(kind==='brown'){last=(last+.02*white)/1.02;data[i]=last*3.5;}
          else{b0=.99886*b0+white*.0555179;b1=.99332*b1+white*.0750759;b2=.969*b2+white*.153852;b3=.8665*b3+white*.3104856;b4=.55*b4+white*.5329522;b5=-.7616*b5-white*.016898;data[i]=(b0+b1+b2+b3+b4+b5+b6+white*.5362)*.11;b6=white*.115926;}
        }
        // Match loop boundaries with a crossfade, avoiding a periodic click.
        const fade=Math.min(4096,Math.floor(length/10));for(let i=0;i<fade;i++){const a=i/fade;data[length-fade+i]=data[length-fade+i]*(1-a)+data[i]*a;}
      }
      const source=c.createBufferSource();source.buffer=buffer;source.loop=true;source.loopStart=4096/c.sampleRate;
      const filter=c.createBiquadFilter();filter.type=kind==='rain'?'highpass':'lowpass';filter.frequency.value=kind==='rain'?600:kind==='brown'?550:5000;
      const gain=c.createGain();gain.gain.value=0;source.connect(filter).connect(gain).connect(this.noiseGain);source.start(0,this.random()*10);this.noises[kind]=gain;
    });
    this.nextNote=c.currentTime+.15;this.apply(this.settings,true);
    if(this.file)this.attachFile();
  }
  smooth(param,value,time=.25){param.setTargetAtTime(value,this.ctx.currentTime,time);}
  apply(settings,immediate=false){
    this.settings={...this.settings,...settings};if(!this.ctx)return;const s=this.settings;
    this.smooth(this.musicGain.gain,s.music/100*.65);
    this.smooth(this.noiseGain.gain,s.texture/100*.33);
    const depth=s.pulse/100;this.smooth(this.pulseGain.gain,1-depth/2);this.smooth(this.pulseDepth.gain,depth/2);this.smooth(this.pulseOsc.frequency,s.rate,.3);
    this.smooth(this.tone.frequency,s.preset==='reading'?950:s.preset==='work'?1900:1400,1);
    this.smooth(this.master.gain,this.active?s.volume/100*.65:0);
    Object.entries(this.noises).forEach(([kind,node])=>this.smooth(node.gain,kind===s.textureType?1:0,.5));
  }
  note(freq,start,duration,gain,pan=0,type='sine'){
    const c=this.ctx,o=c.createOscillator(),g=c.createGain(),p=c.createStereoPanner();o.type=type;o.frequency.value=freq;
    g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(gain,start+Math.min(1.8,duration*.2));g.gain.exponentialRampToValueAtTime(.0001,start+duration);p.pan.value=pan;
    o.connect(g).connect(p).connect(this.synthGain);o.start(start);o.stop(start+duration+.05);
    const voice={o,g,p};this.voices.push(voice);o.onended=()=>{o.disconnect();g.disconnect();p.disconnect();this.voices=this.voices.filter(v=>v!==voice);};
  }
  schedule(){
    if(!this.ctx||!this.active)return;
    if(this.nextNote<this.ctx.currentTime)this.nextNote=this.ctx.currentTime+.1;
    const chords=[[48,55,59,62],[45,52,55,59],[41,48,52,55],[43,50,55,57]];
    const midi=n=>440*Math.pow(2,(n-69)/12);
    while(this.nextNote<this.ctx.currentTime+35){
      const s=this.settings,chord=chords[Math.floor(this.step/4)%chords.length],t=this.nextNote;
      if(this.step%4===0){chord.forEach((n,i)=>{this.note(midi(n),t+i*.09,21,.042,(i-1.5)*.25,'sine');this.note(midi(n)*1.002,t+.1+i*.1,20,.014,-(i-1.5)*.2,'triangle');});}
      if(s.preset!=='reading'||this.step%2===0){const n=chord[Math.floor(this.random()*chord.length)]+12;this.note(midi(n),t+.5,5.5,.045,this.random()*.8-.4,'sine');}
      if(s.preset==='work'){this.note(midi(chord[0]-12),t+.03,1.7,.07,0,'sine');this.note(midi(chord[2]+12),t+2.5,2.5,.023,.25,'triangle');}
      this.step++;this.nextNote+=s.preset==='work'?4:5;
    }
  }
  async play(){
    ++this.playbackRequest;this.init();await this.ctx.resume();this.holdMasterGain();
    if(this.file){try{await this.file.play();}catch(e){throw new Error('That file could not play. Choose a supported MP3, WAV, or M4A file.');}}
    this.active=true;this.apply(this.settings);this.schedule();
    if(!this.scheduler)this.scheduler=setInterval(()=>this.schedule(),1000);
  }
  holdMasterGain(){
    const gain=this.master.gain,now=this.ctx.currentTime;
    if(typeof gain.cancelAndHoldAtTime==='function')gain.cancelAndHoldAtTime(now);
    else{const current=gain.value;gain.cancelScheduledValues(now);gain.setValueAtTime(current,now);}
  }
  async pause(){
    const request=++this.playbackRequest;this.active=false;if(!this.ctx)return;
    this.holdMasterGain();this.master.gain.linearRampToValueAtTime(0,this.ctx.currentTime+1.5);
    // Keep the MP3 running through the fade, then freeze its playback position.
    await new Promise(resolve=>setTimeout(resolve,1550));
    if(request!==this.playbackRequest||this.active)return;
    if(this.file)this.file.pause();await this.ctx.suspend();
  }
  async setFile(file,{loop=true,onEnded=null,autoplay=true}={}){
    const request=++this.fileRequest;
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw new Error('Web Audio is unavailable in this browser.');
    const url=URL.createObjectURL(file),candidate=new Audio();candidate.loop=loop;candidate.preload='metadata';candidate.src=url;
    try{await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('Audio load timed out.')),15000);candidate.addEventListener('loadedmetadata',()=>{clearTimeout(timeout);resolve();},{once:true});candidate.addEventListener('error',error=>{clearTimeout(timeout);reject(error);},{once:true});});}catch(e){URL.revokeObjectURL(url);throw new Error('This file could not be read. Try an MP3, WAV, or M4A audio file.');}
    if(request!==this.fileRequest){candidate.removeAttribute('src');candidate.load();URL.revokeObjectURL(url);return false;}
    this.clearFile(false);this.file=candidate;this.fileUrl=url;candidate.onended=onEnded;if(!autoplay){this.active=false;if(this.ctx)this.smooth(this.master.gain,0,.08);}if(this.ctx){this.attachFile();this.smooth(this.synthGain.gain,0,.2);}
    if(this.active)await this.file.play();return true;
  }
  attachFile(){this.fileSource=this.ctx.createMediaElementSource(this.file);this.fileSource.connect(this.pulseGain);}
  clearFile(cancelPending=true){++this.playbackRequest;if(cancelPending)this.fileRequest++;if(this.file){this.file.onended=null;this.file.pause();this.file.removeAttribute('src');this.file.load();this.file=null;}if(this.fileSource){this.fileSource.disconnect();this.fileSource=null;}if(this.fileUrl){URL.revokeObjectURL(this.fileUrl);this.fileUrl=null;}if(this.ctx)this.smooth(this.synthGain.gain,1,.5);}
  variation(){this.seed=Math.floor(Math.random()*100000);if(!this.ctx)return;this.voices.forEach(v=>{this.smooth(v.g.gain,.0001,.3);try{v.o.stop(this.ctx.currentTime+2);}catch{}});this.nextNote=this.ctx.currentTime+.1;this.step=Math.floor(this.random()*4)*4;if(this.active)this.schedule();}
}
