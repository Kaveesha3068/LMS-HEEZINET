// Assignments & Quizzes Management System

// Global variables
let assignments = [];
let quizzes = [];
let currentTab = 'assignments';
let currentEditId = null;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeAssignments();
    setupEventListeners();
    loadSampleData();
    updateStats();
});

// Sample data for demonstration
function loadSampleData() {
    assignments = [
        {
            id: 1,
            title: "Linear Algebra Problem Set",
            class: "math-101",
            className: "Mathematics 101",
            description: "Solve problems related to linear transformations and vector spaces",
            instructions: "Complete all problems in the attached worksheet. Show all work and calculations.",
            type: "assignment",
            dueDate: "2024-10-25",
            dueTime: "23:59",
            status: "active",
            maxPoints: 100,
            submissionType: "file",
            studentsAssigned: 32,
            submissions: 18,
            availableFrom: null,
            availableUntil: null
        },
        {
            id: 2,
            title: "Chemistry Lab Report",
            class: "science-201",
            className: "Science 201",
            description: "Write a comprehensive lab report on the acid-base titration experiment",
            instructions: "Include hypothesis, methodology, results, and conclusion sections.",
            type: "assignment",
            dueDate: "2024-11-05",
            dueTime: "23:59",
            status: "draft",
            maxPoints: 75,
            submissionType: "both",
            studentsAssigned: 28,
            submissions: 0,
            availableFrom: null,
            availableUntil: null
        }
    ];

    quizzes = [
        {
            id: 1,
            title: "Grammar and Vocabulary Quiz #3",
            class: "english-301",
            className: "English 301",
            description: "Test on advanced grammar rules and vocabulary expansion",
            type: "quiz",
            dueDate: "2024-10-20",
            dueTime: "14:00",
            status: "active",
            timeLimit: 30,
            attempts: 1,
            questionCount: 15,
            shuffleQuestions: true,
            showResults: false,
            studentsAssigned: 25,
            completed: 22,
            averageScore: null,
            availableFrom: null,
            availableUntil: null
        },
        {
            id: 2,
            title: "Calculus Midterm Quiz",
            class: "math-101",
            className: "Mathematics 101",
            description: "Comprehensive quiz covering derivatives and integrals",
            type: "quiz",
            dueDate: "2024-10-15",
            dueTime: "12:00",
            status: "completed",
            timeLimit: 60,
            attempts: 1,
            questionCount: 20,
            shuffleQuestions: false,
            showResults: true,
            studentsAssigned: 32,
            completed: 32,
            averageScore: 78,
            availableFrom: null,
            availableUntil: null
        }
    ];
}

// Initialize the assignments page
function initializeAssignments() {
    // Set default due date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateString = tomorrow.toISOString().split('T')[0];
    document.getElementById('dueDate').value = dateString;
    document.getElementById('dueTime').value = '23:59';

    // Initialize type selection listeners
    const typeRadios = document.querySelectorAll('input[name="contentType"]');
    typeRadios.forEach(radio => {
        radio.addEventListener('change', toggleFormFields);
    });

    // Initialize mobile menu
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', filterContent);

    // Filter functionality
    const classFilter = document.getElementById('classFilter');
    const statusFilter = document.getElementById('statusFilter');
    classFilter.addEventListener('change', filterContent);
    statusFilter.addEventListener('change', filterContent);

    // Modal events
    const createModal = document.getElementById('createModal');
    createModal.addEventListener('hidden.bs.modal', resetForm);
}

// Switch between assignments and quizzes tabs
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName + 'Content').classList.add('active');
    
    // Update modal title
    const modalTitle = document.getElementById('createModalTitle');
    modalTitle.textContent = tabName === 'assignments' ? 'Create New Assignment' : 'Create New Quiz';
    
    // Update form type
    const typeRadio = document.getElementById(tabName === 'assignments' ? 'assignmentType' : 'quizType');
    typeRadio.checked = true;
    toggleFormFields();
    
    // Refresh content
    renderContent();
    updateStats();
}

// Toggle form fields based on content type
function toggleFormFields() {
    const assignmentType = document.getElementById('assignmentType').checked;
    const assignmentFields = document.getElementById('assignmentFields');
    const quizFields = document.getElementById('quizFields');
    
    if (assignmentType) {
        assignmentFields.style.display = 'block';
        quizFields.style.display = 'none';
    } else {
        assignmentFields.style.display = 'none';
        quizFields.style.display = 'block';
    }
}

