import { getCurrentMonthData, saveCurrentMonth } from "../state/appState.js";
import { renderProjectsTable, renderEmployeesTable } from "./tables.js";
import { formatCurrency } from "../utils/format.js";
import { calcVacationCoefficient } from "../utils/date.js";

// Назначает сотрудника на проект
export function assignEmployee(empId, projectId, capacity, fit, year, month) {
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

    // Проверяем не назначен ли уже на этот проект
    for (var j = 0; j < emp.assignments.length; j++) {
        if (emp.assignments[j].projectId === projectId) {
            alert("Employee is already assigned to this project!");
            return;
        }
    }

    // Добавляем назначение
    emp.assignments.push({
        projectId: projectId,
        capacity: parseFloat(capacity),
        fit: parseFloat(fit),
    });

    saveCurrentMonth();
    renderProjectsTable(year, month);
    renderEmployeesTable(year, month);
}

// Снимает сотрудника с проекта
export function unassignEmployee(empId, projectId, year, month) {
    var data = getCurrentMonthData();

    for (var i = 0; i < data.employees.length; i++) {
        if (data.employees[i].id === empId) {
            var newAssignments = [];
            for (var j = 0; j < data.employees[i].assignments.length; j++) {
                if (data.employees[i].assignments[j].projectId !== projectId) {
                    newAssignments.push(data.employees[i].assignments[j]);
                }
            }
            data.employees[i].assignments = newAssignments;
            break;
        }
    }

    saveCurrentMonth();
    renderProjectsTable(year, month);
    renderEmployeesTable(year, month);
}

// Редактирует назначение — меняет capacity и fit
export function editAssignment(
    empId,
    projectId,
    newCapacity,
    newFit,
    year,
    month,
) {
    var data = getCurrentMonthData();

    for (var i = 0; i < data.employees.length; i++) {
        if (data.employees[i].id === empId) {
            for (var j = 0; j < data.employees[i].assignments.length; j++) {
                if (data.employees[i].assignments[j].projectId === projectId) {
                    data.employees[i].assignments[j].capacity =
                        parseFloat(newCapacity);
                    data.employees[i].assignments[j].fit = parseFloat(newFit);
                    break;
                }
            }
            break;
        }
    }

    saveCurrentMonth();
    renderProjectsTable(year, month);
    renderEmployeesTable(year, month);
}

