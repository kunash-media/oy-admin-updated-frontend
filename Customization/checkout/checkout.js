document.addEventListener('DOMContentLoaded', function() {
    // Toggle left navigation
    document.getElementById('menuIcon').addEventListener('click', function() {
        const leftNav = document.getElementById('leftNav');
        leftNav.style.display = leftNav.style.display === 'block' ? 'none' : 'block';
        document.querySelector('.main-content').classList.toggle('left-nav-active');
    });

    // Profile dropdown toggle
    document.getElementById('profileIcon').addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent the click from bubbling up
        const menu = document.getElementById('profileMenu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });

    // Close profile dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.profile-dropdown')) {
            document.getElementById('profileMenu').style.display = 'none';
        }
    });

    // Toggle submenus in left navigation
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
});