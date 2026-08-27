// Pests in the Pantry v26.6 — public UI polish and Pest Control naming
'use strict';

const COLORS=['green','red','blue','gold'];
const COLOR_NAMES=['Green','Red','Blue','Gold'];
const PESTS={
  0:{name:'Rat',icon:'🐀',art:'assets/pests/rat.png',copies:8,effect:'Play on anything. Reset to 0.'},
  1:{name:'Ant',icon:'🐜',art:'assets/pests/ant.png',copies:8,effect:'Take 1 face-up Pantry Pest.'},
  2:{name:'Raccoon',icon:'🦝',art:'assets/pests/raccoon.png',copies:8,effect:'May take 1 numbered Pest from Trash.'},
  3:{name:'Moth',icon:'🦋',art:'assets/pests/moth.png',copies:12,effect:'Clear pile to Trash; play again.'},
  4:{name:'Fly',icon:'🪰',art:'assets/pests/fly.png',copies:12,effect:'Reveal 1 face-down Pantry Pest.'},
  5:{name:'Hornet',icon:'🐝',art:'assets/pests/hornet.png',copies:8,effect:'Attack +2; next player loses turn.'},
  6:{name:'Mosquito',icon:'🦟',art:'assets/pests/mosquito.png',copies:12,effect:'Attack +1; next player loses turn.'},
  7:{name:'Beetle',icon:'🪲',art:'assets/pests/beetle.png',copies:12,effect:'Blocks the entire attack.'},
  8:{name:'Termite',icon:'🐛',art:'assets/pests/termite.png',copies:12,effect:'Everyone passes 1 card left.'},
  9:{name:'Scorpion',icon:'🦂',art:'assets/pests/scorpion.png',copies:4,effect:'Everyone draws 1.'},
  10:{name:'Cockroach',icon:'🪳',art:'assets/pests/cockroach.png',copies:8,effect:'You draw 1.'},
  S:{name:'Pest Control',icon:'🕷️',art:'assets/pests/spider.png',copies:4,effect:'Opt out of a power or use to pass.'}
};

const BOT_TYPES={
  Basic:{
    image:'assets/profile-basic.png',
    description:'Plays a simple, balanced game without getting too fancy. He may not be a genius, but he has a few tricks up his sleeve.',
    names:['Doug','Erik','Greg','Carl','Kevin','Steve','Dale']
  },
  Runner:{
    image:'assets/profile-runner.png',
    description:'Builds his game around creating powerful runs, even going out of his way to set them up. Why play one card when you can play six?',
    names:['Dash','Ricky','Scooter','Andrew','Dexter','Terry','Turbo']
  },
  Aggressor:{
    image:'assets/profile-aggressor.png',
    description:'Attacks whenever he gets the chance and loves creating chaos any chance he gets. Peace was never an option.',
    names:['Spike','Brutus','Rocco','Rex','Butch','Fang','Brock','Gunner']
  },
  Random:{
    image:'assets/profile-random.png',
    description:'Picks a bot at random when the game starts. Random will never choose Goofball.',
    names:['Random']
  },
  Goofball:{
    image:'assets/profile-goofball.png',
    description:'Makes terrible decisions with remarkable consistency. If there’s a bad move available, he will probably find it.',
    names:['Bingo','Bobby','Doodle','Pickles','Wally','Pogo','Wobbles']
  },
  Expert:{
    image:'assets/profile-expert.png',
    description:'Adapts to his hand and his opponents, playing with near-perfect precision. He isn’t just here to win. He’s here to dominate.',
    names:['Professor Grant','Arthur','Walter','Eugene','Theodore','Dr. Sterling','Cornelius']
  },
  Grandmaster:{
    image:'assets/profile-grandmaster.png',
    description:'He learned from the best and has flown his way to the top. With his all-seeing eyes he has every card counted and knows your every move long before you do.',
    names:['Master Chester','Master Missy','Master Oswald']
  }
};


// v13: evolutionary-trained Expert policy.
// Trained against three Basic bots with a hidden top-two draw choice.
const TRAINED_EXPERT_POLICY={
  card:{0:-8.02,1:.03,2:-4.50,3:3.69,4:.50,5:6.83,6:-.74,7:-2.23,8:3.17,9:-1.84,10:3.23},
  dupBonus:8.08,
  runBonus:7.40,
  runLenBonus:2.74,
  oneFaceup:12.05,
  sevenHidden:3.22,
  twoUseful:3.02,
  fiveLow:4.55,
  sixDefense:6.14,
  attackThreat:2.02,
  zeroHold:4.07,
  passDupProtect:12.92,
  passLow:5.69,
  passPlayableProtect:2.24,
  drawDuplicate:9.87,
  drawRunComplete:17.42,
  drawRunPotential:6.05,
  drawSpider:2.89,
  drawPlayable:9.02,
  trashOne:7.47,
  trashFive:3.76
};
const TRAINED_GRANDMASTER_POLICY={
  // Grandmaster v4 — final frozen brain after 100,000-game refinement.
  card:{0:-2.2470653943,1:.1666435992,2:-4.6622283661,3:-4.9799020173,4:-.7085897341,5:19.0034001258,6:-2.6973584764,7:-1.7896507774,8:7.0633817806,9:4.7578866477,10:7.8317230230},
  dupBonus:10.1593830114, runBonus:-1.69634353899, runLenBonus:8.85037708357,
  oneFaceup:16.0857078662, sevenHidden:3.31115403827, twoUseful:-.3604451302, fiveLow:8.98230492856,
  sixDefense:.6409262501, attackThreat:.7525303612, zeroHold:3.28737564770,
  passDupProtect:17.9670018077, passLow:7.46605928769, passPlayableProtect:-.2385064599,
  drawDuplicate:14.8256932046, drawRunComplete:8.26500603322, drawRunPotential:.9884239914,
  drawSpider:10.7500214027, drawPlayable:15.3212701293, trashOne:10.8467012476, trashFive:.4072704359
};
const POWER_SEMANTIC={0:0,1:1,2:2,3:5,4:7,5:3,6:4,7:6,8:8,9:9,10:10};
function powerSemantic(n){return Object.prototype.hasOwnProperty.call(POWER_SEMANTIC,n)?POWER_SEMANTIC[n]:n;}

function expertPolicyFor(pi){
  const p=G?.players?.[pi];
  if(p?.grantBrain)return TRAINED_EXPERT_POLICY;
  return p?.baseStrategy==='Grandmaster'?TRAINED_GRANDMASTER_POLICY:TRAINED_EXPERT_POLICY;
}
function trainedExpertCardBias(n,pi=null){
  const P=pi===null?TRAINED_EXPERT_POLICY:expertPolicyFor(pi);
  return P.card[powerSemantic(n)]??0;
}

// v14: evolutionary-trained pure Runner policy.
// This brain was trained for run construction, not win rate. Runner uses it
// only before upgrading; Advanced Runner routes into the existing Expert brain.
const TRAINED_RUNNER_POLICY={
  card:{0:-2.6438,1:-5.4622,2:2.8098,3:-4.3659,4:3.0570,5:.8924,6:1.5279,7:2.6970,8:-2.5929,9:2.1571,10:4.6844},
  dup:-.8952,
  run:{3:-5.6469,4:1.9052,5:7.4478,6:11.4248,7:17.9510,8:24.6136},
  potential:4.5719,
  playable:3.3327,
  chain:{2:5.7830,3:8.6655,4:6.3982,5:6.6540,6:4.7294},
  extendOne:5.3400,
  bridgeGap:5.6717,
  protectChain:3.8529,
  holdCompleted:6.0261,
  trashExact:5.8729,
  drawExact:6.7625,
  colorDensity:4.5605,
  dumpOffcolor:2.2837,
  passRunProtect:7.3111,
  passLow:-.0762
};
function trainedRunnerCardBias(n){return TRAINED_RUNNER_POLICY.card[n]??0;}
function isPureRunner(p){return (p.baseStrategy||p.strategy)==='Runner'&&!p.runnerExpert;}
function usesExpertBrain(p){return p.strategy==='Expert';}


// v22.3 updated shared Grant brain. Basic / Expert / Grandmaster differ mainly by
// how many draw cards they can inspect. Advanced Runner and Fully Enraged
// Aggressor also switch into this brain.
function grantRunKeys(hand){
  const out=new Set();
  for(let c=0;c<4;c++){
    const nums=[...new Set(hand.filter(x=>x.n!=='S'&&x.c===c).map(x=>x.n))].sort((a,b)=>a-b);
    let i=0;
    while(i<nums.length){
      let j=i;
      while(j+1<nums.length&&nums[j+1]===nums[j]+1)j++;
      if(j-i+1>=3){
        for(let a=i;a<=j-2;a++){
          for(let b=a+2;b<=j;b++)out.add(`${c}:${nums.slice(a,b+1).join(',')}`);
        }
      }
      i=j+1;
    }
  }
  return out;
}
function grantRunPotentialScore(hand){
  let score=0;
  for(let c=0;c<4;c++){
    const nums=new Set(hand.filter(x=>x.n!=='S'&&x.c===c).map(x=>x.n));
    for(const n of nums){
      score+=1;
      if(nums.has(n+1))score+=6;
      if(nums.has(n+2))score+=2;
    }
  }
  return score;
}
function grantBrainDrawOne(pi){
  if(!G.deck.length)recycle();
  if(!G.deck.length)return null;

  const p=G.players[pi];
  const count=Math.min(Math.max(1,p.drawVision||1),G.deck.length);
  const viewed=G.deck.splice(G.deck.length-count,count);
  let pick=null;

  // UPDATED GRANT DRAW CHECKLIST:
  // 1) Complete or extend a real run.
  const beforeRuns=grantRunKeys(p.hand);
  const runCandidates=[];
  for(const card of viewed){
    if(card.n==='S')continue;
    const after=[...p.hand,card];
    const afterRuns=grantRunKeys(after);
    const fresh=[...afterRuns].filter(k=>!beforeRuns.has(k));
    if(fresh.length){
      const maxLen=Math.max(...fresh.map(k=>k.split(':')[1].split(',').length));
      runCandidates.push({card,maxLen,potential:grantRunPotentialScore(after)});
    }
  }
  if(runCandidates.length){
    runCandidates.sort((a,b)=>
      b.maxLen-a.maxLen ||
      b.potential-a.potential ||
      b.card.n-a.card.n ||
      b.card.c-a.card.c
    );
    pick=runCandidates[0].card;
  }

  // 2) Spider.
  if(!pick){
    pick=viewed.find(c=>c.n==='S')||null;
  }

  // 3) Duplicate. Prefer the number Grant already owns the MOST copies of.
  //    Ties go to the higher number, then the strongest available color.
  if(!pick){
    const counts={};
    for(const c of p.hand){
      if(typeof c.n==='number')counts[c.n]=(counts[c.n]||0)+1;
    }
    const duplicateChoices=viewed.filter(c=>typeof c.n==='number'&&(counts[c.n]||0)>0);
    if(duplicateChoices.length){
      duplicateChoices.sort((a,b)=>
        (counts[b.n]-counts[a.n]) ||
        b.n-a.n ||
        b.c-a.c
      );
      pick=duplicateChoices[0];
    }
  }

  // 4) Otherwise take the highest number, strongest color of that number.
  if(!pick){
    const numbered=viewed.filter(c=>typeof c.n==='number');
    if(numbered.length){
      numbered.sort((a,b)=>b.n-a.n||b.c-a.c);
      pick=numbered[0];
    }else{
      pick=viewed[0]||null;
    }
  }

  if(!pick)return null;
  const idx=viewed.findIndex(c=>c.id===pick.id);
  if(idx>=0)viewed.splice(idx,1);
  shuffle(viewed);
  G.deck.unshift(...viewed);
  return pick;
}

function isRageAggressor(p){return p?.baseStrategy==='Aggressor'&&!p.advancedAggressor;}
function isMegaRunner(p){return p?.baseStrategy==='Runner'&&!p.runnerExpert;}
function makeGrantBrain(p,drawVision){p.grantBrain=true;p.drawVision=drawVision;p.strategy='Expert';}

// Runner's sacred-five helpers.
function runnerSacredFiveInfo(hand){
  const candidates=[];
  for(let c=0;c<4;c++){
    const nums=[...new Set(hand.filter(x=>x.n!=='S'&&x.c===c).map(x=>x.n))].sort((a,b)=>a-b);
    for(let i=0;i<nums.length;i++){
      let j=i;while(j+1<nums.length&&nums[j+1]===nums[j]+1)j++;
      if(j-i+1>=5){
        const lo=nums[i],hi=nums[j],targets=[];
        if(lo>0)targets.push({n:lo-1,c});if(hi<10)targets.push({n:hi+1,c});
        candidates.push({c,lo,hi,len:j-i+1,targets});
      }
      i=j;
    }
  }
  if(!candidates.length)return null;
  candidates.sort((a,b)=>b.len-a.len||a.lo-b.lo);return candidates[0];
}
function runnerTargetMatch(card,t){return !!card&&card.n===t.n&&card.c===t.c;}
function runnerTargetInTrash(p){const s=runnerSacredFiveInfo(p.hand);return s?G.out.find(c=>c.n!=='S'&&s.targets.some(t=>runnerTargetMatch(c,t)))||null:null;}
function runnerNeighborScore(hand,card){
  if(!card||card.n==='S')return -999;
  let score=0;
  for(const h of hand){if(h.id===card.id||h.n==='S'||h.c!==card.c)continue;const d=Math.abs(h.n-card.n);if(d===1)score+=6;else if(d===2)score+=2;else if(d===3)score+=.5;}
  const nums=runnerColorNums(hand,card.c);
  for(let i=0;i<nums.length;i++){let j=i;while(j+1<nums.length&&nums[j+1]===nums[j]+1)j++;if(card.n>=nums[i]&&card.n<=nums[j]&&j-i+1>=3)score+=(j-i+1)*8;i=j;}
  return score;
}
function runnerBestChainLenWith(hand,card){
  if(!card||card.n==='S')return 0;
  const nums=[...new Set(hand.filter(x=>x.n!=='S'&&x.c===card.c).map(x=>x.n).concat([card.n]))].sort((a,b)=>a-b);
  let best=1;for(let i=0;i<nums.length;i++){let j=i;while(j+1<nums.length&&nums[j+1]===nums[j]+1)j++;best=Math.max(best,j-i+1);i=j;}return best;
}
function runnerBuildValue(p,card){
  if(card.n==='S')return -100;
  const len=runnerBestChainLenWith(p.hand,card);let v=len*30;
  if(len>=6)v+=10000;else if(len===5)v+=1200;else if(len===4)v+=450;else if(len===3)v+=140;
  if(card.n<=7)v+=25;if(card.n===2)v+=35;return v;
}
function runnerTopDrawOne(pi){
  if(!G.deck.length)recycle();if(!G.deck.length)return null;
  const p=G.players[pi],count=Math.min(10,G.deck.length),viewed=G.deck.splice(G.deck.length-count,count);let base=null;
  const sacred=runnerSacredFiveInfo(p.hand);
  if(sacred){
    base=viewed.find(c=>sacred.targets.some(t=>runnerTargetMatch(c,t)))||null;
    if(!base&&runnerTargetInTrash(p)){
      const twos=viewed.filter(c=>c.n===2&&c.c!==sacred.c);if(twos.length)base=[...twos].sort((a,b)=>a.c-b.c)[0];
    }
  }
  if(!base)base=[...viewed].sort((a,b)=>runnerBuildValue(p,b)-runnerBuildValue(p,a))[0];
  const idx=viewed.findIndex(x=>x.id===base.id);viewed.splice(idx,1);shuffle(viewed);G.deck.unshift(...viewed);return base;
}
function aggressorTopDrawOne(pi){
  if(!G.deck.length)recycle();if(!G.deck.length)return null;
  const p=G.players[pi],count=Math.min(10,G.deck.length),viewed=G.deck.splice(G.deck.length-count,count);let base=null;
  const nines=viewed.filter(c=>c.n===9);if(nines.length)base=[...nines].sort((a,b)=>a.c-b.c)[0];
  else{
    const has5=p.hand.some(c=>c.n===5),has6=p.hand.some(c=>c.n===7),spider=viewed.find(c=>c.n==='S');
    if(has5&&has6&&spider)base=spider;
    else for(const n of [6,5]){const opts=viewed.filter(c=>c.n===n);if(opts.length){base=[...opts].sort((a,b)=>a.c-b.c)[0];break;}}
  }
  if(!base)base=[...viewed].sort((a,b)=>trainedExpertDrawValue(pi,b)-trainedExpertDrawValue(pi,a))[0];
  const idx=viewed.findIndex(x=>x.id===base.id);viewed.splice(idx,1);shuffle(viewed);G.deck.unshift(...viewed);return base;
}

function runnerColorNums(hand,color){
  return [...new Set(hand.filter(x=>x.n!=='S'&&x.c===color).map(x=>x.n))].sort((a,b)=>a-b);
}
function runnerLongestChain(hand){
  let best=0;
  for(let c=0;c<4;c++){
    const nums=runnerColorNums(hand,c);
    let cur=0,prev=null;
    for(const n of nums){
      cur=(prev!==null&&n===prev+1)?cur+1:1;
      if(cur>best)best=cur;
      prev=n;
    }
  }
  return best;
}
function runnerExactExtenders(hand){
  const keys=new Set();
  for(let c=0;c<4;c++){
    const nums=runnerColorNums(hand,c);
    let i=0;
    while(i<nums.length){
      let j=i;
      while(j+1<nums.length&&nums[j+1]===nums[j]+1)j++;
      if(j-i+1>=2){
        if(nums[i]>0)keys.add(`${nums[i]-1}:${c}`);
        if(nums[j]<10)keys.add(`${nums[j]+1}:${c}`);
      }
      i=j+1;
    }
  }
  return keys;
}
function runnerBridgeCards(hand){
  const keys=new Set();
  for(let c=0;c<4;c++){
    const nums=new Set(runnerColorNums(hand,c));
    for(let n=1;n<10;n++)if(nums.has(n-1)&&nums.has(n+1)&&!nums.has(n))keys.add(`${n}:${c}`);
  }
  return keys;
}
function runnerChainProfile(hand){
  const P=TRAINED_RUNNER_POLICY;
  let score=0;
  for(let c=0;c<4;c++){
    const nums=runnerColorNums(hand,c);
    let i=0;
    while(i<nums.length){
      let j=i;
      while(j+1<nums.length&&nums[j+1]===nums[j]+1)j++;
      const len=j-i+1;
      for(let k=2;k<=Math.min(len,6);k++)score+=P.chain[k]??0;
      i=j+1;
    }
  }
  return score;
}
function runnerDrawValue(pi,card){
  const p=G.players[pi],P=TRAINED_RUNNER_POLICY;
  if(card.n==='S')return 6.9072;
  let v=trainedRunnerCardBias(card.n);
  if(p.hand.some(x=>x.n===card.n))v+=P.dup;
  const key=`${card.n}:${card.c}`;
  const beforeLongest=runnerLongestChain(p.hand);
  const afterHand=[...p.hand,card];
  const afterLongest=runnerLongestChain(afterHand);
  if(runnerExactExtenders(p.hand).has(key))v+=P.drawExact+P.extendOne*(Math.max(1,afterLongest-beforeLongest));
  if(runnerBridgeCards(p.hand).has(key))v+=P.bridgeGap;
  v+=runnerChainProfile(afterHand)-runnerChainProfile(p.hand);
  v+=p.hand.filter(x=>x.n!=='S'&&x.c===card.c).length*P.colorDensity;
  v+=(runPotentialObj(afterHand)-runPotentialObj(p.hand))*P.potential;
  if(runCompletionLength(p.hand,card)>=3)v+=P.run[5]+6;
  if(legalCard(card,G.top))v+=P.playable;
  return v;
}
function runnerNormalScore(pi,card,count){
  const p=G.players[pi],P=TRAINED_RUNNER_POLICY,n=card.n;
  const removing=p.hand.filter(x=>x.n===n);
  const after=p.hand.filter(x=>x.n!==n);
  let v=trainedRunnerCardBias(n)+P.dup*Math.max(0,count-1);
  const chainLoss=runnerChainProfile(p.hand)-runnerChainProfile(after);
  const longestLoss=runnerLongestChain(p.hand)-runnerLongestChain(after);
  v-=chainLoss*P.protectChain;
  v-=Math.max(0,longestLoss)*P.protectChain*2;
  const colorCounts=[0,1,2,3].map(c=>p.hand.filter(x=>x.n!=='S'&&x.c===c).length);
  const maxColor=Math.max(...colorCounts);
  const dominant=new Set(colorCounts.map((v,i)=>v===maxColor?i:-1).filter(i=>i>=0));
  if(removing.length&&removing.every(x=>!dominant.has(x.c)))v+=P.dumpOffcolor;
  return v;
}
function runnerRunScore(pi,cards){
  const P=TRAINED_RUNNER_POLICY,L=cards.length;
  let v=(P.run[Math.min(L,8)]??P.run[8])+L*1.5;
  const seq=[...cards].sort((a,b)=>a.n-b.n).map(x=>x.n);
  if(seq.length&&((seq[0]>0)||(seq.at(-1)<10)))v-=P.holdCompleted;
  return v;
}
function runnerRetrieveChoice(pi,cards){
  const p=G.players[pi],P=TRAINED_RUNNER_POLICY;
  if(!cards.length)return null;
  const ext=runnerExactExtenders(p.hand),bridges=runnerBridgeCards(p.hand);
  const beforeProfile=runnerChainProfile(p.hand),beforePotential=runPotentialObj(p.hand);
  const scored=cards.map(c=>{
    const key=`${c.n}:${c.c}`;
    let v=trainedRunnerCardBias(c.n);
    if(ext.has(key))v+=P.trashExact+P.extendOne;
    if(bridges.has(key))v+=P.bridgeGap;
    v+=runnerChainProfile([...p.hand,c])-beforeProfile;
    v+=(runPotentialObj([...p.hand,c])-beforePotential)*(-3.4089);
    if(runCompletionLength(p.hand,c)>=3)v+=-2.5308;
    return {c,v};
  }).sort((a,b)=>b.v-a.v);
  return scored[0]?.c??null;
}


