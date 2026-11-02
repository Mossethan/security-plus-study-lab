'use strict';
function mp3Path(file){return file.webkitRelativePath||file.name;}
function isPlayableMp3(file){return /\.mp3$/i.test(file.name)&&!/(^|[\\/])_Still_Duplicates([\\/]|$)/i.test(mp3Path(file));}
async function scanMp3Files(files,{onProgress=()=>{},signal,cryptoProvider=globalThis.crypto}={}){
  const candidates=Array.from(files).filter(isPlayableMp3).sort((a,b)=>a.name.length-b.name.length||mp3Path(a).length-mp3Path(b).length||mp3Path(a).localeCompare(mp3Path(b)));
  const sizes=new Map();for(const file of candidates)sizes.set(file.size,(sizes.get(file.size)||0)+1);
  const seen=new Map(),tracks=[],duplicates=[],errors=[];let done=0;
  const abort=()=>{if(signal?.aborted)throw new DOMException('Folder scan cancelled.','AbortError');};
  for(const file of candidates){
    abort();const path=mp3Path(file);
    try{
      let hash=null;
      if(sizes.get(file.size)>1){
        if(!cryptoProvider?.subtle)throw new Error('Secure hashing is unavailable. Open Still using its HTTPS address.');
        const bytes=await file.arrayBuffer();abort();const digest=await cryptoProvider.subtle.digest('SHA-256',bytes);abort();
        hash=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
      }
      const key=hash?`${file.size}:${hash}`:null;
      if(key&&seen.has(key))duplicates.push({file,path,keptPath:seen.get(key).path,hash,size:file.size});
      else{const track={file,path,hash,size:file.size};tracks.push(track);if(key)seen.set(key,track);}
    }catch(error){if(error.name==='AbortError')throw error;errors.push({path,message:error.message||'File could not be read.'});}
    onProgress({done:++done,total:candidates.length,path});
  }
  return {tracks:tracks.sort((a,b)=>a.path.localeCompare(b.path,undefined,{numeric:true})),duplicates,errors,total:candidates.length};
}
class MP3Library {
  constructor(){this.tracks=[];this.duplicates=[];this.errors=[];this.index=-1;this.order=[];this.shuffle=false;}
  load(result){this.tracks=result.tracks;this.duplicates=result.duplicates;this.errors=result.errors;this.index=this.tracks.length?0:-1;this.setShuffle(this.shuffle);}
  get current(){return this.tracks[this.index]||null;}
  select(index){if(!Number.isInteger(index)||index<0||index>=this.tracks.length)return null;this.index=index;return this.current;}
  neighbor(direction=1){if(!this.order.length)return -1;return this.order[(this.order.indexOf(this.index)+direction+this.order.length)%this.order.length];}
  setShuffle(enabled,random=Math.random){
    this.shuffle=enabled;this.order=this.tracks.map((_,i)=>i);
    if(enabled&&this.tracks.length){const rest=this.order.filter(i=>i!==this.index);for(let i=rest.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[rest[i],rest[j]]=[rest[j],rest[i]];}this.order=this.index>=0?[this.index,...rest]:rest;}
  }
  clear(){this.load({tracks:[],duplicates:[],errors:[]});}
}
function duplicateCsv(duplicates){
 const cell=value=>{let s=String(value??'');if(/^[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
 return '\ufeff'+[['Duplicate file','Keep this file','Bytes','SHA-256'],...duplicates.map(d=>[d.path,d.keptPath,d.size,d.hash])].map(row=>row.map(cell).join(',')).join('\r\n');
}
if(typeof module!=='undefined'&&module.exports)module.exports={scanMp3Files,MP3Library,mp3Path,isPlayableMp3,duplicateCsv};
