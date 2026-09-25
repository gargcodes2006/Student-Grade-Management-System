# Student Grade Management System

A beginner-friendly, feature-packed console application written in standard **C programming language**. Designed for Computer Science students (1st/2nd Year) to learn and demonstrate core programming fundamentals including structures, arrays, functions, file storage, and data validation.

---

## 📌 About the Project

The **Student Grade Management System** allows academic administrators or educators to manage student academic records seamlessly in a command-line environment. It performs automated percentage calculations, letter grade assignments, pass/fail status determination based on subject thresholds, class statistics calculations, topper evaluation, and permanent binary file storage (`students.dat`).

---

## ✨ Features

- **Add Student Records**: Input student details (Roll Number, Name) and marks for 5 subjects with validation (`0 <= marks <= 100`) and unique roll number checks.
- **Automatic Calculation**: Instant computation of Total Marks (out of 500), Percentage, Letter Grade, and PASS/FAIL result.
- **Display All Students**: View all stored records in an aligned tabular layout.
- **Search Student**: Query student records by Roll Number and display detailed report cards.
- **Update Records**: Modify existing student names or subject marks with automatic recalculation of grades.
- **Delete Records**: Interactively remove student records with explicit `(Y/N)` user confirmation.
- **Detailed Report Card**: Generate a formatted report card showing subject-by-subject marks, total, percentage, grade, and pass/fail status.
- **Class Topper**: Identify and display the student with the highest percentage (supports tied toppers).
- **Class Statistics**: Compute total students, count of passed/failed students, class average percentage, highest & lowest percentages, and pass percentage.
- **Persistent Data Storage**: Save student data to a binary file (`students.dat`) so all records persist between application sessions.

---

## 🛠️ Technologies Used

- **Language**: Standard C (C99 / C89 Compatible)
- **Library**: Standard C Headers (`stdio.h`, `stdlib.h`, `string.h`)
- **Storage**: Binary File I/O (`fopen`, `fwrite`, `fread`, `fclose`)

---

## 💡 Concepts Practiced

- **Variables & Data Types**: Managing integer, float, character, and string data.
- **Control Flow**: Using `if-else` conditionals and `switch-case` menu branches.
- **Loops**: `for`, `while`, and `do-while` loops for input validation and menu navigation.
- **Functions**: Modularizing code into clean, reusable functions.
- **Arrays & Strings**: Handling 1D arrays for subject marks and character arrays (`char[]`) for names.
- **Structures (`struct`)**: Grouping heterogeneous student attributes into a unified object.
- **Pointers**: Passing structure pointers (`Student *s`) for efficient in-place updates.
- **File Handling**: Reading and writing structure records directly using binary files.
- **Input Validation**: Preventing crashes from invalid menu choices or out-of-range marks.

---

## 🏫 Subject & Grading Scheme

### Subjects Evaluated (100 Marks Each)
1. Mathematics
2. Programming in C
3. Physics
4. English
5. Computer Fundamentals

### Grade Breakdown
| Percentage Range | Letter Grade | Result Criteria |
| :--- | :--- | :--- |
| **90% – 100%** | **A+** | PASS |
| **80% – 89%** | **A** | PASS |
| **70% – 79%** | **B** | PASS |
| **60% – 69%** | **C** | PASS |
| **50% – 59%** | **D** | PASS |
| **40% – 49%** | **E** | PASS |
| **Below 40%** | **F** | **FAIL** |

> **Note**: If a student scores less than **40 marks in ANY single subject**, their overall status is flagged as **FAIL** regardless of overall average percentage.

---

## 🚀 How to Compile

Using standard GCC compiler:

```bash
gcc main.c -o student_management
```

Or with warnings enabled (recommended):

```bash
gcc -Wall -Wextra main.c -o student_management
```

---

## 💻 How to Run

### Windows (CMD or PowerShell)

```cmd
student_management.exe
```

### Linux / macOS

```bash
chmod +x student_management
./student_management
```

---

## 📷 Sample Output Preview

```text
=========================================================================================
Roll No  Name                      Total        Percentage      Grade    Result  
=========================================================================================
101      Rahul Kumar               424.00       84.80%          A        PASS    
102      Aman Singh                376.00       75.20%          B        PASS    
103      Garg Anand                491.00       98.20%          A+       PASS    
104      Gaurav Pal                445.00       89.00%          A        PASS    
105      Himanshu Chandela         493.00       98.60%          A+       PASS    
=========================================================================================
Total Records: 5
```

Refer to [sample-output.txt](sample-output.txt) for a complete execution transcript.

---

## 🔮 Future Improvements

- [ ] **User Authentication**: Add admin login / password protection.
- [ ] **Custom Subject Config**: Allow adding/removing custom subjects dynamically.
- [ ] **Sorting & Ranking**: Option to sort students by Roll Number, Name, or Rank.
- [ ] **Attendance Tracking**: Track attendance percentages alongside grades.
- [ ] **CSV / PDF Export**: Export academic records to `.csv` or formatted reports.
- [ ] **GUI Integration**: Port terminal UI to GUI using GTK or Win32 API.
- [ ] **Database Integration**: Connect to SQLite or MySQL database backend.

---

## 📄 License

This project is open-source and free to use for educational and learning purposes.
Also Tell you abou the all the student Grade that work in school and in college.
