// Превращает число в денежный формат: 3000 → "$3,000.00"
export function formatCurrency(value) {
    return (
        "$" +
        Number(value)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    );
}

// Округляет число до нужного количества знаков после запятой
// Например: formatNumber(1.23456, 2) → "1.23"
export function formatNumber(value, decimals = 2) {
    return Number(value).toFixed(decimals);
}

// Превращает дату рождения в возраст
// Например: "1998-03-12" → 28
export function calcAge(dob) {
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
        age--;
    }
    return age;
}
