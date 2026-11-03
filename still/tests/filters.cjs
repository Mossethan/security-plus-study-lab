const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const storage=new Map(),elements=new Map();let now=0;
const presetButtons=['study','work','reading'].map(preset=>({dataset:{preset},classList:{toggle(){}},setAttribute(){},listeners:{},addEventListener(n,f){this.listeners[n]=f}}));
function node(){return {value:'',max:100,textContent:'',innerHTML:'',hidden:false,disabled:false,open:false,children:[],style:{setProperty(){}},classList:{toggle(){}},listeners:{},setAttribute(){},addEventListener(n,f){this.listeners[n]=f},replaceChildren(){this.children=[]},append(...children){this.children.push(...children)},showModal(){this.open=true},close(){this.open=false},getContext(){return {setTransform(){},clearRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){}}},clientWidth:350,clientHeight:270};}
function element(id){if(!elements.has(id))elements.set(id,node());return elements.get(id);}
class Audio{
 constructor(){this.active=false;this.file=null;this.loads=0;this.plays=0;}
 apply(settings){this.applied={...settings};}variation(){}
 async setFile(file,options={}){this.loads++;this.active=false;this.file={name:file.name,duration:1800,currentTime:0,onended:options.onEnded,addEventListener(){}};return true;}
 clearFile(){this.file=null;this.active=false;}
 async play(){this.active=true;this.plays++;}async pause(){this.active=false;}
}
const context={console,FocusAudio:Audio,document:{documentElement:{dataset:{}},getElementById:element,querySelectorAll:s=>s==='[data-preset]'?presetButtons:[],createElement:node,body:{classList:{toggle(){}}},addEventListener(){}},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},setTimeout:()=>0,clearTimeout(){},setInterval(){},Date:class extends Date{static now(){return now}},navigator:{},matchMedia:()=>({matches:true}),devicePixelRatio:1};
vm.createContext(context);const code=['session.js','library.js','library-store.js','app.js'].map(n=>fs.readFileSync(path.join(__dirname,'..',n),'utf8')).join('\n');vm.runInContext(code,context);
const files=['Causeway_Focus_Deep_Work_LoFi_30_84bpm_MedNEL.mp3','Moon Cycles Deep Work Acoustic Focus Chris 120bpm Session 4.mp3','Organics_Focus_DeepWork_LoFi_30_90bpm_HighNEL.mp3','Sonus_Focus_DeepWork_Piano_30_110bpm_LowNEL.mp3','GentleMornings_Focus_DeepWork_Acoustic_30_83bpm_HighNEL.mp3'].map(name=>({name,size:123,webkitRelativePath:'Music/'+name}));context.files=files;
const run=s=>vm.runInContext(s,context);
(async()=>{
 await run('importMp3Folder(files)');assert.equal(run('library.allTracks.length'),5);assert.equal(element('libraryDialog').open,true);
 for(const name of ['music','texture','pulse']){assert.equal(run(`settings.${name}`),0);assert.equal(run(`engine.applied.${name}`),0);}
 for(const [name,value] of [['music',20],['texture',18],['pulse',5]])element(name).listeners.input({target:{value:String(value)}});
 await run("draftGenres=['lofi'];draftEffects=['high'];applyMusicFilters()");assert.equal(run('library.current.title'),'Organics');assert.equal(run('library.tracks.length'),1);assert.equal(run('engine.active'),false);
 await run('toggle()');assert.equal(run('engine.active'),true);const loads=run('engine.loads');run('engine.file.currentTime=50');
 await run("draftGenres=['lofi','postrock'];draftEffects=['high'];applyMusicFilters()");assert.equal(run('engine.loads'),loads);assert.equal(run('engine.file.currentTime'),50);assert.equal(run('engine.active'),true);
 await run("draftGenres=[];draftEffects=['high'];applyMusicFilters()");assert.equal(run('library.tracks.length'),2);assert.equal(run('library.current.title'),'Organics');await run('changeTrack(1)');assert.equal(run('library.current.title'),'Gentle Mornings');assert.equal(run('engine.active'),true);
 assert.equal(run('settings.music'),20);assert.equal(run('settings.texture'),18);assert.equal(run('settings.pulse'),5);
 await run('engine.file.onended()');assert.equal(run('settings.texture'),18);assert.equal(run('settings.pulse'),5);
 await run("draftGenres=['lofi'];draftEffects=['low'];applyMusicFilters()");assert.equal(run('library.tracks.length'),0);assert.equal(run('session.running'),false);assert.equal(run('engine.active'),false);assert.equal(run('engine.file'),null);assert.equal(element('playBtn').disabled,true);assert.equal(element('trackTitle').textContent,'No matching tracks');const plays=run('engine.plays');await run('toggle()');assert.equal(run('engine.plays'),plays);
 await run("draftGenres=['lofi'];draftEffects=['low','medium'];applyMusicFilters()");assert.equal(run('library.current.title'),'Causeway');assert.equal(run('engine.active'),false);assert.equal(element('playBtn').disabled,false);
 await run("draftGenres=['acoustic'];draftEffects=['unknown'];applyMusicFilters(library.allTracks.find(t=>t.title==='Moon Cycles').file,true)");assert.equal(run('library.current.title'),'Moon Cycles');assert.equal(run('engine.active'),true);assert.equal(run('session.running'),true);
 const saved=JSON.parse(storage.get('still-settings'));assert.deepEqual(saved.genres,['acoustic']);assert.deepEqual(saved.effects,['unknown']);
 assert.equal(saved.music,65);assert.equal(saved.texture,30);assert.equal(saved.pulse,12);
 await presetButtons[1].listeners.click();assert.equal(run('settings.preset'),'work');assert.equal(run('settings.texture'),18);assert.equal(run('settings.music'),20);assert.equal(run('settings.pulse'),5);
 await element('removeFile').listeners.click();assert.equal(run('settings.music'),75);assert.equal(run('settings.texture'),20);assert.equal(run('settings.pulse'),25);assert.equal(run('fileMixBase'),null);
 await element('fileInput').listeners.change({target:{files:[files[0]],value:'selected'}});assert.equal(run('settings.music'),0);assert.equal(run('settings.texture'),0);assert.equal(run('settings.pulse'),0);
 element('texture').listeners.input({target:{value:'25'}});await run('importMp3Folder(files)');assert.equal(run('settings.texture'),0);assert.equal(run('settings.music'),0);
 await element('rate').listeners.change({target:{value:'40'}});assert.equal(run('settings.rate'),40);assert.equal(JSON.parse(storage.get('still-settings')).rate,40);
 // Exercise persistence at the app boundary without granting disk/network access.
 context.File=require('node:buffer').File;let copied=0,linked=0,forgotten=0;
 context.persistCopies=async files=>{copied=files.length;};context.persistLink=async handle=>{linked++;};context.clearCopies=async()=>{forgotten++;};
 run('musicStore.saveFiles=persistCopies;musicStore.saveFolder=persistLink;musicStore.clear=clearCopies;Object.defineProperty(musicStore,"available",{value:true})');
 await element('rememberLibrary').listeners.change({target:{checked:true}});assert.equal(copied,5);assert.equal(run('hasRememberedLibrary'),true);assert.equal(run('settings.rememberLibrary'),true);
 const source=new context.File(['fixture'],files[1].name,{type:'audio/mpeg'});context.savedLibrary={kind:'files',entries:[{file:source,name:source.name,path:'Music/Acoustic/'+source.name,lastModified:0}]};
 run('musicStore.load=async()=>savedLibrary;session.pause();engine.active=false;library.clear()');element('libraryDialog').open=false;const playsBefore=run('engine.plays');
 await run('restoreRememberedLibrary()');assert.equal(run('library.allTracks.length'),1);assert.equal(run('library.current.title'),'Moon Cycles');assert.equal(run('engine.plays'),playsBefore);assert.equal(element('libraryDialog').open,false);assert.equal(run('engine.active'),false);assert.match(element('libraryMemory').textContent,/restored locally/);
 const loadsBefore=run('engine.loads');run('musicStore.load=()=>new Promise(resolve=>{this.finishLibraryLoad=resolve})');const staleRestore=run('restoreRememberedLibrary()');run('libraryRevision++;finishLibraryLoad(savedLibrary)');await staleRestore;assert.equal(run('engine.loads'),loadsBefore);
 let permissionRequests=0;context.savedLibrary={kind:'folder',handle:{name:'My Music',queryPermission:async()=> 'prompt',requestPermission:async options=>{assert.equal(options.mode,'read');permissionRequests++;return 'granted';},async *values(){yield {kind:'file',name:source.name,getFile:async()=>source};}}};
 run('musicStore.load=async()=>savedLibrary');await run('restoreRememberedLibrary()');assert.equal(permissionRequests,0);assert.equal(element('reconnectLibrary').hidden,false);
 await element('reconnectLibrary').listeners.click();assert.equal(permissionRequests,1);assert.equal(run('engine.active'),false);assert.equal(element('reconnectLibrary').hidden,true);
 await run('rememberCurrentLibrary()');assert.equal(linked,1);await element('forgetLibrary').listeners.click();assert.equal(forgotten,1);assert.equal(run('settings.rememberLibrary'),false);assert.equal(run('hasRememberedLibrary'),false);assert.equal(run('library.allTracks.length'),1);
 run('settings.rememberLibrary=true;musicStore.saveFiles=async()=>{const error=new Error("Full");error.name="QuotaExceededError";throw error;}');await run('rememberCurrentLibrary(null)');assert.match(element('libraryMemory').textContent,/Not enough browser storage/);assert.equal(run('hasRememberedLibrary'),false);
 const fresh={...context};vm.createContext(fresh);vm.runInContext(code,fresh);assert.equal(vm.runInContext("settings.effects[0]",fresh),'unknown');assert.equal(vm.runInContext("settings.genres[0]",fresh),'acoustic');
 assert.equal(vm.runInContext('settings.rate',fresh),40);
 console.log('Filter/playback checks passed: imported music starts alone, optional layers survive navigation/auto-advance/presets, generative mix restores and stays saved, single-file/folder defaults, OR/AND filters, current-track retention, empty-match silence, recovery, saved filters, private restore without autoplay, read-only permission reconnect, forget, quota errors, and persisted 40 Hz selection.');
})().catch(e=>{console.error(e);process.exitCode=1});
