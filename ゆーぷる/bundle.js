

// ========================================
// ハンバーガーメニュー機能
// ========================================
class MobileMenu {
    constructor() {
        this.hamburgerBtn = document.querySelector('.hamburger-menu');
        this.mobileMenu = document.querySelector('.mobile-menu');
        this.closeBtn = document.querySelector('.close-menu');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.hamburgerBtn.addEventListener('click', () => this.openMenu());
        this.closeBtn.addEventListener('click', () => this.closeMenu());

        // メニュー外クリックで閉じる
        document.addEventListener('click', (e) => {
            if (!this.mobileMenu.contains(e.target) && !this.hamburgerBtn.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    openMenu() {
        this.mobileMenu.classList.remove('hidden');
        this.hamburgerBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.mobileMenu.classList.add('hidden');
        this.hamburgerBtn.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========================================
// テキストアニメーション機能
// ========================================
class TextAnimation {
    constructor() {
        this.h2Element = document.querySelector('.writing-vertical');
        this.pElement = document.querySelector('.concept-description');
        this.h2Animated = false;
        this.pAnimated = false;
        this.init();
    }

    init() {
        this.setupElements();
        this.setupObservers();
    }

    setupElements() {
        const elements = [this.h2Element, this.pElement];
        elements.forEach(element => {
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            }
        });
    }

    setupObservers() {
        const observerOptions = {
            threshold: 0.08,
            rootMargin: '0px 0px -50px 0px'
        };

        // h2用のIntersection Observer
        this.h2Observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.h2Animated) {
                    this.h2Animated = true;
                    setTimeout(() => this.animateElement(this.h2Element), 300);
                }
            });
        }, observerOptions);

        // p用のIntersection Observer
        this.pObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.pAnimated) {
                    this.pAnimated = true;
                    setTimeout(() => this.animateElement(this.pElement), 300);
                }
            });
        }, observerOptions);

        // 各要素を監視
        if (this.h2Element) this.h2Observer.observe(this.h2Element);
        if (this.pElement) this.pObserver.observe(this.pElement);
    }

    animateElement(element) {
        if (element) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    }
}

// ========================================
// カードアニメーション機能
// ========================================
class CardAnimation {
    constructor() {
        this.cards = document.querySelectorAll('.concept-images .aspect-square');
        this.animatedCards = new Set();
        this.init();
    }

    init() {
        this.cards.forEach((card, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animatedCards.has(index)) {
                        this.animatedCards.add(index);
                        setTimeout(() => card.classList.add('animate-in'), 300);
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: '0px 0px -50px 0px'
            });

            observer.observe(card);
        });
    }
}

// ========================================
// 施設アニメーション機能
// ========================================
class FacilityAnimation {
    constructor() {
        this.facilityItems = document.querySelectorAll('.facility-item');
        this.animatedItems = new Set();
        this.init();
    }

    init() {
        this.facilityItems.forEach((item, index) => {
            this.setupItemObserver(item, index);
            this.setupH2Observer(item, index);
        });
    }

    setupItemObserver(item, index) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedItems.has(index)) {
                    this.animatedItems.add(index);
                    setTimeout(() => item.classList.add('animate-in'), index * 200);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        observer.observe(item);
    }

    setupH2Observer(item, index) {
        const h2Elements = item.querySelectorAll('h2.writing-vertical.text-4xl.font-light.text-yellow-300.border.border-yellow-300.px-6.py-8');
        h2Elements.forEach((h2Element, h2Index) => {
            const h2Observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            this.startBorderAnimation(item, h2Element);
                        }, (index * 200) + (h2Index * 100));
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -30px 0px'
            });

            h2Observer.observe(h2Element);
        });
    }

    startBorderAnimation(item, targetH2Element = null) {
        let h2Element = targetH2Element;

        if (!h2Element) {
            h2Element = item.querySelector('.hidden.lg\\:flex h2.writing-vertical.text-4xl.font-light.text-yellow-300.border.border-yellow-300.px-6.py-8') ||
                item.querySelector('.lg\\:hidden h2.writing-vertical.text-4xl.font-light.text-yellow-300.border.border-yellow-300.px-6.py-8') ||
                item.querySelector('h2.writing-vertical.text-4xl.font-light.text-yellow-300.border.border-yellow-300.px-6.py-8');
        }

        if (!h2Element) {
            console.log('h2要素が見つかりませんでした:', item);
            return;
        }

        this.createBorderAnimation(h2Element);
    }

    createBorderAnimation(h2Element) {
        h2Element.classList.add('visible');
        h2Element.style.border = 'none';
        h2Element.style.position = 'relative';

        const borders = ['top', 'right', 'bottom', 'left'];
        const borderElements = [];

        borders.forEach((side, index) => {
            const borderElement = this.createBorderElement(side);
            h2Element.appendChild(borderElement);
            borderElements.push(borderElement);
        });

        // 順番にアニメーション（上→右→下→左）
        borderElements.forEach((element, index) => {
            setTimeout(() => {
                const isHorizontal = index === 0 || index === 2;
                element.style.transition = 'transform 0.5s ease-in-out';
                element.style.transform = isHorizontal ? 'scaleX(1)' : 'scaleY(1)';
            }, index * 500);
        });
    }

    createBorderElement(side) {
        const borderElement = document.createElement('div');
        borderElement.className = `border-${side}`;
        borderElement.style.position = 'absolute';
        borderElement.style.background = '#fcd34d';
        borderElement.style.pointerEvents = 'none';
        borderElement.style.zIndex = '1';

        const styles = {
            top: {
                top: '0', left: '0', width: '100%', height: '1px',
                transform: 'scaleX(0)', transformOrigin: 'left'
            },
            right: {
                top: '0', right: '0', width: '1px', height: '100%',
                transform: 'scaleY(0)', transformOrigin: 'top'
            },
            bottom: {
                bottom: '0', left: '0', width: '100%', height: '1px',
                transform: 'scaleX(0)', transformOrigin: 'right'
            },
            left: {
                top: '0', left: '0', width: '1px', height: '100%',
                transform: 'scaleY(0)', transformOrigin: 'bottom'
            }
        };

        Object.assign(borderElement.style, styles[side]);
        return borderElement;
    }
}

