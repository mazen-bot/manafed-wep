// ===================================
// وظائف نسخ الأسعار
// ===================================
(function() {
    'use strict';
    
    /**
     * نسخ السعر إلى الحافظة
     */
    document.addEventListener('click', function(e) {
        const priceItem = e.target.closest('.price-item');
        
        if (priceItem) {
            const priceValueElement = priceItem.querySelector('.price-value');
            
            if (priceValueElement) {
                const priceText = priceValueElement.innerText.replace('ريال', '').trim();
                
                navigator.clipboard.writeText(priceText).then(() => {
                    const originalText = priceValueElement.innerHTML;
                    
                    // تأثير بصري للنسخ الناجح
                    priceValueElement.innerHTML = '✓ تم النسخ!';
                    priceValueElement.style.color = '#4ade80';
                    priceItem.style.background = 'rgba(74, 222, 128, 0.1)';
                    
                    setTimeout(() => {
                        priceValueElement.innerHTML = originalText;
                        priceValueElement.style.color = '';
                        priceItem.style.background = '';
                    }, 1500);
                }).catch(err => {
                    console.error('خطأ في النسخ:', err);
                    alert('فشل نسخ السعر');
                });
            }
        }
    });
})();

// ===================================
// توسيع/تصغير بطاقات المنتجات على الموبايل
// ===================================
(function() {
    'use strict';
    
    /**
     * إظهار/إخفاء تفاصيل المنتج عند النقر على الصورة (للموبايل فقط)
     */
    document.addEventListener('click', function(e) {
        // التحقق من أن العرض للموبايل
        if (window.innerWidth > 768) return;
        
        const imgContainer = e.target.closest('.card-img-container');
        
        if (imgContainer) {
            const card = imgContainer.closest('.card');
            if (card) {
                card.classList.toggle('expanded');
            }
        }
    });
})();
