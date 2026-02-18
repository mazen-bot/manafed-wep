// ===================================
// حاسبة التمويل
// ===================================
(function() {
    'use strict';
    
    const financePriceInput = document.getElementById('financePrice');
    const financePeriodSelect = document.getElementById('financePeriod');
    const financeResults = document.getElementById('financeResults');
    const financeMessage = document.getElementById('financeMessage');
    
    /**
     * حساب التمويل
     */
    function calculateFinance() {
        const price = parseFloat(financePriceInput.value) || 0;
        const period = parseInt(financePeriodSelect.value) || 0;
        
        if (!price || !period) {
            if (financeResults) financeResults.style.display = 'none';
            if (financeMessage) financeMessage.style.display = 'block';
            return;
        }
        
        // النسبة السنوية 21%
        const annualRate = 0.36;
        const monthlyRate = annualRate / 12; // 1.75% شهرياً
        
        // صيغة حساب القسط الشهري:
        // M = P × [r(1+r)^n] / [(1+r)^n - 1]
        const numerator = monthlyRate * Math.pow(1 + monthlyRate, period);
        const denominator = Math.pow(1 + monthlyRate, period) - 1;
        const monthlyPayment = price * (numerator / denominator);
        
        // الحسابات الإجمالية
        const totalPaid = monthlyPayment * period;
        const totalFees = totalPaid - price;
        
        // عرض النتائج
        const resultPrice = document.getElementById('resultPrice');
        const resultFees = document.getElementById('resultFees');
        const resultTotal = document.getElementById('resultTotal');
        const resultMonthly = document.getElementById('resultMonthly');
        const resultMonths = document.getElementById('resultMonths');
        const resultFinal = document.getElementById('resultFinal');
        
        if (resultPrice) resultPrice.innerText = price.toFixed(0) + ' ريال';
        if (resultFees) resultFees.innerText = totalFees.toFixed(0) + ' ريال';
        if (resultTotal) resultTotal.innerText = totalPaid.toFixed(0) + ' ريال';
        if (resultMonthly) resultMonthly.innerText = monthlyPayment.toFixed(0) + ' ريال';
        if (resultMonths) resultMonths.innerText = period + ' قسط';
        if (resultFinal) resultFinal.innerText = totalFees.toFixed(0) + ' ريال';
        
        if (financeResults) financeResults.style.display = 'block';
        if (financeMessage) financeMessage.style.display = 'none';
    }
    
    // ربط أحداث الإدخال
    if (financePriceInput) {
        financePriceInput.addEventListener('input', calculateFinance);
    }
    
    if (financePeriodSelect) {
        financePeriodSelect.addEventListener('change', calculateFinance);
    }
})();
