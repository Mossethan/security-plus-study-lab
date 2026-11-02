'use strict';
const $=id=>document.getElementById(id);
const engine=new FocusAudio();
const presets={study:{title:'Quiet Current',description:'Warm keys drifting through a soft, textured haze.',category:'01',music:65,texture:30,pulse:12,rate:16,textureType:'brown'},work:{title:'Forward Motion',description:'A steady undercurrent for the things that need your attention.',category:'02',music:75,texture:20,pulse:25,rate:16,textureType:'rain'},reading:{title:'Open Pages',description:'Soft, spacious tones with room for every word.',category:'03',music:40,texture:40,pulse:0,rate:12,textureType:'pink'}};
let settings={preset:'study',music:65,texture:30,pulse:12,rate:16,textureType:'brown',volume:45,minutes:25,timerMode:'pomodoro',theme:'amber',shuffle:false,genres:[],effects:[]};
let history=[];
try{const saved=JSON.parse(localStorage.getItem('still-settings')||'null');if(saved&&typeof saved==='object'){
for(const k of ['music','texture','volume'])if(Number.isFinite(saved[k]))settings[k]=Math.max(0,Math.min(100,saved[k]));
if(Number.isFinite(saved.pulse))settings.pulse=Math.max(0,Math.min(50,saved.pulse));
if([8,12,16,20].includes(saved.rate))settings.rate=saved.rate;
if([0,25,50,90].includes(saved.minutes))settings.minutes=saved.minutes;
if(['pomodoro','single'].includes(saved.timerMode))settings.timerMode=saved.timerMode;
if(['amber','clay','rose'].includes(saved.theme))settings.theme=saved.theme;
if(typeof saved.shuffle==='boolean')settings.shuffle=saved.shuffle;
if(Array.isArray(saved.genres))settings.genres=saved.genres.filter(g=>MUSIC_GENRES.some(x=>x.key===g)||g==='unknown');
if(Array.isArray(saved.effects))settings.effects=saved.effects.filter(e=>MUSIC_EFFECTS.some(x=>x.key===e));
if(presets[saved.preset])settings.preset=saved.preset;
if(['brown','pink','rain'].includes(saved.textureType))settings.textureType=saved.textureType;
}const h=JSON.parse(localStorage.getItem('still-history')||'[]');if(Array.isArray(h))history=h;}catch{}
const library=new MP3Library();library.shuffle=settings.shuffle;library.setFilters(settings.genres,settings.effects);
let loadingTrack=false,importingLibrary=false,draftGenres=[],draftEffects=[];
const previousIcon=$('resetBtn').innerHTML,nextIcon=$('newBtn').innerHTML;
const session=new PomodoroSession(settings.minutes,settings.timerMode==='pomodoro');
let busy=false,variation=1,uploadName='',toastTimeout,reportedFocus=0,lastPhase='focus';
let soundQueue=Promise.resolve();
const save=()=>{try{localStorage.setItem('still-settings',JSON.stringify(settings));}catch{$('savedStatus').textContent='Settings could not be saved in this browser';}};
function toast(s){$('status').textContent=s;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('status').textContent='',6500);}
function syncSound(){
  soundQueue=soundQueue.catch(()=>{}).then(async()=>{
    const shouldPlay=session.running&&session.snapshot().phase==='focus';
    if(shouldPlay&&!engine.active)await engine.play();
    else if(!shouldPlay&&(engine.active||engine.ctx?.state==='running'))await engine.pause();
  });return soundQueue;
}
function noMatchingTracks(){return library.allTracks.length>0&&library.tracks.length===0;}
function setBusy(value){busy=value;$('playBtn').disabled=value||noMatchingTracks();$('timerPlayBtn').disabled=value||noMatchingTracks();}
function handleAudioError(error){session.pause();render();toast(error.message||'Audio could not resume. Press Resume to try again.');}

