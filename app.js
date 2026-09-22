/* ==========================================================================
   EduGrade Pro — Student Grade Management System JavaScript Application
   ========================================================================== */

const STORAGE_KEY = 'edugrade_students_data';

// Default 5 Student Records
const DEFAULT_STUDENTS = [
    {
        rollNo: 101,
        name: "Rahul Kumar",
        marks: [85, 92, 78, 81, 88],
        total: 424.00,
        percentage: 84.80,
        grade: "A",
        status: "PASS"
    },
    {
        rollNo: 102,
        name: "Aman Singh",
        marks: [75, 80, 72, 70, 79],
        total: 376.00,
        percentage: 75.20,
        grade: "B",
        status: "PASS"
    },
    {
        rollNo: 103,
        name: "Garg Anand",
        marks: [99, 99, 98, 97, 98],
        total: 491.00,
        percentage: 98.20,
        grade: "A+",
        status: "PASS"
    },
    {
        rollNo: 104,
        name: "Gaurav Pal",
        marks: [90, 88, 90, 87, 90],
        total: 445.00,
        percentage: 89.00,
        grade: "A",
        status: "PASS"
    },
    {
        rollNo: 105,
        name: "Himanshu Chandela",
        marks: [100, 99, 98, 98, 98],
        total: 493.00,
        percentage: 98.60,
        grade: "A+",
        status: "PASS"
    }
];

const SUBJECT_NAMES = [
    "Mathematics",
    "Programming in C",
    "Physics",
    "English",
    "Computer Fundamentals"
];

// App State
let students = [];

// ==========================================
// Initialization & Persistence
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadStudentsData();
    setupEventListeners();
    renderAllViews();
});

function loadStudentsData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            students = JSON.parse(saved);
        } catch (e) {
            students = [...DEFAULT_STUDENTS];
        }
    } else {
        students = [...DEFAULT_STUDENTS];
        saveStudentsData();
    }
}

function saveStudentsData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// ==========================================
// Core Result Calculation Engine
// ==========================================
function calculateResult(marks) {
    let total = 0;
    let isFail = false;

    marks.forEach(m => {
        total += m;
        if (m < 40) isFail = true;
    });

    const percentage = total / 5.0;
    let grade = "F";
    let status = isFail ? "FAIL" : "PASS";

    if (isFail) {
        grade = "F";
    } else {
        if (percentage >= 90) grade = "A+";
        else if (percentage >= 80) grade = "A";
        else if (percentage >= 70) grade = "B";
        else if (percentage >= 60) grade = "C";
        else if (percentage >= 50) grade = "D";
        else if (percentage >= 40) grade = "E";
        else grade = "F";
    }

    return { total, percentage, grade, status };
}

// ==========================================
// Event Listeners & Navigation
// ==========================================
function setupEventListeners() {
    // Navigation Tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Quick Add Button
    document.getElementById('quickAddBtn').addEventListener('click', () => {
        resetStudentForm();
        switchTab('add-student');
    });

    // Global Search Input
    document.getElementById('globalSearchInput').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        filterStudents(query);
    });

    // Grade & Status Filters
    document.getElementById('gradeFilter').addEventListener('change', filterStudents);
    document.getElementById('statusFilter').addEventListener('change', filterStudents);

    // Live Mark Inputs Preview
    document.querySelectorAll('.mark-input').forEach(input => {
        input.addEventListener('input', updateLiveFormPreview);
    });

    // Export CSV
    document.getElementById('exportCsvBtn').addEventListener('click', exportToCsv);
}

function switchTab(tabId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.toggle('active', tab.id === `tab-${tabId}`);
    });

    if (tabId === 'report-card') {
        populateReportCardDropdown();
    }
}

// ==========================================
// Rendering Views
// ==========================================
function renderAllViews() {
    renderStatsOverview();
    renderRecentStudentsTable();
    renderAllStudentsTable();
    renderClassAnalytics();
    populateReportCardDropdown();
}

