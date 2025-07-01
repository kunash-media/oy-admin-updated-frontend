document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('menuIcon').addEventListener('click', function() {
        const leftNav = document.getElementById('leftNav');
        leftNav.classList.toggle('active');
        leftNav.style.display = leftNav.style.display === 'block' ? 'none' : 'block';
    });


    document.getElementById('profileIcon').addEventListener('click', function() {
        const menu = document.getElementById('profileMenu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.profile-dropdown')) {
            document.getElementById('profileMenu').style.display = 'none';
        }
    });


    document.getElementById('onlineStoreToggle').addEventListener('click', function() {
        const sub = document.getElementById('onlineStoreSub');
        sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
    });

    document.getElementById('catalogToggle').addEventListener('click', function() {
        const sub = document.getElementById('catalogSub');
        sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
    });

    document.getElementById('customersToggle').addEventListener('click', function() {
        const sub = document.getElementById('customersSub');
        sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
    });


    let lineChart, pieChart;
    initCharts();

    function initCharts() {

        const ctxLine = document.getElementById('lineChart').getContext('2d');
        lineChart = new Chart(ctxLine, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Pending',
                    data: [12, 19, 15, 17, 14, 16],
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                }, {
                    label: 'Processing',
                    data: [8, 12, 10, 14, 11, 13],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                }, {
                    label: 'Delivered',
                    data: [15, 18, 20, 22, 19, 21],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                }, {
                    label: 'Cancelled',
                    data: [5, 7, 6, 8, 5, 6],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#666'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#666'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#666'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    }
                }
            }
        });

        // Pie Chart
        const ctxPie = document.getElementById('pieChart').getContext('2d');
        pieChart = new Chart(ctxPie, {
            type: 'pie',
            data: {
                labels: ['Card', 'Cash', 'Credit'],
                datasets: [{
                    label: 'Payment Methods',
                    data: [4, 1, 2],
                    backgroundColor: [
                        'rgba(153, 102, 255, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(54, 162, 235, 0.7)'
                    ],
                    borderColor: [
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#666'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
});

function toggleSelectAll(selectAllCheckbox) {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}


document.addEventListener('DOMContentLoaded', function() {
    const table = document.querySelector('.recent-orders table tbody');
    if (!table) return;

    table.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('dropdown-item')) {
            event.preventDefault();
            const selectedStatus = target.textContent.trim();

            const row = target.closest('tr');
            if (!row) return;

            const statusCell = row.querySelector('td:nth-child(7) span.badge');
            if (statusCell) {

                const statusClassMap = {
                    'Pending': 'bg-warning',
                    'Processing': 'bg-info',
                    'Delivered': 'bg-success',
                    'Cancel': 'bg-danger',
                    'Cancelled': 'bg-danger'
                };

                statusCell.className = 'badge';
                if (statusClassMap[selectedStatus]) {
                    statusCell.classList.add(statusClassMap[selectedStatus]);
                } else {

                    statusCell.classList.add('bg-secondary');
                }

                statusCell.textContent = selectedStatus;
            }


            const dropdown = target.closest('.dropdown');
            if (dropdown) {
                const button = dropdown.querySelector('button.dropdown-toggle');
                if (button) {
                    button.textContent = selectedStatus;
                }
            }
        }
    });
});