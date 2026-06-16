import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import '../styles/business.css';

/* ── Indian Rupee Formatter ── */
function fmtINR(n) {
  const neg = n < 0 ? '- ' : '';
  const s = Math.round(Math.abs(n)).toString();
  if (s.length <= 3) return neg + '₹ ' + s;
  const last3 = s.slice(-3);
  let rest = s.slice(0, -3);
  rest = rest.replace(/(\d)(?=(\d{2})+$)/g, '$1,');
  return neg + '₹ ' + rest + ',' + last3;
}

function fmtCompact(n) {
  const neg = n < 0 ? '-' : '';
  const a = Math.abs(n);
  if (a >= 10000000) return neg + '₹' + (a / 10000000).toFixed(1).replace(/\.0$/, '') + ' Cr';
  if (a >= 100000) return neg + '₹' + (a / 100000).toFixed(1).replace(/\.0$/, '') + ' L';
  if (a >= 1000) return neg + '₹' + (a / 1000).toFixed(0) + 'K';
  return neg + '₹' + a;
}

/* ── Financial Data ── */
const CAPEX = [
  { item: 'Mobile App Development', desc: 'Flutter MVP — cross-platform build', cost: 800000 },
  { item: 'Backend Infrastructure', desc: 'Firebase, APIs, real-time database', cost: 400000 },
  { item: 'UI/UX Design', desc: 'Founder-led with freelancer support', cost: 250000 },
  { item: 'Safety & Verification', desc: 'Basic ID check, SOS integration', cost: 300000 },
  { item: 'Location Services', desc: 'Maps API, basic geofencing', cost: 200000 },
  { item: 'Legal & Compliance', desc: 'DPDPA basics, trademark filing', cost: 200000 },
  { item: 'Initial Marketing', desc: 'Campus launches, posters, events', cost: 500000 },
  { item: 'Equipment & Setup', desc: 'Laptops, co-working desk, devices', cost: 200000 },
];
const CAPEX_TOTAL = CAPEX.reduce((s, r) => s + r.cost, 0);

const OPEX = [
  { item: 'Founder Stipends (×2)', monthly: 60000, annual: 720000, color: '#4D9E72' },
  { item: 'Freelance Developer', monthly: 80000, annual: 960000, color: '#3d7fad' },
  { item: 'Meta / Instagram Ads', monthly: 80000, annual: 960000, color: '#7655c4' },
  { item: 'Campus Ambassadors', monthly: 50000, annual: 600000, color: '#A8D5BA' },
  { item: 'Content & Social Media', monthly: 30000, annual: 360000, color: '#BFD7EA' },
  { item: 'Cloud & Hosting', monthly: 25000, annual: 300000, color: '#D8C7FF' },
  { item: 'Software & Tools', monthly: 20000, annual: 240000, color: '#F4D6B8' },
  { item: 'Legal & Accounting', monthly: 15000, annual: 180000, color: '#AED9E0' },
  { item: 'Customer Support (P/T)', monthly: 15000, annual: 180000, color: '#FFD6C0' },
  { item: 'Miscellaneous', monthly: 10000, annual: 120000, color: '#8BC6A5' },
];
const OPEX_MONTHLY = OPEX.reduce((s, r) => s + r.monthly, 0);
const OPEX_ANNUAL = OPEX.reduce((s, r) => s + r.annual, 0);

const REVENUE = [
  { source: 'Premium Subscriptions', desc: 'Coexist Pro (₹99/mo)', users: 450, avg: 99, monthly: 44550, share: 29.4, color: '#A8D5BA' },
  { source: 'Campus Tie-ups', desc: 'College wellness program fees', users: 3, avg: 15000, monthly: 45000, share: 29.7, color: '#BFD7EA' },
  { source: 'Venue Partnerships', desc: 'Verified venue listing fee', users: 12, avg: 3500, monthly: 42000, share: 27.7, color: '#D8C7FF' },
  { source: 'In-App Boosts', desc: 'Extended radar, priority matching', users: 300, avg: 49, monthly: 14700, share: 9.7, color: '#F4D6B8' },
  { source: 'Brand Collaborations', desc: 'Sponsored activity categories', users: 1, avg: 5000, monthly: 5000, share: 3.3, color: '#AED9E0' },
];
const REV_MONTHLY = REVENUE.reduce((s, r) => s + r.monthly, 0);

