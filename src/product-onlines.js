/* INTELLIGNCE product canvas. Reference timings are explicit and regression tested. */
(() => {
  const page = document.querySelector('.onlines-page');
  if (!page) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = page.querySelector('.ol-hero');
  const stage = hero.querySelector('.ol-hero-stage');
  const quote = page.querySelector('.ol-intro');
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
      if (mobile || item.el.matches('.ol-art-wire,.ol-art-code,.ol-art-chat,:hover,:focus-within')) return;
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
    if (quiet()) {unlock();cursorItems.forEach(({el}) => {el.style.removeProperty('--cursor-x');el.style.removeProperty('--cursor-y');el.classList.add('is-entered')});floatItems.forEach(({el}) => ['--float-x','--float-y','--float-r'].forEach(k => el.style.removeProperty(k)))}
    previous = 0;quotePending = true;start();schedule();
  }
  reduced.addEventListener('change', updateMotion);
  const motionButton = page.querySelector('[data-ol-motion]');
  motionButton?.addEventListener('click', () => {manualPause = !manualPause;motionButton.setAttribute('aria-pressed', String(manualPause));motionButton.textContent = manualPause ? 'Resume motion' : 'Pause motion';updateMotion()});
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
    el.addEventListener('pointerdown',e=>{if(e.button!==0||e.pointerType==='touch'||(e.target.closest('button,input,textarea')&&e.target.closest('button,input,textarea')!==el))return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,ox:x,oy:y};moved=false});
    el.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>5){moved=true;el.setPointerCapture(e.pointerId);x=clamp(drag.ox+dx,-innerWidth*.25,innerWidth*.25);y=clamp(drag.oy+dy,-innerHeight*.3,innerHeight*.3);el.style.setProperty('--drag-x',x+'px');el.style.setProperty('--drag-y',y+'px')}});
    ['pointerup','pointercancel'].forEach(name=>el.addEventListener(name,()=>drag=null));
    el.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();moved=false}},true);
  });

  // Local reference controls: no hosted embeds or third-party runtime dependencies.
  const player = page.querySelector('.ol-ipod');
  const projectItems = [...player.querySelectorAll('[data-ipod-item]')];
  let projectIndex = 0;
  function showProject(preview = true) {
    const item = projectItems[projectIndex];
    projectItems.forEach((entry, index) => entry.setAttribute('aria-pressed', String(index === projectIndex)));
    player.querySelector('.ol-ipod-menu').hidden = preview;
    player.querySelector('.ol-ipod-now').hidden = !preview;
    player.querySelector('.ol-ipod-now img').src = item.dataset.image;
    player.querySelector('[data-ipod-title]').textContent = item.dataset.title;
    player.querySelector('[data-ipod-open]').setAttribute('aria-label', 'Open ' + item.dataset.title);
  }
  projectItems.forEach((item, index) => item.addEventListener('click', () => {projectIndex = index;showProject()}));
  player.querySelectorAll('[data-ipod-step]').forEach(button => button.addEventListener('click', () => {projectIndex = (projectIndex + Number(button.dataset.ipodStep) + projectItems.length) % projectItems.length;showProject()}));
  player.querySelector('[data-ipod-menu]').addEventListener('click', () => showProject(false));
  player.querySelector('[data-ipod-select]').addEventListener('click', () => showProject());
  player.querySelector('[data-ipod-open]').addEventListener('click', () => window.open(projectItems[projectIndex].dataset.url, '_blank', 'noopener,noreferrer'));
  player.addEventListener('keydown', event => {if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;event.preventDefault();projectIndex = (projectIndex + (event.key === 'ArrowRight' ? 1 : -1) + projectItems.length) % projectItems.length;showProject()});
  page.querySelector('[data-code-copy]').addEventListener('click', async event => {
    const button = event.currentTarget;
    const snippet = [...page.querySelectorAll('.ol-code-line')].map(line => line.lastElementChild.textContent).join('\n');
    try {await navigator.clipboard.writeText(snippet);button.textContent = 'Copied';page.querySelector('.ol-copy-status').textContent = 'Code copied to clipboard';}
    catch {button.textContent = 'Try again';page.querySelector('.ol-copy-status').textContent = 'Clipboard unavailable. Select the code to copy it.';}
    setTimeout(() => button.textContent = 'Copy', 2200);
  });
  page.querySelectorAll('[data-preview-toggle]').forEach(button => button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
    button.setAttribute('aria-label', (open ? 'Hide ' : 'Show ') + button.closest('.ol-preview').querySelector('h3').textContent + ' project details');
  }));

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



