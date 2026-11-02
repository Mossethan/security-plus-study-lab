const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const PomodoroSession=require('../session.js');let checks=0;
function equal(actual,expected){assert.deepEqual(actual,expected);checks++;}
for(const [focus,rest] of [[25,5],[50,10],[90,15]]){
 const s=new PomodoroSession(focus);equal(s.breakMinutes,rest);s.start(0);
 equal(s.snapshot(focus*60000-1).phase,'focus');equal(s.snapshot(focus*60000).phase,'break');
 equal(s.snapshot(focus*60000).remainingMs,rest*60000);equal(s.snapshot((focus+rest)*60000).phase,'focus');
 equal(s.snapshot((focus+rest)*60000).cycle,2);equal(s.snapshot((focus+rest)*60000).completedFocus,1);
}
{
 const s=new PomodoroSession();s.start(0);s.pause(60000);equal(s.snapshot(900000).remainingMs,24*60000);s.start(900000);equal(s.snapshot(960000).remainingMs,23*60000);
 s.pause(2400000);equal(s.snapshot(9000000).phase,'break');const left=s.snapshot(9000000).remainingMs;s.start(9000000);equal(s.snapshot(9000000).remainingMs,left);
 s.skipBreak(9000000);equal(s.snapshot(9000000).phase,'focus');equal(s.snapshot(9000000).cycle,2);
 s.reset(50,9000001);equal(s.running,true);equal(s.snapshot(9000001).remainingMs,50*60000);
 const bg=new PomodoroSession();bg.start(0);equal(bg.snapshot(95*60000).cycle,4);equal(bg.snapshot(95*60000).completedFocus,3);equal(bg.snapshot(95*60000).remainingMs,20*60000);
 const unlimited=new PomodoroSession(0);unlimited.start(0);equal(unlimited.snapshot(3600000).totalMs,3600000);equal(unlimited.snapshot(3600000).completedFocus,0);
}
for(const minutes of [25,50,90]){
 const s=new PomodoroSession(minutes,false);s.start(0);
 equal(s.breakMinutes,0);equal(s.snapshot(minutes*60000-1).finished,false);
 equal(s.snapshot(minutes*60000).finished,true);equal(s.snapshot(10*minutes*60000).completedFocus,1);
 equal(s.snapshot(10*minutes*60000).phase,'focus');equal(s.snapshot(10*minutes*60000).remainingMs,0);
 s.complete();equal(s.running,false);s.start(10*minutes*60000);equal(s.snapshot(10*minutes*60000).remainingMs,minutes*60000);
}
// Exercise app transitions, with a controlled wall clock and observable audio lifecycle.
let now=0;const elements=new Map(),buttons=[25,50,90,0].map(minutes=>({dataset:{minutes:String(minutes)},classList:{toggle(){}},setAttribute(){},listeners:{},addEventListener(name,fn){this.listeners[name]=fn}}));
const modeButtons=['pomodoro','single'].map(timerMode=>({dataset:{timerMode},classList:{toggle(){}},setAttribute(){},listeners:{},addEventListener(name,fn){this.listeners[name]=fn}}));
function element(id){if(!elements.has(id))elements.set(id,{value:'',max:id==='pulse'?50:100,textContent:'',innerHTML:'',style:{setProperty(){}},classList:{toggle(){}},setAttribute(){},listeners:{},addEventListener(name,fn){this.listeners[name]=fn},getContext(){return {setTransform(){},clearRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){}}},clientWidth:350,clientHeight:270,showModal(){},close(){}});return elements.get(id);}
class Audio {constructor(){this.active=false;this.plays=0;this.pauses=0;}apply(){} async play(){if(this.fail)throw Error('Playback blocked');this.active=true;this.plays++;} async pause(){this.active=false;this.pauses++;}variation(){} }
const storage=new Map();const context={console,FocusAudio:Audio,PomodoroSession,document:{documentElement:{dataset:{}},getElementById:element,querySelectorAll:s=>s==='[data-minutes]'?buttons:s==='[data-timer-mode]'?modeButtons:[],body:{classList:{toggle(){}}},addEventListener(){}},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},setTimeout:()=>0,clearTimeout(){},setInterval(){},Date:class extends Date{static now(){return now}},navigator:{},matchMedia:()=>({matches:true}),devicePixelRatio:1};
// Session class must share the fake Date used by the app.
vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../session.js'),'utf8')+'\n'+fs.readFileSync(path.join(__dirname,'../app.js'),'utf8'),context);
async function run(code){return vm.runInContext(code,context)}
(async()=>{
 equal(element('timer').textContent,'25:00');await run('toggle()');equal(await run('engine.active'),true);
 now=25*60000;await run('tick()');equal(element('timer').textContent,'05:00');equal(await run('engine.active'),false);equal(await run('session.running'),true);equal(element('skipBreakBtn').hidden,false);equal(JSON.parse(storage.get('still-history')).length,1);
 await run('tick()');equal(JSON.parse(storage.get('still-history')).length,1);
 await run('toggle()');now+=60000;await run('tick()');equal(element('timer').textContent,'05:00');await run('toggle()');equal(await run('engine.active'),false);
 now+=5*60000;await run('tick()');equal(element('timer').textContent,'25:00');equal(await run('engine.active'),true);equal(element('skipBreakBtn').hidden,true);equal(element('timerState').textContent,'FOCUS · ROUND 2');
 now+=25*60000;await run('tick()');equal(await run('engine.active'),false);await run('resetSession()');equal(await run('engine.active'),true);equal(element('timer').textContent,'25:00');
 now+=25*60000;await run('tick()');await buttons[1].listeners.click();equal(await run('session.snapshot().phase'),'focus');equal(await run('engine.active'),true);equal(element('timer').textContent,'50:00');
 await run('toggle()');await buttons[3].listeners.click();await run('toggle()');now+=3600000;await run('tick()');equal(element('timer').textContent,'60:00');equal(await run('engine.active'),true);
 await run('toggle()');await buttons[0].listeners.click();await run('toggle()');now+=95*60000;await run('tick()');equal(element('timerState').textContent,'FOCUS · ROUND 4');equal(await run('reportedFocus'),3);
 await run('toggle()');await run('engine.fail=true');await run('toggle()');equal(await run('session.running'),false);equal(element('timerPlayBtn').disabled,false);
 await run('engine.fail=false');await modeButtons[1].listeners.click();equal(await run('settings.timerMode'),'single');equal(element('sessionTitle').textContent,'Focus timer');equal(buttons[0].textContent,'25 min');equal(JSON.parse(storage.get('still-settings')).timerMode,'single');
 const before=JSON.parse(storage.get('still-history')).length;
 await run('toggle()');now+=25*60000;await run('tick()');equal(element('timer').textContent,'00:00');equal(element('timerState').textContent,'SESSION COMPLETE');equal(await run('engine.active'),false);equal(await run('session.status'),'complete');
 now+=60*60000;await run('tick()');equal(element('timer').textContent,'00:00');equal(JSON.parse(storage.get('still-history')).length,before+1);
 await run('toggle()');equal(element('timer').textContent,'25:00');now+=25*60000;await run('tick()');equal(JSON.parse(storage.get('still-history')).length,before+2);
 await modeButtons[0].listeners.click();equal(element('sessionTitle').textContent,'Pomodoro timer');equal(buttons[0].textContent,'25 / 5');await run('toggle()');now+=25*60000;await run('tick()');equal(await run('session.snapshot().phase'),'break');await modeButtons[1].listeners.click();equal(await run('session.snapshot().phase'),'focus');equal(await run('engine.active'),true);
 const fresh={...context};vm.createContext(fresh);vm.runInContext(fs.readFileSync(path.join(__dirname,'../session.js'),'utf8')+'\n'+fs.readFileSync(path.join(__dirname,'../app.js'),'utf8'),fresh);equal(vm.runInContext('settings.timerMode',fresh),'single');equal(vm.runInContext('session.pomodoro',fresh),false);
 console.log(`${checks} checks passed: cycle boundaries, break silence, automatic restart, pause/resume, skip, reset, duration change, background catch-up, history, unlimited mode, playback failure, single-session completion/restart, mode changes, and saved preference.`);
})().catch(e=>{console.error(e);process.exitCode=1;});