const RANDOM_BOT_STRATEGIES=['Basic','Runner','Aggressor','Expert','Grandmaster'];
function resolveBotStrategy(strategy){return strategy==='Random'?RANDOM_BOT_STRATEGIES[rand(RANDOM_BOT_STRATEGIES.length)]:strategy;}
function botType(strategy){return BOT_TYPES[strategy]||BOT_TYPES.Basic;}
function randomBotName(strategy,used=new Set()){
  const names=botType(strategy).names;
  const available=names.filter(n=>!used.has(n));
  const pool=available.length?available:names;
  return pool[rand(pool.length)];
}

const els={
 setup:document.getElementById('setupScreen'),game:document.getElementById('gameScreen'),start:document.getElementById('startBtn'),resume:document.getElementById('resumeBtn'),home:document.getElementById('homeBtn'),rules:document.getElementById('rulesBtn'),fastBotsWrap:document.getElementById('fastBotsWrap'),fastBotsToggle:document.getElementById('fastBotsToggle'),showHandsWrap:document.getElementById('showHandsWrap'),showHandsToggle:document.getElementById('showHandsToggle'),hideSpiderWrap:document.getElementById('hideSpiderWrap'),hideSpiderToggle:document.getElementById('hideSpiderToggle'),fastBotsInfo:document.getElementById('fastBotsInfoBtn'),hideSpiderInfo:document.getElementById('hideSpiderInfoBtn'),selectWinner:document.getElementById('selectWinnerBtn'),introStart:document.getElementById('introStartBtn'),introRules:document.getElementById('introRulesBtn'),titleIntro:document.getElementById('titleIntro'),setupPanel:document.getElementById('setupPanel'),
 opponents:document.getElementById('opponents'),current:document.getElementById('currentCard'),drawCount:document.getElementById('drawCount'),outCount:document.getElementById('outCount'),outPile:document.getElementById('outPile'),drawPile:document.getElementById('drawPile'),
 status:document.getElementById('status'),play:document.getElementById('playBtn'),draw:document.getElementById('drawBtn'),spiderPass:document.getElementById('spiderPassBtn'),
 pantry:document.getElementById('yourPantry'),hand:document.getElementById('yourHand'),youMeta:document.getElementById('youMeta'),turnBadge:document.getElementById('turnBadge'),turnCounter:document.getElementById('turnCounter'),toast:document.getElementById('toast'),cardHoverTip:document.getElementById('cardHoverTip'),lastPlayedBy:document.getElementById('lastPlayedBy'),sortColor:document.getElementById('sortColorBtn'),sortNumber:document.getElementById('sortNumberBtn'),log:document.getElementById('log'),clearLog:document.getElementById('clearLogBtn'),
 modal:document.getElementById('modal'),modalBody:document.getElementById('modalBody'),modalClose:document.getElementById('modalClose')
};

