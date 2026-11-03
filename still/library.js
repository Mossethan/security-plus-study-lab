'use strict';
const MUSIC_GENRES=[{key:'acoustic',label:'Acoustic'},{key:'atmospheric',label:'Atmospheric'},{key:'cinematic',label:'Cinematic'},{key:'classical',label:'Classical'},{key:'drone',label:'Drone'},{key:'electronic',label:'Electronic'},{key:'grooves',label:'Grooves'},{key:'lofi',label:'Lofi'},{key:'piano',label:'Piano'},{key:'postrock',label:'Post rock'}];
const MUSIC_EFFECTS=[{key:'low',label:'Low'},{key:'medium',label:'Medium'},{key:'high',label:'High'},{key:'unknown',label:'Unlabeled'}];
function mp3Path(file){return file.webkitRelativePath||file.stillPath||file.name;}
function isPlayableMp3(file){return /\.mp3$/i.test(file.name)&&!/(^|[\\/])_Still_Duplicates([\\/]|$)/i.test(mp3Path(file));}
function normalizedMusicText(value){return value.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_\-]+/g,' ').replace(/[^a-zA-Z0-9\s]/g,' ').toLowerCase().replace(/\s+/g,' ').trim();}
function genrePattern(key){return key==='lofi'?'lo[\\s_-]*fi':key==='postrock'?'post[\\s_-]*rock':key==='grooves'?'grooves?':key;}
function detectGenres(value){const text=normalizedMusicText(value);return MUSIC_GENRES.filter(({key})=>new RegExp(`\\b${genrePattern(key)}\\b`).test(text)).map(({key})=>key);}
function detectEffect(value,allowBare=false){
 const text=normalizedMusicText(value),found=[];
 for(const [key,pattern] of [['low','low'],['medium','med(?:ium)?'],['high','high']]){
  if(new RegExp(`\\b${pattern}\\s*(?:nel|neural effects?|effects?)\\b|\\b(?:nel|neural effects?|effects?)\\s*${pattern}\\b`).test(text)||(allowBare&&new RegExp(`^${pattern}$`).test(text)))found.push(key);
 }
 return found.length===1?found[0]:'unknown';
}
function parseMp3Metadata(file){
 const stem=file.name.replace(/\.mp3$/i,'').replace(/\s*\(\d+\)\s*$/,'');
 const clean=stem.replace(/_/g,' ').replace(/([a-z])([A-Z][a-z])/g,'$1 $2').replace(/\s+/g,' ').trim();
 const normalized=normalizedMusicText(stem),deep=/\bdeep\s*work\b/.exec(normalized),focus=/\bfocus\b/.exec(normalized);
 const marker=deep||focus,genreArea=marker?normalized.slice(marker.index+marker[0].length):normalized;
 let genres=detectGenres(genreArea),effect=detectEffect(stem);
 const titleMarker=clean.search(/\b(?:focus|deep\s*work)\b/i);let title=(titleMarker>0?clean.slice(0,titleMarker):clean).trim()||stem;
 // Older exports place the genre immediately before Focus/Deep Work.
 // Require a separate trailing label and a remaining title, so words inside
 // titles such as Acoustic Dreams do not become accidental genre labels.
 if(!genres.length&&titleMarker>0){
  const label=MUSIC_GENRES.find(({key})=>new RegExp(`[\\s_-]+${genrePattern(key)}$`,'i').test(title));
  if(label){genres=[label.key];title=title.replace(new RegExp(`[\\s_-]+${genrePattern(label.key)}$`,'i'),'').trim();}
 }
 const parents=mp3Path(file).split(/[\\/]/).slice(0,-1).reverse();
 if(!genres.length){for(const folder of parents){const labels=detectGenres(folder);if(labels.length){genres=labels;break;}}}
 if(effect==='unknown'){for(const folder of parents){const label=detectEffect(folder,true);if(label!=='unknown'){effect=label;break;}}}
 const bpm=/\b(\d{2,3})\s*bpm\b/.exec(normalized);
 return {title,genres,effect,bpm:bpm?Number(bpm[1]):null};
}
function indexMp3Files(files){
 return {tracks:Array.from(files).filter(isPlayableMp3).map(file=>({file,path:mp3Path(file),size:file.size,...parseMp3Metadata(file)})).sort((a,b)=>a.path.localeCompare(b.path,undefined,{numeric:true})),errors:[]};
}
function filterMp3Tracks(tracks,genres=[],effects=[]){
 return tracks.filter(track=>(!genres.length||track.genres.some(g=>genres.includes(g))||(!track.genres.length&&genres.includes('unknown')))&&(!effects.length||effects.includes(track.effect)));
}
class MP3Library {
 constructor(){this.allTracks=[];this.tracks=[];this.errors=[];this.index=-1;this.order=[];this.shuffle=false;this.genres=[];this.effects=[];}
 load(result){this.allTracks=result.tracks;this.errors=result.errors||[];this.index=-1;this.tracks=[];this.setFilters(this.genres,this.effects);}
 get current(){return this.tracks[this.index]||null;}
 select(index){if(!Number.isInteger(index)||index<0||index>=this.tracks.length)return null;this.index=index;return this.current;}
 neighbor(direction=1){if(!this.order.length)return -1;return this.order[(this.order.indexOf(this.index)+direction+this.order.length)%this.order.length];}
 setFilters(genres=[],effects=[]){
  const previous=this.current?.file;this.genres=[...genres];this.effects=[...effects];this.tracks=filterMp3Tracks(this.allTracks,genres,effects);
  const kept=this.tracks.findIndex(track=>track.file===previous);this.index=kept>=0?kept:this.tracks.length?0:-1;this.setShuffle(this.shuffle);
  return this.current?.file!==previous;
 }
 setShuffle(enabled,random=Math.random){
  this.shuffle=enabled;this.order=this.tracks.map((_,i)=>i);
  if(enabled&&this.tracks.length){const rest=this.order.filter(i=>i!==this.index);for(let i=rest.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[rest[i],rest[j]]=[rest[j],rest[i]];}this.order=this.index>=0?[this.index,...rest]:rest;}
 }
 clear(){this.allTracks=[];this.tracks=[];this.errors=[];this.index=-1;this.order=[];}
}
if(typeof module!=='undefined'&&module.exports)module.exports={MUSIC_GENRES,MUSIC_EFFECTS,parseMp3Metadata,indexMp3Files,filterMp3Tracks,MP3Library,mp3Path,isPlayableMp3};
