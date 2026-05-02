import { getCurrentMonthData, saveCurrentMonth } from "../state/appState.js";
import { renderProjectsTable, renderEmployeesTable } from "./tables.js";
import { getDaysInMonth, isWeekend, getWorkingDays } from "../utils/date.js";

// Показывает календарь отпусков для сотрудника
export function showCalendarModal(empId, year, month) {
    var data = getCurrentMonthData();

    // Находим сотрудника
    var emp = null;
    for (var i = 0; i < data.employees.length; i++) {
        if (data.employees[i].id === empId) {
            emp = data.employees[i];
            break;
        }
    }
    if (!emp) return;

    // Копируем текущие дни отпуска чтобы не менять оригинал до сохранения
    var selectedDays = [];
    for (var j = 0; j < emp.vacationDays.length; j++) {
        selectedDays.push(emp.vacationDays[j]);
    }

    // Создаём модальное окно
    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "calendarModal";

    overlay.innerHTML =
        '<div class="modal" style="min-width:500px;" id="calendarContent">' +
        '<button class="modal-close" id="closeCalendarModal">×</button>' +
        "<h3>" +
        emp.name +
        " " +
        emp.surname +
        " — Availability</h3>" +
        '<div id="calendarGrid"></div>' +
        '<div class="working-days-info" id="workingDaysInfo"></div>' +
        '<div class="vacation-ranges" id="vacationRanges"></div>' +
        "<br>" +
        '<button class="table-btn primary" id="saveVacationBtn" style="padding:8px 20px;">Set Vacation</button>' +
        "</div>";

    document.body.appendChild(overlay);

    // Отрисовываем календарь
    renderCalendar(year, month, selectedDays);

    // Кнопка сохранить
    document
        .getElementById("saveVacationBtn")
        .addEventListener("click", function () {
            // Сохраняем выбранные дни в данные сотрудника
            for (var i = 0; i < data.employees.length; i++) {
                if (data.employees[i].id === empId) {
                    data.employees[i].vacationDays = selectedDays;
                    break;
                }
            }
            saveCurrentMonth();
            renderProjectsTable(year, month);
            renderEmployeesTable(year, month);
            overlay.remove();
        });

    // Закрываем при клике на крестик
    document
        .getElementById("closeCalendarModal")
        .addEventListener("click", function () {
            overlay.remove();
        });

    // Закрываем при клике на фон
    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    // Функция отрисовки календаря
    function renderCalendar(year, month, selectedDays) {
        var grid = document.getElementById("calendarGrid");
        grid.innerHTML = "";

        var monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        // Заголовок месяца
        var title = document.createElement("h4");
        title.textContent = monthNames[month] + " " + year;
        title.style.marginBottom = "8px";
        grid.appendChild(title);

        // Сетка календаря
        var calGrid = document.createElement("div");
        calGrid.className = "calendar-grid";

        // Заголовки дней недели
        for (var d = 0; d < 7; d++) {
            var dayHeader = document.createElement("div");
            dayHeader.className = "calendar-day-header";
            dayHeader.textContent = dayNames[d];
            calGrid.appendChild(dayHeader);
        }

        // Первый день месяца — какой день недели?
        var firstDay = new Date(year, month, 1).getDay();

        // Пустые ячейки до первого дня
        for (var e = 0; e < firstDay; e++) {
            var empty = document.createElement("div");
            empty.className = "calendar-day empty";
            calGrid.appendChild(empty);
        }

        var daysInMonth = getDaysInMonth(year, month);
        var today = new Date();

        // Дни месяца
        for (var day = 1; day <= daysInMonth; day++) {
            var dayEl = document.createElement("div");
            dayEl.className = "calendar-day";

            var weekend = isWeekend(year, month, day);
            if (weekend) dayEl.classList.add("weekend");

            // Выделяем сегодняшний день
            if (
                today.getFullYear() === year &&
                today.getMonth() === month &&
                today.getDate() === day
            ) {
                dayEl.classList.add("today");
            }

            // Выделяем дни отпуска
            var isVacation = false;
            for (var v = 0; v < selectedDays.length; v++) {
                if (selectedDays[v] === day) {
                    isVacation = true;
                    break;
                }
            }
            if (isVacation) dayEl.classList.add("vacation");

            dayEl.textContent = day;

            // Клик по дню — переключаем отпуск
            dayEl.addEventListener(
                "click",
                (function (d) {
                    return function () {
                        var idx = selectedDays.indexOf(d);
                        if (idx === -1) {
                            selectedDays.push(d);
                        } else {
                            selectedDays.splice(idx, 1);
                        }
                        renderCalendar(year, month, selectedDays);
                        updateWorkingDaysInfo(year, month, selectedDays);
                        updateVacationRanges(selectedDays, month);
                    };
                })(day),
            );

            calGrid.appendChild(dayEl);
        }

        grid.appendChild(calGrid);
        updateWorkingDaysInfo(year, month, selectedDays);
        updateVacationRanges(selectedDays, month);
    }

    // Обновляет информацию о рабочих днях
    function updateWorkingDaysInfo(year, month, selectedDays) {
        var totalWorkingDays = getWorkingDays(year, month);
        var vacationWorkingDays = 0;

        for (var i = 0; i < selectedDays.length; i++) {
            if (!isWeekend(year, month, selectedDays[i])) {
                vacationWorkingDays++;
            }
        }

        var actualWorkingDays = totalWorkingDays - vacationWorkingDays;
        var info = document.getElementById("workingDaysInfo");
        info.textContent =
            "Working days: " +
            actualWorkingDays +
            "/" +
            totalWorkingDays +
            " days";
    }

    // Показывает дни отпуска в виде диапазонов
    function updateVacationRanges(selectedDays, month) {
        var container = document.getElementById("vacationRanges");

        if (selectedDays.length === 0) {
            container.textContent = "";
            return;
        }

        // Сортируем дни
        var sorted = selectedDays.slice().sort(function (a, b) {
            return a - b;
        });

        // Группируем в диапазоны
        // Последовательные дни через выходные считаются одним диапазоном
        var ranges = [];
        var rangeStart = sorted[0];
        var rangeEnd = sorted[0];

        for (var i = 1; i < sorted.length; i++) {
            var prev = sorted[i - 1];
            var curr = sorted[i];
            var isConsecutive = false;

            // Проверяем последовательность — пропускаем выходные
            var checkDay = prev + 1;
            while (checkDay < curr) {
                if (!isWeekend(new Date().getFullYear(), month, checkDay)) {
                    break;
                }
                checkDay++;
            }
            if (checkDay === curr) isConsecutive = true;

            if (isConsecutive) {
                rangeEnd = curr;
            } else {
                ranges.push({ start: rangeStart, end: rangeEnd });
                rangeStart = curr;
                rangeEnd = curr;
            }
        }
        ranges.push({ start: rangeStart, end: rangeEnd });

        // Форматируем диапазоны
        var parts = [];
        for (var j = 0; j < ranges.length; j++) {
            var startStr = pad(ranges[j].start) + "." + pad(month + 1);
            var endStr = pad(ranges[j].end) + "." + pad(month + 1);
            if (ranges[j].start === ranges[j].end) {
                parts.push(startStr);
            } else {
                parts.push(startStr + "-" + endStr);
            }
        }

        container.textContent = "Vacation: " + parts.join(", ");
    }

    // Добавляет ноль перед однозначным числом: 3 → "03"
    function pad(n) {
        return n < 10 ? "0" + n : "" + n;
    }
}
