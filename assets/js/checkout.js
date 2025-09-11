// Управление радиокнопками доставки
const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
const pickupDetails = document.getElementById('pickupDetails');
const deliveryDetails = document.getElementById('deliveryDetails');

deliveryRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        // Обновляем визуальное состояние всех радиокнопок доставки
        deliveryRadios.forEach(r => {
            const label = r.closest('.checkout__option-label');
            const option = r.closest('.checkout__option');
            if (r.checked) {
                label.classList.add('checked');
                option.classList.add('checkout__option--active');
            } else {
                label.classList.remove('checked');
                option.classList.remove('checkout__option--active');
            }
        });

        // Показываем/скрываем детали в зависимости от выбранной опции
        if (this.value === 'pickup') {
            pickupDetails.style.display = 'flex';
            deliveryDetails.style.display = 'none';
        } else if (this.value === 'delivery') {
            pickupDetails.style.display = 'none';
            deliveryDetails.style.display = 'flex';
        }
    });
});

// Управление радиокнопками оплаты
const paymentRadios = document.querySelectorAll('input[name="payment"]');
const paymentNowDetails = document.getElementById('paymentNowDetails');

paymentRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        // Обновляем визуальное состояние всех радиокнопок оплаты
        paymentRadios.forEach(r => {
            const label = r.closest('.checkout__option-label');
            const option = r.closest('.checkout__option');
            if (r.checked) {
                label.classList.add('checked');
                option.classList.add('checkout__option--active');
            } else {
                label.classList.remove('checked');
                option.classList.remove('checkout__option--active');
            }
        });

        // Показываем/скрываем подварианты для "Оплатить сейчас"
        if (this.value === 'now') {
            paymentNowDetails.style.display = 'block';
        } else {
            paymentNowDetails.style.display = 'none';
        }
    });
});

// Управление подвариантами оплаты
const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
paymentMethodRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        // Обновляем визуальное состояние всех радиокнопок методов оплаты
        paymentMethodRadios.forEach(r => {
            const label = r.closest('.checkout__payment-method');
            if (r.checked) {
                label.classList.add('checked');
            } else {
                label.classList.remove('checked');
            }
        });
    });
});

// Управление радиокнопками получателя
const recipientRadios = document.querySelectorAll('input[name="recipient"]');
const recipientDetails = document.getElementById('recipientDetails');

recipientRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        // Обновляем визуальное состояние всех радиокнопок получателя
        recipientRadios.forEach(r => {
            const option = r.closest('.checkout__recipient-option');
            if (r.checked) {
                option.classList.add('checked');
            } else {
                option.classList.remove('checked');
            }
        });

        // Показываем/скрываем поля для другого получателя
        if (this.value === 'other') {
            recipientDetails.style.display = 'block';
        } else {
            recipientDetails.style.display = 'none';
        }
    });
});

// Управление кнопками комментариев
const commentBtns = document.querySelectorAll('.checkout__comment-btn');
commentBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Переключаем состояние кнопки
        if (this.classList.contains('checkout__comment-btn--filled')) {
            this.classList.remove('checkout__comment-btn--filled');
            this.classList.add('checkout__comment-btn--outline');
        } else {
            this.classList.remove('checkout__comment-btn--outline');
            this.classList.add('checkout__comment-btn--filled');
        }
    });
});

// Кнопка подтверждения заказа
const confirmBtn = document.querySelector('.checkout__confirm-btn');
confirmBtn.addEventListener('click', function() {
    // Генерируем случайный номер заказа
    const orderNumber = Math.floor(Math.random() * 900000) + 100000;
    document.querySelector('.success-popup__order-number').textContent = `Номер заказа ${orderNumber}`;
    
    // Показываем попап успеха
    document.getElementById('successPopup').classList.add('success-popup--active');
    document.body.style.overflow = 'hidden';
});

// Функционал промокода
const promoPopup = document.getElementById('promoPopup');
const openPromoBtn = document.getElementById('openPromoPopup');
const closePromoBtn = document.getElementById('closePromoPopup');
const cancelPromoBtn = document.getElementById('cancelPromo');
const applyPromoBtn = document.getElementById('applyPromo');
const promoInput = document.getElementById('promoInput');
const promoMessage = document.getElementById('promoMessage');
const totalPriceElement = document.getElementById('totalPrice');
const promoLink = document.querySelector('.checkout__promo-link');

// База промокодов
const promoCodes = {
    'SALE10': { discount: 10, type: 'percent' },
    'SALE20': { discount: 20, type: 'percent' },
    'FIXED1000': { discount: 1000, type: 'fixed' },
    'FIXED5000': { discount: 5000, type: 'fixed' }
};

let originalTotal = 377200; // Исходная сумма
let currentTotal = originalTotal;
let appliedPromo = null;

