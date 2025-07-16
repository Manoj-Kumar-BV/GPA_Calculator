document.addEventListener("DOMContentLoaded", () => {
    const gradeInputs = document.getElementById('gradeInputs');

    // Function to add a new subject with credits, letter grade input, and delete button
    function addSubject() {
        const subjectDiv = document.createElement('div');
        subjectDiv.classList.add('subject');
        subjectDiv.innerHTML = `
            <h3>📖 Subject ${document.querySelectorAll('.subject').length + 1}</h3>
            <label>Credits: 
                <input type="number" min="1" step="1" class="credits" placeholder="e.g., 3" required>
            </label>

            <label>Letter Grade: 
                <select class="letterGrade" required>
                    <option value="">Select Grade</option>
                    <option value="10">O (Outstanding) → 10</option>
                    <option value="9">A+ (Excellent) → 9</option>
                    <option value="8">A (Very Good) → 8</option>
                    <option value="7">B+ (Good) → 7</option>
                    <option value="6">B (Above Average) → 6</option>
                    <option value="5">C (Average) → 5</option>
                    <option value="4">P (Pass) → 4</option>
                    <option value="0">F (Fail) → 0</option>
                </select>
            </label>
            <button class="deleteBtn">🗑️ Remove Subject</button>
        `;
        
        // Add delete functionality to each delete button
        subjectDiv.querySelector('.deleteBtn').addEventListener('click', () => {
            subjectDiv.remove();
            updateSubjectNumbers();
        });

        gradeInputs.appendChild(subjectDiv);
    }

    // Function to update subject numbers after deletion
    function updateSubjectNumbers() {
        const subjects = document.querySelectorAll('.subject');
        subjects.forEach((subject, index) => {
            const h3 = subject.querySelector('h3');
            h3.textContent = `📖 Subject ${index + 1}`;
        });
    }

    // Attach addSubject to "Add Subject" button click
    document.getElementById("addSubjectBtn").addEventListener("click", addSubject);

    // Function to calculate SGPA and display Total Credits and Total Grade Points
    function calculateGPA() {
        const calculateBtn = document.getElementById('calculateGpaBtn');
        const credits = document.querySelectorAll('.credits');
        const letterGrades = document.querySelectorAll('.letterGrade');

        // Add loading state
        calculateBtn.classList.add('loading');
        calculateBtn.disabled = true;

        // Simulate calculation time for better UX
        setTimeout(() => {
            let totalGradePoints = 0;
            let totalCredits = 0;
            let validSubjects = 0;

            credits.forEach((creditInput, index) => {
                const creditValue = parseFloat(creditInput.value);
                const gradePointValue = parseFloat(letterGrades[index].value);

                if (!isNaN(creditValue) && !isNaN(gradePointValue)) {
                    totalGradePoints += gradePointValue * creditValue;
                    totalCredits += creditValue;
                    validSubjects++;
                }
            });

            const sgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;

            // Display the calculated values with better formatting
            document.getElementById('totalCredits').innerHTML = `
                <h2>📊 Total Credits</h2>
                <div style="font-size: 1.5em; color: #667eea; font-weight: bold;">
                    ${totalCredits}
                </div>
            `;
            
            document.getElementById('totalGradePoints').innerHTML = `
                <h2>📈 Total Grade Points</h2>
                <div style="font-size: 1.5em; color: #667eea; font-weight: bold;">
                    ${totalGradePoints}
                </div>
            `;
            
            document.getElementById('gpaResult').innerHTML = `
                <h2>🎯 Your SGPA</h2>
                <div style="font-size: 2em; color: #667eea; font-weight: bold; margin: 20px 0;">
                    ${sgpa}
                </div>
                <p>Based on ${validSubjects} subject(s)</p>
            `;

            // Remove loading state
            calculateBtn.classList.remove('loading');
            calculateBtn.disabled = false;
        }, 800);
    }

    // Attach calculateGPA to "Calculate SGPA" button click
    document.getElementById("calculateGpaBtn").addEventListener("click", calculateGPA);

    // Reset function to clear all fields and results
    function resetCalculator() {
        gradeInputs.innerHTML = ''; // Clear all subjects
        document.getElementById('totalCredits').innerHTML = '';
        document.getElementById('totalGradePoints').innerHTML = '';
        document.getElementById('gpaResult').innerHTML = '';
    }

    // Attach reset function to "Reset" button click
    document.getElementById("resetBtn").addEventListener("click", resetCalculator);

    // Add first subject automatically when page loads
    addSubject();
});
