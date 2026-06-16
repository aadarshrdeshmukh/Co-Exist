import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Icon from '../components/Icon';
import '../styles/landing.css';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  useEffect(() => {
    /* ── Design tokens ── */
    const C = {
      sage:'#A8D5BA', sageDark:'#4D9E72',
      sky:'#BFD7EA', skyDark:'#3d7fad',
      lav:'#D8C7FF', lavDark:'#7655c4',
      sand:'#F4D6B8', teal:'#AED9E0',
      peach:'#FFD6C0', ivory:'#FAF7F2',
      charcoal:'#1C1C1C', ink:'#111111',
    };
    function ha(hex,a){
      const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${a})`;
    }

    /* ── Aurora Canvas ── */
    function makeAurora(canvasId, opts={}) {
      const el = document.getElementById(canvasId);
      if (!el) return;
      const ctx = el.getContext('2d');
      const { dark=false, count=5, ptCount=55, speed=0.12, alpha=0.22 } = opts;
      let W, H, blobs, pts, raf;
      const palette = [C.sage, C.sky, C.lav, C.sand];

      function resize(){ W=el.width=el.offsetWidth; H=el.height=el.offsetHeight; }
      function mkBlob(){
        const col=palette[Math.floor(Math.random()*palette.length)];
        return{x:Math.random()*W,y:Math.random()*H,r:Math.random()*260+100,
          vx:(Math.random()-0.5)*speed,vy:(Math.random()-0.5)*speed,col,a:Math.random()*alpha+0.04};
      }
      function mkPt(){
        const col=palette[Math.floor(Math.random()*palette.length)];
        return{x:Math.random()*W,y:Math.random()*H,r:Math.random()*(dark?1.8:2.4)+0.5,
          a:Math.random()*0.28+0.05,vx:(Math.random()-0.5)*0.16,vy:(Math.random()-0.5)*0.16,
          ph:Math.random()*Math.PI*2,ps:Math.random()*0.009+0.003,col};
      }
      function init(){ blobs=Array.from({length:count},mkBlob); pts=Array.from({length:ptCount},mkPt); }
      function frame(){
        if(!el.isConnected){cancelAnimationFrame(raf);return;}
        ctx.clearRect(0,0,W,H);
        blobs.forEach(b=>{
          const grd=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
          grd.addColorStop(0,ha(b.col,b.a));grd.addColorStop(1,ha(b.col,0));
          ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();
          b.x+=b.vx;b.y+=b.vy;
          if(b.x<-b.r)b.x=W+b.r;if(b.x>W+b.r)b.x=-b.r;
          if(b.y<-b.r)b.y=H+b.r;if(b.y>H+b.r)b.y=-b.r;
        });
        for(let i=0;i<pts.length;i++){
          for(let j=i+1;j<pts.length;j++){
            const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
            if(d<88){
              ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);
              ctx.strokeStyle=dark?`rgba(250,247,242,${(1-d/88)*0.045})`:`rgba(28,28,28,${(1-d/88)*0.04})`;
              ctx.lineWidth=0.7;ctx.stroke();
            }
          }
        }
        pts.forEach(p=>{
          p.ph+=p.ps;
          const a=Math.max(0,Math.min(1,p.a+Math.sin(p.ph)*0.06));
          ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=ha(p.col,a);ctx.fill();
          p.x+=p.vx;p.y+=p.vy;
          if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
        });
        raf=requestAnimationFrame(frame);
      }
      const handleResize=()=>{resize();init();};
      window.addEventListener('resize',handleResize);
      resize();init();frame();
      return()=>{window.removeEventListener('resize',handleResize);cancelAnimationFrame(raf);};
    }

    const cleanups = [];
    cleanups.push(makeAurora('hero-canvas',{count:6,ptCount:65,speed:0.1,alpha:0.24}));
    cleanups.push(makeAurora('splash-c',{count:4,ptCount:28,speed:0.2,alpha:0.38,dark:true}));
    cleanups.push(makeAurora('dl-canvas',{count:5,ptCount:55,speed:0.09,alpha:0.18,dark:true}));

    /* ── Radar ── */
    const DOTS=[
      {label:'📚 Silent Study',sub:'1.2 km · 🔋 Quiet · 2 hrs',col:C.sage,ang:0.42,d:0.28},
      {label:'☕ Coffee Companion',sub:'0.8 km · ⚡ Balanced · 1 hr',col:C.sand,ang:1.18,d:0.38},
      {label:'🏃 Walking Buddy',sub:'1.9 km · 🔆 Social · 45 min',col:C.lav,ang:2.08,d:0.31},
      {label:'✈ Airport Wait',sub:'0.3 km · 🔋 Quiet · open',col:C.sky,ang:2.98,d:0.24},
      {label:'💻 Work Session',sub:'1.4 km · ⚡ Balanced · 3 hrs',col:C.teal,ang:4.18,d:0.35},
      {label:'📚 Exam Prep',sub:'0.6 km · 🔋 Quiet · 4 hrs',col:C.sage,ang:5.05,d:0.43},
      {label:'🍽 Meal Companion',sub:'0.9 km · 🔆 Social · 1 hr',col:C.peach,ang:5.78,d:0.21},
    ];
    let radarRaf;
    (function radar(){
      const canvas=document.getElementById('radar-canvas');
      if(!canvas)return;
      const ctx=canvas.getContext('2d');
      const tipEl=document.getElementById('radar-tip');
      let W,H,CX,CY,R,tick=0,mx=-999,my=-999;
      function resize(){const rect=canvas.getBoundingClientRect();W=canvas.width=rect.width;H=canvas.height=rect.height;CX=W/2;CY=H/2;R=Math.min(W,H)*0.42;}
      function dotPos(d){return{x:CX+Math.cos(d.ang)*d.d*R,y:CY+Math.sin(d.ang)*d.d*R};}
      function drawFrame(){
        if(!canvas.isConnected)return;
        ctx.clearRect(0,0,W,H);tick++;
        const bloom=ctx.createRadialGradient(CX,CY,0,CX,CY,R*1.1);
        bloom.addColorStop(0,ha(C.sage,0.05));bloom.addColorStop(0.5,ha(C.sky,0.03));bloom.addColorStop(1,ha(C.lav,0.02));
        ctx.beginPath();ctx.arc(CX,CY,R*1.1,0,Math.PI*2);ctx.fillStyle=bloom;ctx.fill();
        for(let i=1;i<=4;i++){const r=(i/4)*R;ctx.beginPath();ctx.arc(CX,CY,r,0,Math.PI*2);ctx.strokeStyle=`rgba(250,247,242,${i===4?0.1:0.055})`;ctx.lineWidth=i===4?1.2:0.8;ctx.stroke();ctx.fillStyle='rgba(250,247,242,0.2)';ctx.font='500 9.5px Inter, sans-serif';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(`${(i*0.5).toFixed(1)} km`,CX+r+5,CY-5);}
        ctx.save();ctx.setLineDash([2,9]);ctx.strokeStyle='rgba(250,247,242,0.045)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(CX-R-6,CY);ctx.lineTo(CX+R+6,CY);ctx.moveTo(CX,CY-R-6);ctx.lineTo(CX,CY+R+6);ctx.stroke();ctx.setLineDash([]);ctx.restore();
        const sa=(tick*0.0095)%(Math.PI*2);ctx.save();ctx.translate(CX,CY);ctx.rotate(sa);const sw=ctx.createLinearGradient(0,0,R,0);sw.addColorStop(0,ha(C.sage,0.0));sw.addColorStop(0.5,ha(C.sage,0.06));sw.addColorStop(0.8,ha(C.sky,0.1));sw.addColorStop(1,ha(C.lav,0.15));ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,-0.4,0);ctx.closePath();ctx.fillStyle=sw;ctx.fill();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(R,0);ctx.strokeStyle=ha(C.sage,0.25);ctx.lineWidth=1;ctx.stroke();ctx.restore();
        const yp=0.72+Math.sin(tick*0.04)*0.22;[22,16,10].forEach((r,i)=>{ctx.beginPath();ctx.arc(CX,CY,r+Math.sin(tick*0.04+i)*2,0,Math.PI*2);ctx.strokeStyle=`rgba(250,247,242,${yp*(0.1-i*0.03)})`;ctx.lineWidth=1.5;ctx.stroke();});
        ctx.beginPath();ctx.arc(CX,CY,10,0,Math.PI*2);ctx.fillStyle=C.ivory;ctx.fill();ctx.fillStyle=C.charcoal;ctx.font='700 7.5px Manrope, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('YOU',CX,CY);
        let hov=null;
        DOTS.forEach((d,i)=>{const{x,y}=dotPos(d);const ph=tick*0.017+i*0.9;const sc=1+Math.sin(ph)*0.2;const br=9;const dx=mx-x,dy=my-y;const dist=Math.sqrt(dx*dx+dy*dy);const isH=dist<22;if(isH)hov={d,x,y};if(isH){ctx.save();ctx.setLineDash([4,7]);ctx.beginPath();ctx.moveTo(CX,CY);ctx.lineTo(x,y);ctx.strokeStyle=ha(d.col,0.35);ctx.lineWidth=1;ctx.stroke();ctx.setLineDash([]);ctx.restore();}const grd=ctx.createRadialGradient(x,y,0,x,y,br*sc*3.8);grd.addColorStop(0,ha(d.col,isH?0.38:0.24));grd.addColorStop(1,ha(d.col,0));ctx.beginPath();ctx.arc(x,y,br*sc*3.8,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();ctx.beginPath();ctx.arc(x,y,br*(isH?1.5:sc),0,Math.PI*2);ctx.fillStyle=d.col;ctx.fill();ctx.strokeStyle='rgba(250,247,242,0.75)';ctx.lineWidth=isH?2:1.5;ctx.stroke();ctx.beginPath();ctx.arc(x-2,y-2,2.5,0,Math.PI*2);ctx.fillStyle='rgba(250,247,242,0.6)';ctx.fill();});
        if(tipEl){if(hov){tipEl.innerHTML=`<strong style="display:block;font-size:0.85rem;margin-bottom:5px;font-family:Manrope,sans-serif">${hov.d.label}</strong><span style="font-size:0.74rem;opacity:0.6;line-height:1.55">${hov.d.sub}</span>`;tipEl.style.left=(hov.x+16)+'px';tipEl.style.top=(hov.y-12)+'px';tipEl.classList.add('on');canvas.style.cursor='pointer';}else{tipEl.classList.remove('on');canvas.style.cursor='crosshair';}}
        radarRaf=requestAnimationFrame(drawFrame);
      }
      canvas.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();mx=(e.clientX-r.left)*(canvas.width/r.width);my=(e.clientY-r.top)*(canvas.height/r.height);});
      canvas.addEventListener('mouseleave',()=>{mx=-999;my=-999;});
      window.addEventListener('resize',resize);
      resize();drawFrame();
    })();

    /* ── Battery Sliders ── */
    function makeBattery({track,fill,thumb,label,labels}){
      if(!track||!fill||!thumb)return;
      const STOPS=[0,0.5,1];
      function snap(pct){let best=0,bd=1;STOPS.forEach(s=>{const d=Math.abs(pct-s);if(d<bd){bd=d;best=s;}});return best;}
      function set(pct){const s=snap(pct);fill.style.width=(s*100)+'%';thumb.style.left=(s*100)+'%';if(label&&labels)label.textContent=labels[s<0.25?0:s<0.75?1:2];}
      let dragging=false;
      fill.style.transition='width 0.2s ease';thumb.style.transition='left 0.2s ease';
      track.addEventListener('mousedown',e=>{dragging=true;set((e.clientX-track.getBoundingClientRect().left)/track.getBoundingClientRect().width);});
      track.addEventListener('touchstart',e=>{dragging=true;set((e.touches[0].clientX-track.getBoundingClientRect().left)/track.getBoundingClientRect().width);},{passive:true});
      document.addEventListener('mousemove',e=>{if(dragging)set((e.clientX-track.getBoundingClientRect().left)/track.getBoundingClientRect().width);});
      document.addEventListener('touchmove',e=>{if(dragging)set((e.touches[0].clientX-track.getBoundingClientRect().left)/track.getBoundingClientRect().width);},{passive:true});
      document.addEventListener('mouseup',()=>dragging=false);
      document.addEventListener('touchend',()=>dragging=false);
      setTimeout(()=>{const r=track.getBoundingClientRect();if(r.width>0)set(0.5);},120);
    }
    const LABS=['🔋 Quiet','⚡ Balanced','🔆 Social'];
    makeBattery({track:document.getElementById('bat-track-1'),fill:document.getElementById('bat-fill-1'),thumb:document.getElementById('bat-thumb-1')});
    makeBattery({track:document.getElementById('bat-track-pp'),fill:document.getElementById('bat-fill-pp'),thumb:document.getElementById('bat-thumb-pp')});
    makeBattery({track:document.getElementById('bat-track-pm'),fill:document.getElementById('bat-fill-pm'),thumb:document.getElementById('bat-thumb-pm'),label:document.getElementById('pm-bat-val'),labels:LABS});

    /* ── Chip toggles ── */
    document.querySelectorAll('.pm-chip-row .pm-chip').forEach(c=>{c.addEventListener('click',()=>{c.closest('.pm-chip-row').querySelectorAll('.pm-chip').forEach(x=>x.classList.remove('on'));c.classList.add('on');});});
    document.querySelectorAll('.pp-act').forEach(c=>c.addEventListener('click',()=>c.classList.toggle('active')));

    /* ── Timer ── */
    const timerEl=document.getElementById('sess-timer');
    let timerInterval;
    if(timerEl){let total=3600+42*60+21;timerInterval=setInterval(()=>{if(total<=0)return;total--;timerEl.textContent=[Math.floor(total/3600),Math.floor((total%3600)/60),total%60].map(n=>String(n).padStart(2,'0')).join(':');},1000);}
    const spFill=document.getElementById('sp-fill');
    if(spFill)setTimeout(()=>{spFill.style.width='35%';},800);

    /* ── Intersection Observer ── */
    const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('in');e.target.querySelectorAll('.wc-bar').forEach((bar,i)=>{setTimeout(()=>bar.classList.add('on'),i*90+80);});io.unobserve(e.target);});},{threshold:0.12});
    document.querySelectorAll('.sc,.testi-card,.wc-card').forEach((el)=>{el.classList.add('fade-up');const siblings=el.parentElement.querySelectorAll('.fade-up');const idx=Array.from(siblings).indexOf(el);if(idx>0&&idx<6)el.classList.add(`fd${idx+1}`);io.observe(el);});

    /* ── Nav ── */
    const navEl=document.getElementById('nav');
    let lastY=0;
    const heroH=document.getElementById('hero')?.offsetHeight||window.innerHeight;
    const onScroll=()=>{
      if(!navEl)return;
      const y=window.scrollY;
      navEl.classList.toggle('scrolled',y>16);
      /* Auto-hide after hero; re-show on scroll-up */
      if(y>heroH){
        navEl.classList.toggle('nav-hidden',y>lastY);
      }else{
        navEl.classList.remove('nav-hidden');
      }
      lastY=y;
    };
    window.addEventListener('scroll',onScroll,{passive:true});

    /* ── Lenis Smooth Scroll ── */
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const lenisRaf = (time) => { lenis.raf(time * 1000); };
    gsap.ticker.add(lenisRaf);
    gsap.ticker.lagSmoothing(0);

    /* ── Anchor links → Lenis smooth scroll ── */
    const anchorHandler = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: 0, duration: 1.2 }); }
    };
    document.addEventListener('click', anchorHandler);

    /* ── GSAP ScrollTrigger — Section Pinning (desktop only) ── */
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;

    if (isDesktop) {
      /* Hero parallax fade-out */
      gsap.to('.hero-body', {
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
        y: -120, opacity: 0,
      });
      gsap.to('.scroll-hint', {
        scrollTrigger: { trigger: '#hero', start: 'top top', end: '20% top', scrub: true },
        opacity: 0,
      });

      /* ── Manifesto Pin ── */
      gsap.set('.mani-text', { opacity: 0, x: -60 });
      gsap.set('.mani-quotes .quote-card', { opacity: 0, y: 50, scale: 0.96 });
      gsap.set('.mani-badges .mani-badge', { opacity: 0, y: 20 });
      const manifestoTl = gsap.timeline({
        scrollTrigger: { trigger: '#manifesto', pin: true, start: 'top top', end: '+=100%', scrub: 0.8 },
      });
      manifestoTl
        .to('.mani-text', { opacity: 1, x: 0, duration: 0.5 })
        .to('.mani-badges .mani-badge', { opacity: 1, y: 0, stagger: 0.08, duration: 0.25 }, '-=0.15')
        .to('.mani-quotes .quote-card', { opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 0.3 }, '-=0.05');

      /* ── How it Works Pin ── */
      gsap.set('#how .sec-head', { opacity: 0, y: 40 });
      gsap.set('.step-card', { opacity: 0, y: 60 });
      const arrows = gsap.utils.toArray('.steps-row .step-arrow');
      gsap.set(arrows, { opacity: 0, scale: 0 });
      const howTl = gsap.timeline({
        scrollTrigger: { trigger: '#how', pin: true, start: 'top top', end: '+=100%', scrub: 0.8 },
      });
      howTl
        .to('#how .sec-head', { opacity: 1, y: 0, duration: 0.15 })
        .to('#sc1', { opacity: 1, y: 0, duration: 0.18 })
        .to(arrows[0] || {}, { opacity: 1, scale: 1, duration: 0.06 })
        .to('#sc2', { opacity: 1, y: 0, duration: 0.18 })
        .to(arrows[1] || {}, { opacity: 1, scale: 1, duration: 0.06 })
        .to('#sc3', { opacity: 1, y: 0, duration: 0.18 });

      /* ── Presence Radar Pin ── */
      gsap.set('#radar .sec-head', { opacity: 0, y: 40 });
      gsap.set('.radar-wrap', { opacity: 0, scale: 0.85 });
      const radarTl2 = gsap.timeline({
        scrollTrigger: { trigger: '#radar', pin: true, start: 'top top', end: '+=100%', scrub: 0.8 },
      });
      radarTl2
        .to('#radar .sec-head', { opacity: 1, y: 0, duration: 0.3 })
        .to('.radar-wrap', { opacity: 1, scale: 1, duration: 0.5 }, '-=0.1');

      /* ── App Screens Pin ── */
      gsap.set('#app .sec-head', { opacity: 0, y: 40 });
      const appCells = gsap.utils.toArray('.app-cell');
      gsap.set(appCells, { opacity: 0, y: 50, scale: 0.92 });
      const appTl = gsap.timeline({
        scrollTrigger: { trigger: '#app', pin: true, start: 'top top', end: '+=150%', scrub: 0.8 },
      });
      appTl.to('#app .sec-head', { opacity: 1, y: 0, duration: 0.12 });
      appCells.forEach((cell, i) => {
        appTl.to(cell, { opacity: 1, y: 0, scale: 1, duration: 0.12 }, 0.12 + i * 0.08);
      });

      /* ── Battery Feature Pin ── */
      gsap.set('.bat-copy', { opacity: 0, x: -60 });
      gsap.set('.bat-phone-wrap', { opacity: 0, x: 60 });
      gsap.set('.bat-mode-card', { opacity: 0, y: 30 });
      const batTl = gsap.timeline({
        scrollTrigger: { trigger: '#battery', pin: true, start: 'top top', end: '+=100%', scrub: 0.8 },
      });
      batTl
        .to('.bat-copy', { opacity: 1, x: 0, duration: 0.4 })
        .to('.bat-mode-card', { opacity: 1, y: 0, stagger: 0.08, duration: 0.2 }, '-=0.15')
        .to('.bat-phone-wrap', { opacity: 1, x: 0, duration: 0.4 }, '-=0.2');
    }

    return () => {
      cleanups.forEach(fn => fn && fn());
      if (radarRaf) cancelAnimationFrame(radarRaf);
      if (timerInterval) clearInterval(timerInterval);
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', anchorHandler);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.ticker.remove(lenisRaf);
    };
  }, []);

  return (
    <>
      {/* ░░ NAV ░░ */}
      <header className="nav" id="nav">
        <div className="nav-inner">
          <a href="#" className="logo">
            <svg className="logo-svg" width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="16" r="10" fill="#A8D5BA" opacity="0.65"/>
              <circle cx="20" cy="16" r="10" fill="#D8C7FF" opacity="0.65"/>
              <circle cx="12" cy="16" r="10" fill="none" stroke="#111111" strokeWidth="1.5"/>
              <circle cx="20" cy="16" r="10" fill="none" stroke="#111111" strokeWidth="1.5"/>
            </svg>
            coexist
          </a>
          <div className="nav-actions">
            <Link to="/business" className="nav-secondary">Business</Link>
            <Link to="/app" className="nav-cta">Get the App</Link>
          </div>
        </div>
      </header>

      {/* ░░ HERO ░░ */}
      <section className="hero" id="hero">
        <canvas id="hero-canvas"></canvas>
        <div className="hero-glow g1"></div>
        <div className="hero-glow g2"></div>
        <div className="hero-glow g3"></div>
        <div className="container hero-body">
          <div className="hero-kicker">
            <span className="kicker-dot"></span>
            Human Presence Platform · Now in 12 cities
          </div>
          <h1>You don't have<br />to do it <span className="hero-em">alone.</span></h1>
          <p className="hero-sub">Find someone to simply share the moment.<br />Not dating. Not networking. Just presence.</p>
          <div className="hero-ctas">
            <a href="#how" className="btn-primary">
              Find Presence
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <Link to="/app" className="btn-ghost">See the App</Link>
          </div>
          <div className="hero-chips">
            <span className="chip sage"><Icon name="📚" /> Study</span>
            <span className="chip sky"><Icon name="☕" /> Coffee</span>
            <span className="chip lav"><Icon name="🏃" /> Walk</span>
            <span className="chip sand"><Icon name="✈" /> Travel</span>
            <span className="chip teal"><Icon name="💻" /> Work</span>
            <span className="chip sage"><Icon name="🍽" /> Meal</span>
          </div>
        </div>
        <div className="scroll-hint" aria-hidden="true">scroll ↓</div>
      </section>

      {/* ░░ MANIFESTO ░░ */}
      <section className="manifesto" id="manifesto">
        <div className="container manifesto-grid">
          <div className="mani-text">
            <span className="eyebrow">The Idea</span>
            <h2>Situational loneliness<br /><span className="em">is real.</span></h2>
            <p>You don't always need a best friend. Sometimes you just need a body in the chair next to you — someone to share the quiet without any pressure to perform.</p>
            <p>Coexist isn't about finding your people. It's about finding <strong>presence</strong> in the exact moment you need it.</p>
            <div className="mani-badges">
              <div className="mani-badge"><span className="mb-icon"><Icon name="🚫" size={16} /></span> Not dating</div>
              <div className="mani-badge"><span className="mb-icon"><Icon name="🚫" size={16} /></span> Not networking</div>
              <div className="mani-badge green"><span className="mb-icon"><Icon name="✦" size={16} /></span> Just presence</div>
            </div>
          </div>
          <div className="mani-quotes">
            <div className="quote-card">
              <p>"I studied better that day than I had in weeks. We never even exchanged names."</p>
              <cite>— Priya, IIT Mumbai</cite>
            </div>
            <div className="quote-card nudge">
              <p>"My flight was delayed 4 hours. We grabbed coffee, talked about our trips, then went our separate ways."</p>
              <cite>— Arjun, Bengaluru</cite>
            </div>
          </div>
        </div>
      </section>

      {/* ░░ HOW IT WORKS ░░ */}
      <section className="how-section" id="how">
        <div className="container">
          <div className="sec-head">
            <span className="eyebrow">How it works</span>
            <h2>Three steps to<br />shared presence</h2>
          </div>
          <div className="steps-row">
            <div className="step-card" id="sc1">
              <div className="step-no">01</div>
              <div className="step-icon-box" style={{"--ic":"#EAF7EE","--ib":"var(--sage)"}}><Icon name="🔋" size={20} /></div>
              <h3>Set your social battery</h3>
              <p>Tell others how much interaction you're open to — from total silence to fully social.</p>
              <div className="bat-ui">
                <div className="bat-track" id="bat-track-1">
                  <div className="bat-fill" id="bat-fill-1"></div>
                  <div className="bat-thumb" id="bat-thumb-1"></div>
                </div>
                <div className="bat-legend">
                  <span style={{color:"var(--sage-dark)"}}><Icon name="🔋" /> Quiet</span>
                  <span style={{color:"#3d7fad"}}><Icon name="⚡" /> Balanced</span>
                  <span style={{color:"#7655c4"}}><Icon name="🔆" /> Social</span>
                </div>
              </div>
            </div>
            <div className="step-arrow" aria-hidden="true">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M6 18h24M22 10l8 8-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="step-card" id="sc2">
              <div className="step-no">02</div>
              <div className="step-icon-box" style={{"--ic":"#EAF4FB","--ib":"var(--sky)"}}><Icon name="✦" size={20} /></div>
              <h3>Discover presence nearby</h3>
              <p>Floating presence dots appear around you — each one a person open to sharing a moment. No profiles. No swiping.</p>
              <div className="mini-presence">
                <div className="mp-ring r1"></div>
                <div className="mp-ring r2"></div>
                <div className="mp-ring r3"></div>
                <div className="mp-you">you</div>
                <div className="mp-dot" style={{top:"18%",left:"65%",background:"var(--sage)"}}></div>
                <div className="mp-dot" style={{top:"60%",left:"76%",background:"var(--sky)"}}></div>
                <div className="mp-dot" style={{top:"72%",left:"28%",background:"var(--lav)"}}></div>
                <div className="mp-dot" style={{top:"25%",left:"20%",background:"var(--sand)"}}></div>
              </div>
            </div>
            <div className="step-arrow" aria-hidden="true">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M6 18h24M22 10l8 8-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="step-card" id="sc3">
              <div className="step-no">03</div>
              <div className="step-icon-box" style={{"--ic":"#F3EEFF","--ib":"var(--lav)"}}><Icon name="◎" size={20} /></div>
              <h3>Coexist together</h3>
              <p>Join a session. Share the space. When time's up, leave a simple presence rating. No pressure. No expectations.</p>
              <div className="session-preview-ui">
                <div className="sp-card">
                  <div className="sp-row">
                    <span className="sp-title"><Icon name="📚" /> Silent Study</span>
                    <span className="chip-xs sage">Quiet</span>
                  </div>
                  <div className="sp-meta">
                    <span>1.2 km · 2 hrs</span>
                    <span className="chip-xs sky"><Icon name="✓" size={12} /> Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ░░ PRESENCE RADAR ░░ */}
      <section className="radar-section" id="radar">
        <div className="container">
          <div className="sec-head light">
            <span className="eyebrow light">Constellation of Presence</span>
            <h2 className="light">You're not browsing people.<br />You're discovering <span className="em-light">presence.</span></h2>
            <p className="light-p">Hover any dot — see the session, distance, and battery level. No faces. No profiles.</p>
          </div>
          <div className="radar-wrap">
            <canvas id="radar-canvas"></canvas>
            <div className="radar-tip" id="radar-tip"></div>
            <div className="radar-legend">
              <div className="rl"><span style={{background:"var(--sage)"}}></span>Quiet</div>
              <div className="rl"><span style={{background:"var(--sky)"}}></span>Balanced</div>
              <div className="rl"><span style={{background:"var(--lav)"}}></span>Social</div>
              <div className="rl"><span style={{background:"var(--sand)"}}></span>Coffee</div>
            </div>
          </div>
        </div>
      </section>

      {/* ░░ APP SCREENS ░░ */}
      <section className="app-section" id="app">
        <div className="container">
          <div className="sec-head">
            <span className="eyebrow">The App</span>
            <h2>Every screen designed<br />with <span className="em">intention.</span></h2>
            <p className="sec-sub">From the moment you open the app to the moment you say goodbye.</p>
          </div>
          <div className="app-bento">
            <div className="app-cell" id="cell-splash">
              <div className="cell-label">Splash</div>
              <div className="phone-frame"><div className="ph-notch"></div><div className="ph-screen aurora-screen"><canvas id="splash-c" className="splash-canvas"></canvas><div className="splash-inner"><div className="splash-logo">coexist</div><div className="splash-sub">Exist Together.</div><div className="splash-dots"><div className="sd"></div><div className="sd"></div><div className="sd"></div></div></div></div></div>
            </div>
            <div className="app-cell" id="cell-ob">
              <div className="cell-label">Onboarding</div>
              <div className="phone-frame"><div className="ph-notch"></div><div className="ph-screen"><div className="ob-illo"><div className="ob-figure alone"><div className="ob-head"></div><div className="ob-body"></div></div><div className="ob-glow"></div></div><div className="ob-copy"><div className="ob-pips"><span className="pip active"></span><span className="pip"></span><span className="pip"></span></div><h4>Sometimes you don't need conversation.</h4><p>You just don't want to be alone.</p></div></div></div>
            </div>
            <div className="app-cell" id="cell-profile">
              <div className="cell-label">Presence Profile</div>
              <div className="phone-frame"><div className="ph-notch"></div><div className="ph-screen"><div className="pp-wrap"><h4 className="pp-q">How do you usually coexist?</h4><div className="pp-label">Social Battery</div><div className="bat-track small" id="bat-track-pp"><div className="bat-fill" id="bat-fill-pp"></div><div className="bat-thumb" id="bat-thumb-pp"></div></div><div className="pp-states"><span style={{color:"var(--sage-dark)"}}><Icon name="🔋" /></span><span style={{color:"#3d7fad"}}><Icon name="⚡" /></span><span style={{color:"#7655c4"}}><Icon name="🔆" /></span></div><div className="pp-activity-grid"><div className="pp-act active" style={{"--ab":"#EAF7EE","--abb":"var(--sage)"}}><Icon name="📚" /> Study</div><div className="pp-act" style={{"--ab":"#EAF4FB","--abb":"var(--sky)"}}><Icon name="💻" /> Work</div><div className="pp-act active" style={{"--ab":"#FFF0E6","--abb":"var(--sand)"}}><Icon name="☕" /> Coffee</div><div className="pp-act" style={{"--ab":"#F3EEFF","--abb":"var(--lav)"}}><Icon name="🏃" /> Walk</div><div className="pp-act" style={{"--ab":"#E6F7FB","--abb":"var(--teal)"}}><Icon name="✈" /> Travel</div><div className="pp-act active" style={{"--ab":"#FFF5EE","--abb":"#FFD6C0"}}><Icon name="🍽" /> Meal</div></div></div></div></div>
            </div>
            <div className="app-cell" id="cell-home">
              <div className="cell-label">Home Screen</div>
              <div className="phone-frame phone-lg"><div className="ph-notch"></div><div className="ph-screen"><div className="home-wrap"><div className="home-greeting">Good evening, Naaz</div><div className="home-q">Who would you like to coexist with today?</div><div className="home-bento"><div className="hb-cell wide" style={{"--hbg":"#EAF7EE","--hbb":"var(--sage)"}}><span className="hb-ico"><Icon name="📚" size={18} /></span><span className="hb-lbl">Study</span><span className="hb-cnt">12 nearby</span></div><div className="hb-cell" style={{"--hbg":"#EAF4FB","--hbb":"var(--sky)"}}><span className="hb-ico"><Icon name="💻" size={18} /></span><span className="hb-lbl">Work</span><span className="hb-cnt">8</span></div><div className="hb-cell" style={{"--hbg":"#F3EEFF","--hbb":"var(--lav)"}}><span className="hb-ico"><Icon name="🏃" size={18} /></span><span className="hb-lbl">Walk</span><span className="hb-cnt">5</span></div><div className="hb-cell wide" style={{"--hbg":"#FFF0E6","--hbb":"var(--sand)"}}><span className="hb-ico"><Icon name="☕" size={18} /></span><span className="hb-lbl">Coffee</span><span className="hb-cnt">19 nearby</span></div><div className="hb-cell" style={{"--hbg":"#E6F7FB","--hbb":"var(--teal)"}}><span className="hb-ico"><Icon name="✈" size={18} /></span><span className="hb-lbl">Travel</span><span className="hb-cnt">3</span></div><div className="hb-cell" style={{"--hbg":"#FFF5EE","--hbb":"#FFD6C0"}}><span className="hb-ico"><Icon name="🍽" size={18} /></span><span className="hb-lbl">Meal</span><span className="hb-cnt">7</span></div></div></div></div></div>
            </div>
            <div className="app-cell" id="cell-session">
              <div className="cell-label">Active Session</div>
              <div className="phone-frame phone-lg"><div className="ph-notch"></div><div className="ph-screen session-screen"><div className="sess-label">Current Presence Session</div><div className="sess-timer" id="sess-timer">01:42:21</div><div className="sess-overlap"><div className="so-c c1"></div><div className="so-c c2"></div></div><div className="sess-info"><div className="si-row"><span><Icon name="📚" /> Silent Study</span></div><div className="si-row"><span className="chip-xs sage"><Icon name="🔋" /> 20% — Quiet</span><span className="chip-xs sky">Minimal talk</span></div></div><div className="sess-progress"><div className="sp-bar"><div className="sp-fill" id="sp-fill"></div></div><div className="sp-labels"><span>Started</span><span>2h remaining</span></div></div><button className="sos-btn"><Icon name="🆘" /> Need Assistance</button><div className="sess-end">End Session</div></div></div>
            </div>
            <div className="app-cell" id="cell-review">
              <div className="cell-label">Session Complete</div>
              <div className="phone-frame"><div className="ph-notch"></div><div className="ph-screen review-screen"><div className="rv-anim"><div className="rv-star"><Icon name="✦" size={16} /></div><div className="rv-star d1"><Icon name="✦" size={16} /></div></div><div className="rv-title">Thank you for<br />sharing this moment.</div><div className="rv-chips"><div className="rv-chip on"><Icon name="⭐" /> Reliable</div><div className="rv-chip"><Icon name="🤝" /> Respectful</div><div className="rv-chip on"><Icon name="☁" /> Comfortable</div><div className="rv-chip"><Icon name="⏱" /> On Time</div></div><div className="rv-note">No star ratings · No popularity scores</div></div></div>
            </div>
            <div className="app-cell" id="cell-prf">
              <div className="cell-label">Your Profile</div>
              <div className="phone-frame"><div className="ph-notch"></div><div className="ph-screen prf-screen"><div className="prf-avatar">N</div><div className="prf-name">Naaz</div><div className="prf-score-label">Presence Score</div><div className="prf-score">94<span>%</span></div><div className="prf-stats"><div className="ps"><span className="ps-n">28</span><span className="ps-l">Sessions</span></div><div className="ps"><span className="ps-n">42h</span><span className="ps-l">Coexisted</span></div><div className="ps"><span className="ps-n">96%</span><span className="ps-l">Reliable</span></div></div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ░░ BATTERY FEATURE ░░ */}
      <section className="bat-section" id="battery">
        <div className="container bat-grid">
          <div className="bat-copy">
            <span className="eyebrow">Signature Feature</span>
            <h2>Your social battery,<br />not your <span className="em">personality.</span></h2>
            <p>Coexist doesn't ask you to present yourself. It asks how much energy you have right now. That single slider changes everything before the interaction even starts.</p>
            <div className="bat-modes">
              <div className="bat-mode-card"><div className="bm-icon" style={{background:"#EAF7EE",borderColor:"var(--sage)"}}><Icon name="🔋" size={20} /></div><div><strong>Quiet</strong><p>Shared silence. No obligation to talk.</p></div></div>
              <div className="bat-mode-card"><div className="bm-icon" style={{background:"#EAF4FB",borderColor:"var(--sky)"}}><Icon name="⚡" size={20} /></div><div><strong>Balanced</strong><p>Light conversation welcome, no pressure.</p></div></div>
              <div className="bat-mode-card"><div className="bm-icon" style={{background:"#F3EEFF",borderColor:"var(--lav)"}}><Icon name="🔆" size={20} /></div><div><strong>Social</strong><p>Open to full conversation and connection.</p></div></div>
            </div>
          </div>
          <div className="bat-phone-wrap">
            <div className="phone-frame phone-lg card-nb"><div className="ph-notch"></div><div className="ph-screen"><div className="pm-wrap"><div className="pm-q">Who would you like<br />to coexist with today?</div><div className="pm-chip-row"><span className="pm-chip on"><Icon name="📚" /> Study</span><span className="pm-chip"><Icon name="☕" /> Coffee</span><span className="pm-chip"><Icon name="🏃" /> Walk</span><span className="pm-chip"><Icon name="✈" /> Travel</span><span className="pm-chip"><Icon name="💻" /> Work</span><span className="pm-chip"><Icon name="🍽" /> Meal</span></div><div className="pm-bat-lbl">Social Battery</div><div className="bat-track" id="bat-track-pm"><div className="bat-fill" id="bat-fill-pm"></div><div className="bat-thumb" id="bat-thumb-pm"></div></div><div className="pm-bat-val" id="pm-bat-val"><Icon name="⚡" /> Balanced</div></div></div></div>
          </div>
        </div>
      </section>

      {/* ░░ SAFETY ░░ */}
      <section className="safety-section" id="safety">
        <div className="container">
          <div className="sec-head">
            <span className="eyebrow">Safety First</span>
            <h2>Presence should<br />feel <span className="em">safe.</span></h2>
            <p className="sec-sub">Every session is built on verification, transparency, and real-time safety tools.</p>
          </div>
          <div className="safety-grid">
            <div className="sc"><div className="sc-ico" style={{"--si":"#EAF7EE","--sb":"var(--sage)"}}><Icon name="🪪" size={20} /></div><h3>ID Verification</h3><p>College or government ID required before your first session.</p><span className="sc-tag sage-tag"><Icon name="✓" size={12} /> Verified</span></div>
            <div className="sc"><div className="sc-ico" style={{"--si":"#EAF4FB","--sb":"var(--sky)"}}><Icon name="📍" size={20} /></div><h3>Live Location Share</h3><p>Share real-time location with a trusted contact for any session.</p><span className="sc-tag sky-tag">Live</span></div>
            <div className="sc"><div className="sc-ico" style={{"--si":"#FFEAEA","--sb":"#FFB3B3"}}><Icon name="🆘" size={20} /></div><h3>SOS Button</h3><p>One tap alerts your emergency contact instantly. Always on.</p><span className="sc-tag red-tag">Always On</span></div>
            <div className="sc"><div className="sc-ico" style={{"--si":"#F3EEFF","--sb":"var(--lav)"}}><Icon name="🌐" size={20} /></div><h3>Public Spaces Only</h3><p>Cafes, libraries, airports — verified public venues only.</p><span className="sc-tag lav-tag">Public Only</span></div>
            <div className="sc"><div className="sc-ico" style={{"--si":"#FFF0E6","--sb":"var(--sand)"}}><Icon name="⭐" size={20} /></div><h3>Presence Ratings</h3><p>Reliable · Respectful · Comfortable Presence. No star ratings.</p><span className="sc-tag sand-tag">No Stars</span></div>
            <div className="sc"><div className="sc-ico" style={{"--si":"#EAF7EE","--sb":"var(--sage)"}}><Icon name="🛡" size={20} /></div><h3>Zero-Tolerance</h3><p>Any report triggers immediate review. We take every one seriously.</p><span className="sc-tag sage-tag">Protected</span></div>
          </div>
        </div>
      </section>

      {/* ░░ PRESENCE WEATHER ░░ */}
      <section className="weather-section" id="weather">
        <div className="container">
          <div className="sec-head light">
            <span className="eyebrow light">Unique Feature</span>
            <h2 className="light">Presence <span className="em-light">Weather</span></h2>
            <p className="light-p">Not numbers. Not stats. The emotional forecast of companionship — city by city, activity by activity.</p>
          </div>
          <div className="weather-grid">
            <div className="wc-card"><div className="wc-top"><span className="wc-city">Mumbai</span><span className="aurora-pill">High Presence</span></div><div className="wc-rows"><div className="wc-row"><span className="wc-act"><Icon name="📚" /> Study</span><div className="wc-bar-wrap"><div className="wc-bar" style={{"--p":"88%","--c":"var(--sage)"}}></div></div><span className="wc-lv hi">High</span></div><div className="wc-row"><span className="wc-act"><Icon name="☕" /> Coffee</span><div className="wc-bar-wrap"><div className="wc-bar" style={{"--p":"65%","--c":"var(--sand)"}}></div></div><span className="wc-lv md">Medium</span></div><div className="wc-row"><span className="wc-act"><Icon name="🏃" /> Walk</span><div className="wc-bar-wrap"><div className="wc-bar" style={{"--p":"42%","--c":"var(--lav)"}}></div></div><span className="wc-lv lo">Low</span></div><div className="wc-row"><span className="wc-act"><Icon name="💻" /> Work</span><div className="wc-bar-wrap"><div className="wc-bar" style={{"--p":"74%","--c":"var(--sky)"}}></div></div><span className="wc-lv hi">High</span></div></div><div className="wc-foot"><Icon name="🌤" /> Presence is warm today</div></div>
            <div className="wc-card"><div className="wc-top"><span className="wc-city">Bengaluru</span><span className="aurora-pill">Very High</span></div><div className="wc-rows"><div className="wc-row"><span className="wc-act"><Icon name="📚" /> Study</span><div className="wc-bar-wrap"><div className="wc-bar" style={{"--p":"95%","--c":"var(--sage)"}}></div></div><span className="wc-lv hi">Very High</span></div><div className="wc-row"><span className="wc-act"><Icon name="💻" /> Work</span><div className="wc-bar-wrap"><div className="wc-bar" style={{"--p":"82%","--c":"var(--sky)"}}></div></div><span className="wc-lv hi">High</span></div><div className="wc-row"><span className="wc-act"><Icon name="☕" /> Coffee</span><div className="wc-bar-wrap"><div className="wc-bar" style={{"--p":"58%","--c":"var(--sand)"}}></div></div><span className="wc-lv md">Medium</span></div><div className="wc-row"><span className="wc-act"><Icon name="🍽" /> Meal</span><div className="wc-bar-wrap"><div className="wc-bar" style={{"--p":"36%","--c":"#FFD6C0"}}></div></div><span className="wc-lv lo">Low</span></div></div><div className="wc-foot"><Icon name="⚡" /> Energy is buzzing today</div></div>
            <div className="wc-card"><div className="wc-top"><span className="wc-city">Delhi</span><span className="aurora-pill lav-pill">Moderate</span></div><div className="wc-rows"><div className="wc-row"><span className="wc-act"><Icon name="📚" /> Study</span><div className="wc-bar-wrap"><div className="wc-bar" style={{"--p":"70%","--c":"var(--sage)"}}></div></div><span className="wc-lv hi">High</span></div><div className="wc-row"><span className="wc-act"><Icon name="✈" /> Travel</span><div className="wc-bar-wrap"><div className="wc-bar" style={{"--p":"55%","--c":"var(--teal)"}}></div></div><span className="wc-lv md">Medium</span></div><div className="wc-row"><span className="wc-act"><Icon name="🏃" /> Walk</span><div className="wc-bar-wrap"><div className="wc-bar" style={{"--p":"48%","--c":"var(--lav)"}}></div></div><span className="wc-lv md">Medium</span></div><div className="wc-row"><span className="wc-act"><Icon name="🏋" /> Gym</span><div className="wc-bar-wrap"><div className="wc-bar" style={{"--p":"30%","--c":"var(--sky)"}}></div></div><span className="wc-lv lo">Low</span></div></div><div className="wc-foot"><Icon name="☁" /> Steady, calm presence</div></div>
            <div className="wc-card"><div className="wc-top"><span className="wc-city">Pune</span><span className="aurora-pill sky-pill">Growing</span></div><div className="wc-rows"><div className="wc-row"><span className="wc-act"><Icon name="📚" /> Study</span><div className="wc-bar-wrap"><div className="wc-bar" style={{"--p":"78%","--c":"var(--sage)"}}></div></div><span className="wc-lv hi">High</span></div><div className="wc-row"><span className="wc-act"><Icon name="☕" /> Coffee</span><div className="wc-bar-wrap"><div className="wc-bar" style={{"--p":"62%","--c":"var(--sand)"}}></div></div><span className="wc-lv md">Medium</span></div><div className="wc-row"><span className="wc-act"><Icon name="📖" /> Reading</span><div className="wc-bar-wrap"><div className="wc-bar" style={{"--p":"50%","--c":"var(--lav)"}}></div></div><span className="wc-lv md">Medium</span></div><div className="wc-row"><span className="wc-act"><Icon name="🍽" /> Meal</span><div className="wc-bar-wrap"><div className="wc-bar" style={{"--p":"28%","--c":"#FFD6C0"}}></div></div><span className="wc-lv lo">Low</span></div></div><div className="wc-foot"><Icon name="🌱" /> Presence is growing here</div></div>
          </div>
        </div>
      </section>

      {/* ░░ TESTIMONIALS ░░ */}
      <section className="testi-section" id="testimonials">
        <div className="container">
          <div className="sec-head">
            <span className="eyebrow">Real Moments</span>
            <h2>Presence <span className="em">remembered.</span></h2>
          </div>
          <div className="testi-grid">
            <div className="testi-card"><p>"6 hours of exam prep with someone I matched at the library. Best study day of my semester. We didn't even know each other's last names."</p><div className="ta"><div className="ta-av" style={{background:"var(--sage)"}}>R</div><div><strong>Riya M.</strong><span>Pune University</span></div></div></div>
            <div className="testi-card featured"><p>"The social battery feature was everything for me as an introvert. We matched quiet-to-quiet. Just sat and worked. It was perfect."</p><div className="ta"><div className="ta-av" style={{background:"rgba(255,255,255,0.15)"}}>K</div><div><strong>Kartik S.</strong><span>IIT Delhi</span></div></div></div>
            <div className="testi-card"><p>"Flight delayed 4 hours. We grabbed coffee, talked about our trips, then went our separate ways. I would never have met him otherwise."</p><div className="ta"><div className="ta-av" style={{background:"var(--sand)"}}>A</div><div><strong>Ananya K.</strong><span>Bengaluru</span></div></div></div>
          </div>
        </div>
      </section>

      {/* ░░ DOWNLOAD ░░ */}
      <section className="dl-section" id="download">
        <canvas id="dl-canvas"></canvas>
        <div className="dl-glow dg1"></div>
        <div className="dl-glow dg2"></div>
        <div className="container dl-body">
          <span className="eyebrow light">Join the Constellation</span>
          <h2 className="light">The moment is<br />happening <span className="em-light">right now.</span></h2>
          <p className="light-p">Thousands of people nearby are open to sharing it with you.</p>
          <div className="dl-btns">
            <a href="#" className="btn-primary white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              App Store
            </a>
            <a href="#" className="btn-ghost white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0989L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6892-7.5743-6.1185-9.4396"/></svg>
              Google Play
            </a>
          </div>

        </div>
      </section>

      {/* ░░ FOOTER ░░ */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">coexist</span>
            <p>A Human Presence Platform.<br />Calm. Safe. Intentional. Warm.</p>

          </div>
          <div className="footer-col"><h5>Product</h5><ul><li><a href="#">How it works</a></li><li><a href="#">Presence Radar</a></li><li><a href="#">Safety</a></li><li><a href="#">Presence Weather</a></li></ul></div>
          <div className="footer-col"><h5>Company</h5><ul><li><a href="#">About</a></li><li><a href="#">Blog</a></li><li><a href="#">Careers</a></li><li><a href="#">Press</a></li></ul></div>
          <div className="footer-col"><h5>Legal</h5><ul><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li><li><a href="#">Guidelines</a></li></ul></div>
        </div>
        <div className="footer-bottom container">
          <span>© 2026 Coexist · Designing human presence with intention.</span>

        </div>
      </footer>
    </>
  );
}
