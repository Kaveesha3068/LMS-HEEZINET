const sampleAssignments = [
  { id:1, title:'Quantum Mechanics Problem Set 5', course:'Advanced Physics', status:'pending', due:'Overdue', pts:100, color:'#ef4444', action:'Start Work' },
  { id:2, title:'Organic Synthesis Lab Report', course:'Organic Chemistry', status:'pending', due:'Overdue', pts:150, color:'#ef4444', action:'Start Work' },
  { id:3, title:'Literary Analysis Essay', course:'Modern Literature', status:'submitted', due:'Overdue', pts:200, color:'#f59e0b', action:'View Submission', score:'185/200' },
  { id:4, title:'Binary Search Tree Implementation', course:'Data Structures', status:'pending', due:'Overdue', pts:250, color:'#ef4444', action:'Start Work' },
  { id:5, title:'Renaissance Art Presentation', course:'Art History', status:'graded', due:'Overdue', pts:100, color:'#10b981', action:'View Submission', score:'92/100' }
];

function updateCounts(list){
  const pending = list.filter(a=>a.status==='pending').length;
  const submitted = list.filter(a=>a.status==='submitted').length;
  const graded = list.filter(a=>a.status==='graded').length;
  document.getElementById('pendingCount').textContent = pending;
  document.getElementById('submittedCount').textContent = submitted;
  document.getElementById('gradedCount').textContent = graded;
  document.getElementById('allCount').textContent = list.length;
  document.getElementById('pendingTabCount').textContent = pending;
  document.getElementById('submittedTabCount').textContent = submitted;
  document.getElementById('gradedTabCount').textContent = graded;
  const completion = Math.round((graded / list.length) * 100);
  document.getElementById('completionFill').style.width = completion + '%';
}

function renderAssignments(list){
  const grid = document.getElementById('assignGrid');
  grid.innerHTML = '';
  list.forEach((a, idx)=>{
    const card = document.createElement('article');
    card.className = 'assign-card';
    card.innerHTML = `
      <div class="title">${a.title} <span class="tag ${a.status}">${a.status}</span></div>
      <div class="meta">${a.course}</div>
      <div class="meta small">${a.due}</div>
      <div class="row">
        <div class="left">
          <button class="primary-action">${a.action}</button>
        </div>
        <div class="right small">${a.pts} pts ${a.score?'<span style="color:#10b981;margin-left:8px">'+a.score+'</span>':''}</div>
      </div>
    `;
    // set accent color on pseudo using data attribute
    card.setAttribute('data-accent', a.color);
    card.style.animationDelay = (idx * 80) + 'ms';
    grid.appendChild(card);
  })
  // apply accent colors to pseudo elements
  document.querySelectorAll('.assign-card').forEach(c=>{
    const color = c.getAttribute('data-accent');
    if(!color) return;
    c.style.setProperty('--accent-color', color);
    // also stagger entrance animation
    setTimeout(()=> c.classList.add('animated'), 60);
  });
}

function showToast(message){
  const t = document.createElement('div');
  t.className = 'edu-toast success';
  t.textContent = message;
  document.body.appendChild(t);
  requestAnimationFrame(()=> t.classList.add('visible'));
  setTimeout(()=>{ t.classList.remove('visible'); setTimeout(()=> t.remove(), 300); }, 3000);
}