// Открытие попапа промокода
openPromoBtn.addEventListener('click', function(e) {
    e.preventDefault();
    promoPopup.classList.add('promo-popup--active');
    document.body.style.overflow = 'hidden';
    promoInput.focus();
});

// Закрытие попапа промокода
function closePromoPopup() {
    promoPopup.classList.remove('promo-popup--active');
    document.body.style.overflow = '';
    promoInput.value = '';
    promoMessage.textContent = '';
}

closePromoBtn.addEventListener('click', closePromoPopup);
cancelPromoBtn.addEventListener('click', closePromoPopup);

// Закрытие по клику на overlay
promoPopup.querySelector('.promo-popup__overlay').addEventListener('click', closePromoPopup);

// Применение промокода
applyPromoBtn.addEventListener('click', function() {
    const promoCode = promoInput.value.trim().toUpperCase();
    
    if (!promoCode) {
        promoMessage.textContent = 'Введите промокод';
        promoMessage.className = 'promo-popup__message promo-popup__message--error';
        return;
    }

    if (promoCodes[promoCode]) {
        const promo = promoCodes[promoCode];
        let discount = 0;
        
        if (promo.type === 'percent') {
            discount = Math.round(originalTotal * promo.discount / 100);
        } else if (promo.type === 'fixed') {
            discount = promo.discount;
        }

        currentTotal = Math.max(0, originalTotal - discount);
        appliedPromo = { code: promoCode, discount: discount, type: promo.type };
        
        updateTotalDisplay();
        updatePromoLink();
        
        promoMessage.textContent = `Промокод "${promoCode}" применен! Скидка: ${discount.toLocaleString()} KZT`;
        promoMessage.className = 'promo-popup__message promo-popup__message--success';
        
        setTimeout(closePromoPopup, 2000);
    } else {
        promoMessage.textContent = 'Промокод не найден';
        promoMessage.className = 'promo-popup__message promo-popup__message--error';
    }
});

// Применение промокода по Enter
promoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        applyPromoBtn.click();
    }
});

// Обновление отображения общей суммы
function updateTotalDisplay() {
    totalPriceElement.textContent = currentTotal.toLocaleString() + ' KZT';
}

// Обновление ссылки промокода
function updatePromoLink() {
    if (appliedPromo) {
        promoLink.textContent = `Промокод: ${appliedPromo.code} (-${appliedPromo.discount.toLocaleString()} KZT)`;
        promoLink.style.color = '#ff6565';
    } else {
        promoLink.textContent = 'Промокод +';
        promoLink.style.color = '#7e5c45';
    }
}

// Удаление промокода при клике на ссылку (если промокод уже применен)
promoLink.addEventListener('click', function(e) {
    if (appliedPromo) {
        e.preventDefault();
        appliedPromo = null;
        currentTotal = originalTotal;
        updateTotalDisplay();
        updatePromoLink();
    }
});

// Функционал попапа карты
const mapPopup = document.getElementById('mapPopup');
const openMapBtn = document.getElementById('openMapPopup');
const openMapBtn2 = document.getElementById('openMapPopup2');
const closeMapBtn = document.getElementById('closeMapPopup');
const cancelMapBtn = document.getElementById('cancelMap');
const confirmMapBtn = document.getElementById('confirmMap');
const mapAddressInput = document.getElementById('mapAddressInput');
const addressInputs = document.querySelectorAll('.checkout__option-input');

let yandexMap = null;
let mapPlacemark = null;

