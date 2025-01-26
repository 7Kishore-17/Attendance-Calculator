function calculateAttendance(attended, total) {
    return total === 0 ? 0 : (attended / total) * 100;
}

function checkAttendance(attended, total, threshold) {
    const percentage = calculateAttendance(attended, total);
    return { percentage, meetsThreshold: percentage >= threshold };
}

function classesNeeded(attended, total, threshold) {
    let requiredClasses = 0;
    while (calculateAttendance(attended + requiredClasses, total + requiredClasses) < threshold) {
        requiredClasses++;
    }
    return requiredClasses;
}

function classesCanSkip(attended, total, threshold) {
    let requiredClasses = 0;
    while (calculateAttendance(attended, total + requiredClasses) >= threshold) {
        requiredClasses++;
    }
    return requiredClasses - 1;
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    updateDarkModeButton();
}

function updateDarkModeButton() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}

function showCopyrightInfo() {
    const currentYear = new Date().getFullYear();
    alert(`© ${currentYear} Student Attendance Calculator\n\nDeveloped by Kishore\nAll rights reserved.`);
}

function validateInput() {
    const attendedClasses = parseInt(document.getElementById('attended').value);
    const totalClasses = parseInt(document.getElementById('total').value);
    
    if (attendedClasses > totalClasses) {
        alert("Warning: Classes attended cannot be more than total classes!");
        location.reload();
        return false;
    }
    return true;
}

function handleEnterKey(event, nextElementId) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById(nextElementId).focus();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const calculateButton = document.getElementById('calculate');
    const confirmSkipButton = document.getElementById('confirmSkip');
    const closeButton = document.querySelector('.close');
    const skipModal = document.getElementById('skipModal');
    const copyrightBtn = document.getElementById('copyrightBtn');

    // Set initial dark mode state
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    updateDarkModeButton();

    darkModeToggle.addEventListener('click', toggleDarkMode);
    copyrightBtn.addEventListener('click', showCopyrightInfo);

    // Add event listeners for Enter key navigation
    document.getElementById('attended').addEventListener('keypress', (e) => handleEnterKey(e, 'total'));
    document.getElementById('total').addEventListener('keypress', (e) => handleEnterKey(e, 'threshold'));
    document.getElementById('threshold').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            calculateButton.click();
        }
    });

    calculateButton.addEventListener('click', function() {
        if (!validateInput()) return;

        const attendedClasses = parseInt(document.getElementById('attended').value);
        const totalClasses = parseInt(document.getElementById('total').value);
        const thresholdPercentage = parseFloat(document.getElementById('threshold').value);

        const { percentage, meetsThreshold } = checkAttendance(attendedClasses, totalClasses, thresholdPercentage);
        const neededClasses = classesNeeded(attendedClasses, totalClasses, thresholdPercentage);
        const maxSkips = classesCanSkip(attendedClasses, totalClasses, thresholdPercentage);

        let resultMessage = `<h2>Attendance Summary</h2>`;
        resultMessage += `<p>Current Attendance Percentage: <span class="highlight">${percentage.toFixed(2)}%</span></p>`;
       
        if (meetsThreshold) {
            resultMessage += `<p>You can skip up to <span class="highlight">${maxSkips}</span> classes.</p>`;
        } else {
            resultMessage += `<p>Attend <span class="highlight">${neededClasses}</span> more classes to reach ${thresholdPercentage}%.`;
        }

        document.getElementById('result').innerHTML = resultMessage;

        // Show modal for skipping classes
        skipModal.style.display = "block";
        document.getElementById('skipClasses').focus();
    });

    confirmSkipButton.addEventListener('click', function() {
        const skipClasses = parseInt(document.getElementById('skipClasses').value);
        const totalClasses = parseInt(document.getElementById('total').value);
        const attendedClasses = parseInt(document.getElementById('attended').value);
        const thresholdPercentage = parseFloat(document.getElementById('threshold').value);

        const updatedTotal = totalClasses + skipClasses;
        const newAttendancePercentage = calculateAttendance(attendedClasses, updatedTotal);

        let newResultMessage = `<h2>Updated Attendance Percentage</h2>`;
        newResultMessage += `<p>After skipping, Attendance Percentage: <span class="highlight">${newAttendancePercentage.toFixed(2)}%</span></p>`;
       
        if (newAttendancePercentage < thresholdPercentage) {
            const additionalClassesNeeded = classesNeeded(attendedClasses, updatedTotal, thresholdPercentage);
            newResultMessage += `<p>You need to attend <span class="highlight">${additionalClassesNeeded}</span> more classes to meet the threshold.</p>`;
        }

        document.getElementById('result').innerHTML += newResultMessage;

        // Hide modal
        skipModal.style.display = "none";
    });

    // Close modal on click
    closeButton.addEventListener('click', function() {
        skipModal.style.display = "none";
    });

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target === skipModal) {
            skipModal.style.display = "none";
        }
    };

    // Add event listener for Enter key in skip classes input
    document.getElementById('skipClasses').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            confirmSkipButton.click();
        }
    });
});