// Show create modal
function showCreateModal() {
    currentEditId = null;
    resetForm();
    
    // Set type based on current tab
    const typeRadio = document.getElementById(currentTab === 'assignments' ? 'assignmentType' : 'quizType');
    typeRadio.checked = true;
    toggleFormFields();
    
    const modal = new bootstrap.Modal(document.getElementById('createModal'));
    modal.show();
}

// Reset form to initial state
function resetForm() {
    document.getElementById('createForm').reset();
    
    // Reset to default values
    document.getElementById('maxPoints').value = 100;
    document.getElementById('timeLimit').value = 30;
    document.getElementById('attempts').value = 1;
    document.getElementById('questionCount').value = 10;
    document.getElementById('dueTime').value = '23:59';
    
    // Set due date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('dueDate').value = tomorrow.toISOString().split('T')[0];
    
    // Reset type selection
    document.getElementById('assignmentType').checked = true;
    toggleFormFields();
    
    currentEditId = null;
}

// Save content (assignment or quiz)
function saveContent() {
    const form = document.getElementById('createForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const isAssignment = document.getElementById('assignmentType').checked;
    const data = {
        id: currentEditId || Date.now(),
        title: document.getElementById('title').value,
        class: document.getElementById('class').value,
        className: getClassName(document.getElementById('class').value),
        description: document.getElementById('description').value,
        type: isAssignment ? 'assignment' : 'quiz',
        dueDate: document.getElementById('dueDate').value,
        dueTime: document.getElementById('dueTime').value,
        status: document.querySelector('input[name="status"]:checked').value,
        availableFrom: document.getElementById('availableFrom').value || null,
        availableUntil: document.getElementById('availableUntil').value || null
    };

    if (isAssignment) {
        data.instructions = document.getElementById('instructions').value;
        data.maxPoints = parseInt(document.getElementById('maxPoints').value);
        data.submissionType = document.getElementById('submissionType').value;
        data.studentsAssigned = getStudentCount(data.class);
        data.submissions = 0;
    } else {
        data.timeLimit = parseInt(document.getElementById('timeLimit').value);
        data.attempts = parseInt(document.getElementById('attempts').value);
        data.questionCount = parseInt(document.getElementById('questionCount').value);
        data.shuffleQuestions = document.getElementById('shuffleQuestions').checked;
        data.showResults = document.getElementById('showResults').checked;
        data.studentsAssigned = getStudentCount(data.class);
        data.completed = 0;
        data.averageScore = null;
    }

    if (currentEditId) {
        // Update existing
        if (isAssignment) {
            const index = assignments.findIndex(a => a.id === currentEditId);
            if (index !== -1) assignments[index] = data;
        } else {
            const index = quizzes.findIndex(q => q.id === currentEditId);
            if (index !== -1) quizzes[index] = data;
        }
    } else {
        // Create new
        if (isAssignment) {
            assignments.push(data);
        } else {
            quizzes.push(data);
        }
    }

    // Close modal and refresh
    const modal = bootstrap.Modal.getInstance(document.getElementById('createModal'));
    modal.hide();
    
    renderContent();
    updateStats();
    
    // Show success message
    showToast('Content saved successfully!', 'success');
}

// Get class name from class value
function getClassName(classValue) {
    const classMap = {
        'math-101': 'Mathematics 101',
        'science-201': 'Science 201',
        'english-301': 'English 301'
    };
    return classMap[classValue] || classValue;
}

// Get student count for a class (mock data)
function getStudentCount(classValue) {
    const studentCounts = {
        'math-101': 32,
        'science-201': 28,
        'english-301': 25
    };
    return studentCounts[classValue] || 20;
}

// Filter content based on search and filters
function filterContent() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const classFilter = document.getElementById('classFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    
    const items = currentTab === 'assignments' ? assignments : quizzes;
    
    const filtered = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm) ||
                            item.description.toLowerCase().includes(searchTerm);
        const matchesClass = !classFilter || item.class === classFilter;
        const matchesStatus = !statusFilter || item.status === statusFilter;
        
        return matchesSearch && matchesClass && matchesStatus;
    });
    
    renderFilteredContent(filtered);
}

