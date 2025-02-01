const pricingToggle = document.getElementById('pricing-toggle');

pricingToggle.addEventListener('change', () => {
    const monthlyText = document.getElementById('monthly-text');
    const yearlyText = document.getElementById('yearly-text');

    const basicPrice = document.getElementById('basic-price');
    const premiumPrice = document.getElementById('premium-price');
    const ultraPrice = document.getElementById('ultra-price');

    if (pricingToggle.checked) {
        // Yearly Mode
        monthlyText.classList.remove('active');
        yearlyText.classList.add('active');

        basicPrice.innerHTML = "$29.99<span>/year</span>";
        premiumPrice.innerHTML = "$59.99<span>/year</span>";
        ultraPrice.innerHTML = "$129.99<span>/year</span>";
    } else {
        // Monthly Mode
        yearlyText.classList.remove('active');
        monthlyText.classList.add('active');

        basicPrice.innerHTML = "$2.99<span>/month</span>";
        premiumPrice.innerHTML = "$5.99<span>/month</span>";
        ultraPrice.innerHTML = "$12.99<span>/month</span>";
    }
});
