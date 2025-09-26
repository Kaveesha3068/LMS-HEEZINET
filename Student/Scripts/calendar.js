(() => {
  const STORAGE_KEY = 'eduportal-events-v1'
  let events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')

  // Basic month state
  let current = new Date(2025, 8, 1) // September 2025
  let selectedDate = new Date(2025,8,20)

  const miniGrid = () => document.querySelector('.mini-grid')
  const monthLabel = () => document.querySelector('.month-label')
  const pop = () => document.getElementById('addPopover')

  function start(){
    renderMonth()
    attachHandlers()
  }

  function renderMonth(){
    const grid = miniGrid()
    // remove old day cells (keep headings)
    grid.querySelectorAll('.day-cell').forEach(n=>n.remove())

    const year = current.getFullYear()
    const month = current.getMonth()
    monthLabel().textContent = current.toLocaleString('default',{month:'long', year:'numeric'})

    const first = new Date(year, month, 1)
    const startDay = first.getDay()
    const days = new Date(year, month+1, 0).getDate()

    // lead blanks
    for(let i=0;i<startDay;i++){
      const d = document.createElement('div')
      d.className = 'day-cell'
      grid.appendChild(d)
    }

    for(let d=1; d<=days; d++){
      const el = document.createElement('div')
      el.className = 'day-cell'
      el.textContent = d
      const dt = new Date(year, month, d)
      if(dt.toDateString() === new Date().toDateString()) el.classList.add('today')
      if(dt.toDateString() === selectedDate.toDateString()) el.classList.add('selected')
      el.addEventListener('click', ()=>{
        selectedDate = dt
        renderMonth()
      })
      grid.appendChild(el)
    }
  }

  function attachHandlers(){
    document.getElementById('miniPrev').addEventListener('click', ()=>{ current.setMonth(current.getMonth()-1); renderMonth() })
    document.getElementById('miniNext').addEventListener('click', ()=>{ current.setMonth(current.getMonth()+1); renderMonth() })

    document.getElementById('addEventBtn').addEventListener('click', ()=>{
      const p = pop(); p.classList.remove('hidden'); p.setAttribute('aria-hidden','false')
    })
    document.getElementById('popCancel').addEventListener('click', ()=>{
      const p = pop(); p.classList.add('hidden'); p.setAttribute('aria-hidden','true')
    })
    document.getElementById('popSave').addEventListener('click', ()=>{
      const title = document.getElementById('popTitle').value || 'New Event'
      const date = document.getElementById('popDate').value || selectedDate.toISOString().slice(0,10)
      events.push({id:Date.now(),title,date})
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
      const p = pop(); p.classList.add('hidden'); p.setAttribute('aria-hidden','true')
      renderMonth()
    })
  }

  start()
})()
