// ===================================
// وظائف السلايدر
// ===================================
(function() {
    'use strict';
    
    let sliderImages = [];
    let sliderIndex = 0;
    let sliderInterval = null;
    
    /**
     * تطبيق صورة على السلايدر مع تأثير Ken Burns
     */
    function applyHeroImage(imgUrl) {
        const el = document.getElementById('hero-slider');
        if (!el) return;
        
        const layer = document.createElement('div');
        layer.className = 'hero-img-layer';
        layer.style.backgroundImage = `linear-gradient(rgba(0,0,0,0), rgba(50,0,0,0.3)), url('${imgUrl}')`;
        layer.style.opacity = '0';
        layer.style.transform = 'scale(1) translateY(0)';
        layer.style.willChange = 'opacity, transform';
        
        el.appendChild(layer);
        
        requestAnimationFrame(() => {
            layer.style.opacity = '1';
            layer.style.transform = 'scale(1.06) translateY(-2%)';
        });
        
        setTimeout(() => {
            const children = Array.from(el.querySelectorAll('.hero-img-layer'));
            for (let i = 0; i < children.length - 1; i++) {
                children[i].remove();
            }
        }, 1400);
    }
    
    /**
     * بدء دورة تبديل الصور
     */
    function startSliderCycling() {
        if (sliderInterval) {
            clearInterval(sliderInterval);
            sliderInterval = null;
        }
        
        if (!sliderImages || !sliderImages.length) return;
        
        sliderIndex = 0;
        applyHeroImage(sliderImages[sliderIndex]);
        
        sliderInterval = setInterval(() => {
            sliderIndex = (sliderIndex + 1) % sliderImages.length;
            applyHeroImage(sliderImages[sliderIndex]);
        }, 10000);
    }
    
    /**
     * تحميل إعدادات السلايدر
     */
    function loadSliderSettings() {
        db.ref('homepage/slider').once('value').then((snap) => {
            const data = snap.val();
            if (data) {
                const txtEl = document.getElementById('slider-text');
                if (txtEl && data.title) {
                    txtEl.innerText = data.title;
                }
                if (!sliderImages.length && data.img) {
                    applyHeroImage(data.img);
                }
            }
        }).catch(err => console.error('خطأ في تحميل إعدادات السلايدر:', err));
    }
    
    /**
     * تحميل صور السلايدر
     */
    function loadSliderImages() {
        db.ref('homepage/slider/images').on('value', (snap) => {
            const val = snap.val();
            sliderImages = [];
            
            if (val) {
                Object.keys(val).forEach(k => {
                    if (val[k] && val[k].data) {
                        sliderImages.push(val[k].data);
                    }
                });
            }
            
            if (sliderImages.length) {
                startSliderCycling();
            } else {
                if (sliderInterval) {
                    clearInterval(sliderInterval);
                    sliderInterval = null;
                }
            }
        });
    }
    
    // تشغيل السلايدر عند تحميل الصفحة
    if (document.getElementById('hero-slider')) {
        loadSliderSettings();
        loadSliderImages();
    }
})();
