import { loadData, saveMonthData } from "../services/storageService.js";

// Это глобальное состояние приложения — одно место где хранится всё
const state = {
    monthlyData: {}, // все данные по месяцам
    currentYear: 0, // текущий выбранный год
    currentMonth: 0, // текущий выбранный месяц (0=январь, 11=декабрь)
    currentView: "projects", // какая вкладка открыта: 'projects' или 'employees'
};

// Инициализация — запускается один раз при старте приложения
export function initState() {
    const today = new Date();
    state.currentYear = today.getFullYear();
    state.currentMonth = today.getMonth();
    state.monthlyData = loadData();
}

// Возвращает данные за текущий выбранный месяц
export function getCurrentMonthData() {
    const key = `${state.currentYear}-${state.currentMonth}`;
    if (!state.monthlyData[key]) {
        state.monthlyData[key] = { employees: [], projects: [] };
    }
    return state.monthlyData[key];
}

// Сохраняет изменения текущего месяца
export function saveCurrentMonth() {
    const data = getCurrentMonthData();
    saveMonthData(
        state.monthlyData,
        state.currentYear,
        state.currentMonth,
        data,
    );
}

// Геттеры — функции для получения данных из state
export function getState() {
    return state;
}
export function getMonthlyData() {
    return state.monthlyData;
}
export function getCurrentYear() {
    return state.currentYear;
}
export function getCurrentMonth() {
    return state.currentMonth;
}
export function getCurrentView() {
    return state.currentView;
}

// Сеттеры — функции для изменения данных в state
export function setCurrentYear(year) {
    state.currentYear = year;
}
export function setCurrentMonth(month) {
    state.currentMonth = month;
}
export function setCurrentView(view) {
    state.currentView = view;
}
