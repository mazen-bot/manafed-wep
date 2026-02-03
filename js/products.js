// ===================================
// وظائف المنتجات
// ===================================
(function() {
    'use strict';
    
    /**
     * بناء HTML لخيارات السعة
     */
    function buildStorageHtml(list, productId, fallbackPrices) {
        let html = '';
        
        if (Array.isArray(list) && list.length) {
            list.forEach((opt, idx) => {
                const pr = opt.price || fallbackPrices.price || 0;
                const pw = opt.priceWholesale || fallbackPrices.priceWholesale || 0;
                const po = opt.priceOffer || fallbackPrices.priceOffer || 0;
                
                html += `
                    <label class="storage-option">
                        <input type="radio" 
                               name="storage-${productId}" 
                               ${idx === 0 ? 'checked' : ''} 
                               data-price="${pr}" 
                               data-price-wholesale="${pw}" 
                               data-price-offer="${po}">
                        <span>${opt.label}</span>
                    </label>
                `;
            });
        }
        
        return html;
    }
    
    /**
     * ربط مستمعي الأحداث لخيارات السعة
     */
    function attachStorageListeners(scope) {
        const root = scope || document;
        
        root.querySelectorAll('.storage-options').forEach((so) => {
            const radios = so.querySelectorAll('input[type="radio"]');
            
            radios.forEach((r) => {
                r.addEventListener('change', (e) => {
                    if (!e.target.checked) return;
                    
                    const card = so.closest('.card');
                    if (!card) return;
                    
                    const pr = e.target.getAttribute('data-price') || '0';
                    const pw = e.target.getAttribute('data-price-wholesale') || '0';
                    const po = e.target.getAttribute('data-price-offer') || '0';
                    
                    const priceItems = card.querySelectorAll('.price-item .price-value');
                    if (priceItems[0]) priceItems[0].innerHTML = pr + '<small class="currency-small">ريال</small>';
                    if (priceItems[1]) priceItems[1].innerHTML = pw + '<small class="currency-small">ريال</small>';
                    if (priceItems[2]) priceItems[2].innerHTML = po + '<small class="currency-small">ريال</small>';
                });
            });
        });
    }
    
    /**
     * ربط مستمعي الأحداث لخيارات الألوان
     */
    function attachColorChangeListeners() {
        document.querySelectorAll('.color-options').forEach((co) => {
            const radios = co.querySelectorAll('input[type="radio"]');
            
            radios.forEach((r) => {
                r.addEventListener('change', (e) => {
                    if (!e.target.checked) return;
                    
                    const card = co.closest('.card');
                    if (!card) return;
                    
                    // تحديث الصورة
                    const img = card.querySelector('.product-image');
                    const newImg = e.target.getAttribute('data-color-image');
                    if (img && newImg) {
                        img.src = newImg;
                    }
                    
                    // تحديث حدود اللون المختار
                    co.querySelectorAll('label div').forEach(div => {
                        div.style.border = '2px solid rgba(255,255,255,0.3)';
                    });
                    
                    const selectedLabel = e.target.closest('label');
                    if (selectedLabel) {
                        const colorDiv = selectedLabel.querySelector('div');
                        if (colorDiv) {
                            colorDiv.style.border = '3px solid white';
                        }
                    }
                    
                    // الأسعار الأساسية لهذا اللون
                    const colorPrice = e.target.getAttribute('data-color-price') || '0';
                    const colorPriceWholesale = e.target.getAttribute('data-color-price-wholesale') || '0';
                    const colorPriceOffer = e.target.getAttribute('data-color-price-offer') || '0';
                    
                    // إعادة بناء خيارات السعة لهذا اللون
                    const storageOptionsEl = card.querySelector('.storage-options');
                    const storageRaw = e.target.getAttribute('data-color-storage') || '[]';
                    
                    let storageList = [];
                    try {
                        storageList = JSON.parse(decodeURIComponent(storageRaw));
                    } catch(e2) {
                        storageList = [];
                    }
                    
                    const newHtml = buildStorageHtml(
                        storageList, 
                        card.getAttribute('data-product-id'), 
                        {
                            price: Number(colorPrice),
                            priceWholesale: Number(colorPriceWholesale),
                            priceOffer: Number(colorPriceOffer)
                        }
                    );
                    
                    if (storageOptionsEl) {
                        storageOptionsEl.innerHTML = newHtml || storageOptionsEl.innerHTML;
                        attachStorageListeners(card);
                    }
                    
                    // تطبيق سعر أول خيار سعة
                    const firstRadio = storageOptionsEl ? storageOptionsEl.querySelector('input[type="radio"]') : null;
                    if (firstRadio) {
                        const pr = firstRadio.getAttribute('data-price') || colorPrice;
                        const pw = firstRadio.getAttribute('data-price-wholesale') || colorPriceWholesale;
                        const po = firstRadio.getAttribute('data-price-offer') || colorPriceOffer;
                        
                        const priceItems = card.querySelectorAll('.price-item .price-value');
                        if (priceItems[0]) priceItems[0].innerHTML = pr + '<small class="currency-small">ريال</small>';
                        if (priceItems[1]) priceItems[1].innerHTML = pw + '<small class="currency-small">ريال</small>';
                        if (priceItems[2]) priceItems[2].innerHTML = po + '<small class="currency-small">ريال</small>';
                    }
                });
            });
        });
    }
    
    /**
     * تحميل وعرض المنتجات
     */
    function loadProducts() {
        db.ref('homepage/products').once('value').then((snap) => {
            const grid = document.getElementById('products-view');
            if (!grid) return;
            
            const fragment = document.createDocumentFragment();
            const tempDiv = document.createElement('div');
            
            snap.forEach((child) => {
                const p = child.val();
                const productId = child.key;
                
                let currentImage = p.img;
                let currentPrice = p.price || 0;
                let currentPriceWholesale = p.priceWholesale || 0;
                let currentPriceOffer = p.priceOffer || 0;
                let currentColorStorageOptions = [];
                
                // بناء خيارات الألوان
                let colorsHtml = '';
                if (p.colors && Array.isArray(p.colors) && p.colors.length > 0) {
                    colorsHtml = '<div class="color-options">';
                    
                    p.colors.forEach((color, idx) => {
                        if (idx === 0) {
                            currentImage = color.image || p.img;
                            currentPrice = color.price || p.price || 0;
                            currentPriceWholesale = color.priceWholesale || p.priceWholesale || 0;
                            currentPriceOffer = color.priceOffer || p.priceOffer || 0;
                            currentColorStorageOptions = Array.isArray(color.storageOptions) ? color.storageOptions : [];
                        }
                        
                        const storageEncoded = encodeURIComponent(JSON.stringify(
                            Array.isArray(color.storageOptions) ? color.storageOptions : []
                        ));
                        
                        colorsHtml += `
                            <label class="color-option" title="${color.name}">
                                <input type="radio" 
                                       name="color-${productId}" 
                                       ${idx === 0 ? 'checked' : ''} 
                                       data-color-image="${color.image || p.img}" 
                                       data-color-price="${color.price || p.price || 0}" 
                                       data-color-price-wholesale="${color.priceWholesale || p.priceWholesale || 0}" 
                                       data-color-price-offer="${color.priceOffer || p.priceOffer || 0}" 
                                       data-color-storage="${storageEncoded}">
                                <div style="background:${color.code}; border:${idx === 0 ? '3px solid #fff' : '2px solid rgba(255,255,255,0.3)'}"></div>
                                <span>${color.name}</span>
                            </label>
                        `;
                    });
                    
                    colorsHtml += '</div>';
                }
                
                // بناء خيارات السعة
                let storageHtml = '';
                const sourceStorage = (currentColorStorageOptions && currentColorStorageOptions.length)
                    ? currentColorStorageOptions
                    : (p.storageOptions && Array.isArray(p.storageOptions) && p.storageOptions.length ? p.storageOptions : []);
                
                if (sourceStorage.length) {
                    sourceStorage.forEach((opt, idx) => {
                        const pr = opt.price || currentPrice;
                        const pw = opt.priceWholesale || currentPriceWholesale;
                        const po = opt.priceOffer || currentPriceOffer;
                        
                        storageHtml += `
                            <label class="storage-option">
                                <input type="radio" 
                                       name="storage-${productId}" 
                                       ${idx === 0 ? 'checked' : ''} 
                                       data-price="${pr}" 
                                       data-price-wholesale="${pw}" 
                                       data-price-offer="${po}">
                                <span>${opt.label}</span>
                            </label>
                        `;
                    });
                } else {
                    const baseOffer = Number(currentPriceOffer);
                    const opts = [
                        { label: '128GB', addPct: 0 },
                        { label: '256GB', addPct: 0.08 },
                        { label: '512GB', addPct: 0.16 }
                    ];
                    
                    opts.forEach((opt, idx) => {
                        const po = Math.round(baseOffer * (1 + opt.addPct));
                        const pr = Math.round(Number(currentPrice) * (1 + opt.addPct)) || po;
                        const pw = Math.round(Number(currentPriceWholesale) * (1 + opt.addPct)) || pr;
                        
                        storageHtml += `
                            <label class="storage-option">
                                <input type="radio" 
                                       name="storage-${productId}" 
                                       ${idx === 0 ? 'checked' : ''} 
                                       data-price="${pr}" 
                                       data-price-wholesale="${pw}" 
                                       data-price-offer="${po}">
                                <span>${opt.label}</span>
                            </label>
                        `;
                    });
                }
                
                // بناء HTML للبطاقة
                tempDiv.innerHTML = `
                    <div class="card" data-product-id="${productId}">
                        <div class="card-img-container">
                            <img class="product-image" 
                                 src="${currentImage}" 
                                 alt="${p.name}"
                                 onerror="this.src='https://via.placeholder.com/300x220?text=No+Image'">
                        </div>
                        <div class="card-body">
                            <h2 class="card-title">${p.name}</h2>
                            ${colorsHtml}
                            <div class="storage-options">
                                ${storageHtml}
                            </div>
                            <div class="price-options">
                                <div class="price-item">
                                    <span class="price-label">
                                        <a href="https://digital.quarafinance.com/?vid=e7d3d09f-498c-4ec0-bc16-fe489fde5434">
                                            🏷️ كوارا مورا
                                        </a>
                                    </span>
                                    <span class="price-value">${currentPrice}<small class="currency-small">ريال</small></span>
                                </div>
                                <div class="price-item">
                                    <span class="price-label">
                                        <a href="https://partners.tamara.co/#/login?redirect=%2Fdashboard%2Fhome">
                                            📱 تابي تمارا
                                        </a>
                                    </span>
                                    <span class="price-value">${currentPriceWholesale}<small class="currency-small">ريال</small></span>
                                </div>
                                <div class="price-item">
                                    <span class="price-label">💵 كاش</span>
                                    <span class="price-value">${currentPriceOffer}<small class="currency-small">ريال</small></span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                fragment.appendChild(tempDiv.firstElementChild);
            });
            
            grid.innerHTML = '';
            grid.appendChild(fragment);
            
            // ربط مستمعي الأحداث
            attachStorageListeners();
            attachColorChangeListeners();
            
        }).catch(err => console.error('خطأ في تحميل المنتجات:', err));
    }
    
    // تحميل المنتجات عند تحميل الصفحة
    if (document.getElementById('products-view')) {
        loadProducts();
    }
})();
