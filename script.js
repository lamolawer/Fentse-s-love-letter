
  // EmailJS configuration - replace these with your real values
  const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // e.g. "user_xxx"
  const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // e.g. "service_xxx"
  const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // e.g. "template_xxx"

  (function(){
    if(window.emailjs && typeof emailjs.init === 'function'){
      try{ emailjs.init(EMAILJS_PUBLIC_KEY); }catch(e){ console.warn('emailjs.init failed', e); }
    } else {
      console.warn('EmailJS library not loaded');
    }
  })();

let letterLines = [
  "I may not always find the perfect words but,",
  "Every moment with you feels like a beautiful dream.",
  "You are my calm in the chaos, my sunshine on cloudy days.",
  "Loving you comes naturally, like breathing it's easy.",
  "You make me believe in forever.",
  "Your the women I cannot live without.",
  "..........",
  "...........",
];

let letterIndex = 0;

function revealLetter() {
  if (letterIndex < letterLines.length) {
    document.getElementById("letter").innerHTML += letterLines[letterIndex] + "<br>";
    letterIndex++;
  }
}

// Encourage reveal: show next line and reward the user with animation
let _pressCount = 0;
const _maxLevel = 5;

function encourageReveal(clicked){
  // clicked: optional button element that was pressed
  revealLetter();
  const btn = (clicked && clicked.nodeType === 1) ? clicked : document.getElementById('revealBtn');
  if(!btn) return;
  // increase press count up to max
  _pressCount = Math.min(_pressCount + 1, _maxLevel);
  // update classes
  for(let i=0;i<=_maxLevel;i++) btn.classList.remove('level-'+i);
  btn.classList.add('level-'+_pressCount);

  // friendly button text progression — final level shows varied encouragements
  const texts = ["Reveal My Feelings","Again!","Tell Me More","More, please","Don't stop"];
  const finalEncouragements = ["Full Heart","My Ride or Die","Your perfection","You're Amazing","My left Rip","My Forever","Keep Being You","My Favorite Person"];
  if(_pressCount < texts.length) {
    btn.innerText = texts[_pressCount];
  } else {
    btn.innerText = finalEncouragements[Math.floor(Math.random()*finalEncouragements.length)];
  }

  const parent = btn.closest('.parchment');
  if(parent){
    // spawn spark particles near the button
    particleBurst(parent, btn, 6 + _pressCount*2);
  }

  // when fully revealed, final state -> affect only the main reveal button
  if(letterIndex >= letterLines.length){
    const mainBtn = document.getElementById('revealBtn');
    if(mainBtn){
      mainBtn.innerText = "All Revealed 💌";
      mainBtn.disabled = true;
      mainBtn.classList.add('level-5');
    }

    // Start 30s auto-close timer
    closeReasonsCardAfterDelay();

    // animate a little flying card from the love letter to the Reasons card
    try{ animateCardTransition(); }catch(e){}
  }
}


function closeReasonsCardAfterDelay() {
  const card = document.getElementById("reasonsCard");
  if (!card) return;

  setTimeout(() => {
    // Smooth fade out
    card.style.opacity = "0";
    card.style.transform = "translateY(12px)";
    card.setAttribute("aria-hidden", "true");

    // Hide completely after animation finishes
    setTimeout(() => {
      card.style.visibility = "hidden";
    }, 600); // matches your CSS transition time
  }, 80000); // 80 seconds
}