// Показывает всплывающее окно назначения рядом с кнопкой
export function showAssignPopup(empId, buttonEl, year, month) {
    var data = getCurrentMonthData();

    // Убираем старый попап если был
    closeAssignPopup();

    // Находим сотрудника
    var emp = null;
    for (var i = 0; i < data.employees.length; i++) {
        if (data.employees[i].id === empId) {
            emp = data.employees[i];
            break;
        }
    }
    if (!emp) return;

    // Считаем текущую мощность
    var usedCapacity = 0;
    for (var j = 0; j < emp.assignments.length; j++) {
        usedCapacity = usedCapacity + emp.assignments[j].capacity;
    }
    var availableCapacity = 1.5 - usedCapacity;

    // Создаём попап
    var popup = document.createElement("div");
    popup.className = "assign-popup";
    popup.id = "assignPopup";

    // Строим список проектов для выбора
    var projectOptions = '<option value="">Select project</option>';
    for (var k = 0; k < data.projects.length; k++) {
        var proj = data.projects[k];
        // Пропускаем проекты на которые уже назначен
        var alreadyAssigned = false;
        for (var l = 0; l < emp.assignments.length; l++) {
            if (emp.assignments[l].projectId === proj.id) {
                alreadyAssigned = true;
                break;
            }
        }
        if (!alreadyAssigned) {
            projectOptions +=
                '<option value="' +
                proj.id +
                '">' +
                proj.company +
                " - " +
                proj.name +
                "</option>";
        }
    }

    popup.innerHTML =
        "<h4>Assign: " +
        emp.name +
        " " +
        emp.surname +
        "</h4>" +
        '<div class="popup-row"><span>Current capacity:</span><span>' +
        usedCapacity.toFixed(1) +
        "/1.5</span></div>" +
        '<div class="popup-row"><span>Available:</span><span>' +
        availableCapacity.toFixed(1) +
        "</span></div>" +
        "<label>Project:</label>" +
        '<select id="assignProjectSelect">' +
        projectOptions +
        "</select>" +
        "<br><br>" +
        '<label>Capacity: <span id="capacityVal">0.5</span></label>' +
        '<input type="range" id="capacitySlider" min="0" max="' +
        availableCapacity.toFixed(1) +
        '" step="0.1" value="0.5">' +
        '<label>Fit: <span id="fitVal">1.0</span></label>' +
        '<input type="range" id="fitSlider" min="0" max="1" step="0.1" value="1">' +
        '<div class="popup-row"><span>Effective capacity:</span><span id="effectiveCapVal">0.500</span></div>' +
        '<div id="assignWarning" style="color:#e74c3c;font-size:12px;min-height:16px;"></div>' +
        '<div class="popup-actions">' +
        '<button class="table-btn primary" id="confirmAssignBtn">Assign</button>' +
        '<button class="table-btn secondary" id="cancelAssignBtn">Cancel</button>' +
        "</div>";

    document.body.appendChild(popup);

    // Позиционируем попап рядом с кнопкой
    positionPopup(popup, buttonEl);

    // Обновляем значения при движении слайдеров
    function updateSliders() {
        var cap = parseFloat(document.getElementById("capacitySlider").value);
        var fit = parseFloat(document.getElementById("fitSlider").value);
        document.getElementById("capacityVal").textContent = cap.toFixed(1);
        document.getElementById("fitVal").textContent = fit.toFixed(1);
        document.getElementById("effectiveCapVal").textContent = (
            cap * fit
        ).toFixed(3);

        // Проверяем превышение мощности проекта
        var projectId = document.getElementById("assignProjectSelect").value;
        var warning = "";
        if (projectId) {
            var project = null;
            for (var i = 0; i < data.projects.length; i++) {
                if (data.projects[i].id === projectId) {
                    project = data.projects[i];
                    break;
                }
            }
            if (project) {
                var totalUsed = 0;
                for (var j = 0; j < data.employees.length; j++) {
                    for (
                        var k = 0;
                        k < data.employees[j].assignments.length;
                        k++
                    ) {
                        if (
                            data.employees[j].assignments[k].projectId ===
                            projectId
                        ) {
                            totalUsed =
                                totalUsed +
                                data.employees[j].assignments[k].capacity;
                        }
                    }
                }
                if (totalUsed + cap > project.capacity) {
                    warning = "Warning: exceeds project capacity!";
                }
            }
        }
        document.getElementById("assignWarning").textContent = warning;
    }

    document
        .getElementById("capacitySlider")
        .addEventListener("input", updateSliders);
    document
        .getElementById("fitSlider")
        .addEventListener("input", updateSliders);
    document
        .getElementById("assignProjectSelect")
        .addEventListener("change", updateSliders);

    // Кнопка назначить
    document
        .getElementById("confirmAssignBtn")
        .addEventListener("click", function () {
            var projectId = document.getElementById(
                "assignProjectSelect",
            ).value;
            var capacity = document.getElementById("capacitySlider").value;
            var fit = document.getElementById("fitSlider").value;

            if (!projectId) {
                document.getElementById("assignWarning").textContent =
                    "Please select a project!";
                return;
            }

            assignEmployee(empId, projectId, capacity, fit, year, month);
            closeAssignPopup();
        });

    // Кнопка отмена
    document
        .getElementById("cancelAssignBtn")
        .addEventListener("click", closeAssignPopup);

    // Закрываем при клике вне попапа
    function outsideClickHandler(e) {
        var popup = document.getElementById("assignPopup");
        if (popup && !popup.contains(e.target) && e.target !== buttonEl) {
            closeAssignPopup();
            document.removeEventListener("click", outsideClickHandler);
        }
    }

    setTimeout(function () {
        document.addEventListener("click", outsideClickHandler);
    }, 150);

    // Обновляем позицию при скролле
    function scrollHandler() {
        var popup = document.getElementById("assignPopup");
        if (popup) {
            positionPopup(popup, buttonEl);
        } else {
            window.removeEventListener("scroll", scrollHandler);
        }
    }

    window.addEventListener("scroll", scrollHandler);
}

// Позиционирует попап рядом с кнопкой
function positionPopup(popup, buttonEl) {
    var rect = buttonEl.getBoundingClientRect();
    var popupWidth = 300;
    var popupHeight = 350;

    var left = rect.right + 8;
    var top = rect.top;

    // Если выходит за правый край — показываем слева
    if (left + popupWidth > window.innerWidth) {
        left = rect.left - popupWidth - 8;
    }

    // Если выходит за нижний край — поднимаем
    if (top + popupHeight > window.innerHeight) {
        top = window.innerHeight - popupHeight - 8;
    }

    popup.style.left = left + "px";
    popup.style.top = top + "px";
}

