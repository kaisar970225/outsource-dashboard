// Проверяет форму добавления проекта
// Возвращает true если всё заполнено правильно

export function validateProjectForm() {
    var name = document.getElementById("projectName").value.trim();
    var company = document.getElementById("projectCompany").value.trim();
    var budget = document.getElementById("projectBudget").value;
    var capacity = document.getElementById("projectCapacity").value;

    var isValid = true;

    // Проверяем название проекта — минимум 3 символа, буквы и цифры
    var nameError = document.getElementById("projectNameError");
    if (name.length < 3) {
        nameError.textContent = "Min 3 characters required";
        isValid = false;
    } else if (!/^[a-zA-Z0-9\s]+$/.test(name)) {
        nameError.textContent = "Only letters and numbers allowed";
        isValid = false;
    } else {
        nameError.textContent = "";
    }

    // Проверяем название компании — минимум 2 символа
    var companyError = document.getElementById("projectCompanyError");
    if (company.length < 2) {
        companyError.textContent = "Min 2 characters required";
        isValid = false;
    } else if (!/^[a-zA-Z0-9\s]+$/.test(company)) {
        companyError.textContent = "Only letters and numbers allowed";
        isValid = false;
    } else {
        companyError.textContent = "";
    }

    // Проверяем бюджет — положительное число
    var budgetError = document.getElementById("projectBudgetError");
    if (!budget || parseFloat(budget) <= 0) {
        budgetError.textContent = "Enter a positive number";
        isValid = false;
    } else {
        budgetError.textContent = "";
    }

    // Проверяем мощность — целое число минимум 1
    var capacityError = document.getElementById("projectCapacityError");
    if (!capacity || parseInt(capacity) < 1) {
        capacityError.textContent = "Minimum capacity is 1";
        isValid = false;
    } else {
        capacityError.textContent = "";
    }

    // Кнопка активна только если всё правильно
    document.getElementById("submitProject").disabled = !isValid;
    return isValid;
}

// Проверяет форму добавления сотрудника
export function validateEmployeeForm() {
    var name = document.getElementById("empName").value.trim();
    var surname = document.getElementById("empSurname").value.trim();
    var dob = document.getElementById("empDob").value;
    var position = document.getElementById("empPosition").value;
    var salary = document.getElementById("empSalary").value;

    var isValid = true;

    // Проверяем имя — минимум 3 буквы
    var nameError = document.getElementById("empNameError");
    if (name.length < 3) {
        nameError.textContent = "Min 3 letters required";
        isValid = false;
    } else if (!/^[a-zA-Z]+$/.test(name)) {
        nameError.textContent = "Only letters allowed";
        isValid = false;
    } else {
        nameError.textContent = "";
    }

    // Проверяем фамилию — минимум 3 буквы
    var surnameError = document.getElementById("empSurnameError");
    if (surname.length < 3) {
        surnameError.textContent = "Min 3 letters required";
        isValid = false;
    } else if (!/^[a-zA-Z]+$/.test(surname)) {
        surnameError.textContent = "Only letters allowed";
        isValid = false;
    } else {
        surnameError.textContent = "";
    }

    // Проверяем дату рождения — должно быть 18+ лет
    var dobError = document.getElementById("empDobError");
    if (!dob) {
        dobError.textContent = "Date of birth is required";
        isValid = false;
    } else {
        var today = new Date();
        var birthDate = new Date(dob);
        var age = today.getFullYear() - birthDate.getFullYear();
        var monthDiff = today.getMonth() - birthDate.getMonth();
        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        if (age < 18) {
            dobError.textContent = "Employee must be at least 18 years old";
            isValid = false;
        } else {
            dobError.textContent = "";
        }
    }

    // Проверяем должность
    var positionError = document.getElementById("empPositionError");
    if (!position) {
        positionError.textContent = "Please select a position";
        isValid = false;
    } else {
        positionError.textContent = "";
    }

    // Проверяем зарплату — положительное число
    var salaryError = document.getElementById("empSalaryError");
    if (!salary || parseFloat(salary) <= 0) {
        salaryError.textContent = "Enter a positive number";
        isValid = false;
    } else {
        salaryError.textContent = "";
    }

    // Кнопка активна только если всё правильно
    document.getElementById("submitEmployee").disabled = !isValid;
    return isValid;
}