// Animate a flying clone of the Love Letter card moving to the Reasons card
function animateCardTransition(){
  const from = document.getElementById('loveCard');
  const to = document.getElementById('reasonsCard');
  if(!from || !to) return;

  const rectFrom = from.getBoundingClientRect();
  // we'll position the Reasons card to overlay the Love Letter (on top)
  const container = document.querySelector('.container');
  const cRect = container ? container.getBoundingClientRect() : { left:0, top:0 };
  // compute a target rect that sits on top of the from-card (slightly lifted)
  const rectTo = {
    left: rectFrom.left,
    top: rectFrom.top - Math.max(12, Math.round(rectFrom.height * 0.06)),
    width: rectFrom.width,
    height: rectFrom.height
  };

  const clone = from.cloneNode(true);
  clone.id = 'flyClone';
  clone.style.position = 'fixed';
  clone.style.left = rectFrom.left + 'px';
  clone.style.top = rectFrom.top + 'px';
  clone.style.width = rectFrom.width + 'px';
  clone.style.height = rectFrom.height + 'px';
  clone.style.margin = '0';
  clone.style.zIndex = 9999;
  clone.style.transition = 'transform 900ms cubic-bezier(.2,.8,.2,1), opacity 900ms ease';
  document.body.appendChild(clone);

  const centerFromX = rectFrom.left + rectFrom.width / 2;
  const centerFromY = rectFrom.top + rectFrom.height / 2;
  const centerToX = rectTo.left + rectTo.width / 2;
  const centerToY = rectTo.top + rectTo.height / 2;

  const deltaX = centerToX - centerFromX;
  const deltaY = centerToY - centerFromY;

  // compute scale so the clone visually matches the target width
  const scale = Math.max(0.28, Math.min(1, rectTo.width / rectFrom.width));

  // trigger transform on next frame
  requestAnimationFrame(()=>{
    clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
    clone.style.opacity = '0';
  });

  // after the animation, remove clone and reveal the real card positioned on top
  setTimeout(()=>{
    try{ document.body.removeChild(clone); }catch(e){}
    // position the real Reasons card absolutely over the Love Letter (inside container)
    to.style.position = 'absolute';
    const left = rectFrom.left - cRect.left;
    const top = rectFrom.top - cRect.top - Math.max(12, Math.round(rectFrom.height * 0.06));
    to.style.left = left + 'px';
    to.style.top = top + 'px';
    to.style.width = rectFrom.width + 'px';
    to.style.margin = '0';
    to.style.visibility = 'visible';
    to.setAttribute('aria-hidden','false');
    // entrance animation
    requestAnimationFrame(()=>{
      to.style.opacity = '1';
      to.style.transform = 'translateY(0)';
      to.style.zIndex = 1001;
      to.classList.add('highlight');
      // blur the card underneath (loveCard)
      try{ from.classList.add('blurred'); }catch(e){}
    });
    setTimeout(()=> to.classList.remove('highlight'), 1200);
  }, 980);
}

function particleBurst(parent, btn, count){
  const rectP = parent.getBoundingClientRect();
  const rectB = btn.getBoundingClientRect();
  for(let i=0;i<count;i++){
    const s = document.createElement('span');
    s.className = 'spark';
    // randomize starting position around the button
    const offsetX = (Math.random()*btn.offsetWidth) - btn.offsetWidth/2;
    const startX = (rectB.left - rectP.left) + btn.offsetWidth/2 + offsetX;
    const startY = (rectB.top - rectP.top) + (Math.random()*btn.offsetHeight);
    s.style.left = Math.max(6, Math.min(parent.clientWidth - 6, startX)) + 'px';
    s.style.top = Math.max(6, Math.min(parent.clientHeight - 6, startY)) + 'px';
    // randomize color/size a bit
    const size = 6 + Math.floor(Math.random()*8);
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.background = Math.random()>.7 ? 'var(--gold)' : 'rgba(212,163,115,0.9)';
    parent.appendChild(s);
    // trigger float animation with slight variation
    const dur = 700 + Math.floor(Math.random()*400);
    s.style.animation = `floatUp ${dur}ms cubic-bezier(.2,.8,.2,1)`;
    // horizontal drift via transform
    const drift = (Math.random()*60) - 30;
    s.style.transform = `translateX(${drift}px)`;
    // remove after animation
    setTimeout(()=> { try{ parent.removeChild(s); }catch(e){} }, dur + 50);
  }
}

const reasons = [
  "Because you make my heart skip a beat every time I see you.",
  "Because you see all of me and still choose to love me.",
  "Because silence with you feels like the sweetest song.",
  "Because you make every day feel like it's worth living.",
  "Because you are my greatest adventure and safest home.",
  "Because your sexy and your my favourite temple to pray in.",
  "And because I Just Do. 💕",
  ".......",
];

