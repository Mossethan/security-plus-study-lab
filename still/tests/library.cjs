const assert=require('node:assert/strict');
const {MUSIC_GENRES,parseMp3Metadata,indexMp3Files,filterMp3Tracks,MP3Library}=require('../library.js');
const names=[
 'Causeway_Focus_Deep_Work_LoFi_30_84bpm_MedNEL_Nrmlzd2_VBR5 (1).mp3',
 'Moon Cycles Deep Work Acoustic Focus Chris 120bpm Session 4_VBR5 (3).mp3',
 'Organics_Focus_Deep Work_LoFi_30_90bpm_HighNEL_Nrmlzd2_VBR5.mp3',
 'Sonus_Focus_DeepWork_Piano_30_110bpm_LowNEL_Nrmlzd2_VBR5.mp3',
 'GentleMornings_Focus_DeepWork_Acoustic_30_83bpm_HighNEL_Nrmlzd2_VBR5.mp3'
];
const file=(name,path=name)=>({name,size:123,webkitRelativePath:path,arrayBuffer(){throw Error('The website must not read/hash file contents');}});
const files=names.map(n=>file(n)),meta=files.map(parseMp3Metadata);
assert.deepEqual(meta.map(t=>t.effect),['medium','unknown','high','low','high']);
assert.deepEqual(meta.map(t=>t.genres),[['lofi'],['acoustic'],['lofi'],['piano'],['acoustic']]);
assert.deepEqual(meta.map(t=>t.bpm),[84,120,90,110,83]);assert.deepEqual(meta.map(t=>t.title),['Causeway','Moon Cycles','Organics','Sonus','Gentle Mornings']);
for(const genre of MUSIC_GENRES){const t=parseMp3Metadata(file(`Title_Focus_DeepWork_${genre.label}_30_90bpm_MediumNEL.mp3`));assert.deepEqual(t.genres,[genre.key]);assert.equal(t.effect,'medium');}
assert.deepEqual(parseMp3Metadata(file('AcousticDreams_Focus_DeepWork_LoFi_30_90bpm_HighNEL.mp3')).genres,['lofi']);
assert.equal(parseMp3Metadata(file('Moon_120bpm_Session_4_Nrmlzd2_VBR5.mp3')).effect,'unknown');
const folder=parseMp3Metadata(file('Track.mp3','Music/High effect/Post Rock/Track.mp3'));assert.equal(folder.effect,'high');assert.deepEqual(folder.genres,['postrock']);
assert.equal(parseMp3Metadata(file('Track_LowNEL.mp3','Music/High effect/Track_LowNEL.mp3')).effect,'low');
const indexed=indexMp3Files([...files,file(names[0]),file('note.txt'),file('copy.mp3','Music/_Still_Duplicates/run/copy.mp3')]);assert.equal(indexed.tracks.length,6); // Copies stay in the player; cleanup is external.
const tracks=indexMp3Files(files).tracks;
assert.equal(filterMp3Tracks(tracks,['lofi'],['high']).length,1);
assert.equal(filterMp3Tracks(tracks,[],['high']).length,2);
assert.equal(filterMp3Tracks(tracks,['lofi','postrock'],['high']).length,1);
assert.equal(filterMp3Tracks(tracks,['lofi'],['low','medium']).length,1);
assert.equal(filterMp3Tracks(tracks,['acoustic'],['unknown']).length,1);
assert.equal(filterMp3Tracks(tracks,['lofi'],['unknown']).length,0);
assert.equal(filterMp3Tracks(tracks,[],[]).length,5);
const library=new MP3Library();assert.equal(library.neighbor(),-1);library.load({tracks});library.setFilters(['lofi'],['high']);assert.equal(library.current.title,'Organics');assert.equal(library.neighbor(1),0);
library.setFilters([],['high']);assert.equal(library.current.title,'Organics');assert.equal(library.neighbor(1),0);library.setShuffle(true,()=>0);assert.equal(library.order[0],library.index);assert.equal(library.order.length,2);
library.setFilters(['drone'],['low']);assert.equal(library.current,null);assert.equal(library.neighbor(),-1);library.setFilters([],[]);assert.equal(library.tracks.length,5);library.clear();assert.equal(library.allTracks.length,0);
console.log('Filename/category checks passed for all five samples, ten genres, NEL/folder labels, multi-select logic, unlabeled tracks, queue retention/shuffle, and no browser hashing.');
