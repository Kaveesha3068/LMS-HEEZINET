// Student dashboard interactions

document.addEventListener('DOMContentLoaded', () => {
  // populate date
  const todayEl = document.getElementById('today');
  if (todayEl) {
    const d = new Date();
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    todayEl.textContent = d.toLocaleDateString(undefined, opts);
  }

  const sidebar = document.getElementById('sidebar');

  // mobile sidebar toggle: uses CSS class to animate
  const mobileToggle = document.getElementById('mobileToggle');
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar-open');
    });
  }

  // theme toggle with persistence
  const themeToggle = document.getElementById('themeToggle');
  const userTheme = localStorage.getItem('eduportal-theme');
  if (userTheme === 'light') document.documentElement.classList.add('light-mode');

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(document.documentElement.classList.contains('light-mode')));
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.classList.toggle('light-mode');
      themeToggle.setAttribute('aria-pressed', String(isLight));
      localStorage.setItem('eduportal-theme', isLight ? 'light' : 'dark');
      showToast(isLight ? 'Light mode enabled' : 'Dark mode enabled');
    });
  }

  // Notification button (example)
  const notifBtn = document.getElementById('notifBtn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      showToast('You have new notifications');
    });
  }

  // Quick action buttons
  document.querySelectorAll('.quick-actions button, .primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.textContent.trim();
      showToast(`${text} clicked`);
    });
  });

  // Improve search UX
  const search = document.getElementById('globalSearch');
  if (search) {
    search.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') showToast(`Search: ${search.value}`);
    });
  }

  // Close sidebar when clicking outside on small screens
  document.addEventListener('click', (e) => {
    if (!sidebar) return;
    if (sidebar.classList.contains('sidebar-open')) {
      const target = e.target;
      if (!sidebar.contains(target) && !mobileToggle.contains(target)) {
        sidebar.classList.remove('sidebar-open');
      }
    }
  });

  // Toast helper
  function showToast(message, type = 'info') {
    const t = document.createElement('div');
    t.className = `edu-toast edu-toast-${type}`;
    t.textContent = message;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('visible'));
    setTimeout(() => {
      t.classList.remove('visible');
      setTimeout(() => t.remove(), 350);
    }, 3000);
  }

  // expose showToast for other handlers if needed
  window.showToast = (m, t) => showToast(m, t);

});