let reasonIndex = 0;
function revealReason(clicked){
  const list = document.getElementById("reasonList");
  if(!list) return;
  if(reasonIndex < reasons.length){
    const line = document.createElement('p');
    line.className = 'reason-line';
    line.style.opacity = '0';
    line.style.transform = 'translateY(6px)';
    line.innerText = reasons[reasonIndex];
    list.appendChild(line);
    // force frame then animate in
    requestAnimationFrame(()=>{
      line.style.transition = 'opacity .45s ease, transform .45s cubic-bezier(.2,.8,.2,1)';
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    });
    reasonIndex++;

    // small particle flourish near the button
    const btn = clicked || document.querySelector('#reasonsCard .btn-wrap button');
    const parent = (btn && btn.closest('.parchment')) || document.getElementById('reasonsCard');
    try{ if(parent && btn) particleBurst(parent, btn, 4); }catch(e){}
  }

  // when fully revealed, disable and mark final state
  if(reasonIndex >= reasons.length){
    const btn = clicked || document.querySelector('#reasonsCard .btn-wrap button');
    if(btn){ btn.innerText = "All Reasons 💌"; btn.disabled = true; btn.classList.add('level-5'); }
  }
}

// Auto-reveal all remaining reasons one by one with a delay
function autoRevealReasons(interval = 700){
  const btn = document.querySelector('#reasonsCard .btn-wrap button');
  function step(){
    if(reasonIndex < reasons.length){
      revealReason(btn);
      setTimeout(step, interval);
    }
  }
  step();
}

// Red Envelope Interaction
const scene = document.getElementById("scene");
const envelope = document.getElementById("envelope");
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("video");
const proposalModal = document.getElementById("proposalModal");

let envelopeOpened = false;
let proposalShown = false;

scene.addEventListener("click", () => {
    if(envelopeOpened) return;

    // Step 1: Open flap
    envelope.classList.add("open");

    setTimeout(()=>{
        // Step 2: Show & play video on top of envelope
        videoContainer.classList.add("show");
        video.play();
    },1000);

    envelopeOpened = true;
});

// Close video function
function closeVideo(){
    videoContainer.classList.remove("show");
    video.pause();
    video.currentTime = 0;
    envelopeOpened = false;
}

// Video ended event listener - show proposal
video.addEventListener('ended', function() {
    if(!proposalShown) {
        proposalShown = true;
        setTimeout(() => {
            proposalModal.classList.add('show');
        }, 500);
    }
});

// Handle Yes button
function handleYes() {
    const yesBtn = document.querySelector('.btn-yes');
  if(!yesBtn) return;
  yesBtn.disabled = true;
  const status = document.getElementById('proposalStatus');
  yesBtn.innerText = 'Sending...';
  if(status) status.innerText = 'Sending confirmation email…';

  // Send email notification and show result to the proposer
  sendProposalEmail('yes').then((res) => {
    if(yesBtn){ yesBtn.innerText = 'She Said Yes! 💍'; }
    if(status){
      if(res && res.method === 'emailjs') status.innerText = 'Confirmation email sent ✓';
      else status.innerText = 'Opened mail client — please send the email';
    }
  }).catch(() => {
    if(yesBtn){ yesBtn.innerText = 'She Said Yes! 💍'; }
    if(status){ status.innerText = 'Failed to send email — check console.'; }
    
  });
}

// Handle No button - disable it when hovering
function handleNo() {
    const noBtn = document.getElementById('noBtn');
    noBtn.disabled = true;
    noBtn.style.pointerEvents = 'none';
}

// Add hover event to disable on hover
document.addEventListener('DOMContentLoaded', function() {
    const noBtn = document.getElementById('noBtn');
    if(noBtn) {
        noBtn.addEventListener('mouseenter', function() {
            this.disabled = true;
            this.style.pointerEvents = 'none';
        });
        
        noBtn.addEventListener('touchstart', function() {
            this.disabled = true;
            this.style.pointerEvents = 'none';
        });
    }
});

