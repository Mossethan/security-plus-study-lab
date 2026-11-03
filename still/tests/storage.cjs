const assert=require('node:assert/strict');
const LocalMusicStore=require('../library-store.js');
const {indexMp3Files}=require('../library.js');
const {File}=require('node:buffer');global.File=File;
(async()=>{
 const records=new Map(),store=new LocalMusicStore();let writes=0;
 store.transaction=async(mode,action)=>{
  const request=action({get:key=>({result:records.get(key)}),put:(value,key)=>{writes++;records.set(key,value);return {result:key};},delete:key=>{records.delete(key);return {};}});
  return request.result;
 };
 const file=new File(['test audio bytes'],'Track_Focus_DeepWork_LoFi_30_90bpm_HighNEL.mp3',{type:'audio/mpeg',lastModified:123});
 Object.defineProperty(file,'stillPath',{value:'Music/High effect/Lofi/'+file.name});
 await store.saveFiles([file]);const record=await store.load();assert.equal(record.kind,'files');
 const restored=LocalMusicStore.restoreFiles(record);assert.equal(restored[0].name,file.name);assert.equal(restored[0].lastModified,123);assert.equal(await restored[0].text(),'test audio bytes');assert.equal(restored[0].stillPath,file.stillPath);
 const track=indexMp3Files(restored).tracks[0];assert.deepEqual(track.genres,['lofi']);assert.equal(track.effect,'high');assert.equal(track.path,file.stillPath);
 // Saved folder links are handles only, not copies of the files.
 const handle={name:'Music',kind:'directory'};await store.saveFolder(handle);assert.equal((await store.load()).handle,handle);assert.equal((await store.load()).entries,undefined);
 const ignored={name:'_Still_Duplicates',kind:'directory',async *values(){throw Error('Quarantine must not be traversed');}};
 const leaf={name:file.name,kind:'file',getFile:async()=>new File(['x'],file.name)};
 const folder={name:'Music',kind:'directory',async *values(){yield ignored;yield {name:'High effect',kind:'directory',async *values(){yield leaf;yield {name:'notes.txt',kind:'file',getFile(){throw Error('Non-MP3 must not be read');}};}};}};
 const folderFiles=await LocalMusicStore.readFolder(folder);assert.equal(folderFiles.length,1);assert.equal(folderFiles[0].stillPath,'Music/High effect/'+file.name);
 // Storage failures do not report success or overwrite the previous selection.
 const originalNavigator=Object.getOwnPropertyDescriptor(global,'navigator');
 Object.defineProperty(global,'navigator',{configurable:true,value:{storage:{estimate:async()=>({quota:1,usage:0})}}});
 const before=writes;await assert.rejects(store.saveFiles([file]),{name:'QuotaExceededError'});assert.equal(writes,before);assert.equal((await store.load()).handle,handle);
 if(originalNavigator)Object.defineProperty(global,'navigator',originalNavigator);else delete global.navigator;
 // A forget request issued during a save must win after the queued save completes.
 const queued=new LocalMusicStore(),calls=[];let release,signal;
 const entered=new Promise(resolve=>{signal=resolve;});
 queued.transaction=async(mode,action)=>action({put:async()=>{calls.push('save');signal();await new Promise(resolve=>{release=resolve;});},delete:()=>calls.push('forget')});
 const saving=queued.saveFolder(handle);await entered;const forgetting=queued.clear();assert.deepEqual(calls,['save']);release();await Promise.all([saving,forgetting]);assert.deepEqual(calls,['save','forget']);
 await store.clear();assert.equal(await store.load(),undefined);
 const unsupported=new LocalMusicStore();assert.equal(unsupported.available,false);await assert.rejects(unsupported.open(),/cannot remember/);
 console.log('Local storage checks passed: byte/path metadata round trip, folder-only handles, nested read-only traversal, quarantine exclusion, quota rejection, ordered save/forget, and unavailable storage.');
})().catch(error=>{console.error(error);process.exitCode=1;});
