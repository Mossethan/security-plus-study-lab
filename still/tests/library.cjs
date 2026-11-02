const assert=require('node:assert/strict');
const {webcrypto}=require('node:crypto');const {scanMp3Files,MP3Library,duplicateCsv}=require('../library.js');
const file=(name,content,path=name)=>{const bytes=Buffer.from(content);return {name,size:bytes.length,webkitRelativePath:path,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)};};
(async()=>{
 const a=file('A.mp3','abc','Music/A.mp3'),copy=file('A copy.mp3','abc','Music/A copy.mp3'),b=file('B.mp3','xyz','Music/B.mp3');
 const result=await scanMp3Files([copy,b,a,file('notes.txt','abc'),file('old.mp3','abc','Music/_Still_Duplicates/run/old.mp3')],{cryptoProvider:webcrypto});
 assert.equal(result.total,3);assert.equal(result.tracks.length,2);assert.equal(result.duplicates.length,1);assert.equal(result.duplicates[0].keptPath,'Music/A.mp3');assert.equal(result.duplicates[0].path,'Music/A copy.mp3');assert.equal(result.duplicates[0].hash.length,64);
 const unique=await scanMp3Files([file('A.MP3','different-size'),a],{cryptoProvider:{subtle:{digest(){throw Error('Unique sizes should not be hashed');}}}});assert.equal(unique.tracks.length,2);assert.equal(unique.errors.length,0);
 const bad=file('bad.mp3','abc');bad.arrayBuffer=async()=>{throw Error('File no longer available');};const mixed=await scanMp3Files([a,bad],{cryptoProvider:webcrypto});assert.equal(mixed.tracks.length,1);assert.equal(mixed.errors.length,1);assert.equal(mixed.duplicates.length,0);
 const abort=new AbortController();await assert.rejects(scanMp3Files([a,b,copy],{cryptoProvider:webcrypto,signal:abort.signal,onProgress:()=>abort.abort()}),{name:'AbortError'});
 const library=new MP3Library();assert.equal(library.neighbor(),-1);library.load(result);assert.equal(library.current.file.name,'A.mp3');assert.equal(library.neighbor(1),1);assert.equal(library.neighbor(-1),1);library.select(1);assert.equal(library.neighbor(1),0);assert.equal(library.select(100),null);assert.equal(library.index,1);library.setShuffle(true,()=>0);assert.equal(library.order[0],1);assert.equal(new Set(library.order).size,2);library.setShuffle(false);assert.deepEqual(library.order,[0,1]);assert.equal(library.index,1);library.clear();assert.equal(library.current,null);assert.equal(library.neighbor(),-1);
 const one=new MP3Library();one.load({tracks:[{file:a,path:a.webkitRelativePath}],duplicates:[],errors:[]});assert.equal(one.neighbor(1),0);
 const csv=duplicateCsv([{path:'=unsafe,".mp3',keptPath:'Music/A.mp3',size:3,hash:'abc'}]);assert.ok(csv.includes("\"'=unsafe,\"\".mp3\""));assert.ok(csv.includes('SHA-256'));
 console.log('MP3 library checks passed: renamed duplicates, same-size distinct tracks, quarantine exclusion, unreadable files, cancellation, queue wrapping/shuffle, empty/single libraries, and safe CSV export.');
})().catch(error=>{console.error(error);process.exitCode=1});
