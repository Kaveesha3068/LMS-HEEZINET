const sampleClasses = [
  { id:1, title:'Advanced Physics', teacher:'Dr. Johnson', schedule:'MWF 10:00-11:00 AM', room:'Room 201', status:'active', next:'Today at 2:00 PM', color:'#2b7cff' },
  { id:2, title:'Organic Chemistry', teacher:'Prof. Smith', schedule:'TTh 2:00-3:30 PM', room:'Lab B-3', status:'active', next:'Tomorrow at 2:00 PM', color:'#10b981' },
  { id:3, title:'Modern Literature', teacher:'Dr. Williams', schedule:'MW 1:00-2:30 PM', room:'Room 105', status:'upcoming', next:'Monday at 1:00 PM', color:'#f59e0b' },
  { id:4, title:'Calculus III', teacher:'Dr. Allen', schedule:'MWF 8:00-9:00 AM', room:'Room 102', status:'active', next:'Today at 11:00 AM', color:'#8b5cf6' },
  { id:5, title:'Data Structures', teacher:'Prof. Lee', schedule:'TTh 11:00-12:30 PM', room:'Lab C-1', status:'active', next:'Tomorrow at 9:00 AM', color:'#ef4444' }
];

function renderClasses(list){
  const grid = document.getElementById('classesGrid');
  grid.innerHTML = '';
  list.forEach((c, idx) => {
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <div class="accent" style="background:${c.color}"></div>
      <div class="title">${c.title}</div>
      <div class="meta">${c.teacher}<br>${c.schedule}<br>${c.room}</div>
      <div class="status" style="background:rgba(255,255,255,0.03);color:var(--muted)">${c.status === 'active' ? '<span style="background:#10b981;color:#061118;padding:4px 8px;border-radius:6px">Active</span>' : (c.status==='upcoming'?'<span style="background:#f59e0b;color:#1f1200;padding:4px 8px;border-radius:6px">Upcoming</span>':'<span style="background:#94a3b8;color:#0f1720;padding:4px 8px;border-radius:6px">Completed</span>')}</div>
      <div class="join-row"><button class="btn">${c.status==='upcoming'?'View Details':'Join Class'}</button><div class="materials">Materials</div></div>
    `;
    // staggered animation
    el.style.animationDelay = (idx * 80) + 'ms';
    grid.appendChild(el);
  })
}

// Toast helper
function showToast(message, type='info'){
  const t = document.createElement('div');
  t.className = 'edu-toast ' + (type === 'success' ? 'success' : '');
  t.textContent = message;
  document.body.appendChild(t);
  // trigger show
  requestAnimationFrame(()=> t.classList.add('visible'));
  setTimeout(()=>{ t.classList.remove('visible'); setTimeout(()=> t.remove(), 300); }, 3000);
}

function init(){
  renderClasses(sampleClasses);
  document.getElementById('classSearch').addEventListener('input', e=>{
    const q = e.target.value.toLowerCase();
    renderClasses(sampleClasses.filter(c=>c.title.toLowerCase().includes(q) || c.teacher.toLowerCase().includes(q)));
  });
  document.getElementById('statusFilter').addEventListener('change', e=>{
    const v = e.target.value;
    if(v==='all') renderClasses(sampleClasses);
    else renderClasses(sampleClasses.filter(c=>c.status===v));
  });
  document.getElementById('browseBtn').addEventListener('click', ()=>alert('Browse courses (placeholder)'));
  // Delegate join/view button clicks
  document.getElementById('classesGrid').addEventListener('click', (e)=>{
    const btn = e.target.closest('.btn');
    if(!btn) return;
    const card = btn.closest('.card');
    const title = card.querySelector('.title').textContent;
    const action = btn.textContent.trim();
    showToast(`${action} — ${title}`, 'success');
  });
}

window.addEventListener('DOMContentLoaded', init);