function applyTheme(){document.documentElement.dataset.theme=settings.theme;$('theme').value=settings.theme;}
function setSelected(selector,attribute,value){document.querySelectorAll(selector).forEach(b=>{const selected=b.dataset[attribute]===String(value);b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});}
function render(){
const p=presets[settings.preset];$('crumb').textContent=settings.preset==='work'?'DEEP WORK':settings.preset.toUpperCase();$('mixTag').textContent=(settings.preset==='work'?'WORK':settings.preset.toUpperCase())+' MIX';
const current=library.current,hasLibrary=library.allTracks.length>0;
$('trackTitle').textContent=noMatchingTracks()?'No matching tracks':current?current.title:uploadName?uploadName.replace(/\.[^.]+$/,''):p.title;$('trackTitle').title=uploadName;
$('trackDesc').textContent=noMatchingTracks()?'Open Browse & filters to choose another combination.':current?`${current.genres.map(genreLabel).join(', ')||'Unlabeled genre'} · ${effectLabel(current.effect)}${current.bpm?' · '+current.bpm+' BPM':''} · ${library.index+1}/${library.tracks.length}`:uploadName||p.description;
$('trackCategory').textContent=hasLibrary?'YOUR FILTERED MP3 LIBRARY':uploadName?'PERSONAL AUDIO · ON REPEAT':`GENERATIVE SOUNDSCAPE · ${p.category}`;
$('fileLabel').textContent=uploadName||'Bring a track of your own.';$('removeFile').hidden=!uploadName;$('fileLabel').title=uploadName;renderLibraryControls();
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
 if(busy)return;if(noMatchingTracks()){toast('No tracks match these filters. Open Browse & filters to change them.');return;}setBusy(true);
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
$('resetBtn').addEventListener('click',()=>library.current?changeTrack(-1):resetSession());$('timerResetBtn').addEventListener('click',resetSession);
$('skipBreakBtn').addEventListener('click',async()=>{if(busy)return;session.skipBreak();lastPhase='focus';render();try{await syncSound();}catch(error){handleAudioError(error);}});
$('newBtn').addEventListener('click',()=>{if(library.current){changeTrack(1);return;}if(uploadName){toast('Remove your audio file to return to generative soundscapes.');return;}variation++;engine.variation();toast(`Fresh variation ${variation}. Same space, a slightly different sound.`);});
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
$('fileInput').addEventListener('change',async e=>{const files=Array.from(e.target.files||[]);if(files.length>1){e.target.value='';await importMp3Folder(files);return;}const file=files[0];if(!file)return;$('uploadBtn').disabled=true;toast('Opening your audio…');try{const ready=await engine.setFile(file);if(!ready)return;library.clear();uploadName=file.name;bindTrackEvents();render();toast('Your track is ready. It will loop through your session.');}catch(error){if(!engine.file)uploadName='';toast(error.message||'Unable to play that audio file.');render();}finally{$('uploadBtn').disabled=false;e.target.value='';}});
$('removeFile').addEventListener('click',()=>{library.clear();engine.clearFile();uploadName='';engine.variation();render();toast('Back to your generative soundscape.');});
$('infoBtn').addEventListener('click',()=>{render();$('about').showModal();});$('closeAbout').addEventListener('click',()=>$('about').close());$('about').addEventListener('click',e=>{if(e.target===$('about')){const r=$('about').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('about').close();}});

function audioTime(seconds){if(!Number.isFinite(seconds)||seconds<0)return '0:00';return `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;}
function updateTrackPosition(){
 const file=engine.file,duration=file?.duration||0,current=file?.currentTime||0;
 $('trackTime').textContent=audioTime(current);$('trackDuration').textContent=audioTime(duration);
 $('trackSeek').value=duration>0?Math.floor(current/duration*1000):0;$('trackSeek').disabled=!Number.isFinite(duration)||duration<=0;
 $('trackSeek').style.setProperty('--fill',duration>0?Math.min(100,current/duration*100)+'%':'0%');
}
function bindTrackEvents(){if(!engine.file)return;engine.file.addEventListener('timeupdate',updateTrackPosition);engine.file.addEventListener('durationchange',updateTrackPosition);updateTrackPosition();}
function genreLabel(key){return MUSIC_GENRES.find(g=>g.key===key)?.label||'Unlabeled';}
function effectLabel(key){return key==='unknown'?'Unlabeled effect':(MUSIC_EFFECTS.find(e=>e.key===key)?.label||'Unlabeled')+' effect';}
function renderLibraryControls(){
 const hasLibrary=library.allTracks.length>0;document.body.classList.toggle('has-library',Boolean(uploadName)||hasLibrary);
 $('libraryBtn').hidden=!hasLibrary;$('trackPosition').hidden=!uploadName||noMatchingTracks();$('removeFile').hidden=!uploadName&&!hasLibrary;
 $('localNote').textContent=hasLibrary?`${library.tracks.length} of ${library.allTracks.length} tracks match your filters`:'Your audio stays on this device.';
 $('fileLabel').textContent=noMatchingTracks()?'No tracks match your filters':uploadName||'Bring a track of your own.';
 $('resetBtn').setAttribute('aria-label',hasLibrary?'Previous track':'Reset session');$('resetBtn').title=hasLibrary?'Previous track':'Reset session';
 $('newBtn').setAttribute('aria-label',hasLibrary?'Next track':'Create a new sound variation');$('newBtn').title=hasLibrary?'Next track':'New variation';
 $('resetBtn').innerHTML=hasLibrary?'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h2v14H6zm12 0v14L9 12z"/></svg>':previousIcon;
 $('newBtn').innerHTML=hasLibrary?'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 5h2v14h-2zM6 5l9 7-9 7z"/></svg>':nextIcon;
 $('resetBtn').disabled=noMatchingTracks();$('newBtn').disabled=noMatchingTracks();$('playBtn').disabled=busy||noMatchingTracks();$('timerPlayBtn').disabled=busy||noMatchingTracks();
}
async function selectLibraryTrack(index,start=false){
 if(loadingTrack)return;const track=library.tracks[index];if(!track)return;loadingTrack=true;
 try{
   const ready=await engine.setFile(track.file,{loop:false,autoplay:false,onEnded:()=>changeTrack(1)});if(!ready)return;
   library.select(index);uploadName=track.file.name;bindTrackEvents();
   if(start&&session.snapshot().phase!=='break'){if(session.status==='complete')reportedFocus=0;session.start();}
   render();await syncSound();
 }catch(error){handleAudioError(error);await engine.pause();toast('This track could not play. Choose another track from your library.');}
 finally{loadingTrack=false;}
}
async function changeTrack(direction=1){if(library.current)await selectLibraryTrack(library.neighbor(direction));}
function renderFilterButtons(id,options,selected,onToggle){
 const box=$(id);box.replaceChildren();
 const choices=[{key:'all',label:'All'},...options];
 choices.forEach(({key,label})=>{
  const button=document.createElement('button');button.type='button';button.textContent=label;button.className='filter-chip';
  const active=key==='all'?selected.length===0:selected.includes(key);button.classList.toggle('selected',active);button.setAttribute('aria-pressed',String(active));
  button.addEventListener('click',()=>onToggle(key));box.append(button);
 });
}
function toggleDraft(group,key){
 let values=group==='genres'?draftGenres:draftEffects;
 values=key==='all'?[]:values.includes(key)?values.filter(x=>x!==key):[...values,key];
 if(group==='genres')draftGenres=values;else draftEffects=values;renderLibraryDialog();
}
function renderLibraryDialog(){
 $('libraryRows').replaceChildren();$('shuffle').checked=settings.shuffle;
 const matches=filterMp3Tracks(library.allTracks,draftGenres,draftEffects);
 $('libraryStatus').textContent=library.allTracks.length?`${library.allTracks.length} MP3s loaded · ${matches.length} match this combination`:'Choose a folder, or use + to select MP3 files.';
 $('filterPreview').textContent=`${matches.length} matching ${matches.length===1?'track':'tracks'}`;
 const genreOptions=[...MUSIC_GENRES];if(library.allTracks.some(t=>!t.genres.length)||draftGenres.includes('unknown'))genreOptions.push({key:'unknown',label:'Unlabeled'});
 renderFilterButtons('genreFilters',genreOptions,draftGenres,key=>toggleDraft('genres',key));
 renderFilterButtons('effectFilters',MUSIC_EFFECTS,draftEffects,key=>toggleDraft('effects',key));
 const unknown=library.allTracks.filter(t=>t.effect==='unknown').length;
 $('unlabeledNote').textContent=unknown?`${unknown} ${unknown===1?'track has':'tracks have'} no effect label. They are available under All or Unlabeled; BPM is not used to guess an effect level.`:'Categories come from filenames or folders. No renaming is required for labeled tracks.';
 matches.forEach(track=>{
  const button=document.createElement('button');button.className='library-track';button.setAttribute('aria-label','Play '+track.title);button.setAttribute('aria-current',String(track.file===library.current?.file));
  const title=document.createElement('strong');title.textContent=track.title;
  const labels=document.createElement('small');labels.textContent=`${track.genres.map(genreLabel).join(', ')||'Unlabeled genre'} · ${effectLabel(track.effect)}${track.bpm?' · '+track.bpm+' BPM':''}`;
  const path=document.createElement('small');path.textContent=track.path;button.append(title,labels,path);
  button.addEventListener('click',async()=>{await applyMusicFilters(track.file,true);});$('libraryRows').append(button);
 });
 if(library.allTracks.length&&!matches.length){const p=document.createElement('p');p.className='library-warning';p.textContent='No tracks match this combination. Select All or choose another genre/effect.';$('libraryRows').append(p);}
}
function openLibrary(){draftGenres=[...settings.genres];draftEffects=[...settings.effects];renderLibraryDialog();if(!$('libraryDialog').open)$('libraryDialog').showModal();}
async function applyMusicFilters(targetFile=null,start=false){
 if(loadingTrack)return;const previous=library.current?.file;
 settings.genres=[...draftGenres];settings.effects=[...draftEffects];library.setFilters(settings.genres,settings.effects);save();
 if(!library.tracks.length){session.pause();await engine.pause();engine.clearFile();uploadName='';render();renderLibraryDialog();toast('No matching tracks. Adjust the filters to continue.');return;}
 const next=targetFile?library.tracks.findIndex(t=>t.file===targetFile):library.index;
 if(targetFile||library.current?.file!==previous||!engine.file)await selectLibraryTrack(Math.max(0,next),start);
 else render();
 $('libraryDialog').close();
}
$('folderBtn').addEventListener('click',()=>$('folderInput').click());$('pickLibraryFolder').addEventListener('click',()=>{$('libraryDialog').close();$('folderInput').click();});
$('libraryBtn').addEventListener('click',openLibrary);$('closeLibrary').addEventListener('click',()=>$('libraryDialog').close());
$('applyFilters').addEventListener('click',()=>applyMusicFilters());$('clearFilters').addEventListener('click',()=>{draftGenres=[];draftEffects=[];renderLibraryDialog();});
async function importMp3Folder(files){
 if(!files.length||importingLibrary)return;importingLibrary=true;$('folderBtn').disabled=true;$('uploadBtn').disabled=true;$('pickLibraryFolder').disabled=true;
 try{
  const result=indexMp3Files(files);
  if(!result.tracks.length){toast('No MP3s found. Choose your music folder or MP3 files.');return;}
  library.load(result);library.setShuffle(settings.shuffle);
  if(library.tracks.length){const first=library.index;library.index=-1;await selectLibraryTrack(first);}
  else{session.pause();await engine.pause();engine.clearFile();uploadName='';render();}
  openLibrary();toast(`${library.allTracks.length} MP3s loaded. Choose genres and effect levels to tailor your playlist.`);
 }catch(error){toast(error.message||'The folder could not be loaded.');}
 finally{importingLibrary=false;$('folderBtn').disabled=false;$('uploadBtn').disabled=false;$('pickLibraryFolder').disabled=false;}
}
$('folderInput').addEventListener('change',async event=>{const files=Array.from(event.target.files||[]);event.target.value='';await importMp3Folder(files);});
$('shuffle').addEventListener('change',event=>{settings.shuffle=event.target.checked;library.setShuffle(settings.shuffle);save();});
$('trackSeek').addEventListener('input',event=>{if(engine.file&&Number.isFinite(engine.file.duration)&&engine.file.duration>0){engine.file.currentTime=Number(event.target.value)/1000*engine.file.duration;updateTrackPosition();}});

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
if('mediaSession' in navigator){try{navigator.mediaSession.metadata=new MediaMetadata({title:'Still — Focus Studio',artist:'Your personal soundscape'});navigator.mediaSession.setActionHandler('play',()=>{if(!session.running)toggle();});navigator.mediaSession.setActionHandler('pause',()=>{if(session.running)toggle();});navigator.mediaSession.setActionHandler('nexttrack',()=>changeTrack(1));navigator.mediaSession.setActionHandler('previoustrack',()=>changeTrack(-1));}catch{}}
const canvas=$('waves'),ctx=canvas.getContext('2d');let frame=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function draw(){const w=canvas.clientWidth,h=canvas.clientHeight,dpr=Math.min(devicePixelRatio||1,2);if(canvas.width!==w*dpr||canvas.height!==h*dpr){canvas.width=w*dpr;canvas.height=h*dpr;}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);if(session.running&&session.snapshot().phase==='focus')frame+=.012;for(let j=0;j<3;j++){ctx.beginPath();ctx.strokeStyle=`rgba(200,145,105,${.11-j*.025})`;ctx.lineWidth=.7;for(let x=0;x<w;x++){const envelope=Math.sin(x/w*Math.PI);const y=h*.53+Math.sin(x*.024+frame+j*.6)*envelope*(13+j*9);x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}if(!reduced)requestAnimationFrame(draw);}applyTheme();draw();engine.apply(settings);render();
