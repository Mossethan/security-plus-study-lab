const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');
function env(saved={},blocked=false){
 let markup='';const nodes=new Map(),dataNodes=[];
 const make=()=>({dataset:{},textContent:'',value:'',disabled:false,focus(){},reportValidity:()=>true});
 const node=selector=>nodes.get(selector)||null;
 const main={get innerHTML(){return markup;},set innerHTML(v){markup=v;nodes.clear();dataNodes.length=0;for(const tag of v.matchAll(/<(?:button|a|input|p|h1|form|textarea|select)[^>]*>/g)){const el=make(),id=tag[0].match(/\bid="([^"]+)"/);if(id)nodes.set('#'+id[1],el);for(const m of tag[0].matchAll(/\bdata-([a-z-]+)="([^"]+)"/g)){const key=m[1].replace(/-([a-z])/g,(_,c)=>c.toUpperCase());el.dataset[key]=m[2];nodes.set(`[data-${m[1]}="${m[2]}"]`,el);}if(Object.keys(el.dataset).length)dataNodes.push(el);}},querySelectorAll(s){const key=s.match(/^\[data-([a-z-]+)\]$/)?.[1]?.replace(/-([a-z])/g,(_,c)=>c.toUpperCase());return key?dataNodes.filter(el=>Object.hasOwn(el.dataset,key)):[];}};
 const c={console,main,location:{hash:'#checkpoints'},localStorage:{getItem:k=>saved[k]||null,setItem:(k,v)=>{if(blocked)throw Error('blocked');saved[k]=v;}},document:{querySelector:node,getElementById:id=>node('#'+id)},$:node,head:(a,b,c='')=>`<h1>${b}</h1><p>${c}</p>`,esc:s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),shuffle:a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}};
 vm.createContext(c);for(const f of ['data.js','curriculum.js','messer-data.js','messer-checkpoint-data.js','messer-checkpoints.js','messer.js','quiz-bank.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});
 return {saved,nodes,main,run:s=>vm.runInContext(s,c),complete(id){vm.runInContext(`for(const l of MESSER_LESSONS.filter(l=>l.objective==='${id}')){const p=mProgress(l);l.questions.forEach((q,i)=>p.answers[i]=q.answer);l.activity.items.forEach((q,i)=>p.matches[i]=q[1]);p.checked=true;mUpdateBest(l);}mSave();mcSync();`,c);}};
}
const a=env();const bank=a.run('MC_BANK'),lessons=a.run('MESSER_LESSONS');
assert.equal(bank.length,196);assert.equal(new Set(bank.map(q=>q.id)).size,196);
const oldPrompts=new Set(a.run('QUIZ_BANK').map(q=>q.prompt.trim().toLowerCase()));
assert.equal(new Set(bank.map(q=>q.prompt.trim().toLowerCase())).size,196);
for(const q of bank){assert(!oldPrompts.has(q.prompt.trim().toLowerCase()),'Checkpoint prompts must be new');assert.equal(lessons.find(l=>l.id===q.lesson)?.objective,q.objective);assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);assert(q.why.length>40);}
assert.deepEqual(Array.from(a.run('MC_OBJECTIVES.map(o=>mcSize(o.id))')),[10,20,25,30,10,20,30,30,30]);
a.run('messer()');assert(a.main.innerHTML.includes('Section checkpoints'));assert(a.main.innerHTML.includes('Locked'));assert(!a.main.innerHTML.includes('data-mc-start='));assert.equal(a.run("mcCreate('1.1')"),null);
// A later domain does not require completing the previous domain.
a.complete('2.1');assert(a.run("mcUnlocked('2.1')"));assert(!a.run("mcUnlocked('1.1')"));
a.complete('1.2');assert(!a.run("mcUnlocked('1.2')"),'Earlier objectives must be completed too');
a.complete('1.1');assert(a.run("mcUnlocked('1.1')&&mcUnlocked('1.2')"));
a.run("mProgress(MESSER_LESSONS[0]).answers={};mcSync()");assert(a.run("mcUnlocked('1.1')"),'Retrying a lesson must not relock a checkpoint');
for(const id of ['1.3','1.4','2.2','2.3','2.4','2.5'])a.complete(id);
a.run('mcRender()');assert(a.nodes.has('[data-mc-start="1.1"]'));
a.nodes.get('[data-mc-start="1.1"]').onclick();assert.equal(a.run('location.hash'),'checkpoint-1.1');a.run("location.hash='#checkpoint-1.1';messer()");
assert(a.main.innerHTML.includes('Question 1 of 10'));assert(!a.main.innerHTML.includes('Correct:'));
const qid=a.run("mcState.sessions['1.1'].ids[0]");const answer=a.run(`mcById.get('${qid}').answer`);
a.nodes.get(`[data-mc-answer="${answer}"]`).onchange();a.nodes.get('[data-mc-confidence="sure"]').onchange();
assert.equal(a.run(`mcState.sessions['1.1'].answers['${qid}']`),answer);
a.nodes.get('#mc-next').onclick();assert.equal(a.run("mcState.sessions['1.1'].index"),1);
const b=env(a.saved);b.run("location.hash='#checkpoint-1.1';messer()");assert(b.main.innerHTML.includes('Question 2 of 10'));assert.equal(b.run(`mcState.sessions['1.1'].answers['${qid}']`),answer);
assert.deepEqual(Array.from(b.run("mcState.sessions['1.1'].ids")),Array.from(a.run("mcState.sessions['1.1'].ids")));
const original=b.run("mcState.sessions['1.1']");assert.equal(b.run("mcCreate('1.1')"),original,'Start must not overwrite an unfinished session');
b.nodes.get('#mc-review').onclick();b.nodes.get('#mc-submit').onclick();assert(b.main.innerHTML.includes('9 unanswered'));b.nodes.get('#mc-final').onclick();
assert(b.main.innerHTML.includes('1 / 10 correct'));assert(b.main.innerHTML.includes('Answers and explanations'));
assert.equal(b.run('mcWeak().length'),9);assert.equal(b.run("mcState.history['1.1'].length"),1);b.run("mcFinish(mcState.sessions['1.1'])");assert.equal(b.run("mcState.history['1.1'].length"),1,'Scoring is idempotent');
assert(!b.run(`mcAnswer(mcState.sessions['1.1'],'${qid}',0)`),'Submitted attempts are immutable');
const lastIds=Array.from(b.run("mcState.sessions['1.1'].ids"));b.nodes.get('[data-mc-start="1.1"]').onclick();const nextIds=Array.from(b.run("mcState.sessions['1.1'].ids"));assert.equal(nextIds.filter(id=>!lastIds.includes(id)).length,6,'All six previously unseen items should appear before repeats');
// Correct guesses remain weak, while correct confident answers resolve their own prior weak status.
b.run("const s=mcState.sessions['1.1'];for(const id of s.ids)mcAnswer(s,id,mcById.get(id).answer,'sure');s.confidence[s.ids[0]]='unsure';mcFinish(s)");
assert(b.run('mcState.reviews[s.ids[0]].weak'));assert(b.run('s.ids.slice(1).every(id=>!mcState.reviews[id].weak)'));
const firstBank=b.run("MC_BANK.find(q=>q.objective==='1.1')");b.run(`const probe={objective:'1.1',ids:['${firstBank.id}'],answers:{'${firstBank.id}':${firstBank.answer}},confidence:{'${firstBank.id}':'sure'},started:1000,finished:null};mcFinish(probe,2000)`);assert(!b.run(`mcState.reviews['${firstBank.id}'].weak`));
// Independent draws: all earlier objectives represented, no future objectives or cross-domain leakage.
for(const o of a.run('MC_OBJECTIVES'))for(let n=0;n<12;n++){
 a.run(`if(mcState.sessions['${o.id}'])mcFinish(mcState.sessions['${o.id}']);mcCreate('${o.id}')`);
 assert(a.run(`mcValid(mcState.sessions['${o.id}'],'${o.id}')`),`Valid checkpoint ${o.id}, draw ${n}`);
 const ids=Array.from(a.run(`mcState.sessions['${o.id}'].ids`));assert.equal(ids.length,new Set(ids).size);
 const objectives=new Set(ids.map(id=>bank.find(q=>q.id===id).objective));assert.deepEqual([...objectives].sort(),Array.from(a.run(`mcScope('${o.id}').map(o=>o.id)`)).sort());
}
const bad=env({'security-messer-checkpoints-v1':JSON.stringify({sessions:{'1.1':{ids:['missing']}},history:{'1.1':[{correct:'<img src=x>',total:10,finished:1}]}})});bad.run('messer()');assert(!bad.main.innerHTML.includes('<img'));assert(!bad.run("mcState.sessions['1.1']"));assert(bad.main.innerHTML.includes('incompatible'));
const unavailable=env({},true);unavailable.complete('1.1');unavailable.run("mcCreate('1.1');mcRender('1.1')");assert(unavailable.nodes.get('#mc-save').textContent.includes('unavailable'));
// Existing notes and answers are not modified by checkpoint draws or results.
const old=a.saved['security-messer-v1'];a.run("mcRender('2.3')");assert.equal(a.saved['security-messer-v1'],old);
console.log('PASS: 196 new questions; nine adaptive checkpoint sizes; unlock gating; permanent unlocks; full cumulative domain coverage across 108 draws; unseen priority; start/answer/navigation/submit events; reload; confidence and weak-spot resolution; idempotent scoring; immutable results; corrupt and unavailable storage; lesson progress preservation.');
// Boot the complete script chain in actual shell order to catch missing dependencies on other pages.
for(const name of ['index','path','practice','exams','sandbox','guide','messer']){
 const html=fs.readFileSync(path.join(root,name+'.html'),'utf8'),nodes=new Map(),main={innerHTML:'',querySelectorAll:()=>[]};
 const node=s=>{if(s==='#main')return main;if(!nodes.has(s))nodes.set(s,{value:'',textContent:'',classList:{add(){},toggle(){}},setAttribute(){},addEventListener(){},focus(){},querySelectorAll:()=>[]});return nodes.get(s);};
 const c={console,URLSearchParams,localStorage:{getItem:()=>null,setItem(){}},document:{querySelector:node,querySelectorAll:()=>[],getElementById:s=>node('#'+s)},window:{addEventListener(){},scrollTo(){}},location:{pathname:'/'+name+'.html',hash:name==='messer'?'#checkpoints':'',search:''},setInterval:()=>1,clearInterval(){}};
 vm.createContext(c);for(const match of html.matchAll(/<script src="\/?([^"?]+)(?:\?[^" ]+)?" defer><\/script>/g))vm.runInContext(fs.readFileSync(path.join(root,match[1]),'utf8'),c,{filename:match[1]});
 assert(main.innerHTML.length>100,`${name} renders with the complete script chain`);
 if(name==='index'||name==='path')assert(main.innerHTML.includes('Messer cumulative checkpoints'));
}
console.log('PASS: all seven complete page shells boot with the new checkpoint assets and overview/study-path integration.');
