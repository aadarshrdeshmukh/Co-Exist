import { useEffect } from 'react';
import Icon from '../components/Icon';
import '../styles/app.css';

export default function AppPage() {
  useEffect(() => {
    /* ── colour tokens ── */
    const C={sage:'#A8D5BA',sageDark:'#4D9E72',sky:'#BFD7EA',skyDark:'#3d7fad',lav:'#D8C7FF',lavDark:'#7655c4',sand:'#F4D6B8',teal:'#AED9E0',peach:'#FFD6C0',ivory:'#FAF7F2',charcoal:'#1C1C1C',ink:'#111111'};
    function ha(hex,a){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return`rgba(${r},${g},${b},${a})`;}

    /* ── SCREEN NAVIGATION ── */
    let currentScreen='s-splash';
    window._go=function go(id){
      const prev=document.getElementById(currentScreen);
      const next=document.getElementById(id);
      if(!next||id===currentScreen)return;
      prev.classList.add('exit');prev.classList.remove('active');
      setTimeout(()=>prev.classList.remove('exit'),350);
      next.classList.add('active');currentScreen=id;
      document.querySelectorAll('.sn-dot').forEach(d=>{d.classList.toggle('active',d.dataset.screen===id);});
      if(id==='s-radar')initRadar();
      if(id==='s-session')initSession();
      if(id==='s-match')initMatchAurora();
      if(id==='s-complete')initCompleteAurora();
      if(id==='s-home'){setTimeout(initHomeConst,120);animateCounter();}
      next.scrollTop=0;
    };

    /* ── AURORA CANVAS ── */
    function makeAurora(canvasId,opts={}){
      const el=document.getElementById(canvasId);
      if(!el||el._running)return;el._running=true;
      const ctx=el.getContext('2d');
      const{dark=false,blobCount=4,ptCount=40,speed=0.14,alpha=0.22}=opts;
      const pal=[C.sage,C.sky,C.lav,C.sand];
      let W,H,blobs,pts,raf;
      function resize(){W=el.width=el.offsetWidth;H=el.height=el.offsetHeight;}
      function mkBlob(){const col=pal[Math.floor(Math.random()*pal.length)];return{x:Math.random()*W,y:Math.random()*H,r:Math.random()*200+80,vx:(Math.random()-.5)*speed,vy:(Math.random()-.5)*speed,col,a:Math.random()*alpha+0.04};}
      function mkPt(){const col=pal[Math.floor(Math.random()*pal.length)];return{x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.8+.4,a:Math.random()*.25+.05,vx:(Math.random()-.5)*.15,vy:(Math.random()-.5)*.15,ph:Math.random()*Math.PI*2,ps:Math.random()*.009+.003,col};}
      function init(){blobs=Array.from({length:blobCount},mkBlob);pts=Array.from({length:ptCount},mkPt);}
      function frame(){
        if(!el.isConnected){el._running=false;cancelAnimationFrame(raf);return;}
        ctx.clearRect(0,0,W,H);
        blobs.forEach(b=>{const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);g.addColorStop(0,ha(b.col,b.a));g.addColorStop(1,ha(b.col,0));ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();b.x+=b.vx;b.y+=b.vy;if(b.x<-b.r)b.x=W+b.r;if(b.x>W+b.r)b.x=-b.r;if(b.y<-b.r)b.y=H+b.r;if(b.y>H+b.r)b.y=-b.r;});
        for(let i=0;i<pts.length;i++){for(let j=i+1;j<pts.length;j++){const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);if(d<80){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=dark?`rgba(250,247,242,${(1-d/80)*.04})`:`rgba(28,28,28,${(1-d/80)*.035})`;ctx.lineWidth=.7;ctx.stroke();}}}
        pts.forEach(p=>{p.ph+=p.ps;const a=Math.max(0,Math.min(1,p.a+Math.sin(p.ph)*.05));ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=ha(p.col,a);ctx.fill();p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;});
        raf=requestAnimationFrame(frame);
      }
      window.addEventListener('resize',()=>{resize();init();});
      resize();init();frame();
    }

    /* ── SPLASH ── */
    makeAurora('splash-aurora',{dark:true,blobCount:5,ptCount:50,speed:0.1,alpha:0.28});
    (function splashParticles(){
      const wrap=document.getElementById('splash-pts');if(!wrap)return;
      const items=['✦','○','◎','·','∙','⋆'];
      for(let i=0;i<22;i++){const el=document.createElement('span');el.textContent=items[Math.floor(Math.random()*items.length)];el.style.cssText=`position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;font-size:${Math.random()*10+6}px;color:rgba(168,213,186,${Math.random()*.4+.1});animation:spt-float ${Math.random()*4+3}s ease-in-out ${Math.random()*4}s infinite;pointer-events:none;`;wrap.appendChild(el);}
      const style=document.createElement('style');style.textContent=`@keyframes spt-float{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(6px,-8px) scale(1.1);}66%{transform:translate(-5px,5px) scale(0.9);}}`;document.head.appendChild(style);
    })();

    /* ── ONBOARDING ── */
    let obIndex=0;
    const obSlides=document.querySelectorAll('.ob-slide');
    const obPips=document.querySelectorAll('#ob-pips .pip');
    const obNext=document.getElementById('ob-next');
    function updateSlide(){obSlides.forEach((s,i)=>{s.style.transform=`translateX(-${obIndex*100}%)`;});obPips.forEach((p,i)=>p.classList.toggle('active',i===obIndex));if(obNext)obNext.textContent=obIndex===obSlides.length-1?'Begin →':'Continue';}
    obNext?.addEventListener('click',()=>{if(obIndex<obSlides.length-1){obIndex++;updateSlide();}else{window._go('s-build');}});
    let obTouchX=null;
    document.getElementById('ob-slides')?.addEventListener('touchstart',e=>{obTouchX=e.touches[0].clientX;});
    document.getElementById('ob-slides')?.addEventListener('touchend',e=>{if(obTouchX===null)return;const dx=e.changedTouches[0].clientX-obTouchX;if(Math.abs(dx)>40){if(dx<0&&obIndex<obSlides.length-1){obIndex++;updateSlide();}if(dx>0&&obIndex>0){obIndex--;updateSlide();}}obTouchX=null;});

    /* ── BATTERY SLIDER ── */
    function makeBattery(trackId,fillId,thumbId,onUpdate){
      const track=document.getElementById(trackId);const fill=document.getElementById(fillId);const thumb=document.getElementById(thumbId);
      if(!track||!fill||!thumb)return;let dragging=false;
      function update(cx){const r=track.getBoundingClientRect();const pct=Math.max(0,Math.min(1,(cx-r.left)/r.width));fill.style.width=(pct*100)+'%';thumb.style.left=(pct*100)+'%';if(onUpdate)onUpdate(pct);}
      track.addEventListener('mousedown',e=>{dragging=true;update(e.clientX);});
      track.addEventListener('touchstart',e=>{dragging=true;update(e.touches[0].clientX);},{passive:true});
      document.addEventListener('mousemove',e=>{if(dragging)update(e.clientX);});
      document.addEventListener('touchmove',e=>{if(dragging)update(e.touches[0].clientX);},{passive:true});
      document.addEventListener('mouseup',()=>dragging=false);
      document.addEventListener('touchend',()=>dragging=false);
      setTimeout(()=>{const r=track.getBoundingClientRect();if(r.width>0)update(r.left+r.width*.65);},150);
    }
    makeBattery('bld-track','bld-fill','bld-thumb',pct=>{const el=document.getElementById('bbb-pct');if(el)el.textContent=Math.round(pct*100)+'%';});
    document.querySelectorAll('.act-tag').forEach(tag=>{tag.addEventListener('click',()=>tag.classList.toggle('active'));});

    /* ── HOME ── */
    function setGreeting(){const h=new Date().getHours();const el=document.getElementById('home-time');if(!el)return;if(h<12)el.textContent='Good Morning';else if(h<18)el.textContent='Good Afternoon';else el.textContent='Good Evening';}
    setGreeting();
    let selectedAct='study';
    window._selectAct=function(act){selectedAct=act;};
    makeBattery('hbw-track','hbw-fill','hbw-thumb',pct=>{const icon=document.getElementById('hbw-icon');const label=document.getElementById('hbw-label');if(!icon||!label)return;if(pct<0.33){icon.textContent='🔋';label.textContent='Quiet';label.style.color='var(--sage-dark)';}else if(pct<0.66){icon.textContent='🔋';label.textContent='Balanced';label.style.color='var(--sky-dark)';}else{icon.textContent='🔆';label.textContent='Social';label.style.color='var(--lav-dark)';}});
    function animateCounter(){const el=document.getElementById('h-hero-count');if(!el)return;let current=230;const target=247;const step=()=>{if(current<target){current++;el.textContent=current;setTimeout(step,60);}};setTimeout(step,600);}
    animateCounter();
    makeAurora('hero-home-aurora',{dark:true,blobCount:4,ptCount:30,speed:0.08,alpha:0.32});

    function initHomeConst(){
      const canvas=document.getElementById('home-const-canvas');if(!canvas||canvas._running)return;canvas._running=true;
      const ctx=canvas.getContext('2d');let W,H,tick=0;
      const pal=[C.sage,C.sky,C.lav,C.sand,C.peach];
      const DOTS=[{a:0.5,d:0.30},{a:1.3,d:0.38},{a:2.1,d:0.25},{a:3.0,d:0.32},{a:3.9,d:0.28},{a:5.0,d:0.35},{a:5.7,d:0.22}].map((d,i)=>({...d,col:pal[i%pal.length]}));
      function resize(){const rect=canvas.getBoundingClientRect();W=canvas.width=rect.width||280;H=canvas.height=rect.height||100;}
      function frame(){
        if(!canvas.isConnected){canvas._running=false;return;}
        ctx.clearRect(0,0,W,H);tick++;const CX=W/2,CY=H/2,R=Math.min(W,H)*0.4;
        ctx.beginPath();ctx.arc(CX,CY,8,0,Math.PI*2);ctx.fillStyle=C.ivory;ctx.fill();
        ctx.fillStyle=C.charcoal;ctx.font='700 5.5px Manrope,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('YOU',CX,CY);
        DOTS.forEach((d,i)=>{const ph=tick*0.018+i*0.85;const sc=1+Math.sin(ph)*0.18;const x=CX+Math.cos(d.a)*d.d*R;const y=CY+Math.sin(d.a)*d.d*R;const br=5;const grd=ctx.createRadialGradient(x,y,0,x,y,br*sc*3);grd.addColorStop(0,ha(d.col,0.3));grd.addColorStop(1,ha(d.col,0));ctx.beginPath();ctx.arc(x,y,br*sc*3,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();ctx.beginPath();ctx.arc(x,y,br*sc,0,Math.PI*2);ctx.fillStyle=d.col;ctx.fill();ctx.strokeStyle='rgba(250,247,242,0.6)';ctx.lineWidth=1;ctx.stroke();});
        const sa=(tick*0.012)%(Math.PI*2);ctx.save();ctx.translate(CX,CY);ctx.rotate(sa);const sw=ctx.createLinearGradient(0,0,R,0);sw.addColorStop(0,ha(C.sage,0));sw.addColorStop(1,ha(C.sage,0.18));ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,-0.3,0);ctx.closePath();ctx.fillStyle=sw;ctx.fill();ctx.restore();
        requestAnimationFrame(frame);
      }
      resize();window.addEventListener('resize',resize);frame();
    }

    document.querySelectorAll('.h-mood').forEach(m=>{m.addEventListener('click',()=>{document.querySelectorAll('.h-mood').forEach(x=>x.classList.remove('active'));m.classList.add('active');});});

    /* ── RADAR ── */
    let radarRunning=false;
    const SESSIONS=[
      {label:'📚 Silent Study',sub:'1.2 km · 🔋 Quiet · 2 hrs',col:C.sage,ang:0.42,d:0.28},
      {label:'☕ Coffee',sub:'0.8 km · ⚡ Balanced · 1 hr',col:C.sand,ang:1.18,d:0.38},
      {label:'🏃 Walking',sub:'1.9 km · 🔆 Social · 45 min',col:C.lav,ang:2.05,d:0.30},
      {label:'✈ Airport',sub:'0.4 km · 🔋 Quiet · open',col:C.sky,ang:2.95,d:0.23},
      {label:'💻 Work',sub:'1.5 km · ⚡ Balanced · 3 hrs',col:C.teal,ang:4.14,d:0.34},
      {label:'📚 Exam Prep',sub:'0.6 km · 🔋 Quiet · 4 hrs',col:C.sage,ang:5.02,d:0.42},
      {label:'🍽 Meal',sub:'0.9 km · 🔆 Social · 1 hr',col:C.peach,ang:5.76,d:0.20},
    ];
    function initRadar(){
      if(radarRunning)return;radarRunning=true;
      const canvas=document.getElementById('radar-canvas');if(!canvas)return;
      const ctx=canvas.getContext('2d');const tipEl=document.getElementById('radar-tip');const sheet=document.getElementById('radar-sheet');const rsTitle=document.getElementById('rs-title');
      let W=320,H=320,CX=160,CY=160,R=130,tick=0,mx=-999,my=-999;
      function drawFrame(){
        if(!document.getElementById('s-radar')?.classList.contains('active')){radarRunning=false;return;}
        ctx.clearRect(0,0,W,H);tick++;
        const bloom=ctx.createRadialGradient(CX,CY,0,CX,CY,R*1.1);bloom.addColorStop(0,ha(C.sage,.06));bloom.addColorStop(0.6,ha(C.sky,.03));bloom.addColorStop(1,ha(C.lav,.02));ctx.beginPath();ctx.arc(CX,CY,R*1.1,0,Math.PI*2);ctx.fillStyle=bloom;ctx.fill();
        for(let i=1;i<=3;i++){const r=(i/3)*R;ctx.beginPath();ctx.arc(CX,CY,r,0,Math.PI*2);ctx.strokeStyle=`rgba(250,247,242,${i===3?.1:.05})`;ctx.lineWidth=i===3?1.2:.7;ctx.stroke();}
        ctx.save();ctx.setLineDash([2,8]);ctx.strokeStyle='rgba(250,247,242,.04)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(CX-R-4,CY);ctx.lineTo(CX+R+4,CY);ctx.moveTo(CX,CY-R-4);ctx.lineTo(CX,CY+R+4);ctx.stroke();ctx.setLineDash([]);ctx.restore();
        const sa=(tick*.01)%(Math.PI*2);ctx.save();ctx.translate(CX,CY);ctx.rotate(sa);const sw=ctx.createLinearGradient(0,0,R,0);sw.addColorStop(0,ha(C.sage,0));sw.addColorStop(.5,ha(C.sage,.06));sw.addColorStop(1,ha(C.lav,.16));ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,R,-.42,0);ctx.closePath();ctx.fillStyle=sw;ctx.fill();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(R,0);ctx.strokeStyle=ha(C.sage,.25);ctx.lineWidth=1;ctx.stroke();ctx.restore();
        const yp=.7+Math.sin(tick*.04)*.22;[20,14].forEach((r,i)=>{ctx.beginPath();ctx.arc(CX,CY,r+Math.sin(tick*.04+i)*1.5,0,Math.PI*2);ctx.strokeStyle=`rgba(250,247,242,${yp*(.1-i*.03)})`;ctx.lineWidth=1.5;ctx.stroke();});
        ctx.beginPath();ctx.arc(CX,CY,10,0,Math.PI*2);ctx.fillStyle=C.ivory;ctx.fill();ctx.fillStyle=C.charcoal;ctx.font='700 7.5px Manrope,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('YOU',CX,CY);
        let hov=null;
        const dotPositions=[];
        SESSIONS.forEach((s,i)=>{const x=CX+Math.cos(s.ang)*s.d*R,y=CY+Math.sin(s.ang)*s.d*R;dotPositions.push({s,x,y,i});const ph=tick*.018+i*.9,sc=1+Math.sin(ph)*.2,br=8;const dx=mx-x,dy=my-y,dist=Math.sqrt(dx*dx+dy*dy);const isH=dist<20;if(isH)hov={s,x,y};if(isH){ctx.save();ctx.setLineDash([3,6]);ctx.beginPath();ctx.moveTo(CX,CY);ctx.lineTo(x,y);ctx.strokeStyle=ha(s.col,.35);ctx.lineWidth=.8;ctx.stroke();ctx.setLineDash([]);ctx.restore();}const grd=ctx.createRadialGradient(x,y,0,x,y,br*sc*3.5);grd.addColorStop(0,ha(s.col,isH?.35:.2));grd.addColorStop(1,ha(s.col,0));ctx.beginPath();ctx.arc(x,y,br*sc*3.5,0,Math.PI*2);ctx.fillStyle=grd;ctx.fill();ctx.beginPath();ctx.arc(x,y,br*(isH?1.5:sc),0,Math.PI*2);ctx.fillStyle=s.col;ctx.fill();ctx.strokeStyle='rgba(250,247,242,.75)';ctx.lineWidth=isH?2:1.5;ctx.stroke();ctx.beginPath();ctx.arc(x-2,y-2,2.2,0,Math.PI*2);ctx.fillStyle='rgba(250,247,242,.55)';ctx.fill();});
        canvas._dotPositions=dotPositions;
        if(tipEl){
          if(canvas._selectedDot){
            const sd=canvas._selectedDot;
            const sx=CX+Math.cos(sd.s.ang)*sd.s.d*R, sy=CY+Math.sin(sd.s.ang)*sd.s.d*R;
            tipEl.innerHTML=`<strong style="font-family:Manrope,sans-serif;font-size:.82rem;display:block;margin-bottom:3px">${sd.s.label}</strong><span style="font-size:.7rem;opacity:.6">${sd.s.sub}</span>`;
            const tipLeft=sx+16>W-100?sx-160:sx+16;
            tipEl.style.left=tipLeft+'px';tipEl.style.top=(sy-10)+'px';tipEl.classList.add('on');
          } else if(hov){
            tipEl.innerHTML=`<strong style="font-family:Manrope,sans-serif;font-size:.82rem;display:block;margin-bottom:3px">${hov.s.label}</strong><span style="font-size:.7rem;opacity:.6">${hov.s.sub}</span>`;tipEl.style.left=(hov.x+16)+'px';tipEl.style.top=(hov.y-10)+'px';tipEl.classList.add('on');canvas.style.cursor='pointer';
          } else {
            tipEl.classList.remove('on');canvas.style.cursor='crosshair';
          }
        }
        requestAnimationFrame(drawFrame);
      }
      canvas.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();mx=(e.clientX-r.left)*(canvas.width/r.width);my=(e.clientY-r.top)*(canvas.height/r.height);});
      canvas.addEventListener('mouseleave',()=>{mx=-999;my=-999;});
      canvas.addEventListener('click',(e)=>{
        const r=canvas.getBoundingClientRect();
        const cx=(e.clientX-r.left)*(canvas.width/r.width);
        const cy=(e.clientY-r.top)*(canvas.height/r.height);
        let clicked=null;
        if(canvas._dotPositions){canvas._dotPositions.forEach(d=>{const dx=cx-d.x,dy=cy-d.y;if(Math.sqrt(dx*dx+dy*dy)<22)clicked=d;});}
        if(clicked){
          canvas._selectedDot=clicked;
          if(rsTitle)rsTitle.textContent=clicked.s.label;
          if(sheet)sheet.classList.add('open');
        } else {
          canvas._selectedDot=null;
          if(sheet)sheet.classList.remove('open');
        }
      });
      drawFrame();
    }

    function initMatchAurora(){makeAurora('match-aurora',{dark:true,blobCount:4,ptCount:35,speed:0.12,alpha:0.22});}
    function initSession(){
      makeAurora('session-aurora',{dark:true,blobCount:3,ptCount:30,speed:0.08,alpha:0.18});
      const timerEl=document.getElementById('sess-timer');
      if(timerEl&&!timerEl._started){timerEl._started=true;let total=3600+42*60+9;setInterval(()=>{if(total<=0||!document.getElementById('s-session')?.classList.contains('active'))return;total--;timerEl.textContent=[Math.floor(total/3600),Math.floor((total%3600)/60),total%60].map(n=>String(n).padStart(2,'0')).join(':');},1000);}
      const prog=document.getElementById('sess-prog');if(prog)setTimeout(()=>{prog.style.width='35%';},600);
    }
    function initCompleteAurora(){makeAurora('complete-aurora',{dark:true,blobCount:4,ptCount:35,speed:0.1,alpha:0.2});}

    makeBattery('bat-track-pm','bat-fill-pm','bat-thumb-pm',pct=>{const labels=['🔋 Quiet','⚡ Balanced','🔆 Social'];const el=document.getElementById('pm-bat-val');if(el)el.textContent=labels[pct<.33?0:pct<.66?1:2];});
    makeBattery('dur-track','dur-fill','dur-thumb');

    document.querySelectorAll('.ca-card').forEach(c=>{c.addEventListener('click',()=>{document.querySelectorAll('.ca-card').forEach(x=>x.classList.remove('active'));c.classList.add('active');});});
    document.querySelectorAll('.conv-pill').forEach(p=>{p.addEventListener('click',()=>{document.querySelectorAll('.conv-pill').forEach(x=>x.classList.remove('active'));p.classList.add('active');});});
    document.querySelectorAll('.comp-chip').forEach(c=>{c.addEventListener('click',()=>c.classList.toggle('on'));});

    const pgBars=document.querySelectorAll('.pg-bar');
    setTimeout(()=>{pgBars.forEach(b=>{const m=b.getAttribute('style')?.match(/--w:([^;]+)/);if(m)b.style.width=m[1];});},800);
    setTimeout(()=>{document.querySelectorAll('.wb-fill').forEach(b=>b.classList.add('on'));},400);

    document.getElementById('s-splash')?.classList.add('active');
    setTimeout(initHomeConst,800);
    setTimeout(()=>{document.querySelectorAll('.hlc-bar-fill').forEach(b=>{b.style.transition='width 1.3s cubic-bezier(0.4,0,0.2,1)';});},400);
  }, []);

  /* eslint-disable */
  return (
    <div className="app-page">
    <div className="device-shell">
      <div className="phone">
        <div className="phone-speaker"></div>
        <div className="phone-cam"></div>
        <div className="screen-vp" id="vp">

          {/* S1 SPLASH */}
          <div className="screen active" id="s-splash">
            <canvas className="aurora-bg" id="splash-aurora"></canvas>
            <div className="splash-wrap">
              <div className="splash-particles" id="splash-pts"></div>
              <div className="splash-logo"><div className="logo-mark-big"></div>coexist</div>
              <div className="splash-star"><Icon name="✦" /></div>
              <p className="splash-tag">Exist Together.</p>
              <button className="btn-aurora" onClick={()=>window._go('s-ob1')}>Enter Presence</button>
            </div>
          </div>

          {/* S2 ONBOARDING */}
          <div className="screen" id="s-ob1">
            <div className="ob-screen">
              <div className="ob-slides" id="ob-slides">
                <div className="ob-slide"><div className="ob-illo illo-1"><div className="illo-scene"><div className="illo-person solo"></div><div className="illo-desk"></div><div className="illo-glow sage"></div></div></div><div className="ob-copy"><h2>You don't always need<br />conversation.</h2><p>Sometimes you just don't want<br />to be alone.</p></div></div>
                <div className="ob-slide"><div className="ob-illo illo-2"><div className="illo-scene"><div className="illo-person p1"></div><div className="illo-person p2"></div><div className="illo-desk wide"></div><div className="illo-glow sky"></div></div></div><div className="ob-copy"><h2>Sometimes presence<br />is enough.</h2><p>Share a moment without the<br />pressure to perform.</p></div></div>
                <div className="ob-slide"><div className="ob-illo illo-3"><div className="illo-scene multi"><div className="illo-place cafe"><Icon name="☕" /></div><div className="illo-place lib"><Icon name="📚" /></div><div className="illo-place gym"><Icon name="🏋" /></div><div className="illo-glow lav"></div></div></div><div className="ob-copy"><h2>Find people who want<br />the same moment.</h2><p>Cafes. Libraries. Gyms. Airports.<br />Presence without pressure.</p></div></div>
              </div>
              <div className="ob-nav">
                <div className="ob-pips" id="ob-pips"><span className="pip active"></span><span className="pip"></span><span className="pip"></span></div>
                <button className="btn-dark ob-next" id="ob-next">Continue</button>
              </div>
            </div>
          </div>

          {/* S3 BUILD YOUR PRESENCE */}
          <div className="screen" id="s-build">
            <div className="build-screen">
              <div className="build-top"><span className="back-btn" onClick={()=>window._go('s-ob1')}>←</span><span className="build-step">3 / 3</span></div>
              <div className="build-battery-big"><div className="bbb-icon"><Icon name="🔋" /></div><div className="bbb-pct" id="bbb-pct">65%</div></div>
              <h2 className="build-q">How social are<br />you today?</h2>
              <div className="build-slider-wrap">
                <div className="bld-track" id="bld-track"><div className="bld-fill" id="bld-fill"></div><div className="bld-thumb" id="bld-thumb"></div></div>
                <div className="bld-labels"><span>Quiet</span><span>Balanced</span><span>Social</span></div>
              </div>
              <p className="build-cloud-label">What are you here for?</p>
              <div className="activity-cloud" id="act-cloud">
                <div className="act-tag" data-act="study"><Icon name="📚" /> Study</div><div className="act-tag" data-act="coffee"><Icon name="☕" /> Coffee</div><div className="act-tag" data-act="walk"><Icon name="🏃" /> Walk</div><div className="act-tag active" data-act="work"><Icon name="💻" /> Work</div><div className="act-tag" data-act="travel"><Icon name="✈" /> Travel</div><div className="act-tag active" data-act="read">📖 Read</div><div className="act-tag" data-act="gym"><Icon name="🏋" /> Gym</div><div className="act-tag" data-act="meal"><Icon name="🍽" /> Meal</div>
              </div>
              <button className="btn-dark btn-full" onClick={()=>window._go('s-home')}>Start Coexisting</button>
            </div>
          </div>

          {/* S4 HOME */}
          <div className="screen" id="s-home">
            <div className="home-screen">
              <div className="h-topbar"><div className="h-topbar-left"><div className="h-greeting" id="home-time">Good Evening</div><div className="h-name">Naaz <span className="h-sparkle"><Icon name="✦" /></span></div><div className="h-subline">How are you showing up today?</div></div><div className="h-avatar" onClick={()=>window._go('s-profile')}>N</div></div>
              <div className="h-battery-widget"><div className="hbw-left"><span className="hbw-icon" id="hbw-icon"><Icon name="🔋" /></span><span className="hbw-label" id="hbw-label">Balanced</span></div><div className="hbw-track-wrap"><div className="hbw-track" id="hbw-track"><div className="hbw-fill" id="hbw-fill"></div><div className="hbw-thumb" id="hbw-thumb"></div></div></div></div>
              <div className="h-hero-card" id="h-hero-card"><canvas className="h-hero-aurora" id="hero-home-aurora"></canvas><div className="h-hero-body"><div className="h-hero-pulse"><span className="h-pulse-dot"></span><span className="h-pulse-label">Live right now</span></div><div className="h-hero-count" id="h-hero-count">247</div><div className="h-hero-text">people are coexisting nearby</div><div className="h-hero-acts"><span className="h-act-pill"><Icon name="📚" /> Study</span><span className="h-act-pill"><Icon name="☕" /> Coffee</span><span className="h-act-pill"><Icon name="🏃" /> Walking</span></div><div className="h-hero-bar"><div className="h-bar-seg" style={{"--w":"52%","--c":"var(--sage)"}} title="Study"></div><div className="h-bar-seg" style={{"--w":"30%","--c":"var(--sand)"}} title="Coffee"></div><div className="h-bar-seg" style={{"--w":"18%","--c":"var(--lav)"}} title="Walk"></div></div></div></div>
              <div className="h-section-label"><span className="h-live-dot"></span>Live Presence</div>
              <div className="h-live-row">
                <div className="h-live-card" onClick={()=>{window._selectAct('study');window._go('s-radar');}}><div className="hlc-top"><span className="hlc-ico"><Icon name="📚" /></span><span className="hlc-badge sage">Quiet</span></div><div className="hlc-title">Silent Study</div><div className="hlc-count">14 nearby</div><div className="hlc-bar"><div className="hlc-bar-fill" style={{"--w":"70%","--c":"var(--sage)"}}></div></div><div className="hlc-mood">Mostly quiet</div></div>
                <div className="h-live-card" onClick={()=>{window._selectAct('coffee');window._go('s-radar');}}><div className="hlc-top"><span className="hlc-ico"><Icon name="☕" /></span><span className="hlc-badge sky">Balanced</span></div><div className="hlc-title">Coffee Sessions</div><div className="hlc-count">9 nearby</div><div className="hlc-bar"><div className="hlc-bar-fill" style={{"--w":"50%","--c":"var(--sky)"}}></div></div><div className="hlc-mood">Open to chat</div></div>
                <div className="h-live-card" onClick={()=>{window._selectAct('walk');window._go('s-radar');}}><div className="hlc-top"><span className="hlc-ico"><Icon name="🏃" /></span><span className="hlc-badge lav">Social</span></div><div className="hlc-title">Evening Walks</div><div className="hlc-count">18 nearby</div><div className="hlc-bar"><div className="hlc-bar-fill" style={{"--w":"88%","--c":"var(--lav)"}}></div></div><div className="hlc-mood">High energy</div></div>
                <div className="h-live-card" onClick={()=>{window._selectAct('work');window._go('s-radar');}}><div className="hlc-top"><span className="hlc-ico"><Icon name="💻" /></span><span className="hlc-badge sand">Quiet</span></div><div className="hlc-title">Deep Work</div><div className="hlc-count">6 nearby</div><div className="hlc-bar"><div className="hlc-bar-fill" style={{"--w":"40%","--c":"var(--sand)"}}></div></div><div className="hlc-mood">Focus mode</div></div>
              </div>
              <div className="h-constellation-wrap" onClick={()=>window._go('s-radar')}><div className="h-const-label">Presence Constellation</div><canvas id="home-const-canvas" className="h-const-canvas"></canvas><button className="h-const-btn">Explore Presence →</button></div>
              <div className="h-section-label">Suggested For You</div>
              <div className="h-suggested">
                <div className="h-sug-card" onClick={()=>window._go('s-radar')}><div className="hsc-left"><div className="hsc-ico" style={{background:"var(--sage-bg)",borderColor:"var(--sage)"}}><Icon name="📚" /></div><div><div className="hsc-title">Silent Library Session</div><div className="hsc-meta">2 km away · Starts in 20 min</div></div></div><span className="hsc-badge sage-tag">Join</span></div>
                <div className="h-sug-card" onClick={()=>window._go('s-radar')}><div className="hsc-left"><div className="hsc-ico" style={{background:"var(--sand-bg)",borderColor:"var(--sand)"}}><Icon name="☕" /></div><div><div className="hsc-title">Cafe Coexist</div><div className="hsc-meta">1.1 km away · Starting now</div></div></div><span className="hsc-badge sand-tag">Join</span></div>
              </div>
              <div className="h-section-label">What's your vibe today?</div>
              <div className="h-mood-row">
                <div className="h-mood" data-mood="quiet"><Icon name="🌙" /><span>Quiet</span></div><div className="h-mood active" data-mood="focus"><Icon name="🌿" /><span>Focus</span></div><div className="h-mood" data-mood="company"><Icon name="☁" /><span>Company</span></div><div className="h-mood" data-mood="open"><Icon name="✨" /><span>Open</span></div><div className="h-mood" data-mood="social"><Icon name="🔥" /><span>Social</span></div>
              </div>
              <div className="h-fab-spacer"></div>
              <button className="h-fab" onClick={()=>window._go('s-create')}><Icon name="＋" size={18} /> Share A Moment</button>
              <div className="tab-bar"><div className="tab active" onClick={()=>window._go('s-home')}><span><Icon name="⌂" size={16} /></span><span>Home</span></div><div className="tab" onClick={()=>window._go('s-radar')}><span><Icon name="◎" size={16} /></span><span>Radar</span></div><div className="tab" onClick={()=>window._go('s-weather')}><span><Icon name="☁" /></span><span>Weather</span></div><div className="tab" onClick={()=>window._go('s-profile')}><span><Icon name="○" size={16} /></span><span>Profile</span></div></div>
            </div>
          </div>

          {/* S5 RADAR */}
          <div className="screen" id="s-radar">
            <div className="radar-screen">
              <div className="radar-header"><span className="back-btn" onClick={()=>window._go('s-home')}>←</span><span className="radar-title">Presence Nearby</span><span className="radar-filter" onClick={()=>window._go('s-create')}><Icon name="＋" size={18} /></span></div>
              <div className="radar-canvas-wrap"><canvas id="radar-canvas" width="320" height="320"></canvas><div className="radar-tip" id="radar-tip"></div></div>
              <div className="radar-legend"><span className="rl-item sage">● Quiet</span><span className="rl-item sky">● Balanced</span><span className="rl-item lav">● Social</span></div>
              <div className="radar-sheet" id="radar-sheet"><div className="rs-handle"></div><div className="rs-content" id="rs-content"><div className="rs-title" id="rs-title"><Icon name="📚" /> Silent Study</div><div className="rs-meta"><div className="rs-pill sage"><Icon name="🔋" /> Quiet</div><div className="rs-pill sky">1.2 km</div><div className="rs-pill sand">2 hrs</div></div><div className="rs-detail"><div className="rs-row"><span>Conversation</span><span>Minimal</span></div><div className="rs-row"><span>Energy</span><span>25%</span></div><div className="rs-row"><span>Venue</span><span>Brew & Co, Bandra</span></div></div><button className="btn-aurora rs-cta" onClick={()=>window._go('s-match')}>Join Presence</button></div></div>
              <div className="tab-bar"><div className="tab" onClick={()=>window._go('s-home')}><span><Icon name="⌂" size={16} /></span><span>Home</span></div><div className="tab active"><span><Icon name="◎" size={16} /></span><span>Radar</span></div><div className="tab" onClick={()=>window._go('s-weather')}><span><Icon name="☁" /></span><span>Weather</span></div><div className="tab" onClick={()=>window._go('s-profile')}><span><Icon name="○" size={16} /></span><span>Profile</span></div></div>
            </div>
          </div>

          {/* S7 MATCH FOUND */}
          <div className="screen" id="s-match">
            <div className="match-screen"><canvas className="aurora-bg" id="match-aurora"></canvas><div className="match-body"><div className="match-circles"><div className="mc c1"></div><div className="mc c2"></div><div className="mc-label">Presence Found</div></div><div className="match-card"><div className="mcard-row"><div className="mcard-ico"><Icon name="📚" /></div><div><div className="mcard-title">Study Session</div><div className="mcard-sub">2:00 PM · Cafe Aroma, Bandra</div></div></div><div className="mcard-pills"><span className="rs-pill sage"><Icon name="🔋" /> Quiet</span><span className="rs-pill sky">2 hrs</span><span className="rs-pill lav">Minimal talk</span></div></div><button className="btn-aurora btn-xl" onClick={()=>window._go('s-session')}>Begin Session</button><button className="btn-ghost-sm" onClick={()=>window._go('s-radar')}>← Back to radar</button></div></div>
          </div>

          {/* S8 LIVE SESSION */}
          <div className="screen" id="s-session">
            <div className="session-screen"><canvas className="aurora-bg sess-aurora" id="session-aurora"></canvas><div className="sess-top"><span className="sess-label">Current Presence Session</span></div><div className="sess-timer-wrap"><div className="sess-pulse"></div><div className="sess-timer" id="sess-timer">01:42:09</div></div><div className="sess-info"><div className="sess-act"><Icon name="📚" /> Silent Study</div><div className="sess-chips"><span className="rs-pill sage"><Icon name="🔋" /> Quiet</span><span className="rs-pill lav">Minimal talk</span></div></div><div className="sess-progress-wrap"><div className="sess-prog-track"><div className="sess-prog-fill" id="sess-prog"></div></div><div className="sess-prog-labels"><span>0m</span><span>2 hrs remaining</span></div></div><div className="sess-bottom"><button className="sos-btn" onClick={()=>alert('SOS sent to emergency contact')}><Icon name="🆘" /> Need Help? SOS</button><button className="btn-ghost-sm" onClick={()=>window._go('s-complete')}>End Session</button></div></div>
          </div>

          {/* S9 SESSION COMPLETE */}
          <div className="screen" id="s-complete">
            <div className="complete-screen"><canvas className="aurora-bg" id="complete-aurora"></canvas><div className="comp-body"><div className="comp-stars"><div className="comp-star s1"><Icon name="✦" /></div><div className="comp-star s2"><Icon name="✦" /></div></div><div className="comp-title">Thanks for sharing<br />this moment.</div><div className="comp-sub">How was your presence session?</div><div className="comp-chips"><div className="comp-chip on"><Icon name="🤝" /> Respectful</div><div className="comp-chip"><Icon name="☁" /> Comfortable</div><div className="comp-chip on"><Icon name="✓" /> Reliable</div><div className="comp-chip"><Icon name="⏱" /> On Time</div></div><div className="comp-note">No star ratings · No popularity scores</div><button className="btn-aurora" onClick={()=>window._go('s-home')}>Back to Home</button></div></div>
          </div>

          {/* S10 PROFILE */}
          <div className="screen" id="s-profile">
            <div className="profile-screen">
              <div className="prf-header"><span className="back-btn" onClick={()=>window._go('s-home')}>←</span><span>Your Presence</span><span></span></div>
              <div className="prf-hero"><div className="prf-avatar-big">N</div><div className="prf-name">Naaz</div><div className="prf-bat-wrap"><div className="prf-bat-track"><div className="prf-bat-fill" style={{width:"65%"}}></div></div><div className="prf-bat-label"><Icon name="⚡" /> Balanced today</div></div></div>
              <div className="prf-score-card"><div className="psc-label">Presence Score</div><div className="psc-num">92</div><div className="psc-sub">Based on reliability, attendance & respect</div></div>
              <div className="prf-stats"><div className="ps-item"><span className="ps-n">37</span><span className="ps-l">Sessions</span></div><div className="ps-divider"></div><div className="ps-item"><span className="ps-n">84h</span><span className="ps-l">Coexisted</span></div><div className="ps-divider"></div><div className="ps-item"><span className="ps-n">97%</span><span className="ps-l">Reliable</span></div></div>
              <div className="prf-graph"><div className="pg-label">Activity History</div><div className="pg-rows"><div className="pg-row"><span><Icon name="📚" /> Study</span><div className="pg-bar-w"><div className="pg-bar" style={{"--w":"85%","--c":"var(--sage)"}}></div></div><span>85%</span></div><div className="pg-row"><span><Icon name="☕" /> Coffee</span><div className="pg-bar-w"><div className="pg-bar" style={{"--w":"55%","--c":"var(--sand)"}}></div></div><span>55%</span></div><div className="pg-row"><span><Icon name="💻" /> Work</span><div className="pg-bar-w"><div className="pg-bar" style={{"--w":"40%","--c":"var(--sky)"}}></div></div><span>40%</span></div><div className="pg-row"><span><Icon name="🏃" /> Walk</span><div className="pg-bar-w"><div className="pg-bar" style={{"--w":"25%","--c":"var(--lav)"}}></div></div><span>25%</span></div></div></div>
              <div className="tab-bar"><div className="tab" onClick={()=>window._go('s-home')}><span><Icon name="⌂" size={16} /></span><span>Home</span></div><div className="tab" onClick={()=>window._go('s-radar')}><span><Icon name="◎" size={16} /></span><span>Radar</span></div><div className="tab" onClick={()=>window._go('s-weather')}><span><Icon name="☁" /></span><span>Weather</span></div><div className="tab active"><span><Icon name="○" size={16} /></span><span>Profile</span></div></div>
            </div>
          </div>

          {/* S11 WEATHER */}
          <div className="screen" id="s-weather">
            <div className="weather-screen">
              <div className="weather-header"><span className="back-btn" onClick={()=>window._go('s-home')}>←</span><span>Presence Weather</span><span></span></div>
              <div className="weather-hero"><div className="wh-city">Mumbai</div><div className="wh-badge">High Presence</div><div className="wh-temp"><Icon name="📚" /> Study Season</div></div>
              <div className="weather-cards">
                <div className="wc"><div className="wc-city-row"><span className="wc-name">Mumbai</span><span className="wc-badge aurora-badge">High</span></div><div className="wc-bars"><div className="wb-row"><span><Icon name="📚" /> Study</span><div className="wb-track"><div className="wb-fill on" style={{"--p":"88%","--c":"var(--sage)"}}></div></div><span className="wb-hi">High</span></div><div className="wb-row"><span><Icon name="☕" /> Coffee</span><div className="wb-track"><div className="wb-fill on" style={{"--p":"65%","--c":"var(--sand)"}}></div></div><span className="wb-md">Medium</span></div><div className="wb-row"><span><Icon name="🏃" /> Walk</span><div className="wb-track"><div className="wb-fill on" style={{"--p":"40%","--c":"var(--lav)"}}></div></div><span className="wb-lo">Low</span></div></div><div className="wc-foot"><Icon name="🌤" /> Warm presence today</div></div>
                <div className="wc"><div className="wc-city-row"><span className="wc-name">Bengaluru</span><span className="wc-badge aurora-badge">Very High</span></div><div className="wc-bars"><div className="wb-row"><span><Icon name="📚" /> Study</span><div className="wb-track"><div className="wb-fill on" style={{"--p":"95%","--c":"var(--sage)"}}></div></div><span className="wb-hi">Very High</span></div><div className="wb-row"><span><Icon name="💻" /> Work</span><div className="wb-track"><div className="wb-fill on" style={{"--p":"82%","--c":"var(--sky)"}}></div></div><span className="wb-hi">High</span></div><div className="wb-row"><span><Icon name="☕" /> Coffee</span><div className="wb-track"><div className="wb-fill on" style={{"--p":"58%","--c":"var(--sand)"}}></div></div><span className="wb-md">Medium</span></div></div><div className="wc-foot"><Icon name="⚡" /> Buzzing with energy</div></div>
                <div className="wc"><div className="wc-city-row"><span className="wc-name">Delhi</span><span className="wc-badge lav-badge">Moderate</span></div><div className="wc-bars"><div className="wb-row"><span><Icon name="📚" /> Study</span><div className="wb-track"><div className="wb-fill on" style={{"--p":"70%","--c":"var(--sage)"}}></div></div><span className="wb-hi">High</span></div><div className="wb-row"><span><Icon name="🏃" /> Walk</span><div className="wb-track"><div className="wb-fill on" style={{"--p":"48%","--c":"var(--lav)"}}></div></div><span className="wb-md">Medium</span></div><div className="wb-row"><span><Icon name="✈" /> Travel</span><div className="wb-track"><div className="wb-fill on" style={{"--p":"35%","--c":"var(--teal)"}}></div></div><span className="wb-lo">Low</span></div></div><div className="wc-foot"><Icon name="☁" /> Steady, calm presence</div></div>
              </div>
              <div className="tab-bar"><div className="tab" onClick={()=>window._go('s-home')}><span><Icon name="⌂" size={16} /></span><span>Home</span></div><div className="tab" onClick={()=>window._go('s-radar')}><span><Icon name="◎" size={16} /></span><span>Radar</span></div><div className="tab active"><span><Icon name="☁" /></span><span>Weather</span></div><div className="tab" onClick={()=>window._go('s-profile')}><span><Icon name="○" size={16} /></span><span>Profile</span></div></div>
            </div>
          </div>

          {/* S12 CREATE SESSION */}
          <div className="screen" id="s-create">
            <div className="create-screen">
              <div className="create-header"><span className="back-btn" onClick={()=>window._go('s-home')}>←</span><span>Create Session</span><span></span></div>
              <div className="create-q">What moment would you<br />like to share?</div>
              <div className="create-acts">
                <div className="ca-card active" style={{"--bg":"var(--sage-bg)","--b":"var(--sage)"}}><span className="ca-ico"><Icon name="📚" /></span><span>Study</span></div>
                <div className="ca-card" style={{"--bg":"var(--sky-bg)","--b":"var(--sky)"}}><span className="ca-ico"><Icon name="💻" /></span><span>Work</span></div>
                <div className="ca-card" style={{"--bg":"var(--sand-bg)","--b":"var(--sand)"}}><span className="ca-ico"><Icon name="☕" /></span><span>Coffee</span></div>
                <div className="ca-card" style={{"--bg":"var(--lav-bg)","--b":"var(--lav)"}}><span className="ca-ico"><Icon name="🏃" /></span><span>Walk</span></div>
                <div className="ca-card" style={{"--bg":"#E6F7FB","--b":"var(--teal)"}}><span className="ca-ico"><Icon name="🏋" /></span><span>Gym</span></div>
                <div className="ca-card" style={{"--bg":"#F0F8FF","--b":"#AED9E0"}}><span className="ca-ico"><Icon name="✈" /></span><span>Travel</span></div>
              </div>
              <div className="create-section"><div className="cs-label">Duration</div><div className="dur-track" id="dur-track"><div className="dur-fill" id="dur-fill"></div><div className="dur-thumb" id="dur-thumb"></div></div><div className="dur-labels"><span>30m</span><span>1h</span><span>2h</span><span>4h</span></div></div>
              <div className="create-section"><div className="cs-label">Conversation</div><div className="conv-pills"><div className="conv-pill">Silent</div><div className="conv-pill active">Minimal</div><div className="conv-pill">Casual</div><div className="conv-pill">Social</div></div></div>
              <button className="btn-aurora btn-full" onClick={()=>window._go('s-match')}>Create Presence <Icon name="✦" /></button>
            </div>
          </div>

        </div>
        <div className="phone-home-bar"></div>
      </div>

      {/* Side nav dots */}
      <div className="side-nav">
        <div className="sn-label">Screens</div>
        <div className="sn-dot active" data-screen="s-splash" onClick={()=>window._go('s-splash')} title="Splash"></div>
        <div className="sn-dot" data-screen="s-ob1" onClick={()=>window._go('s-ob1')} title="Onboarding"></div>
        <div className="sn-dot" data-screen="s-build" onClick={()=>window._go('s-build')} title="Build Presence"></div>
        <div className="sn-dot" data-screen="s-home" onClick={()=>window._go('s-home')} title="Home"></div>
        <div className="sn-dot" data-screen="s-radar" onClick={()=>window._go('s-radar')} title="Radar"></div>
        <div className="sn-dot" data-screen="s-match" onClick={()=>window._go('s-match')} title="Match Found"></div>
        <div className="sn-dot" data-screen="s-session" onClick={()=>window._go('s-session')} title="Live Session"></div>
        <div className="sn-dot" data-screen="s-complete" onClick={()=>window._go('s-complete')} title="Complete"></div>
        <div className="sn-dot" data-screen="s-profile" onClick={()=>window._go('s-profile')} title="Profile"></div>
        <div className="sn-dot" data-screen="s-weather" onClick={()=>window._go('s-weather')} title="Weather"></div>
        <div className="sn-dot" data-screen="s-create" onClick={()=>window._go('s-create')} title="Create"></div>
        <div className="sn-label sn-label-btm">coexist</div>
      </div>
    </div>
    </div>
  );
  /* eslint-enable */
}