function init(){
  // initial render
  updateCounts(sampleAssignments);
  renderAssignments(sampleAssignments);

  // animate stats and progress based on data
  animateStatsFromData(sampleAssignments);

  // tabs
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      if(f==='all') renderAssignments(sampleAssignments);
      else renderAssignments(sampleAssignments.filter(a=>a.status===f));
      // re-run stats animation for the filtered set
      animateStatsFromData(f==='all' ? sampleAssignments : sampleAssignments.filter(a=>a.status===f));
    })
  })

  // search
  document.getElementById('assignSearch').addEventListener('input', e=>{
    const q = e.target.value.toLowerCase();
    const filtered = sampleAssignments.filter(a=>a.title.toLowerCase().includes(q) || a.course.toLowerCase().includes(q));
    renderAssignments(filtered);
    animateStatsFromData(filtered);
  })

  // card actions
  document.getElementById('assignGrid').addEventListener('click', e=>{
    const btn = e.target.closest('.primary-action');
    if(!btn) return;
    const card = btn.closest('.assign-card');
    const title = card.querySelector('.title').textContent.trim();
    showToast('Action: ' + title);
  })

  document.getElementById('newAssignment').addEventListener('click', ()=>alert('New assignment modal (placeholder)'));

  // small UI micro-animations on load
  const notif = document.querySelector('.notif-count');
  if(notif){ notif.classList.add('pulse'); setTimeout(()=> notif.classList.remove('pulse'), 4200); }
  const chip = document.querySelector('.section-chip');
  if(chip){ setTimeout(()=> chip.classList.add('pop'), 120); }
}

// animate stats counts, percent chip, and progress fill; also adds entrance animation to stat cards
function animateStatsFromData(list){
  const pending = list.filter(a=>a.status==='pending').length;
  const submitted = list.filter(a=>a.status==='submitted').length;
  const graded = list.filter(a=>a.status==='graded').length;
  const total = list.length || 1;
  const completion = Math.round((graded/total)*100);

  const pendingEl = document.getElementById('pendingCount');
  const submittedEl = document.getElementById('submittedCount');
  const gradedEl = document.getElementById('gradedCount');
  const sectionCountEl = document.querySelector('.section-count');
  const allCountEl = document.getElementById('allCount');

  // animate numbers
  animateNumber(pendingEl, Number(pendingEl.textContent||0), pending, 700);
  animateNumber(submittedEl, Number(submittedEl.textContent||0), submitted, 700);
  animateNumber(gradedEl, Number(gradedEl.textContent||0), graded, 700);
  if(sectionCountEl) sectionCountEl.textContent = total;
  if(allCountEl) allCountEl.textContent = total;

  // animate stat cards with stagger
  const statEls = Array.from(document.querySelectorAll('.stat'));
  statEls.forEach((el, i)=>{
    el.classList.remove('animated');
    // force reflow
    void el.offsetWidth;
    setTimeout(()=> el.classList.add('animated'), i*120);
  });

  // animate tags inside assignment cards
  document.querySelectorAll('.tag').forEach((tag, i)=>{
    tag.classList.remove('pop');
    void tag.offsetWidth;
    setTimeout(()=> tag.classList.add('pop'), 180 + (i*60));
  });

  // reveal page title
  const title = document.querySelector('.page-title');
  if(title){ title.classList.remove('reveal'); void title.offsetWidth; setTimeout(()=> title.classList.add('reveal'), 80); }

  // shimmer progress briefly
  const progressWrap = document.querySelectorAll('.progress');
  progressWrap.forEach(p=>{ p.classList.remove('shimmer'); void p.offsetWidth; setTimeout(()=> p.classList.add('shimmer'), 120); setTimeout(()=> p.classList.remove('shimmer'), 1800); });

  // progress fill and percent chip
  const fill = document.getElementById('completionFill');
  const percentChip = document.querySelector('.percent-chip');
  if(fill) fill.style.width = completion + '%';
  if(percentChip) percentChip.textContent = completion + '%';
}

// simple animated counter
function animateNumber(el, from, to, duration){
  if(!el) return;
  const easeOutQuad = t => 1 - (1 - t) * (1 - t);
  const start = performance.now();
  requestAnimationFrame(function step(ts){
    const t = Math.min(1, (ts - start) / duration);
    const v = easeOutQuad(t);
    const val = Math.round(from + (to - from) * v);
    el.textContent = val;
    if(t < 1) requestAnimationFrame(step);
  });
}

window.addEventListener('DOMContentLoaded', init);
