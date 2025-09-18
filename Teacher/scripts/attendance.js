/**
 * ===== EduLMS Enhanced Multi-Class Attendance Management System =====
 * Professional JavaScript for attendance tracking with comprehensive features
 * 
 * Features:
 * - Multi-class support with dynamic class management
 * - Daily attendance tracking with monthly storage
 * - QR code and smart card scanning capabilities
 * - Student management with payment tracking
 * - Real-time dashboard statistics
 * - Local storage persistence for offline capability
 * - Responsive design with mobile support
 * - Comprehensive search and filtering
 * 
 * @version 2.0.0
 * @author EduLMS Team
 * @license MIT
 */

// ===== GLOBAL CONFIGURATION =====
const ATTENDANCE_CONFIG = {
    // Storage keys for localStorage
    STORAGE_KEYS: {
        CLASSES: 'eduLMS_classes',
        STUDENTS: 'eduLMS_students',
        ATTENDANCE: 'eduLMS_attendance',
        PAYMENTS: 'eduLMS_payments',
        SETTINGS: 'eduLMS_settings'
    },
    
    // Default avatars for students (placeholder images)
    DEFAULT_AVATARS: [
        '../../frontend/assets/images/student.png',
        '../../frontend/assets/images/instructor.png'
    ],
    
    // Sample QR codes for demonstration
    SAMPLE_QR_CODES: [
        'STU001', 'STU002', 'STU003', 'STU004', 'STU005',
        'STU006', 'STU007', 'STU008', 'STU009', 'STU010',
        'STU011', 'STU012', 'STU013', 'STU014', 'STU015'
    ],
    
    // Sample smart card IDs
    SAMPLE_CARD_IDS: [
        '1234567890', '2345678901', '3456789012', '4567890123', '5678901234',
        '6789012345', '7890123456', '8901234567', '9012345678', '0123456789',
        '1122334455', '2233445566', '3344556677', '4455667788', '5566778899'
    ]
};

// ===== MAIN ATTENDANCE MANAGER CLASS =====
class AttendanceManager {
    constructor() {
        this.currentClass = null;
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        this.isQRScannerActive = false;
        this.isSmartCardActive = false;
        this.searchTerm = '';
        
        // Initialize the application
        this.init();
    }

    /**
     * Initialize the attendance management system
     * Sets up event listeners, loads data, and renders the initial UI
     */
    async init() {
        try {
            console.log('🚀 Initializing EduLMS Attendance Manager...');
            
            // Load initial data or create sample data
            await this.loadOrCreateSampleData();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize mobile menu functionality
            this.setupMobileMenu();
            
            // Set current month/year in selectors
            this.initializeDateSelectors();
            
            // Render initial UI
            this.renderClassTabs();
            this.updateDashboardStats();
            
            // Select first class by default
            const classes = this.getClasses();
            if (classes.length > 0) {
                this.selectClass(classes[0].id);
            }
            
            // Check for preloaded student data
            this.checkForPreloadedData();
            
            console.log('✅ Attendance Manager initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing Attendance Manager:', error);
            this.showNotification('Error initializing system', 'error');
        }
    }

    /**
     * Set up all event listeners for the application
     */
    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Month/Year selectors
        const monthSelect = document.getElementById('monthSelect');
        const yearSelect = document.getElementById('yearSelect');
        
        if (monthSelect) {
            monthSelect.addEventListener('change', (e) => {
                this.currentMonth = parseInt(e.target.value);
                this.refreshCurrentView();
            });
        }
        
        if (yearSelect) {
            yearSelect.addEventListener('change', (e) => {
                this.currentYear = parseInt(e.target.value);
                this.refreshCurrentView();
            });
        }

        // Scanner buttons
        const qrScannerBtn = document.getElementById('qrScannerBtn');
        const smartCardBtn = document.getElementById('smartCardBtn');
        
        if (qrScannerBtn) {
            qrScannerBtn.addEventListener('click', this.toggleQRScanner.bind(this));
        }
        
        if (smartCardBtn) {
            smartCardBtn.addEventListener('click', this.toggleSmartCard.bind(this));
        }

        // Attendance control buttons
        const markAllPresentBtn = document.getElementById('markAllPresentBtn');
        const markAllAbsentBtn = document.getElementById('markAllAbsentBtn');
        const saveAttendanceBtn = document.getElementById('saveAttendanceBtn');
        const addStudentBtn = document.getElementById('addStudentBtn');
        
        if (markAllPresentBtn) {
            markAllPresentBtn.addEventListener('click', () => this.markAllAttendance(true));
        }
        
        if (markAllAbsentBtn) {
            markAllAbsentBtn.addEventListener('click', () => this.markAllAttendance(false));
        }
        
        if (saveAttendanceBtn) {
            saveAttendanceBtn.addEventListener('click', this.saveAttendance.bind(this));
        }
        
        if (addStudentBtn) {
            addStudentBtn.addEventListener('click', this.showAddStudentModal.bind(this));
        }

        // Preload management buttons
        const loadPreloadedBtn = document.getElementById('loadPreloadedBtn');
        const clearPreloadedBtn = document.getElementById('clearPreloadedBtn');
        
        if (loadPreloadedBtn) {
            loadPreloadedBtn.addEventListener('click', this.loadPreloadedStudents.bind(this));
        }
        
        if (clearPreloadedBtn) {
            clearPreloadedBtn.addEventListener('click', this.clearPreloadedStudents.bind(this));
        }

