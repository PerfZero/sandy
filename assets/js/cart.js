// Универсальный функционал корзины для всех страниц
document.addEventListener('DOMContentLoaded', function() {
    // Обработчики для кнопок корзины в хедере
    const headerCartButtons = document.querySelectorAll('.header__button--cart');
    headerCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            openCartPopup();
        });
    });

    // Обработчики для кнопок корзины в мобильном меню
    const mobileCartButtons = document.querySelectorAll('.mobile-menu__button--cart');
    mobileCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Закрываем мобильное меню
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu) {
                mobileMenu.classList.remove('mobile-menu--active');
                document.body.style.overflow = '';
            }
            openCartPopup();
        });
    });

    // Функция открытия попапа корзины
    function openCartPopup() {
        const cartPopup = document.getElementById('cartPopup');
        if (cartPopup) {
            updateCartDisplay();
            cartPopup.classList.add('filling-popup--active');
            document.body.style.overflow = 'hidden';
        } else {
            // Если попапа корзины нет, переходим на страницу корзины
            window.location.href = 'checkout.html';
        }
    }

    // Функция обновления отображения корзины
    function updateCartDisplay() {
        const cartPopup = document.getElementById('cartPopup');
        const cartItemsContainer = document.getElementById('cartItems');
        const cartTotalElement = cartPopup?.querySelector('.filling-popup__total-price');
        
        if (!cartPopup || !cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        
        let cartTotal = 0;
        
        // Получаем товары из localStorage или используем тестовые данные
        const cartItems = getCartItems();
        
        cartItems.forEach(item => {
            cartTotal += item.quantity * item.price;
            
            // Создаем элемент товара в корзине
            const cartItem = document.createElement('div');
            cartItem.className = 'filling-popup__item';
            cartItem.innerHTML = `
                <label class="filling-popup__item-checkbox">
                    <input type="checkbox" checked>
                    <span class="filling-popup__checkmark"></span>
                </label>
                <img src="${item.image}" alt="${item.title}" class="filling-popup__item-image">
                <h3 class="filling-popup__item-title">${item.title}</h3>
                <div class="filling-popup__item-controls">
                    <button class="filling-popup__quantity-btn">-</button>
                    <span class="filling-popup__quantity">${item.quantity}</span>
                    <button class="filling-popup__quantity-btn">+</button>
                </div>
                <div class="filling-popup__item-price">${item.price.toLocaleString()} KZT</div>
                <div class="filling-popup__item-more">
                    <span class="filling-popup__dot"></span>
                    <span class="filling-popup__dot"></span>
                    <span class="filling-popup__dot"></span>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        if (cartTotalElement) {
            cartTotalElement.textContent = cartTotal.toLocaleString() + ' KZT';
        }
        
        // Переинициализируем обработчики для новых элементов
        initCartPopup();
    }

    // Функция получения товаров корзины
    function getCartItems() {
        // Здесь можно получать данные из localStorage или API
        // Пока используем тестовые данные
        return [
            {
                title: 'Макаронс Фисташка - Малина',
                image: 'assets/img/macaron-1.png',
                price: 12400,
                quantity: 6
            },
            {
                title: 'Крамбл Кукис Шоколадный',
                image: 'assets/img/chocolate-cookie.png',
                price: 15000,
                quantity: 4
            },
            {
                title: 'Подарочная коробка',
                image: 'assets/img/gift-box.png',
                price: 25000,
                quantity: 2
            }
        ];
    }

    // Функция обновления общей суммы в корзине
    function updateCartTotal() {
        const cartPopup = document.getElementById('cartPopup');
        if (!cartPopup) return;
        
        const cartItemCheckboxes = cartPopup.querySelectorAll('.filling-popup__item-checkbox input[type="checkbox"]');
        let total = 0;
        cartItemCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const item = checkbox.closest('.filling-popup__item');
                const quantity = parseInt(item.querySelector('.filling-popup__quantity').textContent);
                const priceText = item.querySelector('.filling-popup__item-price').textContent;
                const price = parseInt(priceText.replace(/\D/g, ''));
                total += quantity * price;
            }
        });
        
        const totalElement = cartPopup.querySelector('.filling-popup__total-price');
        if (totalElement) {
            totalElement.textContent = total.toLocaleString() + ' KZT';
        }
    }

    // Функция обновления состояния "Выбрать все" в корзине
    function updateCartSelectAllState() {
        const cartPopup = document.getElementById('cartPopup');
        if (!cartPopup) return;
        
        const cartSelectAllCheckbox = document.getElementById('selectAllCart');
        if (!cartSelectAllCheckbox) return;
        
        const selectAllLabel = cartSelectAllCheckbox.closest('.filling-popup__select-all');
        const checkedBoxes = cartPopup.querySelectorAll('.filling-popup__item-checkbox input[type="checkbox"]:checked');
        const totalBoxes = cartPopup.querySelectorAll('.filling-popup__item-checkbox input[type="checkbox"]').length;
        
        if (checkedBoxes.length === 0) {
            cartSelectAllCheckbox.checked = false;
            selectAllLabel.classList.remove('checked');
        } else if (checkedBoxes.length === totalBoxes) {
            cartSelectAllCheckbox.checked = true;
            selectAllLabel.classList.add('checked');
        } else {
            cartSelectAllCheckbox.checked = false;
            selectAllLabel.classList.remove('checked');
        }
    }

    // Функционал для попапа корзины
    function initCartPopup() {
        const cartPopup = document.getElementById('cartPopup');
        if (!cartPopup) return;
        
        const cartSelectAllCheckbox = document.getElementById('selectAllCart');
        const cartItemCheckboxes = cartPopup.querySelectorAll('.filling-popup__item-checkbox input[type="checkbox"]');
        const cartQuantityBtns = cartPopup.querySelectorAll('.filling-popup__quantity-btn');
        const cartClearBtn = cartPopup.querySelector('.filling-popup__clear');
        const cartSaveBtn = cartPopup.querySelector('.filling-popup__save-btn');
        const cartCloseBtn = document.getElementById('closeCartPopup');

        // Обработчик для "Выбрать все" в корзине
        if (cartSelectAllCheckbox) {
            cartSelectAllCheckbox.addEventListener('change', function() {
                const isChecked = this.checked;
                const selectAllLabel = this.closest('.filling-popup__select-all');
                
                if (isChecked) {
                    selectAllLabel.classList.add('checked');
                } else {
                    selectAllLabel.classList.remove('checked');
                }
                
                cartItemCheckboxes.forEach(checkbox => {
                    checkbox.checked = isChecked;
                    const label = checkbox.closest('label');
                    if (isChecked) {
                        label.classList.add('checked');
                    } else {
                        label.classList.remove('checked');
                    }
                });
                updateCartTotal();
            });
        }

        // Обработчики для чекбоксов товаров в корзине
        cartItemCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const label = this.closest('label');
                if (this.checked) {
                    label.classList.add('checked');
                } else {
                    label.classList.remove('checked');
                }
                updateCartSelectAllState();
                updateCartTotal();
            });
        });

        // Обработчики для кнопок количества в корзине
        cartQuantityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const quantitySpan = this.parentElement.querySelector('.filling-popup__quantity');
                let quantity = parseInt(quantitySpan.textContent);
                
                // Определяем тип кнопки по позиции в контейнере
                const controls = this.parentElement;
                const buttons = controls.querySelectorAll('.filling-popup__quantity-btn');
                const isMinus = this === buttons[0];
                const isPlus = this === buttons[buttons.length - 1];
                
                if (isMinus && quantity > 0) {
                    quantity--;
                } else if (isPlus) {
                    quantity++;
                }
                
                quantitySpan.textContent = quantity;
                updateCartTotal();
            });
        });

        // Обработчик для кнопки "Очистить" в корзине
        if (cartClearBtn) {
            cartClearBtn.addEventListener('click', () => {
                cartItemCheckboxes.forEach(checkbox => {
                    checkbox.checked = false;
                    const label = checkbox.closest('label');
                    label.classList.remove('checked');
                });
                if (cartSelectAllCheckbox) {
                    cartSelectAllCheckbox.checked = false;
                    const selectAllLabel = cartSelectAllCheckbox.closest('.filling-popup__select-all');
                    selectAllLabel.classList.remove('checked');
                }
                updateCartTotal();
            });
        }

        // Обработчик для кнопки "Оформить заказ" в корзине
        if (cartSaveBtn) {
            cartSaveBtn.addEventListener('click', () => {
                window.location.href = 'checkout.html';
            });
        }

        // Обработчик для кнопки закрытия корзины
        if (cartCloseBtn) {
            cartCloseBtn.addEventListener('click', () => {
                cartPopup.classList.remove('filling-popup--active');
                document.body.style.overflow = '';
            });
        }

        // Закрытие по клику на overlay
        const overlay = cartPopup.querySelector('.filling-popup__overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                cartPopup.classList.remove('filling-popup--active');
                document.body.style.overflow = '';
            });
        }
    }

    // Функция обновления счетчика корзины
    function updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cartCount, #mobileCartCount');
        const cartItems = getCartItems();
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        
        cartCountElements.forEach(element => {
            if (element) {
                element.textContent = totalItems;
            }
        });
    }

    // Инициализация счетчика корзины
    updateCartCount();
});