let G=null;
let selected=new Set();
let humanResolver=null;
let modalResolver=null;
let handSortMode='number';
let homePaused=false;
let pileClearing=false;
let gameSessionId=0;
let humanIdleReactionTimer=null;
let reactionSequence=0;
const newHumanCardIds=new Set();

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const botThinkDelay=()=>els.fastBotsToggle?.checked?0:3000+Math.random()*2000;
const humanSpiderPopupsHidden=()=>Boolean(els.hideSpiderToggle?.checked);
async function waitWhileHome(session=gameSessionId){
  while(homePaused&&G&&!G.over&&session===gameSessionId)await sleep(100);
}
const rand=n=>Math.floor(Math.random()*n);
function shuffle(a){for(let i=a.length-1;i>0;i--){let j=rand(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
function cardLabel(c){return c.n==='S'?'Pest Control':`${COLOR_NAMES[c.c]} ${c.n} ${PESTS[c.n].name}`;}
function log(msg){
  const d=document.createElement('div');
  d.textContent=msg;
  els.log.prepend(d);
}


const BOT_REACTION_POOLS={
  Basic:{
    draw:['😢','😬','😅'],bigDraw:['😭','😵'],annoyed:['😒','🙄'],laugh:['😂','😆'],
    celebrate:['🎉','😄','🥳'],win:['🏆','😎','🎉'],lose:['😠','😤'],bored:['🥱','😴']
  },
  Runner:{
    draw:['😤','😩','💨'],bigDraw:['😭','😫'],annoyed:['😑','😤'],laugh:['🤣','😎'],
    celebrate:['🏃💨','🎉','😎'],win:['🏆','💨','🥳'],lose:['😡','😤'],bored:['🥱','💤']
  },
  Aggressor:{
    draw:['😡','🤬','😤'],bigDraw:['🤬','💀','😡'],annoyed:['🤬','😠'],laugh:['😂','😈','💀'],
    celebrate:['🔥','😈','🎉'],win:['🏆','😈','🔥'],lose:['🤬','😡','💢'],bored:['😒','🥱']
  },
  Goofball:{
    draw:['😭','🤡','😵'],bigDraw:['😭','💀','🤡'],annoyed:['😵‍💫','🙃'],laugh:['🤣','🤪','😂'],
    celebrate:['🥳','🤡','🎉'],win:['🏆','🤪','🥳'],lose:['😭','🤡','😡'],bored:['😴','🥱','💤']
  },
  Expert:{
    draw:['😐','🙄','😒'],bigDraw:['😑','😤'],annoyed:['🙄','😑'],laugh:['😏','😂'],
    celebrate:['😌','🎉','🤓'],win:['🏆','🤓','😏'],lose:['😤','🙄'],bored:['⌛','🥱','😐']
  },
  Grandmaster:{
    draw:['👁️','😒','😤'],bigDraw:['😑','🔮','😤'],annoyed:['👁️','🙄'],laugh:['😏','😂','🔮'],
    celebrate:['🔮','🎉','👁️'],win:['🏆','👁️','🔮'],lose:['😡','👁️','💢'],bored:['👁️','🥱','⌛']
  }
};
function reactionPoolFor(pi,type){
  const p=G?.players?.[pi];
  if(!p)return ['🙂'];
  const key=p.baseStrategy||p.strategy||'Basic';
  const pool=BOT_REACTION_POOLS[key]||BOT_REACTION_POOLS.Basic;
  return pool[type]||pool.annoyed||['🙂'];
}
function queueBotReaction(pi,type='annoyed',{chance=.82,minDelay=100,maxDelay=720,duration=2300}={}){
  if(!G||pi===0||G.over&&type!=='win'&&type!=='lose')return;
  if(Math.random()>chance)return;
  const session=gameSessionId;
  const delay=minDelay+Math.random()*Math.max(0,maxDelay-minDelay);
  const seq=++reactionSequence;
  setTimeout(()=>{
    if(!G||session!==gameSessionId)return;
    const p=G.players[pi];
    if(!p)return;
    const pool=reactionPoolFor(pi,type);
    p.botReaction={emoji:pool[rand(pool.length)],seq};
    render();
    setTimeout(()=>{
      if(!G||session!==gameSessionId)return;
      if(G.players[pi]?.botReaction?.seq===seq){
        G.players[pi].botReaction=null;
        render();
      }
    },duration+Math.random()*700);
  },delay);
}
function reactToDraw(victimPi,amount=1){
  if(!G)return;
  const victim=G.players[victimPi];
  const beforeTotal=totalCards(victimPi);
  if(victimPi!==0){
    const type=amount>=2?'bigDraw':(beforeTotal<=3?'annoyed':'draw');
    queueBotReaction(victimPi,type,{chance:amount>=2?.97:.78,minDelay:80,maxDelay:520});
  }
  if(amount>=2){
    for(let q=1;q<4;q++){
      if(q===victimPi)continue;
      queueBotReaction(q,'laugh',{chance:.46,minDelay:300,maxDelay:1450,duration:1800});
    }
  }else if(victimPi===0&&beforeTotal<=3){
    for(let q=1;q<4;q++)queueBotReaction(q,'laugh',{chance:.34,minDelay:420,maxDelay:1500});
  }
}
function reactPantryCleared(pi){
  if(pi===0){
    for(let q=1;q<4;q++)queueBotReaction(q,'annoyed',{chance:.31,minDelay:220,maxDelay:1250});
    return;
  }
  queueBotReaction(pi,'celebrate',{chance:.94,minDelay:100,maxDelay:600,duration:2700});
}
function reactGameEnd(winnerPi){
  for(let q=1;q<4;q++){
    if(q===winnerPi)queueBotReaction(q,'win',{chance:1,minDelay:40,maxDelay:250,duration:3500});
    else queueBotReaction(q,'lose',{chance:.9,minDelay:100,maxDelay:600,duration:3300});
  }
}
function clearHumanIdleReactionTimer(){
  if(humanIdleReactionTimer){
    clearTimeout(humanIdleReactionTimer);
    humanIdleReactionTimer=null;
  }
}
function armHumanIdleReaction(){
  clearHumanIdleReactionTimer();
  if(!G||G.over||G.current!==0)return;
  const session=gameSessionId;
  const delay=10000+Math.random()*20000;
  humanIdleReactionTimer=setTimeout(()=>{
    if(!G||G.over||session!==gameSessionId||G.current!==0||!humanResolver||homePaused)return;
    const candidates=[1,2,3];
    const first=candidates[rand(candidates.length)];
    queueBotReaction(first,'bored',{chance:1,minDelay:0,maxDelay:250,duration:2800});
    if(Math.random()<.3){
      const others=candidates.filter(x=>x!==first);
      queueBotReaction(others[rand(others.length)],'bored',{chance:1,minDelay:900,maxDelay:2600,duration:2300});
    }
    armHumanIdleReaction();
  },delay);
}

function playerAnimationTarget(pi){
  if(pi===0)return els.hand;
  const mini=document.querySelector(`[data-player-index="${pi}"] .mini-hand`);
  const panel=document.querySelector(`[data-player-index="${pi}"]`);
  if(mini){
    const rect=mini.getBoundingClientRect();
    if(rect.width>10&&rect.height>10)return mini;
  }
  return panel||els.opponents;
}

function cardSourceElement(pi,card){
  if(pi===0)return document.querySelector(`[data-card-id="${card.id}"]`) || els.hand;
  return document.querySelector(`[data-player-index="${pi}"] .mini-hand`) || els.opponents;
}

async function animateCardTravel(card,fromEl,toEl,{faceDown=false,hold=0,delay=0,duration=480}={}){
  if(!fromEl||!toEl)return;
  if(delay)await sleep(delay);
  await new Promise(requestAnimationFrame);
  await new Promise(requestAnimationFrame);
  const from=fromEl.getBoundingClientRect();
  const to=toEl.getBoundingClientRect();
  const ghost=cardEl(card,{faceDown});
  ghost.classList.add('flying-card');
  const w=Math.min(86,Math.max(52,from.width||72));
  const h=w*1.395;
  ghost.style.width=`${w}px`;
  ghost.style.height=`${h}px`;
  ghost.style.left=`${from.left+from.width/2-w/2}px`;
  ghost.style.top=`${from.top+from.height/2-h/2}px`;
  ghost.style.transitionDuration=`${duration}ms`;
  document.body.appendChild(ghost);
  if(hold)await sleep(hold);
  await new Promise(requestAnimationFrame);
  const dx=(to.left+to.width/2)-(from.left+from.width/2);
  const dy=(to.top+to.height/2)-(from.top+from.height/2);
  ghost.style.transform=`translate(${dx}px,${dy}px) scale(.86)`;
  ghost.style.opacity='.82';
  await sleep(duration+20);
  ghost.remove();
}

async function animatePlayedCards(pi,cards){
  const target=els.current;
  const source=pi===0?null:cardSourceElement(pi,cards[0]);
  const jobs=cards.map((card,i)=>animateCardTravel(
    card,
    pi===0?(cardSourceElement(pi,card)||els.hand):source,
    target,
    {faceDown:false,hold:pi===0?0:330,delay:i*95,duration:500}
  ));
  await Promise.all(jobs);
}


function trainedExpertDrawValue(pi,card){
  const p=G.players[pi], P=expertPolicyFor(pi);
  if(card.n==='S'){
    if(p.baseStrategy==='Grandmaster'){
      // v4 learned Spider as highly valuable while Pantry pests remain. Once the
      // Pantry is empty, reduce its draw value near the finish because Pest Control
      // cannot be the final winning card.
      if(p.pantry.length)return P.drawSpider;
      if(p.hand.length<=1)return -100;
      if(p.hand.length===2)return P.drawSpider-18;
      if(p.hand.length===3)return P.drawSpider-8;
    }
    return P.drawSpider;
  }
  let v=trainedExpertCardBias(card.n,pi);
  if(p.hand.some(x=>x.n===card.n))v+=P.drawDuplicate;
  const gain=runPotentialObj([...p.hand,card])-runPotentialObj(p.hand);
  if(gain>=3)v+=P.drawRunComplete;
  else if(gain>=1.2)v+=P.drawRunPotential;
  if(legalCard(card,G.top))v+=P.drawPlayable;
  if(card.n===1&&exposed(pi).length)v+=P.oneFaceup;
  if(card.n===4&&hiddenPan(pi).length)v+=P.sevenHidden;
  if(card.n===2&&botRetrieveChoice(pi))v+=P.twoUseful;
  if(card.n===3&&p.hand.some(x=>x.n!=='S'&&x.n<3))v+=P.fiveLow;
  return v;
}
function trainedExpertDrawOne(pi){
  if(!G.deck.length)recycle();if(!G.deck.length)return null;
  const p=G.players[pi];
  if(isRageAggressor(p))return aggressorTopDrawOne(pi);
  if(isMegaRunner(p))return runnerTopDrawOne(pi);
  if(p.grantBrain)return grantBrainDrawOne(pi);
  const expertBrain=usesExpertBrain(p),runnerBrain=isPureRunner(p),grandmaster=p.baseStrategy==='Grandmaster';
  if((!expertBrain&&!runnerBrain)||G.deck.length===1)return G.deck.pop();
  if(grandmaster){
    const count=Math.min(4,G.deck.length),viewed=G.deck.splice(G.deck.length-count,count);let bestIndex=0,bestValue=-Infinity;
    for(let i=0;i<viewed.length;i++){const value=trainedExpertDrawValue(pi,viewed[i]);if(value>bestValue){bestValue=value;bestIndex=i;}}
    const [chosen]=viewed.splice(bestIndex,1);shuffle(viewed);G.deck.unshift(...viewed);return chosen;
  }
  const a=G.deck[G.deck.length-1],b=G.deck[G.deck.length-2],value=runnerBrain?c=>runnerDrawValue(pi,c):c=>trainedExpertDrawValue(pi,c);
  let chosen,other;if(value(a)>=value(b)){chosen=G.deck.pop();other=G.deck.pop();}else{other=G.deck.pop();chosen=G.deck.pop();}G.deck.unshift(other);return chosen;
}

async function drawCardsAnimated(pi,count=1){
  const p=G.players[pi];
  const drawn=[];

  for(let i=0;i<count;i++){
    const card=trainedExpertDrawOne(pi);
    if(card)drawn.push(card);
  }

  if(!drawn.length)return;

  // Send multi-card draws in a quick stagger. Each card appears in the hand
  // as its own animation finishes instead of waiting for the entire batch.
  render();
  await new Promise(requestAnimationFrame);

  const stagger=count>1?135:0;
  const jobs=drawn.map((card,i)=>(async()=>{
    if(i)await sleep(i*stagger);
    const target=playerAnimationTarget(pi);
    await animateCardTravel(card,els.drawPile,target,{faceDown:true,duration:520});
    p.hand.push(card);
    p.knownSingle=null;
    if(pi===0){
      newHumanCardIds.add(card.id);
      setTimeout(()=>{
        newHumanCardIds.delete(card.id);
        const live=document.querySelector(`[data-card-id="${card.id}"]`);
        live?.classList.remove('newly-drawn');
      },2600);
    }
    render();
  })());

  await Promise.all(jobs);
}
async function animatePileToOut(pause=500){
  if(!G.top||!els.current||!els.outPile)return;
  await sleep(pause);

  const from=els.current.getBoundingClientRect();
  const to=els.outPile.getBoundingClientRect();

  const ghost=document.createElement('div');
  ghost.className='pile-swipe-ghost';
  ghost.style.width=`${Math.max(82,from.width)}px`;
  ghost.style.height=`${Math.max(116,from.height)}px`;
  ghost.style.left=`${from.left}px`;
  ghost.style.top=`${from.top}px`;

  const card=cardEl(G.top);
  card.classList.add('pile-swipe-top-card');
  ghost.appendChild(card);
  document.body.appendChild(ghost);

  await new Promise(requestAnimationFrame);
  const dx=(to.left+to.width/2)-(from.left+from.width/2);
  const dy=(to.top+to.height/2)-(from.top+from.height/2);

  ghost.classList.add('moving');
  ghost.style.transform=`translate(${dx}px,${dy}px) scale(.76) rotate(8deg)`;

  await sleep(710);
  els.outPile.classList.add('trash-catch');
  ghost.classList.add('arrived');

  await sleep(180);
  ghost.remove();
  els.outPile.classList.remove('trash-catch');
}

async function clearPileAnimated(pause=500){
  pileClearing=true;
  selected.clear();
  render();
  try{
    await animatePileToOut(pause);
    clearPile();
  }finally{
    pileClearing=false;
    selected.clear();
    render();
  }
}

function recordDiscardEntry(pi,cards,{type='play',effect=null,label=null}={}){
  if(!G.discardHistory)G.discardHistory=[];
  G.discardHistory.push({
    pi,
    player:pi===null?'Starting card':G.players[pi].name,
    cards:cards.map(c=>({...c})),
    type,
    effect,
    label,
    turn:G.turns+1
  });
}

function buildDeck(){
 const d=[];
 for(let n=0;n<=10;n++){
   const q=PESTS[n].copies, per=q/4;
   for(let c=0;c<4;c++)for(let k=0;k<per;k++)d.push({n,c,id:`${n}-${c}-${k}-${Math.random()}`});
 }
 for(let k=0;k<4;k++)d.push({n:'S',c:null,id:`S-${k}-${Math.random()}`});
 return shuffle(d);
}

function legalCard(c,top){
 if(c.n==='S')return false;
 if(!top)return true;
 if(c.n===0)return top.n!==0 || c.c>top.c;
 return c.n>top.n || (c.n===top.n && c.c>top.c);
}

function makePlayer(name,strategy,human=false){
  const baseStrategy=strategy;
  let activeStrategy=strategy;
  const p={name,strategy:activeStrategy,baseStrategy,human,hand:[],pantry:[],knownSingle:null,runnerExpert:false,advancedAggressor:false,rage:0,grantBrain:false,drawVision:1};
  if(['Basic','Expert','Grandmaster'].includes(strategy)){
    makeGrantBrain(p,strategy==='Basic'?2:strategy==='Expert'?4:8);
  }
  return p;
}

function placeStartingCard(){
  while(true){
    if(!G.deck.length)recycle();
    const c=G.deck.pop();
    if(!c)return;
    G.discard.push(c);
    if(c.n!=='S'){
      G.top=c;
      G.lastPlayedBy='Starting card';
      G.discardHistory=[];
      recordDiscardEntry(null,[c],{type:'start',label:'Starting card'});
      G.startingCardActive=true;
      log(`Starting card: ${cardLabel(c)}. Its power does not activate.`);
      return;
    }
  }
}

function showGameScreen(){
  homePaused=false;
  document.body.classList.remove('home-mode');
  els.setup.classList.add('hidden');
  els.game.classList.remove('hidden');
  els.turnCounter.classList.remove('hidden');
  els.home.classList.remove('hidden');
  els.fastBotsWrap.classList.remove('hidden');
  els.showHandsWrap.classList.remove('hidden');
  els.hideSpiderWrap?.classList.remove('hidden');
  els.selectWinner?.classList.remove('hidden');
  els.resume.classList.add('hidden');
  render();
}

function resetHomePantryScene(){
  // Fully clear every transition class. game-transition-out uses animation-fill-mode
  // forwards, so leaving it behind makes the Home screen remain faded/blocked.
  els.setup.classList.remove('pantry-light-on','pantry-entering','home-transitioning','game-transition-out');
  els.game.classList.remove('game-transition-in');
}

function replayHomeIntro(){
  if(!els.titleIntro||!els.setupPanel)return;
  resetHomePantryScene();
  els.setupPanel.classList.remove('setup-panel-enter','home-poof-in','home-poof-out','home-fade-in','home-fade-out');
  els.setupPanel.classList.add('setup-panel-hidden');
  els.titleIntro.classList.remove('hidden','intro-exit','home-poof-out','home-fade-in','home-fade-out');

  const animated=els.titleIntro.querySelectorAll('.intro-word,.intro-home-actions');
  animated.forEach(el=>{el.style.animation='none';});
  void els.titleIntro.offsetWidth;
  animated.forEach(el=>{el.style.animation='';});
}

function showHomeScreen(){
  hideVictoryCelebration();
  setEndGameLock(false);
  resetModalPresentation();
  homePaused=true;
  document.body.classList.add('home-mode');
  els.game.classList.add('hidden');
  els.setup.classList.remove('hidden');
  els.turnCounter.classList.add('hidden');
  els.home.classList.add('hidden');
  els.fastBotsWrap.classList.add('hidden');
  els.showHandsWrap.classList.add('hidden');
  els.hideSpiderWrap?.classList.add('hidden');
  els.selectWinner?.classList.add('hidden');
  els.resume.classList.toggle('hidden',!G||G.over);
  resetHomePantryScene();
  replayHomeIntro();
}

function newGame(){
  hideVictoryCelebration();
  setEndGameLock(false);
  resetModalPresentation();
  gameSessionId++;
  homePaused=false;
  const strategies=[null,...[1,2,3].map(i=>resolveBotStrategy(document.getElementById(`bot${i}`).value))];
  const firstPlayer=rand(4);
  const usedNames=new Set();
  const players=[makePlayer('You','Human',true)];
  for(let i=1;i<4;i++){
    const name=randomBotName(strategies[i],usedNames);
    usedNames.add(name);
    players.push(makePlayer(name,strategies[i]));
  }
  G={players,deck:buildDeck(),discard:[],out:[],top:null,current:firstPlayer,startingPlayer:firstPlayer,startingCardActive:true,attack:0,attackOwner:null,passes:0,lastSuccessful:null,lastPlayedBy:'Starting card',discardHistory:[],over:false,turns:0};
  for(const player of G.players){
    player.pantry=G.deck.splice(-4).map((card,slot)=>({card,up:false,slot}));
    player.hand=G.deck.splice(-8);
  }
  selected.clear();
  els.log.innerHTML='';
  placeStartingCard();
  log(`${G.players[G.current].name} goes first.`);
  showGameScreen();
  runLoop(gameSessionId);
}

function recycle(){
 let pool=G.out.splice(0);
 if(!pool.length && G.discard.length>1)pool=G.discard.splice(0,G.discard.length-1);
 shuffle(pool);G.deck.push(...pool);
 if(pool.length)log(`The draw deck was rebuilt with ${pool.length} Trash cards.`);
}function clearPile(){
  G.out.push(...G.discard);
  G.discard=[];
  G.top=null;
  G.attack=0;
  G.passes=0;
  G.discardHistory=[];
  G.lastPlayedBy='Open pile';
}

async function resolveCompletedPassCycle(lastPasser){
  const needed=G.startingCardActive?4:3;
  if(G.passes<needed)return false;

  if(G.startingCardActive){
    const starter=G.startingPlayer;
    await clearPileAnimated(450);
    G.current=starter;
    placeStartingCard();
    log(`Everyone passed on the starting card. ${G.players[starter].name} gets a new starting card and tries again.`);
    render();
    return true;
  }

  const starter=G.lastSuccessful ?? ((lastPasser+1)%4);
  await clearPileAnimated(450);
  G.current=starter;
  log(`${G.players[starter].name} gets the open restart.`);
  return true;
}
function findSpider(pi){return G.players[pi].hand.findIndex(c=>c.n==='S');}
function canUseSpider(pi){return findSpider(pi)>=0 && !(G.players[pi].hand.length===1&&G.players[pi].pantry.length===0);}
function spiderOnlyHandCardWithPantry(pi){
  const p=G.players[pi];
  return p.hand.length===1&&p.hand[0].n==='S'&&p.pantry.length>0;
}
async function showSpiderPlayEffect(pi){
  const p=G.players[pi];
  const overlay=document.createElement('div');
  overlay.className='spider-play-flash';
  overlay.innerHTML=`
    <div class="spider-flash-burst"></div>
    <img src="${PESTS.S.art}" alt="" class="spider-flash-art" />
    <div class="spider-flash-copy">
      <div class="spider-flash-player">${p.name}</div>
      <div class="spider-flash-title">PEST CONTROL!</div>
    </div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(()=>overlay.classList.add('show'));
  await sleep(1350);
  overlay.classList.add('hide');
  await sleep(260);
  overlay.remove();
}
async function burnSpider(pi,reason='uses Pest Control'){
  const p=G.players[pi];
  const idx=findSpider(pi);
  if(idx<0)return false;

  const [spider]=p.hand.splice(idx,1);
  G.discard.splice(Math.max(0,G.discard.length-1),0,spider);
  recordDiscardEntry(pi,[spider],{type:'spider',label:reason});
  log(`${p.name} ${reason}.`);
  await showSpiderPlayEffect(pi);

  // Pest Control can empty a hand just like a numbered play. If Pantry pests remain,
  // immediately pull one before play continues.
  if(p.hand.length===0 && p.pantry.length>0){
    await pullPantry(pi);
  }

  render();
  return true;
}
function totalCards(pi){return G.players[pi].hand.length+G.players[pi].pantry.length;}
function exposed(pi){return G.players[pi].pantry.map((x,i)=>x.up?i:-1).filter(i=>i>=0);}
function hiddenPan(pi){return G.players[pi].pantry.map((x,i)=>!x.up?i:-1).filter(i=>i>=0);}

function cardEl(card,{clickable=false,selectedCard=false,faceDown=false,small=false}={}){
 const d=document.createElement('div');
 d.className=`game-card pest-${card.n} ${faceDown?'face-down':(card.n==='S'?'spider-card':COLORS[card.c])} ${clickable?'clickable':''} ${selectedCard?'selected':''} ${small?'known-card':''}`;
 const info=PESTS[card.n];
 const art=(!faceDown&&info?.art)?`<div class="card-art-frame"><img class="card-art" src="${info.art}" alt="" draggable="false"></div>`:'';
 const value=faceDown?'':card.n;
 if(!faceDown&&info?.effect)d.dataset.effect=info.effect;
 d.innerHTML=`
   <div class="card-inner-rim"></div>
   <div class="num num-left">${value}</div>
   <div class="num num-right">${value}</div>
   ${art}
   <div class="pest">${faceDown?'':info.name}</div>
   <div class="icon">${faceDown?'✦':''}</div>`;
 return d;
}


let activeHoverCard=null;
function positionCardHoverTip(card){
  if(!els.cardHoverTip||!card)return;
  const r=card.getBoundingClientRect();
  const tip=els.cardHoverTip;
  const tw=tip.offsetWidth||190;
  const th=tip.offsetHeight||46;
  let left=r.left+r.width/2-tw/2;
  left=Math.max(8,Math.min(window.innerWidth-tw-8,left));

  // For the human hand, anchor the tooltip to the HAND TRAY rather than the
  // moving card. The card can lift on hover without making the tooltip jump.
  let top;
  const humanHand=card.closest('#yourHand');
  if(humanHand){
    const hr=humanHand.getBoundingClientRect();
    top=hr.top-th-8;
  }else{
    top=r.top-th-10;
    if(top<8)top=Math.min(window.innerHeight-th-8,r.bottom+10);
  }
  tip.style.left=`${left}px`;
  tip.style.top=`${Math.max(8,top)}px`;
}
document.addEventListener('pointerover',e=>{
  const card=e.target.closest?.('.game-card[data-effect]');
  if(!card||!els.cardHoverTip)return;
  if(activeHoverCard===card)return;
  const from=e.relatedTarget;
  if(from&&card.contains(from))return;
  activeHoverCard=card;
  const effect=card.dataset.effect;
  if(!effect)return;
  els.cardHoverTip.textContent=effect;
  els.cardHoverTip.classList.remove('hidden');
  requestAnimationFrame(()=>positionCardHoverTip(card));
});
document.addEventListener('pointerout',e=>{
  const card=e.target.closest?.('.game-card[data-effect]');
  if(!card||!els.cardHoverTip||activeHoverCard!==card)return;
  const next=e.relatedTarget;
  if(next&&card.contains(next))return;
  activeHoverCard=null;
  els.cardHoverTip.classList.add('hidden');
});
window.addEventListener('scroll',()=>{
  activeHoverCard=null;
  els.cardHoverTip?.classList.add('hidden');
},{passive:true});

function sortHumanHand(){
  if(!G)return;
  const hand=G.players[0].hand;

  hand.sort((a,b)=>{
    // Pest Control is a special card and stays at the far left in either view.
    if(a.n==='S'&&b.n!=='S')return -1;
    if(b.n==='S'&&a.n!=='S')return 1;
    if(a.n==='S'&&b.n==='S')return 0;

    if(handSortMode==='color'){
      // Strongest color first: Gold, Blue, Red, Green.
      if(a.c!==b.c)return b.c-a.c;
      // Within each color: strongest number first.
      return b.n-a.n;
    }

    // Number view: strongest number first, with no color sorting.
    return b.n-a.n;
  });
}

function layoutOpponentHand(miniHand){
  const cards=[...miniHand.children];
  if(!cards.length)return;

  const available=miniHand.clientWidth;
  const cardW=cards[0].getBoundingClientRect().width;

  // Cards NEVER spread out to fill the tray.
  // They stay in a compact, left-aligned row with only a tiny gap.
  const gap=2;
  const compactStep=cardW+gap;
  const naturalWidth=cardW+(cards.length-1)*compactStep;

  let step=0;
  if(cards.length===1){
    miniHand.dataset.overlap='none';
  }else if(naturalWidth<=available){
    // Compact row fits: leave all unused tray space on the RIGHT.
    step=compactStep;
    miniHand.dataset.overlap='none';
  }else{
    // Compact row no longer fits: ONLY NOW begin overlapping.
    // Compress only enough to keep the last card fully inside.
    step=(available-cardW)/(cards.length-1);
    miniHand.dataset.overlap='active';
  }

  cards.forEach((card,index)=>{
    card.style.left=`${index*step}px`;
    card.style.bottom='0px';
  });
}

function pileDepthClass(count){
  if(count>=30)return 'pile-depth-3';
  if(count>=20)return 'pile-depth-2';
  if(count>=10)return 'pile-depth-1';
  return 'pile-depth-0';
}
function applyPileDepth(el,count){
  if(!el)return;
  el.classList.remove('pile-depth-0','pile-depth-1','pile-depth-2','pile-depth-3');
  el.classList.add(pileDepthClass(count));
}

function render() {
  if (!G) return;

  // Selection can only exist during the human turn.
  if(G.current!==0 || G.over || pileClearing)selected.clear();

  els.turnCounter.textContent = `Turn ${G.turns + 1}`;
  els.lastPlayedBy.textContent = G.top ? `Last played by: ${G.lastPlayedBy || 'Starting card'}` : 'Open pile';

  els.opponents.innerHTML = '';
  for (let i = 1; i < 4; i++) {
    const p = G.players[i];
    const box = document.createElement('div');
    box.className = 'opponent panel' + (G.current === i ? ' current-turn' : '');
    box.dataset.playerIndex = i;
    box.innerHTML = `
      <div class="opp-head">
        <div class="opp-identity">
          <div class="opp-avatar-wrap">
            <img class="opp-avatar" src="${botType(p.baseStrategy||p.strategy).image}" alt="${p.baseStrategy||p.strategy}" />
            ${p.botReaction?.emoji?`<div class="bot-reaction-bubble" aria-label="Bot reaction"><span>${p.botReaction.emoji}</span></div>`:''}
          </div>
          <div>
            <div class="opp-name">${p.name}</div>
            <div class="meta">${p.baseStrategy==='Runner'&&p.runnerExpert?'Advanced Runner':p.baseStrategy==='Aggressor'&&p.advancedAggressor?'Advanced Aggressor':p.baseStrategy||p.strategy}</div>
          </div>
        </div>
        <div class="meta">Hand ${p.hand.length} · Pantry ${p.pantry.length}</div>
      </div>`;
    els.opponents.appendChild(box);

    const statusSlot=document.createElement('div');
    statusSlot.className='opponent-status-slot';
    if(p.baseStrategy==='Runner'&&p.runnerExpert){
      const badge=document.createElement('div');badge.className='runner-upgrade-badge';badge.textContent='⚡ ADVANCED RUNNER';statusSlot.appendChild(badge);
    }else if(p.baseStrategy==='Aggressor'&&p.advancedAggressor){
      const badge=document.createElement('div');badge.className='runner-upgrade-badge enraged-badge';badge.textContent='🔥 FULLY ENRAGED';statusSlot.appendChild(badge);
    }else if(p.baseStrategy==='Aggressor'){
      const rage=document.createElement('div');rage.className='rage-meter';rage.innerHTML=`<span class="rage-label">RAGE</span><span class="rage-segments">${rageSegmentsHtml(p.rage||0)}</span><span class="rage-count">${p.rage||0}/8</span>`;statusSlot.appendChild(rage);
    }
    box.appendChild(statusSlot);

    const handLabel=document.createElement('div');
    handLabel.className='opponent-section-label opponent-hand-label';
    handLabel.textContent='HAND';
    box.appendChild(handLabel);

    const miniHand = document.createElement('div');
    miniHand.className = 'mini-hand' + (els.showHandsToggle?.checked ? ' revealed-opponent-hand' : '');
    const opponentHand=els.showHandsToggle?.checked
      ? [...p.hand].sort((a,b)=>{
          if(a.n==='S'&&b.n!=='S')return -1;
          if(b.n==='S'&&a.n!=='S')return 1;
          if(a.n==='S'&&b.n==='S')return 0;
          if(a.c!==b.c)return b.c-a.c;
          return b.n-a.n;
        })
      : p.hand;

    const shownHandCount=Math.min(opponentHand.length,14);

    for (let k = 0; k < shownHandCount; k++) {
      if(els.showHandsToggle?.checked){
        miniHand.appendChild(cardEl(opponentHand[k], {small:true}));
      }else{
        const back = document.createElement('div');
        back.className = 'mini-card';
        miniHand.appendChild(back);
      }
    }
    box.appendChild(miniHand);
    layoutOpponentHand(miniHand);

    const pantryLabel=document.createElement('div');
    pantryLabel.className='opponent-section-label opponent-pantry-label';
    pantryLabel.textContent='PANTRY';
    box.appendChild(pantryLabel);

    const pantryRow = document.createElement('div');
    pantryRow.className = 'pantry-row opponent-pantry-row';
    for(let slotIndex=0;slotIndex<4;slotIndex++){
      const slot=document.createElement('div');
      slot.className='opponent-pantry-slot';
      const item=p.pantry.find(x=>(x.slot??p.pantry.indexOf(x))===slotIndex);
      if(item){
        slot.appendChild(cardEl(item.card,{faceDown:!item.up,small:true}));
      }else{
        const empty=document.createElement('div');
        empty.className='game-card pantry-empty-slot';
        empty.setAttribute('aria-label','Empty Pantry slot');
        slot.appendChild(empty);
      }
      pantryRow.appendChild(slot);
    }
    box.appendChild(pantryRow);
  }

  els.current.innerHTML = '';
  if (G.top) {
    els.current.appendChild(cardEl(G.top));
  } else {
    els.current.textContent = 'OPEN';
  }

  els.drawCount.textContent = `${G.deck.length} cards`;
  els.outCount.textContent = `${G.out.length} cards`;

  applyPileDepth(els.drawPile,G.deck.length);
  applyPileDepth(els.current,G.discard.length);
  applyPileDepth(els.outPile,G.out.length);
  els.drawPile.dataset.pileCount=G.deck.length;
  els.current.dataset.pileCount=G.discard.length;
  els.outPile.dataset.pileCount=G.out.length;

  els.pantry.innerHTML = '';
  for(let slotIndex=0;slotIndex<4;slotIndex++){
    const slot=document.createElement('div');
    slot.className='human-pantry-slot';
    const item=G.players[0].pantry.find(x=>(x.slot??G.players[0].pantry.indexOf(x))===slotIndex);
    if(item){
      slot.appendChild(cardEl(item.card,{faceDown:!item.up}));
    }else{
      const empty=document.createElement('div');
      empty.className='game-card pantry-empty-slot human-pantry-empty-slot';
      empty.setAttribute('aria-label','Empty Pantry slot');
      slot.appendChild(empty);
    }
    els.pantry.appendChild(slot);
  }

  sortHumanHand();
  els.sortColor.classList.toggle('active', handSortMode==='color');
  els.sortNumber.classList.toggle('active', handSortMode==='number');

  els.hand.innerHTML = '';
  G.players[0].hand.forEach((card, i) => {
    const el = cardEl(card, {
      clickable: G.current === 0 && !G.over && !pileClearing,
      selectedCard: selected.has(i)
    });
    el.dataset.cardId = card.id;
    el.dataset.handIndex = i;
    if(newHumanCardIds.has(card.id))el.classList.add('newly-drawn');

    el.onclick = () => {
      if (G.current !== 0 || G.over || pileClearing) return;
      selected.has(i) ? selected.delete(i) : selected.add(i);
      render();
    };

    els.hand.appendChild(el);
  });

  els.youMeta.textContent = `Hand ${G.players[0].hand.length} · Pantry ${G.players[0].pantry.length}`;
  els.turnBadge.textContent = G.over
    ? 'Game Over'
    : G.current === 0
      ? 'Your turn'
      : `${G.players[G.current].name}'s turn`;
  els.turnBadge.classList.toggle('active', G.current === 0 && !G.over);

  const isHumanTurn = G.current === 0 && !G.over && !pileClearing;
  const underAttack = isHumanTurn && G.attack > 0;
  const hasNormalPlay = normalLegalPlays(0).length > 0 || allRuns(0).length > 0;
  const hasSpider = findSpider(0) >= 0;
  const canFinishWithSpider = G.players[0].hand.length === 1 && G.players[0].pantry.length === 0;

  if (underAttack) {
    const hasRequiredDefense = hasNumberedAttackDefense(0);
    els.play.textContent = attackButtonLabel();
    els.draw.textContent = `Take +${G.attack} Cards`;
    els.spiderPass.textContent = 'Use Pest Control on Attack';

    els.draw.disabled = hasRequiredDefense;
    els.play.disabled = selected.size === 0;
    els.spiderPass.disabled = !hasSpider || canFinishWithSpider;

    if (hasRequiredDefense) {
      els.status.textContent = `Attack incoming: +${G.attack}. You have a legal defense, so you must play it.`;
    } else if (hasSpider) {
      els.status.textContent = `Attack incoming: +${G.attack}. Take it or optionally use Pest Control.`;
    } else {
      els.status.textContent = `Attack incoming: +${G.attack}. You have no numbered defense — take the cards.`;
    }
  } else {
    els.play.textContent = 'Play Selected';
    els.draw.textContent = 'Draw 1 & Pass';
    els.spiderPass.textContent = 'Use Pest Control to Pass';

    els.draw.disabled = !isHumanTurn || hasNormalPlay;
    els.play.disabled = !isHumanTurn || selected.size === 0;
    els.spiderPass.disabled = !isHumanTurn || !hasSpider || canFinishWithSpider;

    els.status.textContent = G.over
      ? ''
      : G.current === 0
        ? hasNormalPlay
          ? 'You must make a legal play.'
          : 'No legal Pest play — draw 1 or use Pest Control to pass.'
        : `${G.players[G.current].name} is thinking…`;
  }
}

function attackButtonLabel(){
  if(!selected.size)return 'Select Attack Response';

  const val=validateSelection(0,[...selected],true);
  if(!val.ok)return 'Play Selected';

  if(val.type==='run'){
    const powers=val.attackPowers||[];
    if(powers.length>1)return 'Choose Attack Response';
    if(powers[0]===7)return 'Block Attack';
    if(powers[0]===5)return 'Add +2 to Attack';
    if(powers[0]===6)return 'Add +1 to Attack';
    return 'Play Run';
  }

  const n=val.n??val.cards?.[0]?.n;
  if(n===7)return 'Block Attack';
  if(n===5)return 'Add +2 to Attack';
  if(n===6)return 'Add +1 to Attack';
  return 'Play Selected';
}

function normalLegalPlays(pi){return G.players[pi].hand.filter(c=>legalCard(c,G.top));}

function allRuns(pi){
 const hand=G.players[pi].hand,have=new Map();
 for(let c=0;c<4;c++)have.set(c,new Set(hand.filter(x=>x.n!=='S'&&x.c===c).map(x=>x.n)));
 const out=[];
 for(let c=0;c<4;c++){
   const nums=[...have.get(c)].sort((a,b)=>a-b);
   for(let i=0;i<nums.length;i++)for(let j=i+2;j<nums.length;j++){
     const seq=nums.slice(i,j+1);if(seq.some((n,k)=>k&&n!==seq[k-1]+1))break;
     const ok=seq[0]===0?legalCard({n:0,c},G.top):legalCard({n:seq.at(-1),c},G.top);
     if(ok)out.push({c,seq});
   }
 }
 return out;
}

function analyzeRunCards(cards){
  if(cards.length<3)return null;
  const colors=new Set(cards.map(c=>c.c));
  const sorted=[...cards].sort((a,b)=>a.n-b.n);
  const consecutive=colors.size===1
    && new Set(sorted.map(c=>c.n)).size===sorted.length
    && sorted.every((c,i)=>i===0||c.n===sorted[i-1].n+1);
  if(!consecutive)return null;
  return {cards:sorted,c:sorted[0].c,seq:sorted.map(c=>c.n),top:sorted.at(-1)};
}

function isRunNormallyLegal(run){
  return run.seq[0]===0
    ? legalCard({n:0,c:run.c},G.top)
    : legalCard(run.top,G.top);
}

function allAttackRuns(pi){
  const hand=G.players[pi].hand;
  const have=new Map();
  for(let c=0;c<4;c++)have.set(c,new Set(hand.filter(x=>x.n!=='S'&&x.c===c).map(x=>x.n)));
  const runs=[];
  for(let c=0;c<4;c++){
    const nums=[...have.get(c)].sort((a,b)=>a-b);
    for(let i=0;i<nums.length;i++){
      for(let j=i+2;j<nums.length;j++){
        const seq=nums.slice(i,j+1);
        if(seq.some((n,k)=>k&&n!==seq[k-1]+1))break;
        const cards=seq.map(n=>hand.find(card=>card.n===n&&card.c===c));
        const run={cards,c,seq,top:cards.at(-1)};
        const powers=seq.filter(n=>[5,6,7].includes(n));
        if(!powers.length)continue;
        if(isRunNormallyLegal(run)||seq.includes(7))runs.push({...run,attackPowers:powers});
      }
    }
  }
  return runs;
}

function hasNumberedAttackDefense(pi){
  const hand=G.players[pi].hand;
  if(hand.some(c=>c.n===7))return true;
  if(hand.some(c=>[5,6].includes(c.n)&&legalCard(c,G.top)))return true;
  return allAttackRuns(pi).length>0;
}

function explainCardNotLegal(card){
  if(!G.top)return 'That card would be legal because the pile is open.';
  const top=G.top;
  if(card.n==='S')return 'Pest Control is not a numbered Pest. Select Pest Control by itself and press Play Selected to use it as a pass.';
  if(card.n===0){
    if(top.n!==0)return 'A 0 can be played here, so this card should be legal.';
    if(card.c<=top.c)return `${cardLabel(card)} cannot beat ${cardLabel(top)}. On another 0, you need a stronger color.`;
  }
  if(card.n<top.n)return `${cardLabel(card)} is lower than ${cardLabel(top)}. You need a higher number, the same number in a stronger color, or a 0.`;
  if(card.n===top.n&&card.c<=top.c)return `${cardLabel(card)} matches the number ${top.n}, but its color is not stronger than ${COLOR_NAMES[top.c]}. Same-number plays need a stronger color.`;
  return `${cardLabel(card)} cannot be played on ${cardLabel(top)}.`;
}

function explainBadMultiCardPlay(cards){
  const colors=new Set(cards.filter(c=>c.n!=='S').map(c=>c.c));
  const nums=cards.filter(c=>c.n!=='S').map(c=>c.n);
  if(cards.some(c=>c.n==='S'))return 'Pest Control cannot be combined with numbered cards. Select Pest Control by itself and press Play Selected to pass.';
  if(cards.length<3)return 'Those cards are not duplicates, and a run needs at least 3 cards.';
  if(colors.size>1)return 'That cannot be a run because every card in a run must be the same color.';
  if(new Set(nums).size!==nums.length)return 'A run cannot contain duplicate numbers. Use duplicates by themselves, or select one of each number for the run.';
  const sorted=[...nums].sort((a,b)=>a-b);
  const gap=sorted.findIndex((n,i)=>i>0&&n!==sorted[i-1]+1);
  if(gap>=0)return `That run has a gap between ${sorted[gap-1]} and ${sorted[gap]}. Run numbers must be consecutive.`;
  return 'A multi-card play must be matching-number duplicates or a same-color consecutive run of at least 3 cards.';
}

function validateSelection(pi,indices,attackMode=false){
  const hand=G.players[pi].hand;
  const cards=indices.map(i=>hand[i]).filter(Boolean);
  if(!cards.length)return{ok:false,msg:'Select at least one card.'};

  // A single Pest Control played with Play Selected is handled exactly like the Pest Control button.
  if(cards.length===1&&cards[0].n==='S')return{ok:true,type:'spider'};
  if(cards.some(c=>c.n==='S'))return{ok:false,msg:'Pest Control cannot be combined with other cards. Select only Pest Control, then press Play Selected to pass.'};

  const nums=new Set(cards.map(c=>c.n));
  const run=analyzeRunCards(cards);

  if(attackMode){
    if(nums.size===1){
      const n=cards[0].n;
      const strongest=cards.reduce((a,b)=>a.c>b.c?a:b);
      if(n===7)return{ok:true,type:cards.length>1?'duplicates':'single',cards,n,top:strongest,attackPowers:[7]};
      if(![5,6].includes(n))return{ok:false,msg:`${PESTS[n].name}/${n} cannot answer this attack. Use 5 or 6 to add to it, Beetle/7 to block it, a defensive run containing 5/6/7, or Pest Control.`};
      if(!legalCard(strongest,G.top))return{ok:false,msg:`That ${n} cannot continue the attack: ${explainCardNotLegal(strongest)}`};
      return{ok:true,type:cards.length>1?'duplicates':'single',cards,n,top:strongest,attackPowers:[n]};
    }

    if(!run)return{ok:false,msg:`During an attack, ${explainBadMultiCardPlay(cards)} A defensive run must also contain 5, 6, or 7.`};
    const attackPowers=run.seq.filter(n=>[5,6,7].includes(n));
    if(!attackPowers.length)return{ok:false,msg:`The ${run.seq.join('-')} run is a valid run shape, but it cannot answer an attack because it contains no 5, 6, or 7.`};
    if(!isRunNormallyLegal(run)&&!run.seq.includes(7)){
      const anchor=run.seq[0]===0?{n:0,c:run.c}:run.top;
      return{ok:false,msg:`The run itself cannot enter on the current pile: ${explainCardNotLegal(anchor)} A run containing Beetle/7 is the exception while defending.`};
    }
    return{ok:true,type:'run',...run,attackPowers};
  }

  if(cards.length===1){
    if(!legalCard(cards[0],G.top))return{ok:false,msg:explainCardNotLegal(cards[0])};
    return{ok:true,type:'single',cards,n:cards[0].n,top:cards[0]};
  }

  if(nums.size===1){
    const strongest=cards.reduce((a,b)=>a.c>b.c?a:b);
    if(!legalCard(strongest,G.top))return{ok:false,msg:`Those are valid duplicates, but their strongest card still cannot enter the pile. ${explainCardNotLegal(strongest)}`};
    return{ok:true,type:'duplicates',cards,n:strongest.n,top:strongest};
  }

  if(!run)return{ok:false,msg:explainBadMultiCardPlay(cards)};
  if(!isRunNormallyLegal(run)){
    const anchor=run.seq[0]===0?{n:0,c:run.c}:run.top;
    return{ok:false,msg:`The ${COLOR_NAMES[run.c]} ${run.seq.join('-')} run is formed correctly, but it cannot be played on the current pile. ${explainCardNotLegal(anchor)}`};
  }
  return{ok:true,type:'run',...run};
}

function resetModalPresentation(){
  els.modal.querySelector('.modal-card')?.classList.remove('spider-choice-modal');
  els.modalBody.querySelectorAll('.bot-win-summary').forEach(el=>el.remove());
}

function modalUsesPestControl(title,html,choices){
  const text=[title,html,...(choices||[]).map(ch=>ch.label)].filter(Boolean).join(' ').toLowerCase();
  return text.includes('spider') || text.includes('pest control');
}

let victoryHomeTimer=null;

function setEndGameLock(locked){
  document.documentElement.classList.toggle('game-ended-lock',locked);
  document.body.classList.toggle('game-ended-lock',locked);
}

function buildVictoryCelebration(){
  let v=document.getElementById('victoryCelebration');
  if(v)return v;
  v=document.createElement('div');
  v.id='victoryCelebration';
  v.innerHTML=`
    <div class="shade"></div>
    <div class="victory-panel">
      <div class="victory-title">YOU WIN!</div>
      <div class="victory-trophy-wrap">
        <img class="trophy" src="assets/pest-of-all-time-trophy.png" alt="The Pest of All Time trophy">
        <button type="button" class="victory-home-button">Home</button>
      </div>
    </div>`;

  // Only real PITP card-art pests rain during the celebration.
  const pestArt=Object.values(PESTS).map(p=>p.art).filter(Boolean);
  for(let i=0;i<54;i++){
    const pest=document.createElement('img');
    pest.className='victory-pest';
    pest.src=pestArt[rand(pestArt.length)];
    pest.alt='';
    pest.setAttribute('aria-hidden','true');
    pest.style.left=`${Math.random()*100}%`;
    pest.style.setProperty('--fall',`${2.8+Math.random()*3.8}s`);
    pest.style.setProperty('--delay',`${-Math.random()*6}s`);
    pest.style.setProperty('--drift',`${-110+Math.random()*220}px`);
    pest.style.setProperty('--spin',`${-520+Math.random()*1040}deg`);
    pest.style.setProperty('--pest-size',`${42+Math.random()*48}px`);
    v.appendChild(pest);
  }

  const colors=['#ffd45a','#ff7b38','#fff2b2','#ef4c3c','#6fd3ff','#b97cff'];
  // Keep several bursts in the areas that frame the trophy best, then add a few random ones.
  const burstPositions=[
    [11,14],[30,9],[50,10],[71,13],[89,18],
    [24,47],[38,40],
    [10,76],[31,82],[72,80],[90,76],
    [18,29],[82,34]
  ];
  for(let f=0;f<burstPositions.length+5;f++){
    const firework=document.createElement('span');
    firework.className='victory-firework';
    const pos=burstPositions[f]||[5+Math.random()*90,8+Math.random()*78];
    firework.style.left=`${pos[0]}%`;
    firework.style.top=`${pos[1]}%`;
    firework.style.color=colors[rand(colors.length)];
    for(let spark=0;spark<24;spark++){
      const dot=document.createElement('i');
      dot.style.setProperty('--r',`${spark*15}deg`);
      dot.style.setProperty('--d',`${Math.random()*2.2}s`);
      firework.appendChild(dot);
    }
    v.appendChild(firework);
  }

  const ringPositions=[
    [8,24],[28,18],[50,18],[74,20],[92,30],
    [18,58],[35,54],[9,86],[33,89],[73,88],[91,84]
  ];
  for(const [left,top] of ringPositions){
    const ring=document.createElement('span');
    ring.className='victory-ring-firework';
    ring.style.left=`${left}%`;
    ring.style.top=`${top}%`;
    ring.style.color=colors[rand(colors.length)];
    for(let dotIndex=0;dotIndex<16;dotIndex++){
      const dot=document.createElement('i');
      dot.style.setProperty('--r',`${dotIndex*22.5}deg`);
      dot.style.setProperty('--d',`${Math.random()*1.8}s`);
      ring.appendChild(dot);
    }
    v.appendChild(ring);
  }

  v.querySelector('.victory-home-button').addEventListener('click',()=>{
    if(victoryHomeTimer){clearTimeout(victoryHomeTimer);victoryHomeTimer=null;}
    hideVictoryCelebration();
    showHomeScreen();
  });
  document.body.appendChild(v);
  return v;
}

function showVictoryCelebration(){
  const v=buildVictoryCelebration();
  requestAnimationFrame(()=>v.classList.add('show'));
  if(victoryHomeTimer)clearTimeout(victoryHomeTimer);
  victoryHomeTimer=setTimeout(()=>{
    victoryHomeTimer=null;
    const current=document.getElementById('victoryCelebration');
    if(current?.classList.contains('show'))current.classList.add('show-home');
  },5000);
}

function hideVictoryCelebration(){
  if(victoryHomeTimer){clearTimeout(victoryHomeTimer);victoryHomeTimer=null;}
  const v=document.getElementById('victoryCelebration');
  if(!v)return;
  v.classList.remove('show','show-home');
  setTimeout(()=>{if(!v.classList.contains('show'))v.remove();},300);
}

function botWinSummaryHtml(pi){
  const p=G.players[pi];
  const info=botType(p.baseStrategy||p.strategy);
  return `<div class="bot-win-summary"><img src="${info.image}" alt="${p.name}"><div class="cup">🏆</div><div class="txt">${p.name} takes the pantry!</div></div>`;
}

async function modalChoice(title,html,choices,allowClose=false,bodyClass='',decoratePestControl=true){
  resetModalPresentation();
  if(decoratePestControl&&modalUsesPestControl(title,html,choices))els.modal.querySelector('.modal-card')?.classList.add('spider-choice-modal');
  els.modalBody.className=[bodyClass,'decision-modal'].filter(Boolean).join(' ');
  els.modalBody.innerHTML=`<h2>${title}</h2>${html||''}<div id="choiceGrid" class="choice-grid"></div>`;
  const grid=document.getElementById('choiceGrid');
  return new Promise(resolve=>{
    modalResolver=resolve;
    els.modal.classList.remove('hidden');
    els.modalClose.style.display=allowClose?'block':'none';
    choices.forEach(ch=>{
      const b=document.createElement('button');
      b.className=ch.primary?'primary':'';
      b.textContent=ch.label;
      b.onclick=()=>{
        els.modal.classList.add('hidden');
        els.modalBody.className='';
        resetModalPresentation();
        modalResolver=null;
        resolve(ch.value);
      };
      grid.appendChild(b);
    });
  });
}

let toastTimer=null;
function showToast(message){
  if(!els.toast)return;
  clearTimeout(toastTimer);
  els.toast.textContent=message;
  els.toast.classList.remove('hidden');
  requestAnimationFrame(()=>els.toast.classList.add('show'));
  toastTimer=setTimeout(()=>{
    els.toast.classList.remove('show');
    setTimeout(()=>els.toast.classList.add('hidden'),180);
  },5000);
}
async function chooseCardModal(title,cards,{allowSkip=false}={}){
  resetModalPresentation();
 els.modalBody.className='card-choice-modal';
 els.modalBody.innerHTML=`<h2>${title}</h2><div id="choiceGrid" class="choice-grid"></div>`;const grid=document.getElementById('choiceGrid');
 return new Promise(resolve=>{
   modalResolver=resolve;els.modal.classList.remove('hidden');els.modalClose.style.display='none';
   cards.forEach((c,i)=>{const wrap=document.createElement('button');wrap.style.padding='4px';wrap.appendChild(cardEl(c));wrap.onclick=()=>{els.modal.classList.add('hidden');els.modalBody.className='';resetModalPresentation();modalResolver=null;resolve(i);};grid.appendChild(wrap);});
   if(allowSkip){const b=document.createElement('button');b.textContent='Take nothing';b.onclick=()=>{els.modal.classList.add('hidden');els.modalBody.className='';resetModalPresentation();modalResolver=null;resolve(-1);};grid.appendChild(b);}
 });
}

async function choosePantryPositionModal(pi,title='Choose a Pantry Pest',mode='take'){
  resetModalPresentation();
  const p=G.players[pi];
  const isTake=mode==='take';
  const isAnt=mode==='ant';
  const isFly=mode==='fly';

  els.modalBody.className='pantry-choice-modal';
  const helper=isTake
    ? 'Choose any Pantry Pest to take into your hand.'
    : isAnt
      ? 'Choose one of your face-up Pantry Pests.'
      : 'Choose one of your face-down Pantry Pests to reveal.';
  els.modalBody.innerHTML=`
    <h2>${title}</h2>
    <p class="meta">${helper}</p>
    <div id="choiceGrid" class="choice-grid pantry-choice-grid"></div>
    <div id="pantryRevealPreview" class="pantry-reveal-preview hidden"></div>`;
  const grid=document.getElementById('choiceGrid');
  const preview=document.getElementById('pantryRevealPreview');

  return new Promise(resolve=>{
    modalResolver=resolve;
    els.modal.classList.remove('hidden');
    els.modalClose.style.display='none';

    p.pantry.forEach((item,idx)=>{
      const eligible=isTake || (isAnt&&item.up) || (isFly&&!item.up);
      const b=document.createElement('button');
      b.type='button';
      b.className=`pantry-choice-button ${eligible?'eligible':'ineligible'}`;
      b.disabled=!eligible;
      b.setAttribute('aria-disabled',eligible?'false':'true');

      const label=document.createElement('div');
      label.className='tiny';
      label.textContent=`Pantry ${idx+1}`;
      b.appendChild(label);

      const card=cardEl(item.card,{faceDown:!item.up});
      card.classList.add('pantry-modal-card');
      if(eligible)card.classList.add('pantry-choice-glow');
      b.appendChild(card);

      if(eligible){
        b.onclick=async()=>{
          // Fly gets a dramatic reveal before the modal disappears.
          if(isFly){
            // Once the reveal is chosen, remove the instructional text/cards so
            // REVEALED! and the revealed Pest are the only things competing for attention.
            els.modalBody.classList.add('fly-revealing');
            grid.classList.add('pantry-grid-dimmed');
            preview.classList.remove('hidden');
            preview.innerHTML='<div class="pantry-reveal-label">REVEALED!</div>';
            const revealCard=cardEl(item.card);
            revealCard.classList.add('pantry-reveal-card');
            preview.appendChild(revealCard);
            await sleep(950);
          }
          els.modal.classList.add('hidden');
          els.modalBody.className='';
          els.modalClose.style.display='';
          resetModalPresentation();
          modalResolver=null;
          resolve(idx);
        };
      }
      grid.appendChild(b);
    });
  });
}

async function pullPantry(pi){
  const p=G.players[pi];
  if(!p.pantry.length)return null;
  const ups=exposed(pi);
  const downs=hiddenPan(pi);
  let idx;
  if(p.human){
    idx=await choosePantryPositionModal(pi,'Choose a Pantry Pest to take','take');
  }else if(p.grantBrain&&downs.length){
    // Final Grandmaster Pantry rule: prefer the unknown face-down Pest.
    // The one exception is a revealed Pest Control, which is too valuable to ignore.
    const revealedSpider=ups.find(i=>p.pantry[i].card.n==='S');
    idx=revealedSpider!==undefined?revealedSpider:downs[rand(downs.length)];
  }else if(ups.length){
    idx=botChoosePantry(pi,ups);
  }else{
    idx=rand(p.pantry.length);
  }
  const item=p.pantry.splice(idx,1)[0];
  p.hand.push(item.card);
  if(p.pantry.length===0)reactPantryCleared(pi);
  p.knownSingle=item.up?item.card:null;
  log(`${p.name} takes ${item.up?cardLabel(item.card):'a face-down Pest'} from the Pantry.`);
  render();
  return item.card;
}
function botChoosePantry(pi,ups){
 const p=G.players[pi];return ups.sort((a,b)=>botCardUtility(pi,p.pantry[b].card)-botCardUtility(pi,p.pantry[a].card))[0];
}

async function resolveEffect(pi,n){
  const p=G.players[pi];

  if(n===1){
    const ups=exposed(pi);
    if(!ups.length)return;
    if(p.human){
      const idx=await choosePantryPositionModal(pi,'Ant: choose a face-up Pantry Pest','ant');
      const item=p.pantry.splice(idx,1)[0];
      p.hand.push(item.card);
      if(p.pantry.length===0)reactPantryCleared(pi);
      log(`You take ${cardLabel(item.card)} from your Pantry.`);
    }else if(botShouldUseAnt(pi)){
      const idx=botChoosePantry(pi,ups);
      const item=p.pantry.splice(idx,1)[0];
      p.hand.push(item.card);
      if(p.pantry.length===0)reactPantryCleared(pi);
      log(`${p.name} uses Ant to take ${cardLabel(item.card)}.`);
    }
  }

  if(n===2){
    const candidates=G.out.filter(c=>c.n!=='S');
    if(!candidates.length)return;
    if(p.human){
      const ordered=sortOutCards(candidates);
      const ch=await chooseCardModal('Raccoon: take a numbered Pest from Trash?',ordered,{allowSkip:true});
      if(ch>=0){
        const card=ordered[ch];
        const idx=G.out.findIndex(x=>x.id===card.id);
        G.out.splice(idx,1);
        p.hand.push(card);
        log(`You retrieve ${cardLabel(card)} from Trash.`);
      }
    }else{
      const card=botRetrieveChoice(pi);
      if(card){
        const idx=G.out.findIndex(x=>x.id===card.id);
        G.out.splice(idx,1);
        p.hand.push(card);
        log(`${p.name} retrieves ${cardLabel(card)} from Trash.`);
      }
    }
  }

  if(n===3){
    log(`${p.name} uses Moth. The pile is moving to Trash…`);
    await clearPileAnimated(900);
    log(`${p.name} clears the pile to Trash and gets another play.`);
  }
  if(n===4)await resolveFly(pi);
  if(n===5){
    G.attackOwner=pi;
    G.attack+=2;
    log(`Attack is now +${G.attack}.`);
  }
  if(n===6){
    G.attackOwner=pi;
    G.attack+=1;
    log(`Attack is now +${G.attack}.`);
  }
  if(n===8)await resolveTermite(pi);
  if(n===9)await resolveScorpion(pi);
  if(n===10){
    if(p.human&&canUseSpider(pi)&&!humanSpiderPopupsHidden()){
      const use=await modalChoice('Cockroach','Use Pest Control to avoid drawing?',[
        {label:'Draw 1',value:false,primary:true},
        {label:'Use Pest Control',value:true}
      ]);
      if(use)await burnSpider(pi,'uses Pest Control on their own Cockroach');
      else{
        await drawCardsAnimated(pi,1);
        // Do not make a bot look annoyed at the draw caused by its own Cockroach.
        if(p.human)reactToDraw(pi,1);
      }
    }else if(!p.human&&canUseSpider(pi)&&!isRageAggressor(p)&&(spiderOnlyHandCardWithPantry(pi)||p.hand.length<=2)){
      await burnSpider(pi,'uses Pest Control on Cockroach');
    }else{
      await drawCardsAnimated(pi,1);
      // Do not make a bot look annoyed at the draw caused by its own Cockroach.
      if(p.human)reactToDraw(pi,1);
    }
  }
  render();
}

async function resolveFly(pi){
  const p=G.players[pi];
  const hid=hiddenPan(pi);
  if(!hid.length){
    log(`${p.name} has no face-down Pantry Pest to reveal.`);
    return;
  }

  if(p.human){
    const choice=await choosePantryPositionModal(pi,'Fly: choose a face-down Pantry Pest to reveal','fly');
    p.pantry[choice].up=true;
    log(`You reveal ${cardLabel(p.pantry[choice].card)} in your Pantry.`);
    render();
  }else{
    const idx=hid[rand(hid.length)];
    p.pantry[idx].up=true;
    log(`${p.name} reveals ${cardLabel(p.pantry[idx].card)} in their Pantry.`);
  }
}


async function showReceivedCardModal(fromPi,card){
  resetModalPresentation();
  const from=G.players[fromPi];
  els.modalBody.className='received-card-modal';
  els.modalBody.innerHTML=`
    <h2>You received a card!</h2>
    <p class="received-from">Passed to you by <strong>${from.name}</strong></p>
    <div id="receivedCardSpot" class="received-card-spot"></div>
    <div class="choice-grid received-card-actions">
      <button id="receivedCardDismiss" class="primary">Dismiss</button>
    </div>`;
  const spot=document.getElementById('receivedCardSpot');
  const shown=cardEl(card);
  shown.classList.add('received-card-big');
  spot.appendChild(shown);

  return new Promise(resolve=>{
    modalResolver=resolve;
    els.modal.classList.remove('hidden');
    els.modalClose.style.display='none';
    document.getElementById('receivedCardDismiss').onclick=()=>{
      els.modal.classList.add('hidden');
      els.modalBody.className='';
      els.modalClose.style.display='';
      resetModalPresentation();
      modalResolver=null;
      resolve(true);
    };
  });
}

async function resolveTermite(source){
  const passes=new Map();
  const opted=new Set();

  // Everyone decides before any cards move. A Pest Control user is completely removed
  // from the exchange: they neither give nor receive.
  for(let q=0;q<4;q++){
    const p=G.players[q];
    if(!p.hand.length)continue;

    if(p.human){
      if(canUseSpider(q)&&!humanSpiderPopupsHidden()){
        const use=await modalChoice(
          'Termite',
          'Pass a card left, or use Pest Control to opt out?',
          [
            {label:'Choose a card to pass',value:false,primary:true},
            {label:'Use Pest Control',value:true}
          ]
        );
        if(use){
          await burnSpider(q,'uses Pest Control to opt out of Termite');
          opted.add(q);
          continue;
        }
      }

      const ch=await chooseCardModal('Choose a card to pass left',p.hand);
      if(ch>=0)passes.set(q,p.hand[ch]);
    }else{
      const grantAllNumberedInRuns=p.grantBrain&&
        p.hand.some(c=>c.n!=='S')&&
        p.hand.filter(c=>c.n!=='S').every(c=>grantCompletedRunIds(p.hand).has(c.id));
      if(canUseSpider(q)&&!isRageAggressor(p)&&(grantAllNumberedInRuns||spiderOnlyHandCardWithPantry(q)||totalCards(q)<=2||(p.strategy==='Expert'&&p.hand.length<=3&&runPotentialObj(p.hand)>=4))){
        await burnSpider(q,'uses Pest Control to opt out of Termite');
        opted.add(q);
        continue;
      }

      const idx=botPassChoice(q);
      if(idx>=0)passes.set(q,p.hand[idx]);
    }
  }

  const participants=[0,1,2,3].filter(q=>passes.has(q)&&!opted.has(q));
  if(participants.length<2){
    log('Termite exchange resolves, but there are not enough participating players to pass cards.');
    return;
  }

  // Route each card to the next participating player clockwise, skipping anyone
  // who used Spider (or otherwise is not participating).
  const transfers=[];
  for(const from of participants){
    let to=(from+1)%4;
    while(!participants.includes(to))to=(to+1)%4;
    transfers.push({from,to,card:passes.get(from)});
  }

  // Remove every outgoing card first so nobody can inspect what arrived before
  // their own card has left their hand.
  for(const {from,card} of transfers){
    const idx=G.players[from].hand.findIndex(x=>x.id===card.id);
    if(idx>=0)G.players[from].hand.splice(idx,1);
  }

  for(const {to,card} of transfers){
    G.players[to].hand.push(card);
    G.players[to].knownSingle=G.players[to].hand.length===1?card:null;
  }

  log('Termite exchange resolves. Pest Control users are skipped.');
  render();

  const humanTransfer=transfers.find(t=>t.to===0);
  if(humanTransfer){
    await showReceivedCardModal(humanTransfer.from,humanTransfer.card);
    render();
  }
}

async function resolveScorpion(source){
  let rageGain=0;
  for(let q=0;q<4;q++){
    let avoided=false;
    if(canUseSpider(q)&&!isRageAggressor(G.players[q])){
      if(G.players[q].human&&!humanSpiderPopupsHidden()){
        const use=await modalChoice('Scorpion','Use Pest Control to avoid drawing 1?',[{label:'Draw 1',value:false,primary:true},{label:'Use Pest Control',value:true}]);
        if(use){await burnSpider(q,'uses Pest Control on Scorpion');avoided=true;}
      }else if(!G.players[q].human&&((G.players[q].grantBrain&&G.players[q].pantry.length>0)||spiderOnlyHandCardWithPantry(q)||totalCards(q)<=2)){
        await burnSpider(q,'uses Pest Control on Scorpion');avoided=true;
      }
    }
    if(avoided)continue;
    await drawCardsAnimated(q,1);if(q!==source||G.players[q].human)reactToDraw(q,1);
    if(q!==source&&isRageAggressor(G.players[source]))rageGain++;
  }
  if(rageGain)await addAggressorRage(G.players[source],rageGain);
  log('Scorpion makes everyone draw unless they opt out.');
}

function completedRunSegments(hand){
  const segments=[];
  for(let c=0;c<4;c++){
    const nums=[...new Set(hand.filter(x=>x.n!=='S'&&x.c===c).map(x=>x.n))].sort((a,b)=>a-b);
    let i=0;
    while(i<nums.length){
      let j=i;
      while(j+1<nums.length&&nums[j+1]===nums[j]+1)j++;
      if(j-i+1>=3)segments.push({c,nums:nums.slice(i,j+1)});
      i=j+1;
    }
  }
  return segments;
}

function runInfoForCard(hand,card){
  const segs=completedRunSegments(hand).filter(r=>r.c===card.c&&r.nums.includes(card.n));
  if(!segs.length)return {inRun:false,maxLen:0,endpoint:false,breaksRun:false};
  const maxLen=Math.max(...segs.map(r=>r.nums.length));
  const endpoint=segs.some(r=>r.nums.length>=4&&(card.n===r.nums[0]||card.n===r.nums.at(-1)));
  const after=hand.filter(x=>x.id!==card.id);
  const stillRun=completedRunSegments(after).some(r=>r.c===card.c&&r.nums.length>=3);
  return {inRun:true,maxLen,endpoint,breaksRun:!stillRun};
}

function runCompletionLength(hand,card){
  if(card.n==='S')return 0;
  const before=completedRunSegments(hand).filter(r=>r.c===card.c);
  const after=completedRunSegments([...hand,card]).filter(r=>r.c===card.c&&r.nums.includes(card.n));
  if(!after.length)return 0;
  const oldSets=before.map(r=>r.nums.join(','));
  const fresh=after.filter(r=>!oldSets.includes(r.nums.join(',')));
  return fresh.length?Math.max(...fresh.map(r=>r.nums.length)):0;
}

function isFinishingPlay(p,play){
  return play.cards.length===p.hand.length;
}

function isSpiderBridgePlay(p,play,effect){
  const spiders=p.hand.filter(c=>c.n==='S').length;
  const numbered=p.hand.length-spiders;
  return spiders===1 && play.cards.length===numbered && [5,8,9,10].includes(effect) && p.pantry.length>0;
}

function baseBotPassChoice(pi){
  const p=G.players[pi];
  const eligible=p.hand.map((c,i)=>({c,i})).filter(x=>x.c.n!=='S');
  if(!eligible.length)return -1;
  if(eligible.length===1)return eligible[0].i;

  const left=(pi+1)%4;
  const leftOne=G.players[left].hand.length===1;
  const counts=CounterObj(p.hand.map(c=>c.n));

  // Expert leader-denial rule: if the recipient has one hand card, saddle
  // them with 1-4 whenever possible; otherwise 6-7. Rat/0 and Hornet/5 stay protected.
  if(p.strategy==='Expert'&&leftOne){
    let pool=eligible.filter(x=>x.c.n>=1&&x.c.n<=4);
    if(!pool.length)pool=eligible.filter(x=>x.c.n>=6&&x.c.n<=7);
    if(pool.length){
      pool.sort((a,b)=>{
        // Low number first, then weakest color, while mildly respecting a completed run.
        const ar=runInfoForCard(p.hand,a.c), br=runInfoForCard(p.hand,b.c);
        const ap=(ar.inRun&&ar.breaksRun)?20:0, bp=(br.inRun&&br.breaksRun)?20:0;
        return (a.c.n*5+ap+a.c.c)-(b.c.n*5+bp+b.c.c);
      });
      return pool[0].i;
    }
  }

  function score(x){
    const c=x.c;
    const info=runInfoForCard(p.hand,c);
    let s=0; // higher = happier to pass

    // Weakest color is normally the best color to give away.
    s+=(3-c.c)*2.5;

    if(p.strategy==='Expert'){
      // Learned pass policy: protect duplicates, prefer lower numbered cards,
      // and avoid giving away something that is playable right now.
      const EP=expertPolicyFor(pi);
      s=trainedExpertCardBias(c.n,pi);
      if(counts[c.n]>1)s-=EP.passDupProtect;
      s-=EP.passLow*c.n;
      if(legalCard(c,G.top))s-=EP.passPlayableProtect;
      // v17 refinement: Grandmaster protects 1s slightly more.
      // In mirror testing this moved 1s from ~9.8% to ~7.5% of passes.
      if(p.baseStrategy==='Grandmaster'&&c.n===1)s-=21;
      // v18 refinement: Grandmaster also protects 0s moderately. Mirror testing
      // put the strongest natural pass rate at about 6% of passes.
      if(p.baseStrategy==='Grandmaster'&&c.n===0)s-=31;
      s-=c.c*.2;
      return s;
    }

    if(p.strategy==='Aggressor'){
      // Protect weapons and high chaos cards. Pass utility/setup cards first.
      s+=({0:-8,1:18,2:32,3:-48,4:-58,5:-18,6:26,7:20,8:-80,9:-90,10:-95}[c.n]||0);
      if(counts[c.n]>1&&[3,4,8,9,10].includes(c.n))s-=18;
      if(info.inRun){
        if(info.maxLen===3||info.breaksRun)s-=28;
        else if(info.endpoint)s-=2;
        else s-=18;
      }
      return s;
    }

    if(p.strategy==='Runner'){
      const P=TRAINED_RUNNER_POLICY;
      const after=p.hand.filter((_,i)=>i!==x.i);
      const chainLoss=runnerChainProfile(p.hand)-runnerChainProfile(after);
      const potentialLoss=runPotentialObj(p.hand)-runPotentialObj(after);
      s=-(chainLoss*P.passRunProtect)-(potentialLoss*P.protectChain)-(P.passLow*c.n);
      if(info.inRun)s-=120;
      if(counts[c.n]>1)s-=4;
      s+=(3-c.c)*.4;
      return s;
    }

    if(p.strategy==='Goofball'){
      return (c.n===7?220:0)+(c.n===0?80:0)+(c.n===5?55:0)+(10-c.n)*1.5;
    }

    // Basic: sensible but uncomplicated. It may shave the end of a 4+ run,
    // but dislikes destroying a completed 3-card run.
    s+=(10-c.n)*.9;
    if(c.n===0)s-=90;
    if(c.n===5)s-=22;
    if(c.n===1&&p.pantry.length)s-=10;
    if(counts[c.n]>1)s-=4;
    if(info.inRun){
      if(info.maxLen===3||info.breaksRun)s-=35;
      else if(info.endpoint)s-=1;
      else s-=20;
    }
    return s;
  }

  const scored=eligible.map(x=>({x,score:score(x)})).sort((a,b)=>b.score-a.score);
  return scored[0].x.i;
}
function grantCompletedRunIds(hand){
  const ids=new Set();
  for(const r of completedRunSegments(hand)){
    for(const c of hand){
      if(c.n!=='S'&&c.c===r.c&&r.nums.includes(c.n))ids.add(c.id);
    }
  }
  return ids;
}
function grantPlayBreaksCompletedRun(p,play){
  if(!play||play.type==='run')return false;
  const ids=grantCompletedRunIds(p.hand);
  return (play.cards||[]).some(c=>ids.has(c.id));
}
function grantSafeNormalPlay(pi){
  const p=G.players[pi];
  const ids=grantCompletedRunIds(p.hand);
  const candidates=[];

  // Safe singles outside completed runs.
  for(const c of p.hand){
    if(c.n==='S'||ids.has(c.id)||!legalCard(c,G.top))continue;
    candidates.push({
      score:botNormalScore(pi,c,1),
      play:{type:'single',cards:[c],n:c.n,top:c,effect:c.n}
    });
  }

  // Safe duplicate dumps using only copies outside completed runs.
  const byN=new Map();
  for(const c of p.hand){
    if(c.n==='S'||ids.has(c.id)||!legalCard(c,G.top))continue;
    if(!byN.has(c.n))byN.set(c.n,[]);
    byN.get(c.n).push(c);
  }
  for(const [n,cards] of byN){
    if(cards.length>=2){
      const top=cards.reduce((a,b)=>a.c>b.c?a:b);
      candidates.push({
        score:botNormalScore(pi,top,cards.length),
        play:{type:'duplicates',cards:[...cards],n,top,effect:n}
      });
    }
  }

  // Playing the completed run itself is always safe.
  for(const r of allRuns(pi)){
    const cards=r.cards||r.seq.map(n=>p.hand.find(c=>c.n===n&&c.c===r.c));
    if(!cards.every(Boolean))continue;
    const effect=botChooseRunEffect(pi,r.seq);
    candidates.push({
      score:cards.length*8+trainedExpertCardBias(effect,pi),
      play:{type:'run',cards,seq:r.seq,c:r.c,top:cards.at(-1),effect}
    });
  }

  if(!candidates.length)return null;
  candidates.sort((a,b)=>b.score-a.score);
  return candidates[0].play;
}

function baseGrantAwarePassChoice(pi){
  const p=G.players[pi];
  if(isMegaRunner(p)){
    const eligible=p.hand.map((c,i)=>({c,i})).filter(x=>x.c.n!=='S');if(!eligible.length)return -1;
    const sacred=runnerSacredFiveInfo(p.hand);let pool=sacred?eligible.filter(x=>x.c.c!==sacred.c):eligible;if(!pool.length)pool=eligible;
    pool.sort((a,b)=>runnerNeighborScore(p.hand,a.c)-runnerNeighborScore(p.hand,b.c)||b.c.n-a.c.n||a.c.c-b.c.c);return pool[0].i;
  }
  if(isRageAggressor(p)){
    const eligible=p.hand.map((c,i)=>({c,i})).filter(x=>x.c.n!=='S');if(!eligible.length)return -1;
    let pool=eligible.filter(x=>![5,6,7,9].includes(x.c.n));if(!pool.length)pool=eligible;
    // Give away expendable low-value cards; never choose protected weapons unless forced.
    pool.sort((a,b)=>a.c.n-b.c.n||a.c.c-b.c.c);return pool[0].i;
  }
  let idx=baseBotPassChoice(pi);
  if(p.grantBrain&&idx>=0&&p.hand[idx]?.n===3&&Math.random()<.90){
    const saved=p.hand.filter(c=>c.n===3).map(c=>({c,n:c.n}));for(const x of saved)x.c.n='S';
    const alt=baseBotPassChoice(pi);for(const x of saved)x.c.n=x.n;if(alt>=0&&p.hand[alt]?.n!==3)idx=alt;
  }
  return idx;
}

function botPassChoice(pi){
  const p=G.players[pi];
  if(!p?.grantBrain)return baseGrantAwarePassChoice(pi);

  const ids=grantCompletedRunIds(p.hand);
  const safe=p.hand.map((c,i)=>({c,i})).filter(x=>x.c.n!=='S'&&!ids.has(x.c.id));

  // Prefer any non-run card to breaking a completed run.
  if(safe.length){
    const normal=baseGrantAwarePassChoice(pi);
    if(normal>=0&&!ids.has(p.hand[normal]?.id))return normal;
    safe.sort((a,b)=>a.c.n-b.c.n||a.c.c-b.c.c);
    return safe[0].i;
  }

  // If forced to break a run, sacrifice its lowest NON-ZERO number first.
  // Zero is protected unless it is literally the only option.
  const forced=p.hand.map((c,i)=>({c,i})).filter(x=>x.c.n!=='S'&&ids.has(x.c.id));
  if(forced.length){
    let pool=forced.filter(x=>x.c.n!==0);
    if(!pool.length)pool=forced;
    pool.sort((a,b)=>a.c.n-b.c.n||a.c.c-b.c.c);
    return pool[0].i;
  }

  return baseGrantAwarePassChoice(pi);
}

function CounterObj(arr){
  const o={};
  arr.forEach(x=>o[x]=(o[x]||0)+1);
  return o;
}

function runPotentialObj(hand){
  let v=0;
  for(let c=0;c<4;c++){
    const s=new Set(hand.filter(x=>x.n!=='S'&&x.c===c).map(x=>x.n));
    for(const n of s){
      if(s.has(n+1))v+=1.5;
      if(s.has(n+2))v+=.8;
      if(s.has(n+1)&&s.has(n+2))v+=3;
      if(s.has(n+1)&&s.has(n+2)&&s.has(n+3))v+=4;
    }
  }
  return v;
}

function botCardUtility(pi,c){
  const p=G.players[pi];
  const threat=Math.min(...G.players.map((x,i)=>i===pi?99:totalCards(i)));
  if(c.n==='S')return 20;

  let v=({0:7,1:7,2:3,3:2,4:1,5:10,6:2,7:6,8:3,9:0,10:6}[powerSemantic(c.n)]||0);

  if(c.n===1){
    if(exposed(pi).length)v+=8;
    else if(p.pantry.length)v-=5;
    else v-=8;
  }
  if(c.n===2){
    const trashChoice=G.out.some(x=>x.n!=='S');
    v+=trashChoice?3:-5;
  }
  if(c.n===4&&hiddenPan(pi).length)v+=3;
  if(c.n===8&&threat<=2)v+=6;
  if(c.n===9&&threat<=2)v+=5;
  if(c.n===10){
    v+=3;
    if(p.hand.filter(x=>x.n===10).length>1)v+=4;
  }
  return v;
}

function baseBotRetrieveChoice(pi){
  const p=G.players[pi];
  const cards=G.out.filter(c=>c.n!=='S');
  if(!cards.length)return null;

  // v13 trained Expert retrieval policy.
  if(p.strategy==='Expert'){
    const P=expertPolicyFor(pi);
    const before=runPotentialObj(p.hand);
    const scored=cards.map(c=>{
      let v=trainedExpertCardBias(c.n,pi);
      if(c.n===1)v+=P.trashOne;
      if(c.n===3)v+=P.trashFive;
      if(p.hand.some(x=>x.n===c.n))v+=P.drawDuplicate;
      const gain=runPotentialObj([...p.hand,c])-before;
      if(gain>=3)v+=P.drawRunComplete;
      else if(gain>=1.2)v+=P.drawRunPotential;
      return {c,v};
    }).sort((a,b)=>b.v-a.v);
    return scored.length&&scored[0].v>0?scored[0].c:null;
  }

  // AGGRESSOR: first search for the highest-priority card that becomes a duplicate.
  // Only if no duplicate is available does he consider taking a lone 9 or 10.
  // A Raccoon/2 is never retrieved unless it directly completes a real run.
  if(p.strategy==='Aggressor'){
    const priority=[9,10,8,4,3,5,0,1,7];
    const counts=CounterObj(p.hand.filter(c=>c.n!=='S').map(c=>c.n));
    for(const n of priority){
      if(!counts[n])continue;
      const opts=cards.filter(c=>c.n===n);
      if(opts.length)return [...opts].sort((a,b)=>b.c-a.c)[0];
    }
    const runTwo=cards.filter(c=>c.n===2&&runCompletionLength(p.hand,c)>=3);
    if(runTwo.length)return [...runTwo].sort((a,b)=>b.c-a.c)[0];
    for(const n of [9,10]){
      const opts=cards.filter(c=>c.n===n);
      if(opts.length)return [...opts].sort((a,b)=>b.c-a.c)[0];
    }
    return null;
  }

  if(p.strategy==='Runner'){
    return runnerRetrieveChoice(pi,cards);
  }

  if(p.strategy==='Goofball'){
    const order=[2,9,4,6,3,1,7,0,10,5];
    for(const n of order){const o=cards.find(c=>c.n===n);if(o)return o;}
    return cards[rand(cards.length)];
  }

  // BASIC: Moth remains attractive, but it is no longer an automatic exploit.
  const moths=cards.filter(c=>c.n===3);
  if(moths.length&&Math.random()<.60)return [...moths].sort((a,b)=>b.c-a.c)[0];
  const nonMoths=cards.filter(c=>c.n!==3);
  if(!nonMoths.length)return null;
  const counts=CounterObj(p.hand.map(c=>c.n));
  const values={1:6,0:5,10:4.5,7:4,8:1.5,3:.5,4:.3,6:.2,9:0,2:-2};
  let best=null,bestV=1.5;
  for(const c of nonMoths){
    let v=values[c.n]??0;
    if(c.n===1&&!exposed(pi).length)v-=4;
    if(counts[c.n]>=2)v+=3;
    if(v>bestV){bestV=v;best=c;}
  }
  return best;
}

function botRetrieveChoice(pi){
  const p=G.players[pi],cards=G.out.filter(c=>c.n!=='S');if(!cards.length)return null;
  if(isMegaRunner(p)){
    const sacred=runnerSacredFiveInfo(p.hand);
    if(sacred){const exact=cards.filter(c=>sacred.targets.some(t=>runnerTargetMatch(c,t)));return exact.length?[...exact].sort((a,b)=>b.c-a.c)[0]:null;}
    const ranked=[...cards].sort((a,b)=>runnerBuildValue(p,b)-runnerBuildValue(p,a));return runnerBuildValue(p,ranked[0])>=140?ranked[0]:null;
  }
  if(isRageAggressor(p)){
    for(const n of [9,6,5]){const opts=cards.filter(c=>c.n===n);if(opts.length)return [...opts].sort((a,b)=>b.c-a.c)[0];}
    return baseBotRetrieveChoice(pi);
  }
  if(p.advancedAggressor){
    const nines=cards.filter(c=>c.n===9);if(nines.length)return [...nines].sort((a,b)=>b.c-a.c)[0];
  }
  if(p.grantBrain){
    // UPDATED GRANT RACCOON CHECKLIST:
    // 1) Make or extend a real run.
    // 2) Take a duplicate; highest number first, then strongest color.
    // 3) If the only numbered cards in hand are 1s/2s, take the best-color 3.
    // 4) Otherwise take nothing.
    const beforeRuns=grantRunKeys(p.hand);

    const runChoices=[];
    for(const card of cards){
      const after=[...p.hand,card];
      const afterRuns=grantRunKeys(after);
      const fresh=[...afterRuns].filter(k=>!beforeRuns.has(k));
      if(fresh.length){
        const maxLen=Math.max(...fresh.map(k=>k.split(':')[1].split(',').length));
        runChoices.push({card,maxLen,potential:grantRunPotentialScore(after)});
      }
    }
    if(runChoices.length){
      runChoices.sort((a,b)=>
        b.maxLen-a.maxLen ||
        b.potential-a.potential ||
        b.card.n-a.card.n ||
        b.card.c-a.card.c
      );
      return runChoices[0].card;
    }

    const have=new Set(p.hand.filter(c=>typeof c.n==='number').map(c=>c.n));
    const duplicates=cards.filter(c=>have.has(c.n));
    if(duplicates.length){
      duplicates.sort((a,b)=>b.n-a.n||b.c-a.c);
      return duplicates[0];
    }

    const numbered=p.hand.filter(c=>typeof c.n==='number');
    if(numbered.length&&numbered.every(c=>c.n===1||c.n===2)){
      const threes=cards.filter(c=>c.n===3);
      if(threes.length){
        threes.sort((a,b)=>
          grantRunPotentialScore([...p.hand,b])-grantRunPotentialScore([...p.hand,a]) ||
          b.c-a.c
        );
        return threes[0];
      }
    }

    return null;
  }
  return baseBotRetrieveChoice(pi);
}

function botShouldUseAnt(pi){
  return exposed(pi).length>0;
}


function botNormalScore(pi,c,count){
  const p=G.players[pi];
  const n=c.n;
  const threat=Math.min(...G.players.map((x,i)=>i===pi?99:totalCards(i)));
  const next=(pi+1)%4;
  let s=count*3+n*.25+botCardUtility(pi,c);

  if(p.strategy==='Expert'){
    const P=expertPolicyFor(pi);
    let v=trainedExpertCardBias(n,pi)+count*P.dupBonus;
    if(n===1&&exposed(pi).length)v+=P.oneFaceup;
    if(n===4&&hiddenPan(pi).length)v+=P.sevenHidden;
    if(n===2&&botRetrieveChoice(pi))v+=P.twoUseful;
    if(n===3&&p.hand.some(x=>x.n!=='S'&&x.n<3))v+=P.fiveLow;
    if(n===7)v-=P.sixDefense;
    if(n===0&&p.hand.some(x=>x.n!=='S'&&x.n!==0&&legalCard(x,G.top)))v-=P.zeroHold;
    if((n===5||n===6)&&totalCards(next)<=2)v+=P.attackThreat;
    return v;
  }

  if(p.strategy==='Runner')return runnerNormalScore(pi,c,count);

  if(G.top===null&&n===0)s-=16;
  const hasLowerLegal=p.hand.some(x=>x.n!=='S'&&x.n<n&&legalCard(x,G.top));
  if(n===10&&hasLowerLegal&&(G.top===null||G.top.n<=1))s-=count>1?4:11;
  if(n===5&&totalCards(next)<=3)s+=5;
  if(n===6&&totalCards(next)<=3)s+=3;
  if(n===3)s+=5;
  if(n===8&&totalCards(next)<=2)s+=7;
  if(n===9&&threat<=2)s+=5;

  if(n===1&&p.pantry.length){
    if(exposed(pi).length){
      if(p.strategy==='Expert')s+=14;
      if(p.strategy==='Runner')s+=8;
      if(p.strategy==='Aggressor')s+=4;
    }else if(['Expert','Runner'].includes(p.strategy))s-=7;
  }

  if(p.strategy==='Aggressor'){
    if(n===5)s+=14;
    if(n===6)s+=10;
    if(n===8)s+=12;
    if(n===9)s+=14;
    if(n===10)s+=8;
    if(n===2&&botRetrieveChoice(pi))s+=5;
    if(count>1)s+=4*(count-1);
  }else if(p.strategy==='Goofball'){
    if(n===4)s-=80;
    if(n===3)s+=10;
    if(n===0)s+=8;
    if(n===1&&exposed(pi).length)s+=8;
    if(n===10&&count===1)s-=3;
  }
  return s;
}

function botChooseAttackRunEffect(pi,run){
  const p=G.players[pi];
  const powers=run.attackPowers || run.seq.filter(n=>[5,6,7].includes(n));
  if(!powers.length)return null;

  if(p.strategy==='Aggressor'){
    if(powers.includes(5))return 5;
    if(powers.includes(6))return 6;
    return powers[0];
  }

  if(p.strategy==='Goofball'){
    if(powers.includes(7))return 7; // happily burns a block even on a tiny attack
    if(powers.includes(5))return 5;
    if(powers.includes(6))return 6;
    return powers[0];
  }

  if(p.strategy==='Expert'){
    if(powers.includes(7)&&G.attack>=3)return 7;
    if(powers.includes(5))return 5;
    if(powers.includes(6))return 6;
    if(powers.includes(7))return 7;
    return powers[0];
  }

  if(p.strategy==='Runner'){
    // Runner fights back first: +2 attack, then +1, and blocks only if needed.
    if(powers.includes(5))return 5;
    if(powers.includes(6))return 6;
    if(powers.includes(7))return 7;
    return powers[0];
  }

  if(powers.includes(7)&&G.attack>=2)return 7;
  if(powers.includes(5))return 5;
  if(powers.includes(6))return 6;
  if(powers.includes(7))return 7;
  return powers[0];
}


function baseBotChoosePlay(pi,attackMode=false){
  const p=G.players[pi];

  if(attackMode){
    const choices=[];
    const blocks=p.hand.filter(c=>c.n===7);
    if(blocks.length){
      const use=blocks;
      let blockScore=11+use.length*2;
      if(p.strategy==='Expert')blockScore=8+use.length*2+trainedExpertCardBias(7,pi);
      choices.push({score:blockScore,play:{type:use.length>1?'duplicates':'single',cards:use,n:7,top:use.reduce((a,b)=>a.c>b.c?a:b),effect:7}});
    }
    for(const n of [5,6]){
      const legalCards=p.hand.filter(c=>c.n===n&&legalCard(c,G.top));
      if(legalCards.length){
        const strongest=legalCards.reduce((a,b)=>a.c>b.c?a:b);
        const use=legalCards;
        let attackScore=(n===5?8:6)+use.length*2+(p.strategy==='Aggressor'?14:0);
        if(p.strategy==='Expert')attackScore+=trainedExpertCardBias(n,pi);
        if(p.strategy==='Aggressor'&&n===5)attackScore+=8; // 5 before 6
        choices.push({score:attackScore,play:{type:use.length>1?'duplicates':'single',cards:use,n,top:strongest,effect:n}});
      }
    }
    for(const run of allAttackRuns(pi)){
      const effect=botChooseAttackRunEffect(pi,run);
      let score=run.cards.length*5+(effect===7?8:effect===5?6:4);
      if(p.strategy==='Runner')score+=run.cards.length*4;
      if(p.strategy==='Expert')score+=3;
      if(p.strategy==='Aggressor'&&[5,6].includes(effect))score+=12;
      choices.push({score,play:{type:'run',cards:run.cards,seq:run.seq,c:run.c,top:run.top,effect,attackPowers:run.attackPowers}});
    }
    if(!choices.length)return null;
    // Expert and Runner always take a legal response that empties the hand.
    if(['Expert','Runner'].includes(p.strategy)){
      const finish=choices.filter(x=>isFinishingPlay(p,x.play));
      if(finish.length)return finish.sort((a,b)=>b.play.cards.length-a.play.cards.length)[0].play;
    }
    choices.sort((a,b)=>b.score-a.score);
    if(p.strategy==='Goofball'){
      const bottom=choices.slice(Math.max(0,choices.length-2));
      return bottom[rand(bottom.length)].play;
    }
    return choices[0].play;
  }

  const choices=[];
  const leg=normalLegalPlays(pi);

  if(p.strategy==='Goofball'){
    // One rare moment of competence: if four or more identical numbered cards can be played, dump them immediately.
    for(const n of [...new Set(leg.map(c=>c.n))]){
      const same=p.hand.filter(c=>c.n===n);
      if(same.length>=4&&same.some(c=>legalCard(c,G.top))){
        const top=same.reduce((a,b)=>a.c>b.c?a:b);
        return {type:'duplicates',cards:same,n,top,effect:n};
      }
    }
  }

  for(const n of [...new Set(leg.map(c=>c.n))]){
    const allSame=p.hand.filter(c=>c.n===n);
    const legalSame=allSame.filter(c=>legalCard(c,G.top));
    if(!legalSame.length)continue;
    const strongest=legalSame.reduce((a,b)=>a.c>b.c?a:b);
    let use=allSame;


    if(p.strategy==='Aggressor'){
      // Aggressor cashes duplicates aggressively across the board.
      use=allSame;
    }else if(p.strategy==='Expert'){
      // The evolved Expert learned that cashing duplicates aggressively is highly effective.
      use=allSame;
    }else{
      if([0,1,2,7].includes(n))use=[strongest];
      if(p.strategy==='Runner'){
        const wouldEmpty=allSame.length===p.hand.length;
        if(wouldEmpty){
          use=allSame;
        }else if(allSame.length>1){
          // The trained Runner generally avoids cashing duplicates if doing so
          // damages a developing same-color chain.
          const before=runnerChainProfile(p.hand);
          const allAfter=runnerChainProfile(p.hand.filter(x=>x.n!==n));
          if(allAfter<before || TRAINED_RUNNER_POLICY.dup<0){
            use=[[...legalSame].sort((a,b)=>a.c-b.c)[0]];
          }
        }
      }
      if(p.strategy==='Goofball'&&allSame.length>1&&Math.random()<.82)use=[strongest];
    }

    const play={type:use.length>1?'duplicates':'single',cards:use,n,top:use.reduce((a,b)=>a.c>b.c?a:b)};
    choices.push({score:botNormalScore(pi,play.top,use.length),play});
  }

  const includeRuns=p.strategy!=='Goofball'||Math.random()<.12;
  if(includeRuns){
    for(const r of allRuns(pi)){
      const cards=r.seq.map(n=>p.hand.find(c=>c.n===n&&c.c===r.c));
      const effect=botChooseRunEffect(pi,r.seq);
      let score=cards.length*5+botCardUtility(pi,{n:effect,c:r.c});
      if(p.strategy==='Runner'){
        score=runnerRunScore(pi,cards);
      }else if(p.strategy==='Expert'){
        {const EP=expertPolicyFor(pi);score=EP.runBonus+cards.length*EP.runLenBonus+trainedExpertCardBias(effect,pi);}
      }else if(p.strategy==='Aggressor'&&[5,6,8,9].includes(effect)){
        score+=9;
      }
      choices.push({score,play:{type:'run',cards,seq:r.seq,c:r.c,top:cards.at(-1),effect}});
    }
  }

  if(!choices.length)return null;

  if(p.strategy==='Expert'){
    // Absolute priority: any legal play that clears the entire hand.
    const finishing=choices.filter(x=>isFinishingPlay(p,x.play));
    if(finishing.length){
      finishing.sort((a,b)=>b.play.cards.length-a.play.cards.length||b.score-a.score);
      return finishing[0].play;
    }
    // High-impact card + Pest Control bridge into Pantry is an elite endgame line.
    const bridges=choices.filter(x=>{
      const effect=x.play.type==='run'?x.play.effect:x.play.n;
      return isSpiderBridgePlay(p,x.play,effect);
    });
    if(bridges.length){
      bridges.sort((a,b)=>b.score-a.score);
      return bridges[0].play;
    }
  }
  if(p.strategy==='Runner'){
    // Runner's personality never overrides a guaranteed hand-emptying play.
    const finishing=choices.filter(x=>isFinishingPlay(p,x.play));
    if(finishing.length){
      finishing.sort((a,b)=>b.play.cards.length-a.play.cards.length||b.score-a.score);
      return finishing[0].play;
    }
  }

  choices.sort((a,b)=>b.score-a.score);
  if(p.strategy==='Goofball'){
    const nonSeven=choices.filter(x=>!x.play.cards.some(c=>c.n===7));
    const source=nonSeven.length?nonSeven:choices;
    const badPool=source.slice(Math.max(0,source.length-Math.min(3,source.length)));
    return badPool[rand(badPool.length)].play;
  }
  return choices[0].play;
}

function runnerMegaPlay(pi,attackMode=false){
  const p=G.players[pi];
  if(attackMode){
    const mega=allAttackRuns(pi).filter(r=>r.seq.length>=6).sort((a,b)=>b.seq.length-a.seq.length);
    if(mega.length){const r=mega[0],effect=botChooseAttackRunEffect(pi,r);return {type:'run',cards:r.cards,seq:r.seq,c:r.c,top:r.top,effect,attackPowers:r.attackPowers};}
    const sacred=runnerSacredFiveInfo(p.hand);
    let candidates=[];
    for(const n of [7,6,5])for(const c of p.hand.filter(c=>c.n===n&&(n===7||legalCard(c,G.top))))candidates.push(c);
    if(!candidates.length)return null;
    let pool=sacred?candidates.filter(c=>c.c!==sacred.c):candidates;if(!pool.length)pool=candidates;
    pool.sort((a,b)=>runnerNeighborScore(p.hand,a)-runnerNeighborScore(p.hand,b)||a.c-b.c);
    const c=pool[0];return {type:'single',cards:[c],n:c.n,top:c,effect:c.n};
  }
  const mega=allRuns(pi).filter(r=>r.seq.length>=6).sort((a,b)=>b.seq.length-a.seq.length);
  if(mega.length){const r=mega[0],cards=r.seq.map(n=>p.hand.find(c=>c.n===n&&c.c===r.c)),effect=botChooseRunEffect(pi,r.seq);return {type:'run',cards,seq:r.seq,c:r.c,top:cards.at(-1),effect};}
  const sacred=runnerSacredFiveInfo(p.hand);
  if(sacred){
    const target=runnerTargetInTrash(p);
    if(target){
      const twos=p.hand.filter(c=>c.n===2&&c.c!==sacred.c&&legalCard(c,G.top)).sort((a,b)=>runnerNeighborScore(p.hand,a)-runnerNeighborScore(p.hand,b));
      if(twos.length){const c=twos[0];return {type:'single',cards:[c],n:2,top:c,effect:2};}
      if(G.top&&G.top.n>=3){
        const fives=p.hand.filter(c=>c.n===3&&c.c!==sacred.c&&legalCard(c,G.top)).sort((a,b)=>a.c-b.c);if(fives.length){const c=fives[0];return {type:'single',cards:[c],n:3,top:c,effect:3};}
      }
    }
    const nonsacred=p.hand.filter(c=>c.n!=='S'&&c.c!==sacred.c&&legalCard(c,G.top));
    const zeros=nonsacred.filter(c=>c.n===0);if(zeros.length){const all=p.hand.filter(c=>c.n===0&&c.c!==sacred.c);return {type:all.length>1?'duplicates':'single',cards:all,n:0,top:all.reduce((a,b)=>a.c>b.c?a:b),effect:0};}
    if(nonsacred.length){nonsacred.sort((a,b)=>{const av=a.n*20-runnerNeighborScore(p.hand,a)*8,bv=b.n*20-runnerNeighborScore(p.hand,b)*8;return bv-av||b.c-a.c;});const c=nonsacred[0];return {type:'single',cards:[c],n:c.n,top:c,effect:c.n};}
    const forced=p.hand.filter(c=>c.n!=='S'&&legalCard(c,G.top));if(forced.length){forced.sort((a,b)=>runnerNeighborScore(p.hand,a)-runnerNeighborScore(p.hand,b)||b.n-a.n);const c=forced[0];return {type:'single',cards:[c],n:c.n,top:c,effect:c.n};}
    return null;
  }
  const zeros=p.hand.filter(c=>c.n===0&&legalCard(c,G.top));if(zeros.length){const all=p.hand.filter(c=>c.n===0);return {type:all.length>1?'duplicates':'single',cards:all,n:0,top:all.reduce((a,b)=>a.c>b.c?a:b),effect:0};}
  const twos=p.hand.filter(c=>c.n===2&&legalCard(c,G.top));if(twos.length&&G.out.some(c=>c.n!=='S'&&runnerBuildValue(p,c)>=140)){const c=[...twos].sort((a,b)=>runnerNeighborScore(p.hand,a)-runnerNeighborScore(p.hand,b))[0];return {type:'single',cards:[c],n:2,top:c,effect:2};}
  const singles=p.hand.filter(c=>c.n!=='S'&&legalCard(c,G.top));if(!singles.length)return null;
  singles.sort((a,b)=>{const pa=a.n<=7?runnerNeighborScore(p.hand,a):0,pb=b.n<=7?runnerNeighborScore(p.hand,b):0;return (b.n*20-pb*8)-(a.n*20-pa*8)||b.c-a.c;});const c=singles[0];return {type:'single',cards:[c],n:c.n,top:c,effect:c.n};
}
function aggressorNormalPlay(pi){
  const p=G.players[pi];
  // 9 ALWAYS first, one at a time, weakest legal color first.
  for(const n of [9]){const opts=p.hand.filter(c=>c.n===n&&legalCard(c,G.top)).sort((a,b)=>a.c-b.c);if(opts.length){const c=opts[0];return {type:'single',cards:[c],n,top:c,effect:n};}}
  // If a 9 is in Trash, Raccoon beats 6/5 so he can retrieve it.
  if(G.out.some(c=>c.n===9)){const twos=p.hand.filter(c=>c.n===2&&legalCard(c,G.top)).sort((a,b)=>a.c-b.c);if(twos.length){const c=twos[0];return {type:'single',cards:[c],n:2,top:c,effect:2};}}
  for(const n of [6,5]){const opts=p.hand.filter(c=>c.n===n&&legalCard(c,G.top)).sort((a,b)=>a.c-b.c);if(opts.length){const c=opts[0];return {type:'single',cards:[c],n,top:c,effect:n};}}
  const leg=p.hand.filter(c=>c.n!=='S'&&legalCard(c,G.top)),nums=[...new Set(leg.map(c=>c.n))].filter(n=>![5,6,9].includes(n));
  const dups=[];for(const n of nums){const all=p.hand.filter(c=>c.n===n);if(all.length>1)dups.push({n,all,top:all.reduce((a,b)=>a.c>b.c?a:b)});}if(dups.length){dups.sort((a,b)=>b.all.length-a.all.length||a.n-b.n);const d=dups[0];return {type:'duplicates',cards:d.all,n:d.n,top:d.top,effect:d.n};}
  // Never voluntarily use Pest Control outside an attack.
  const nonSpider=leg.filter(c=>c.n!=='S');if(!nonSpider.length)return null;
  // Fall back to a simple high-card play.
  nonSpider.sort((a,b)=>b.n-a.n||a.c-b.c);const c=nonSpider[0];return {type:'single',cards:[c],n:c.n,top:c,effect:c.n};
}
function baseUpdatedGrantChoosePlay(pi,attackMode=false){
  const p=G.players[pi];
  if(isMegaRunner(p))return runnerMegaPlay(pi,attackMode);
  if(isRageAggressor(p)&&!attackMode)return aggressorNormalPlay(pi);
  if(p.advancedAggressor&&!attackMode){
    // Keep a little Aggressor identity after the switch: 9 immediately; 2 before 5/6 if a 9 is in Trash.
    const n9=p.hand.filter(c=>c.n===9&&legalCard(c,G.top)).sort((a,b)=>a.c-b.c)[0];if(n9)return {type:'single',cards:[n9],n:9,top:n9,effect:9};
    if(G.out.some(c=>c.n===9)){const two=p.hand.filter(c=>c.n===2&&legalCard(c,G.top)).sort((a,b)=>a.c-b.c)[0];if(two)return {type:'single',cards:[two],n:2,top:two,effect:2};}
  }
  return baseBotChoosePlay(pi,attackMode);
}

function botChoosePlay(pi,attackMode=false){
  const p=G.players[pi];
  const original=baseUpdatedGrantChoosePlay(pi,attackMode);

  if(!p?.grantBrain||!original)return original;

  const runIds=grantCompletedRunIds(p.hand);

  if(attackMode){
    // Never willingly defend with a card embedded in a completed run if another
    // numbered defense outside the run exists.
    if(!grantPlayBreaksCompletedRun(p,original))return original;

    const alternatives=[];
    for(const n of [7,5,6]){
      const opts=p.hand
        .filter(c=>c.n===n&&!runIds.has(c.id)&&(n===7||legalCard(c,G.top)))
        .sort((a,b)=>a.c-b.c);
      if(opts.length){
        const c=opts[0];
        alternatives.push({type:'single',cards:[c],n,top:c,effect:n});
      }
    }
    if(alternatives.length)return alternatives[0];
    return original;
  }

  let chosen=original;

  // Never willingly break a completed run. Play a safe non-run card or the
  // completed run itself instead.
  if(chosen.type!=='run'&&grantPlayBreaksCompletedRun(p,chosen)){
    const safe=grantSafeNormalPlay(pi);
    if(safe)chosen=safe;
  }

  // Locked Grant preference: 70% chance to switch to a SAFE playable 3.
  // A 3 inside a completed run is never eligible.
  const chosenNumber=chosen.type==='run'
    ? (chosen.effect??chosen.n??Math.max(...chosen.cards.map(c=>c.n)))
    : chosen.n;

  if(chosenNumber!==3){
    const safeThrees=p.hand
      .filter(c=>c.n===3&&!runIds.has(c.id)&&legalCard(c,G.top))
      .sort((a,b)=>a.c-b.c);

    if(safeThrees.length&&Math.random()<.70){
      const top=safeThrees.reduce((a,b)=>a.c>b.c?a:b);
      chosen={
        type:safeThrees.length>1?'duplicates':'single',
        cards:[...safeThrees],
        n:3,
        top,
        effect:3
      };
    }
  }

  return chosen;
}

function botChooseRunEffect(pi,seq){
  const p=G.players[pi];
  const options=seq.filter(n=>n!==0);

  if(p.strategy==='Expert'){
    const P=expertPolicyFor(pi);
    let best=options[0],bestValue=-Infinity;
    for(const n of options){
      let v=trainedExpertCardBias(n,pi);
      if(n===1&&exposed(pi).length)v+=P.oneFaceup;
      if(n===4&&hiddenPan(pi).length)v+=P.sevenHidden;
      if(n===2&&botRetrieveChoice(pi))v+=P.twoUseful;
      if(v>bestValue){bestValue=v;best=n;}
    }
    return best;
  }

  if(p.strategy==='Aggressor'){
    for(const n of [5,6,8,9])if(options.includes(n))return n;
  }

  if(p.strategy==='Runner'){
    let best=options[0],bestValue=-Infinity;
    for(const n of options){
      let v=trainedRunnerCardBias(n);
      if(n===1&&exposed(pi).length)v+=2;
      if(n===4&&hiddenPan(pi).length)v+=2;
      if(n===2&&botRetrieveChoice(pi))v+=2;
      if(v>bestValue){bestValue=v;best=n;}
    }
    return best;
  }

  if(p.strategy==='Goofball'){
    let worst=options[0];
    let worstValue=Infinity;
    for(const n of options){
      let v=botCardUtility(pi,{n,c:0});
      if(n===10)v-=8;
      if(n===9)v-=4;
      if(v<worstValue){worstValue=v;worst=n;}
    }
    return worst;
  }

  let best=options[0];
  let bestValue=-99;
  for(const n of options){
    let v=botCardUtility(pi,{n,c:0});
    if(n===3)v+=7;
    if(n===10)v-=6;
    if(n===9&&Math.min(...G.players.map((x,i)=>i===pi?99:totalCards(i)))>2)v-=3;


    if(v>bestValue){
      bestValue=v;
      best=n;
    }
  }
  return best;
}


function maybeUpgradeRunnerAfterRun(p,runLength){
  if(p.baseStrategy!=='Runner'||p.runnerExpert||runLength<6)return false;
  p.runnerExpert=true;makeGrantBrain(p,10);log(`${p.name} completes a massive run and becomes an Advanced Runner!`);return true;
}


async function showGameEventOverlay({kicker='',title='',subtitle='',cards=[],kind='generic',duration=1350,dismissible=false}={}){
  const wrap=document.createElement('div');wrap.className=`game-event-overlay ${kind}`;
  const cardRow=cards.length?`<div class="event-card-row"></div>`:'';
  const dismiss=dismissible?`<button class="event-dismiss primary">DISMISS</button>`:'';
  wrap.innerHTML=`<div class="game-event-card"><div class="event-kicker">${kicker}</div><div class="event-title">${title}</div>${cardRow}<div class="event-subtitle">${subtitle}</div>${dismiss}</div>`;
  document.body.appendChild(wrap);
  if(cards.length){const row=wrap.querySelector('.event-card-row');cards.forEach(c=>{const e=cardEl(c);e.classList.add('event-show-card');row.appendChild(e);});}
  await new Promise(requestAnimationFrame);wrap.classList.add('show');
  if(dismissible){
    await new Promise(resolve=>wrap.querySelector('.event-dismiss').addEventListener('click',resolve,{once:true}));
  }else{
    await sleep(duration);
  }
  wrap.classList.remove('show');await sleep(260);wrap.remove();
}
async function showRunnerUpgradeOverlay(p,cards){
  await showGameEventOverlay({kicker:'MEGA RUN!',title:'ADVANCED RUNNER',subtitle:`${p.name} completed a ${cards.length}-card run and leveled up!`,cards,kind:'runner-event',dismissible:true});
}
function rageSegmentsHtml(value){return Array.from({length:8},(_,i)=>`<i class="${i<value?'filled':''}"></i>`).join('');}
async function showRageGainOverlay(p,after,gain){
  const wrap=document.createElement('div');wrap.className='game-event-overlay rage-event';
  const full=after>=8;
  wrap.innerHTML=`<div class="game-event-card"><div class="event-kicker">RAGE +${gain}</div><div class="event-title">${full?'FULLY ENRAGED!':`${p.name} IS GETTING ANGRIER!`}</div><div class="rage-overlay-bar">${rageSegmentsHtml(after)}</div><div class="event-subtitle">${after}/8 RAGE</div><button class="event-dismiss primary">DISMISS</button></div>`;
  document.body.appendChild(wrap);
  await new Promise(requestAnimationFrame);wrap.classList.add('show');
  await new Promise(resolve=>wrap.querySelector('.event-dismiss').addEventListener('click',resolve,{once:true}));
  wrap.classList.remove('show');await sleep(240);wrap.remove();
}
async function addAggressorRage(p,amount){
  if(!isRageAggressor(p)||amount<=0)return;
  const before=p.rage||0,after=Math.min(8,before+amount);if(after===before)return;p.rage=after;render();await showRageGainOverlay(p,after,after-before);
  if(after>=8&&!p.advancedAggressor){p.advancedAggressor=true;makeGrantBrain(p,10);log(`${p.name} is FULLY ENRAGED and becomes an advanced Aggressor!`);render();}
}

async function performPlay(pi,play){
  const p=G.players[pi];
  let effect;

  if(play.type==='run'){
    effect=play.effect ?? (p.human?await chooseRunPower(play.seq):botChooseRunEffect(pi,play.seq));
  }else{
    effect=play.n ?? play.cards[0].n;
  }

  const runnerWillUpgrade=play.type==='run'&&p.baseStrategy==='Runner'&&!p.runnerExpert&&play.cards.length>=6;
  const runnerRunCards=runnerWillUpgrade?[...play.cards]:null;

  await animatePlayedCards(pi,play.cards);

  for(const card of play.cards){
    const idx=p.hand.findIndex(x=>x.id===card.id);
    if(idx>=0)p.hand.splice(idx,1);
    G.discard.push(card);
  }

  if(play.type==='run'){
    G.top=play.top || play.cards.at(-1);
    log(`${p.name} plays a ${COLOR_NAMES[play.c]} ${play.seq.join('-')} run and chooses ${effect} (${PESTS[effect].name}).`);
  }else{
    G.top=play.top || play.cards.reduce((a,b)=>a.c>b.c?a:b);
    log(`${p.name} plays ${play.cards.length>1?`${play.cards.length} × `:''}${play.cards[0].n} ${PESTS[play.cards[0].n].name}.`);
  }

  recordDiscardEntry(pi,play.cards,{type:play.type,effect,label:play.type==='run'?`Power: ${effect} ${PESTS[effect].name}`:null});
  G.lastSuccessful=pi;
  G.startingCardActive=false;
  G.lastPlayedBy=p.name;
  G.passes=0;
  p.knownSingle=null;
  render();

  if(runnerWillUpgrade&&maybeUpgradeRunnerAfterRun(p,runnerRunCards.length)){render();await showRunnerUpgradeOverlay(p,runnerRunCards);}
  if([5,6].includes(effect))G.attackOwner=pi;

  if(!p.hand.length){
    if(!p.pantry.length){
      endGame(pi);
      return;
    }
    await pullPantry(pi);
  }

  if(G.over)return;
  await resolveEffect(pi,effect);
}

async function chooseRunPower(seq,allowedPowers=null){
  const available=(allowedPowers || seq.filter(n=>n!==0)).filter(n=>n!==0);
  const choices=available.map(n=>({
    label:`${n} — ${PESTS[n].name}: ${PESTS[n].effect}`,
    value:n,
    primary:n===5||n===6
  }));
  return modalChoice('Choose the run power','Only one power activates.',choices);
}

async function performAttackPlay(pi,play){
  const p=G.players[pi];
  const runnerWillUpgrade=play.type==='run'&&p.baseStrategy==='Runner'&&!p.runnerExpert&&play.cards.length>=6;
  const runnerRunCards=runnerWillUpgrade?[...play.cards]:null;
  let effect=play.effect;
  if(play.type==='run'&&p.human){
    effect=await chooseRunPower(play.seq,play.attackPowers);
  }
  if(effect===undefined)effect=play.n;

  await animatePlayedCards(pi,play.cards);

  for(const card of play.cards){
    const idx=p.hand.findIndex(x=>x.id===card.id);
    if(idx>=0)p.hand.splice(idx,1);
    G.discard.push(card);
  }

  G.top=play.top || (play.type==='run'?play.cards.at(-1):play.cards.reduce((a,b)=>a.c>b.c?a:b));
  G.lastSuccessful=pi;
  G.startingCardActive=false;
  G.lastPlayedBy=p.name;
  G.passes=0;
  p.knownSingle=null;
  recordDiscardEntry(pi,play.cards,{type:play.type,effect,label:`Attack response: ${effect} ${PESTS[effect].name}`});

  if(play.type==='run'){
    log(`${p.name} defends with a ${COLOR_NAMES[play.c]} ${play.seq.join('-')} run and chooses ${effect} (${PESTS[effect].name}).`);
  }else{
    log(`${p.name} defends with ${play.cards.length>1?`${play.cards.length} × `:''}${play.cards[0].n} ${PESTS[play.cards[0].n].name}.`);
  }
  render();
  if(runnerWillUpgrade&&maybeUpgradeRunnerAfterRun(p,runnerRunCards.length)){render();await showRunnerUpgradeOverlay(p,runnerRunCards);}

  if(!p.hand.length){
    if(!p.pantry.length){
      endGame(pi);
      return 'won';
    }
    await pullPantry(pi);
  }

  if([5,6].includes(effect))G.attackOwner=pi;

  if(effect===7){
    log(`${p.name} blocks the entire +${G.attack} attack with Beetle.`);
    G.attack=0;G.attackOwner=null;
    return 'blocked';
  }

  if(effect===5){
    G.attack+=2;
    log(`${p.name} passes the attack onward. It is now +${G.attack}.`);
    return 'stacked';
  }

  if(effect===6){
    G.attack+=1;
    log(`${p.name} passes the attack onward. It is now +${G.attack}.`);
    return 'stacked';
  }

  return 'defended';
}

async function handleAttack(pi){
  const p=G.players[pi];

  if(p.human){
    selected.clear();
    render();

    const action=await new Promise(resolve=>{
      humanResolver={type:'attack',resolve};
    });

    if(action==='forced-end')return 'won';
    if(action==='spider'){
      await burnSpider(pi,`uses Pest Control and passes the +${G.attack} attack onward`);
      G.passes++;
      if(await resolveCompletedPassCycle(pi))return 'stay';
      return 'passed';
    }

    if(action==='draw'){
      if(hasNumberedAttackDefense(pi)){
        showToast('You have a legal numbered response, so you must play it.');
        return handleAttack(pi);
      }
      const amount=G.attack,owner=G.attackOwner;
      log(`You take the attack, draw ${amount}, and lose your turn.`);
      await drawCardsAnimated(pi,amount);
      G.attack=0;G.attackOwner=null;
      if(owner!==null&&owner!==undefined&&owner!==pi&&isRageAggressor(G.players[owner]))await addAggressorRage(G.players[owner],amount);
      G.passes++;
      reactToDraw(pi,amount);
      selected.clear();
      render();
      if(await resolveCompletedPassCycle(pi))return 'stay';
      return 'drawn';
    }

    const val=validateSelection(pi,action.indices,true);
    if(!val.ok){
      showToast(val.msg);
      selected.clear();
      return handleAttack(pi);
    }

    selected.clear();
    return performAttackPlay(pi,val);
  }

  await sleep(botThinkDelay());
  await waitWhileHome();

  if(isRageAggressor(p)){
    // Best Rage line: 6 first (easier to continue), then 5; always one card, weakest legal color.
    for(const n of [6,5]){
      const opts=p.hand.filter(c=>c.n===n&&legalCard(c,G.top)).sort((a,b)=>a.c-b.c);
      if(opts.length){const c=opts[0];return performAttackPlay(pi,{type:'single',cards:[c],n,top:c,effect:n});}
    }
    // Pest Control only exists to pass an attack onward, and is preferred over blocking with 7.
    if(canUseSpider(pi)){
      G.attackOwner=pi;
      await burnSpider(pi,`uses Pest Control and angrily passes the +${G.attack} attack onward`);G.passes++;
      if(await resolveCompletedPassCycle(pi))return 'stay';return 'passed';
    }
    const beetles=p.hand.filter(c=>c.n===7);
    if(beetles.length){const top=beetles.reduce((a,b)=>a.c>b.c?a:b);return performAttackPlay(pi,{type:beetles.length>1?'duplicates':'single',cards:beetles,n:7,top,effect:7});}
    const amount=G.attack,owner=G.attackOwner;log(`${p.name} draws ${amount} and loses the turn.`);await drawCardsAnimated(pi,amount);G.attack=0;G.attackOwner=null;G.passes++;reactToDraw(pi,amount);
    if(owner!==null&&owner!==undefined&&owner!==pi&&isRageAggressor(G.players[owner]))await addAggressorRage(G.players[owner],amount);
    if(await resolveCompletedPassCycle(pi))return 'stay';return 'drawn';
  }

  const play=botChoosePlay(pi,true);

  if(play){
    return performAttackPlay(pi,play);
  }

  if(canUseSpider(pi)){
    await burnSpider(pi,`uses Pest Control and passes the +${G.attack} attack onward`);
    G.passes++;
    if(await resolveCompletedPassCycle(pi))return 'stay';
    return 'passed';
  }

  const amount=G.attack,owner=G.attackOwner;
  log(`${p.name} draws ${amount} and loses the turn.`);
  await drawCardsAnimated(pi,amount);
  G.attack=0;G.attackOwner=null;
  if(owner!==null&&owner!==undefined&&owner!==pi&&isRageAggressor(G.players[owner]))await addAggressorRage(G.players[owner],amount);
  G.passes++;
  reactToDraw(pi,amount);
  if(await resolveCompletedPassCycle(pi))return 'stay';
  return 'drawn';
}

async function confirmEmptyPower(effect){
  if(effect===1&&G.players[0].pantry.length>0&&exposed(0).length===0){
    return modalChoice(
      'Ant has nothing to take',
      '<p>You have no face-up Pantry Pests, so Ant’s power will do nothing.</p>',
      [
        {label:'Choose a different play',value:false},
        {label:'Play Ant anyway',value:true,primary:true}
      ]
    );
  }
  if(effect===2&&!G.out.some(c=>c.n!=='S')){
    return modalChoice(
      'Trash is empty',
      '<p>There are no numbered Pests in Trash, so Raccoon’s power will do nothing.</p>',
      [
        {label:'Choose a different play',value:false},
        {label:'Play Raccoon anyway',value:true,primary:true}
      ]
    );
  }
  return true;
}

async function humanTurn(){
  selected.clear();
  render();

  if(G.attack>0){
    const attackResult=await handleAttack(0);
    if(attackResult==='stay')return 'stay';
    return;
  }

  armHumanIdleReaction();
  const action=await new Promise(resolve=>{
    humanResolver={type:'normal',resolve};
  });
  clearHumanIdleReactionTimer();

  if(action==='forced-end')return;
  if(action==='draw'){
    await drawCardsAnimated(0,1);
    reactToDraw(0,1);
    G.passes++;
    log('You draw 1 and pass.');
    if(await resolveCompletedPassCycle(G.current))return 'stay';
    return;
  }

  if(action==='spider'){
    await burnSpider(0,'uses Pest Control to pass');
    G.passes++;
    if(await resolveCompletedPassCycle(G.current))return 'stay';
    return;
  }

  const val=validateSelection(0,action.indices,false);
  if(!val.ok){
    showToast(val.msg);
    return humanTurn();
  }

  if(val.type==='run')val.effect=await chooseRunPower(val.seq);
  const chosenEffect=val.type==='run'?val.effect:val.n;
  if(!await confirmEmptyPower(chosenEffect)){
    selected.clear();
    render();
    return humanTurn();
  }
  selected.clear();
  await performPlay(0,val);
  if(G.over)return;

  const effect=val.type==='run'?val.effect:val.n;
  if(effect===3){
    G.current=0;
    return 'stay';
  }
}

async function botTurn(pi){
  if(G.attack>0){
    const attackResult=await handleAttack(pi);
    if(attackResult==='stay')return 'stay';
    return;
  }

  await sleep(botThinkDelay());
  await waitWhileHome();
  const p=G.players[pi];
  const play=botChoosePlay(pi,false);

  if(!play){
    if(p.grantBrain&&canUseSpider(pi)){
      await burnSpider(pi,p.hand.length===1&&p.pantry.length?'uses their last hand Pest Control to pass and move into the Pantry':'uses Pest Control to pass');
    }else if(canUseSpider(pi)&&!isRageAggressor(p)&&spiderOnlyHandCardWithPantry(pi)){
      await burnSpider(pi,'uses their last hand Pest Control to pass and move into the Pantry');
    }else if(canUseSpider(pi)&&!isRageAggressor(p)&&G.top&&G.top.n>=9&&G.passes>=1&&p.strategy==='Expert'){
      await burnSpider(pi,'uses Pest Control to pass');
    }else{
      await drawCardsAnimated(pi,1);
      reactToDraw(pi,1);
      log(`${p.name} cannot play, draws 1, and passes.`);
    }
    G.passes++;
    if(await resolveCompletedPassCycle(pi))return 'stay';
    return;
  }

  await performPlay(pi,play);
  if(G.over)return;

  const effect=play.type==='run'?play.effect:play.n;
  if(effect===3){
    G.current=pi;
    return 'stay';
  }
}

async function runLoop(session=gameSessionId){
  while(G&&!G.over&&session===gameSessionId){
    await waitWhileHome(session);
    if(!G||G.over||session!==gameSessionId)break;
    render();
    const pi=G.current;
    const result=pi===0?await humanTurn():await botTurn(pi);
    if(!G||G.over||session!==gameSessionId)break;
    if(result!=='stay')G.current=(pi+1)%4;
    G.turns++;
    render();
  }
}

function endGame(pi){
  if(!G||G.over)return;
  G.over=true;
  setEndGameLock(true);
  clearHumanIdleReactionTimer();
  reactGameEnd(pi);
  render();
  log(`${G.players[pi].name} wins!`);

  const won=pi===0;
  if(won){
    // The full-screen trophy celebration is the entire human-win presentation.
    // A Home button appears beneath the trophy after five seconds.
    showVictoryCelebration();
    return;
  }

  setTimeout(()=>{
    if(!G||!G.over)return;
    const botSummary=botWinSummaryHtml(pi);
    modalChoice(
      `${G.players[pi].name} WINS`,
      `${botSummary}<div class="victory-congrats">GAME OVER</div><p class="end-game-message">Better luck next game.</p>`,
      [{label:'Home',value:'home',primary:true}],
      false,
      'end-game-modal'
    ).then(()=>showHomeScreen());
  },1100);
}

async function showSelectWinner(){
  if(!G){showToast('Start a game before selecting a winner.');return;}
  if(G.over){showToast('This game already has a winner.');return;}
  const choices=G.players.map((p,pi)=>({label:pi===0?'You':p.name,value:pi,primary:pi===0}));
  choices.push({label:'Cancel',value:null});
  const winner=await modalChoice(
    'Select Winner',
    '<p class="meta">Testing tool: the player you choose will win immediately.</p>',
    choices,
    false,
    'select-winner-modal'
  );
  if(winner===null||winner===undefined||!G||G.over)return;
  // Release a waiting human turn so no stale promise survives the forced game end.
  if(humanResolver){humanResolver.resolve('forced-end');humanResolver=null;}
  endGame(winner);
}

function updateBotSetupPreview(slot){
  const select=document.getElementById(`bot${slot}`);
  const img=document.getElementById(`bot${slot}PreviewImg`);
  const desc=document.getElementById(`bot${slot}Description`);
  if(!select||!img||!desc)return;
  const info=botType(select.value);
  img.src=info.image;
  img.alt=`${select.value} bot`;
  desc.textContent=info.description;
}

for(let slot=1;slot<=3;slot++){
  const select=document.getElementById(`bot${slot}`);
  if(select)select.addEventListener('change',()=>updateBotSetupPreview(slot));
  updateBotSetupPreview(slot);
}

els.play.onclick=()=>{
  if(!humanResolver)return;
  clearHumanIdleReactionTimer();
  const indices=[...selected];
  const cards=indices.map(i=>G?.players?.[0]?.hand?.[i]).filter(Boolean);
  if(cards.length===1&&cards[0].n==='S'){
    humanResolver.resolve('spider');
  }else{
    humanResolver.resolve({indices});
  }
  humanResolver=null;
};
els.draw.onclick=()=>{if(!humanResolver)return;clearHumanIdleReactionTimer();humanResolver.resolve('draw');humanResolver=null;};
els.spiderPass.onclick=()=>{if(!humanResolver)return;clearHumanIdleReactionTimer();humanResolver.resolve('spider');humanResolver=null;};
function animateHandResort(nextMode){
  if(handSortMode===nextMode)return;
  const before=new Map();
  document.querySelectorAll('#yourHand [data-card-id]').forEach(el=>{
    before.set(el.dataset.cardId,el.getBoundingClientRect());
  });

  handSortMode=nextMode;
  selected.clear();
  render();

  const moved=[];
  document.querySelectorAll('#yourHand [data-card-id]').forEach(el=>{
    const old=before.get(el.dataset.cardId);
    if(!old)return;
    const now=el.getBoundingClientRect();
    const dx=old.left-now.left;
    const dy=old.top-now.top;
    if(Math.abs(dx)<1&&Math.abs(dy)<1)return;
    el.style.transition='none';
    el.style.transform=`translate(${dx}px,${dy}px)`;
    el.style.zIndex='80';
    moved.push(el);
  });

  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    moved.forEach(el=>{
      el.style.transition='transform 260ms cubic-bezier(.22,.9,.26,1)';
      el.style.transform='';
    });
    setTimeout(()=>{
      moved.forEach(el=>{
        el.style.transition='';
        el.style.zIndex='';
      });
    },290);
  }));
}
els.sortColor.onclick=()=>animateHandResort('color');
els.sortNumber.onclick=()=>animateHandResort('number');
els.drawPile.onclick=()=>{if(els.draw.disabled)return;els.draw.click();};
els.outPile.onclick=()=>showOut();
els.current.onclick=()=>showDiscardHistory();

