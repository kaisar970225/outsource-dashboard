import { getCurrentMonthData, saveCurrentMonth } from "../state/appState.js";
import { generateId } from "../utils/id.js";
import { renderProjectsTable, renderEmployeesTable } from "./tables.js";

// ==================== ПРОЕКТЫ ====================

// Добавляет новый проект
export function addProject(name, company, budget, capacity, year, month) {
    var data = getCurrentMonthData();

    var newProject = {
        id: generateId("proj"),
        name: name,
        company: company,
        budget: parseFloat(budget),
        capacity: parseInt(capacity),
    };

    data.projects.push(newProject);
    saveCurrentMonth();
    renderProjectsTable(year, month);
    renderEmployeesTable(year, month);
}

// Удаляет проект и снимает всех сотрудников с него
export function deleteProject(projectId, year, month) {
    var data = getCurrentMonthData();

    // Снимаем всех сотрудников с этого проекта
    for (var i = 0; i < data.employees.length; i++) {
        var emp = data.employees[i];
        var newAssignments = [];
        for (var j = 0; j < emp.assignments.length; j++) {
            if (emp.assignments[j].projectId !== projectId) {
                newAssignments.push(emp.assignments[j]);
            }
        }
        emp.assignments = newAssignments;
    }

    // Удаляем сам проект
    var newProjects = [];
    for (var k = 0; k < data.projects.length; k++) {
        if (data.projects[k].id !== projectId) {
            newProjects.push(data.projects[k]);
        }
    }
    data.projects = newProjects;

    saveCurrentMonth();
    renderProjectsTable(year, month);
    renderEmployeesTable(year, month);
}

// ==================== СОТРУДНИКИ ====================

// Добавляет нового сотрудника
export function addEmployee(name, surname, dob, position, salary, year, month) {
    var data = getCurrentMonthData();

    var newEmployee = {
        id: generateId("emp"),
        name: name,
        surname: surname,
        dob: dob,
        position: position,
        salary: parseFloat(salary),
        assignments: [],
        vacationDays: [],
    };

    data.employees.push(newEmployee);
    saveCurrentMonth();
    renderProjectsTable(year, month);
    renderEmployeesTable(year, month);
}

// Удаляет сотрудника и все его назначения
export function deleteEmployee(empId, year, month) {
    var data = getCurrentMonthData();

    var newEmployees = [];
    for (var i = 0; i < data.employees.length; i++) {
        if (data.employees[i].id !== empId) {
            newEmployees.push(data.employees[i]);
        }
    }
    data.employees = newEmployees;

    saveCurrentMonth();
    renderProjectsTable(year, month);
    renderEmployeesTable(year, month);
}

// ==================== INLINE РЕДАКТИРОВАНИЕ ====================

// Меняет должность сотрудника прямо в таблице
export function updateEmployeePosition(empId, newPosition, year, month) {
    var data = getCurrentMonthData();

    for (var i = 0; i < data.employees.length; i++) {
        if (data.employees[i].id === empId) {
            data.employees[i].position = newPosition;
            break;
        }
    }

    saveCurrentMonth();
    renderProjectsTable(year, month);
    renderEmployeesTable(year, month);
}

// Меняет зарплату сотрудника прямо в таблице
export function updateEmployeeSalary(empId, newSalary, year, month) {
    var data = getCurrentMonthData();

    for (var i = 0; i < data.employees.length; i++) {
        if (data.employees[i].id === empId) {
            data.employees[i].salary = parseFloat(newSalary);
            break;
        }
    }

    saveCurrentMonth();
    renderProjectsTable(year, month);
    renderEmployeesTable(year, month);
}
