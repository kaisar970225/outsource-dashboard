import { getCurrentMonthData, saveCurrentMonth } from "../state/appState.js";
import { getFilteredProjects, getFilteredEmployees } from "./sortFilter.js";
import { formatCurrency, calcAge } from "../utils/format.js";
import { calcVacationCoefficient } from "../utils/date.js";

// Считает эффективную мощность сотрудника на проекте
// Формула: мощность × соответствие × коэффициент отпуска
function calcEffectiveCapacity(assignment, vacationDays, year, month) {
    var vacCoef = calcVacationCoefficient(vacationDays, year, month);
    return assignment.capacity * assignment.fit * vacCoef;
}

// Считает выручку сотрудника на проекте
function calcEmployeeRevenue(
    assignment,
    vacationDays,
    project,
    allAssignments,
    year,
    month,
) {
    var effectiveCap = calcEffectiveCapacity(
        assignment,
        vacationDays,
        year,
        month,
    );

    // Считаем общую эффективную мощность всех сотрудников на проекте
    var totalEffective = 0;
    for (var i = 0; i < allAssignments.length; i++) {
        var a = allAssignments[i];
        totalEffective =
            totalEffective +
            calcEffectiveCapacity(a.assignment, a.vacationDays, year, month);
    }

    var capacityForRevenue = Math.max(project.capacity, totalEffective);
    var revenuePerUnit = project.budget / capacityForRevenue;
    return revenuePerUnit * effectiveCap;
}

// Считает стоимость сотрудника на проекте
function calcEmployeeCost(salary, capacity) {
    return salary * Math.max(0.5, capacity);
}

// Отрисовывает таблицу проектов
export function renderProjectsTable(year, month) {
    var data = getCurrentMonthData();
    var projects = getFilteredProjects(year, month);
    var tbody = document.getElementById("projectsBody");
    tbody.innerHTML = "";

    if (projects.length === 0) {
        var emptyRow = document.createElement("tr");
        emptyRow.innerHTML =
            '<td colspan="7" style="text-align:center;padding:20px;color:#999;">No projects yet. Click + Add Project to start.</td>';
        tbody.appendChild(emptyRow);
        return;
    }

    for (var i = 0; i < projects.length; i++) {
        var project = projects[i];

        // Находим всех сотрудников назначенных на этот проект
        var assignedEmployees = [];
        for (var j = 0; j < data.employees.length; j++) {
            var emp = data.employees[j];
            for (var k = 0; k < emp.assignments.length; k++) {
                if (emp.assignments[k].projectId === project.id) {
                    assignedEmployees.push({
                        employee: emp,
                        assignment: emp.assignments[k],
                    });
                }
            }
        }

        // Считаем использованную мощность
        var usedEffective = 0;
        var allAssignmentsData = [];
        for (var m = 0; m < assignedEmployees.length; m++) {
            var item = assignedEmployees[m];
            allAssignmentsData.push({
                assignment: item.assignment,
                vacationDays: item.employee.vacationDays,
            });
            usedEffective =
                usedEffective +
                calcEffectiveCapacity(
                    item.assignment,
                    item.employee.vacationDays,
                    year,
                    month,
                );
        }

        // Считаем доход и затраты проекта
        var totalRevenue = 0;
        var totalCost = 0;
        for (var n = 0; n < assignedEmployees.length; n++) {
            var empItem = assignedEmployees[n];
            totalRevenue =
                totalRevenue +
                calcEmployeeRevenue(
                    empItem.assignment,
                    empItem.employee.vacationDays,
                    project,
                    allAssignmentsData,
                    year,
                    month,
                );
            totalCost =
                totalCost +
                calcEmployeeCost(
                    empItem.employee.salary,
                    empItem.assignment.capacity,
                );
        }

        var projectIncome = totalRevenue - totalCost;
        var incomeClass = projectIncome >= 0 ? "positive" : "negative";

        // Проверяем превышение мощности
        var capacityText = usedEffective.toFixed(2) + "/" + project.capacity;
        var capacityStyle =
            usedEffective > project.capacity
                ? "color:#e74c3c;font-weight:600;"
                : "";

        var tr = document.createElement("tr");
        tr.innerHTML =
            "<td>" +
            project.company +
            "</td>" +
            "<td>" +
            project.name +
            "</td>" +
            "<td>" +
            formatCurrency(project.budget) +
            "</td>" +
            '<td style="' +
            capacityStyle +
            '">' +
            capacityText +
            "</td>" +
            '<td><button class="table-btn primary show-employees-btn" data-project-id="' +
            project.id +
            '">Show Employees (' +
            assignedEmployees.length +
            ")</button></td>" +
            '<td class="' +
            incomeClass +
            '">' +
            formatCurrency(projectIncome) +
            "</td>" +
            '<td><button class="table-btn danger delete-project-btn" data-project-id="' +
            project.id +
            '">Delete</button></td>';

        tbody.appendChild(tr);
    }

    renderTotalIncome(year, month);
}

