javascript; // Возвращает количество рабочих дней в месяце (без выходных)
// Например: январь 2026 → 22
export function getWorkingDays(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let count = 0;
    for (let day = 1; day <= daysInMonth; day++) {
        const dayOfWeek = new Date(year, month, day).getDay();
        // 0 = воскресенье, 6 = суббота — пропускаем
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            count++;
        }
    }
    return count;
}

// Считает коэффициент отпуска для сотрудника
// Например: если 5 отпускных дней из 22 рабочих → (22-5)/22 = 0.773
export function calcVacationCoefficient(vacationDays, year, month) {
    const workingDays = getWorkingDays(year, month);
    if (workingDays === 0) return 1;

    // Считаем только те дни отпуска которые являются рабочими
    let vacationWorkingDays = 0;
    for (let day of vacationDays) {
        const dayOfWeek = new Date(year, month, day).getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            vacationWorkingDays++;
        }
    }

    return (workingDays - vacationWorkingDays) / workingDays;
}

// Возвращает количество дней в месяце
// Например: январь 2026 → 31
export function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

// Проверяет является ли день выходным
export function isWeekend(year, month, day) {
    const dayOfWeek = new Date(year, month, day).getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
}
