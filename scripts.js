document.addEventListener("DOMContentLoaded", () => {
    const studentTypeSelect = document.getElementById('studentType');
    const calculateBtn = document.getElementById('calculateBtn');
    const semesterInputForm = document.getElementById('semesterInputForm');
    const semesterFields = document.getElementById('semesterFields');

    // Set up event listeners
    studentTypeSelect.addEventListener('change', () => {
        setupCGPAForm(studentTypeSelect.value);
    });

    calculateBtn.addEventListener('click', calculateCGPA);

    function setupCGPAForm(studentType) {
        // Clear previous inputs
        semesterFields.innerHTML = '';

        let startSemester, endSemester = 8;

        if (studentType === 'regular') {
            startSemester = 1;
        } else if (studentType === 'diploma') {
            startSemester = 3;
        } else {
            semesterInputForm.style.display = 'none';
            return;
        }

        semesterInputForm.style.display = 'block';

        // Generate input fields for each semester's credits and grade points
        for (let i = startSemester; i <= endSemester; i++) {
            const semesterDiv = document.createElement('div');
            semesterDiv.classList.add('semester');
            semesterDiv.innerHTML = `
                <label>Semester ${i} Credits:</label>
                <input type="number" step="1" id="credits${i}" placeholder="Enter Total Credits earned" min="1">

                <label>Semester ${i} Grade Points:</label>
                <input type="number" step="0.01" id="gradePoints${i}" placeholder="Enter Total Grade Points earned" min="0">
            `;
            semesterFields.appendChild(semesterDiv);
        }
    }

    function calculateCGPA() {
        const studentType = studentTypeSelect.value;
        let startSemester = studentType === 'regular' ? 1 : 3;
        const endSemester = 8;

        let totalCredits = 0;
        let totalGradePoints = 0;

        // Calculate total credits and grade points
        for (let i = startSemester; i <= endSemester; i++) {
            const creditsInput = document.getElementById(`credits${i}`);
            const gradePointsInput = document.getElementById(`gradePoints${i}`);
            const credits = parseFloat(creditsInput?.value);
            const gradePoints = parseFloat(gradePointsInput?.value);

            if (!isNaN(credits) && credits > 0 && !isNaN(gradePoints) && gradePoints >= 0) {
                totalCredits += credits;
                totalGradePoints += gradePoints;
            }
        }

        const resultDiv = document.getElementById('result');
        if (totalCredits > 0) {
            const cgpa = (totalGradePoints / totalCredits).toFixed(2);  // Calculate CGPA
            resultDiv.innerHTML = `<h2>Your CGPA: ${cgpa}</h2>`;
        } else {
            resultDiv.innerHTML = `<h2>Please enter valid credits and grade points for each semester.</h2>`;
        }
    }
});