// Считает и показывает общий доход внизу таблицы проектов
function renderTotalIncome(year, month) {
    var data = getCurrentMonthData();
    var total = 0;

    for (var i = 0; i < data.projects.length; i++) {
        var project = data.projects[i];
        var assignedEmployees = [];

        for (var j = 0; j < data.employees.length; j++) {
            var emp = data.employees[j];
            for (var k = 0; k < emp.assignments.length; k++) {
                if (emp.assignments[k].projectId === project.id) {
                    assignedEmployees.push({
                        employee: emp,
                        assignment: emp.assignments[k],
                    });
                }
            }
        }

        var allAssignmentsData = [];
        for (var m = 0; m < assignedEmployees.length; m++) {
            allAssignmentsData.push({
                assignment: assignedEmployees[m].assignment,
                vacationDays: assignedEmployees[m].employee.vacationDays,
            });
        }

        var projectRevenue = 0;
        var projectCost = 0;
        for (var n = 0; n < assignedEmployees.length; n++) {
            var item = assignedEmployees[n];
            projectRevenue =
                projectRevenue +
                calcEmployeeRevenue(
                    item.assignment,
                    item.employee.vacationDays,
                    project,
                    allAssignmentsData,
                    year,
                    month,
                );
            projectCost =
                projectCost +
                calcEmployeeCost(
                    item.employee.salary,
                    item.assignment.capacity,
                );
        }
        total = total + (projectRevenue - projectCost);
    }

    // Вычитаем bench cost для незанятых сотрудников
    for (var p = 0; p < data.employees.length; p++) {
        var employee = data.employees[p];
        if (employee.assignments.length === 0) {
            total = total - employee.salary * 0.5;
        }
    }

    var totalEl = document.getElementById("totalIncome");
    var totalClass = total >= 0 ? "positive" : "negative";
    totalEl.innerHTML =
        'Total Estimated Income: <span class="' +
        totalClass +
        '">' +
        formatCurrency(total) +
        "</span>";
}

// Отрисовывает таблицу сотрудников
export function renderEmployeesTable(year, month) {
    var data = getCurrentMonthData();
    var employees = getFilteredEmployees(year, month);
    var tbody = document.getElementById("employeesBody");
    tbody.innerHTML = "";

    if (employees.length === 0) {
        var emptyRow = document.createElement("tr");
        emptyRow.innerHTML =
            '<td colspan="9" style="text-align:center;padding:20px;color:#999;">No employees yet. Click + Add Employee to start.</td>';
        tbody.appendChild(emptyRow);
        return;
    }

    for (var i = 0; i < employees.length; i++) {
        var emp = employees[i];
        var age = calcAge(emp.dob);

        // Считаем общую назначенную мощность
        var totalCapacity = 0;
        for (var j = 0; j < emp.assignments.length; j++) {
            totalCapacity = totalCapacity + emp.assignments[j].capacity;
        }

        // Считаем предполагаемую выплату
        var estPayment = 0;
        if (emp.assignments.length === 0) {
            estPayment = emp.salary * 0.5;
        } else {
            for (var k = 0; k < emp.assignments.length; k++) {
                estPayment =
                    estPayment +
                    emp.salary * Math.max(0.5, emp.assignments[k].capacity);
            }
        }

        // Считаем прогнозируемый доход сотрудника
        var estIncome = 0;
        var data2 = getCurrentMonthData();
        for (var a = 0; a < emp.assignments.length; a++) {
            var assignment = emp.assignments[a];
            var project = null;
            for (var b = 0; b < data2.projects.length; b++) {
                if (data2.projects[b].id === assignment.projectId) {
                    project = data2.projects[b];
                    break;
                }
            }
            if (!project) continue;

            // Собираем всех сотрудников этого проекта
            var projectAssignments = [];
            for (var c = 0; c < data2.employees.length; c++) {
                for (
                    var d = 0;
                    d < data2.employees[c].assignments.length;
                    d++
                ) {
                    if (
                        data2.employees[c].assignments[d].projectId ===
                        project.id
                    ) {
                        projectAssignments.push({
                            assignment: data2.employees[c].assignments[d],
                            vacationDays: data2.employees[c].vacationDays,
                        });
                    }
                }
            }

            var revenue = calcEmployeeRevenue(
                assignment,
                emp.vacationDays,
                project,
                projectAssignments,
                year,
                month,
            );
            var cost = calcEmployeeCost(emp.salary, assignment.capacity);
            estIncome = estIncome + (revenue - cost);
        }

        var incomeClass = estIncome >= 0 ? "positive" : "negative";
        var isMaxCapacity = totalCapacity >= 1.5;

        var tr = document.createElement("tr");
        tr.innerHTML =
            "<td>" +
            emp.name +
            "</td>" +
            "<td>" +
            emp.surname +
            "</td>" +
            "<td>" +
            age +
            "</td>" +
            "<td>" +
            emp.position +
            "</td>" +
            "<td>" +
            formatCurrency(emp.salary) +
            "</td>" +
            "<td>" +
            formatCurrency(estPayment) +
            "</td>" +
            '<td><button class="table-btn primary show-assignments-btn" data-emp-id="' +
            emp.id +
            '">Show Assignments (' +
            emp.assignments.length +
            ") " +
            totalCapacity.toFixed(1) +
            "/1.5</button></td>" +
            '<td class="' +
            incomeClass +
            '">' +
            formatCurrency(estIncome) +
            "</td>" +
            "<td>" +
            '<button class="table-btn secondary availability-btn" data-emp-id="' +
            emp.id +
            '">Availability</button> ' +
            '<button class="table-btn primary assign-btn" data-emp-id="' +
            emp.id +
            '" ' +
            (isMaxCapacity ? "disabled" : "") +
            ">Assign</button> " +
            '<button class="table-btn danger delete-emp-btn" data-emp-id="' +
            emp.id +
            '">Delete</button>' +
            "</td>";

        tbody.appendChild(tr);
    }
}
