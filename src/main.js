import "./style.css";
import {
    initState,
    getCurrentYear,
    getCurrentMonth,
    setCurrentYear,
    setCurrentMonth,
    setCurrentView,
    saveCurrentMonth,
    getCurrentMonthData,
} from "./js/state/appState.js";
import {
    renderProjectsTable,
    renderEmployeesTable,
} from "./js/modules/tables.js";
import {
    addProject,
    deleteProject,
    addEmployee,
    deleteEmployee,
} from "./js/modules/crud.js";
import {
    validateProjectForm,
    validateEmployeeForm,
} from "./js/modules/validation.js";
import {
    showAssignPopup,
    showProjectEmployeesModal,
    showEmployeeAssignmentsModal,
} from "./js/modules/assignments.js";
import {
    setProjectSort,
    setEmployeeSort,
    showFilterPopup,
    removeFilter,
    clearAllFilters,
    renderProjectFilterChips,
    renderEmployeeFilterChips,
} from "./js/modules/sortFilter.js";

import { showCalendarModal } from "./js/modules/calendar.js";
import { showSeedDataModal } from "./js/modules/seedData.js";

document.addEventListener("DOMContentLoaded", function () {
    initState();

    var year = getCurrentYear();
    var month = getCurrentMonth();

    document.getElementById("monthSelect").value = month;
    document.getElementById("yearSelect").value = year;

    renderProjectsTable(year, month);
    renderEmployeesTable(year, month);

    // ==================== БОКОВАЯ ПАНЕЛЬ ====================

    document
        .getElementById("sidebarToggle")
        .addEventListener("click", function () {
            document.getElementById("sidebar").classList.toggle("collapsed");
        });

    document
        .getElementById("monthSelect")
        .addEventListener("change", function () {
            setCurrentMonth(parseInt(this.value));
            renderProjectsTable(getCurrentYear(), getCurrentMonth());
            renderEmployeesTable(getCurrentYear(), getCurrentMonth());
        });

    document
        .getElementById("yearSelect")
        .addEventListener("change", function () {
            setCurrentYear(parseInt(this.value));
            renderProjectsTable(getCurrentYear(), getCurrentMonth());
            renderEmployeesTable(getCurrentYear(), getCurrentMonth());
        });

    document
        .getElementById("btnProjects")
        .addEventListener("click", function () {
            document.getElementById("projectsView").classList.remove("hidden");
            document.getElementById("employeesView").classList.add("hidden");
            document.getElementById("btnProjects").classList.add("active");
            document.getElementById("btnEmployees").classList.remove("active");
            setCurrentView("projects");
        });

    document
        .getElementById("btnEmployees")
        .addEventListener("click", function () {
            document.getElementById("employeesView").classList.remove("hidden");
            document.getElementById("projectsView").classList.add("hidden");
            document.getElementById("btnEmployees").classList.add("active");
            document.getElementById("btnProjects").classList.remove("active");
            setCurrentView("employees");
        });

    // ==================== ДОБАВЛЕНИЕ ПРОЕКТА ====================

    document
        .getElementById("addProjectBtn")
        .addEventListener("click", function () {
            document.getElementById("addProjectDrawer").classList.add("open");
        });

    document
        .getElementById("closeProjectDrawer")
        .addEventListener("click", function () {
            document
                .getElementById("addProjectDrawer")
                .classList.remove("open");
        });

    document
        .getElementById("projectName")
        .addEventListener("input", validateProjectForm);
    document
        .getElementById("projectCompany")
        .addEventListener("input", validateProjectForm);
    document
        .getElementById("projectBudget")
        .addEventListener("input", validateProjectForm);
    document
        .getElementById("projectCapacity")
        .addEventListener("input", validateProjectForm);

    document
        .getElementById("submitProject")
        .addEventListener("click", function () {
            if (validateProjectForm()) {
                var name = document.getElementById("projectName").value.trim();
                var company = document
                    .getElementById("projectCompany")
                    .value.trim();
                var budget = document.getElementById("projectBudget").value;
                var capacity = document.getElementById("projectCapacity").value;
                addProject(
                    name,
                    company,
                    budget,
                    capacity,
                    getCurrentYear(),
                    getCurrentMonth(),
                );
                document.getElementById("projectName").value = "";
                document.getElementById("projectCompany").value = "";
                document.getElementById("projectBudget").value = "";
                document.getElementById("projectCapacity").value = "";
                document
                    .getElementById("addProjectDrawer")
                    .classList.remove("open");
            }
        });

    // ==================== ДОБАВЛЕНИЕ СОТРУДНИКА ====================

    document
        .getElementById("addEmployeeBtn")
        .addEventListener("click", function () {
            document.getElementById("addEmployeeDrawer").classList.add("open");
        });

    document
        .getElementById("closeEmployeeDrawer")
        .addEventListener("click", function () {
            document
                .getElementById("addEmployeeDrawer")
                .classList.remove("open");
        });

    document
        .getElementById("empName")
        .addEventListener("input", validateEmployeeForm);
    document
        .getElementById("empSurname")
        .addEventListener("input", validateEmployeeForm);
    document
        .getElementById("empDob")
        .addEventListener("input", validateEmployeeForm);
    document
        .getElementById("empPosition")
        .addEventListener("change", validateEmployeeForm);
    document
        .getElementById("empSalary")
        .addEventListener("input", validateEmployeeForm);

    document
        .getElementById("submitEmployee")
        .addEventListener("click", function () {
            if (validateEmployeeForm()) {
                var name = document.getElementById("empName").value.trim();
                var surname = document
                    .getElementById("empSurname")
                    .value.trim();
                var dob = document.getElementById("empDob").value;
                var position = document.getElementById("empPosition").value;
                var salary = document.getElementById("empSalary").value;
                addEmployee(
                    name,
                    surname,
                    dob,
                    position,
                    salary,
                    getCurrentYear(),
                    getCurrentMonth(),
                );
                document.getElementById("empName").value = "";
                document.getElementById("empSurname").value = "";
                document.getElementById("empDob").value = "";
                document.getElementById("empPosition").value = "";
                document.getElementById("empSalary").value = "";
                document
                    .getElementById("addEmployeeDrawer")
                    .classList.remove("open");
            }
        });

    // ==================== КНОПКИ В ТАБЛИЦЕ ПРОЕКТОВ ====================

    document
        .getElementById("projectsBody")
        .addEventListener("click", function (e) {
            var target = e.target;

            if (target.classList.contains("delete-project-btn")) {
                var projectId = target.getAttribute("data-project-id");
                var data = getCurrentMonthData();
                for (var i = 0; i < data.projects.length; i++) {
                    if (data.projects[i].id === projectId) {
                        if (
                            confirm(
                                'Delete project "' +
                                    data.projects[i].name +
                                    '"?',
                            )
                        ) {
                            deleteProject(
                                projectId,
                                getCurrentYear(),
                                getCurrentMonth(),
                            );
                        }
                        break;
                    }
                }
            }

            if (target.classList.contains("show-employees-btn")) {
                var projectId = target.getAttribute("data-project-id");
                showProjectEmployeesModal(
                    projectId,
                    getCurrentYear(),
                    getCurrentMonth(),
                );
            }
        });

    // ==================== КНОПКИ В ТАБЛИЦЕ СОТРУДНИКОВ ====================

    document
        .getElementById("employeesBody")
        .addEventListener("click", function (e) {
            var target = e.target;

            if (target.classList.contains("delete-emp-btn")) {
                var empId = target.getAttribute("data-emp-id");
                var data = getCurrentMonthData();
                for (var i = 0; i < data.employees.length; i++) {
                    if (data.employees[i].id === empId) {
                        if (
                            confirm(
                                'Delete employee "' +
                                    data.employees[i].name +
                                    " " +
                                    data.employees[i].surname +
                                    '"?',
                            )
                        ) {
                            deleteEmployee(
                                empId,
                                getCurrentYear(),
                                getCurrentMonth(),
                            );
                        }
                        break;
                    }
                }
            }

            if (target.classList.contains("assign-btn")) {
                var empId = target.getAttribute("data-emp-id");
                showAssignPopup(
                    empId,
                    target,
                    getCurrentYear(),
                    getCurrentMonth(),
                );
            }

            if (target.classList.contains("show-assignments-btn")) {
                var empId = target.getAttribute("data-emp-id");
                showEmployeeAssignmentsModal(
                    empId,
                    getCurrentYear(),
                    getCurrentMonth(),
                );
            }
        });

    // ==================== СОРТИРОВКА И ФИЛЬТРАЦИЯ ====================

    document
        .getElementById("projectsTable")
        .addEventListener("click", function (e) {
            var target = e.target;
            if (target.classList.contains("sort-icon")) {
                setProjectSort(target.getAttribute("data-col"));
                renderProjectsTable(getCurrentYear(), getCurrentMonth());
            }
            if (target.classList.contains("filter-icon")) {
                showFilterPopup(
                    target.getAttribute("data-col"),
                    "projects",
                    target,
                    getCurrentYear(),
                    getCurrentMonth(),
                );
            }
        });

    document
        .getElementById("employeesTable")
        .addEventListener("click", function (e) {
            var target = e.target;
            if (target.classList.contains("sort-icon")) {
                setEmployeeSort(target.getAttribute("data-col"));
                renderEmployeesTable(getCurrentYear(), getCurrentMonth());
            }
            if (target.classList.contains("filter-icon")) {
                showFilterPopup(
                    target.getAttribute("data-col"),
                    "employees",
                    target,
                    getCurrentYear(),
                    getCurrentMonth(),
                );
            }
        });

    // ==================== ЧИПЫ ФИЛЬТРОВ ====================

    document
        .getElementById("projectFilterChips")
        .addEventListener("click", function (e) {
            var target = e.target;
            if (
                target.tagName === "BUTTON" &&
                target.getAttribute("data-col")
            ) {
                removeFilter(
                    target.getAttribute("data-col"),
                    "projects",
                    getCurrentYear(),
                    getCurrentMonth(),
                );
                renderProjectsTable(getCurrentYear(), getCurrentMonth());
            }
            if (target.classList.contains("clear-filters-btn")) {
                clearAllFilters(
                    "projects",
                    getCurrentYear(),
                    getCurrentMonth(),
                );
                renderProjectsTable(getCurrentYear(), getCurrentMonth());
            }
        });

    document
        .getElementById("employeeFilterChips")
        .addEventListener("click", function (e) {
            var target = e.target;
            if (
                target.tagName === "BUTTON" &&
                target.getAttribute("data-col")
            ) {
                removeFilter(
                    target.getAttribute("data-col"),
                    "employees",
                    getCurrentYear(),
                    getCurrentMonth(),
                );
                renderEmployeesTable(getCurrentYear(), getCurrentMonth());
            }
            if (target.classList.contains("clear-filters-btn")) {
                clearAllFilters(
                    "employees",
                    getCurrentYear(),
                    getCurrentMonth(),
                );
                renderEmployeesTable(getCurrentYear(), getCurrentMonth());
            }
        });
    // ==================== КАЛЕНДАРЬ ОТПУСКОВ ====================

    document
        .getElementById("employeesBody")
        .addEventListener("click", function (e) {
            var target = e.target;
            if (target.classList.contains("availability-btn")) {
                var empId = target.getAttribute("data-emp-id");
                showCalendarModal(empId, getCurrentYear(), getCurrentMonth());
            }
        });

    // ==================== SEED DATA ====================

    document.getElementById("seedBtn").addEventListener("click", function () {
        showSeedDataModal(getCurrentYear(), getCurrentMonth());
    });
});
