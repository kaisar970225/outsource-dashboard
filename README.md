# Outsource Dashboard

A web application for managing outsource teams, projects, and financial planning.

## Features

- **Employee Management** — add, edit, and delete employees with positions and salaries
- **Project Management** — track projects with budgets and capacity requirements
- **Assignment System** — assign employees to projects with capacity and fit parameters
- **Financial Calculations** — real-time revenue, cost, and profit calculations
- **Vacation Calendar** — track employee vacation days with working day calculations
- **Monthly Snapshots** — independent data for each month
- **Seed Data** — copy data between months for planning
- **Sorting & Filtering** — sort and filter all table columns
- **Inline Editing** — edit position and salary directly in the table

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6 modules)
- Vite
- localStorage

## How to Run

1. Clone the repository: 
git clone https://github.com/kaisar970225/outsource-dashboard.git
2. Install dependencies:
npm install
3. Start development server:
npm run dev
4. Open http://localhost:5173 in your browser

## Build for Production
npm run build
## Live Demo

https://kaisar970225.github.io/outsource-dashboard/

## Implementation Notes

- All data is stored in localStorage under the key `monthlyData`
- Each month stores independent snapshots of employees and projects
- Financial calculations follow the formula: `effectiveCapacity = capacity × fit × vacationCoefficient`
- Vacation coefficient = `(workingDays - vacationWorkingDays) / workingDays`
- Minimum cost per employee is `salary × 0.5` (bench cost for unassigned employees)





# на Русском
---

# Outsource Dashboard (RU)

Веб-приложение для управления аутсорс-командами, проектами и финансовым планированием.

## Функции

- **Управление сотрудниками** — добавление, редактирование и удаление сотрудников с должностями и зарплатами
- **Управление проектами** — отслеживание проектов с бюджетами и требованиями к мощности
- **Система назначений** — назначение сотрудников на проекты с параметрами мощности и соответствия
- **Финансовые расчёты** — расчёт выручки, затрат и прибыли в реальном времени
- **Календарь отпусков** — отслеживание дней отпуска с расчётом рабочих дней
- **Ежемесячные снимки** — независимые данные для каждого месяца
- **Копирование данных** — копирование данных между месяцами для планирования
- **Сортировка и фильтрация** — сортировка и фильтрация всех столбцов таблиц
- **Встроенное редактирование** — редактирование должности и зарплаты прямо в таблице

## Технологии

- HTML5
- CSS3
- Vanilla JavaScript (ES6 модули)
- Vite
- localStorage

## Как запустить

1. Клонировать репозиторий:
git clone https://github.com/kaisar970225/outsource-dashboard.git

2. Установить зависимости:
npm install

3. Запустить сервер разработки:
npm run dev

4. Открыть http://localhost:5173 в браузере

## Сборка для продакшена
npm run build

## Демо

https://kaisar970225.github.io/outsource-dashboard/

## Примечания по реализации

- Все данные хранятся в localStorage под ключом `monthlyData`
- Каждый месяц хранит независимые снимки сотрудников и проектов
- Финансовые расчёты по формуле: `эффективнаяМощность = мощность × соответствие × коэффициентОтпуска`
- Коэффициент отпуска = `(рабочиеДни - отпускРабочиеДни) / рабочиеДни`
- Минимальные затраты на сотрудника = `зарплата × 0.5` (bench cost для незанятых сотрудников)