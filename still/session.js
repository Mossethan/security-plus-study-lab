'use strict';
// A wall-clock timer: browser throttling does not stretch focus or break periods.
class PomodoroSession {
  constructor(minutes=25,pomodoro=true){this.minutes=minutes;this.pomodoro=pomodoro;this.status='idle';this.accumulatedMs=0;this.startedAt=0;}
  get running(){return this.status==='running';}
  get breakMinutes(){return this.pomodoro?({25:5,50:10,90:15}[this.minutes]||0):0;}
  totalElapsed(now=Date.now()){return this.accumulatedMs+(this.running?Math.max(0,now-this.startedAt):0);}
  start(now=Date.now()){if(!this.running){if(this.status==='complete')this.accumulatedMs=0;this.startedAt=now;this.status='running';}}
  pause(now=Date.now()){if(this.running){this.accumulatedMs=this.totalElapsed(now);this.status='paused';}}
  reset(minutes=this.minutes,now=Date.now(),keepRunning=this.running){this.minutes=minutes;this.accumulatedMs=0;this.startedAt=now;this.status=keepRunning?'running':'idle';}
  setMode(pomodoro,now=Date.now()){this.pomodoro=pomodoro;this.reset(this.minutes,now);}
  complete(){this.accumulatedMs=this.minutes*60000;this.status='complete';}
  snapshot(now=Date.now()){
    const totalMs=this.totalElapsed(now);
    if(!this.minutes)return {phase:'focus',cycle:1,totalMs,elapsedMs:totalMs,remainingMs:0,durationMs:0,completedFocus:0,finished:false};
    const focusMs=this.minutes*60000,breakMs=this.breakMinutes*60000,cycleMs=focusMs+breakMs;
    if(!this.pomodoro){const finished=totalMs>=focusMs;return {phase:'focus',cycle:1,totalMs,elapsedMs:Math.min(totalMs,focusMs),remainingMs:Math.max(0,focusMs-totalMs),durationMs:focusMs,completedFocus:finished?1:0,finished};}
    const cycleIndex=Math.floor(totalMs/cycleMs),offset=totalMs%cycleMs,phase=offset<focusMs?'focus':'break';
    const elapsedMs=phase==='focus'?offset:offset-focusMs,durationMs=phase==='focus'?focusMs:breakMs;
    return {phase,cycle:cycleIndex+1,totalMs,elapsedMs,durationMs,remainingMs:Math.max(0,durationMs-elapsedMs),completedFocus:cycleIndex+(phase==='break'?1:0),finished:false};
  }
  skipBreak(now=Date.now()){
    const s=this.snapshot(now);if(s.phase!=='break')return;
    this.accumulatedMs=s.cycle*(this.minutes+this.breakMinutes)*60000;this.startedAt=now;
  }
}
if(typeof module!=='undefined'&&module.exports)module.exports=PomodoroSession;