async function pantryEntranceTransition(){
  if(!document.body.classList.contains('home-mode'))return;
  els.setup.classList.add('home-transitioning');

  // Fade the bot selection away before the Pantry transition.
  els.setupPanel.classList.remove('home-fade-in','home-poof-in');
  void els.setupPanel.offsetWidth;
  els.setupPanel.classList.add('home-fade-out');
  await sleep(460);
  els.setupPanel.classList.add('setup-panel-hidden');
  els.setupPanel.classList.remove('home-fade-out','home-poof-out','home-poof-in');

  // Stay in the dark Pantry longer before the light comes on.
  await sleep(1450);
  els.setup.classList.add('pantry-light-on');

  // Hold on the lit Pantry longer before entering gameplay.
  await sleep(1750);

  // Brief cinematic fade before the game board appears.
  els.setup.classList.add('game-transition-out');
  await sleep(620);
}

async function requestNewGame(){
  if(G&&!G.over){
    const startOver=await modalChoice(
      'Start a new game?',
      '<p>Your current game will be lost.</p>',
      [
        {label:'Start new game',value:true,primary:true},
        {label:'Keep current game',value:false}
      ]
    );
    if(!startOver)return;
  }
  await pantryEntranceTransition();
  newGame();
  els.game.classList.add('game-transition-in');
  setTimeout(()=>els.game.classList.remove('game-transition-in'),700);
}

