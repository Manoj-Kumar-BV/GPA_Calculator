document.addEventListener("DOMContentLoaded", () => {
    const gradeInputs = document.getElementById('gradeInputs');

    // Function to add a new subject with credits, letter grade input, and delete button
    function addSubject() {
        const subjectDiv = document.createElement('div');
        subjectDiv.classList.add('subject');
        subjectDiv.innerHTML = `
            <label>Credits: 
                <input type="number" min="1" step="1" class="credits" required>
            </label>

            <label>Select Letter Grade: 
                <select class="letterGrade" required>
                    <option value="">Select</option>
                    <option value="10">O-->(10)</option>
                    <option value="9">A+-->(9)</option>
                    <option value="8">A-->(8)</option>
                    <option value="7">B+-->(7)</option>
                    <option value="6">B-->(6)</option>
                    <option value="5">C-->(5)</option>
                    <option value="4">P-->(4)</option>
                    <option value="0">F-->(0)</option>
                </select>
            </label>
            <button class="deleteBtn">Delete</button> <!-- Delete button for each subject -->
        `;
        
        // Add delete functionality to each delete button
        subjectDiv.querySelector('.deleteBtn').addEventListener('click', () => {
            subjectDiv.remove();
        });

        gradeInputs.appendChild(subjectDiv);
    }

    // Attach addSubject to "Add Subject" button click
    document.getElementById("addSubjectBtn").addEventListener("click", addSubject);

    // Function to calculate SGPA and display Total Credits and Total Grade Points
    function calculateGPA() {
        const credits = document.querySelectorAll('.credits');
        const letterGrades = document.querySelectorAll('.letterGrade');

        let totalGradePoints = 0;
        let totalCredits = 0;

        credits.forEach((creditInput, index) => {
            const creditValue = parseFloat(creditInput.value);
            const gradePointValue = parseFloat(letterGrades[index].value);

            if (!isNaN(creditValue) && !isNaN(gradePointValue)) {
                totalGradePoints += gradePointValue * creditValue;
                totalCredits += creditValue;
            }
        });

        const sgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;

        // Display the calculated values
        document.getElementById('totalCredits').innerHTML = `<h2>Total Credits: ${totalCredits}</h2>`;
        document.getElementById('totalGradePoints').innerHTML = `<h2>Total Grade Points: ${totalGradePoints}</h2>`;
        document.getElementById('gpaResult').innerHTML = `<h2>Your SGPA: ${sgpa}</h2>`;
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
});
