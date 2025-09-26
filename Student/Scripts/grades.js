const courses = [
  { title:'Advanced Physics', mid:88, assign:92, final:85, grade:'A-', gpa:3.7 },
  { title:'Organic Chemistry', mid:94, assign:89, final:91, grade:'A', gpa:4.0 },
  { title:'Modern Literature', mid:82, assign:95, final:87, grade:'B+', gpa:3.3 },
  { title:'Calculus III', mid:91, assign:88, final:93, grade:'A', gpa:4.0 },
  { title:'Data Structures', mid:96, assign:94, final:92, grade:'A', gpa:4.0 },
  { title:'Art History', mid:78, assign:85, final:80, grade:'B-', gpa:2.7 }
];

function renderCourses(){
  const list = document.getElementById('courseList');
  list.innerHTML = '';
  courses.forEach(c=>{
    const item = document.createElement('div');
    item.className = 'course-item';
    item.innerHTML = `<div>
      <div class="title">${c.title}</div>
      <div class="meta">Midterm: ${c.mid}% &nbsp; Assignments: ${c.assign}% &nbsp; Final: ${c.final}%</div>
    </div>
    <div class="grade-block"><div class="grade-pill">${c.grade}</div><div class="meta small">${c.gpa} GPA</div></div>`;
    list.appendChild(item);
    // staggered entrance animation
    setTimeout(()=> item.classList.add('animated'), 120 * Array.from(list.children).length);
  })
}

function drawDonut(){
  const counts = { A:4, B:2, C:1 }; // simplified counts
  const data = [8,4,1];
  const colors = ['#10b981','#f59e0b','#ef4444'];
  const canvas = document.getElementById('donut');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width; const h = canvas.height; const cx = w/2; const cy = h/2; const r = Math.min(w,h)/3.2;

  let total = data.reduce((s,v)=>s+v,0);
  let start= -Math.PI/2;
  const slices = [];
  // animated draw
  let progress = 0; const duration = 900; const startTime = performance.now();
  function step(ts){
    const t = Math.min(1,(ts-startTime)/duration);
    const eased = t; // linear for now
    ctx.clearRect(0,0,w,h);
    let acc = start;
    data.forEach((val,i)=>{
      const angle = (val/total) * Math.PI*2 * eased;
      ctx.beginPath();
      ctx.arc(cx,cy,r, acc, acc+angle);
      ctx.lineWidth = 36;
      ctx.strokeStyle = colors[i];
      ctx.lineCap = 'butt';
      ctx.stroke();
      if(t===1) slices.push({ start: acc, end: acc + angle, value: val, color: colors[i], label: i });
      acc += angle;
    })

    // inner cutout
    ctx.beginPath(); ctx.fillStyle = getComputedStyle(document.body).backgroundColor || '#0f1720'; ctx.arc(cx,cy,r-46,0,Math.PI*2); ctx.fill();

    if(t<1) requestAnimationFrame(step);
    else renderLegend();
  }
  requestAnimationFrame(step);

  // donut hover detection + tooltip
  const tooltip = document.getElementById('donutTooltip');
  canvas.addEventListener('mousemove', (ev)=>{
    const rect = canvas.getBoundingClientRect();
    const x = ev.clientX - rect.left; const y = ev.clientY - rect.top;
    const dx = x - cx, dy = y - cy; const dist = Math.sqrt(dx*dx+dy*dy);
    if(dist < r+18 && dist > r-60){
      let ang = Math.atan2(dy, dx);
      if(ang < -Math.PI/2) ang += Math.PI*2; // normalize to same start
      for(const s of slices){
        const a1 = (s.start + Math.PI*2) % (Math.PI*2);
        const a2 = (s.end + Math.PI*2) % (Math.PI*2);
        let a = (ang + Math.PI*2) % (Math.PI*2);
        if(a >= a1 && a <= a2){
          tooltip.hidden = false;
          tooltip.style.left = (x + 12) + 'px'; tooltip.style.top = (y + 12) + 'px';
          tooltip.textContent = `${s.value} items`;
          return;
        }
      }
    }
    tooltip.hidden = true;
  });
  canvas.addEventListener('mouseleave', ()=> tooltip.hidden = true);
}