async function showUtilityInfo(title,message){
  await modalChoice(title,`<p class="utility-info-copy">${message}</p>`,[{label:'Got it',value:true,primary:true}],false,'',false);
}

if(els.fastBotsInfo)els.fastBotsInfo.onclick=()=>showUtilityInfo('Skip Bot Wait Time','Removes the normal 3–5 second pause before bot moves so the game plays faster. It does not change which moves the bots choose.');
if(els.hideSpiderInfo)els.hideSpiderInfo.onclick=()=>showUtilityInfo('Hide Pest Control Popups','Automatically chooses not to use Pest Control whenever an optional Pest Control popup would normally appear. You can still manually play Pest Control to pass when it is available.');

els.start.onclick=requestNewGame;
if(els.showHandsToggle)els.showHandsToggle.onchange=render;
if(els.selectWinner)els.selectWinner.onclick=showSelectWinner;
if(els.introStart)els.introStart.onclick=()=>{
  // Fade the whole title + Start/Rules group away together.
  els.titleIntro.classList.remove('home-fade-in');
  els.titleIntro.classList.add('home-fade-out');
  setTimeout(()=>{
    els.titleIntro.classList.add('hidden');
    els.titleIntro.classList.remove('home-fade-out');

    // Then fade the bot selection in.
    els.setupPanel.classList.remove('setup-panel-hidden','setup-panel-enter','home-poof-out','home-poof-in','home-fade-out');
    void els.setupPanel.offsetWidth;
    els.setupPanel.classList.add('home-fade-in');
  },460);
};
if(els.introRules)els.introRules.onclick=showRules;
els.home.onclick=showHomeScreen;
els.resume.onclick=showGameScreen;
els.clearLog.onclick=()=>els.log.innerHTML='';
els.modalClose.onclick=()=>{if(modalResolver){els.modal.classList.add('hidden');els.modalBody.className='';resetModalPresentation();modalResolver(null);modalResolver=null;}};
els.rules.onclick=showRules;

