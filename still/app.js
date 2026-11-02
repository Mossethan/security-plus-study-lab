'use strict';
const $=id=>document.getElementById(id);
const engine=new FocusAudio();
const presets={study:{title:'Quiet Current',description:'Warm keys drifting through a soft, textured haze.',category:'01',music:65,texture:30,pulse:12,rate:16,textureType:'brown'},work:{title:'Forward Motion',description:'A steady undercurrent for the things that need your attention.',category:'02',music:75,texture:20,pulse:25,rate:16,textureType:'rain'},reading:{title:'Open Pages',description:'Soft, spacious tones with room for every word.',category:'03',music:40,texture:40,pulse:0,rate:12,textureType:'pink'}};
let settings={preset:'study',music:65,texture:30,pulse:12,rate:16,textureType:'brown',volume:45,minutes:25};
let history=[];
try{const saved=JSON.parse(localStorage.getItem('still-settings')||'null');if(saved&&typeof saved==='object'){
for(const k of ['music','texture','volume'])if(Number.isFinite(saved[k]))settings[k]=Math.max(0,Math.min(100,saved[k]));
if(Number.isFinite(saved.pulse))settings.pulse=Math.max(0,Math.min(50,saved.pulse));
if([8,12,16,20].includes(saved.rate))settings.rate=saved.rate;
if([0,25,50,90].includes(saved.minutes))settings.minutes=saved.minutes;
if(presets[saved.preset])settings.preset=saved.preset;
if(['brown','pink','rain'].includes(saved.textureType))settings.textureType=saved.textureType;
}const h=JSON.parse(localStorage.getItem('still-history')||'[]');if(Array.isArray(h))history=h;}catch{}
let completed=false;
let running=false,elapsed=0,startedAt=0,busy=false,variation=1,uploadName='',toastTimeout;
const save=()=>{try{localStorage.setItem('still-settings',JSON.stringify(settings));}catch{$('savedStatus').textContent='Settings could not be saved in this browser';}};
function toast(s){$('status').textContent=s;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('status').textContent='',6500);}
function currentElapsed(now=Date.now()){return elapsed+(running?Math.max(0,now-startedAt):0);}
function setSelected(selector,attribute,value){document.querySelectorAll(selector).forEach(b=>{const selected=b.dataset[attribute]===String(value);b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});}
function render(){
const p=presets[settings.preset];$('crumb').textContent=settings.preset==='work'?'DEEP WORK':settings.preset.toUpperCase();$('mixTag').textContent=(settings.preset==='work'?'WORK':settings.preset.toUpperCase())+' MIX';
$('trackTitle').textContent=uploadName?'Your own soundtrack':p.title;$('trackDesc').textContent=uploadName||p.description;$('trackCategory').textContent=uploadName?'PERSONAL AUDIO · ON REPEAT':`GENERATIVE SOUNDSCAPE · ${p.category}`;
$('fileLabel').textContent=uploadName||'Bring a track of your own.';$('removeFile').hidden=!uploadName;$('fileLabel').title=uploadName;
for(const name of ['music','texture','pulse','volume']){const el=$(name);el.value=settings[name];el.style.setProperty('--fill',settings[name]/Number(el.max)*100+'%');$(name+'Value').textContent=name==='pulse'?(settings.pulse===0?'Off':`${settings.pulse<20?'Subtle':'Present'} · ${settings.pulse}%`):settings[name]+'%';}
$('rate').value=settings.rate;$('rate').disabled=settings.pulse===0;
$('textureDesc').textContent={brown:'A low, soft rumble to soften the world outside.',pink:'A balanced, airy wash with a little more detail.',rain:'A synthesized rain-like hiss, soft and even.'}[settings.textureType];
document.querySelectorAll('[data-preset]').forEach(b=>{const active=b.dataset.preset===settings.preset;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});setSelected('[data-texture]','texture',settings.textureType);setSelected('[data-minutes]','minutes',settings.minutes);
$('playText').textContent=running?'Pause session':currentElapsed()>0?'Resume session':'Begin session';$('playIcon').innerHTML=running?'<path d="M3 2h4v16H3zm8 0h4v16h-4z" fill="currentColor"/>':'<path d="M3 1L17 10 3 19Z" fill="currentColor"/>';
document.body.classList.toggle('playing',running);$('soundLabel').textContent=running?'A LITTLE LESS NOISE. A LITTLE MORE FOCUS.':elapsed>0?'TAKE YOUR TIME. YOUR SPACE IS HERE.':'READY WHEN YOU ARE';
$('audioStatus').textContent=`Audio engine ${engine.ctx?engine.ctx.state:'idle'}${engine.ctx?' · '+engine.ctx.sampleRate.toLocaleString()+' Hz sample rate':''}`;renderTimer();
}
function renderTimer(){if(completed){$('timer').textContent='00:00';$('timerState').textContent='SESSION COMPLETE';$('progress').style.width='100%';return;}const ms=currentElapsed(),target=settings.minutes*60000,remaining=target?Math.max(0,target-ms):ms,total=Math.floor(remaining/1000),minutes=Math.floor(total/60);$('timer').textContent=`${String(minutes).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`;$('timerState').textContent=running?(target?'IN YOUR OWN FLOW':'OPEN ENDED'):elapsed>0?'PAUSED':'READY TO FOCUS';$('progress').style.width=(target?Math.min(100,ms/target*100):0)+'%';$('timerHint').textContent=settings.minutes===0?'No countdown. Stay as long as you like.':'Set aside a little time for yourself.';}
async function toggle(){if(busy)return;busy=true;$('playBtn').disabled=true;try{if(running){elapsed=currentElapsed();running=false;render();await engine.pause();}else{await engine.play();completed=false;startedAt=Date.now();running=true;render();}}catch(e){running=false;await engine.pause();toast(e.message||'Audio could not start. Please try again.');render();}finally{busy=false;$('playBtn').disabled=false;}}
$('playBtn').addEventListener('click',toggle);
$('resetBtn').addEventListener('click',async()=>{if(busy)return;const wasRunning=running;completed=false;elapsed=0;startedAt=Date.now();render();toast(wasRunning?'Session timer restarted.':'Session reset. Ready when you are.');});
$('newBtn').addEventListener('click',()=>{if(uploadName){toast('Remove your audio file to return to generative soundscapes.');return;}variation++;engine.variation();toast(`Fresh variation ${variation}. Same space, a slightly different sound.`);});
for(const name of ['music','texture','pulse','volume'])$(name).addEventListener('input',e=>{settings[name]=Number(e.target.value);engine.apply(settings);save();render();});
$('rate').addEventListener('change',e=>{settings.rate=Number(e.target.value);engine.apply(settings);save();render();});
document.querySelectorAll('[data-texture]').forEach(b=>b.addEventListener('click',()=>{settings.textureType=b.dataset.texture;engine.apply(settings);save();render();}));
document.querySelectorAll('[data-preset]').forEach(b=>b.addEventListener('click',()=>{if(settings.preset===b.dataset.preset)return;settings={...settings,...presets[b.dataset.preset],preset:b.dataset.preset};engine.apply(settings);engine.variation();variation=1;save();render();}));
document.querySelectorAll('[data-minutes]').forEach(b=>b.addEventListener('click',()=>{settings.minutes=Number(b.dataset.minutes);completed=false;elapsed=0;startedAt=Date.now();save();render();if(running)toast('New session length set. Timer restarted.');}));
$('uploadBtn').addEventListener('click',()=>$('fileInput').click());
$('fileInput').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;$('uploadBtn').disabled=true;toast('Opening your audio…');try{await engine.setFile(file);uploadName=file.name;render();toast('Your track is ready. It will loop through your session.');}catch(error){if(!engine.file)uploadName='';toast(error.message||'Unable to play that audio file.');render();}finally{$('uploadBtn').disabled=false;e.target.value='';}});
$('removeFile').addEventListener('click',()=>{engine.clearFile();uploadName='';engine.variation();render();toast('Back to your generative soundscape.');});
$('infoBtn').addEventListener('click',()=>{render();$('about').showModal();});$('closeAbout').addEventListener('click',()=>$('about').close());$('about').addEventListener('click',e=>{if(e.target===$('about')){const r=$('about').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('about').close();}});
async function tick(){renderTimer();if(running&&settings.minutes>0&&currentElapsed()>=settings.minutes*60000){running=false;completed=true;elapsed=0;history.push({at:new Date().toISOString(),minutes:settings.minutes,preset:settings.preset});history=history.slice(-100);try{localStorage.setItem('still-history',JSON.stringify(history));}catch{}render();$('timer').textContent='00:00';$('timerState').textContent='SESSION COMPLETE';$('progress').style.width='100%';$('soundLabel').textContent='A LITTLE TIME, WELL SPENT.';toast(`${settings.minutes} minutes complete. Take a breath and a short break.`);await engine.pause();}}
setInterval(tick,250);document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick();});
// The Media Session API makes keyboard and lock-screen controls usable where supported.
if('mediaSession' in navigator){try{navigator.mediaSession.metadata=new MediaMetadata({title:'Still — Focus Studio',artist:'Your personal soundscape'});navigator.mediaSession.setActionHandler('play',()=>{if(!running)toggle();});navigator.mediaSession.setActionHandler('pause',()=>{if(running)toggle();});}catch{}}
const canvas=$('waves'),ctx=canvas.getContext('2d');let frame=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function draw(){const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);if(canvas.width!==w*dpr||canvas.height!==h*dpr){canvas.width=w*dpr;canvas.height=h*dpr;}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);if(running)frame+=.012;for(let j=0;j<3;j++){ctx.beginPath();ctx.strokeStyle=`rgba(171,189,130,${.11-j*.025})`;ctx.lineWidth=.7;for(let x=0;x<w;x++){const envelope=Math.sin(x/w*Math.PI);const y=h*.53+Math.sin(x*.024+frame+j*.6)*envelope*(13+j*9);x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}if(!reduced)requestAnimationFrame(draw);}draw();engine.apply(settings);render();