function renderStatsOverview() {
    const totalCount = students.length;
    document.getElementById('statTotalStudents').textContent = totalCount;

    if (totalCount === 0) {
        document.getElementById('statPassRate').textContent = '0%';
        document.getElementById('statClassAverage').textContent = '0%';
        document.getElementById('statTopperName').textContent = 'None';
        document.getElementById('statTopperScore').textContent = 'N/A';
        return;
    }

    const passedCount = students.filter(s => s.status === 'PASS').length;
    const passRate = ((passedCount / totalCount) * 100).toFixed(1);
    document.getElementById('statPassRate').textContent = `${passRate}%`;

    const avgSum = students.reduce((acc, s) => acc + s.percentage, 0);
    const classAvg = (avgSum / totalCount).toFixed(2);
    document.getElementById('statClassAverage').textContent = `${classAvg}%`;

    // Calculate Topper
    let topper = students[0];
    students.forEach(s => {
        if (s.percentage > topper.percentage) {
            topper = s;
        }
    });

    document.getElementById('statTopperName').textContent = topper.name;
    document.getElementById('statTopperScore').innerHTML = `<i class="fa-solid fa-star"></i> ${topper.percentage.toFixed(2)}% (${topper.grade})`;
}

function renderRecentStudentsTable() {
    const tbody = document.getElementById('recentStudentsTableBody');
    tbody.innerHTML = '';

    const recent = students.slice(0, 5);
    recent.forEach(s => {
        const row = createStudentTableRow(s);
        tbody.appendChild(row);
    });
}

function renderAllStudentsTable() {
    filterStudents();
}

function filterStudents() {
    const searchQuery = document.getElementById('globalSearchInput').value.toLowerCase().trim();
    const gradeFilter = document.getElementById('gradeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    const tbody = document.getElementById('allStudentsTableBody');
    tbody.innerHTML = '';

    const filtered = students.filter(s => {
        const matchesQuery = s.name.toLowerCase().includes(searchQuery) || s.rollNo.toString().includes(searchQuery);
        const matchesGrade = gradeFilter === 'ALL' || s.grade === gradeFilter;
        const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
        return matchesQuery && matchesGrade && matchesStatus;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No matching student records found.</td></tr>`;
        return;
    }

    filtered.forEach(s => {
        const row = createStudentTableRow(s);
        tbody.appendChild(row);
    });
}

function createStudentTableRow(s) {
    const tr = document.createElement('tr');

    const gradeClass = getGradeBadgeClass(s.grade);
    const statusClass = s.status === 'PASS' ? 'badge-pass' : 'badge-fail';

    tr.innerHTML = `
        <td><strong>#${s.rollNo}</strong></td>
        <td>${escapeHtml(s.name)}</td>
        <td>${s.total.toFixed(2)}</td>
        <td><strong>${s.percentage.toFixed(2)}%</strong></td>
        <td><span class="badge-grade ${gradeClass}">${s.grade}</span></td>
        <td><span class="badge ${statusClass}"><i class="fa-solid ${s.status === 'PASS' ? 'fa-circle-check' : 'fa-circle-xmark'}"></i> ${s.status}</span></td>
        <td class="action-btns">
            <button class="btn-icon" title="View Report Card" onclick="viewReportCardFor(${s.rollNo})"><i class="fa-solid fa-file-lines"></i></button>
            <button class="btn-icon" title="Edit Student" onclick="editStudent(${s.rollNo})"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-icon delete" title="Delete Student" onclick="deleteStudent(${s.rollNo})"><i class="fa-solid fa-trash-can"></i></button>
        </td>
    `;
    return tr;
}

function getGradeBadgeClass(grade) {
    switch (grade) {
        case 'A+': return 'grade-aplus';
        case 'A': return 'grade-a';
        case 'B': return 'grade-b';
        case 'C': return 'grade-c';
        case 'D': return 'grade-d';
        default: return 'grade-f';
    }
}

// ==========================================
// Form Submission & Editing
// ==========================================
function updateLiveFormPreview() {
    const marks = [
        parseFloat(document.getElementById('markMath').value) || 0,
        parseFloat(document.getElementById('markC').value) || 0,
        parseFloat(document.getElementById('markPhysics').value) || 0,
        parseFloat(document.getElementById('markEnglish').value) || 0,
        parseFloat(document.getElementById('markComp').value) || 0
    ];

    const res = calculateResult(marks);

    document.getElementById('previewTotal').textContent = `${res.total.toFixed(2)} / 500`;
    document.getElementById('previewPercentage').textContent = `${res.percentage.toFixed(2)}%`;
    
    const gradeBadge = document.getElementById('previewGrade');
    gradeBadge.textContent = res.grade;
    gradeBadge.className = `badge-grade ${getGradeBadgeClass(res.grade)}`;

    const statusBadge = document.getElementById('previewStatus');
    statusBadge.textContent = res.status;
    statusBadge.className = `badge ${res.status === 'PASS' ? 'badge-pass' : 'badge-fail'}`;
}

function handleFormSubmit(e) {
    e.preventDefault();

    const rollNo = parseInt(document.getElementById('formRollNo').value);
    const name = document.getElementById('formName').value.trim();
    const editOriginalRoll = document.getElementById('editOriginalRoll').value;

    const marks = [
        parseFloat(document.getElementById('markMath').value),
        parseFloat(document.getElementById('markC').value),
        parseFloat(document.getElementById('markPhysics').value),
        parseFloat(document.getElementById('markEnglish').value),
        parseFloat(document.getElementById('markComp').value)
    ];

    // Check duplicate roll number
    if (!editOriginalRoll || editOriginalRoll !== rollNo.toString()) {
        const exists = students.some(s => s.rollNo === rollNo);
        if (exists) {
            showToast(`Student with Roll Number #${rollNo} already exists!`, 'error');
            return;
        }
    }

    const calc = calculateResult(marks);

    const studentObj = {
        rollNo,
        name,
        marks,
        total: calc.total,
        percentage: calc.percentage,
        grade: calc.grade,
        status: calc.status
    };

    if (editOriginalRoll) {
        // Update
        const index = students.findIndex(s => s.rollNo === parseInt(editOriginalRoll));
        if (index !== -1) {
            students[index] = studentObj;
            showToast(`Student #${rollNo} updated successfully!`, 'success');
        }
    } else {
        // Create
        students.push(studentObj);
        showToast(`Student #${rollNo} added successfully!`, 'success');
    }

    saveStudentsData();
    resetStudentForm();
    renderAllViews();
    switchTab('students');
}

function editStudent(rollNo) {
    const student = students.find(s => s.rollNo === rollNo);
    if (!student) return;

    document.getElementById('formTitle').textContent = `Edit Student Record (#${student.rollNo})`;
    document.getElementById('editOriginalRoll').value = student.rollNo;
    document.getElementById('formRollNo').value = student.rollNo;
    document.getElementById('formName').value = student.name;

    document.getElementById('markMath').value = student.marks[0];
    document.getElementById('markC').value = student.marks[1];
    document.getElementById('markPhysics').value = student.marks[2];
    document.getElementById('markEnglish').value = student.marks[3];
    document.getElementById('markComp').value = student.marks[4];

    document.getElementById('cancelEditBtn').style.display = 'inline-flex';
    document.getElementById('submitFormBtn').innerHTML = `<i class="fa-solid fa-arrows-rotate"></i> Update Student Record`;

    updateLiveFormPreview();
    switchTab('add-student');
}

function resetStudentForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('editOriginalRoll').value = '';
    document.getElementById('formTitle').textContent = 'Add New Student Record';
    document.getElementById('cancelEditBtn').style.display = 'none';
    document.getElementById('submitFormBtn').innerHTML = `<i class="fa-solid fa-check"></i> Save Student Record`;
    updateLiveFormPreview();
}