// Инициализация Яндекс карты
function initYandexMap() {
    if (typeof ymaps === 'undefined') {
        console.error('Yandex Maps API не загружен');
        return;
    }

    ymaps.ready(function () {
        // Координаты Астаны (долгота, широта)
        const astanaCoords = [71.4307, 51.1801];
        
        yandexMap = new ymaps.Map('yandexMap', {
            center: astanaCoords,
            zoom: 6,
            controls: ['zoomControl', 'fullscreenControl'],
            restrictMapArea: [
                [46.0, 40.5], // Юго-запад (долгота, широта)
                [87.0, 55.5]  // Северо-восток (долгота, широта)
            ]
        });

        // Создаем метку
        mapPlacemark = new ymaps.Placemark(astanaCoords, {
            balloonContent: 'Выбранный адрес'
        }, {
            draggable: true
        });

        yandexMap.geoObjects.add(mapPlacemark);

        // Добавляем точки самовывоза
        const pickupPoints = [
            {
                coords: [71.4307, 51.1801], // Астана (долгота, широта)
                title: 'Астана. Проспект Улы Дала 45/1',
                time: 'с 9 до 22'
            },
            {
                coords: [76.9126, 43.2220], // Алматы (долгота, широта)
                title: 'Алматы. ул. Абая 150',
                time: 'с 9 до 22'
            },
            {
                coords: [69.5950, 42.8746], // Шымкент (долгота, широта)
                title: 'Шымкент. ул. Байтурсынова 12',
                time: 'с 9 до 22'
            }
        ];

        pickupPoints.forEach(point => {
            const placemark = new ymaps.Placemark(point.coords, {
                balloonContent: `<div><strong>${point.title}</strong><br>Время работы: ${point.time}</div>`
            }, {
                preset: 'islands#redDotIcon',
                iconColor: '#ff6565'
            });
            yandexMap.geoObjects.add(placemark);
        });

        // Обработчик клика по карте
        yandexMap.events.add('click', function (e) {
            const coords = e.get('coords');
            
            // Удаляем старую метку
            yandexMap.geoObjects.remove(mapPlacemark);
            
            // Создаем новую метку
            mapPlacemark = new ymaps.Placemark(coords, {
                balloonContent: 'Выбранный адрес'
            }, {
                draggable: true
            });
            
            yandexMap.geoObjects.add(mapPlacemark);
            
            // Получаем адрес по координатам
            getAddressByCoords(coords);
        });

        // Обработчик перетаскивания метки
        mapPlacemark.events.add('dragend', function () {
            const coords = mapPlacemark.geometry.getCoordinates();
            getAddressByCoords(coords);
        });
    });
}

// Получение адреса по координатам
function getAddressByCoords(coords) {
    ymaps.geocode(coords).then(function (res) {
        const firstGeoObject = res.geoObjects.get(0);
        const address = firstGeoObject.getAddressLine();
        mapAddressInput.value = address;
    });
}

// Открытие попапа карты
function openMapPopup() {
    mapPopup.classList.add('map-popup--active');
    document.body.style.overflow = 'hidden';
    
    // Инициализируем карту при первом открытии
    if (!yandexMap) {
        setTimeout(initYandexMap, 100);
    }
}

openMapBtn.addEventListener('click', function(e) {
    e.preventDefault();
    openMapPopup();
});

openMapBtn2.addEventListener('click', function(e) {
    e.preventDefault();
    openMapPopup();
});

// Закрытие попапа карты
function closeMapPopup() {
    mapPopup.classList.remove('map-popup--active');
    document.body.style.overflow = '';
}

closeMapBtn.addEventListener('click', closeMapPopup);
cancelMapBtn.addEventListener('click', closeMapPopup);

// Закрытие по клику на overlay
mapPopup.querySelector('.map-popup__overlay').addEventListener('click', closeMapPopup);

// Подтверждение выбора адреса
confirmMapBtn.addEventListener('click', function() {
    const selectedAddress = mapAddressInput.value;
    
    // Обновляем все поля адреса
    addressInputs.forEach(input => {
        input.value = selectedAddress;
    });
    
    closeMapPopup();
});

// Функционал попапа успеха
const successPopup = document.getElementById('successPopup');
const closeSuccessBtn = document.getElementById('closeSuccessPopup');
const continueShoppingBtn = document.getElementById('continueShopping');

// Закрытие попапа успеха
function closeSuccessPopup() {
    successPopup.classList.remove('success-popup--active');
    document.body.style.overflow = '';
}

closeSuccessBtn.addEventListener('click', closeSuccessPopup);
continueShoppingBtn.addEventListener('click', function() {
    closeSuccessPopup();
    // Можно добавить редирект на главную или каталог
    // window.location.href = 'index.html';
});

// Закрытие по клику на overlay
successPopup.querySelector('.success-popup__overlay').addEventListener('click', closeSuccessPopup);


// Функционал счетчика корзины
const cartCount = document.getElementById('cartCount');
const mobileCartCount = document.getElementById('mobileCartCount');

// Функция обновления счетчика корзины
function updateCartCount() {
    // Подсчитываем количество товаров в заказе
    const orderItems = document.querySelectorAll('.checkout__item');
    const totalItems = orderItems.length;
    
    cartCount.textContent = totalItems;
    mobileCartCount.textContent = totalItems;
}

// Инициализация счетчика
updateCartCount();

// Инициализация состояния радиокнопок
deliveryRadios.forEach(radio => {
    if (radio.checked) {
        radio.closest('.checkout__option-label').classList.add('checked');
        radio.closest('.checkout__option').classList.add('checkout__option--active');
    }
});

paymentRadios.forEach(radio => {
    if (radio.checked) {
        radio.closest('.checkout__option-label').classList.add('checked');
        radio.closest('.checkout__option').classList.add('checkout__option--active');
    }
});

recipientRadios.forEach(radio => {
    if (radio.checked) {
        radio.closest('.checkout__recipient-option').classList.add('checked');
    }
});
