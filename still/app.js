'use strict';
const $=id=>document.getElementById(id);
const engine=new FocusAudio();
const presets={study:{title:'Quiet Current',description:'Warm keys drifting through a soft, textured haze.',category:'01',music:65,texture:30,pulse:12,rate:16,textureType:'brown'},work:{title:'Forward Motion',description:'A steady undercurrent for the things that need your attention.',category:'02',music:75,texture:20,pulse:25,rate:16,textureType:'rain'},reading:{title:'Open Pages',description:'Soft, spacious tones with room for every word.',category:'03',music:40,texture:40,pulse:0,rate:12,textureType:'pink'}};
let settings={preset:'study',music:65,texture:30,pulse:12,rate:16,textureType:'brown',volume:45,minutes:25,timerMode:'pomodoro',theme:'amber'};
let history=[];
try{const saved=JSON.parse(localStorage.getItem('still-settings')||'null');if(saved&&typeof saved==='object'){
for(const k of ['music','texture','volume'])if(Number.isFinite(saved[k]))settings[k]=Math.max(0,Math.min(100,saved[k]));
if(Number.isFinite(saved.pulse))settings.pulse=Math.max(0,Math.min(50,saved.pulse));
if([8,12,16,20].includes(saved.rate))settings.rate=saved.rate;
if([0,25,50,90].includes(saved.minutes))settings.minutes=saved.minutes;
if(['pomodoro','single'].includes(saved.timerMode))settings.timerMode=saved.timerMode;
if(['amber','clay','rose'].includes(saved.theme))settings.theme=saved.theme;
if(presets[saved.preset])settings.preset=saved.preset;
if(['brown','pink','rain'].includes(saved.textureType))settings.textureType=saved.textureType;
}const h=JSON.parse(localStorage.getItem('still-history')||'[]');if(Array.isArray(h))history=h;}catch{}
const session=new PomodoroSession(settings.minutes,settings.timerMode==='pomodoro');
let busy=false,variation=1,uploadName='',toastTimeout,reportedFocus=0,lastPhase='focus';
let soundQueue=Promise.resolve();
const save=()=>{try{localStorage.setItem('still-settings',JSON.stringify(settings));}catch{$('savedStatus').textContent='Settings could not be saved in this browser';}};
function toast(s){$('status').textContent=s;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('status').textContent='',6500);}
function syncSound(){
  soundQueue=soundQueue.catch(()=>{}).then(async()=>{
    const shouldPlay=session.running&&session.snapshot().phase==='focus';
    if(shouldPlay&&!engine.active)await engine.play();
    else if(!shouldPlay&&engine.active)await engine.pause();
  });return soundQueue;
}
function setBusy(value){busy=value;$('playBtn').disabled=value;$('timerPlayBtn').disabled=value;}
function handleAudioError(error){session.pause();render();toast(error.message||'Audio could not resume. Press Resume to try again.');}