function deleteStudent(rollNo) {
    const student = students.find(s => s.rollNo === rollNo);
    if (!student) return;

    if (confirm(`Are you sure you want to delete student "${student.name}" (Roll No: #${student.rollNo})?`)) {
        students = students.filter(s => s.rollNo !== rollNo);
        saveStudentsData();
        renderAllViews();
        showToast(`Student #${rollNo} deleted successfully.`, 'success');
    }
}

// ==========================================
// Report Card Generator
// ==========================================
function populateReportCardDropdown() {
    const select = document.getElementById('reportStudentSelect');
    select.innerHTML = '<option value="">Select Student...</option>';

    students.forEach(s => {
        const option = document.createElement('option');
        option.value = s.rollNo;
        option.textContent = `#${s.rollNo} — ${s.name}`;
        select.appendChild(option);
    });

    if (students.length > 0 && !select.value) {
        select.value = students[0].rollNo;
        loadReportCard(students[0].rollNo);
    }
}

function viewReportCardFor(rollNo) {
    switchTab('report-card');
    document.getElementById('reportStudentSelect').value = rollNo;
    loadReportCard(rollNo);
}

function loadReportCard(rollNo) {
    const container = document.getElementById('reportCardContainer');
    if (!rollNo) {
        container.innerHTML = `<div style="text-align: center; color: #64748b; padding: 3rem;">Please select a student to display their report card.</div>`;
        return;
    }

    const s = students.find(item => item.rollNo === parseInt(rollNo));
    if (!s) return;

    container.innerHTML = `
        <div class="report-header">
            <h1>ACADEMIC PERFORMANCE REPORT</h1>
            <p>Department of Computer Science & Engineering — Official Transcript</p>
        </div>

        <div class="report-meta">
            <div class="report-meta-item"><span>Student Name:</span> <strong>${escapeHtml(s.name)}</strong></div>
            <div class="report-meta-item"><span>Roll Number:</span> <strong>#${s.rollNo}</strong></div>
            <div class="report-meta-item"><span>Academic Session:</span> <strong>2026-2027</strong></div>
            <div class="report-meta-item"><span>Course / Major:</span> <strong>Computer Science</strong></div>
        </div>

        <table class="report-table">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Subject Name</th>
                    <th>Max Marks</th>
                    <th>Marks Obtained</th>
                    <th>Subject Status</th>
                </tr>
            </thead>
            <tbody>
                ${SUBJECT_NAMES.map((sub, idx) => `
                    <tr>
                        <td>${idx + 1}</td>
                        <td>${sub}</td>
                        <td>100</td>
                        <td><strong>${s.marks[idx].toFixed(2)}</strong></td>
                        <td><span style="color: ${s.marks[idx] >= 40 ? '#10b981' : '#ef4444'}; font-weight: 700;">${s.marks[idx] >= 40 ? 'PASS' : 'FAIL'}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="report-summary-box">
            <div class="report-summary-item">
                <span>TOTAL SCORE</span>
                <strong>${s.total.toFixed(2)} / 500</strong>
            </div>
            <div class="report-summary-item">
                <span>PERCENTAGE</span>
                <strong>${s.percentage.toFixed(2)}%</strong>
            </div>
            <div class="report-summary-item">
                <span>OVERALL GRADE</span>
                <strong style="color: #fbbf24;">${s.grade}</strong>
            </div>
            <div class="report-summary-item">
                <span>RESULT STATUS</span>
                <strong style="color: ${s.status === 'PASS' ? '#34d399' : '#f87171'};">${s.status}</strong>
            </div>
        </div>
    `;
}

// ==========================================
// Class Analytics
// ==========================================
function renderClassAnalytics() {
    const barsContainer = document.getElementById('subjectBarsContainer');
    const distContainer = document.getElementById('gradeDistributionContainer');

    if (students.length === 0) {
        barsContainer.innerHTML = '<p style="color: var(--text-muted)">No data available for analytics.</p>';
        distContainer.innerHTML = '';
        return;
    }

    // Subject Averages
    const subjectSums = [0, 0, 0, 0, 0];
    students.forEach(s => {
        s.marks.forEach((m, idx) => {
            subjectSums[idx] += m;
        });
    });

    barsContainer.innerHTML = '';
    SUBJECT_NAMES.forEach((subName, idx) => {
        const avg = (subjectSums[idx] / students.length).toFixed(1);
        const item = document.createElement('div');
        item.className = 'subject-bar-item';
        item.innerHTML = `
            <div class="bar-header">
                <span>${subName}</span>
                <span>${avg} / 100</span>
            </div>
            <div class="bar-track">
                <div class="bar-fill" style="width: ${avg}%;"></div>
            </div>
        `;
        barsContainer.appendChild(item);
    });

    // Grade Counts
    const gradeCounts = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'E': 0, 'F': 0 };
    students.forEach(s => {
        if (gradeCounts[s.grade] !== undefined) {
            gradeCounts[s.grade]++;
        }
    });

    distContainer.innerHTML = '';
    Object.keys(gradeCounts).forEach(g => {
        const count = gradeCounts[g];
        const item = document.createElement('div');
        item.className = 'grade-dist-item';
        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <span class="badge-grade ${getGradeBadgeClass(g)}">${g}</span>
                <span style="font-size: 0.88rem; color: var(--text-muted);">Grade ${g} Students</span>
            </div>
            <strong>${count} Student${count !== 1 ? 's' : ''}</strong>
        `;
        distContainer.appendChild(item);
    });
}

// ==========================================
// CSV Data Export
// ==========================================
function exportToCsv() {
    if (students.length === 0) {
        showToast('No student records to export!', 'error');
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Roll No,Name,Mathematics,Programming in C,Physics,English,Computer Fundamentals,Total,Percentage,Grade,Status\n";

    students.forEach(s => {
        const row = [
            s.rollNo,
            `"${s.name.replace(/"/g, '""')}"`,
            s.marks[0],
            s.marks[1],
            s.marks[2],
            s.marks[3],
            s.marks[4],
            s.total.toFixed(2),
            s.percentage.toFixed(2),
            s.grade,
            s.status
        ].join(",");
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `student_records_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Student records exported to CSV successfully!', 'success');
}

// ==========================================
// Toast Notifications & Utilities
// ==========================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
        <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