function animateKpis(){
  document.querySelectorAll('.kpi-value').forEach((el, i)=>{
    setTimeout(()=> el.classList.add('animated'), 120 * i);
  })
}

function renderLegend(){
  const legend = document.getElementById('donutLegend');
  legend.innerHTML = '';
  const labels = ['A (8)','B (4)','C (1)'];
  const colors = ['#10b981','#f59e0b','#ef4444'];
  labels.forEach((l,i)=>{
    const el = document.createElement('div'); el.className='item'; el.innerHTML = `<div class='sw' style='background:${colors[i]}'></div>${l}`; legend.appendChild(el);
  })
}

window.addEventListener('DOMContentLoaded', ()=>{ renderCourses(); drawDonut(); animateKpis(); });

// render detailed course table
function renderCourseTable(){
  const tbody = document.querySelector('#courseTable tbody');
  tbody.innerHTML = '';
  courses.forEach(c=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${c.title}</td><td>${c.mid}%</td><td>${c.assign}%</td><td>${c.final}%</td><td><span class="grade-pill">${c.grade}</span></td><td>4</td><td><button class="icon-btn" aria-label="View"><span class="material-symbols-outlined">visibility</span></button></td>`;
    tbody.appendChild(tr);
  })
}

// simple trend chart (line) using canvas
function drawTrendChart(){
  const canvas = document.getElementById('trendChart');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const values = [3.2,3.5,3.7,3.85,3.9]; // sample GPA points
  const labels = ['Fall 2022','Spring 2023','Fall 2023','Spring 2024','Current'];
  const w = canvas.width, h = canvas.height;
  const pad = 40;
  // scale
  const min = 3.0, max = 4.0;
  function toY(v){ return pad + (1 - (v-min)/(max-min))*(h - pad*2); }
  function toX(i){ return pad + i*( (w - pad*2)/(values.length-1) ); }

  // draw grid
  ctx.clearRect(0,0,w,h); ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=1;
  for(let i=0;i<5;i++){ const y = pad + i*((h-pad*2)/4); ctx.setLineDash([4,8]); ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(w-pad,y); ctx.stroke(); }
  ctx.setLineDash([]);

  // draw line
  ctx.beginPath(); ctx.strokeStyle='#60a5fa'; ctx.lineWidth=3; ctx.lineJoin='round'; ctx.lineCap='round';
  values.forEach((v,i)=>{ const x=toX(i), y=toY(v); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke();
  // draw points
  values.forEach((v,i)=>{ const x=toX(i), y=toY(v); ctx.beginPath(); ctx.fillStyle='#60a5fa'; ctx.arc(x,y,6,0,Math.PI*2); ctx.fill(); });
}

// render analytics bars
function renderAnalyticsBars(){
  const wrap = document.getElementById('analyticsBars'); if(!wrap) return; wrap.innerHTML='';
  const items = [ ['Midterm Exams',87.5], ['Assignments',90.5], ['Final Exams',88.2] ];
  items.forEach((it,idx)=>{
    const row = document.createElement('div'); row.className='bar-row';
    row.innerHTML = `<div class="label">${it[0]}</div><div class="bar"><div class="fill" style="width:0%"></div></div><div class="meta small">${it[1]}%</div>`;
    wrap.appendChild(row);
    setTimeout(()=> row.querySelector('.fill').style.width = it[1] + '%', 120*idx+200);
  })
}

// tabs wiring
function wireTabs(){
  const tabs = document.querySelectorAll('.tabs .tab');
  tabs.forEach(t=> t.addEventListener('click', ()=>{
    document.querySelectorAll('.tabs .tab').forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    const name = t.textContent.trim();
    document.querySelectorAll('.tab-content').forEach(tc=> tc.classList.toggle('active', tc.getAttribute('data-tab')===name));
  }))
}

// run additional renders
window.addEventListener('DOMContentLoaded', ()=>{ renderCourseTable(); drawTrendChart(); renderAnalyticsBars(); wireTabs(); });
