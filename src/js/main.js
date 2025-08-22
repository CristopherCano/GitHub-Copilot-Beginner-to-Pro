// This file is intentionally left blank.// filepath: src/js/main.js

// Username validation
const usernameInput = document.getElementById('username');
const usernameRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// ...existing code...

/**
 * Handles input events for a username field, validating the input against a regex.
 * Updates the input's border color and ARIA attribute based on validity.
 *
 * @param {Object} event - The input event object.
 * @param {HTMLInputElement} event.target - The input element being validated.
 */
function usernameInputCallback({ target }) {
    const isValid = usernameRegex.test(target.value);
    target.style.border = isValid ? '2px solid green' : '2px solid red';
    target.setAttribute('aria-invalid', String(!isValid));
}

usernameInput?.addEventListener('input', usernameInputCallback);

let barChartInstance = null;

// Download chart as PNG
document.getElementById('download-btn')?.addEventListener('click', () => {
    const canvas = document.getElementById('barChart');
    if (canvas) {
        const image = canvas.toDataURL('image/png');
        const link = Object.assign(document.createElement('a'), {
            href: image,
            download: 'chart.png'
        });
        link.click();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('barChart');
    if (ctx) {
        // Get initial values from the HTML inputs
        const initialData = getMonthlyData();
        barChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['January', 'February', 'March', 'April'],
                datasets: [
                    {
                        label: 'Income',
                        data: Object.values(initialData).map(m => m.income),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)'
                    },
                    {
                        label: 'Expenses',
                        data: Object.values(initialData).map(m => m.expenses),
                        backgroundColor: 'rgba(255, 99, 132, 0.5)'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        [
            'income-january', 'expenses-january',
            'income-february', 'expenses-february',
            'income-march', 'expenses-march',
            'income-april', 'expenses-april'
        ].forEach(id => {
            document.getElementById(id)?.addEventListener('input', updateBarChart);
        });
    }
});

const getMonthlyData = () => ['january', 'february', 'march', 'april'].reduce((acc, month) => {
    acc[month.charAt(0).toUpperCase() + month.slice(1)] = {
        income: Number(document.getElementById(`income-${month}`)?.value) || 0,
        expenses: Number(document.getElementById(`expenses-${month}`)?.value) || 0
    };
    return acc;
}, {});

function updateBarChart() {
    if (!barChartInstance) return;
    const data = getMonthlyData();
    barChartInstance.data.datasets[0].data = Object.values(data).map(m => m.income);
    barChartInstance.data.datasets[1].data = Object.values(data).map(m => m.expenses);
    barChartInstance.update();
}

// ...existing code...

document.getElementById('send-email-btn')?.addEventListener('click', async () => {
    const emailInput = document.getElementById('user-email');
    const canvas = document.getElementById('barChart');
    if (!emailInput || !canvas) return;

    const email = emailInput.value.trim();
    if (!email) {
        alert('Please enter a valid email address.');
        return;
    }

    const imageData = canvas.toDataURL('image/png');

    try {
        const response = await fetch('http://localhost:3000/send-chart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, imageData })
        });
        const result = await response.json();
        if (result.success) {
            alert('Chart sent to your email!');
        } else {
            alert('Failed to send email: ' + (result.error || 'Unknown error'));
        }
    } catch (err) {
        alert('Error sending email: ' + err.message);
    }
});

// ...existing code...