function sortOutCards(cards){
  return [...cards].sort((a,b)=>{
    if(a.n==='S'&&b.n!=='S')return 1;
    if(b.n==='S'&&a.n!=='S')return -1;
    if(a.n==='S'&&b.n==='S')return 0;
    if(a.c!==b.c)return a.c-b.c;
    if(a.n!==b.n)return a.n-b.n;
    return 0;
  });
}

function showOut(){
  resetModalPresentation();
  const cards=G?sortOutCards(G.out):[];
  els.modalBody.innerHTML=`
    <h2>Trash Cards (${cards.length})</h2>
    <p class="meta">Organized by color, then number. Raccoon (#2) may retrieve a numbered Pest from here. Pest Control cannot be retrieved.</p>
    <div id="outGroups" class="out-groups"></div>`;

  const groups=document.getElementById('outGroups');
  for(let color=0;color<4;color++){
    const colorCards=cards.filter(c=>c.n!=='S'&&c.c===color);
    if(!colorCards.length)continue;
    const section=document.createElement('section');
    section.className='out-group';
    section.innerHTML=`<h3>${COLOR_NAMES[color]}</h3><div class="out-card-grid"></div>`;
    const grid=section.querySelector('.out-card-grid');
    colorCards.forEach(c=>grid.appendChild(cardEl(c)));
    groups.appendChild(section);
  }

  const spiders=cards.filter(c=>c.n==='S');
  if(spiders.length){
    const section=document.createElement('section');
    section.className='out-group';
    section.innerHTML='<h3>Pest Control</h3><div class="out-card-grid"></div>';
    const grid=section.querySelector('.out-card-grid');
    spiders.forEach(c=>grid.appendChild(cardEl(c)));
    groups.appendChild(section);
  }

  if(!cards.length)groups.innerHTML='<p class="meta">Nothing is in Trash yet.</p>';
  els.modal.classList.remove('hidden');
  els.modalClose.style.display='block';
  modalResolver=()=>{};
}