const COGS = Math.round(REV_MONTHLY * 0.35);
const GROSS_PROFIT = REV_MONTHLY - COGS;
const GROSS_MARGIN = ((GROSS_PROFIT / REV_MONTHLY) * 100).toFixed(1);
const EBITDA = GROSS_PROFIT - OPEX_MONTHLY;
const DEPRECIATION = Math.round(CAPEX_TOTAL / 36);
const PRE_TAX = EBITDA - DEPRECIATION;
const TAX = PRE_TAX > 0 ? Math.round(PRE_TAX * 0.25) : 0;
const NET_INCOME = PRE_TAX - TAX;

const INCOME = [
  { item: 'Revenue', monthly: REV_MONTHLY, annual: REV_MONTHLY * 12, note: 'From Revenue Streams', highlight: false },
  { item: 'COGS', monthly: COGS, annual: COGS * 12, note: '35% — server, APIs, payments', highlight: false },
  { item: 'Gross Profit', monthly: GROSS_PROFIT, annual: GROSS_PROFIT * 12, note: 'Revenue minus COGS', highlight: false },
  { item: 'Gross Margin %', monthly: GROSS_MARGIN + '%', annual: GROSS_MARGIN + '%', note: 'Gross profit / Revenue', highlight: false, isPercent: true },
  { item: 'OPEX', monthly: OPEX_MONTHLY, annual: OPEX_ANNUAL, note: 'From OPEX sheet', highlight: false },
  { item: 'EBITDA', monthly: EBITDA, annual: EBITDA * 12, note: 'Gross profit minus OPEX', highlight: true },
  { item: 'Depreciation', monthly: DEPRECIATION, annual: DEPRECIATION * 12, note: 'CAPEX over 3 years', highlight: false },
  { item: 'Tax', monthly: TAX, annual: TAX * 12, note: 'No profit = no tax', highlight: false },
  { item: 'Net Income', monthly: NET_INCOME, annual: NET_INCOME * 12, note: 'Still in the red — burn phase', highlight: true },
  { item: 'Opening CAPEX', monthly: CAPEX_TOTAL, annual: CAPEX_TOTAL, note: 'One-time startup investment', highlight: false, isSingle: true },
  { item: 'Total Funding Needed', monthly: CAPEX_TOTAL + Math.abs(NET_INCOME * 12), annual: CAPEX_TOTAL + Math.abs(NET_INCOME * 12), note: 'CAPEX + Year 1 burn runway', highlight: true, isSingle: true },
];