// Закрывает попап назначения
export function closeAssignPopup() {
    var existing = document.getElementById("assignPopup");
    if (existing) {
        existing.remove();
    }
}

// Показывает модальное окно с сотрудниками проекта
export function showProjectEmployeesModal(projectId, year, month) {
    var data = getCurrentMonthData();

    var project = null;
    for (var i = 0; i < data.projects.length; i++) {
        if (data.projects[i].id === projectId) {
            project = data.projects[i];
            break;
        }
    }
    if (!project) return;

    // Находим всех сотрудников проекта
    var assignedEmployees = [];
    for (var j = 0; j < data.employees.length; j++) {
        var emp = data.employees[j];
        for (var k = 0; k < emp.assignments.length; k++) {
            if (emp.assignments[k].projectId === projectId) {
                assignedEmployees.push({
                    employee: emp,
                    assignment: emp.assignments[k],
                });
            }
        }
    }

    // Сортируем по имени
    assignedEmployees.sort(function (a, b) {
        return a.employee.name.localeCompare(b.employee.name);
    });

    // Собираем данные для расчётов
    var allAssignmentsData = [];
    for (var m = 0; m < assignedEmployees.length; m++) {
        allAssignmentsData.push({
            assignment: assignedEmployees[m].assignment,
            vacationDays: assignedEmployees[m].employee.vacationDays,
        });
    }

    var totalEffective = 0;
    for (var n = 0; n < allAssignmentsData.length; n++) {
        var vacCoef = calcVacationCoefficient(
            allAssignmentsData[n].vacationDays,
            year,
            month,
        );
        totalEffective =
            totalEffective +
            allAssignmentsData[n].assignment.capacity *
                allAssignmentsData[n].assignment.fit *
                vacCoef;
    }

    var capacityForRevenue = Math.max(project.capacity, totalEffective);
    var revenuePerUnit =
        totalEffective > 0 ? project.budget / capacityForRevenue : 0;

    // Строим таблицу сотрудников
    var rowsHtml = "";
    if (assignedEmployees.length === 0) {
        rowsHtml =
            '<tr><td colspan="8" style="text-align:center;padding:16px;color:#999;">No employees assigned</td></tr>';
    } else {
        for (var p = 0; p < assignedEmployees.length; p++) {
            var item = assignedEmployees[p];
            var vacCoef2 = calcVacationCoefficient(
                item.employee.vacationDays,
                year,
                month,
            );
            var effectiveCap =
                item.assignment.capacity * item.assignment.fit * vacCoef2;
            var revenue = revenuePerUnit * effectiveCap;
            var cost =
                item.employee.salary * Math.max(0.5, item.assignment.capacity);
            var profit = revenue - cost;
            var profitClass = profit >= 0 ? "positive" : "negative";

            rowsHtml +=
                "<tr>" +
                "<td>" +
                item.employee.name +
                " " +
                item.employee.surname +
                "</td>" +
                "<td>" +
                item.assignment.capacity.toFixed(2) +
                "</td>" +
                "<td>" +
                item.assignment.fit.toFixed(2) +
                "</td>" +
                "<td>" +
                item.employee.vacationDays.length +
                "</td>" +
                "<td>" +
                effectiveCap.toFixed(3) +
                "</td>" +
                "<td>" +
                formatCurrency(revenue) +
                "</td>" +
                "<td>" +
                formatCurrency(cost) +
                "</td>" +
                '<td class="' +
                profitClass +
                '">' +
                formatCurrency(profit) +
                "</td>" +
                "</tr>";
        }
    }

    // Создаём модальное окно
    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "projectEmployeesModal";

    overlay.innerHTML =
        '<div class="modal">' +
        '<button class="modal-close" id="closeProjectModal">×</button>' +
        "<h3>" +
        project.company +
        " — " +
        project.name +
        "</h3>" +
        '<table class="data-table" style="margin-top:12px;">' +
        "<thead><tr>" +
        "<th>Employee</th><th>Capacity</th><th>Fit</th>" +
        "<th>Vacation Days</th><th>Effective Cap</th>" +
        "<th>Revenue</th><th>Cost</th><th>Profit</th>" +
        "</tr></thead>" +
        "<tbody>" +
        rowsHtml +
        "</tbody>" +
        "</table>" +
        "</div>";

    document.body.appendChild(overlay);

    // Закрываем при клике на крестик или фон
    document
        .getElementById("closeProjectModal")
        .addEventListener("click", function () {
            overlay.remove();
        });

    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

// Показывает модальное окно с назначениями сотрудника
export function showEmployeeAssignmentsModal(empId, year, month) {
    var data = getCurrentMonthData();

    var emp = null;
    for (var i = 0; i < data.employees.length; i++) {
        if (data.employees[i].id === empId) {
            emp = data.employees[i];
            break;
        }
    }
    if (!emp) return;

    var rowsHtml = "";
    if (emp.assignments.length === 0) {
        rowsHtml =
            '<tr><td colspan="8" style="text-align:center;padding:16px;color:#999;">No assignments yet</td></tr>';
    } else {
        for (var j = 0; j < emp.assignments.length; j++) {
            var assignment = emp.assignments[j];
            var project = null;
            for (var k = 0; k < data.projects.length; k++) {
                if (data.projects[k].id === assignment.projectId) {
                    project = data.projects[k];
                    break;
                }
            }
            if (!project) continue;

            // Считаем финансы
            var allProjectAssignments = [];
            for (var l = 0; l < data.employees.length; l++) {
                for (var m = 0; m < data.employees[l].assignments.length; m++) {
                    if (
                        data.employees[l].assignments[m].projectId ===
                        project.id
                    ) {
                        allProjectAssignments.push({
                            assignment: data.employees[l].assignments[m],
                            vacationDays: data.employees[l].vacationDays,
                        });
                    }
                }
            }

            var totalEffective = 0;
            for (var n = 0; n < allProjectAssignments.length; n++) {
                var vc = calcVacationCoefficient(
                    allProjectAssignments[n].vacationDays,
                    year,
                    month,
                );
                totalEffective =
                    totalEffective +
                    allProjectAssignments[n].assignment.capacity *
                        allProjectAssignments[n].assignment.fit *
                        vc;
            }

            var capacityForRevenue = Math.max(project.capacity, totalEffective);
            var revenuePerUnit = project.budget / capacityForRevenue;
            var vacCoef = calcVacationCoefficient(
                emp.vacationDays,
                year,
                month,
            );
            var effectiveCap = assignment.capacity * assignment.fit * vacCoef;
            var revenue = revenuePerUnit * effectiveCap;
            var cost = emp.salary * Math.max(0.5, assignment.capacity);
            var profit = revenue - cost;
            var profitClass = profit >= 0 ? "positive" : "negative";

            rowsHtml +=
                "<tr>" +
                "<td>" +
                project.company +
                " — " +
                project.name +
                "</td>" +
                "<td>" +
                assignment.capacity.toFixed(2) +
                "</td>" +
                "<td>" +
                assignment.fit.toFixed(2) +
                "</td>" +
                "<td>" +
                emp.vacationDays.length +
                "</td>" +
                "<td>" +
                effectiveCap.toFixed(3) +
                "</td>" +
                "<td>" +
                formatCurrency(revenue) +
                "</td>" +
                "<td>" +
                formatCurrency(cost) +
                "</td>" +
                '<td class="' +
                profitClass +
                '">' +
                formatCurrency(profit) +
                "</td>" +
                "</tr>";
        }
    }

    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "employeeAssignmentsModal";

    overlay.innerHTML =
        '<div class="modal">' +
        '<button class="modal-close" id="closeEmpModal">×</button>' +
        "<h3>" +
        emp.name +
        " " +
        emp.surname +
        " — Assignments</h3>" +
        '<table class="data-table" style="margin-top:12px;">' +
        "<thead><tr>" +
        "<th>Project</th><th>Capacity</th><th>Fit</th>" +
        "<th>Vacation Days</th><th>Effective Cap</th>" +
        "<th>Revenue</th><th>Cost</th><th>Profit</th>" +
        "</tr></thead>" +
        "<tbody>" +
        rowsHtml +
        "</tbody>" +
        "</table>" +
        "</div>";

    document.body.appendChild(overlay);

    document
        .getElementById("closeEmpModal")
        .addEventListener("click", function () {
            overlay.remove();
        });

    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}
