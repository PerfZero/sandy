// Простая функциональность слайдера
const dots = document.querySelectorAll('.catalog__banner-dot');
const bannerContent = document.querySelector('.catalog__banner-content');

// Данные для слайдов
const slides = [
    {
        title: "Подари близкому настроение на весь день",
        description: "Вы можете заказать десерты в красивой подарочной упаковке",
        button: "Посмотреть боксы",
        image: "assets/img/gift-box.png"
    },
    {
        title: "Свежие десерты каждый день",
        description: "Мы готовим макаронс из натуральных ингредиентов",
        button: "Заказать сейчас",
        image: "assets/img/gift-box.png"
    },
    {
        title: "Доставка по всему городу",
        description: "Быстрая доставка свежих десертов к вашему столу",
        button: "Узнать больше",
        image: "assets/img/gift-box.png"
    }
];

let currentSlide = 0;

function updateSlide(index) {
    const slide = slides[index];
    const title = document.querySelector('.catalog__banner-title');
    const description = document.querySelector('.catalog__banner-description');
    const button = document.querySelector('.catalog__banner-button');
    const image = document.querySelector('.catalog__banner-img');
    
    title.textContent = slide.title;
    description.textContent = slide.description;
    button.textContent = slide.button;
    image.src = slide.image;
    
    // Обновляем активную точку
    dots.forEach((dot, i) => {
        dot.classList.toggle('catalog__banner-dot--active', i === index);
    });
}

// Добавляем обработчики кликов на точки
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlide(currentSlide);
    });
});

// Автоматическое переключение слайдов каждые 5 секунд
setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide(currentSlide);
}, 5000);

// Функции для работы с попапами
function openPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.classList.add('catalog__popup--active');
    }
}

function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.classList.remove('catalog__popup--active');
    }
}

// Закрытие попапа при клике на фон
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('catalog__popup')) {
        e.target.classList.remove('catalog__popup--active');
    }
});