        // Global search
        const globalSearch = document.getElementById('globalSearch');
        if (globalSearch) {
            globalSearch.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.renderStudentList();
            });
        }

        // Hidden card reader input for keyboard emulation
        const cardReaderInput = document.getElementById('cardReaderInput');
        if (cardReaderInput) {
            cardReaderInput.addEventListener('input', this.handleCardReaderInput.bind(this));
            // Keep focus on card reader input when smart card is active
            setInterval(() => {
                if (this.isSmartCardActive && document.activeElement !== cardReaderInput) {
                    cardReaderInput.focus();
                }
            }, 1000);
        }

        // Modal event listeners
        this.setupModalEventListeners();

        // QR Scanner simulation
        const simulateQRBtn = document.getElementById('simulateQRBtn');
        if (simulateQRBtn) {
            simulateQRBtn.addEventListener('click', this.simulateQRScan.bind(this));
        }
    }

    /**
     * Set up modal-specific event listeners
     */
    setupModalEventListeners() {
        // Add Student Modal
        const saveStudentBtn = document.getElementById('saveStudentBtn');
        if (saveStudentBtn) {
            saveStudentBtn.addEventListener('click', this.saveNewStudent.bind(this));
        }

        // Student Details Modal
        const markPaidBtn = document.getElementById('markPaidBtn');
        const markUnpaidBtn = document.getElementById('markUnpaidBtn');
        const saveStudentChangesBtn = document.getElementById('saveStudentChangesBtn');
        const addPaymentBtn = document.getElementById('addPaymentBtn');
        
        if (markPaidBtn) {
            markPaidBtn.addEventListener('click', () => this.updateStudentFeeStatus('paid'));
        }
        
        if (markUnpaidBtn) {
            markUnpaidBtn.addEventListener('click', () => this.updateStudentFeeStatus('unpaid'));
        }
        
        if (saveStudentChangesBtn) {
            saveStudentChangesBtn.addEventListener('click', this.saveStudentChanges.bind(this));
        }
        
        if (addPaymentBtn) {
            addPaymentBtn.addEventListener('click', this.showAddPaymentModal.bind(this));
        }

        // Add Payment Modal
        const savePaymentBtn = document.getElementById('savePaymentBtn');
        if (savePaymentBtn) {
            savePaymentBtn.addEventListener('click', this.saveNewPayment.bind(this));
        }
    }

    /**
     * Set up mobile menu functionality
     */
    setupMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const isClickInsideSidebar = sidebar && sidebar.contains(e.target);
            const isClickOnToggle = e.target.closest('#mobileMenuToggle');
            
            if (!isClickInsideSidebar && !isClickOnToggle && sidebar && sidebar.classList.contains('mobile-show')) {
                sidebar.classList.remove('mobile-show');
            }
        });
    }

    /**
     * Toggle mobile menu visibility
     */
    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('mobile-show');
        }
    }

    /**
     * Initialize date selectors with current month/year
     */
    initializeDateSelectors() {
        const monthSelect = document.getElementById('monthSelect');
        const yearSelect = document.getElementById('yearSelect');
        
        if (monthSelect) {
            monthSelect.value = this.currentMonth;
        }
        
        if (yearSelect) {
            yearSelect.value = this.currentYear;
        }
    }

    /**
     * Load existing data or create sample data for demonstration
     * This method can be easily modified to integrate with backend APIs
     */
    async loadOrCreateSampleData() {
        try {
            // TODO: Replace with actual API calls in production
            // Example: await this.loadFromAPI();
            
            let classes = this.getClasses();
            let students = this.getStudents();
            
            // Create sample data if no data exists
            if (classes.length === 0) {
                console.log('📚 Creating sample class data...');
                this.createSampleClasses();
            }
            
            if (students.length === 0) {
                console.log('👥 Creating sample student data...');
                this.createSampleStudents();
            }
            
            console.log('📊 Sample data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading sample data:', error);
        }
    }

    /**
     * Create sample class data for demonstration
     */
    createSampleClasses() {
        const sampleClasses = [
            {
                id: 'CS101',
                name: 'Computer Science 101',
                description: 'Introduction to Programming',
                instructor: 'Dr. Smith',
                schedule: 'MWF 9:00-10:00 AM',
                room: 'Lab 101',
                color: '#3b82f6' // Blue
            },
            {
                id: 'MATH201',
                name: 'Mathematics 201',
                description: 'Calculus and Analytics',
                instructor: 'Prof. Johnson',
                schedule: 'TTh 2:00-3:30 PM',
                room: 'Room 205',
                color: '#f59e0b' // Orange
            },
            {
                id: 'ENG102',
                name: 'English 102',
                description: 'Academic Writing',
                instructor: 'Dr. Williams',
                schedule: 'MWF 11:00-12:00 PM',
                room: 'Room 301',
                color: '#0891b2' // Teal
            }
        ];
        
        this.saveClasses(sampleClasses);
    }

    /**
     * Create sample student data for demonstration
     */
    createSampleStudents() {
        const sampleStudents = [
            // CS101 Students
            {
                id: 'STU001',
                name: 'Alice Johnson',
                email: 'alice.johnson@email.com',
                phone: '+1234567890',
                classId: 'CS101',
                avatar: ATTENDANCE_CONFIG.DEFAULT_AVATARS[0],
                feeStatus: 'paid',
                enrollmentDate: '2025-08-15'
            },
            {
                id: 'STU002',
                name: 'Bob Smith',
                email: 'bob.smith@email.com',
                phone: '+1234567891',
                classId: 'CS101',
                avatar: ATTENDANCE_CONFIG.DEFAULT_AVATARS[1],
                feeStatus: 'unpaid',
                enrollmentDate: '2025-08-16'
            },
            {
                id: 'STU003',
                name: 'Carol Davis',
                email: 'carol.davis@email.com',
                phone: '+1234567892',
                classId: 'CS101',
                avatar: ATTENDANCE_CONFIG.DEFAULT_AVATARS[0],
                feeStatus: 'paid',
                enrollmentDate: '2025-08-17'
            },
            {
                id: 'STU004',
                name: 'David Wilson',
                email: 'david.wilson@email.com',
                phone: '+1234567893',
                classId: 'CS101',
                avatar: ATTENDANCE_CONFIG.DEFAULT_AVATARS[1],
                feeStatus: 'partial',
                enrollmentDate: '2025-08-18'
            },
            {
                id: 'STU005',
                name: 'Eva Brown',
                email: 'eva.brown@email.com',
                phone: '+1234567894',
                classId: 'CS101',
                avatar: ATTENDANCE_CONFIG.DEFAULT_AVATARS[0],
                feeStatus: 'paid',
                enrollmentDate: '2025-08-19'
            },
            
            // MATH201 Students
            {
                id: 'STU006',
                name: 'Frank Miller',
                email: 'frank.miller@email.com',
                phone: '+1234567895',
                classId: 'MATH201',
                avatar: ATTENDANCE_CONFIG.DEFAULT_AVATARS[1],
                feeStatus: 'paid',
                enrollmentDate: '2025-08-15'
            },
            {
                id: 'STU007',
                name: 'Grace Lee',
                email: 'grace.lee@email.com',
                phone: '+1234567896',
                classId: 'MATH201',
                avatar: ATTENDANCE_CONFIG.DEFAULT_AVATARS[0],
                feeStatus: 'unpaid',
                enrollmentDate: '2025-08-16'
            },
            {
                id: 'STU008',
                name: 'Henry Taylor',
                email: 'henry.taylor@email.com',
                phone: '+1234567897',
                classId: 'MATH201',
                avatar: ATTENDANCE_CONFIG.DEFAULT_AVATARS[1],
                feeStatus: 'paid',
                enrollmentDate: '2025-08-17'
            },
            {
                id: 'STU009',
                name: 'Ivy Garcia',
                email: 'ivy.garcia@email.com',
                phone: '+1234567898',
                classId: 'MATH201',
                avatar: ATTENDANCE_CONFIG.DEFAULT_AVATARS[0],
                feeStatus: 'partial',
                enrollmentDate: '2025-08-18'
            },
            {
                id: 'STU010',
                name: 'Jack Rodriguez',
                email: 'jack.rodriguez@email.com',
                phone: '+1234567899',
                classId: 'MATH201',
                avatar: ATTENDANCE_CONFIG.DEFAULT_AVATARS[1],
                feeStatus: 'paid',
                enrollmentDate: '2025-08-19'
            },
            
            // ENG102 Students
            {
                id: 'STU011',
                name: 'Karen Anderson',
                email: 'karen.anderson@email.com',
                phone: '+1234567800',
                classId: 'ENG102',
                avatar: ATTENDANCE_CONFIG.DEFAULT_AVATARS[0],
                feeStatus: 'paid',
                enrollmentDate: '2025-08-15'
            },
            {
                id: 'STU012',
                name: 'Luke Martinez',
                email: 'luke.martinez@email.com',
                phone: '+1234567801',
                classId: 'ENG102',
                avatar: ATTENDANCE_CONFIG.DEFAULT_AVATARS[1],
                feeStatus: 'unpaid',
                enrollmentDate: '2025-08-16'
            },
            {
                id: 'STU013',
                name: 'Maria Gonzalez',
                email: 'maria.gonzalez@email.com',
                phone: '+1234567802',
                classId: 'ENG102',
                avatar: ATTENDANCE_CONFIG.DEFAULT_AVATARS[0],
                feeStatus: 'paid',
                enrollmentDate: '2025-08-17'
            },
            {
                id: 'STU014',
                name: 'Nathan White',
                email: 'nathan.white@email.com',
                phone: '+1234567803',
                classId: 'ENG102',
                avatar: ATTENDANCE_CONFIG.DEFAULT_AVATARS[1],
                feeStatus: 'partial',
                enrollmentDate: '2025-08-18'
            },
            {
                id: 'STU015',
                name: 'Olivia Thompson',
                email: 'olivia.thompson@email.com',
                phone: '+1234567804',
                classId: 'ENG102',
                avatar: ATTENDANCE_CONFIG.DEFAULT_AVATARS[0],
                feeStatus: 'paid',
                enrollmentDate: '2025-08-19'
            }
        ];
        
        this.saveStudents(sampleStudents);
        
        // Create sample payment history
        this.createSamplePayments(sampleStudents);
    }

    /**
     * Create sample payment history for students
     */
    createSamplePayments(students) {
        const samplePayments = [];
        
        students.forEach(student => {
            const paymentCount = Math.floor(Math.random() * 3) + 1; // 1-3 payments per student
            
            for (let i = 0; i < paymentCount; i++) {
                const paymentDate = new Date();
                paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 60)); // Random date within last 60 days
                
                samplePayments.push({
                    id: `PAY${Date.now()}_${student.id}_${i}`,
                    studentId: student.id,
                    amount: Math.floor(Math.random() * 500) + 100, // $100-$600
                    date: paymentDate.toISOString().split('T')[0],
                    method: ['cash', 'credit_card', 'bank_transfer', 'online'][Math.floor(Math.random() * 4)],
                    category: ['tuition', 'books', 'lab', 'activities'][Math.floor(Math.random() * 4)],
                    note: `Payment ${i + 1} for ${student.name}`
                });
            }
        });
        
        this.savePayments(samplePayments);
    }

    // ===== DATA MANAGEMENT METHODS =====

    /**
     * Get all classes from localStorage
     * @returns {Array} Array of class objects
     */
    getClasses() {
        try {
            const data = localStorage.getItem(ATTENDANCE_CONFIG.STORAGE_KEYS.CLASSES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading classes:', error);
            return [];
        }
    }

    /**
     * Save classes to localStorage
     * @param {Array} classes - Array of class objects
     */
    saveClasses(classes) {
        try {
            localStorage.setItem(ATTENDANCE_CONFIG.STORAGE_KEYS.CLASSES, JSON.stringify(classes));
        } catch (error) {
            console.error('Error saving classes:', error);
        }
    }

    /**
     * Get all students from localStorage
     * @returns {Array} Array of student objects
     */
    getStudents() {
        try {
            const data = localStorage.getItem(ATTENDANCE_CONFIG.STORAGE_KEYS.STUDENTS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading students:', error);
            return [];
        }
    }

    /**
     * Save students to localStorage
     * @param {Array} students - Array of student objects
     */
    saveStudents(students) {
        try {
            localStorage.setItem(ATTENDANCE_CONFIG.STORAGE_KEYS.STUDENTS, JSON.stringify(students));
        } catch (error) {
            console.error('Error saving students:', error);
        }
    }

    /**
     * Get attendance data from localStorage
     * @returns {Object} Attendance data organized by class, month, year, and date
     */
    getAttendanceData() {
        try {
            const data = localStorage.getItem(ATTENDANCE_CONFIG.STORAGE_KEYS.ATTENDANCE);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error loading attendance data:', error);
            return {};
        }
    }

    /**
     * Save attendance data to localStorage
     * @param {Object} attendanceData - Attendance data object
     */
    saveAttendanceData(attendanceData) {
        try {
            localStorage.setItem(ATTENDANCE_CONFIG.STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceData));
        } catch (error) {
            console.error('Error saving attendance data:', error);
        }
    }

    /**
     * Get payment data from localStorage
     * @returns {Array} Array of payment objects
     */
    getPayments() {
        try {
            const data = localStorage.getItem(ATTENDANCE_CONFIG.STORAGE_KEYS.PAYMENTS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading payments:', error);
            return [];
        }
    }

    /**
     * Save payments to localStorage
     * @param {Array} payments - Array of payment objects
     */
    savePayments(payments) {
        try {
            localStorage.setItem(ATTENDANCE_CONFIG.STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
        } catch (error) {
            console.error('Error saving payments:', error);
        }
    }

    // ===== UI RENDERING METHODS =====

    /**
     * Render class tabs in the UI
     */
    renderClassTabs() {
        const classTabs = document.getElementById('classTabs');
        if (!classTabs) return;
        
        const classes = this.getClasses();
        
        if (classes.length === 0) {
            classTabs.innerHTML = `
                <div class="text-center text-muted p-4">
                    <span class="material-symbols-outlined" style="font-size: 3rem; opacity: 0.5;">school</span>
                    <p class="mt-2">No classes available</p>
                </div>
            `;
            return;
        }
        
        classTabs.innerHTML = classes.map(cls => {
            const studentCount = this.getStudents().filter(s => s.classId === cls.id).length;
            return `
                <div class="class-tab ${this.currentClass === cls.id ? 'active' : ''}" 
                     onclick="attendanceManager.selectClass('${cls.id}')">
                    <span class="material-symbols-outlined">school</span>
                    <span>${cls.name}</span>
                    <span class="badge">${studentCount}</span>
                </div>
            `;
        }).join('');
    }

    /**
     * Render the student list for the current class
     */
    renderStudentList() {
        const studentList = document.getElementById('studentList');
        const studentCount = document.getElementById('studentCount');
        
        if (!studentList || !this.currentClass) {
            if (studentList) {
                studentList.innerHTML = `
                    <div class="empty-state">
                        <span class="material-symbols-outlined">groups</span>
                        <p>Select a class to view students</p>
                    </div>
                `;
            }
            return;
        }
        
        let students = this.getStudents().filter(s => s.classId === this.currentClass);
        
        // Apply search filter
        if (this.searchTerm) {
            students = students.filter(student =>
                student.name.toLowerCase().includes(this.searchTerm) ||
                student.id.toLowerCase().includes(this.searchTerm) ||
                student.email.toLowerCase().includes(this.searchTerm)
            );
        }
        
        // Update student count
        if (studentCount) {
            studentCount.textContent = `${students.length} student${students.length !== 1 ? 's' : ''}`;
        }
        
        if (students.length === 0) {
            studentList.innerHTML = `
                <div class="empty-state">
                    <span class="material-symbols-outlined">groups</span>
                    <p>${this.searchTerm ? 'No students found matching your search' : 'No students in this class'}</p>
                </div>
            `;
            return;
        }
        
        // Get current attendance data
        const attendanceData = this.getAttendanceData();
        const currentKey = `${this.currentClass}_${this.currentYear}_${this.currentMonth}_${this.currentDate}`;
        const todayAttendance = attendanceData[currentKey] || {};
        
        studentList.innerHTML = students.map(student => {
            const isPresent = todayAttendance[student.id] === true;
            const feeStatusClass = student.feeStatus === 'paid' ? 'paid' : 
                                  student.feeStatus === 'partial' ? 'partial' : 'unpaid';
            
            return `
                <div class="student-item" data-student-id="${student.id}">
                    <input type="checkbox" 
                           class="student-checkbox form-check-input" 
                           id="student_${student.id}"
                           ${isPresent ? 'checked' : ''}
                           onchange="attendanceManager.markStudentAttendance('${student.id}', this.checked)">
                    
                    <img src="${student.avatar}" 
                         alt="${student.name}" 
                         class="student-avatar"
                         onerror="this.src='${ATTENDANCE_CONFIG.DEFAULT_AVATARS[0]}'">
                    
                    <div class="student-info">
                        <div class="student-name">${student.name}</div>
                        <div class="student-details">
                            ID: ${student.id} | Email: ${student.email}
                        </div>
                    </div>
                    
                    <div class="student-actions">
                        <span class="fee-status ${feeStatusClass}">
                            ${student.feeStatus.toUpperCase()}
                        </span>
                        <button class="btn btn-sm btn-outline-primary" 
                                onclick="attendanceManager.showStudentDetails('${student.id}')">
                            <span class="material-symbols-outlined">visibility</span>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Update dashboard statistics
     */
    updateDashboardStats() {
        const totalStudents = document.getElementById('totalStudents');
        const presentToday = document.getElementById('presentToday');
        const absentToday = document.getElementById('absentToday');
        const paidStudents = document.getElementById('paidStudents');
        const unpaidStudents = document.getElementById('unpaidStudents');
        
        if (!this.currentClass) {
            // Show global stats if no class selected
            const allStudents = this.getStudents();
            const totalCount = allStudents.length;
            const paidCount = allStudents.filter(s => s.feeStatus === 'paid').length;
            const unpaidCount = allStudents.filter(s => s.feeStatus === 'unpaid').length;
            
            if (totalStudents) totalStudents.textContent = totalCount;
            if (presentToday) presentToday.textContent = '0';
            if (absentToday) absentToday.textContent = '0';
            if (paidStudents) paidStudents.textContent = paidCount;
            if (unpaidStudents) unpaidStudents.textContent = unpaidCount;
            return;
        }
        
        const students = this.getStudents().filter(s => s.classId === this.currentClass);
        const attendanceData = this.getAttendanceData();
        const currentKey = `${this.currentClass}_${this.currentYear}_${this.currentMonth}_${this.currentDate}`;
        const todayAttendance = attendanceData[currentKey] || {};
        
        const totalCount = students.length;
        const presentCount = Object.values(todayAttendance).filter(status => status === true).length;
        const absentCount = totalCount - presentCount;
        const paidCount = students.filter(s => s.feeStatus === 'paid').length;
        const unpaidCount = students.filter(s => s.feeStatus === 'unpaid').length;
        
        if (totalStudents) totalStudents.textContent = totalCount;
        if (presentToday) presentToday.textContent = presentCount;
        if (absentToday) absentToday.textContent = absentCount;
        if (paidStudents) paidStudents.textContent = paidCount;
        if (unpaidStudents) unpaidStudents.textContent = unpaidCount;
    }

    // ===== CLASS MANAGEMENT METHODS =====

    /**
     * Select a class and update the UI
     * @param {string} classId - The ID of the class to select
     */
    selectClass(classId) {
        this.currentClass = classId;
        
        // Update active class tab
        document.querySelectorAll('.class-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[onclick="attendanceManager.selectClass('${classId}')"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Update current class name in dashboard
        const currentClassName = document.getElementById('currentClassName');
        if (currentClassName) {
            const classes = this.getClasses();
            const selectedClass = classes.find(c => c.id === classId);
            currentClassName.textContent = selectedClass ? selectedClass.name : 'Class Dashboard';
        }
        
        // Refresh UI
        this.renderStudentList();
        this.updateDashboardStats();
        
        this.showNotification(`Selected class: ${classId}`, 'info');
    }

    /**
     * Refresh the current view (useful after date changes)
     */
    refreshCurrentView() {
        this.renderStudentList();
        this.updateDashboardStats();
    }

    // ===== ATTENDANCE METHODS =====

    /**
     * Mark attendance for a specific student
     * @param {string} studentId - The ID of the student
     * @param {boolean} isPresent - Whether the student is present
     */
    markStudentAttendance(studentId, isPresent) {
        if (!this.currentClass) {
            this.showNotification('Please select a class first', 'error');
            return;
        }
        
        const attendanceData = this.getAttendanceData();
        const key = `${this.currentClass}_${this.currentYear}_${this.currentMonth}_${this.currentDate}`;
        
        if (!attendanceData[key]) {
            attendanceData[key] = {};
        }
        
        attendanceData[key][studentId] = isPresent;
        this.saveAttendanceData(attendanceData);
        
        // Update dashboard stats
        this.updateDashboardStats();
        
        const student = this.getStudents().find(s => s.id === studentId);
        const studentName = student ? student.name : studentId;
        this.showNotification(
            `${studentName} marked as ${isPresent ? 'present' : 'absent'}`, 
            isPresent ? 'success' : 'warning'
        );
    }

    /**
     * Mark all students as present or absent
     * @param {boolean} isPresent - Whether to mark all as present (true) or absent (false)
     */
    markAllAttendance(isPresent) {
        if (!this.currentClass) {
            this.showNotification('Please select a class first', 'error');
            return;
        }
        
        const students = this.getStudents().filter(s => s.classId === this.currentClass);
        const attendanceData = this.getAttendanceData();
        const key = `${this.currentClass}_${this.currentYear}_${this.currentMonth}_${this.currentDate}`;
        
        if (!attendanceData[key]) {
            attendanceData[key] = {};
        }
        
        students.forEach(student => {
            attendanceData[key][student.id] = isPresent;
        });
        
        this.saveAttendanceData(attendanceData);
        
        // Update UI
        this.renderStudentList();
        this.updateDashboardStats();
        
        this.showNotification(
            `All students marked as ${isPresent ? 'present' : 'absent'}`, 
            isPresent ? 'success' : 'warning'
        );
    }

    /**
     * Save current attendance (manual save trigger)
     */
    saveAttendance() {
        if (!this.currentClass) {
            this.showNotification('Please select a class first', 'error');
            return;
        }
        
        // Attendance is automatically saved, but this provides user feedback
        this.showNotification('Attendance saved successfully', 'success');
    }

    // ===== SCANNER METHODS =====

    /**
     * Toggle QR scanner on/off
     */
    toggleQRScanner() {
        this.isQRScannerActive = !this.isQRScannerActive;
        
        const qrScannerBtn = document.getElementById('qrScannerBtn');
        const scannerStatus = document.getElementById('scannerStatus');
        
        if (this.isQRScannerActive) {
            if (qrScannerBtn) {
                qrScannerBtn.classList.remove('btn-outline-primary');
                qrScannerBtn.classList.add('btn-primary');
            }
            if (scannerStatus) {
                scannerStatus.textContent = 'QR Scanner active - Ready to scan...';
            }
            this.showNotification('QR Scanner activated', 'info');
            
            // Show QR Scanner Modal
            const qrScannerModal = new bootstrap.Modal(document.getElementById('qrScannerModal'));
            qrScannerModal.show();
        } else {
            if (qrScannerBtn) {
                qrScannerBtn.classList.remove('btn-primary');
                qrScannerBtn.classList.add('btn-outline-primary');
            }
            if (scannerStatus) {
                scannerStatus.textContent = 'QR Scanner deactivated';
            }
            this.showNotification('QR Scanner deactivated', 'info');
        }
    }

    /**
     * Toggle smart card scanner on/off
     */
    toggleSmartCard() {
        this.isSmartCardActive = !this.isSmartCardActive;
        
        const smartCardBtn = document.getElementById('smartCardBtn');
        const scannerStatus = document.getElementById('scannerStatus');
        const cardReaderInput = document.getElementById('cardReaderInput');
        
        if (this.isSmartCardActive) {
            if (smartCardBtn) {
                smartCardBtn.classList.remove('btn-outline-success');
                smartCardBtn.classList.add('btn-success');
            }
            if (scannerStatus) {
                scannerStatus.textContent = 'Smart Card reader active - Please scan card...';
            }
            if (cardReaderInput) {
                cardReaderInput.focus();
            }
            this.showNotification('Smart Card reader activated', 'info');
        } else {
            if (smartCardBtn) {
                smartCardBtn.classList.remove('btn-success');
                smartCardBtn.classList.add('btn-outline-success');
            }
            if (scannerStatus) {
                scannerStatus.textContent = 'Smart Card reader deactivated';
            }
            this.showNotification('Smart Card reader deactivated', 'info');
        }
    }

    /**
     * Simulate QR code scanning (for demonstration)
     */
    simulateQRScan() {
        const randomQR = ATTENDANCE_CONFIG.SAMPLE_QR_CODES[
            Math.floor(Math.random() * ATTENDANCE_CONFIG.SAMPLE_QR_CODES.length)
        ];
        
        this.processQRScan(randomQR);
    }

    /**
     * Process a QR code scan result
     * @param {string} qrData - The scanned QR code data
     */
    processQRScan(qrData) {
        const scanResults = document.getElementById('scanResults');
        const scanResultText = document.getElementById('scanResultText');
        
        if (scanResults && scanResultText) {
            scanResultText.textContent = qrData;
            scanResults.style.display = 'block';
        }
        
        // Find student by QR code (assuming QR contains student ID)
        const student = this.getStudents().find(s => s.id === qrData);
        
        if (student && student.classId === this.currentClass) {
            // Mark student as present
            this.markStudentAttendance(student.id, true);
            
            // Update checkbox in UI
            const checkbox = document.getElementById(`student_${student.id}`);
            if (checkbox) {
                checkbox.checked = true;
            }
            
            this.showNotification(`QR Scan: ${student.name} marked present`, 'success');
        } else if (student) {
            this.showNotification(`Student ${student.name} is not in the current class`, 'warning');
        } else {
            this.showNotification(`Unknown QR code: ${qrData}`, 'error');
        }
    }

    /**
     * Handle smart card input (keyboard emulation)
     * @param {Event} event - The input event
     */
    handleCardReaderInput(event) {
        if (!this.isSmartCardActive) return;
        
        const cardData = event.target.value.trim();
        
        if (cardData.length >= 10) { // Assuming card IDs are at least 10 characters
            // Find student by card ID (you might need to add cardId field to student objects)
            const student = this.getStudents().find(s => 
                ATTENDANCE_CONFIG.SAMPLE_CARD_IDS.includes(cardData) && s.classId === this.currentClass
            );
            
            if (student) {
                // Mark student as present
                this.markStudentAttendance(student.id, true);
                
                // Update checkbox in UI
                const checkbox = document.getElementById(`student_${student.id}`);
                if (checkbox) {
                    checkbox.checked = true;
                }
                
                this.showNotification(`Card Scan: ${student.name} marked present`, 'success');
            } else {
                this.showNotification(`Unknown card ID: ${cardData}`, 'error');
            }
            
            // Clear input for next scan
            event.target.value = '';
        }
    }

    // ===== STUDENT MANAGEMENT METHODS =====

    /**
     * Show the add student modal
     */
    showAddStudentModal() {
        const modal = new bootstrap.Modal(document.getElementById('addStudentModal'));
        
        // Set current class as default
        const studentClassSelect = document.getElementById('studentClass');
        if (studentClassSelect && this.currentClass) {
            studentClassSelect.value = this.currentClass;
        }
        
        modal.show();
    }

    /**
     * Save a new student
     */
    saveNewStudent() {
        const name = document.getElementById('studentName').value.trim();
        const id = document.getElementById('studentId').value.trim();
        const email = document.getElementById('studentEmail').value.trim();
        const classId = document.getElementById('studentClass').value;
        const phone = document.getElementById('studentPhone').value.trim();
        
        if (!name || !id || !email || !classId) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Check if student ID already exists
        const existingStudent = this.getStudents().find(s => s.id === id);
        if (existingStudent) {
            this.showNotification('Student ID already exists', 'error');
            return;
        }
        
        const newStudent = {
            id: id,
            name: name,
            email: email,
            phone: phone,
            classId: classId,
            avatar: ATTENDANCE_CONFIG.DEFAULT_AVATARS[Math.floor(Math.random() * ATTENDANCE_CONFIG.DEFAULT_AVATARS.length)],
            feeStatus: 'unpaid',
            enrollmentDate: new Date().toISOString().split('T')[0]
        };
        
        const students = this.getStudents();
        students.push(newStudent);
        this.saveStudents(students);
        
        // Close modal and refresh UI
        const modal = bootstrap.Modal.getInstance(document.getElementById('addStudentModal'));
        modal.hide();
        
        // Clear form
        document.getElementById('addStudentForm').reset();
        
        // Refresh UI if the new student is in the current class
        if (classId === this.currentClass) {
            this.renderStudentList();
            this.updateDashboardStats();
        }
        
        this.showNotification(`Student ${name} added successfully`, 'success');
    }

    /**
     * Show student details modal
     * @param {string} studentId - The ID of the student
     */
    showStudentDetails(studentId) {
        const student = this.getStudents().find(s => s.id === studentId);
        if (!student) {
            this.showNotification('Student not found', 'error');
            return;
        }
        
        // Populate modal with student data
        document.getElementById('modalStudentName').textContent = student.name;
        document.getElementById('modalStudentId').textContent = student.id;
        document.getElementById('modalStudentClass').textContent = student.classId;
        document.getElementById('modalStudentEmail').textContent = student.email;
        
        const modalStudentAvatar = document.getElementById('modalStudentAvatar');
        if (modalStudentAvatar) {
            modalStudentAvatar.src = student.avatar;
            modalStudentAvatar.onerror = () => {
                modalStudentAvatar.src = ATTENDANCE_CONFIG.DEFAULT_AVATARS[0];
            };
        }
        
        // Update fee status badge
        const modalFeeStatus = document.getElementById('modalFeeStatus');
        if (modalFeeStatus) {
            modalFeeStatus.textContent = student.feeStatus.toUpperCase();
            modalFeeStatus.className = `badge bg-${student.feeStatus === 'paid' ? 'success' : 
                                                   student.feeStatus === 'partial' ? 'warning' : 'danger'}`;
        }
        
        // Calculate attendance summary
        this.updateAttendanceSummary(studentId);
        
        // Load payment history
        this.loadPaymentHistory(studentId);
        
        // Store current student ID for modal actions
        this.currentModalStudentId = studentId;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('studentModal'));
        modal.show();
    }

    /**
     * Update attendance summary in student modal
     * @param {string} studentId - The ID of the student
     */
    updateAttendanceSummary(studentId) {
        const attendanceData = this.getAttendanceData();
        let presentDays = 0;
        let totalDays = 0;
        
        // Count attendance for current month
        Object.keys(attendanceData).forEach(key => {
            if (key.startsWith(`${this.currentClass}_${this.currentYear}_${this.currentMonth}_`)) {
                totalDays++;
                if (attendanceData[key][studentId] === true) {
                    presentDays++;
                }
            }
        });
        
        const absentDays = totalDays - presentDays;
        const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
        
        document.getElementById('modalPresentDays').textContent = presentDays;
        document.getElementById('modalAbsentDays').textContent = absentDays;
        document.getElementById('modalTotalDays').textContent = totalDays;
        document.getElementById('modalAttendanceRate').textContent = `${attendanceRate}%`;
    }

    /**
     * Load payment history for a student
     * @param {string} studentId - The ID of the student
     */
    loadPaymentHistory(studentId) {
        const payments = this.getPayments().filter(p => p.studentId === studentId);
        const paymentHistory = document.getElementById('paymentHistory');
        
        if (!paymentHistory) return;
        
        if (payments.length === 0) {
            paymentHistory.innerHTML = `
                <div class="text-center text-muted p-4">
                    <span class="material-symbols-outlined" style="font-size: 2rem; opacity: 0.5;">payment</span>
                    <p class="mt-2">No payment history</p>
                </div>
            `;
            return;
        }
        
        // Sort payments by date (newest first)
        payments.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        paymentHistory.innerHTML = payments.map(payment => `
            <div class="payment-item">
                <div class="payment-details">
                    <div class="payment-amount">$${payment.amount}</div>
                    <div class="payment-date">${new Date(payment.date).toLocaleDateString()} - ${payment.category} (${payment.method})</div>
                    ${payment.note ? `<div class="payment-note">${payment.note}</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    /**
     * Update student fee status
     * @param {string} status - The new fee status ('paid' or 'unpaid')
     */
    updateStudentFeeStatus(status) {
        if (!this.currentModalStudentId) return;
        
        const students = this.getStudents();
        const studentIndex = students.findIndex(s => s.id === this.currentModalStudentId);
        
        if (studentIndex === -1) {
            this.showNotification('Student not found', 'error');
            return;
        }
        
        students[studentIndex].feeStatus = status;
        this.saveStudents(students);
        
        // Update modal display
        const modalFeeStatus = document.getElementById('modalFeeStatus');
        if (modalFeeStatus) {
            modalFeeStatus.textContent = status.toUpperCase();
            modalFeeStatus.className = `badge bg-${status === 'paid' ? 'success' : 'danger'}`;
        }
        
        // Refresh UI
        this.renderStudentList();
        this.updateDashboardStats();
        
        const student = students[studentIndex];
        this.showNotification(`${student.name} marked as ${status}`, status === 'paid' ? 'success' : 'warning');
    }

    /**
     * Save student changes (placeholder for future enhancements)
     */
    saveStudentChanges() {
        if (!this.currentModalStudentId) return;
        
        this.showNotification('Student changes saved', 'success');
    }

    // ===== PAYMENT METHODS =====

    /**
     * Show the add payment modal
     */
    showAddPaymentModal() {
        const modal = new bootstrap.Modal(document.getElementById('addPaymentModal'));
        
        // Set current date as default
        const paymentDate = document.getElementById('paymentDate');
        if (paymentDate) {
            paymentDate.value = new Date().toISOString().split('T')[0];
        }
        
        modal.show();
    }

    /**
     * Save a new payment
     */
    saveNewPayment() {
        if (!this.currentModalStudentId) {
            this.showNotification('No student selected', 'error');
            return;
        }
        
        const amount = parseFloat(document.getElementById('paymentAmount').value);
        const date = document.getElementById('paymentDate').value;
        const method = document.getElementById('paymentMethod').value;
        const category = document.getElementById('paymentCategory').value;
        const note = document.getElementById('paymentNote').value.trim();
        
        if (!amount || !date || !method || !category) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        const newPayment = {
            id: `PAY${Date.now()}_${this.currentModalStudentId}`,
            studentId: this.currentModalStudentId,
            amount: amount,
            date: date,
            method: method,
            category: category,
            note: note
        };
        
        const payments = this.getPayments();
        payments.push(newPayment);
        this.savePayments(payments);
        
        // Close modal and refresh payment history
        const modal = bootstrap.Modal.getInstance(document.getElementById('addPaymentModal'));
        modal.hide();
        
        // Clear form
        document.getElementById('addPaymentForm').reset();
        
        // Refresh payment history in student modal
        this.loadPaymentHistory(this.currentModalStudentId);
        
        this.showNotification(`Payment of $${amount} added successfully`, 'success');
    }

    // ===== UTILITY METHODS =====

    /**
     * Show a toast notification
     * @param {string} message - The notification message
     * @param {string} type - The notification type ('success', 'error', 'warning', 'info')
     */
    showNotification(message, type = 'info') {
        const toast = document.getElementById('notificationToast');
        const toastIcon = document.getElementById('toastIcon');
        const toastTitle = document.getElementById('toastTitle');
        const toastMessage = document.getElementById('toastMessage');
        const toastTime = document.getElementById('toastTime');
        
        if (!toast) return;
        
        // Set icon and title based on type
        const icons = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };
        
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Info'
        };
        
        const colors = {
            success: 'text-success',
            error: 'text-danger',
            warning: 'text-warning',
            info: 'text-primary'
        };
        
        if (toastIcon) {
            toastIcon.textContent = icons[type] || icons.info;
            toastIcon.className = `material-symbols-outlined toast-icon ${colors[type] || colors.info}`;
        }
        
        if (toastTitle) {
            toastTitle.textContent = titles[type] || titles.info;
        }
        
        if (toastMessage) {
            toastMessage.textContent = message;
        }
        
        if (toastTime) {
            toastTime.textContent = new Date().toLocaleTimeString();
        }
        
        // Show toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }

    /**
     * Export attendance data (for future backend integration)
     * @returns {Object} All attendance data
     */
    exportData() {
        return {
            classes: this.getClasses(),
            students: this.getStudents(),
            attendance: this.getAttendanceData(),
            payments: this.getPayments(),
            exported: new Date().toISOString()
        };
    }

    /**
     * Clear all data (for testing purposes)
     */
    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            localStorage.removeItem(ATTENDANCE_CONFIG.STORAGE_KEYS.CLASSES);
            localStorage.removeItem(ATTENDANCE_CONFIG.STORAGE_KEYS.STUDENTS);
            localStorage.removeItem(ATTENDANCE_CONFIG.STORAGE_KEYS.ATTENDANCE);
            localStorage.removeItem(ATTENDANCE_CONFIG.STORAGE_KEYS.PAYMENTS);
            
            location.reload();
        }
    }

    // ===== PRELOAD FUNCTIONALITY =====

    /**
     * Load preloaded students from sessionStorage
     */
    loadPreloadedStudents() {
        try {
            const preloadedStudents = sessionStorage.getItem('preloadedStudents');
            const preloadedClass = sessionStorage.getItem('preloadedClass');

            if (!preloadedStudents || !preloadedClass) {
                this.showToast('No preloaded students found. Please use the preload page first.', 'warning');
                return;
            }

            const students = JSON.parse(preloadedStudents);
            
            // Check if class exists, if not create it
            let classes = this.getClasses();
            let targetClass = classes.find(cls => cls.id === preloadedClass);
            
            if (!targetClass) {
                // Create the class if it doesn't exist
                targetClass = {
                    id: preloadedClass,
                    name: this.getClassDisplayName(preloadedClass),
                    description: `Auto-created class for ${preloadedClass}`,
                    instructor: 'Admin User',
                    schedule: 'TBD',
                    isActive: true
                };
                classes.push(targetClass);
                this.saveClasses(classes);
            }

            // Process and add students
            let existingStudents = this.getStudents();
            let addedCount = 0;
            let updatedCount = 0;

            students.forEach(preloadedStudent => {
                const existingStudent = existingStudents.find(s => 
                    s.id === preloadedStudent.id || s.email === preloadedStudent.email
                );

                if (existingStudent) {
                    // Update existing student's class if different
                    if (existingStudent.classId !== preloadedClass) {
                        existingStudent.classId = preloadedClass;
                        updatedCount++;
                    }
                } else {
                    // Add new student
                    const newStudent = {
                        id: preloadedStudent.id,
                        name: preloadedStudent.name,
                        email: preloadedStudent.email,
                        phone: preloadedStudent.phone || '+1234567890',
                        classId: preloadedClass,
                        avatar: ATTENDANCE_CONFIG.DEFAULT_AVATARS[Math.floor(Math.random() * ATTENDANCE_CONFIG.DEFAULT_AVATARS.length)],
                        feeStatus: preloadedStudent.status === 'Active' ? 'paid' : 'unpaid',
                        enrollmentDate: new Date().toISOString().split('T')[0]
                    };
                    existingStudents.push(newStudent);
                    addedCount++;
                }
            });

            // Save updated students
            this.saveStudents(existingStudents);

            // Switch to the preloaded class
            this.selectClass(preloadedClass);

            // Update preload status display
            this.updatePreloadStatus(preloadedClass, students.length);

            // Show success message
            const message = `Successfully loaded ${students.length} students from ${preloadedClass}. Added: ${addedCount}, Updated: ${updatedCount}`;
            this.showToast(message, 'success');

        } catch (error) {
            console.error('Error loading preloaded students:', error);
            this.showToast('Error loading preloaded students', 'error');
        }
    }

    /**
     * Clear preloaded students from sessionStorage
     */
    clearPreloadedStudents() {
        try {
            sessionStorage.removeItem('preloadedStudents');
            sessionStorage.removeItem('preloadedClass');
            
            // Hide preload status
            const preloadStatus = document.getElementById('preloadStatus');
            if (preloadStatus) {
                preloadStatus.style.display = 'none';
            }

            this.showToast('Cleared preloaded student data', 'success');
        } catch (error) {
            console.error('Error clearing preloaded students:', error);
            this.showToast('Error clearing preloaded data', 'error');
        }
    }

    /**
     * Update preload status display
     */
    updatePreloadStatus(className, studentCount) {
        const preloadStatus = document.getElementById('preloadStatus');
        const preloadStatusText = document.getElementById('preloadStatusText');
        
        if (preloadStatus && preloadStatusText) {
            preloadStatusText.textContent = `${studentCount} students preloaded from ${className}`;
            preloadStatus.style.display = 'block';
        }
    }

    /**
     * Get display name for class code
     */
    getClassDisplayName(classCode) {
        const classNames = {
            'CS101': 'Computer Science 101',
            'MATH201': 'Mathematics 201',
            'ENG102': 'English 102',
            'PHY301': 'Physics 301',
            'HIST150': 'History 150',
            'ART200': 'Art 200',
            'BIO250': 'Biology 250',
            'CHEM180': 'Chemistry 180'
        };
        return classNames[classCode] || classCode;
    }

    /**
     * Check for preloaded data on page load
     */
    checkForPreloadedData() {
        const preloadedStudents = sessionStorage.getItem('preloadedStudents');
        const preloadedClass = sessionStorage.getItem('preloadedClass');

        if (preloadedStudents && preloadedClass) {
            try {
                const students = JSON.parse(preloadedStudents);
                this.updatePreloadStatus(preloadedClass, students.length);
            } catch (error) {
                console.error('Error checking preloaded data:', error);
            }
        }
    }

    // ===== ATTENDANCE REPORTS FUNCTIONALITY =====

    /**
     * Initialize attendance reports functionality
     */
    initializeReports() {
        this.setupReportEventListeners();
        this.populateReportClassSelectors();
    }

    /**
     * Set up event listeners for report functionality
     */
    setupReportEventListeners() {
        // Daily report
        const generateDailyReportBtn = document.getElementById('generateDailyReportBtn');
        const downloadDailyReportBtn = document.getElementById('downloadDailyReportBtn');
        
        if (generateDailyReportBtn) {
            generateDailyReportBtn.addEventListener('click', () => this.generateDailyReport());
        }
        
        if (downloadDailyReportBtn) {
            downloadDailyReportBtn.addEventListener('click', () => this.downloadDailyReport());
        }
        
        // Monthly report
        const generateMonthlyReportBtn = document.getElementById('generateMonthlyReportBtn');
        const downloadMonthlyReportBtn = document.getElementById('downloadMonthlyReportBtn');
        
        if (generateMonthlyReportBtn) {
            generateMonthlyReportBtn.addEventListener('click', () => this.generateMonthlyReport());
        }
        
        if (downloadMonthlyReportBtn) {
            downloadMonthlyReportBtn.addEventListener('click', () => this.downloadMonthlyReport());
        }
    }

    /**
     * Populate class selectors in report sections
     */
    populateReportClassSelectors() {
        const dailyClassSelect = document.getElementById('dailyReportClass');
        const monthlyClassSelect = document.getElementById('monthlyReportClass');
        
        const classes = this.getClasses();
        
        // Clear existing options except "All Classes"
        [dailyClassSelect, monthlyClassSelect].forEach(select => {
            if (select) {
                const allClassesOption = select.querySelector('option[value=""]');
                select.innerHTML = '';
                if (allClassesOption) {
                    select.appendChild(allClassesOption);
                }
            }
        });
        
        // Add class options
        classes.forEach(classItem => {
            const option = document.createElement('option');
            option.value = classItem.id;
            option.textContent = classItem.name;
            
            if (dailyClassSelect) dailyClassSelect.appendChild(option.cloneNode(true));
            if (monthlyClassSelect) monthlyClassSelect.appendChild(option);
        });
    }

    /**
     * Generate daily attendance report
     */
    generateDailyReport() {
        const dateInput = document.getElementById('dailyReportDate');
        const classSelect = document.getElementById('dailyReportClass');
        const contentDiv = document.getElementById('dailyReportContent');
        const downloadBtn = document.getElementById('downloadDailyReportBtn');
        
        if (!dateInput || !contentDiv) return;
        
        const selectedDate = new Date(dateInput.value);
        const selectedClass = classSelect ? classSelect.value : '';
        
        if (!selectedDate || isNaN(selectedDate.getTime())) {
            this.showNotification('Please select a valid date', 'error');
            return;
        }
        
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const date = selectedDate.getDate();
        
        // Get attendance data
        const attendanceData = this.getAttendanceData();
        const students = this.getStudents();
        
        // Filter students by class if specified
        const filteredStudents = selectedClass ? 
            students.filter(student => student.classId === selectedClass) : 
            students;
        
        // Generate report data
        const reportData = [];
        let presentCount = 0;
        let absentCount = 0;
        
        filteredStudents.forEach(student => {
            const key = `${student.classId}_${year}_${month}_${date}`;
            const attendance = attendanceData[key] && attendanceData[key][student.id];
            
            let status = 'Not Recorded';
            if (attendance === true) {
                status = 'Present';
                presentCount++;
            } else if (attendance === false) {
                status = 'Absent';
                absentCount++;
            }
            
            reportData.push({
                studentId: student.id,
                studentName: student.name,
                className: this.getClassName(student.classId),
                status: status,
                date: selectedDate.toLocaleDateString()
            });
        });
        
        // Store report data for download
        this.dailyReportData = {
            date: selectedDate.toLocaleDateString(),
            class: selectedClass ? this.getClassName(selectedClass) : 'All Classes',
            data: reportData,
            summary: {
                total: reportData.length,
                present: presentCount,
                absent: absentCount,
                attendanceRate: reportData.length > 0 ? ((presentCount / reportData.length) * 100).toFixed(1) : 0
            }
        };
        
        // Render report
        this.renderDailyReport(contentDiv);
        
        // Enable download button
        if (downloadBtn) {
            downloadBtn.disabled = false;
        }
        
        this.showNotification('Daily report generated successfully', 'success');
    }

    /**
     * Render daily report in the content area
     */
    renderDailyReport(container) {
        if (!this.dailyReportData) return;
        
        const { data, summary, date, class: className } = this.dailyReportData;
        
        container.innerHTML = `
            <div class="report-summary">
                <div class="summary-card">
                    <div class="summary-value">${summary.total}</div>
                    <div class="summary-label">Total Students</div>
                </div>
                <div class="summary-card">
                    <div class="summary-value">${summary.present}</div>
                    <div class="summary-label">Present</div>
                </div>
                <div class="summary-card">
                    <div class="summary-value">${summary.absent}</div>
                    <div class="summary-label">Absent</div>
                </div>
                <div class="summary-card">
                    <div class="summary-value">${summary.attendanceRate}%</div>
                    <div class="summary-label">Attendance Rate</div>
                </div>
            </div>
            
            <h6 class="mt-4 mb-3">Daily Attendance Report - ${date} (${className})</h6>
            
            <div class="table-responsive">
                <table class="attendance-report-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Class</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(row => `
                            <tr>
                                <td>${row.studentId}</td>
                                <td>
                                    <div class="student-name">${row.studentName}</div>
                                </td>
                                <td>${row.className}</td>
                                <td>
                                    <span class="status-${row.status.toLowerCase().replace(' ', '-')}">${row.status}</span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    /**
     * Generate monthly attendance report
     */
    generateMonthlyReport() {
        const monthSelect = document.getElementById('monthlyReportMonth');
        const yearSelect = document.getElementById('monthlyReportYear');
        const classSelect = document.getElementById('monthlyReportClass');
        const contentDiv = document.getElementById('monthlyReportContent');
        const downloadBtn = document.getElementById('downloadMonthlyReportBtn');
        
        if (!monthSelect || !yearSelect || !contentDiv) return;
        
        const selectedMonth = parseInt(monthSelect.value);
        const selectedYear = parseInt(yearSelect.value);
        const selectedClass = classSelect ? classSelect.value : '';
        
        // Get attendance data
        const attendanceData = this.getAttendanceData();
        const students = this.getStudents();
        
        // Filter students by class if specified
        const filteredStudents = selectedClass ? 
            students.filter(student => student.classId === selectedClass) : 
            students;
        
        // Get days in month
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        
        // Generate monthly report data
        const reportData = [];
        const calendarData = [];
        
        // Initialize calendar data
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(selectedYear, selectedMonth, day);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            calendarData.push({
                day: day,
                dayName: dayName,
                date: date,
                hasAttendance: false,
                attendanceCount: 0
            });
        }
        
        filteredStudents.forEach(student => {
            let monthlyPresent = 0;
            let monthlyAbsent = 0;
            let monthlyNotRecorded = 0;
            
            const dailyAttendance = [];
            
            for (let day = 1; day <= daysInMonth; day++) {
                const key = `${student.classId}_${selectedYear}_${selectedMonth}_${day}`;
                const attendance = attendanceData[key] && attendanceData[key][student.id];
                
                let status = 'Not Recorded';
                if (attendance === true) {
                    status = 'Present';
                    monthlyPresent++;
                    calendarData[day - 1].attendanceCount++;
                    calendarData[day - 1].hasAttendance = true;
                } else if (attendance === false) {
                    status = 'Absent';
                    monthlyAbsent++;
                } else {
                    monthlyNotRecorded++;
                }
                
                dailyAttendance.push(status);
            }
            
            const totalDays = monthlyPresent + monthlyAbsent;
            const attendanceRate = totalDays > 0 ? ((monthlyPresent / totalDays) * 100).toFixed(1) : 0;
            
            reportData.push({
                studentId: student.id,
                studentName: student.name,
                className: this.getClassName(student.classId),
                present: monthlyPresent,
                absent: monthlyAbsent,
                notRecorded: monthlyNotRecorded,
                attendanceRate: attendanceRate,
                dailyAttendance: dailyAttendance
            });
        });
        
        // Store report data for download
        this.monthlyReportData = {
            month: new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            class: selectedClass ? this.getClassName(selectedClass) : 'All Classes',
            data: reportData,
            calendarData: calendarData,
            summary: {
                totalStudents: reportData.length,
                averageAttendance: reportData.length > 0 ? 
                    (reportData.reduce((sum, student) => sum + parseFloat(student.attendanceRate), 0) / reportData.length).toFixed(1) : 0
            }
        };
        
        // Render report
        this.renderMonthlyReport(contentDiv);
        
        // Enable download button
        if (downloadBtn) {
            downloadBtn.disabled = false;
        }
        
        this.showNotification('Monthly report generated successfully', 'success');
    }

    /**
     * Render monthly report in the content area
     */
    renderMonthlyReport(container) {
        if (!this.monthlyReportData) return;
        
        const { data, calendarData, summary, month, class: className } = this.monthlyReportData;
        
        container.innerHTML = `
            <div class="report-summary">
                <div class="summary-card">
                    <div class="summary-value">${summary.totalStudents}</div>
                    <div class="summary-label">Total Students</div>
                </div>
                <div class="summary-card">
                    <div class="summary-value">${summary.averageAttendance}%</div>
                    <div class="summary-label">Avg Attendance Rate</div>
                </div>
            </div>
            
            <h6 class="mt-4 mb-3">Monthly Attendance Report - ${month} (${className})</h6>
            
            <!-- Calendar View -->
            <div class="mb-4">
                <h6 class="mb-3">Attendance Calendar</h6>
                <div class="monthly-calendar">
                    <div class="calendar-header">
                        <div class="calendar-day">Sun</div>
                        <div class="calendar-day">Mon</div>
                        <div class="calendar-day">Tue</div>
                        <div class="calendar-day">Wed</div>
                        <div class="calendar-day">Thu</div>
                        <div class="calendar-day">Fri</div>
                        <div class="calendar-day">Sat</div>
                    </div>
                    ${calendarData.map(day => `
                        <div class="calendar-day ${day.hasAttendance ? 'has-attendance' : 'no-attendance'} ${this.isToday(day.date) ? 'today' : ''}">
                            ${day.day}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Student Summary Table -->
            <h6 class="mb-3">Student Attendance Summary</h6>
            <div class="table-responsive">
                <table class="attendance-report-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Class</th>
                            <th>Present</th>
                            <th>Absent</th>
                            <th>Not Recorded</th>
                            <th>Attendance Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(row => `
                            <tr>
                                <td>${row.studentId}</td>
                                <td>
                                    <div class="student-name">${row.studentName}</div>
                                </td>
                                <td>${row.className}</td>
                                <td>${row.present}</td>
                                <td>${row.absent}</td>
                                <td>${row.notRecorded}</td>
                                <td>${row.attendanceRate}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    /**
     * Check if a date is today
     */
    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    /**
     * Get class name by ID
     */
    getClassName(classId) {
        const classes = this.getClasses();
        const classItem = classes.find(c => c.id === classId);
        return classItem ? classItem.name : classId;
    }

    /**
     * Download daily report as CSV
     */
    downloadDailyReport() {
        if (!this.dailyReportData) {
            this.showNotification('No report data available', 'error');
            return;
        }
        
        const { data, summary, date, class: className } = this.dailyReportData;
        
        // Create CSV content
        let csvContent = `Daily Attendance Report - ${date} (${className})\n\n`;
        csvContent += `Summary:\n`;
        csvContent += `Total Students,${summary.total}\n`;
        csvContent += `Present,${summary.present}\n`;
        csvContent += `Absent,${summary.absent}\n`;
        csvContent += `Attendance Rate,${summary.attendanceRate}%\n\n`;
        
        csvContent += `Student Details:\n`;
        csvContent += `Student ID,Student Name,Class,Status,Date\n`;
        
        data.forEach(row => {
            csvContent += `${row.studentId},"${row.studentName}",${row.className},${row.status},${row.date}\n`;
        });
        
        // Download CSV
        this.downloadCSV(csvContent, `daily_attendance_${date.replace(/\//g, '-')}_${className.replace(/\s+/g, '_')}.csv`);
    }

    /**
     * Download monthly report as CSV
     */
    downloadMonthlyReport() {
        if (!this.monthlyReportData) {
            this.showNotification('No report data available', 'error');
            return;
        }
        
        const { data, summary, month, class: className } = this.monthlyReportData;
        
        // Create CSV content
        let csvContent = `Monthly Attendance Report - ${month} (${className})\n\n`;
        csvContent += `Summary:\n`;
        csvContent += `Total Students,${summary.totalStudents}\n`;
        csvContent += `Average Attendance Rate,${summary.averageAttendance}%\n\n`;
        
        csvContent += `Student Summary:\n`;
        csvContent += `Student ID,Student Name,Class,Present,Absent,Not Recorded,Attendance Rate\n`;
        
        data.forEach(row => {
            csvContent += `${row.studentId},"${row.studentName}",${row.className},${row.present},${row.absent},${row.notRecorded},${row.attendanceRate}%\n`;
        });
        
        // Download CSV
        this.downloadCSV(csvContent, `monthly_attendance_${month.replace(/\s+/g, '_')}_${className.replace(/\s+/g, '_')}.csv`);
    }

    /**
     * Download CSV file
     */
    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
        this.showNotification('Report downloaded successfully', 'success');
    }
}
}

// ===== GLOBAL INSTANCE AND INITIALIZATION =====

/**
 * Global instance of the attendance manager
 * Available for use in HTML onclick handlers and console debugging
 */
let attendanceManager;

/**
 * Initialize the attendance management system when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 DOM loaded, initializing Attendance Manager...');
    attendanceManager = new AttendanceManager();
    
    // Initialize reports functionality
    attendanceManager.initializeReports();
});

/**
 * Handle page visibility changes to refresh data when page becomes visible
 * Useful for keeping data in sync across multiple tabs
 */
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && attendanceManager) {
        attendanceManager.updateDashboardStats();
        attendanceManager.renderStudentList();
    }
});

// ===== GLOBAL UTILITY FUNCTIONS =====

/**
 * Debug function to log current attendance data
 * Available in browser console for debugging
 */
function debugAttendance() {
    if (attendanceManager) {
        console.log('📊 Current Attendance Data:', attendanceManager.exportData());
    }
}

/**
 * Reset demo data function
 * Available in browser console for testing
 */
function resetDemoData() {
    if (attendanceManager) {
        attendanceManager.clearAllData();
    }
}

// ===== FUTURE BACKEND INTEGRATION POINTS =====

/**
 * TODO: Backend Integration Functions
 * 
 * These functions should be implemented when connecting to a backend API:
 * 
 * 1. Authentication & Authorization:
 *    - authenticateUser(username, password)
 *    - checkPermissions(action, resource)
 *    - refreshAuthToken()
 * 
 * 2. Data Synchronization:
 *    - syncClassesFromAPI()
 *    - syncStudentsFromAPI()
 *    - syncAttendanceToAPI()
 *    - syncPaymentsToAPI()
 * 
 * 3. Real-time Updates:
 *    - setupWebSocketConnection()
 *    - handleRealTimeUpdates()
 * 
 * 4. Offline Support:
 *    - queueOfflineActions()
 *    - syncWhenOnline()
 *    - handleConflictResolution()
 * 
 * 5. File Operations:
 *    - exportToCSV()
 *    - exportToPDF()
 *    - importFromCSV()
 * 
 * 6. Notifications:
 *    - setupPushNotifications()
 *    - sendEmailNotifications()
 *    - setupSMSNotifications()
 * 
 * 7. Analytics:
 *    - trackUserActions()
 *    - generateAttendanceReports()
 *    - calculateTrends()
 */

console.log('✨ EduLMS Attendance Management System loaded successfully!');
console.log('📝 Available console commands:');
console.log('   - debugAttendance(): View current data');
console.log('   - resetDemoData(): Clear all data and reload');
console.log('   - attendanceManager: Access main manager instance');

// ===== GLOBAL SIGN OUT FUNCTION =====

/**
 * Handle sign out functionality
 * This function can be called from any page to properly sign out the user
 */
function handleSignOut() {
    // If a global handler exists (from frontend/scripts/global-signout.js), delegate to it
    if (typeof window !== 'undefined' && typeof window.handleSignOut === 'function' && window.handleSignOut !== handleSignOut) {
        try {
            return window.handleSignOut();
        } catch (e) {
            // If delegation fails, fall through to local fallback
            console.warn('Delegation to global handleSignOut failed, using local fallback', e);
        }
    }

    // Local fallback behavior (keeps previous semantics)
    const confirmSignOut = confirm('Are you sure you want to sign out?');
    
    if (confirmSignOut) {
        try {
            sessionStorage.clear();
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_session');
            localStorage.removeItem('login_timestamp');

            if (typeof attendanceManager !== 'undefined' && attendanceManager.showNotification) {
                attendanceManager.showNotification('Signing out...', 'info');
            }

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 500);
        } catch (error) {
            console.error('Error during sign out (fallback):', error);
            window.location.href = 'login.html';
        }
    }
}

/**
 * Alternative sign out function for pages that don't have confirmation
 * Can be used for automatic sign out (e.g., session timeout)
 */
function forceSignOut(reason = 'Session expired') {
    try {
        // Clear session data
        sessionStorage.clear();
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_session');
        localStorage.removeItem('login_timestamp');
        
        // Log the reason
        console.log('Force sign out:', reason);
        
        // Redirect immediately
        window.location.href = 'login.html';
        
    } catch (error) {
        console.error('Error during force sign out:', error);
        window.location.href = 'login.html';
    }
}

/**
 * Check session validity (can be called periodically)
 * This is a placeholder for future backend integration
 */
function checkSession() {
    const loginTimestamp = localStorage.getItem('login_timestamp');
    const authToken = localStorage.getItem('auth_token');
    
    if (!loginTimestamp || !authToken) {
        // No valid session found
        return false;
    }
    
    // Check if session is older than 8 hours (28800000 ms)
    const sessionAge = Date.now() - parseInt(loginTimestamp);
    const maxSessionAge = 8 * 60 * 60 * 1000; // 8 hours
    
    if (sessionAge > maxSessionAge) {
        forceSignOut('Session timeout');
        return false;
    }
    
    return true;
}

// ===== ATTENDANCE REPORTS FUNCTIONALITY =====

/**
 * Initialize attendance reports functionality
 */
initializeReports() {
    this.setupReportEventListeners();
    this.populateReportClassSelectors();
}

/**
 * Set up event listeners for report functionality
 */
setupReportEventListeners() {
    // Daily report
    const generateDailyReportBtn = document.getElementById('generateDailyReportBtn');
    const downloadDailyReportBtn = document.getElementById('downloadDailyReportBtn');
    
    if (generateDailyReportBtn) {
        generateDailyReportBtn.addEventListener('click', () => this.generateDailyReport());
    }
    
    if (downloadDailyReportBtn) {
        downloadDailyReportBtn.addEventListener('click', () => this.downloadDailyReport());
    }
    
    // Monthly report
    const generateMonthlyReportBtn = document.getElementById('generateMonthlyReportBtn');
    const downloadMonthlyReportBtn = document.getElementById('downloadMonthlyReportBtn');
    
    if (generateMonthlyReportBtn) {
        generateMonthlyReportBtn.addEventListener('click', () => this.generateMonthlyReport());
    }
    
    if (downloadMonthlyReportBtn) {
        downloadMonthlyReportBtn.addEventListener('click', () => this.downloadMonthlyReport());
    }
}

/**
 * Populate class selectors in report sections
 */
populateReportClassSelectors() {
    const dailyClassSelect = document.getElementById('dailyReportClass');
    const monthlyClassSelect = document.getElementById('monthlyReportClass');
    
    const classes = this.getClasses();
    
    // Clear existing options except "All Classes"
    [dailyClassSelect, monthlyClassSelect].forEach(select => {
        if (select) {
            const allClassesOption = select.querySelector('option[value=""]');
            select.innerHTML = '';
            if (allClassesOption) {
                select.appendChild(allClassesOption);
            }
        }
    });
    
    // Add class options
    classes.forEach(classItem => {
        const option = document.createElement('option');
        option.value = classItem.id;
        option.textContent = classItem.name;
        
        if (dailyClassSelect) dailyClassSelect.appendChild(option.cloneNode(true));
        if (monthlyClassSelect) monthlyClassSelect.appendChild(option);
    });
}

/**
 * Generate daily attendance report
 */
generateDailyReport() {
    const dateInput = document.getElementById('dailyReportDate');
    const classSelect = document.getElementById('dailyReportClass');
    const contentDiv = document.getElementById('dailyReportContent');
    const downloadBtn = document.getElementById('downloadDailyReportBtn');
    
    if (!dateInput || !contentDiv) return;
    
    const selectedDate = new Date(dateInput.value);
    const selectedClass = classSelect ? classSelect.value : '';
    
    if (!selectedDate || isNaN(selectedDate.getTime())) {
        this.showNotification('Please select a valid date', 'error');
        return;
    }
    
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const date = selectedDate.getDate();
    
    // Get attendance data
    const attendanceData = this.getAttendanceData();
    const students = this.getStudents();
    
    // Filter students by class if specified
    const filteredStudents = selectedClass ? 
        students.filter(student => student.classId === selectedClass) : 
        students;
    
    // Generate report data
    const reportData = [];
    let presentCount = 0;
    let absentCount = 0;
    
    filteredStudents.forEach(student => {
        const key = `${student.classId}_${year}_${month}_${date}`;
        const attendance = attendanceData[key] && attendanceData[key][student.id];
        
        let status = 'Not Recorded';
        if (attendance === true) {
            status = 'Present';
            presentCount++;
        } else if (attendance === false) {
            status = 'Absent';
            absentCount++;
        }
        
        reportData.push({
            studentId: student.id,
            studentName: student.name,
            className: this.getClassName(student.classId),
            status: status,
            date: selectedDate.toLocaleDateString()
        });
    });
    
    // Store report data for download
    this.dailyReportData = {
        date: selectedDate.toLocaleDateString(),
        class: selectedClass ? this.getClassName(selectedClass) : 'All Classes',
        data: reportData,
        summary: {
            total: reportData.length,
            present: presentCount,
            absent: absentCount,
            attendanceRate: reportData.length > 0 ? ((presentCount / reportData.length) * 100).toFixed(1) : 0
        }
    };
    
    // Render report
    this.renderDailyReport(contentDiv);
    
    // Enable download button
    if (downloadBtn) {
        downloadBtn.disabled = false;
    }
    
    this.showNotification('Daily report generated successfully', 'success');
}

/**
 * Render daily report in the content area
 */
renderDailyReport(container) {
    if (!this.dailyReportData) return;
    
    const { data, summary, date, class: className } = this.dailyReportData;
    
    container.innerHTML = `
        <div class="report-summary">
            <div class="summary-card">
                <div class="summary-value">${summary.total}</div>
                <div class="summary-label">Total Students</div>
            </div>
            <div class="summary-card">
                <div class="summary-value">${summary.present}</div>
                <div class="summary-label">Present</div>
            </div>
            <div class="summary-card">
                <div class="summary-value">${summary.absent}</div>
                <div class="summary-label">Absent</div>
            </div>
            <div class="summary-card">
                <div class="summary-value">${summary.attendanceRate}%</div>
                <div class="summary-label">Attendance Rate</div>
            </div>
        </div>
        
        <h6 class="mt-4 mb-3">Daily Attendance Report - ${date} (${className})</h6>
        
        <div class="table-responsive">
            <table class="attendance-report-table">
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Class</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            <td>${row.studentId}</td>
                            <td>
                                <div class="student-name">${row.studentName}</div>
                            </td>
                            <td>${row.className}</td>
                            <td>
                                <span class="status-${row.status.toLowerCase().replace(' ', '-')}">${row.status}</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Generate monthly attendance report
 */
generateMonthlyReport() {
    const monthSelect = document.getElementById('monthlyReportMonth');
    const yearSelect = document.getElementById('monthlyReportYear');
    const classSelect = document.getElementById('monthlyReportClass');
    const contentDiv = document.getElementById('monthlyReportContent');
    const downloadBtn = document.getElementById('downloadMonthlyReportBtn');
    
    if (!monthSelect || !yearSelect || !contentDiv) return;
    
    const selectedMonth = parseInt(monthSelect.value);
    const selectedYear = parseInt(yearSelect.value);
    const selectedClass = classSelect ? classSelect.value : '';
    
    // Get attendance data
    const attendanceData = this.getAttendanceData();
    const students = this.getStudents();
    
    // Filter students by class if specified
    const filteredStudents = selectedClass ? 
        students.filter(student => student.classId === selectedClass) : 
        students;
    
    // Get days in month
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    
    // Generate monthly report data
    const reportData = [];
    const calendarData = [];
    
    // Initialize calendar data
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(selectedYear, selectedMonth, day);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        calendarData.push({
            day: day,
            dayName: dayName,
            date: date,
            hasAttendance: false,
            attendanceCount: 0
        });
    }
    
    filteredStudents.forEach(student => {
        let monthlyPresent = 0;
        let monthlyAbsent = 0;
        let monthlyNotRecorded = 0;
        
        const dailyAttendance = [];
        
        for (let day = 1; day <= daysInMonth; day++) {
            const key = `${student.classId}_${selectedYear}_${selectedMonth}_${day}`;
            const attendance = attendanceData[key] && attendanceData[key][student.id];
            
            let status = 'Not Recorded';
            if (attendance === true) {
                status = 'Present';
                monthlyPresent++;
                calendarData[day - 1].attendanceCount++;
                calendarData[day - 1].hasAttendance = true;
            } else if (attendance === false) {
                status = 'Absent';
                monthlyAbsent++;
            } else {
                monthlyNotRecorded++;
            }
            
            dailyAttendance.push(status);
        }
        
        const totalDays = monthlyPresent + monthlyAbsent;
        const attendanceRate = totalDays > 0 ? ((monthlyPresent / totalDays) * 100).toFixed(1) : 0;
        
        reportData.push({
            studentId: student.id,
            studentName: student.name,
            className: this.getClassName(student.classId),
            present: monthlyPresent,
            absent: monthlyAbsent,
            notRecorded: monthlyNotRecorded,
            attendanceRate: attendanceRate,
            dailyAttendance: dailyAttendance
        });
    });
    
    // Store report data for download
    this.monthlyReportData = {
        month: new Date(selectedYear, selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        class: selectedClass ? this.getClassName(selectedClass) : 'All Classes',
        data: reportData,
        calendarData: calendarData,
        summary: {
            totalStudents: reportData.length,
            averageAttendance: reportData.length > 0 ? 
                (reportData.reduce((sum, student) => sum + parseFloat(student.attendanceRate), 0) / reportData.length).toFixed(1) : 0
        }
    };
    
    // Render report
    this.renderMonthlyReport(contentDiv);
    
    // Enable download button
    if (downloadBtn) {
        downloadBtn.disabled = false;
    }
    
    this.showNotification('Monthly report generated successfully', 'success');
}

/**
 * Render monthly report in the content area
 */
renderMonthlyReport(container) {
    if (!this.monthlyReportData) return;
    
    const { data, calendarData, summary, month, class: className } = this.monthlyReportData;
    
    container.innerHTML = `
        <div class="report-summary">
            <div class="summary-card">
                <div class="summary-value">${summary.totalStudents}</div>
                <div class="summary-label">Total Students</div>
            </div>
            <div class="summary-card">
                <div class="summary-value">${summary.averageAttendance}%</div>
                <div class="summary-label">Avg Attendance Rate</div>
            </div>
        </div>
        
        <h6 class="mt-4 mb-3">Monthly Attendance Report - ${month} (${className})</h6>
        
        <!-- Calendar View -->
        <div class="mb-4">
            <h6 class="mb-3">Attendance Calendar</h6>
            <div class="monthly-calendar">
                <div class="calendar-header">
                    <div class="calendar-day">Sun</div>
                    <div class="calendar-day">Mon</div>
                    <div class="calendar-day">Tue</div>
                    <div class="calendar-day">Wed</div>
                    <div class="calendar-day">Thu</div>
                    <div class="calendar-day">Fri</div>
                    <div class="calendar-day">Sat</div>
                </div>
                ${calendarData.map(day => `
                    <div class="calendar-day ${day.hasAttendance ? 'has-attendance' : 'no-attendance'} ${this.isToday(day.date) ? 'today' : ''}">
                        ${day.day}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Student Summary Table -->
        <h6 class="mb-3">Student Attendance Summary</h6>
        <div class="table-responsive">
            <table class="attendance-report-table">
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Class</th>
                        <th>Present</th>
                        <th>Absent</th>
                        <th>Not Recorded</th>
                        <th>Attendance Rate</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(row => `
                        <tr>
                            <td>${row.studentId}</td>
                            <td>
                                <div class="student-name">${row.studentName}</div>
                            </td>
                            <td>${row.className}</td>
                            <td>${row.present}</td>
                            <td>${row.absent}</td>
                            <td>${row.notRecorded}</td>
                            <td>${row.attendanceRate}%</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Check if a date is today
 */
isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

/**
 * Get class name by ID
 */
getClassName(classId) {
    const classes = this.getClasses();
    const classItem = classes.find(c => c.id === classId);
    return classItem ? classItem.name : classId;
}

/**
 * Download daily report as CSV
 */
downloadDailyReport() {
    if (!this.dailyReportData) {
        this.showNotification('No report data available', 'error');
        return;
    }
    
    const { data, summary, date, class: className } = this.dailyReportData;
    
    // Create CSV content
    let csvContent = `Daily Attendance Report - ${date} (${className})\n\n`;
    csvContent += `Summary:\n`;
    csvContent += `Total Students,${summary.total}\n`;
    csvContent += `Present,${summary.present}\n`;
    csvContent += `Absent,${summary.absent}\n`;
    csvContent += `Attendance Rate,${summary.attendanceRate}%\n\n`;
    
    csvContent += `Student Details:\n`;
    csvContent += `Student ID,Student Name,Class,Status,Date\n`;
    
    data.forEach(row => {
        csvContent += `${row.studentId},"${row.studentName}",${row.className},${row.status},${row.date}\n`;
    });
    
    // Download CSV
    this.downloadCSV(csvContent, `daily_attendance_${date.replace(/\//g, '-')}_${className.replace(/\s+/g, '_')}.csv`);
}

/**
 * Download monthly report as CSV
 */
downloadMonthlyReport() {
    if (!this.monthlyReportData) {
        this.showNotification('No report data available', 'error');
        return;
    }
    
    const { data, summary, month, class: className } = this.monthlyReportData;
    
    // Create CSV content
    let csvContent = `Monthly Attendance Report - ${month} (${className})\n\n`;
    csvContent += `Summary:\n`;
    csvContent += `Total Students,${summary.totalStudents}\n`;
    csvContent += `Average Attendance Rate,${summary.averageAttendance}%\n\n`;
    
    csvContent += `Student Summary:\n`;
    csvContent += `Student ID,Student Name,Class,Present,Absent,Not Recorded,Attendance Rate\n`;
    
    data.forEach(row => {
        csvContent += `${row.studentId},"${row.studentName}",${row.className},${row.present},${row.absent},${row.notRecorded},${row.attendanceRate}%\n`;
    });
    
    // Download CSV
    this.downloadCSV(csvContent, `monthly_attendance_${month.replace(/\s+/g, '_')}_${className.replace(/\s+/g, '_')}.csv`);
}

/**
 * Download CSV file
 */
downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    this.showNotification('Report downloaded successfully', 'success');
}

// Optional: Set up automatic session checking every 5 minutes
setInterval(checkSession, 5 * 60 * 1000);