// sample attendance data
const attendanceHistory = [
  {date:'2024-10-18', course:'Advanced Physics', time:'10:00 AM', status:'present'},
  {date:'2024-10-17', course:'Organic Chemistry', time:'2:00 PM', status:'present'},
  {date:'2024-10-16', course:'Advanced Physics', time:'10:15 AM', status:'late'},
  {date:'2024-10-15', course:'Modern Literature', time:'1:00 PM', status:'present'},
  {date:'2024-10-14', course:'Calculus III', time:'9:00 AM', status:'absent'},
  {date:'2024-10-11', course:'Data Structures', time:'11:00 AM', status:'present'},
  {date:'2024-10-10', course:'Organic Chemistry', time:'2:00 PM', status:'present'}
];

function renderKPIs(){
  const attended = attendanceHistory.filter(a=>a.status==='present').length;
  const missed = attendanceHistory.filter(a=>a.status==='absent').length;
  const late = attendanceHistory.filter(a=>a.status==='late').length;
  const total = attendanceHistory.length;
  const pct = Math.round((attended/total)*100);
  document.getElementById('classesAttended').textContent = attended;
  document.getElementById('classesMissed').textContent = missed;
  document.getElementById('lateArrivals').textContent = late;
  document.getElementById('overallPct').textContent = pct+'%';
  // animate circle
  const circle = document.getElementById('circleProgress');
  if(circle){ const dash = pct + ',100'; circle.setAttribute('stroke-dasharray', dash); }
}

function renderRecent(){
  const wrap = document.getElementById('recentList'); wrap.innerHTML='';
  attendanceHistory.slice(0,5).forEach(it=>{
    const div = document.createElement('div'); div.className='recent-item';
    div.innerHTML = `<div class="left"><div class="icon"><span class="material-symbols-outlined">check_circle</span></div><div><div class="title">${it.course}</div><div class="date small muted">${it.date}</div></div></div><div class="status ${it.status}">${it.status}</div>`;
    wrap.appendChild(div);
  })
}

function renderHistory(){
  const tbody = document.querySelector('#attendanceTable tbody'); tbody.innerHTML='';
  attendanceHistory.forEach(it=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${it.date}</td><td>${it.course}</td><td>${it.time}</td><td><span class="status ${it.status}">${it.status}</span></td>`;
    tbody.appendChild(tr);
  })
}

function renderCalendar(){
  const wrap = document.getElementById('calendarPlaceholder'); wrap.innerHTML='';
  const now = new Date(); const year = now.getFullYear(), month = now.getMonth();
  const first = new Date(year, month, 1); const days = new Date(year, month+1,0).getDate();
  // create day cells
  for(let d=1; d<=days; d++){
    const dd = new Date(year, month, d);
    const cell = document.createElement('div'); cell.className='cal-day'; cell.textContent = d;
    // mark today
    const today = new Date(); if(dd.toDateString()===today.toDateString()) cell.classList.add('today');
    // mark days with attendance
    const iso = dd.toISOString().slice(0,10);
    if(attendanceHistory.find(a=>a.date===iso)) cell.dataset.has='1';
    wrap.appendChild(cell);
  }
}

window.addEventListener('DOMContentLoaded', ()=>{
  renderKPIs(); renderRecent(); renderHistory(); renderCalendar();
  initUi();
});

// Button behaviors: theme toggle and notifications
function showToast(message){
  // ensure a single toast container isn't required; append individual toasts
  const t = document.createElement('div'); t.className='toast'; t.textContent = message;
  document.body.appendChild(t);
  // force reflow to ensure transition
  void t.offsetWidth;
  t.classList.add('visible');
  setTimeout(()=>{ t.classList.remove('visible'); setTimeout(()=> t.remove(),400); }, 3000);
}

function initUi(){
  // restore theme from storage
  try{
    const saved = localStorage.getItem('eduportal-theme');
    if(saved === 'light') document.documentElement.classList.add('light-theme');
  }catch(e){/* ignore */}

  const themeToggle = document.getElementById('themeToggle');
  if(themeToggle){
    themeToggle.addEventListener('click', ()=>{
      document.documentElement.classList.toggle('light-theme');
      const isLight = document.documentElement.classList.contains('light-theme');
      try{ localStorage.setItem('eduportal-theme', isLight ? 'light' : 'dark'); }catch(e){}
      showToast(isLight ? 'Light theme enabled' : 'Dark theme enabled');
    });
    // keyboard accessibility
    themeToggle.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') themeToggle.click(); });
  }

  const notifBtn = document.getElementById('notifBtn');
  if(notifBtn){
    notifBtn.addEventListener('click', ()=>{
      notifBtn.classList.add('pulse'); setTimeout(()=> notifBtn.classList.remove('pulse'),600);
      showToast('You have new notifications');
    });
    notifBtn.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') notifBtn.click(); });
  }
}