// Render filtered content
function renderFilteredContent(items) {
    const container = currentTab === 'assignments' ? 
        document.querySelector('#assignmentsContent .assignments-container') :
        document.querySelector('#quizzesContent .assignments-container');
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <span class="material-symbols-outlined">${currentTab === 'assignments' ? 'assignment' : 'quiz'}</span>
                </div>
                <h4>No ${currentTab} found</h4>
                <p>Try adjusting your filters or create a new ${currentTab.slice(0, -1)}.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = items.map(item => 
        currentTab === 'assignments' ? renderAssignmentCard(item) : renderQuizCard(item)
    ).join('');
}

// Render all content
function renderContent() {
    filterContent(); // This will render based on current filters
}

// Render assignment card
function renderAssignmentCard(assignment) {
    const progress = assignment.studentsAssigned > 0 ? 
        Math.round((assignment.submissions / assignment.studentsAssigned) * 100) : 0;
    
    return `
        <div class="assignment-card" data-type="assignment" data-class="${assignment.class}" data-status="${assignment.status}">
            <div class="assignment-header">
                <div class="assignment-title">
                    <h5>${assignment.title}</h5>
                    <span class="class-badge">${assignment.className}</span>
                </div>
                <div class="assignment-actions">
                    <button class="action-btn" onclick="editAssignment(${assignment.id})">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="action-btn" onclick="duplicateAssignment(${assignment.id})">
                        <span class="material-symbols-outlined">content_copy</span>
                    </button>
                    <button class="action-btn delete" onclick="deleteAssignment(${assignment.id})">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
            <div class="assignment-details">
                <div class="detail-item">
                    <span class="material-symbols-outlined">schedule</span>
                    Due: ${formatDate(assignment.dueDate)} at ${formatTime(assignment.dueTime)}
                </div>
                <div class="detail-item">
                    <span class="material-symbols-outlined">groups</span>
                    ${assignment.studentsAssigned} students assigned
                </div>
                <div class="detail-item">
                    <span class="material-symbols-outlined">check_circle</span>
                    ${assignment.submissions} submissions received
                </div>
            </div>
            <div class="assignment-status">
                <span class="status-badge ${assignment.status}">${capitalizeFirst(assignment.status)}</span>
                <span class="progress-text">${assignment.status === 'draft' ? 'Not published' : progress + '% completed'}</span>
            </div>
        </div>
    `;
}

// Render quiz card
function renderQuizCard(quiz) {
    const progress = quiz.studentsAssigned > 0 ? 
        Math.round((quiz.completed / quiz.studentsAssigned) * 100) : 0;
    
    return `
        <div class="assignment-card quiz-card" data-type="quiz" data-class="${quiz.class}" data-status="${quiz.status}">
            <div class="assignment-header">
                <div class="assignment-title">
                    <h5>${quiz.title}</h5>
                    <span class="class-badge">${quiz.className}</span>
                </div>
                <div class="assignment-actions">
                    <button class="action-btn" onclick="editQuiz(${quiz.id})">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="action-btn" onclick="duplicateQuiz(${quiz.id})">
                        <span class="material-symbols-outlined">content_copy</span>
                    </button>
                    <button class="action-btn delete" onclick="deleteQuiz(${quiz.id})">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </div>
            <div class="assignment-details">
                <div class="detail-item">
                    <span class="material-symbols-outlined">schedule</span>
                    ${quiz.status === 'completed' ? 'Completed:' : 'Due:'} ${formatDate(quiz.dueDate)} ${quiz.status !== 'completed' ? 'at ' + formatTime(quiz.dueTime) : ''}
                </div>
                <div class="detail-item">
                    <span class="material-symbols-outlined">quiz</span>
                    ${quiz.questionCount} questions, ${quiz.timeLimit} minutes
                </div>
                <div class="detail-item">
                    <span class="material-symbols-outlined">${quiz.status === 'completed' ? 'grade' : 'groups'}</span>
                    ${quiz.status === 'completed' ? 
                        `Average score: ${quiz.averageScore}%` : 
                        `${quiz.studentsAssigned} students, ${quiz.completed} completed`}
                </div>
            </div>
            <div class="assignment-status">
                <span class="status-badge ${quiz.status}">${capitalizeFirst(quiz.status)}</span>
                <span class="progress-text">${progress}% completed</span>
            </div>
        </div>
    `;
}

