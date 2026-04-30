import appData from "../../data/appData.json";

const STORAGE_KEY = "monthlyData";

// Загружает все данные из localStorage
// Если данных нет — создаёт начальные данные для текущего месяца
export function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        return JSON.parse(raw);
    }

    // Данных нет — создаём с нуля
    const today = new Date();
    const key = `${today.getFullYear()}-${today.getMonth()}`;
    const initial = {
        [key]: {
            employees: appData.employees,
            projects: appData.projects,
        },
    };
    saveData(initial);
    return initial;
}

// Сохраняет все данные в localStorage
export function saveData(monthlyData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(monthlyData));
}

// Возвращает данные за конкретный месяц
// Например: getMonthData(allData, 2026, 0) → данные за январь 2026
export function getMonthData(monthlyData, year, month) {
    const key = `${year}-${month}`;
    if (!monthlyData[key]) {
        monthlyData[key] = { employees: [], projects: [] };
        saveData(monthlyData);
    }
    return monthlyData[key];
}

// Сохраняет данные за конкретный месяц
export function saveMonthData(monthlyData, year, month, data) {
    const key = `${year}-${month}`;
    monthlyData[key] = data;
    saveData(monthlyData);
}

// Копирует данные из одного месяца в другой (функция Seed Data)
// При копировании очищает дни отпуска
export function seedData(monthlyData, fromYear, fromMonth, toYear, toMonth) {
    const fromKey = `${fromYear}-${fromMonth}`;
    const source = monthlyData[fromKey];
    if (!source) return false;

    // Глубокое копирование чтобы не менять оригинал
    const copy = JSON.parse(JSON.stringify(source));

    // Очищаем дни отпуска у всех сотрудников
    copy.employees = copy.employees.map((emp) => ({
        ...emp,
        vacationDays: [],
    }));

    saveMonthData(monthlyData, toYear, toMonth, copy);
    return true;
}
