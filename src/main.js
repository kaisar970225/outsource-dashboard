import "./style.css";
import {
    initState,
    getCurrentYear,
    getCurrentMonth,
    setCurrentYear,
    setCurrentMonth,
    setCurrentView,
    getCurrentView,
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
    updateEmployeePosition,
    updateEmployeeSalary,
} from "./js/modules/crud.js";
import {
    validateProjectForm,
    validateEmployeeForm,
} from "./js/modules/validation.js";

document.addEventListener("DOMContentLoaded", function () {
    initState();

    var year = getCurrentYear();
    var month = getCurrentMonth();

    // Устанавливаем правильный месяц и год в селекторах
    document.getElementById("monthSelect").value = month;
    document.getElementById("yearSelect").value = year;

    // Отрисовываем таблицы
    renderProjectsTable(year, month);
    renderEmployeesTable(year, month);

    // ==================== БОКОВАЯ ПАНЕЛЬ ====================

    // Сворачивание боковой панели
    document
        .getElementById("sidebarToggle")
        .addEventListener("click", function () {
            var sidebar = document.getElementById("sidebar");
            sidebar.classList.toggle("collapsed");
        });

    // Смена месяца
    document
        .getElementById("monthSelect")
        .addEventListener("change", function () {
            setCurrentMonth(parseInt(this.value));
            renderProjectsTable(getCurrentYear(), getCurrentMonth());
            renderEmployeesTable(getCurrentYear(), getCurrentMonth());
        });

    // Смена года
    document
        .getElementById("yearSelect")
        .addEventListener("change", function () {
            setCurrentYear(parseInt(this.value));
            renderProjectsTable(getCurrentYear(), getCurrentMonth());
            renderEmployeesTable(getCurrentYear(), getCurrentMonth());
        });

    // Переключение вкладок
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

    // ==================== ПАНЕЛЬ ДОБАВЛЕНИЯ ПРОЕКТА ====================

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

    // Валидация в реальном времени
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

    // Отправка формы проекта
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

                // Очищаем форму и закрываем панель
                document.getElementById("projectName").value = "";
                document.getElementById("projectCompany").value = "";
                document.getElementById("projectBudget").value = "";
                document.getElementById("projectCapacity").value = "";
                document
                    .getElementById("addProjectDrawer")
                    .classList.remove("open");
            }
        });

    // ==================== ПАНЕЛЬ ДОБАВЛЕНИЯ СОТРУДНИКА ====================

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

    // Валидация в реальном времени
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

    // Отправка формы сотрудника
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

                // Очищаем форму и закрываем панель
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

    // ==================== КНОПКИ В ТАБЛИЦАХ ====================

    // Делегирование событий — слушаем клики на tbody
    // Это лучше чем вешать обработчик на каждую кнопку отдельно
    document
        .getElementById("projectsBody")
        .addEventListener("click", function (e) {
            var target = e.target;

            // Удаление проекта
            if (target.classList.contains("delete-project-btn")) {
                var projectId = target.getAttribute("data-project-id");
                var data = getCurrentMonthData();
                var project = null;
                for (var i = 0; i < data.projects.length; i++) {
                    if (data.projects[i].id === projectId) {
                        project = data.projects[i];
                        break;
                    }
                }
                if (
                    project &&
                    confirm('Delete project "' + project.name + '"?')
                ) {
                    deleteProject(
                        projectId,
                        getCurrentYear(),
                        getCurrentMonth(),
                    );
                }
            }
        });

    document
        .getElementById("employeesBody")
        .addEventListener("click", function (e) {
            var target = e.target;

            // Удаление сотрудника
            if (target.classList.contains("delete-emp-btn")) {
                var empId = target.getAttribute("data-emp-id");
                var data = getCurrentMonthData();
                var emp = null;
                for (var i = 0; i < data.employees.length; i++) {
                    if (data.employees[i].id === empId) {
                        emp = data.employees[i];
                        break;
                    }
                }
                if (
                    emp &&
                    confirm(
                        'Delete employee "' +
                            emp.name +
                            " " +
                            emp.surname +
                            '"?',
                    )
                ) {
                    deleteEmployee(empId, getCurrentYear(), getCurrentMonth());
                }
            }
        });
});