// Send email function
function sendProposalEmail(response) {
  const templateParams = {
    to_email: "ofentsemaupye@gmail.com",
    response: response === 'yes' ? 'She said YES! 💍' : 'She needs more time',
    message: response === 'yes' ? 'Your proposal was accepted! 🎉' : 'She is still considering...'
  };

  function openMailClient(){
    const subject = response === 'yes' ? 'Proposal accepted 💍' : 'Proposal response';
    const body = templateParams.message + '\n\n(Automated fallback - please send from your mail client)';
    const to = templateParams.to_email || '';
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    return Promise.resolve({ method: 'mailto' });
  }

  // If EmailJS is not configured, skip trying and open mail client
  if(!EMAILJS_SERVICE_ID || EMAILJS_SERVICE_ID.includes('YOUR_') || !EMAILJS_TEMPLATE_ID || EMAILJS_TEMPLATE_ID.includes('YOUR_') || !EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY.includes('YOUR_')){
    console.warn('EmailJS not configured — falling back to mail client');
    return openMailClient();
  }

  return new Promise((resolve, reject) => {
    try{
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(resp){
          console.log('Email sent successfully via EmailJS:', resp.status);
          resolve({ method: 'emailjs', resp });
        }).catch(function(err){
          console.error('EmailJS send failed, falling back to mail client', err);
          openMailClient().then(() => resolve({ method: 'mailto', error: err }));
        });
    }catch(e){
      console.error('Unexpected error sending email:', e);
      openMailClient().then(()=> resolve({ method: 'mailto', error: e }));
    }
  });
}

// Cartoon World Transformation Animation
let worldTransformed = false;
const worldScene = document.getElementById("worldScene");

if(worldScene) {
  worldScene.addEventListener("click", function(e) {
    if(worldTransformed) return; // Only trigger once
    worldTransformed = true;
    
    const sadSun = document.getElementById("sadSun");
    const happySun = document.getElementById("happySun");
    const sadClouds = document.getElementById("sadClouds");
    const happyClouds = document.getElementById("happyClouds");
    const sadTree = document.getElementById("sadTree");
    const happyTree = document.getElementById("happyTree");
    const sadFlowers = document.getElementById("sadFlowers");
    const happyFlowers = document.getElementById("happyFlowers");
    const fallingHearts = document.getElementById("fallingHearts");
    const transformText = document.getElementById("transformText");
    const sky = document.getElementById("sky");
    const ground = document.getElementById("ground");
    
    // Animate sky and ground color change
    sky.classList.add("sky-transform");
    ground.classList.add("ground-transform");
    sky.style.fill = "#87CEEB";
    ground.style.fill = "#90EE90";
    
    // Fade out sad elements
    if(sadSun) {
      sadSun.style.transition = "opacity 1s ease, transform 1s ease";
      sadSun.style.opacity = "0";
      sadSun.style.transform = "scale(0)";
    }
    if(sadClouds) {
      sadClouds.style.transition = "opacity 1s ease";
      sadClouds.style.opacity = "0";
    }
    if(sadTree) {
      sadTree.style.transition = "all 1s ease";
      sadTree.style.opacity = "0.3";
    }
    if(sadFlowers) {
      sadFlowers.style.transition = "opacity 1s ease";
      sadFlowers.style.opacity = "0";
    }
    
    // Fade in happy elements with delay
    setTimeout(() => {
      if(happySun) {
        happySun.style.transition = "opacity 1s ease, transform 1s ease";
        happySun.style.opacity = "1";
        happySun.style.transform = "scale(1)";
      }
      if(happyClouds) {
        happyClouds.style.transition = "opacity 1s ease";
        happyClouds.style.opacity = "1";
      }
      if(happyTree) {
        happyTree.style.transition = "all 1s ease";
        happyTree.style.opacity = "1";
      }
      if(happyFlowers) {
        happyFlowers.style.transition = "opacity 1s ease";
        happyFlowers.style.opacity = "1";
      }
      if(fallingHearts) {
        fallingHearts.style.transition = "opacity 0.5s ease";
        fallingHearts.style.opacity = "1";
        // Animate each heart falling
        const hearts = fallingHearts.querySelectorAll("text");
        hearts.forEach((heart, index) => {
          heart.style.animation = `heartFall ${2000 + index * 200}ms ease-in forwards`;
          heart.style.animationDelay = `${index * 150}ms`;
        });
      }
    }, 500);
    
    // Show transformation message
    setTimeout(() => {
      if(transformText) {
        transformText.style.opacity = "1";
      }
    }, 1500);
  });
}
