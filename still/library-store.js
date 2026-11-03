'use strict';
// Only local IndexedDB and read-only file handles; this module makes no network requests.
class LocalMusicStore {
 constructor(){this.queue=Promise.resolve();this.database=null;}
 get available(){return typeof indexedDB!=='undefined';}
 async open(){
  if(!this.available)throw new Error('This browser cannot remember a music library. Files still work for this visit.');
  if(!this.database)this.database=new Promise((resolve,reject)=>{
   const request=indexedDB.open('still-local-music',1);
   request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('library'))request.result.createObjectStore('library');};
   request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>{db.close();this.database=null;};resolve(db);};
   request.onerror=()=>{this.database=null;reject(request.error);};
   request.onblocked=()=>{this.database=null;reject(new Error('Close other Still tabs and try again.'));};
  });
  return this.database;
 }
 async transaction(mode,action){
  const db=await this.open();return new Promise((resolve,reject)=>{
   const tx=db.transaction('library',mode);let request;
   try{request=action(tx.objectStore('library'));}catch(error){tx.abort();reject(error);return;}
   tx.oncomplete=()=>resolve(request?.result);
   tx.onerror=tx.onabort=()=>reject(tx.error||request?.error||new Error('Local music storage was interrupted.'));
  });
 }
 load(){return this.queue.catch(()=>{}).then(()=>this.transaction('readonly',store=>store.get('selected')));}
 write(action){const result=this.queue.catch(()=>{}).then(action);this.queue=result;return result;}
 saveFolder(handle){return this.write(()=>this.transaction('readwrite',store=>store.put({kind:'folder',handle,name:handle.name},'selected')));}
 saveFiles(files){
  const entries=Array.from(files).map(file=>({file,name:file.name,path:file.webkitRelativePath||file.stillPath||file.name,lastModified:file.lastModified,size:file.size}));
  return this.write(async()=>{
   if(typeof navigator!=='undefined'&&navigator.storage?.estimate){
    const estimate=await navigator.storage.estimate().catch(()=>null),bytes=entries.reduce((sum,e)=>sum+(e.size||0),0);
    if(estimate?.quota&&bytes>Math.max(0,estimate.quota-(estimate.usage||0))){const error=new Error('Not enough browser storage to remember this library. Try a smaller selection, or use a linked folder in Chrome/Edge.');error.name='QuotaExceededError';throw error;}
   }
   return this.transaction('readwrite',store=>store.put({kind:'files',entries},'selected'));
  });
 }
 clear(){return this.write(()=>this.transaction('readwrite',store=>store.delete('selected')));}
 static restoreFiles(record){
  return (record.entries||[]).map(entry=>{
   const file=new File([entry.file],entry.name,{type:entry.file.type||'audio/mpeg',lastModified:entry.lastModified||0});
   Object.defineProperty(file,'stillPath',{value:entry.path||entry.name});return file;
  });
 }
 static async readFolder(handle){
  const files=[];
  async function visit(directory,prefix){
   for await(const entry of directory.values()){
    if(entry.kind==='directory'){if(entry.name.toLowerCase()!=='_still_duplicates')await visit(entry,prefix+entry.name+'/');}
    else if(entry.kind==='file'&&/\.mp3$/i.test(entry.name)){
     const file=await entry.getFile();Object.defineProperty(file,'stillPath',{value:prefix+entry.name});files.push(file);
    }
   }
  }
  await visit(handle,handle.name+'/');return files;
 }
}
if(typeof module!=='undefined'&&module.exports)module.exports=LocalMusicStore;