export default function BusinessPage() {
  useEffect(() => {
    /* ── Clean up residual Lenis / GSAP state from previous page ── */
    document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
    document.documentElement.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('height');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('height');
    window.scrollTo(0, 0);

    /* ── Colour helpers ── */
    const C = {
      sage:'#A8D5BA', sageDark:'#4D9E72',
      sky:'#BFD7EA', skyDark:'#3d7fad',
      lav:'#D8C7FF', lavDark:'#7655c4',
      sand:'#F4D6B8', teal:'#AED9E0',
      peach:'#FFD6C0', ivory:'#FAF7F2',
      charcoal:'#1C1C1C', ink:'#111111',
    };
    function ha(hex, a) {
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      return `rgba(${r},${g},${b},${a})`;
    }

    /* ── Aurora Background ── */
    function makeAurora(canvasId, opts = {}) {
      const el = document.getElementById(canvasId);
      if (!el) return;
      const ctx = el.getContext('2d');
      const { count = 5, ptCount = 45, speed = 0.12, alpha = 0.22 } = opts;
      let W, H, blobs, pts, raf;
      const palette = [C.sage, C.sky, C.lav, C.sand];
      function resize() { W = el.width = el.offsetWidth; H = el.height = el.offsetHeight; }
      function mkBlob() {
        const col = palette[Math.floor(Math.random() * palette.length)];
        return { x: Math.random()*W, y: Math.random()*H, r: Math.random()*260+100,
          vx: (Math.random()-0.5)*speed, vy: (Math.random()-0.5)*speed, col, a: Math.random()*alpha+0.04 };
      }
      function mkPt() {
        const col = palette[Math.floor(Math.random() * palette.length)];
        return { x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.8+0.5,
          a: Math.random()*0.25+0.05, vx: (Math.random()-0.5)*0.15, vy: (Math.random()-0.5)*0.15,
          ph: Math.random()*Math.PI*2, ps: Math.random()*0.009+0.003, col };
      }
      function init() { blobs = Array.from({length:count}, mkBlob); pts = Array.from({length:ptCount}, mkPt); }
      function frame() {
        if (!el.isConnected) { cancelAnimationFrame(raf); return; }
        ctx.clearRect(0,0,W,H);
        blobs.forEach(b => {
          const grd = ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
          grd.addColorStop(0, ha(b.col, b.a)); grd.addColorStop(1, ha(b.col, 0));
          ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fillStyle = grd; ctx.fill();
          b.x += b.vx; b.y += b.vy;
          if (b.x < -b.r) b.x = W+b.r; if (b.x > W+b.r) b.x = -b.r;
          if (b.y < -b.r) b.y = H+b.r; if (b.y > H+b.r) b.y = -b.r;
        });
        for (let i = 0; i < pts.length; i++) {
          for (let j = i+1; j < pts.length; j++) {
            const dx = pts[i].x-pts[j].x, dy = pts[i].y-pts[j].y, d = Math.sqrt(dx*dx+dy*dy);
            if (d < 88) {
              ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
              ctx.strokeStyle = `rgba(250,247,242,${(1-d/88)*0.045})`;
              ctx.lineWidth = 0.7; ctx.stroke();
            }
          }
        }
        pts.forEach(p => {
          p.ph += p.ps;
          const a = Math.max(0, Math.min(1, p.a + Math.sin(p.ph)*0.06));
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle = ha(p.col, a); ctx.fill();
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        });
        raf = requestAnimationFrame(frame);
      }
      const handleResize = () => { resize(); init(); };
      window.addEventListener('resize', handleResize);
      resize(); init(); frame();
      return () => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(raf); };
    }

    const cleanups = [];
    cleanups.push(makeAurora('biz-hero-canvas', { count: 5, ptCount: 50, speed: 0.1, alpha: 0.26 }));

    /* ── Donut Chart ── */
    function drawDonut(canvasId, segments, opts = {}) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      const W = rect.width, H = rect.height;
      const CX = W / 2, CY = H * 0.45;
      const R = Math.min(W, H) * 0.36;
      const innerR = R * 0.56;
      const total = segments.reduce((s, d) => s + d.value, 0);
      let progress = 0;

      function frame() {
        progress = Math.min(progress + 0.018, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        ctx.clearRect(0, 0, W, H);

        // Shadow under donut
        ctx.save();
        ctx.beginPath(); ctx.arc(CX, CY, R + 2, 0, Math.PI * 2);
        ctx.shadowColor = 'rgba(0,0,0,0.08)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 4;
        ctx.fillStyle = opts.dark ? 'rgba(17,17,17,0.01)' : 'rgba(250,247,242,0.01)';
        ctx.fill(); ctx.restore();

        let angle = -Math.PI / 2;
        segments.forEach((seg) => {
          const sweep = (seg.value / total) * Math.PI * 2 * ease;
          ctx.beginPath();
          ctx.arc(CX, CY, R, angle, angle + sweep);
          ctx.arc(CX, CY, innerR, angle + sweep, angle, true);
          ctx.closePath();
          ctx.fillStyle = seg.color;
          ctx.fill();
          // Separator line
          ctx.beginPath();
          ctx.moveTo(CX + innerR * Math.cos(angle), CY + innerR * Math.sin(angle));
          ctx.lineTo(CX + R * Math.cos(angle), CY + R * Math.sin(angle));
          ctx.strokeStyle = opts.dark ? '#1C1C1C' : '#FAF7F2';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          angle += sweep;
        });

        // Center text
        if (ease > 0.3) {
          ctx.globalAlpha = Math.min(1, (ease - 0.3) / 0.3);
          ctx.fillStyle = opts.dark ? '#FAF7F2' : '#1C1C1C';
          ctx.font = `700 ${Math.round(R * 0.28)}px Manrope, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(opts.centerText || '', CX, CY - R * 0.06);
          ctx.font = `400 ${Math.round(R * 0.14)}px Inter, sans-serif`;
          ctx.fillStyle = opts.dark ? 'rgba(250,247,242,0.45)' : 'rgba(28,28,28,0.4)';
          ctx.fillText(opts.centerSub || '', CX, CY + R * 0.18);
          ctx.globalAlpha = 1;
        }

        if (progress < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    /* ── Bar Chart ── */
    function drawBars(canvasId, bars) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      const W = rect.width, H = rect.height;
      const pad = { top: 30, right: 20, bottom: 40, left: 60 };
      const chartW = W - pad.left - pad.right;
      const chartH = H - pad.top - pad.bottom;
      const maxVal = Math.max(...bars.map(d => d.value));
      const barW = chartW / bars.length * 0.55;
      const gapW = chartW / bars.length;
      let progress = 0;

      function frame() {
        progress = Math.min(progress + 0.02, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        ctx.clearRect(0, 0, W, H);

        // Grid lines
        for (let i = 0; i <= 4; i++) {
          const y = pad.top + chartH * (1 - i / 4);
          ctx.beginPath();
          ctx.moveTo(pad.left, y);
          ctx.lineTo(W - pad.right, y);
          ctx.strokeStyle = 'rgba(28,28,28,0.06)';
          ctx.lineWidth = 1;
          ctx.stroke();
          // Y labels
          const val = (maxVal * i / 4) / 100000;
          ctx.fillStyle = 'rgba(28,28,28,0.35)';
          ctx.font = '500 10px Inter, sans-serif';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';
          ctx.fillText(`₹${val.toFixed(0)}L`, pad.left - 8, y);
        }

        // Bars
        bars.forEach((d, i) => {
          const x = pad.left + i * gapW + (gapW - barW) / 2;
          const barH = (d.value / maxVal) * chartH * ease;
          const y = pad.top + chartH - barH;
          // Rounded rect
          const radius = Math.min(barW / 4, 6);
          const grad = ctx.createLinearGradient(x, y, x, pad.top + chartH);
          grad.addColorStop(0, d.color);
          grad.addColorStop(1, ha(d.color, 0.55));
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + barW - radius, y);
          ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
          ctx.lineTo(x + barW, pad.top + chartH);
          ctx.lineTo(x, pad.top + chartH);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
          // Value on top
          if (ease > 0.5) {
            ctx.globalAlpha = Math.min(1, (ease - 0.5) * 4);
            ctx.fillStyle = '#1C1C1C';
            ctx.font = '600 11px Manrope, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(`₹${(d.value / 100000).toFixed(1)}L`, x + barW / 2, y - 6);
            ctx.globalAlpha = 1;
          }
          // X label
          ctx.fillStyle = 'rgba(28,28,28,0.55)';
          ctx.font = '500 10px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(d.label, x + barW / 2, pad.top + chartH + 10);
        });

        if (progress < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    /* ── Growth Line Chart ── */
    function drawGrowthChart(canvasId) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      const W = rect.width, H = rect.height;
      const pad = { top: 35, right: 30, bottom: 50, left: 65 };
      const chartW = W - pad.left - pad.right;
      const chartH = H - pad.top - pad.bottom;

      // Data: Year 0 (launch), Year 1 (ramp), Year 2 (steady), Year 3 (scale)
      const years = [0, 1, 2, 3];
      const revenue = [0, 720000, 1815000, 5400000];
      const cumPL =   [-2850000, -6350000, -8170000, -5000000];

      const yMin = -10000000;
      const yMax = 6000000;
      const yRange = yMax - yMin;

      function toX(yr) { return pad.left + (yr / 3) * chartW; }
      function toY(val) { return pad.top + chartH - ((val - yMin) / yRange) * chartH; }

      let progress = 0;

      function frame() {
        progress = Math.min(progress + 0.012, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        ctx.clearRect(0, 0, W, H);

        // Grid lines
        const gridVals = [-20000000, 0, 20000000, 40000000, 60000000, 80000000, 100000000];
        gridVals.forEach(v => {
          const y = toY(v);
          ctx.beginPath();
          ctx.moveTo(pad.left, y);
          ctx.lineTo(W - pad.right, y);
          ctx.strokeStyle = v === 0 ? 'rgba(250,247,242,0.2)' : 'rgba(250,247,242,0.05)';
          ctx.lineWidth = v === 0 ? 1.5 : 0.8;
          if (v === 0) { ctx.setLineDash([]); } else { ctx.setLineDash([3, 5]); }
          ctx.stroke();
          ctx.setLineDash([]);
          // Y label
          ctx.fillStyle = 'rgba(250,247,242,0.35)';
          ctx.font = '500 10px Inter, sans-serif';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';
          const lbl = v >= 10000000 ? `₹${(v / 10000000).toFixed(0)} Cr` : v <= -10000000 ? `-₹${(Math.abs(v) / 10000000).toFixed(0)} Cr` : v === 0 ? '₹0' : `₹${(v / 100000).toFixed(0)} L`;
          ctx.fillText(lbl, pad.left - 8, y);
        });

        // X axis year labels
        years.forEach(yr => {
          ctx.fillStyle = 'rgba(250,247,242,0.5)';
          ctx.font = '600 11px Manrope, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillText(`Year ${yr}`, toX(yr), pad.top + chartH + 14);
        });

        const numPts = Math.floor(years.length * ease) + 1;
        const partialT = (years.length * ease) - Math.floor(years.length * ease);

        // Helper: draw smooth line with area fill
        function drawLine(data, color, fillBelow) {
          const pts = [];
          for (let i = 0; i < Math.min(numPts, data.length); i++) {
            let x = toX(years[i]), y = toY(data[i]);
            if (i === numPts - 1 && i < data.length - 1 && partialT > 0) {
              const nx = toX(years[i + 1]), ny = toY(data[i + 1]);
              x = x + (nx - x) * partialT;
              y = y + (ny - y) * partialT;
            }
            pts.push({ x, y });
          }
          if (pts.length < 2) return;

          // Area fill
          if (fillBelow) {
            const zeroY = toY(0);
            ctx.beginPath();
            ctx.moveTo(pts[0].x, zeroY);
            pts.forEach((p, i) => {
              if (i === 0) ctx.lineTo(p.x, p.y);
              else {
                const prev = pts[i - 1];
                const cpx = (prev.x + p.x) / 2;
                ctx.bezierCurveTo(cpx, prev.y, cpx, p.y, p.x, p.y);
              }
            });
            ctx.lineTo(pts[pts.length - 1].x, zeroY);
            ctx.closePath();
            const grad = ctx.createLinearGradient(0, Math.min(...pts.map(p => p.y)), 0, zeroY);
            grad.addColorStop(0, ha(color, 0.2));
            grad.addColorStop(1, ha(color, 0.02));
            ctx.fillStyle = grad;
            ctx.fill();
          }

          // Line
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) {
            const prev = pts[i - 1];
            const cpx = (prev.x + pts[i].x) / 2;
            ctx.bezierCurveTo(cpx, prev.y, cpx, pts[i].y, pts[i].x, pts[i].y);
          }
          ctx.strokeStyle = color;
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Dots
          pts.forEach((p, i) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.strokeStyle = 'rgba(250,247,242,0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
          });

          // Value labels on dots
          if (ease > 0.5) {
            ctx.globalAlpha = Math.min(1, (ease - 0.5) * 3);
            pts.forEach((p, i) => {
              const val = i < data.length ? data[i] : 0;
              let label;
              if (Math.abs(val) >= 10000000) label = `₹${(val / 10000000).toFixed(1)} Cr`;
              else if (Math.abs(val) >= 100000) label = `${val < 0 ? '-' : ''}₹${(Math.abs(val) / 100000).toFixed(0)} L`;
              else if (val === 0) label = '₹0';
              else label = `₹${(val / 100000).toFixed(1)} L`;

              ctx.fillStyle = color;
              ctx.font = '600 10px Manrope, sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = p.y < toY(0) ? 'bottom' : 'top';
              ctx.fillText(label, p.x, p.y + (p.y < toY(0) ? -10 : 10));
            });
            ctx.globalAlpha = 1;
          }
        }

        drawLine(revenue, '#A8D5BA', true);
        drawLine(cumPL, '#BFD7EA', false);

        // Breakeven marker
        if (ease > 0.65) {
          const beX = toX(2);
          const beY = toY(0);
          ctx.globalAlpha = Math.min(1, (ease - 0.65) * 4);
          ctx.beginPath();
          ctx.arc(beX, beY, 7, 0, Math.PI * 2);
          ctx.strokeStyle = '#FAF7F2';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = 'rgba(250,247,242,0.6)';
          ctx.font = '600 9px Manrope, sans-serif';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'bottom';
          ctx.fillText('← Breakeven', beX + 12, beY - 2);
          ctx.globalAlpha = 1;
        }

        if (progress < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    /* ── Intersection Observer for animations & chart triggers ── */
    const opexPieData = OPEX.map(r => ({ label: r.item, value: r.monthly, color: r.color }));
    const revPieData = REVENUE.map(r => ({ label: r.source, value: r.monthly, color: r.color }));
    const incomeBarData = [
      { label: 'Revenue', value: REV_MONTHLY, color: '#4D9E72' },
      { label: 'Gross Profit', value: GROSS_PROFIT, color: '#3d7fad' },
      { label: 'OPEX', value: OPEX_MONTHLY, color: '#e05555' },
    ];

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        if (e.target.id === 'opex-chart-wrap') {
          drawDonut('opex-pie', opexPieData, { centerText: fmtCompact(OPEX_MONTHLY), centerSub: 'Monthly OPEX' });
        }
        if (e.target.id === 'rev-chart-wrap') {
          drawDonut('rev-pie', revPieData, { dark: true, centerText: fmtCompact(REV_MONTHLY), centerSub: 'Monthly Revenue' });
        }
        if (e.target.id === 'income-chart-wrap') {
          drawBars('income-bar', incomeBarData);
        }
        if (e.target.id === 'growth-chart-wrap') {
          drawGrowthChart('growth-chart');
        }
        io.unobserve(e.target);
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.biz-table-card,.biz-chart-card,.biz-metric,.bhm,.growth-milestone').forEach(el => {
      el.classList.add('fade-up');
      const siblings = el.parentElement.querySelectorAll('.fade-up');
      const idx = Array.from(siblings).indexOf(el);
      if (idx > 0 && idx < 6) el.classList.add(`fd${idx + 1}`);
      io.observe(el);
    });

    /* ── Nav scroll + auto-hide ── */
    const navEl = document.getElementById('biz-nav');
    const heroH = document.querySelector('.biz-hero')?.offsetHeight || window.innerHeight;
    const onScroll = () => {
      if (!navEl) return;
      const y = window.scrollY;
      navEl.classList.toggle('scrolled', y > 16);
      /* Hide once past hero, only show when back within top half of hero */
      navEl.classList.toggle('nav-hidden', y > heroH * 0.5);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cleanups.forEach(fn => fn && fn());
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="biz-page">
      {/* ░░ NAV ░░ */}
      <header className="biz-nav" id="biz-nav">
        <div className="nav-inner">
          <Link to="/" className="logo">
            <svg className="logo-svg" width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="16" r="10" fill="#A8D5BA" opacity="0.65"/>
              <circle cx="20" cy="16" r="10" fill="#D8C7FF" opacity="0.65"/>
              <circle cx="12" cy="16" r="10" fill="none" stroke="#111111" strokeWidth="1.5"/>
              <circle cx="20" cy="16" r="10" fill="none" stroke="#111111" strokeWidth="1.5"/>
            </svg>
            coexist
          </Link>
          <div className="nav-actions">
            <Link to="/" className="nav-secondary">Home</Link>
            <Link to="/website" className="nav-cta">Get the App</Link>
          </div>
        </div>
      </header>

      {/* ░░ HERO ░░ */}
      <section className="biz-hero">
        <canvas id="biz-hero-canvas"></canvas>
        <div className="biz-hero-glow g1"></div>
        <div className="biz-hero-glow g2"></div>
        <div className="container biz-hero-body">
          <span className="eyebrow light">Business Plan · India 2026</span>
          <h1>Coexist<br /><span className="hero-em">Business Plan</span></h1>
          <p className="biz-hero-sub">Financial projections for India's first Human Presence Platform.<br />Seed-stage estimates — Year 1 burn phase, 2–3 campus cities.</p>
          <div className="biz-hero-metrics">
            <div className="bhm">
              <span className="bhm-val">{fmtCompact(REV_MONTHLY)}</span>
              <span className="bhm-label">Monthly Revenue</span>
            </div>
            <div className="bhm">
              <span className="bhm-val">{GROSS_MARGIN}%</span>
              <span className="bhm-label">Gross Margin</span>
            </div>
            <div className="bhm">
              <span className="bhm-val">{fmtCompact(EBITDA)}</span>
              <span className="bhm-label">Monthly EBITDA</span>
            </div>
            <div className="bhm">
              <span className="bhm-val">{fmtCompact(CAPEX_TOTAL)}</span>
              <span className="bhm-label">Opening CAPEX</span>
            </div>
          </div>
        </div>
      </section>

      {/* ░░ CAPEX ░░ */}
      <section className="biz-section" id="capex">
        <div className="container">
          <div className="sec-head">
            <span className="eyebrow">Capital Expenditure</span>
            <h2>One-time <span className="em">Startup Costs</span></h2>
            <p className="sec-sub">Lean MVP investment to build and launch Coexist on 2 campuses</p>
          </div>
          <div className="biz-table-card">
            <table className="biz-table">
              <thead>
                <tr>
                  <th>CAPEX Item</th>
                  <th>Description</th>
                  <th className="num">One-time Cost</th>
                </tr>
              </thead>
              <tbody>
                {CAPEX.map((r, i) => (
                  <tr key={i}>
                    <td><strong>{r.item}</strong></td>
                    <td className="desc">{r.desc}</td>
                    <td className="num">{fmtINR(r.cost)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="total-row">
                  <td colSpan={2}><strong>Total CAPEX</strong></td>
                  <td className="num"><strong>{fmtINR(CAPEX_TOTAL)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      {/* ░░ OPEX ░░ */}
      <section className="biz-section" id="opex">
        <div className="container">
          <div className="sec-head">
            <span className="eyebrow">Operating Expenditure</span>
            <h2>Monthly <span className="em">Running Costs</span></h2>
            <p className="sec-sub">Recurring operational expenses to keep the platform running and growing</p>
          </div>
          <div className="biz-split">
            <div className="biz-table-card">
              <table className="biz-table">
                <thead>
                  <tr>
                    <th>OPEX Item</th>
                    <th className="num">Monthly Cost</th>
                    <th className="num">Annual Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {OPEX.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <span className="legend-dot-inline" style={{ background: r.color }}></span>
                        <strong>{r.item}</strong>
                      </td>
                      <td className="num">{fmtINR(r.monthly)}</td>
                      <td className="num">{fmtINR(r.annual)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td><strong>Total OPEX</strong></td>
                    <td className="num"><strong>{fmtINR(OPEX_MONTHLY)}</strong></td>
                    <td className="num"><strong>{fmtINR(OPEX_ANNUAL)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="biz-chart-card" id="opex-chart-wrap">
              <div className="chart-title">Monthly OPEX Breakdown</div>
              <canvas id="opex-pie"></canvas>
              <div className="chart-legend">
                {OPEX.map((r, i) => (
                  <div className="legend-item" key={i}>
                    <span className="legend-dot" style={{ background: r.color }}></span>
                    <span className="legend-label">{r.item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ░░ REVENUE ░░ */}
      <section className="biz-section biz-dark" id="revenue">
        <div className="container">
          <div className="sec-head light">
            <span className="eyebrow light">Revenue Streams</span>
            <h2 className="light">Monthly <span className="em-light">Revenue Estimate</span></h2>
            <p className="light-p">Projected monthly revenue by source — Year 2 steady-state across 5 cities</p>
          </div>
          <div className="biz-split">
            <div className="biz-table-card dark">
              <table className="biz-table dark-table">
                <thead>
                  <tr>
                    <th>Revenue Source</th>
                    <th>Description</th>
                    <th className="num">Customers</th>
                    <th className="num">Avg Rev</th>
                    <th className="num">Monthly Revenue</th>
                    <th className="num">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {REVENUE.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <span className="legend-dot-inline" style={{ background: r.color }}></span>
                        <strong>{r.source}</strong>
                      </td>
                      <td className="desc">{r.desc}</td>
                      <td className="num">{r.users.toLocaleString('en-IN')}</td>
                      <td className="num">{fmtINR(r.avg)}</td>
                      <td className="num">{fmtINR(r.monthly)}</td>
                      <td className="num share">{r.share}%</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="total-row">
                    <td colSpan={4}><strong>Total Monthly Revenue</strong></td>
                    <td className="num"><strong>{fmtINR(REV_MONTHLY)}</strong></td>
                    <td className="num"><strong>100%</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="biz-chart-card dark" id="rev-chart-wrap">
              <div className="chart-title light">Revenue Mix</div>
              <canvas id="rev-pie"></canvas>
              <div className="chart-legend">
                {REVENUE.map((r, i) => (
                  <div className="legend-item" key={i}>
                    <span className="legend-dot" style={{ background: r.color }}></span>
                    <span className="legend-label">{r.source}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ░░ INCOME STATEMENT ░░ */}
      <section className="biz-section" id="income">
        <div className="container">
          <div className="sec-head">
            <span className="eyebrow">Income Statement</span>
            <h2>Revenue to <span className="em">Net Income</span></h2>
            <p className="sec-sub">Complete P&L projection — revenue minus expenses, EBITDA, and final income</p>
          </div>
          <div className="biz-income-grid">
            <div className="biz-table-card">
              <table className="biz-table">
                <thead>
                  <tr>
                    <th>Line Item</th>
                    <th className="num">Monthly</th>
                    <th className="num">Annual</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {INCOME.map((r, i) => (
                    <tr key={i} className={r.highlight ? 'highlight-row' : ''}>
                      <td><strong>{r.item}</strong></td>
                      <td className="num">{r.isPercent ? r.monthly : fmtINR(r.monthly)}</td>
                      <td className="num">{r.isPercent ? r.annual : (r.isSingle ? '' : fmtINR(r.annual))}</td>
                      <td className="note">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="biz-income-right">
              <div className="biz-metrics-row">
                <div className="biz-metric">
                  <span className="bm-label">Monthly Revenue</span>
                  <span className="bm-val">{fmtINR(REV_MONTHLY)}</span>
                  <span className="bm-sub">Early traction</span>
                </div>
                <div className="biz-metric">
                  <span className="bm-label">Gross Margin</span>
                  <span className="bm-val">{GROSS_MARGIN}%</span>
                  <span className="bm-sub">Before OPEX</span>
                </div>
                <div className="biz-metric">
                  <span className="bm-label">Monthly EBITDA</span>
                  <span className="bm-val">{fmtINR(EBITDA)}</span>
                  <span className="bm-sub">Burn phase</span>
                </div>
                <div className="biz-metric">
                  <span className="bm-label">Annual Net Loss</span>
                  <span className="bm-val">{fmtINR(NET_INCOME * 12)}</span>
                  <span className="bm-sub">Pre-breakeven</span>
                </div>
              </div>
              <div className="biz-chart-card" id="income-chart-wrap">
                <div className="chart-title">Monthly Revenue to EBITDA</div>
                <canvas id="income-bar"></canvas>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ░░ REVENUE GROWTH ░░ */}
      <section className="biz-section biz-dark" id="growth">
        <div className="container">
          <div className="sec-head light">
            <span className="eyebrow light">Growth Trajectory</span>
            <h2 className="light">Revenue <span className="em-light">Growth</span></h2>
            <p className="light-p">3-year financial projection — from initial investment to profitability</p>
          </div>
          <div className="biz-growth-grid">
            <div className="biz-chart-card dark growth-chart-card" id="growth-chart-wrap">
              <div className="chart-title">Annual Revenue vs Cumulative Profit / Loss</div>
              <canvas id="growth-chart"></canvas>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#A8D5BA' }}></span>
                  <span className="legend-label">Annual Revenue</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#BFD7EA' }}></span>
                  <span className="legend-label">Cumulative Profit / Loss</span>
                </div>
              </div>
            </div>
            <div className="growth-milestones">
              <div className="growth-milestone">
                <div className="gm-year">Year 0</div>
                <div className="gm-title">Build &amp; Launch</div>
                <div className="gm-val negative">-₹28.5 L</div>
                <div className="gm-desc">MVP development, safety systems, legal setup. Launch on 2 campuses.</div>
              </div>
              <div className="growth-milestone">
                <div className="gm-year">Year 1</div>
                <div className="gm-title">Campus Traction</div>
                <div className="gm-val negative">-₹35 L</div>
                <div className="gm-desc">5K MAU, ₹60K/mo revenue. Burn phase — validating product-market fit.</div>
              </div>
              <div className="growth-milestone">
                <div className="gm-year">Year 2</div>
                <div className="gm-title">Revenue Growth</div>
                <div className="gm-val negative">-₹18.2 L</div>
                <div className="gm-desc">15K MAU across 3 cities. Revenue at ₹1.5L/mo. Still in the red but improving.</div>
              </div>
              <div className="growth-milestone">
                <div className="gm-year">Year 3</div>
                <div className="gm-title">Path to Breakeven 🎯</div>
                <div className="gm-val positive">₹4 L</div>
                <div className="gm-desc">40K MAU, 5 cities. Revenue at ₹4.5L/mo. First signs of profitability.</div>
              </div>
            </div>
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
          <div className="footer-col">
            <h5>Product</h5>
            <ul>
              <li><Link to="/">Landing Page</Link></li>
              <li><Link to="/app">App Prototype</Link></li>
              <li><Link to="/business">Business Plan</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Financials</h5>
            <ul>
              <li><a href="#capex">CAPEX</a></li>
              <li><a href="#opex">OPEX</a></li>
              <li><a href="#revenue">Revenue</a></li>
              <li><a href="#income">Income Statement</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom container">
          <span>© 2026 Coexist · Designing human presence with intention.</span>
          <span className="footer-case-tag">Business Plan</span>
        </div>
      </footer>
    </div>
  );
}