/* Four-column vertical mobile gallery. Scoped to the product page. */
(() => {
  const gallery = document.querySelector('.mg-section');
  if (!gallery) return;
  const panels = [...gallery.querySelectorAll('[data-mg-panel]')];
  const tabs = [...gallery.querySelectorAll('[data-mg-tab]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active = panels[0];
  let resizeFrame = 0;

  function fitPhone(img) {
    const viewport = img.closest('.mg-viewport');
    if (!viewport || !img.naturalWidth || !img.naturalHeight) return;
    const scaledHeight = img.naturalHeight * viewport.clientWidth / img.naturalWidth;
    const distance = Math.max(0, scaledHeight - viewport.clientHeight);
    img.style.setProperty('--mg-scroll', distance.toFixed(1) + 'px');
    img.style.animation = distance > 8 && !reduced.matches
      ? 'mg-vertical ' + Math.max(24, Math.min(150, 12 + distance / 14)).toFixed(1) + 's ease-in-out infinite alternate'
      : 'none';
  }

  function configure(panel) {
    if (!panel || panel.hidden) return;
    panel.querySelectorAll('[data-mg-column]').forEach((column, columnIndex) => {
      const track = column.querySelector('[data-mg-track]');
      const original = column.querySelector('[data-mg-original]');
      if (!track || !original) return;
      track.querySelectorAll('[data-mg-clone]').forEach(node => node.remove());
      const clone = original.cloneNode(true);
      clone.removeAttribute('data-mg-original');
      clone.dataset.mgClone = '';
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('img').forEach(img => { img.alt = ''; });
      clone.querySelectorAll('.mg-phone').forEach(phone => phone.removeAttribute('aria-label'));
      track.append(clone);

      const distance = original.getBoundingClientRect().height;
      track.style.setProperty('--mg-distance', distance.toFixed(1) + 'px');
      // The reference exposes speed 34 but not its unit; use an adjustable px/s approximation.
      const duration = Math.max(24, distance / 34);
      track.style.setProperty('--mg-duration', duration.toFixed(1) + 's');
      // Offset each column so the clipped card reveals neighboring phones immediately.
      // Negative delay preserves a continuous cycle without waiting for a first traversal.
      track.style.animationDelay = '-' + (duration * [0.12, 0.61, 0.39, 0.83][columnIndex]).toFixed(2) + 's';
      track.style.animation = 'none';
      void track.offsetHeight;
      track.style.animation = '';

      track.querySelectorAll('img').forEach(img => {
        if (img.complete && img.naturalWidth) fitPhone(img);
        else img.addEventListener('load', () => fitPhone(img), { once: true });
      });
    });
  }

  function select(id, focus = false) {
    const next = panels.find(panel => panel.dataset.mgPanel === id);
    if (!next) return;
    tabs.forEach(tab => {
      const selected = tab.dataset.mgTab === id;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (focus && selected) tab.focus({ preventScroll: true });
    });
    panels.forEach(panel => { panel.hidden = panel !== next; });
    active = next;
    requestAnimationFrame(() => configure(next));
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.dataset.mgTab));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 :
        (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      select(tabs[nextIndex].dataset.mgTab, true);
    });
  });

  function recalculate() {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => configure(active));
  }
  addEventListener('resize', recalculate, { passive: true });
  reduced.addEventListener('change', recalculate);
  select(active.dataset.mgPanel);
})();
