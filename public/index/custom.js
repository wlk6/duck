window.addEventListener('load', function () {
    setTimeout(function () {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.display = 'none';
        }
    }, 400);
});

// 由于 bxSlider 是 jQuery 插件，这里简单模拟一个函数来表示其功能
function bxSlider(element, options) {
    console.log(`Initializing bxSlider on ${element} with options:`, options);
}

// ===================================
// Testimonials Slider
// ======================================
const testimonialsSlider = document.querySelector('.testimonials-slider');
if (testimonialsSlider) {
    bxSlider(testimonialsSlider, {
        auto: true,
        controls: true,
        nextText: '',
        prevText: '',
        pause: 5000,
        speed: 500,
        pager: true,
        pagerCustom: '.testimonials-slider-pager-one, .testimonials-slider-pager-two, .testimonials-slider-pager-three'
    });
}

// ===================================
// Our Item Slider
// ======================================
const sliders = [
    '.breakfast-slider',
    '.launch-slider',
    '.dinner-slider',
    '.dessert-slider',
    '.shake-slider'
];
sliders.forEach(sliderClass => {
    const slider = document.querySelector(sliderClass);
    if (slider) {
        bxSlider(slider, {
            auto: true,
            controls: true,
            nextText: '<i class="fas fa-arrow-right"></i>',
            prevText: '<i class="fas fa-arrow-left"></i>',
            pause: 5000,
            speed: 500,
            slideMargin: 30,
            pager: true,
            pagerCustom: ''
        });
    }
});

// ===================================
// Chef Slider
// ======================================
const chefSlider = document.querySelector('.chef-slider');
if (chefSlider) {
    bxSlider(chefSlider, {
        auto: true,
        controls: true,
        nextText: '<i class="fas fa-arrow-right"></i>',
        prevText: '<i class="fas fa-arrow-left"></i>',
        pause: 5000,
        speed: 500,
        slideMargin: 30,
        pager: true,
        pagerCustom: '.chef-slider'
    });
}

// ===================================
// sticky header
// ======================================
const header = document.getElementById('myHeader');
if (header) {
    const sticky = header.offsetTop;
    window.onscroll = function () {
        if (window.pageYOffset > sticky) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    };
}

// ===================================
// scroll active class menu
// 由于原生 JavaScript 没有直接的 scrollspy 功能，这里简单注释掉
// 可以使用 IntersectionObserver 来实现类似功能
// document.body.scrollspy({
//     target: '#myHeader'
// });

// scroll bottom to top button
const scrollTopButton = document.querySelector('.scroll-top');
if (scrollTopButton) {
    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            scrollTopButton.style.display = 'block';
        } else {
            scrollTopButton.style.display = 'none';
        }
    });

    scrollTopButton.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// search toggle
// ======================================
const searchIcon = document.querySelector('.search-icon');
const closeIcon = document.querySelector('.close-icon');
const headerInput = document.querySelector('.header-search .header-input');
if (searchIcon && closeIcon && headerInput) {
    searchIcon.addEventListener('click', function () {
        headerInput.style.display = 'inline-block';
        closeIcon.style.display = 'inline-block';
        searchIcon.style.display = 'none';
    });

    closeIcon.addEventListener('click', function () {
        headerInput.style.display = 'none';
        closeIcon.style.display = 'none';
        searchIcon.style.display = 'inline-block';
    });
}