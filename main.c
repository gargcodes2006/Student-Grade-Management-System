/*
 * =====================================================================================
 * Project Name : Student Grade Management System
 * Language     : C (Standard C99)
 * Description  : A console-based application to manage student academic records,
 *                calculate results, assign grades, search, update, delete, and save
 *                data persistently using binary file handling.
 * =====================================================================================
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_STUDENTS 100
#define NUM_SUBJECTS 5
#define MAX_NAME_LEN 50
#define FILENAME "students.dat"

// Subject Names Array
const char SUBJECT_NAMES[NUM_SUBJECTS][30] = {
    "Mathematics",
    "Programming in C",
    "Physics",
    "English",
    "Computer Fundamentals"
};

// Student Structure Definition
typedef struct {
    int rollNo;
    char name[MAX_NAME_LEN];
    float marks[NUM_SUBJECTS];
    float total;
    float percentage;
    char grade[5];     // Grades: A+, A, B, C, D, E, F
    char status[10];   // Status: PASS or FAIL
} Student;

// Global Variables
Student students[MAX_STUDENTS];
int studentCount = 0;

// Helper & Utility Function Prototypes
void clearInputBuffer(void);
int findStudentIndexByRoll(int rollNo);
void calculateResult(Student *s);
void printHeader(const char *title);

// Feature Function Prototypes
void addStudent(void);
void displayAllStudents(void);
void searchStudent(void);
void updateStudent(void);
void deleteStudent(void);
void displayStudentResult(void);
void displayTopper(void);
void displayClassStatistics(void);

// File Handling Function Prototypes
void saveRecords(void);
void loadRecords(void);

// ==========================================
// Helper & Utility Functions
// ==========================================

// Function to clear remaining characters from the input buffer
void clearInputBuffer(void) {
    int c;
    while ((c = getchar()) != '\n' && c != EOF) {
        // Discard characters until newline or EOF
    }
}

// Function to print styled section headers
void printHeader(const char *title) {
    printf("\n=========================================\n");
    printf("       %s\n", title);
    printf("=========================================\n");
}

// Helper function to find array index of a student by roll number
// Returns array index if found, -1 if not found
int findStudentIndexByRoll(int rollNo) {
    for (int i = 0; i < studentCount; i++) {
        if (students[i].rollNo == rollNo) {
            return i;
        }
    }
    return -1;
}

// Automatically calculates Total Marks, Percentage, Grade, and Pass/Fail Status
void calculateResult(Student *s) {
    s->total = 0.0f;
    int isFail = 0;

    // Calculate total marks and check individual subject pass criterion (min 40)
    for (int i = 0; i < NUM_SUBJECTS; i++) {
        s->total += s->marks[i];
        if (s->marks[i] < 40.0f) {
            isFail = 1;
        }
    }

    // Calculate percentage (out of 500 total, 5 subjects)
    s->percentage = s->total / (float)NUM_SUBJECTS;

    // Assign Pass/Fail status and letter grade
    if (isFail) {
        strcpy(s->status, "FAIL");
        strcpy(s->grade, "F");
    } else {
        strcpy(s->status, "PASS");
        if (s->percentage >= 90.0f) {
            strcpy(s->grade, "A+");
        } else if (s->percentage >= 80.0f) {
            strcpy(s->grade, "A");
        } else if (s->percentage >= 70.0f) {
            strcpy(s->grade, "B");
        } else if (s->percentage >= 60.0f) {
            strcpy(s->grade, "C");
        } else if (s->percentage >= 50.0f) {
            strcpy(s->grade, "D");
        } else if (s->percentage >= 40.0f) {
            strcpy(s->grade, "E");
        } else {
            strcpy(s->grade, "F");
        }
    }
}

// ==========================================
// Feature Implementation Functions
// ==========================================

// Feature 1: Add Student
void addStudent(void) {
    if (studentCount >= MAX_STUDENTS) {
        printf("\n[ERROR] Cannot add student. Maximum capacity (%d) reached!\n", MAX_STUDENTS);
        return;
    }

    printHeader("ADD NEW STUDENT");

    int rollNo;
    printf("Enter Roll Number: ");
    if (scanf("%d", &rollNo) != 1) {
        printf("\n[ERROR] Invalid input format for Roll Number!\n");
        clearInputBuffer();
        return;
    }
    clearInputBuffer();

    if (rollNo <= 0) {
        printf("\n[ERROR] Roll Number must be a positive integer!\n");
        return;
    }

    // Check for duplicate roll number
    if (findStudentIndexByRoll(rollNo) != -1) {
        printf("\nStudent with this roll number already exists.\n");
        return;
    }

    Student newStudent;
    newStudent.rollNo = rollNo;

    printf("Enter Student Name: ");
    if (fgets(newStudent.name, sizeof(newStudent.name), stdin) != NULL) {
        // Strip trailing newline character
        size_t len = strlen(newStudent.name);
        if (len > 0 && newStudent.name[len - 1] == '\n') {
            newStudent.name[len - 1] = '\0';
        }
    }

    if (strlen(newStudent.name) == 0) {
        printf("\n[ERROR] Student name cannot be empty!\n");
        return;
    }

    printf("\n--- Enter Marks (0 to 100) ---\n");
    for (int i = 0; i < NUM_SUBJECTS; i++) {
        float mark;
        while (1) {
            printf("%-23s Marks: ", SUBJECT_NAMES[i]);
            if (scanf("%f", &mark) == 1 && mark >= 0.0f && mark <= 100.0f) {
                newStudent.marks[i] = mark;
                clearInputBuffer();
                break;
            } else {
                printf("  -> Invalid marks! Enter a value between 0 and 100: ");
                clearInputBuffer();
            }
        }
    }

    // Calculate total, percentage, grade, status
    calculateResult(&newStudent);

    // Save to memory array
    students[studentCount++] = newStudent;

    // Auto-save to file
    saveRecords();

    printf("\nStudent added successfully!\n");
}

// Feature 3: Display All Students
void displayAllStudents(void) {
    if (studentCount == 0) {
        printf("\nNo student records found.\n");
        return;
    }

    printHeader("ALL STUDENT RECORDS");

    printf("=========================================================================================\n");
    printf("%-8s %-25s %-12s %-15s %-8s %-8s\n", "Roll No", "Name", "Total", "Percentage", "Grade", "Result");
    printf("=========================================================================================\n");

    for (int i = 0; i < studentCount; i++) {
        char percStr[20];
        snprintf(percStr, sizeof(percStr), "%.2f%%", students[i].percentage);

        printf("%-8d %-25s %-12.2f %-15s %-8s %-8s\n",
               students[i].rollNo,
               students[i].name,
               students[i].total,
               percStr,
               students[i].grade,
               students[i].status);
    }
    printf("=========================================================================================\n");
    printf("Total Records: %d\n", studentCount);
}

// Feature 4: Search Student
void searchStudent(void) {
    if (studentCount == 0) {
        printf("\nNo student records available.\n");
        return;
    }

    printHeader("SEARCH STUDENT");

    int rollNo;
    printf("Enter Roll Number: ");
    if (scanf("%d", &rollNo) != 1) {
        printf("\n[ERROR] Invalid input format!\n");
        clearInputBuffer();
        return;
    }
    clearInputBuffer();

    int index = findStudentIndexByRoll(rollNo);
    if (index == -1) {
        printf("\nStudent record not found.\n");
        return;
    }

    Student *s = &students[index];

    printf("\n========================================\n");
    printf("           STUDENT RESULT               \n");
    printf("========================================\n");
    printf("Roll Number        : %d\n", s->rollNo);
    printf("Name               : %s\n\n", s->name);

    for (int i = 0; i < NUM_SUBJECTS; i++) {
        printf("%-22s : %.2f\n", SUBJECT_NAMES[i], s->marks[i]);
    }

    printf("----------------------------------------\n");
    printf("Total Marks        : %.2f / 500.00\n", s->total);
    printf("Percentage         : %.2f%%\n", s->percentage);
    printf("Grade              : %s\n", s->grade);
    printf("Result             : %s\n", s->status);
    printf("========================================\n");
}

// Feature 5: Update Student
void updateStudent(void) {
    if (studentCount == 0) {
        printf("\nNo student records available to update.\n");
        return;
    }

    printHeader("UPDATE STUDENT RECORD");

    int rollNo;
    printf("Enter Roll Number: ");
    if (scanf("%d", &rollNo) != 1) {
        printf("\n[ERROR] Invalid input format!\n");
        clearInputBuffer();
        return;
    }
    clearInputBuffer();

    int index = findStudentIndexByRoll(rollNo);
    if (index == -1) {
        printf("\nStudent record not found.\n");
        return;
    }

    Student *s = &students[index];
    printf("\nCurrent Student Name: %s\n", s->name);

    printf("Enter New Name (press Enter to keep current): ");
    char newName[MAX_NAME_LEN];
    if (fgets(newName, sizeof(newName), stdin) != NULL) {
        size_t len = strlen(newName);
        if (len > 0 && newName[len - 1] == '\n') {
            newName[len - 1] = '\0';
        }
        if (strlen(newName) > 0) {
            strcpy(s->name, newName);
        }
    }

    printf("\n--- Enter Updated Marks (0 to 100) ---\n");
    for (int i = 0; i < NUM_SUBJECTS; i++) {
        float mark;
        while (1) {
            printf("%-23s (Current: %.2f): ", SUBJECT_NAMES[i], s->marks[i]);
            if (scanf("%f", &mark) == 1 && mark >= 0.0f && mark <= 100.0f) {
                s->marks[i] = mark;
                clearInputBuffer();
                break;
            } else {
                printf("  -> Invalid marks! Enter a value between 0 and 100: ");
                clearInputBuffer();
            }
        }
    }

    // Recalculate results after update
    calculateResult(s);

    // Save changes
    saveRecords();

    printf("\nStudent updated successfully!\n");
}

// Feature 6: Delete Student
void deleteStudent(void) {
    if (studentCount == 0) {
        printf("\nNo student records available to delete.\n");
        return;
    }

    printHeader("DELETE STUDENT RECORD");

    int rollNo;
    printf("Enter Roll Number: ");
    if (scanf("%d", &rollNo) != 1) {
        printf("\n[ERROR] Invalid input format!\n");
        clearInputBuffer();
        return;
    }
    clearInputBuffer();

    int index = findStudentIndexByRoll(rollNo);
    if (index == -1) {
        printf("\nStudent record not found.\n");
        return;
    }

    printf("\nStudent Name: %s (Roll No: %d)\n", students[index].name, students[index].rollNo);
    printf("Are you sure you want to delete this record? (Y/N): ");
    char confirm;
    scanf("%c", &confirm);
    clearInputBuffer();

    if (confirm == 'Y' || confirm == 'y') {
        // Shift remaining array elements to fill the gap
        for (int i = index; i < studentCount - 1; i++) {
            students[i] = students[i + 1];
        }
        studentCount--;

        saveRecords();
        printf("\nStudent record deleted successfully.\n");
    } else {
        printf("\nDeletion cancelled.\n");
    }
}

// Feature 7: Detailed Student Result Report Card
void displayStudentResult(void) {
    if (studentCount == 0) {
        printf("\nNo student records available.\n");
        return;
    }

    printHeader("DISPLAY STUDENT REPORT CARD");

    int rollNo;
    printf("Enter Roll Number: ");
    if (scanf("%d", &rollNo) != 1) {
        printf("\n[ERROR] Invalid input format!\n");
        clearInputBuffer();
        return;
    }
    clearInputBuffer();

    int index = findStudentIndexByRoll(rollNo);
    if (index == -1) {
        printf("\nStudent record not found.\n");
        return;
    }

    Student *s = &students[index];

    printf("\n===================================================\n");
    printf("             STUDENT REPORT CARD                   \n");
    printf("===================================================\n");
    printf(" Roll Number : %-10d Student Name : %-20s\n", s->rollNo, s->name);
    printf("---------------------------------------------------\n");
    printf(" SUBJECT                          MARKS (Out of 100)\n");
    printf("---------------------------------------------------\n");
    for (int i = 0; i < NUM_SUBJECTS; i++) {
        printf(" %-32s : %6.2f\n", SUBJECT_NAMES[i], s->marks[i]);
    }
    printf("---------------------------------------------------\n");
    printf(" Total Marks Obtained             : %6.2f / 500.00\n", s->total);
    printf(" Percentage                       : %6.2f%%\n", s->percentage);
    printf(" Overall Grade                    : %s\n", s->grade);
    printf(" Academic Result Status           : %s\n", s->status);
    printf("===================================================\n");
}

// Feature 8: Display Class Topper
void displayTopper(void) {
    if (studentCount == 0) {
        printf("\nNo student records available to evaluate topper.\n");
        return;
    }

    float maxPercentage = -1.0f;
    for (int i = 0; i < studentCount; i++) {
        if (students[i].percentage > maxPercentage) {
            maxPercentage = students[i].percentage;
        }
    }

    printf("\n=======================================\n");
    printf("              CLASS TOPPER             \n");
    printf("=======================================\n");

    for (int i = 0; i < studentCount; i++) {
        if (students[i].percentage == maxPercentage) {
            printf("Roll Number : %d\n", students[i].rollNo);
            printf("Name        : %s\n", students[i].name);
            printf("Total       : %.2f / 500.00\n", students[i].total);
            printf("Percentage  : %.2f%%\n", students[i].percentage);
            printf("Grade       : %s\n", students[i].grade);
            printf("Status      : %s\n", students[i].status);
            printf("---------------------------------------\n");
        }
    }
    printf("=======================================\n");
}

// Feature 9: Display Class Statistics
void displayClassStatistics(void) {
    if (studentCount == 0) {
        printf("\nNo student records available for statistics.\n");
        return;
    }

    int passedCount = 0;
    int failedCount = 0;
    float totalPercentageSum = 0.0f;
    float highestPercentage = students[0].percentage;
    float lowestPercentage = students[0].percentage;

    for (int i = 0; i < studentCount; i++) {
        if (strcmp(students[i].status, "PASS") == 0) {
            passedCount++;
        } else {
            failedCount++;
        }

        totalPercentageSum += students[i].percentage;

        if (students[i].percentage > highestPercentage) {
            highestPercentage = students[i].percentage;
        }
        if (students[i].percentage < lowestPercentage) {
            lowestPercentage = students[i].percentage;
        }
    }

    float classAverage = totalPercentageSum / (float)studentCount;
    float passPercentage = ((float)passedCount / (float)studentCount) * 100.0f;

    printf("\n=======================================\n");
    printf("          CLASS STATISTICS             \n");
    printf("=======================================\n");
    printf("Total Students        : %d\n", studentCount);
    printf("Passed Students       : %d\n", passedCount);
    printf("Failed Students       : %d\n", failedCount);
    printf("Class Average         : %.2f%%\n", classAverage);
    printf("Highest Percentage    : %.2f%%\n", highestPercentage);
    printf("Lowest Percentage     : %.2f%%\n", lowestPercentage);
    printf("Pass Percentage       : %.2f%%\n", passPercentage);
    printf("=======================================\n");
}

// ==========================================
// File Handling Functions
// ==========================================

// Save all student records to binary file
void saveRecords(void) {
    FILE *fp = fopen(FILENAME, "wb");
    if (fp == NULL) {
        printf("\n[ERROR] Could not open file '%s' for saving records.\n", FILENAME);
        return;
    }

    fwrite(&studentCount, sizeof(int), 1, fp);
    if (studentCount > 0) {
        fwrite(students, sizeof(Student), studentCount, fp);
    }

    fclose(fp);
}

// Load student records from binary file
void loadRecords(void) {
    FILE *fp = fopen(FILENAME, "rb");
    if (fp == NULL) {
        // File does not exist initially; start with empty records
        studentCount = 0;
        return;
    }

    if (fread(&studentCount, sizeof(int), 1, fp) != 1) {
        studentCount = 0;
        fclose(fp);
        return;
    }

    if (studentCount > 0 && studentCount <= MAX_STUDENTS) {
        fread(students, sizeof(Student), studentCount, fp);
    } else {
        studentCount = 0;
    }

    fclose(fp);
}

// ==========================================
// Main Function & Menu Loop
// ==========================================

int main(void) {
    // Load existing records from binary file at startup
    loadRecords();

    int choice;
    do {
        printf("\n===========================================\n");
        printf("       STUDENT GRADE MANAGEMENT SYSTEM     \n");
        printf("===========================================\n");
        printf("1. Add Student\n");
        printf("2. Display All Students\n");
        printf("3. Search Student\n");
        printf("4. Update Student\n");
        printf("5. Delete Student\n");
        printf("6. Display Student Result\n");
        printf("7. Display Topper\n");
        printf("8. Display Class Statistics\n");
        printf("9. Save Records\n");
        printf("10. Exit\n");
        printf("===========================================\n");
        printf("Enter your choice: ");

        if (scanf("%d", &choice) != 1) {
            printf("\n[ERROR] Invalid choice format! Please enter a number between 1 and 10.\n");
            clearInputBuffer();
            continue;
        }
        clearInputBuffer();

        switch (choice) {
            case 1:
                addStudent();
                break;
            case 2:
                displayAllStudents();
                break;
            case 3:
                searchStudent();
                break;
            case 4:
                updateStudent();
                break;
            case 5:
                deleteStudent();
                break;
            case 6:
                displayStudentResult();
                break;
            case 7:
                displayTopper();
                break;
            case 8:
                displayClassStatistics();
                break;
            case 9:
                saveRecords();
                printf("\nRecords saved successfully!\n");
                break;
            case 10:
                saveRecords();
                printf("\nRecords saved successfully!\nExiting application. Goodbye!\n");
                break;
            default:
                printf("\n[ERROR] Invalid option! Please select a choice between 1 and 10.\n");
                break;
        }
    } while (choice != 10);

    return 0;
}
