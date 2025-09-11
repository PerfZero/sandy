const swiper = new Swiper('.product__swiper', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },
});

// Управление попапом
const openBtn = document.getElementById('openFillingPopup');
const closeBtn = document.getElementById('closeFillingPopup');
const popup = document.getElementById('fillingPopup');
const overlay = popup.querySelector('.filling-popup__overlay');

openBtn.addEventListener('click', () => {
    popup.classList.add('filling-popup--active');
    document.body.style.overflow = 'hidden';
});

closeBtn.addEventListener('click', () => {
    popup.classList.remove('filling-popup--active');
    document.body.style.overflow = '';
});

overlay.addEventListener('click', () => {
    popup.classList.remove('filling-popup--active');
    document.body.style.overflow = '';
});

// Управление чекбоксом "Выбрать все"
const selectAllCheckbox = document.getElementById('selectAll');
const selectAllLabel = document.querySelector('.filling-popup__select-all');
const itemCheckboxes = document.querySelectorAll('.filling-popup__item-checkbox input[type="checkbox"]');

selectAllCheckbox.addEventListener('change', function() {
    if (this.checked) {
        selectAllLabel.classList.add('checked');
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = true;
        });
    } else {
        selectAllLabel.classList.remove('checked');
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }
    updateTotal();
});

// Управление отдельными чекбоксами
itemCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        updateSelectAllState();
        updateTotal();
    });
});

// Управление кнопками количества
const quantityBtns = document.querySelectorAll('.filling-popup__quantity-btn');
quantityBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const quantitySpan = this.parentElement.querySelector('.filling-popup__quantity');
        let quantity = parseInt(quantitySpan.textContent);
        
        if (this.textContent === '-') {
            if (quantity > 0) {
                quantity--;
            }
        } else if (this.textContent === '+') {
            quantity++;
        }
        
        quantitySpan.textContent = quantity;
        updateTotal();
    });
});

// Функция обновления состояния "Выбрать все"
function updateSelectAllState() {
    const checkedCount = document.querySelectorAll('.filling-popup__item-checkbox input[type="checkbox"]:checked').length;
    const totalCount = itemCheckboxes.length;
    
    if (checkedCount === totalCount) {
        selectAllCheckbox.checked = true;
        selectAllLabel.classList.add('checked');
    } else if (checkedCount === 0) {
        selectAllCheckbox.checked = false;
        selectAllLabel.classList.remove('checked');
    } else {
        selectAllCheckbox.checked = false;
        selectAllLabel.classList.remove('checked');
    }
}

// Функция обновления общей суммы и отображения выбранных товаров
function updateTotal() {
    let total = 0;
    const selectedItemsContainer = document.getElementById('selectedItems');
    selectedItemsContainer.innerHTML = '';
    
    itemCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const item = checkbox.closest('.filling-popup__item');
            const quantity = parseInt(item.querySelector('.filling-popup__quantity').textContent);
            const priceText = item.querySelector('.filling-popup__item-price').textContent;
            const price = parseInt(priceText.replace(/\D/g, ''));
            const title = item.querySelector('.filling-popup__item-title').textContent;
            const image = item.querySelector('.filling-popup__item-image').src;
            
            if (quantity > 0) {
                total += quantity * price;
                
                // Создаем элемент выбранного товара
                const selectedItem = document.createElement('div');
                selectedItem.className = 'filling-popup__item';
                const totalPrice = quantity * price;
                selectedItem.innerHTML = `
                    <img src="${image}" alt="${title}" class="filling-popup__item-image">
                    <h3 class="filling-popup__item-title">${title}</h3>
                    <div class="filling-popup__item-info">${priceText} x ${quantity} ед.</div>
                    <div class="filling-popup__item-total">${totalPrice.toLocaleString()} KZT</div>
                `;
                selectedItemsContainer.appendChild(selectedItem);
            }
        }
    });
    
    const totalElement = document.querySelector('.filling-popup__total-price');
    totalElement.textContent = total.toLocaleString() + ' KZT';
}

// Кнопка очистки
const clearBtn = document.querySelector('.filling-popup__clear');
clearBtn.addEventListener('click', function() {
    itemCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('.filling-popup__quantity').forEach(span => {
        span.textContent = '0';
    });
    updateSelectAllState();
    updateTotal();
});

// Кнопка сохранения
const saveBtn = document.querySelector('.filling-popup__save-btn');
saveBtn.addEventListener('click', function() {
    const selectedItems = [];
    
    itemCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const item = checkbox.closest('.filling-popup__item');
            const name = item.querySelector('.filling-popup__item-title').textContent;
            const quantity = parseInt(item.querySelector('.filling-popup__quantity').textContent);
            const priceText = item.querySelector('.filling-popup__item-price').textContent;
            const price = parseInt(priceText.replace(/\D/g, ''));
            
            selectedItems.push({
                name: name,
                quantity: quantity,
                price: price,
                total: quantity * price
            });
        }
    });
    
    console.log('Выбранные товары:', selectedItems);
    alert('Товары добавлены в корзину!');
    popup.classList.remove('filling-popup--active');
    document.body.style.overflow = '';
});

