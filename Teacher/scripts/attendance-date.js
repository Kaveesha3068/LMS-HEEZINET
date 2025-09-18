// Date Display Script for Attendance Page
// Update current date display
function updateCurrentDate() {
    const currentDate = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = formattedDate;
}

// Populate date dropdown based on selected month and year
function populateDateDropdown() {
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const dateSelect = document.getElementById('dateSelect');
    const selectedMonth = parseInt(monthSelect.value);
    const selectedYear = parseInt(yearSelect.value);
    dateSelect.innerHTML = '';
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day;
        const today = new Date();
        if (selectedMonth === today.getMonth() && 
            selectedYear === today.getFullYear() && 
            day === today.getDate()) {
            option.selected = true;
        }
        dateSelect.appendChild(option);
    }
}

// Load attendance for selected date
function loadAttendanceForDate() {
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    const dateSelect = document.getElementById('dateSelect');
    const selectedDate = new Date(
        parseInt(yearSelect.value),
        parseInt(monthSelect.value),
        parseInt(dateSelect.value)
    );
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('currentDate').textContent = formattedDate;
    // Here you would typically load attendance data for the selected date
    console.log('Loading attendance for:', formattedDate);
    // Show toast notification
    showToast('Date Changed', `Attendance loaded for ${formattedDate}`, 'info');
}

// Go to today's date
function goToToday() {
    const today = new Date();
    document.getElementById('monthSelect').value = today.getMonth();
    document.getElementById('yearSelect').value = today.getFullYear();
    populateDateDropdown();
    // Date will be auto-selected in populateDateDropdown
    loadAttendanceForDate();
}

// Show toast notification
function showToast(title, message, type = 'success') {
    const toast = document.getElementById('notificationToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = document.getElementById('toastIcon');
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    switch(type) {
        case 'success':
            toastIcon.textContent = 'check_circle';
            break;
        case 'info':
            toastIcon.textContent = 'info';
            break;
        case 'warning':
            toastIcon.textContent = 'warning';
            break;
        case 'error':
            toastIcon.textContent = 'error';
            break;
    }
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// Initialize date display and controls when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentDate();
    populateDateDropdown();
    setInterval(updateCurrentDate, 60000);
    document.getElementById('monthSelect').addEventListener('change', populateDateDropdown);
    document.getElementById('yearSelect').addEventListener('change', populateDateDropdown);
    document.getElementById('loadAttendanceBtn').addEventListener('click', loadAttendanceForDate);
    document.getElementById('todayBtn').addEventListener('click', goToToday);
});