// Update statistics
function updateStats() {
    document.getElementById('totalAssignments').textContent = assignments.length;
    document.getElementById('totalQuizzes').textContent = quizzes.length;
    
    const pendingReviews = assignments.reduce((sum, a) => sum + a.submissions, 0);
    document.getElementById('pendingReviews').textContent = pendingReviews;
    
    const activeClasses = new Set([...assignments, ...quizzes].map(item => item.class)).size;
    document.getElementById('activeClasses').textContent = activeClasses;
}

// Edit assignment
function editAssignment(id) {
    const assignment = assignments.find(a => a.id === id);
    if (!assignment) return;
    
    currentEditId = id;
    populateForm(assignment);
    
    const modal = new bootstrap.Modal(document.getElementById('createModal'));
    modal.show();
}

// Edit quiz
function editQuiz(id) {
    const quiz = quizzes.find(q => q.id === id);
    if (!quiz) return;
    
    currentEditId = id;
    populateForm(quiz);
    
    const modal = new bootstrap.Modal(document.getElementById('createModal'));
    modal.show();
}

// Populate form with existing data
function populateForm(data) {
    document.getElementById('title').value = data.title;
    document.getElementById('class').value = data.class;
    document.getElementById('description').value = data.description;
    document.getElementById('dueDate').value = data.dueDate;
    document.getElementById('dueTime').value = data.dueTime;
    
    if (data.availableFrom) document.getElementById('availableFrom').value = data.availableFrom;
    if (data.availableUntil) document.getElementById('availableUntil').value = data.availableUntil;
    
    // Set status
    document.querySelector(`input[name="status"][value="${data.status}"]`).checked = true;
    
    // Set type and populate type-specific fields
    if (data.type === 'assignment') {
        document.getElementById('assignmentType').checked = true;
        document.getElementById('instructions').value = data.instructions || '';
        document.getElementById('maxPoints').value = data.maxPoints || 100;
        document.getElementById('submissionType').value = data.submissionType || 'file';
    } else {
        document.getElementById('quizType').checked = true;
        document.getElementById('timeLimit').value = data.timeLimit || 30;
        document.getElementById('attempts').value = data.attempts || 1;
        document.getElementById('questionCount').value = data.questionCount || 10;
        document.getElementById('shuffleQuestions').checked = data.shuffleQuestions || false;
        document.getElementById('showResults').checked = data.showResults || false;
    }
    
    toggleFormFields();
}

// Duplicate assignment
function duplicateAssignment(id) {
    const assignment = assignments.find(a => a.id === id);
    if (!assignment) return;
    
    const duplicate = {
        ...assignment,
        id: Date.now(),
        title: assignment.title + ' (Copy)',
        status: 'draft',
        submissions: 0
    };
    
    assignments.push(duplicate);
    renderContent();
    updateStats();
    showToast('Assignment duplicated successfully!', 'success');
}

// Duplicate quiz
function duplicateQuiz(id) {
    const quiz = quizzes.find(q => q.id === id);
    if (!quiz) return;
    
    const duplicate = {
        ...quiz,
        id: Date.now(),
        title: quiz.title + ' (Copy)',
        status: 'draft',
        completed: 0,
        averageScore: null
    };
    
    quizzes.push(duplicate);
    renderContent();
    updateStats();
    showToast('Quiz duplicated successfully!', 'success');
}

// Delete assignment
function deleteAssignment(id) {
    if (!confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
        return;
    }
    
    assignments = assignments.filter(a => a.id !== id);
    renderContent();
    updateStats();
    showToast('Assignment deleted successfully!', 'success');
}

// Delete quiz
function deleteQuiz(id) {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
        return;
    }
    
    quizzes = quizzes.filter(q => q.id !== id);
    renderContent();
    updateStats();
    showToast('Quiz deleted successfully!', 'success');
}

// View quiz results
function viewResults(id) {
    // This would typically open a detailed results view
    showToast('Opening results view...', 'info');
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Toast notification system
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 3000);
}

// Add toast styles dynamically
const toastStyles = `
    .toast-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        min-width: 300px;
        border-left: 4px solid #3b82f6;
    }
    
    .toast-success {
        border-left-color: #10b981;
    }
    
    .toast-error {
        border-left-color: #ef4444;
    }
    
    .toast-warning {
        border-left-color: #f59e0b;
    }
    
    .toast-content {
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .toast-message {
        color: #374151;
        font-weight: 500;
    }
    
    .toast-close {
        background: none;
        border: none;
        font-size: 18px;
        color: #9ca3af;
        cursor: pointer;
        padding: 0;
        margin-left: 12px;
    }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);