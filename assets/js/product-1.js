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


// Инициализация
updateTotal();
