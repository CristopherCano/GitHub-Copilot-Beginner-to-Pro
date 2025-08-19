// This file is intentionally left blank.// filepath: src/js/main.js

// input with id "username" on change
document.getElementById('username').addEventListener('input', function () {
    const username = this.value;
    const usernameRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (usernameRegex.test(username)) {
        this.style.border = '2px solid green';
        this.setAttribute('aria-invalid', 'false');
    } else {
        this.style.border = '2px solid red';
        this.setAttribute('aria-invalid', 'true');
    }
});

let barChartInstance = null;

document.getElementById('download-btn').addEventListener('click', function () {
    const canvas = document.getElementById('barChart');
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'chart.png';
    link.click();
});

document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('barChart');
    if (ctx) {
        barChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['January', 'February', 'March', 'April'],
                datasets: [{
                    label: 'Income',
                    data: [0, 0, 0, 0],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)'
                }, {
                    label: 'Expenses',
                    data: [0, 0, 0, 0],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });

        // Attach event listeners to all relevant inputs
        ['income-january', 'expenses-january', 'income-february', 'expenses-february',
         'income-march', 'expenses-march', 'income-april', 'expenses-april'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', updateBarChart);
            }
        });
    }
});

function getMonthlyData() {
    return {
        January: {
            income: Number(document.getElementById('income-january').value) || 0,
            expenses: Number(document.getElementById('expenses-january').value) || 0
        },
        February: {
            income: Number(document.getElementById('income-february').value) || 0,
            expenses: Number(document.getElementById('expenses-february').value) || 0
        },
        March: {
            income: Number(document.getElementById('income-march').value) || 0,
            expenses: Number(document.getElementById('expenses-march').value) || 0
        },
        April: {
            income: Number(document.getElementById('income-april').value) || 0,
            expenses: Number(document.getElementById('expenses-april').value) || 0
        }
    };
}

function updateBarChart() {
    if (!barChartInstance) return;
    const data = getMonthlyData();
    barChartInstance.data.datasets[0].data = [
        data.January.income,
        data.February.income,
        data.March.income,
        data.April.income
    ];
    barChartInstance.data.datasets[1].data = [
        data.January.expenses,
        data.February.expenses,
        data.March.expenses,
        data.April.expenses
    ];
    barChartInstance.update();
}