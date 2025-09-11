// Функционал мобильного меню
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');

// Открытие мобильного меню
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.add('mobile-menu--active');
        document.body.style.overflow = 'hidden';
    });
}

// Закрытие мобильного меню
function closeMobileMenu() {
    mobileMenu.classList.remove('mobile-menu--active');
    document.body.style.overflow = '';
}

if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
}

if (mobileMenu) {
    const overlay = mobileMenu.querySelector('.mobile-menu__overlay');
    if (overlay) {
        overlay.addEventListener('click', closeMobileMenu);
    }
}
