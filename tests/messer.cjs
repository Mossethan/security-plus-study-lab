const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');
const data=fs.readFileSync(path.join(root,'messer-data.js'),'utf8');
const code=fs.readFileSync(path.join(root,'messer.js'),'utf8');
function create(saved={},unavailable=false){
 const nodes=new Map();const main={innerHTML:'',querySelectorAll:()=>[]};
 const node=id=>{if(!nodes.has(id))nodes.set(id,{value:'',textContent:'',focus(){},reportValidity:()=>true});return nodes.get(id);};
 const context={console,Map,WeakSet,Number,JSON,Object,Array,String,location:{hash:''},main,localStorage:{getItem:k=>saved[k]||null,setItem:(k,v)=>{if(unavailable)throw Error('disabled');saved[k]=v;}},document:{querySelector:s=>node(s),getElementById:s=>node('#'+s)},$:node,head:(a,b,c)=>`<h1>${b}</h1><p>${c}</p>`,esc:s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),shuffle:a=>[...a].reverse(),FormData:class{constructor(form){this.form=form;}get(){return String(this.form.choice);}}};
 vm.createContext(context);vm.runInContext(data+'\n'+fs.readFileSync(path.join(root,'messer-checkpoint-data.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'messer-checkpoints.js'),'utf8')+'\n'+code,context);
 return {context,nodes,saved,main,run:s=>vm.runInContext(s,context)};
}
const app=create();assert.equal(app.run('MESSER_LESSONS.length'),56);
app.run('messer()');assert(app.main.innerHTML.includes('Security Controls'));
app.run("const p=mProgress(MESSER_LESSONS[0]);mDone(MESSER_LESSONS[0]);mScore(MESSER_LESSONS[0]);");assert(app.run('p===mProgress(MESSER_LESSONS[0])'),'Render helpers must preserve event-handler state references');
app.nodes.get('#m-notes').oninput({target:{value:'<script>study notes</script>'}});
app.nodes.get('#m-watched').onchange({target:{checked:true}});
let form=app.nodes.get('#m-q-0');form.choice=0;form.onsubmit({preventDefault(){}});assert(app.main.innerHTML.includes('Not quite.'));
form=app.nodes.get('#m-q-1');form.choice=2;form.onsubmit({preventDefault(){}});
for(let i=0;i<4;i++)app.run(`$('#m-match-${i}').value='${i}'`);
form=app.nodes.get('#m-activity');form.onsubmit({preventDefault(){},target:form});
assert(!app.run('mDone(MESSER_LESSONS[0])'),'Extra questions must be completed too');
for(let i=2;i<app.run('MESSER_LESSONS[0].questions.length');i++){const f=app.nodes.get('#m-q-'+i);f.choice=app.run(`MESSER_LESSONS[0].questions[${i}].answer`);f.onsubmit({preventDefault(){}});}
assert(app.run('mDone(MESSER_LESSONS[0])'));assert.equal(app.run('mScore(MESSER_LESSONS[0])'),9);assert.equal(app.run('mProgress(MESSER_LESSONS[0]).best'),9);
assert(app.main.innerHTML.includes('&lt;script&gt;study notes&lt;/script&gt;'));
const reload=create(app.saved);reload.run('messer()');assert(reload.run('mDone(MESSER_LESSONS[0])'));assert(reload.run('mProgress(MESSER_LESSONS[0]).watched'));assert.equal(reload.run('mScore(MESSER_LESSONS[0])'),9);
reload.nodes.get('#m-retry').onclick();assert(!reload.run('mDone(MESSER_LESSONS[0])'));assert.equal(reload.run('mProgress(MESSER_LESSONS[0]).best'),9);assert.equal(reload.run('mProgress(MESSER_LESSONS[0]).notes'),'<script>study notes</script>');
for(let n=0;n<56;n++){
 reload.run(`location.hash='#'+MESSER_LESSONS[${n}].id;messer()`);
 assert(reload.main.innerHTML.includes(reload.run(`MESSER_LESSONS[${n}].title`)));
 reload.run(`MESSER_LESSONS[${n}].questions.forEach(q=>{if(q.answer<0||q.answer>=q.options.length)throw Error('Invalid answer')});`);
 for(let i=0;i<reload.run(`MESSER_LESSONS[${n}].questions.length`);i++){const f=reload.nodes.get('#m-q-'+i);f.choice=reload.run(`MESSER_LESSONS[${n}].questions[${i}].answer`);f.onsubmit({preventDefault(){}});}
 for(let i=0;i<4;i++)reload.run(`$('#m-match-${i}').value=String(MESSER_LESSONS[${n}].activity.items[${i}][1])`);
 const f=reload.nodes.get('#m-activity');f.onsubmit({preventDefault(){},target:f});
 assert.equal(reload.run(`mScore(MESSER_LESSONS[${n}])`),reload.run(`MESSER_LESSONS[${n}].questions.length+MESSER_LESSONS[${n}].activity.items.length`));
}
assert.equal(reload.run('MESSER_LESSONS.filter(mDone).length'),56);
const blocked=create({},true);blocked.run('messer()');assert(blocked.nodes.get('#messer-storage').textContent.includes('unavailable'));
const corrupt=create({'security-messer-v1':'{'});corrupt.run('messer()');assert(corrupt.main.innerHTML.includes('Security Controls'));
console.log('PASS: 56 lesson renders, all scoring, wrong-answer feedback, event-state identity, saved notes/answers, reload, retry, escaping, and unavailable storage.');
const lessons=app.run('MESSER_LESSONS');
assert.equal(new Set(lessons.map(l=>l.id)).size,56,'Lesson IDs must stay unique');
const legacy={'security-messer-v1':JSON.stringify({last:'deception-disruption',lessons:{'deception-disruption':{watched:true,notes:'Existing notes',answers:{0:1,1:0},matches:{0:0,1:1,2:2,3:3},checked:true,best:6}}})};
const upgraded=create(legacy);upgraded.run('messer()');
assert(upgraded.main.innerHTML.includes('Deception and Disruption'));
assert(upgraded.run('mDone(MESSER_LESSONS[7])'),'Earlier completion survives added lessons');
assert(upgraded.main.innerHTML.includes('Next: Change Management'));
assert.equal(upgraded.run('mProgress(MESSER_LESSONS[7]).notes'),'Existing notes');
upgraded.run("location.hash='#certificates';messer()");
assert(upgraded.main.innerHTML.includes('Video 18 / 56'));
assert(upgraded.main.innerHTML.includes('Next: Threat Actors'));
upgraded.run("location.hash='#zero-day-vulnerabilities';messer()");
assert(upgraded.main.innerHTML.includes('Video 38 / 56'));
assert(upgraded.main.innerHTML.includes('Next: An Overview of Malware'));
upgraded.run("location.hash='#hardening-techniques';messer()");
assert(upgraded.main.innerHTML.includes('Video 56 / 56'));
assert(upgraded.main.innerHTML.includes('Continue videos: Cloud Infrastructures'));
for(const l of lessons){
 assert(/^https:\/\/www.professormesser.com\//.test(new URL(l.slug,app.run('MESSER_BASE')).href));
 for(const item of l.activity.items) assert(Number.isInteger(item[1])&&item[1]>=0&&item[1]<l.activity.labels.length);
}
console.log('PASS: previous-release progress preservation, unique lesson IDs, answer ranges and next-lesson boundary.');

// A completed two-question review retains its answers and its original score denominator.
const previous={'security-messer-v1':JSON.stringify({last:'non-repudiation',lessons:{'non-repudiation':{watched:true,notes:'Alice signs; Bob verifies.',answers:{0:1,1:2},matches:{0:0,1:1,2:2,3:3},checked:true,best:6}}})};
const expanded=create(previous);expanded.run("const l=MESSER_LESSONS.find(l=>l.id==='non-repudiation');messer()");
assert.equal(expanded.run('l.questions.length'),8);
assert(!expanded.run('mDone(l)'));
assert.equal(expanded.run('mProgress(l).bestTotal'),6);
assert.equal(expanded.run('mProgress(l).answers[0]'),1);
assert(expanded.run('mProgress(l).checked'));
assert(expanded.main.innerHTML.includes('Best before extra questions: 6 / 6'));
assert(expanded.main.innerHTML.includes('6 questions remain'));
assert(expanded.main.innerHTML.includes('8 questions + 4 matches'));
assert(!expanded.main.innerHTML.includes('Submit both questions'));
assert(expanded.main.innerHTML.includes('Question 8 of 8'));
const expandedReload=create(previous);expandedReload.run('messer()');
assert.equal(expandedReload.run("mProgress(MESSER_LESSONS.find(l=>l.id==='non-repudiation')).bestTotal"),6);
for(let i=2;i<8;i++){const f=expanded.nodes.get('#m-q-'+i);f.choice=expanded.run(`l.questions[${i}].answer`);f.onsubmit({preventDefault(){}});}
assert(expanded.run('mDone(l)'));
assert.equal(expanded.run('mProgress(l).best'),12);
assert.equal(expanded.run('mProgress(l).bestTotal'),12);
assert(expanded.main.innerHTML.includes('Review complete · 12 / 12'));
expanded.nodes.get('#m-retry').onclick();
assert.equal(expanded.run('mProgress(l).best'),12);
assert.equal(expanded.run('mProgress(l).notes'),'Alice signs; Bob verifies.');
assert(expanded.run('mProgress(l).watched'));
const partial=create({'security-messer-v1':JSON.stringify({last:'non-repudiation',lessons:{'non-repudiation':{answers:{0:1},choices:{1:2},matches:{0:0},notes:'Halfway'}}})});partial.run('messer()');
assert.equal(partial.run("mProgress(MESSER_LESSONS[2]).choices[1]"),2);
assert.equal(partial.run("mProgress(MESSER_LESSONS[2]).answers[0]"),1);
assert(!partial.run('mDone(MESSER_LESSONS[2])'));
assert.equal(lessons.slice(0,38).filter(l=>l.questions.length>2).length,14);
assert.equal(lessons.reduce((sum,l)=>sum+l.questions.length,0),244);
console.log('PASS: 14 expanded reviews, legacy score denominators, resume extra questions, partial choices, reload and retry.');