function showDiscardHistory(){
  resetModalPresentation();
  if(!G)return;
  const history=G.discardHistory || [];
  els.modalBody.innerHTML=`
    <h2>Current Discard History</h2>
    <p class="meta">Most recent play at the top. Scroll down for older plays. This history resets when the pile moves to Trash.</p>
    <div id="historyList" class="history-list"></div>`;

  const list=document.getElementById('historyList');
  if(!history.length){
    list.innerHTML='<p class="meta">The pile is open. No cards have been played yet.</p>';
  }else{
    [...history].reverse().forEach(entry=>{
      const row=document.createElement('div');
      row.className='history-entry';
      const detail=entry.label?` · ${entry.label}`:'';
      row.innerHTML=`<div class="history-meta">Turn ${entry.turn} · ${entry.player}${detail}</div><div class="history-cards"></div>`;
      const cards=row.querySelector('.history-cards');
      entry.cards.forEach(card=>cards.appendChild(cardEl(card)));
      list.appendChild(row);
    });
  }

  els.modal.classList.remove('hidden');
  els.modalClose.style.display='block';
  modalResolver=()=>{};
}

function showRules(){
  resetModalPresentation();
  els.modalBody.innerHTML=`<div class="rules"><h2>Pests in the Pantry — Quick Rules</h2>
  <p><strong>Goal:</strong> be first to empty your hand and all 4 Pantry Pests.</p>
  <h3>Play</h3><p>You must play a numbered Pest if you can. Play a higher number, or the same number in a stronger color. Rat/0 may be played on any non-0; on another 0 it still needs a stronger color. If you cannot make a numbered play, draw 1 and end your turn. The drawn card cannot be played immediately. Pest Control is always optional.</p>
  <h3>Color Hierarchy</h3><div class="color-hierarchy"><span class="hierarchy-color green-chip">Green</span><b>&lt;</b><span class="hierarchy-color red-chip">Red</span><b>&lt;</b><span class="hierarchy-color blue-chip">Blue</span><b>&lt;</b><span class="hierarchy-color gold-chip">Gold</span></div><p class="meta">Green is weakest and Gold is strongest. When two cards have the same number, only a stronger color can be played on top.</p>
  <p><strong>Duplicates:</strong> play multiple copies of the same number together; only one power activates. <strong>Runs:</strong> play 3+ consecutive cards of one color; the highest card normally makes the run legal and ends on top. Choose one power from the run. A run beginning with Rat/0 inherits Rat's universal playability.</p>
  <h3>Powers</h3><table>${Object.keys(PESTS).map(k=>`<tr><th>${k} <span style="opacity:.65;font-weight:600">×${PESTS[k].copies}</span></th><td>${PESTS[k].name}</td><td>${PESTS[k].effect}</td></tr>`).join('')}</table>
  <h3>Pantry</h3><p>If a play empties your hand while Pantry cards remain, take one Pantry Pest <em>before</em> resolving the played power. When your hand empties, you may choose a face-up Pantry Pest or take any face-down Pantry Pest blindly.</p>
  <h3>Attacks</h3><p>5 adds +2 and 6 adds +1. Legal 5/6 responses stack the attack. Beetle/7 blocks the entire attack and may always be played while under attack. Runs may also defend: choose 5 or 6 to continue the attack, or 7 to block it. A defensive run containing Beetle/7 may be played regardless of the current top card.</p>
  <h3>Trash / Reset</h3><p>After every other player passes on a successful play, the pile goes to Trash and the last player to play gets an open restart. If all four players pass on the original starting card, everyone has drawn once; that starting card goes to Trash and a new starting card is dealt for the same starting player. Moth/3 clears immediately and lets its player play again. When the draw deck empties, Trash cards are shuffled into a new draw deck.</p>
  <h3>Pest Control</h3><p>Pest Control can opt you out of a power or be used simply to pass. It is burned into the current pile without becoming the top card, and it cannot be your final winning card. During Termite, a player who uses Pest Control is removed from that exchange, so cards route around them.</p></div>`;
  els.modal.classList.remove('hidden');
  els.modalClose.style.display='block';
  modalResolver=()=>{};
}


let opponentResizeTimer=null;window.addEventListener('resize',()=>{clearTimeout(opponentResizeTimer);opponentResizeTimer=setTimeout(()=>{if(G&&!document.body.classList.contains('home-mode'))render();},120);});
