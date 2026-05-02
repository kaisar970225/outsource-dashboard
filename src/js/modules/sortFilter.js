import { getCurrentMonthData } from "../state/appState.js";

// Состояние сортировки и фильтрации
var projectSort = { col: null, dir: "asc" };
var employeeSort = { col: null, dir: "asc" };
var projectFilters = {};
var employeeFilters = {};

// Возвращает отфильтрованные и отсортированные проекты
export function getFilteredProjects(year, month) {
    var data = getCurrentMonthData();
    var projects = [];

    // Копируем массив
    for (var i = 0; i < data.projects.length; i++) {
        projects.push(data.projects[i]);
    }

    // Применяем фильтры
    if (projectFilters.company) {
        var companyFilter = projectFilters.company.toLowerCase();
        var filtered = [];
        for (var j = 0; j < projects.length; j++) {
            if (
                projects[j].company.toLowerCase().indexOf(companyFilter) !== -1
            ) {
                filtered.push(projects[j]);
            }
        }
        projects = filtered;
    }

    if (projectFilters.name) {
        var nameFilter = projectFilters.name.toLowerCase();
        var filtered2 = [];
        for (var k = 0; k < projects.length; k++) {
            if (projects[k].name.toLowerCase().indexOf(nameFilter) !== -1) {
                filtered2.push(projects[k]);
            }
        }
        projects = filtered2;
    }

    // Применяем сортировку
    if (projectSort.col) {
        projects.sort(function (a, b) {
            var valA = a[projectSort.col];
            var valB = b[projectSort.col];
            if (typeof valA === "string") {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
                if (valA < valB) return projectSort.dir === "asc" ? -1 : 1;
                if (valA > valB) return projectSort.dir === "asc" ? 1 : -1;
                return 0;
            } else {
                return projectSort.dir === "asc" ? valA - valB : valB - valA;
            }
        });
    }

    return projects;
}

// Возвращает отфильтрованных и отсортированных сотрудников
export function getFilteredEmployees(year, month) {
    var data = getCurrentMonthData();
    var employees = [];

    for (var i = 0; i < data.employees.length; i++) {
        employees.push(data.employees[i]);
    }

    // Применяем фильтры
    if (employeeFilters.name) {
        var nameFilter = employeeFilters.name.toLowerCase();
        var filtered = [];
        for (var j = 0; j < employees.length; j++) {
            if (employees[j].name.toLowerCase().indexOf(nameFilter) !== -1) {
                filtered.push(employees[j]);
            }
        }
        employees = filtered;
    }

    if (employeeFilters.surname) {
        var surnameFilter = employeeFilters.surname.toLowerCase();
        var filtered2 = [];
        for (var k = 0; k < employees.length; k++) {
            if (
                employees[k].surname.toLowerCase().indexOf(surnameFilter) !== -1
            ) {
                filtered2.push(employees[k]);
            }
        }
        employees = filtered2;
    }

    if (employeeFilters.position) {
        var posFilter = employeeFilters.position.toLowerCase();
        var filtered3 = [];
        for (var l = 0; l < employees.length; l++) {
            if (employees[l].position.toLowerCase() === posFilter) {
                filtered3.push(employees[l]);
            }
        }
        employees = filtered3;
    }

    // Применяем сортировку
    if (employeeSort.col) {
        employees.sort(function (a, b) {
            var valA = a[employeeSort.col];
            var valB = b[employeeSort.col];
            if (typeof valA === "string") {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
                if (valA < valB) return employeeSort.dir === "asc" ? -1 : 1;
                if (valA > valB) return employeeSort.dir === "asc" ? 1 : -1;
                return 0;
            } else {
                return employeeSort.dir === "asc" ? valA - valB : valB - valA;
            }
        });
    }

    return employees;
}

// Устанавливает сортировку для проектов
export function setProjectSort(col) {
    if (projectSort.col === col) {
        projectSort.dir = projectSort.dir === "asc" ? "desc" : "asc";
    } else {
        projectSort.col = col;
        projectSort.dir = "asc";
    }
    updateSortIcons("projectsTable", col, projectSort.dir);
}

