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
                <h3>📚 Semester ${i}</h3>
                <label>Total Credits Earned:</label>
                <input type="number" step="1" id="credits${i}" placeholder="e.g., 20" min="1">

                <label>Total Grade Points Earned:</label>
                <input type="number" step="0.01" id="gradePoints${i}" placeholder="e.g., 180.5" min="0">
            `;
            semesterFields.appendChild(semesterDiv);
        }
    }

    function calculateCGPA() {
        const calculateBtn = document.getElementById('calculateBtn');
        const studentType = studentTypeSelect.value;
        let startSemester = studentType === 'regular' ? 1 : 3;
        const endSemester = 8;

        // Add loading state
        calculateBtn.classList.add('loading');
        calculateBtn.disabled = true;

        // Simulate calculation time for better UX
        setTimeout(() => {
            let totalCredits = 0;
            let totalGradePoints = 0;
            let validSemesters = 0;

            // Calculate total credits and grade points
            for (let i = startSemester; i <= endSemester; i++) {
                const creditsInput = document.getElementById(`credits${i}`);
                const gradePointsInput = document.getElementById(`gradePoints${i}`);
                const credits = parseFloat(creditsInput?.value);
                const gradePoints = parseFloat(gradePointsInput?.value);

                if (!isNaN(credits) && credits > 0 && !isNaN(gradePoints) && gradePoints >= 0) {
                    totalCredits += credits;
                    totalGradePoints += gradePoints;
                    validSemesters++;
                }
            }

            const resultDiv = document.getElementById('result');
            if (totalCredits > 0) {
                const cgpa = (totalGradePoints / totalCredits).toFixed(2);
                resultDiv.innerHTML = `
                    <h2>🎉 Your CGPA Result</h2>
                    <div style="font-size: 2em; color: #667eea; font-weight: bold; margin: 20px 0;">
                        ${cgpa}
                    </div>
                    <p>Based on ${validSemesters} semester(s) with ${totalCredits} total credits</p>
                `;
            } else {
                resultDiv.innerHTML = `
                    <h2>⚠️ Input Required</h2>
                    <p>Please enter valid credits and grade points for at least one semester.</p>
                `;
            }

            // Remove loading state
            calculateBtn.classList.remove('loading');
            calculateBtn.disabled = false;
        }, 800);
    }
});
