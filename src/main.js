import "./style.css";
import {
    initState,
    getCurrentYear,
    getCurrentMonth,
} from "./js/state/appState.js";
import {
    renderProjectsTable,
    renderEmployeesTable,
} from "./js/modules/tables.js";

// Запуск прилож когда стран загрузилась
document.addEventListener("DOMContentLoaded", function () {
    // Инициализируем состояние — загружаем данные из localStorage
    initState();

    var year = getCurrentYear();
    var month = getCurrentMonth();

    // Устанав месяц и год в селекторах боковой панели
    document.getElementById("monthSelect").value = month;
    document.getElementById("yearSelect").value = year;

    // Отрисовываем таблицы
    renderProjectsTable(year, month);
    renderEmployeesTable(year, month);
});
