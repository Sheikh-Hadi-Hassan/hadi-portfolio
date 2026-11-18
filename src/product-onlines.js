/* INTELLIGNCE product canvas. Reference timings are explicit and regression tested. */
(() => {
  const page = document.querySelector('.onlines-page');
  if (!page) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = page.querySelector('.ol-hero');
  const stage = hero.querySelector('.ol-hero-stage');
  const quote = page.querySelector('.ol-intro');
  const codeNode = page.querySelector('[data-ol-typing]');
  const code = '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Product design</title>\n</head>\n<body>\n  <h1>Research. Design. Build.</h1>\n</body>\n</html>';
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const sine = t => -(Math.cos(Math.PI * t) - 1) / 2;
  let manualPause = false;
  const quiet = () => reduced.matches || manualPause;
  let lenis;
  if (window.Lenis && !reduced.matches) {
    lenis = new window.Lenis({autoRaf: true, smoothWheel: true, lerp: .2, anchors: true,
      prevent: node => !!node.closest('dialog,#intellignce-support,[data-lenis-prevent]')});
  }

  const wordGroups = [...quote.querySelectorAll('h2,p')].map((el, i) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) node.replaceWith(...node.textContent.split(/(\s+)/).map(part => {
      if (!part.trim()) return document.createTextNode(part);
      const span = document.createElement('span'); span.textContent = part; return span;
    }));
    return {words: [...el.querySelectorAll('span')], from: i ? .7333 : 0, to: i ? 1 : .7333};
  });
  function updateQuote() {
    const progress = clamp(-quote.getBoundingClientRect().top / Math.max(1, quote.offsetHeight - innerHeight));
    for (const group of wordGroups) {
      const count = quiet() ? group.words.length : Math.ceil(clamp((progress - group.from) / (group.to - group.from)) * group.words.length);
      group.words.forEach((word, index) => {word.className = index < count ? 'ol-revealed' : 'ol-unrevealed'});
    }
  }

  const paths = [
    [[0,0],[180,-280],[-150,-400],[250,-150],[-200,20],[80,40],[0,0]],
    [[0,0],[-220,-180],[-350,50],[-120,200],[100,280],[200,60],[0,0]],
    [[0,0],[200,150],[350,-80],[150,-250],[-100,-300],[-250,-100],[0,0]],
    [[0,0],[300,-120],[400,100],[200,280],[-50,200],[-150,50],[0,0]],
    [[0,0],[-180,-220],[80,-350],[280,-180],[320,60],[120,180],[0,0]],
    [[0,0],[-250,150],[-350,-60],[-180,-250],[60,-300],[200,-80],[0,0]],
    [[0,0],[150,-320],[-120,-280],[-300,-60],[-180,150],[60,200],[0,0]]
  ];
  const offsets = [[-1200,1200],[1200,900],[-600,-1050],[-1500,-300],[-1050,300],[900,-150],[600,1200]];
  const cursorDelays = [0,510,1020,255,765,1360,1700];
  const cursorItems = [...stage.querySelectorAll('[data-cursor]')].map((el, index) => ({el, index, waypoint: 0, phase: 'move', phaseStart: cursorDelays[index], from: offsets[index], to: paths[index][1]}));
  const floatItems = [...stage.querySelectorAll('.ol-hero-art,.ol-ai,.ol-comment,.ol-tool')].map((el, index) => ({
    el, index, depth: Number(el.dataset.depth || [.05,.06,.05,.07,.05][index % 5]), phase: index * 1.7 % (Math.PI * 2),
    speed: .0006 + (index % 4) * .00009, amp: 6 + index % 3, ampX: 1.5 + index % 2, rotAmp: .5 + index % 3 * .15
  }));
  let started = false, heroVisible = true, frame = 0, previous = 0, elapsed = 0, scrollY = window.scrollY;
  let quotePending = false;
  const contactArea = page.querySelector('.ol-contact-art'), contactCursor = page.querySelector('.ol-contact-cursor');
  const contactPoints = [[.41,.35,450],[.20,.16,760,true],[.57,.17,540],[.89,.20,720,true],[.82,.49,460],[.62,.62,700,true],[.23,.64,420],[.10,.79,760,true],[.33,.49,500],[.48,.08,620,true]];
  let contactVisible = false, contactClock = 0, contactIndex = 0, contactPhase = 'pause', contactStart = 380;
  function animateContact(delta) {
    contactClock += delta;const a = contactPoints[contactIndex], b = contactPoints[(contactIndex + 1) % contactPoints.length];
    const duration = contactPhase === 'pause' ? a[2] : b[3] ? 1380 : 1100, t = clamp((contactClock - contactStart) / duration), eased = sine(t);
    const x = contactPhase === 'pause' ? a[0] : a[0] + (b[0]-a[0])*eased, y = contactPhase === 'pause' ? a[1] : a[1] + (b[1]-a[1])*eased;
    contactCursor.style.left = x * contactArea.clientWidth + 'px';contactCursor.style.top = y * contactArea.clientHeight + 'px';
    contactCursor.classList.toggle('is-clicking', contactPhase === 'pause' && !!a[3] && contactClock-contactStart>=90 && contactClock-contactStart<310);
    if(t>=1){if(contactPhase==='move'){contactIndex=(contactIndex+1)%contactPoints.length;contactPhase='pause'}else contactPhase='move';contactStart=contactClock}
  }
  function schedule() {if (!frame && !document.hidden) frame = requestAnimationFrame(paint)}
  function paint(now) {
    frame = 0;
    if (quotePending) {updateQuote(); quotePending = false}
    const delta = previous ? Math.min(now - previous, 50) : 0; previous = now;
    if (contactVisible && !quiet()) {animateContact(delta);schedule()}
    if (!started || !heroVisible || quiet()) return;
    elapsed += delta;
    const mobile = innerWidth < 1024;
    floatItems.forEach(item => {
      const ramp = Math.min(elapsed / 800, 1);
      item.el.style.setProperty('--float-y', (Math.sin(elapsed * item.speed + item.phase) * item.amp * ramp + clamp(scrollY * item.depth * (mobile ? .5 : 1), -56, 56)).toFixed(2) + 'px');
      item.el.style.setProperty('--float-x', (Math.cos(elapsed * item.speed * .8 + item.phase) * item.ampX * ramp).toFixed(2) + 'px');
      item.el.style.setProperty('--float-r', (Math.sin(elapsed * item.speed * .6 + item.phase) * item.rotAmp * ramp).toFixed(2) + 'deg');
    });
    cursorItems.forEach(item => {
      if (elapsed < cursorDelays[item.index]) return;
      item.el.classList.add('is-entered');
      const duration = item.phase === 'move' ? 1500 + item.index * 130 + item.waypoint % 2 * 180 : 420 + (item.index + item.waypoint) % 3 * 140;
      const progress = clamp((elapsed - item.phaseStart) / duration);
      let point = item.phase === 'move' ? item.from.map((v, n) => v + (item.to[n] - v) * sine(progress)) : paths[item.index][item.waypoint];
      // The reference uses full-size paths on mobile too; clip only at the hero boundary.
      item.el.style.setProperty('--cursor-x', point[0].toFixed(1) + 'px');
      item.el.style.setProperty('--cursor-y', point[1].toFixed(1) + 'px');
      item.el.classList.toggle('is-clicking', item.phase === 'pause' && item.waypoint > 0 && item.waypoint % 2 === item.index % 2 && elapsed - item.phaseStart >= 90 && elapsed - item.phaseStart < 310);
      if (progress >= 1) {
        if (item.phase === 'move') {item.waypoint = (item.waypoint + 1) % paths[item.index].length; item.phase = 'pause'}
        else {item.from = paths[item.index][item.waypoint]; item.to = paths[item.index][(item.waypoint + 1) % paths[item.index].length]; item.phase = 'move'}
        item.phaseStart = elapsed;
      }
    });
    const typingTime = Math.max(0, elapsed - 1800), cycle = code.length * 45 + 3800, t = typingTime % cycle;
    const typed = t < code.length * 30 ? Math.floor(t / 30) : t < code.length * 30 + 3000 ? code.length : Math.max(0, code.length - Math.floor((t - code.length * 30 - 3000) / 15));
    codeNode.textContent = code.slice(0, typed);
    schedule();
  }

  const entrances = [...stage.querySelectorAll('.ol-hero-art,.ol-ai,.ol-comment,.ol-tool,.ol-cursor')];
  entrances.forEach(el => el.dataset.enter = '');
  function start() {
    if (started) return;
    started = true; previous = 0;
    setTimeout(() => stage.classList.add('is-ready'), quiet() ? 0 : 500);
    let toolIndex = 0;
    for (const el of entrances) {
      if (el.hasAttribute('data-cursor')) {if (quiet()) el.classList.add('is-entered'); continue}
      const delay = el.classList.contains('ol-tool') ? 300 + toolIndex++ * 120 : Number(el.dataset.entryDelay || 0);
      setTimeout(() => el.classList.add('is-entered'), quiet() ? 0 : delay);
    }
    if (quiet()) codeNode.textContent = code;
    schedule();
  }
  let unlockTimer, failsafe;
  function unlock() {
    document.documentElement.classList.remove('ol-intro-lock');
    removeEventListener('wheel', firstIntent); removeEventListener('touchmove', firstIntent); removeEventListener('keydown', firstKey);
    clearTimeout(failsafe); clearTimeout(unlockTimer); lenis?.start();
  }
  function firstIntent(event) {
    if (event?.cancelable) event.preventDefault();
    start();
    if (!unlockTimer) unlockTimer = setTimeout(unlock, 1500);
  }
  function firstKey(event) {if (['ArrowDown','PageDown',' ','End'].includes(event.key) && !event.target.closest('input,textarea,select,button,a')) firstIntent(event)}
  if (!quiet() && !location.hash && window.scrollY === 0) {
    document.documentElement.classList.add('ol-intro-lock');lenis?.stop();
    addEventListener('wheel', firstIntent, {passive:false});addEventListener('touchmove', firstIntent, {passive:false});addEventListener('keydown', firstKey);
    failsafe = setTimeout(() => firstIntent(), 8000);
    stage.querySelector('h1').addEventListener('pointerenter', () => firstIntent(), {once:true});
    addEventListener('pagehide', unlock, {once:true});
  } else start();

  page.classList.add('ol-enhanced');
  const revealTargets = [...page.querySelectorAll('.ol-service,.ol-product,.ol-orbit-note,.ol-products-copy,.ol-fan,.ol-fan-note,.ol-fan-note-two,.ol-fan-tool,.ol-fan-tool-two,.ol-contact-photo,.ol-contact-metric,.ol-contact-chat,.ol-contact-art>.ol-tool,.ol-aa,.ol-feature-title')];
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    setTimeout(()=>entry.target.classList.add('is-revealed'), !quiet() && entry.target.classList.contains('ol-fan') ? 150 : 0); reveal.unobserve(entry.target);
  }), {threshold:.35});
  revealTargets.forEach((el, i) => {el.dataset.reveal = ''; el.style.setProperty('--reveal-delay', Number(el.dataset.entryDelay || i % 3 * 50) + 'ms'); reveal.observe(el)});
  new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;previous = 0;
    if (heroVisible) schedule();
    else if (frame) {cancelAnimationFrame(frame);frame = 0}
  }, {threshold:0}).observe(hero);
  new IntersectionObserver(es=>{contactVisible=es[0].isIntersecting;previous=0;if(contactVisible)schedule()}, {threshold:0}).observe(contactArea);
  const feature = page.querySelector('.ol-feature');
  new IntersectionObserver(entries => entries.forEach(e => {feature.classList.toggle('is-inview',e.isIntersecting);page.classList.toggle('ol-scene-dark',e.isIntersecting)}), {threshold:0}).observe(feature.querySelector('h3'));
  const marquee = page.querySelector('.ol-product-marquee');
  let marqueeSwiper;
  const marqueeHolds = new Set(['offscreen']);
  function syncMarquee() {
    if (!marqueeSwiper) return;
    if (quiet() || marqueeHolds.size) {
      const position = marqueeSwiper.getTranslate();
      marqueeSwiper.autoplay.stop();marqueeSwiper.setTransition(0);marqueeSwiper.setTranslate(position);marqueeSwiper.animating=false;
    } else if (!marqueeSwiper.autoplay.running) {
      marqueeSwiper.animating=false;marqueeSwiper.autoplay.start();marqueeSwiper.slideNext(5000,true);
    }
  }
  function holdMarquee(reason, hold) {if(hold)marqueeHolds.add(reason);else marqueeHolds.delete(reason);syncMarquee()}
  if (window.Swiper && !reduced.matches) document.fonts.ready.then(() => {
    marqueeSwiper = new window.Swiper(marquee, {loop:true,autoplay:{delay:0,disableOnInteraction:false},speed:5000,slidesPerView:'auto',spaceBetween:77,allowTouchMove:false,simulateTouch:false,freeMode:true});
    syncMarquee();
  });
  new IntersectionObserver(entries => holdMarquee('offscreen',!entries[0].isIntersecting),{threshold:0}).observe(marquee);
  marquee.addEventListener('mouseenter',()=>holdMarquee('hover',true));marquee.addEventListener('mouseleave',()=>holdMarquee('hover',false));
  marquee.addEventListener('focusin',()=>holdMarquee('focus',true));marquee.addEventListener('focusout',e=>{if(!marquee.contains(e.relatedTarget))holdMarquee('focus',false)});
  document.addEventListener('visibilitychange',()=>holdMarquee('hidden',document.hidden));
  addEventListener('scroll', () => {scrollY = window.scrollY;quotePending = true;if (scrollY > 0 && !started) start();schedule()}, {passive:true});
  addEventListener('resize', () => {quotePending = true;schedule()}, {passive:true});
  document.addEventListener('visibilitychange', () => {previous = 0;if (document.hidden) {cancelAnimationFrame(frame);frame = 0;unlock()} else schedule()});
  function updateMotion() {
    page.classList.toggle('ol-motion-paused', quiet());syncMarquee();
    if (quiet()) {unlock();cursorItems.forEach(({el}) => {el.style.removeProperty('--cursor-x');el.style.removeProperty('--cursor-y');el.classList.add('is-entered')});floatItems.forEach(({el}) => ['--float-x','--float-y','--float-r'].forEach(k => el.style.removeProperty(k)));codeNode.textContent = code}
    previous = 0;quotePending = true;start();schedule();
  }
  reduced.addEventListener('change', updateMotion);
  const motionButton = page.querySelector('[data-ol-motion]');
  motionButton.addEventListener('click', () => {manualPause = !manualPause;motionButton.setAttribute('aria-pressed', String(manualPause));motionButton.textContent = manualPause ? 'Resume motion' : 'Pause motion';updateMotion()});
  page.querySelector('[data-ol-ai]').addEventListener('click', event => {
    const button = event.currentTarget, on = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(on));page.classList.toggle('ol-ai-on', on);firstIntent();
  });
  page.querySelectorAll('.ol-service h3').forEach(el => {el.innerHTML = el.innerHTML.split(/<br\s*\/?\s*>/i).map(line => '<span>' + line + '</span>').join('')});

  // Recycled hover cells, matching the reference's 60 × 62.25 grid without hundreds of nodes.
  page.querySelectorAll('.ol-grid').forEach(grid => {
    const pool = Array.from({length:12}, () => {const cell=document.createElement('i');cell.className='ol-grid-light';cell.setAttribute('aria-hidden','true');grid.append(cell);return cell});let current=0,last='';
    grid.addEventListener('pointermove', e => {
      if (quiet()) return;const r=grid.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/60)*60,y=Math.floor((e.clientY-r.top)/62.25)*62.25,key=x+':'+y;
      if(key===last)return;last=key;const cell=pool[current++%pool.length];cell.style.left=x+'px';cell.style.top=y+'px';cell.classList.add('is-lit');setTimeout(()=>cell.classList.remove('is-lit'),260);
    }, {passive:true});
  });

  page.querySelectorAll('.ol-dots').forEach(area=>area.addEventListener('pointermove',e=>{if(quiet())return;const r=area.getBoundingClientRect();area.style.setProperty('--dot-x',e.clientX-r.left+'px');area.style.setProperty('--dot-y',e.clientY-r.top+'px')},{passive:true}));
  const lineReveal=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('ol-lines-visible');lineReveal.unobserve(e.target)}}),{threshold:.5});
  page.querySelectorAll('.ol-work h2,.ol-contact h2').forEach(e=>lineReveal.observe(e));

  // Pointer capture updates only the dragged object's translation; touch retains native scrolling.
  page.querySelectorAll('[data-ol-drag]').forEach(el => {
    let drag, moved=false, x=0, y=0;
    el.addEventListener('dragstart',e=>e.preventDefault());
    el.addEventListener('pointerdown',e=>{if(e.button!==0||e.pointerType==='touch')return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,ox:x,oy:y};moved=false});
    el.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>5){moved=true;el.setPointerCapture(e.pointerId);x=clamp(drag.ox+dx,-innerWidth*.25,innerWidth*.25);y=clamp(drag.oy+dy,-innerHeight*.3,innerHeight*.3);el.style.setProperty('--drag-x',x+'px');el.style.setProperty('--drag-y',y+'px')}});
    ['pointerup','pointercancel'].forEach(name=>el.addEventListener(name,()=>drag=null));
    el.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();moved=false}},true);
  });

  // Static image-derived halftone: one render per image/size, no per-frame pixel processing.
  page.querySelectorAll('[data-halftone]').forEach((canvas,index)=>{
    const source=new Image(),sample=document.createElement('canvas'),sc=sample.getContext('2d',{willReadFrequently:true}),ctx=canvas.getContext('2d');let loaded=false,pending=0;
    if(!ctx||!sc)return;
    function draw(){pending=0;if(!loaded)return;const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;const ratio=Math.min(devicePixelRatio,1.5),w=Math.round(r.width),h=Math.round(r.height);canvas.width=w*ratio;canvas.height=h*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);ctx.fillStyle=['#522174','#442359','#32154d'][index];ctx.fillRect(0,0,w,h);const cell=3,cols=Math.ceil(w/cell),rows=Math.ceil(h/cell);sample.width=cols;sample.height=rows;sc.drawImage(source,0,0,cols,rows);const pixels=sc.getImageData(0,0,cols,rows).data;for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const p=(y*cols+x)*4,luma=(pixels[p]*.2126+pixels[p+1]*.7152+pixels[p+2]*.0722)/255;ctx.fillStyle=`rgba(217,189,237,${.12+luma*.5})`;ctx.beginPath();ctx.arc((x+.5)*cell,(y+.5)*cell,cell*(.08+(1-luma)*.48),0,Math.PI*2);ctx.fill()}canvas.dataset.halftoneReady='true'}
    source.onload=()=>{loaded=true;draw()};source.src=canvas.dataset.halftone;
    new ResizeObserver(()=>{if(!pending)pending=requestAnimationFrame(draw)}).observe(canvas);
  });

  const gallery=page.querySelector('#ol-gallery');let previousOverflow='',returnFocus;
  function openGallery(event){event?.preventDefault();if(gallery.open)return;unlock();returnFocus=document.activeElement;previousOverflow=document.body.style.overflow;gallery.showModal();document.body.style.overflow='hidden';lenis?.stop()}
  page.querySelectorAll('[data-ol-gallery]').forEach(el=>el.addEventListener('click',openGallery));
  page.querySelector('[data-ol-gallery-close]').addEventListener('click',()=>gallery.close());
  gallery.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;lenis?.start();returnFocus?.focus({preventScroll:true})});
  gallery.addEventListener('click',e=>{if(e.target===gallery){const r=gallery.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)gallery.close()}});
  page.querySelector('[data-ol-sera]').addEventListener('click',()=>document.querySelector('[data-sera-launch]')?.click());
  page.querySelector('[data-consultation-entry="meeting"]').addEventListener('click',()=>{unlock();window.dispatchEvent(new CustomEvent('intellignce:open-consultation',{detail:{booking:true}}))});
  quotePending=true;schedule();
})();
