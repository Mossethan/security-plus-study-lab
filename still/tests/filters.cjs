const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const storage=new Map(),elements=new Map();let now=0;
function node(){return {value:'',max:100,textContent:'',innerHTML:'',hidden:false,disabled:false,open:false,children:[],style:{setProperty(){}},classList:{toggle(){}},listeners:{},setAttribute(){},addEventListener(n,f){this.listeners[n]=f},replaceChildren(){this.children=[]},append(...children){this.children.push(...children)},showModal(){this.open=true},close(){this.open=false},getContext(){return {setTransform(){},clearRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){}}},clientWidth:350,clientHeight:270};}
function element(id){if(!elements.has(id))elements.set(id,node());return elements.get(id);}
class Audio{
 constructor(){this.active=false;this.file=null;this.loads=0;this.plays=0;}
 apply(){}variation(){}
 async setFile(file){this.loads++;this.active=false;this.file={name:file.name,duration:1800,currentTime:0,addEventListener(){}};return true;}
 clearFile(){this.file=null;this.active=false;}
 async play(){this.active=true;this.plays++;}async pause(){this.active=false;}
}
const context={console,FocusAudio:Audio,document:{documentElement:{dataset:{}},getElementById:element,querySelectorAll:()=>[],createElement:node,body:{classList:{toggle(){}}},addEventListener(){}},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},setTimeout:()=>0,clearTimeout(){},setInterval(){},Date:class extends Date{static now(){return now}},navigator:{},matchMedia:()=>({matches:true}),devicePixelRatio:1};
vm.createContext(context);const code=['session.js','library.js','app.js'].map(n=>fs.readFileSync(path.join(__dirname,'..',n),'utf8')).join('\n');vm.runInContext(code,context);
const files=['Causeway_Focus_Deep_Work_LoFi_30_84bpm_MedNEL.mp3','Moon Cycles Deep Work Acoustic Focus Chris 120bpm Session 4.mp3','Organics_Focus_DeepWork_LoFi_30_90bpm_HighNEL.mp3','Sonus_Focus_DeepWork_Piano_30_110bpm_LowNEL.mp3','GentleMornings_Focus_DeepWork_Acoustic_30_83bpm_HighNEL.mp3'].map(name=>({name,size:123,webkitRelativePath:'Music/'+name}));context.files=files;
const run=s=>vm.runInContext(s,context);
(async()=>{
 await run('importMp3Folder(files)');assert.equal(run('library.allTracks.length'),5);assert.equal(element('libraryDialog').open,true);
 await run("draftGenres=['lofi'];draftEffects=['high'];applyMusicFilters()");assert.equal(run('library.current.title'),'Organics');assert.equal(run('library.tracks.length'),1);assert.equal(run('engine.active'),false);
 await run('toggle()');assert.equal(run('engine.active'),true);const loads=run('engine.loads');run('engine.file.currentTime=50');
 await run("draftGenres=['lofi','postrock'];draftEffects=['high'];applyMusicFilters()");assert.equal(run('engine.loads'),loads);assert.equal(run('engine.file.currentTime'),50);assert.equal(run('engine.active'),true);
 await run("draftGenres=[];draftEffects=['high'];applyMusicFilters()");assert.equal(run('library.tracks.length'),2);assert.equal(run('library.current.title'),'Organics');await run('changeTrack(1)');assert.equal(run('library.current.title'),'Gentle Mornings');assert.equal(run('engine.active'),true);
 await run("draftGenres=['lofi'];draftEffects=['low'];applyMusicFilters()");assert.equal(run('library.tracks.length'),0);assert.equal(run('session.running'),false);assert.equal(run('engine.active'),false);assert.equal(run('engine.file'),null);assert.equal(element('playBtn').disabled,true);assert.equal(element('trackTitle').textContent,'No matching tracks');const plays=run('engine.plays');await run('toggle()');assert.equal(run('engine.plays'),plays);
 await run("draftGenres=['lofi'];draftEffects=['low','medium'];applyMusicFilters()");assert.equal(run('library.current.title'),'Causeway');assert.equal(run('engine.active'),false);assert.equal(element('playBtn').disabled,false);
 await run("draftGenres=['acoustic'];draftEffects=['unknown'];applyMusicFilters(library.allTracks.find(t=>t.title==='Moon Cycles').file,true)");assert.equal(run('library.current.title'),'Moon Cycles');assert.equal(run('engine.active'),true);assert.equal(run('session.running'),true);
 const saved=JSON.parse(storage.get('still-settings'));assert.deepEqual(saved.genres,['acoustic']);assert.deepEqual(saved.effects,['unknown']);
 const fresh={...context};vm.createContext(fresh);vm.runInContext(code,fresh);assert.equal(vm.runInContext("settings.effects[0]",fresh),'unknown');assert.equal(vm.runInContext("settings.genres[0]",fresh),'acoustic');
 console.log('Filter/playback checks passed: importing, OR/AND combinations, current-track retention without restarting, filtered navigation, empty-match silence, recovery, explicit track selection, and saved filters.');
})().catch(e=>{console.error(e);process.exitCode=1});