function applyTheme(){document.documentElement.dataset.theme=settings.theme;$('theme').value=settings.theme;}
function setSelected(selector,attribute,value){document.querySelectorAll(selector).forEach(b=>{const selected=b.dataset[attribute]===String(value);b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});}
function render(){
const p=presets[settings.preset];$('crumb').textContent=settings.preset==='work'?'DEEP WORK':settings.preset.toUpperCase();$('mixTag').textContent=(settings.preset==='work'?'WORK':settings.preset.toUpperCase())+' MIX';
$('trackTitle').textContent=uploadName?'Your own soundtrack':p.title;$('trackDesc').textContent=uploadName||p.description;$('trackCategory').textContent=uploadName?'PERSONAL AUDIO · ON REPEAT':`GENERATIVE SOUNDSCAPE · ${p.category}`;
$('fileLabel').textContent=uploadName||'Bring a track of your own.';$('removeFile').hidden=!uploadName;$('fileLabel').title=uploadName;
for(const name of ['music','texture','pulse','volume']){const el=$(name);el.value=settings[name];el.style.setProperty('--fill',settings[name]/Number(el.max)*100+'%');$(name+'Value').textContent=name==='pulse'?(settings.pulse===0?'Off':`${settings.pulse<20?'Subtle':'Present'} · ${settings.pulse}%`):settings[name]+'%';}
$('rate').value=settings.rate;$('rate').disabled=settings.pulse===0;
$('textureDesc').textContent={brown:'A low, soft rumble to soften the world outside.',pink:'A balanced, airy wash with a little more detail.',rain:'A synthesized rain-like hiss, soft and even.'}[settings.textureType];
document.querySelectorAll('[data-preset]').forEach(b=>{const active=b.dataset.preset===settings.preset;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});setSelected('[data-texture]','texture',settings.textureType);setSelected('[data-minutes]','minutes',settings.minutes);setSelected('[data-timer-mode]','timerMode',settings.timerMode);
document.querySelectorAll('[data-minutes]').forEach(b=>{const n=Number(b.dataset.minutes);b.textContent=n===0?'∞':settings.timerMode==='pomodoro'?`${n} / ${{25:5,50:10,90:15}[n]}`:`${n} min`;b.setAttribute('aria-label',n===0?'Unlimited session':settings.timerMode==='pomodoro'?`${n} minutes focus, ${{25:5,50:10,90:15}[n]} minutes break`:`${n} minute single session`);});
const phase=session.snapshot().phase;
$('playText').textContent=session.running?(phase==='break'?'Pause break':'Pause session'):session.status==='paused'?(phase==='break'?'Resume break':'Resume session'):session.status==='complete'?'Start again':'Begin session';
$('playIcon').innerHTML=session.running?'<path d="M3 2h4v16H3zm8 0h4v16h-4z" fill="currentColor"/>':'<path d="M3 1L17 10 3 19Z" fill="currentColor"/>';
document.body.classList.toggle('playing',session.running&&phase==='focus');document.body.classList.toggle('on-break',phase==='break');
$('soundLabel').textContent=session.status==='complete'?'A LITTLE TIME, WELL SPENT.':phase==='break'?'TAKE A BREATH. YOUR NEXT ROUND WILL START AUTOMATICALLY.':session.running?'A LITTLE LESS NOISE. A LITTLE MORE FOCUS.':session.status==='paused'?'TAKE YOUR TIME. YOUR SPACE IS HERE.':'READY WHEN YOU ARE';
$('audioStatus').textContent=`Audio engine ${engine.ctx?engine.ctx.state:'idle'}${engine.ctx?' · '+engine.ctx.sampleRate.toLocaleString()+' Hz sample rate':''}`;renderTimer();
}
function renderTimer(){
 const snap=session.snapshot(),unlimited=settings.minutes===0,ms=unlimited?snap.totalMs:snap.remainingMs;
 const seconds=unlimited?Math.floor(ms/1000):Math.ceil(ms/1000);
 $('timer').textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
 $('timerState').textContent=session.status==='complete'?'SESSION COMPLETE':`${unlimited?'OPEN ENDED':settings.timerMode==='single'?'SINGLE SESSION':snap.phase.toUpperCase()+' · ROUND '+snap.cycle}${session.status==='paused'?' · PAUSED':''}`;
 $('progress').style.width=(snap.durationMs?Math.min(100,snap.elapsedMs/snap.durationMs*100):0)+'%';
 $('sessionTitle').textContent=snap.phase==='break'?'A moment to recharge':settings.timerMode==='pomodoro'?'Pomodoro timer':'Focus timer';
 $('sessionPanel').setAttribute('aria-label',settings.timerMode==='pomodoro'?'Pomodoro timer':'Focus timer');
 $('timerHint').textContent=unlimited?'No countdown. Stay as long as you like.':settings.timerMode==='single'?`${settings.minutes} min focus · stops when finished`:`${settings.minutes} min focus · ${session.breakMinutes} min break · repeats automatically`;
 $('timerPlayLabel').textContent=session.running?'Pause':session.status==='paused'?'Resume':session.status==='complete'?'Again':'Start';
 $('timerPlayBtn').setAttribute('aria-label',`${session.running?'Pause':session.status==='paused'?'Resume':'Start'} ${snap.phase} timer`);
 $('skipBreakBtn').hidden=snap.phase!=='break';
}
async function toggle(){
 if(busy)return;setBusy(true);
 try{if(session.running)session.pause();else{if(session.status==='complete')reportedFocus=0;session.start();}render();await syncSound();}
 catch(error){handleAudioError(error);await engine.pause();}
 finally{setBusy(false);render();}
}
async function resetSession(){
 if(busy)return;session.reset(settings.minutes);reportedFocus=0;lastPhase='focus';render();
 try{await syncSound();}catch(error){handleAudioError(error);}
 toast(session.running?'New focus round started.':'Timer reset. Ready when you are.');
}
$('playBtn').addEventListener('click',toggle);$('timerPlayBtn').addEventListener('click',toggle);
$('resetBtn').addEventListener('click',resetSession);$('timerResetBtn').addEventListener('click',resetSession);
$('skipBreakBtn').addEventListener('click',async()=>{if(busy)return;session.skipBreak();lastPhase='focus';render();try{await syncSound();}catch(error){handleAudioError(error);}});
$('newBtn').addEventListener('click',()=>{if(uploadName){toast('Remove your audio file to return to generative soundscapes.');return;}variation++;engine.variation();toast(`Fresh variation ${variation}. Same space, a slightly different sound.`);});
for(const name of ['music','texture','pulse','volume'])$(name).addEventListener('input',e=>{settings[name]=Number(e.target.value);engine.apply(settings);save();render();});
$('rate').addEventListener('change',e=>{settings.rate=Number(e.target.value);engine.apply(settings);save();render();});
document.querySelectorAll('[data-texture]').forEach(b=>b.addEventListener('click',()=>{settings.textureType=b.dataset.texture;engine.apply(settings);save();render();}));
document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{if(settings.preset===b.dataset.preset)return;settings={...settings,...presets[b.dataset.preset],preset:b.dataset.preset};engine.apply(settings);engine.variation();variation=1;save();render();}));
document.querySelectorAll('[data-minutes]').forEach(b=>b.addEventListener('click',async()=>{if(busy)return;settings.minutes=Number(b.dataset.minutes);session.reset(settings.minutes);reportedFocus=0;lastPhase='focus';save();render();try{await syncSound();}catch(error){handleAudioError(error);}if(session.running)toast(settings.timerMode==='pomodoro'?'New focus/break cycle started.':'New single session started.');}));
document.querySelectorAll('[data-timer-mode]').forEach(b=>b.addEventListener('click',async()=>{
 if(busy||settings.timerMode===b.dataset.timerMode)return;
 settings.timerMode=b.dataset.timerMode;session.setMode(settings.timerMode==='pomodoro');reportedFocus=0;lastPhase='focus';save();render();
 try{await syncSound();}catch(error){handleAudioError(error);}
 toast(settings.timerMode==='pomodoro'?'Pomodoro mode. Focus and break cycles repeat automatically.':'Single session mode. Audio stops when the timer ends.');
}));
$('theme').addEventListener('change',e=>{settings.theme=e.target.value;applyTheme();save();});
$('uploadBtn').addEventListener('click',()=>$('fileInput').click());
$('fileInput').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;$('uploadBtn').disabled=true;toast('Opening your audio…');try{await engine.setFile(file);uploadName=file.name;render();toast('Your track is ready. It will loop through your session.');}catch(error){if(!engine.file)uploadName='';toast(error.message||'Unable to play that audio file.');render();}finally{$('uploadBtn').disabled=false;e.target.value='';}});
$('removeFile').addEventListener('click',()=>{engine.clearFile();uploadName='';engine.variation();render();toast('Back to your generative soundscape.');});
$('infoBtn').addEventListener('click',()=>{render();$('about').showModal();});$('closeAbout').addEventListener('click',()=>$('about').close());$('about').addEventListener('click',e=>{if(e.target===$('about')){const r=$('about').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('about').close();}});
async function tick(){
 const snap=session.snapshot();
 if(snap.completedFocus>reportedFocus){
   const cycleMs=(settings.minutes+session.breakMinutes)*60000;
   for(let count=Math.max(reportedFocus+1,snap.completedFocus-99);count<=snap.completedFocus;count++){
     const endedAt=Date.now()-(snap.totalMs-((count-1)*cycleMs+settings.minutes*60000));
     history.push({at:new Date(endedAt).toISOString(),minutes:settings.minutes,preset:settings.preset});
   }
   reportedFocus=snap.completedFocus;history=history.slice(-100);
   try{localStorage.setItem('still-history',JSON.stringify(history));}catch{}
 }
 if(snap.finished&&session.running){
   session.complete();render();toast('Session complete. Take a breath and a short break.');
   try{await syncSound();}catch(error){handleAudioError(error);}
   return;
 }
 if(snap.phase!==lastPhase){
   lastPhase=snap.phase;render();
   toast(snap.phase==='break'?`Focus round complete. Take a ${session.breakMinutes}-minute break.`:'Break complete. Your next focus round has started.');
   try{await syncSound();}catch(error){handleAudioError(error);}
 }else renderTimer();
}
setInterval(tick,250);document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});
// The Media Session API makes keyboard and lock-screen controls usable where supported.
if('mediaSession' in navigator){try{navigator.mediaSession.metadata=new MediaMetadata({title:'Still — Focus Studio',artist:'Your personal soundscape'});navigator.mediaSession.setActionHandler('play',()=>{if(!session.running)toggle();});navigator.mediaSession.setActionHandler('pause',()=>{if(session.running)toggle();});}catch{}}
const canvas=$('waves'),ctx=canvas.getContext('2d');let frame=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function draw(){const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);if(canvas.width!==w*dpr||canvas.height!==h*dpr){canvas.width=w*dpr;canvas.height=h*dpr;}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);if(session.running&&session.snapshot().phase==='focus')frame+=.012;for(let j=0;j<3;j++){ctx.beginPath();ctx.strokeStyle=`rgba(200,145,105,${.11-j*.025})`;ctx.lineWidth=.7;for(let x=0;x<w;x++){const envelope=Math.sin(x/w*Math.PI);const y=h*.53+Math.sin(x*.024+frame+j*.6)*envelope*(13+j*9);x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}if(!reduced)requestAnimationFrame(draw);}applyTheme();draw();engine.apply(settings);render();
