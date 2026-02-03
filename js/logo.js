// ===================================
// تحميل اللوجو
// ===================================
(function() {
    'use strict';
    
    /**
     * تحميل لوجو الموقع من Firebase
     */
    function loadLogo() {
        db.ref('homepage/logo').once('value').then((snap) => {
            const v = snap.val();
            if (v && v.data) {
                const el = document.getElementById('siteLogo');
                if (el) {
                    el.src = v.data;
                }
            }
        }).catch(err => console.error('خطأ في تحميل اللوجو:', err));
    }
    
    // تحميل اللوجو عند تحميل الصفحة
    if (document.getElementById('siteLogo')) {
        loadLogo();
    }
})();
