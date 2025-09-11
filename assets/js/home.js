// Функции для работы с модальными окнами авторизации
function showAuthPopup(popupId) {
    console.log('Открываем попап:', popupId);
    // Закрываем все попапы
    document.querySelectorAll('.auth-popup').forEach(popup => {
        popup.classList.remove('auth-popup--active');
    });
    // Открываем нужный попап
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.classList.add('auth-popup--active');
        console.log('Попап открыт');
    } else {
        console.error('Попап не найден:', popupId);
    }
}

function closeAuthPopup(popupId) {
    document.getElementById(popupId).classList.remove('auth-popup--active');
}

function showCodePopup(type) {
    if (type === 'register') {
        closeAuthPopup('registerPopup');
        showAuthPopup('registerCodePopup');
    } else if (type === 'login') {
        closeAuthPopup('loginPopup');
        showAuthPopup('loginCodePopup');
    }
}

function confirmCode(type) {
    if (type === 'error') {
        // Показываем попап с ошибкой
        closeAuthPopup('loginCodePopup');
        showAuthPopup('errorCodePopup');
    } else {
        // Успешная авторизация - закрываем все попапы
        document.querySelectorAll('.auth-popup').forEach(popup => {
            popup.classList.remove('auth-popup--active');
        });
        // Здесь можно добавить логику успешной авторизации
        alert('Успешная авторизация!');
    }
}

// Обработчик для кнопки "Войти" в хедере
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен');
    const loginButtons = document.querySelectorAll('.header__button--login, .mobile-menu__button--login');
    console.log('Найдено кнопок входа:', loginButtons.length);
    loginButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Клик по кнопке входа');
            showAuthPopup('loginPopup');
        });
    });
});

// Закрытие попапа при клике на фон
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('auth-popup')) {
            e.target.classList.remove('auth-popup--active');
        }
    });
});
