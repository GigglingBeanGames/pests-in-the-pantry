(() => {
  'use strict';
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  const saved=(key,fallback)=>{try{const v=localStorage.getItem(key);return v===null?fallback:v==='true';}catch{return fallback;}};
  let musicOn=saved('pitp-music',true),soundOn=saved('pitp-sound',true),ctx=null,musicGain=null,sfxGain=null,timer=null,step=0,nextNote=0;

  const melody=[76,null,79,81,79,76,74,null,72,74,76,null,71,74,76,null,76,79,83,81,79,null,76,74,72,null,74,71,72,null,67,null];
  const bass=[48,null,null,null,43,null,null,null,45,null,null,null,41,null,null,null];
  const hz=n=>440*Math.pow(2,(n-69)/12);
  function init(){
    if(!AudioContextClass)return false;
    if(!ctx){
      ctx=new AudioContextClass();
      musicGain=ctx.createGain();musicGain.gain.value=.16;musicGain.connect(ctx.destination);
      sfxGain=ctx.createGain();sfxGain.gain.value=.24;sfxGain.connect(ctx.destination);
    }
    if(ctx.state==='suspended')ctx.resume();
    return true;
  }
  function tone(freq,when,duration=.12,{type='sine',gain=.09,dest=sfxGain,slide=0}={}){
    if(!ctx||!dest)return;
    const osc=ctx.createOscillator(),amp=ctx.createGain();
    osc.type=type;osc.frequency.setValueAtTime(freq,when);if(slide)osc.frequency.exponentialRampToValueAtTime(Math.max(35,freq+slide),when+duration);
    amp.gain.setValueAtTime(.0001,when);amp.gain.exponentialRampToValueAtTime(gain,when+.008);amp.gain.exponentialRampToValueAtTime(.0001,when+duration);
    osc.connect(amp);amp.connect(dest);osc.start(when);osc.stop(when+duration+.02);
  }
  function noise(when,duration=.05,gain=.035,dest=sfxGain){
    if(!ctx)return;const size=Math.ceil(ctx.sampleRate*duration),buf=ctx.createBuffer(1,size,ctx.sampleRate),data=buf.getChannelData(0);
    for(let i=0;i<size;i++)data[i]=(Math.random()*2-1)*(1-i/size);
    const src=ctx.createBufferSource(),amp=ctx.createGain();src.buffer=buf;amp.gain.value=gain;src.connect(amp);amp.connect(dest);src.start(when);
  }
  function schedule(){
    if(!ctx||!musicOn)return;
    while(nextNote<ctx.currentTime+.18){
      const m=melody[step%melody.length],b=bass[step%bass.length];
      if(m!=null){tone(hz(m),nextNote,.16,{type:'triangle',gain:.075,dest:musicGain});tone(hz(m+12),nextNote+.012,.07,{type:'sine',gain:.025,dest:musicGain});}
      if(b!=null)tone(hz(b),nextNote,.22,{type:'triangle',gain:.04,dest:musicGain});
      if(step%2===0)noise(nextNote+.005,.025,.007,musicGain);
      nextNote+=.205;step++;
    }
  }
  function startMusic(){
    if(!musicOn||!init()||timer)return;
    musicGain.gain.setTargetAtTime(.16,ctx.currentTime,.04);
    nextNote=Math.max(ctx.currentTime+.05,nextNote);schedule();timer=setInterval(schedule,75);
  }
  function stopMusic(){if(timer){clearInterval(timer);timer=null;}if(musicGain&&ctx)musicGain.gain.setTargetAtTime(.0001,ctx.currentTime,.03);}
  function setMusic(on){musicOn=!!on;try{localStorage.setItem('pitp-music',musicOn);}catch{};updateButtons();if(musicOn){if(musicGain&&ctx)musicGain.gain.setTargetAtTime(.16,ctx.currentTime,.04);startMusic();}else stopMusic();}
  function setSound(on){soundOn=!!on;try{localStorage.setItem('pitp-sound',soundOn);}catch{};updateButtons();}
  function sfx(name){
    if(!soundOn||!init())return;const t=ctx.currentTime+.01;
    if(name==='tap'){tone(420,t,.045,{gain:.025});}
    else if(name==='draw'){noise(t,.07,.025);tone(220,t,.11,{type:'triangle',gain:.045,slide:100});}
    else if(name==='play'){noise(t,.055,.045);tone(145,t,.1,{type:'triangle',gain:.045,slide:-35});}
    else if(name==='power'){[0,4,7].forEach((x,i)=>tone(hz(67+x),t+i*.065,.16,{type:'triangle',gain:.055}));}
    else if(name==='pantry'){tone(180,t,.16,{type:'square',gain:.028,slide:-70});noise(t+.04,.1,.025);}
    else if(name==='trash'){noise(t,.18,.055);tone(115,t,.2,{type:'sawtooth',gain:.025,slide:-55});}
    else if(name==='win'){[60,64,67,72,76].forEach((n,i)=>tone(hz(n),t+i*.115,.42,{type:i<3?'triangle':'sine',gain:.09}));}
    else if(name==='lose'){[55,52,48].forEach((n,i)=>tone(hz(n),t+i*.16,.3,{type:'triangle',gain:.065}));}
  }
  function updateButtons(){
    const m=document.getElementById('musicToggle'),s=document.getElementById('soundToggle');
    if(m){m.setAttribute('aria-pressed',String(musicOn));m.classList.toggle('muted',!musicOn);m.title=musicOn?'Mute music':'Play music';}
    if(s){s.setAttribute('aria-pressed',String(soundOn));s.classList.toggle('muted',!soundOn);s.title=soundOn?'Mute sound effects':'Play sound effects';}
  }
  function bind(){
    updateButtons();
    document.getElementById('musicToggle')?.addEventListener('click',e=>{e.stopPropagation();init();setMusic(!musicOn);if(soundOn)sfx('tap');});
    document.getElementById('soundToggle')?.addEventListener('click',e=>{e.stopPropagation();init();setSound(!soundOn);if(soundOn)sfx('tap');});
    document.addEventListener('pointerdown',e=>{if(!e.target.closest('button,select,.game-card'))return;init();if(musicOn)startMusic();if(soundOn&&!e.target.closest('.audio-toggle'))sfx('tap');},{passive:true});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMusic();else if(musicOn&&ctx)startMusic();});
  }
  window.PITPAudio={sfx,startMusic,setMusic,setSound,get musicOn(){return musicOn;},get soundOn(){return soundOn;}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