// Управление попапом корзины
const cartCloseBtn = document.getElementById('closeCartPopup');
const cartPopup = document.getElementById('cartPopup');

// Обработчики для кнопок корзины в хедере
const headerCartButtons = document.querySelectorAll('.header__button--cart');
headerCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        updateCartDisplay();
        cartPopup.classList.add('filling-popup--active');
        document.body.style.overflow = 'hidden';
    });
});

// Обработчики для кнопок корзины в мобильном меню
const mobileCartButtons = document.querySelectorAll('.mobile-menu__button--cart');
mobileCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        // Закрываем мобильное меню
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.remove('mobile-menu--active');
            document.body.style.overflow = '';
        }
        updateCartDisplay();
        cartPopup.classList.add('filling-popup--active');
        document.body.style.overflow = 'hidden';
    });
});

if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', () => {
        cartPopup.classList.remove('filling-popup--active');
        document.body.style.overflow = '';
    });
}

if (cartPopup) {
    const cartOverlay = cartPopup.querySelector('.filling-popup__overlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            cartPopup.classList.remove('filling-popup--active');
            document.body.style.overflow = '';
        });
    }
}

// Функция обновления отображения корзины
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = cartPopup.querySelector('.filling-popup__total-price');
    cartItemsContainer.innerHTML = '';
    
    let cartTotal = 0;
    
    itemCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            const item = checkbox.closest('.filling-popup__item');
            const quantity = parseInt(item.querySelector('.filling-popup__quantity').textContent);
            const priceText = item.querySelector('.filling-popup__item-price').textContent;
            const price = parseInt(priceText.replace(/\D/g, ''));
            const title = item.querySelector('.filling-popup__item-title').textContent;
            const image = item.querySelector('.filling-popup__item-image').src;
            
            if (quantity > 0) {
                cartTotal += quantity * price;
                
                // Создаем элемент товара в корзине с полной структурой
                const cartItem = document.createElement('div');
                cartItem.className = 'filling-popup__item';
                cartItem.innerHTML = `
                    <label class="filling-popup__item-checkbox">
                        <input type="checkbox" checked>
                        <span class="filling-popup__checkmark"></span>
                    </label>
                    <img src="${image}" alt="${title}" class="filling-popup__item-image">
                    <h3 class="filling-popup__item-title">${title}</h3>
                    <div class="filling-popup__item-controls">
                        <button class="filling-popup__quantity-btn">-</button>
                        <span class="filling-popup__quantity">${quantity}</span>
                        <button class="filling-popup__quantity-btn">+</button>
                    </div>
                    <div class="filling-popup__item-price">${priceText}</div>
                    <div class="filling-popup__item-more">
                        <span class="filling-popup__dot"></span>
                        <span class="filling-popup__dot"></span>
                        <span class="filling-popup__dot"></span>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            }
        }
    });
    
    if (cartTotalElement) {
        cartTotalElement.textContent = cartTotal.toLocaleString() + ' KZT';
    }
    
    // Переинициализируем обработчики для новых элементов
    initCartPopup();
}

// Функция обновления общей суммы в корзине
function updateCartTotal() {
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
    const cartSelectAllCheckbox = document.getElementById('selectAllCart');
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
    const cartSelectAllCheckbox = document.getElementById('selectAllCart');
    const cartItemCheckboxes = cartPopup.querySelectorAll('.filling-popup__item-checkbox input[type="checkbox"]');
    const cartQuantityBtns = cartPopup.querySelectorAll('.filling-popup__quantity-btn');
    const cartClearBtn = cartPopup.querySelector('.filling-popup__clear');
    const cartSaveBtn = cartPopup.querySelector('.filling-popup__save-btn');

    if (!cartSelectAllCheckbox || !cartItemCheckboxes.length) return;

    // Обработчик для "Выбрать все" в корзине
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
            cartSelectAllCheckbox.checked = false;
            const selectAllLabel = cartSelectAllCheckbox.closest('.filling-popup__select-all');
            selectAllLabel.classList.remove('checked');
            updateCartTotal();
        });
    }

    // Обработчик для кнопки "Оформить заказ" в корзине
    if (cartSaveBtn) {
        cartSaveBtn.addEventListener('click', () => {
            alert('Заказ оформлен!');
            cartPopup.classList.remove('filling-popup--active');
            document.body.style.overflow = '';
        });
    }
}

// Инициализация
updateTotal();
initCartPopup();
updateCartTotal();