// Устанавливает сортировку для сотрудников
export function setEmployeeSort(col) {
    if (employeeSort.col === col) {
        employeeSort.dir = employeeSort.dir === "asc" ? "desc" : "asc";
    } else {
        employeeSort.col = col;
        employeeSort.dir = "asc";
    }
    updateSortIcons("employeesTable", col, employeeSort.dir);
}

// Обновляет иконки сортировки в таблице
function updateSortIcons(tableId, activeCol, dir) {
    var table = document.getElementById(tableId);
    var icons = table.querySelectorAll(".sort-icon");
    for (var i = 0; i < icons.length; i++) {
        var icon = icons[i];
        if (icon.getAttribute("data-col") === activeCol) {
            icon.textContent = dir === "asc" ? "↑" : "↓";
            icon.classList.add("active");
        } else {
            icon.textContent = "⇅";
            icon.classList.remove("active");
        }
    }
}

// Показывает всплывающее окно фильтра
export function showFilterPopup(col, tableType, buttonEl, year, month) {
    closeFilterPopup();

    var popup = document.createElement("div");
    popup.id = "filterPopup";
    popup.style.cssText =
        "position:fixed;background:white;border:1px solid #ddd;border-radius:6px;padding:12px;z-index:500;box-shadow:0 2px 8px rgba(0,0,0,0.15);min-width:200px;";

    var currentFilters =
        tableType === "projects" ? projectFilters : employeeFilters;
    var currentValue = currentFilters[col] || "";

    // Для должности показываем выпадающий список
    if (col === "position") {
        popup.innerHTML =
            '<select id="filterInput" style="width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;">' +
            '<option value="">All positions</option>' +
            '<option value="Junior"' +
            (currentValue === "Junior" ? " selected" : "") +
            ">Junior</option>" +
            '<option value="Middle"' +
            (currentValue === "Middle" ? " selected" : "") +
            ">Middle</option>" +
            '<option value="Senior"' +
            (currentValue === "Senior" ? " selected" : "") +
            ">Senior</option>" +
            '<option value="Lead"' +
            (currentValue === "Lead" ? " selected" : "") +
            ">Lead</option>" +
            '<option value="Architect"' +
            (currentValue === "Architect" ? " selected" : "") +
            ">Architect</option>" +
            '<option value="Business Manager"' +
            (currentValue === "Business Manager" ? " selected" : "") +
            ">Business Manager</option>" +
            "</select>";

        popup
            .querySelector("#filterInput")
            .addEventListener("change", function () {
                applyFilter(col, tableType, this.value, year, month);
                closeFilterPopup();
            });
    } else {
        popup.innerHTML =
            '<input type="text" id="filterInput" value="' +
            currentValue +
            '" placeholder="Filter..." style="width:100%;padding:6px;border:1px solid #ddd;border-radius:4px;margin-bottom:8px;">' +
            '<div style="display:flex;gap:6px;">' +
            '<button id="applyFilterBtn" style="flex:1;padding:6px;background:#3498db;color:white;border:none;border-radius:4px;cursor:pointer;">Apply</button>' +
            '<button id="cancelFilterBtn" style="flex:1;padding:6px;background:#95a5a6;color:white;border:none;border-radius:4px;cursor:pointer;">Cancel</button>' +
            "</div>";

        popup
            .querySelector("#applyFilterBtn")
            .addEventListener("click", function () {
                var value = document.getElementById("filterInput").value.trim();
                applyFilter(col, tableType, value, year, month);
                closeFilterPopup();
            });

        popup
            .querySelector("#cancelFilterBtn")
            .addEventListener("click", closeFilterPopup);

        popup
            .querySelector("#filterInput")
            .addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    applyFilter(col, tableType, this.value.trim(), year, month);
                    closeFilterPopup();
                }
            });
    }

    document.body.appendChild(popup);

    // Позиционируем рядом с кнопкой
    var rect = buttonEl.getBoundingClientRect();
    popup.style.left = rect.left + "px";
    popup.style.top = rect.bottom + 4 + "px";

    // Фокус на поле ввода
    var input = popup.querySelector("#filterInput");
    if (input && input.type === "text") input.focus();

    // Закрываем при клике вне
    setTimeout(function () {
        document.addEventListener("click", filterOutsideHandler);
    }, 100);

    function filterOutsideHandler(e) {
        var popup = document.getElementById("filterPopup");
        if (popup && !popup.contains(e.target) && e.target !== buttonEl) {
            closeFilterPopup();
            document.removeEventListener("click", filterOutsideHandler);
        }
    }
}