// ========================================
// FAQ開閉機能
// ========================================
class FAQAccordion {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.faqItems.forEach(item => {
            const questionBtn = item.querySelector('.faq-question');
            const answerDiv = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-question i');

            if (questionBtn && answerDiv) {
                questionBtn.addEventListener('click', () => this.toggleFAQ(item, answerDiv, icon));
            }
        });
    }

    toggleFAQ(item, answerDiv, icon) {
        const isOpen = answerDiv.classList.contains('active');

        // 他のFAQを閉じる
        this.faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                const otherIcon = otherItem.querySelector('.faq-question i');
                if (otherAnswer) {
                    otherAnswer.classList.remove('active');
                    otherAnswer.classList.add('hidden');
                }
                if (otherIcon) {
                    otherIcon.classList.remove('bx-minus');
                    otherIcon.classList.add('bx-plus');
                }
            }
        });

        // 現在のFAQを開閉
        if (isOpen) {
            answerDiv.classList.remove('active');
            answerDiv.classList.add('hidden');
            icon.classList.remove('bx-minus');
            icon.classList.add('bx-plus');
        } else {
            answerDiv.classList.remove('hidden');
            answerDiv.classList.add('active');
            icon.classList.remove('bx-plus');
            icon.classList.add('bx-minus');
        }
    }
}

// ========================================
// スライダー機能
// ========================================
class Slider {
    constructor(containerSelector) {
        this.currentSlide = 0;
        this.container = document.querySelector(containerSelector);
        this.slides = this.container ? this.container.querySelectorAll('.slider-slide') : [];
        this.interval = null;
        this.init();
    }

    init() {
        if (this.slides.length > 0) {
            this.slides[0].classList.add('active');
        }
        this.startAutoPlay();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }

    updateSlider() {
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });
    }

    startAutoPlay() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(() => this.nextSlide(), 4000);
    }

    destroy() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

// ========================================
// ユーティリティ関数
// ========================================
function initRipples() {
    const sections = ['#concept', '#news', '#facility'];

    sections.forEach(selector => {
        const section = document.querySelector(selector);
        if (section && typeof $.fn.ripples !== 'undefined') {
            $(section).ripples({
                resolution: 700,
                dropRadius: 20,
                perturbance: 0.08,
                interactive: true
            });
        }
    });
}

function handleSPHeaderElements() {
    const h1Element = document.querySelector('.md\\:hidden h1');
    const imgElement = document.querySelector('.md\\:hidden .logo-image');
    const scrollY = window.scrollY;
    const headerHeight = document.querySelector('header').offsetHeight;

    if (h1Element && imgElement) {
        const isScrolled = scrollY > headerHeight;
        const elements = [h1Element, imgElement];

        elements.forEach(element => {
            element.style.opacity = isScrolled ? '0' : '1';
            element.style.transform = isScrolled ? 'translateY(-10px)' : 'translateY(0)';
        });
    }
}

function handlePCHeaderVisibility() {
    if (window.innerWidth < 768) return;

    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const footerTop = footer.offsetTop;
    const triggerPoint = footerTop - windowHeight;

    const isHidden = scrollY >= triggerPoint;
    header.style.opacity = isHidden ? '0' : '1';
    header.style.transform = isHidden ? 'translateY(-100%)' : 'translateY(0)';
}

function initGallerySwiper() {
    new Swiper('.gallery-swiper', {
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
        },
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        speed: 800,
        navigation: {
            nextEl: '.gallery-next',
            prevEl: '.gallery-prev',
        },
        breakpoints: {
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 40 },
        },
    });
}

// ========================================
// スライダー管理
// ========================================
let mobileSlider = null;
let desktopSlider = null;

function initSliders() {
    // 既存のスライダーをクリーンアップ
    [mobileSlider, desktopSlider].forEach(slider => {
        if (slider) {
            slider.destroy();
        }
    });
    mobileSlider = null;
    desktopSlider = null;

    // 現在の画面サイズに応じてスライダーを初期化
    const isMobile = window.innerWidth < 768;
    const containerSelector = isMobile
        ? '.w-full.md\\:hidden .slider-container'
        : '.w-full.md\\:w-2\\/3 .slider-container';

    const container = document.querySelector(containerSelector);
    if (container) {
        if (isMobile) {
            mobileSlider = new Slider(containerSelector);
        } else {
            desktopSlider = new Slider(containerSelector);
        }
    }
}

// ========================================
// 初期化
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // 各機能の初期化
    initSliders();
    initGallerySwiper();
    new MobileMenu();
    new TextAnimation();
    new CardAnimation();
    new FacilityAnimation();
    new FAQAccordion();

    // イベントリスナーの設定
    window.addEventListener('scroll', handleSPHeaderElements);
    window.addEventListener('scroll', handlePCHeaderVisibility);
    initRipples();
});

// リサイズ時の対応
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initSliders, 500);
});