// Применяет фильтр
function applyFilter(col, tableType, value, year, month) {
    if (tableType === "projects") {
        if (value) {
            projectFilters[col] = value;
        } else {
            delete projectFilters[col];
        }
        renderProjectFilterChips(year, month);
    } else {
        if (value) {
            employeeFilters[col] = value;
        } else {
            delete employeeFilters[col];
        }
        renderEmployeeFilterChips(year, month);
    }
}

// Убирает один фильтр
export function removeFilter(col, tableType, year, month) {
    if (tableType === "projects") {
        delete projectFilters[col];
        renderProjectFilterChips(year, month);
    } else {
        delete employeeFilters[col];
        renderEmployeeFilterChips(year, month);
    }
}

// Убирает все фильтры
export function clearAllFilters(tableType, year, month) {
    if (tableType === "projects") {
        projectFilters = {};
        renderProjectFilterChips(year, month);
    } else {
        employeeFilters = {};
        renderEmployeeFilterChips(year, month);
    }
}

// Показывает чипы активных фильтров над таблицей проектов
export function renderProjectFilterChips(year, month) {
    var container = document.getElementById("projectFilterChips");
    container.innerHTML = "";

    var keys = Object.keys(projectFilters);
    for (var i = 0; i < keys.length; i++) {
        var col = keys[i];
        var chip = document.createElement("span");
        chip.className = "filter-chip";
        chip.innerHTML =
            col +
            ": " +
            projectFilters[col] +
            ' <button data-col="' +
            col +
            '" data-table="projects">×</button>';
        container.appendChild(chip);
    }

    if (keys.length >= 2) {
        var clearBtn = document.createElement("button");
        clearBtn.className = "clear-filters-btn";
        clearBtn.textContent = "Clear Filters";
        clearBtn.setAttribute("data-table", "projects");
        container.appendChild(clearBtn);
    }
}

// Показывает чипы активных фильтров над таблицей сотрудников
export function renderEmployeeFilterChips(year, month) {
    var container = document.getElementById("employeeFilterChips");
    container.innerHTML = "";

    var keys = Object.keys(employeeFilters);
    for (var i = 0; i < keys.length; i++) {
        var col = keys[i];
        var chip = document.createElement("span");
        chip.className = "filter-chip";
        chip.innerHTML =
            col +
            ": " +
            employeeFilters[col] +
            ' <button data-col="' +
            col +
            '" data-table="employees">×</button>';
        container.appendChild(chip);
    }

    if (keys.length >= 2) {
        var clearBtn = document.createElement("button");
        clearBtn.className = "clear-filters-btn";
        clearBtn.textContent = "Clear Filters";
        clearBtn.setAttribute("data-table", "employees");
        container.appendChild(clearBtn);
    }
}

// Закрывает попап фильтра
export function closeFilterPopup() {
    var existing = document.getElementById("filterPopup");
    if (existing) existing.remove();
}

// Возвращает текущие фильтры
export function getProjectFilters() {
    return projectFilters;
}
export function getEmployeeFilters() {
    return employeeFilters;
}
export function getProjectSort() {
    return projectSort;
}
export function getEmployeeSort() {
    return employeeSort;
}
