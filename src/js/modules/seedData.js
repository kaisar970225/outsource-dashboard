import {
    getMonthlyData,
    getCurrentYear,
    getCurrentMonth,
    saveCurrentMonth,
} from "../state/appState.js";
import { seedData } from "../services/storageService.js";
import { renderProjectsTable, renderEmployeesTable } from "./tables.js";
import { formatCurrency } from "../utils/format.js";

// Показывает модальное окно Seed Data
export function showSeedDataModal(year, month) {
    var monthlyData = getMonthlyData();
    var currentKey = year + "-" + month;

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

    // Собираем все месяцы с данными кроме текущего
    var availableMonths = [];
    var keys = Object.keys(monthlyData);
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] !== currentKey) {
            var parts = keys[i].split("-");
            var y = parseInt(parts[0]);
            var m = parseInt(parts[1]);
            var data = monthlyData[keys[i]];
            availableMonths.push({
                key: keys[i],
                year: y,
                month: m,
                label: monthNames[m] + " " + y,
                projectCount: data.projects.length,
                employeeCount: data.employees.length,
            });
        }
    }

    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.id = "seedDataModal";

    var rowsHtml = "";
    if (availableMonths.length === 0) {
        rowsHtml =
            '<p style="color:#999;text-align:center;padding:20px;">No other months with data available</p>';
    } else {
        for (var j = 0; j < availableMonths.length; j++) {
            var item = availableMonths[j];
            rowsHtml +=
                '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px;border:1px solid #eee;border-radius:6px;margin-bottom:8px;">' +
                "<div>" +
                "<strong>" +
                item.label +
                "</strong><br>" +
                "<small>" +
                item.projectCount +
                " projects, " +
                item.employeeCount +
                " employees</small>" +
                "</div>" +
                '<button class="table-btn primary seed-month-btn" data-key="' +
                item.key +
                '" data-label="' +
                item.label +
                '">Seed</button>' +
                "</div>";
        }
    }

    overlay.innerHTML =
        '<div class="modal">' +
        '<button class="modal-close" id="closeSeedModal">×</button>' +
        "<h3>Seed Data</h3>" +
        '<p style="color:#666;margin-bottom:16px;">Copy data from another month to ' +
        monthNames[month] +
        " " +
        year +
        ". Vacation days will be reset.</p>" +
        rowsHtml +
        "</div>";

    document.body.appendChild(overlay);

    // Кнопки Seed
    var seedBtns = overlay.querySelectorAll(".seed-month-btn");
    for (var k = 0; k < seedBtns.length; k++) {
        seedBtns[k].addEventListener("click", function () {
            var key = this.getAttribute("data-key");
            var label = this.getAttribute("data-label");
            var parts = key.split("-");
            var fromYear = parseInt(parts[0]);
            var fromMonth = parseInt(parts[1]);

            if (
                confirm(
                    "Copy data from " +
                        label +
                        " to " +
                        monthNames[month] +
                        " " +
                        year +
                        "? Vacation days will be reset.",
                )
            ) {
                var allData = getMonthlyData();
                seedData(allData, fromYear, fromMonth, year, month);
                renderProjectsTable(year, month);
                renderEmployeesTable(year, month);
                overlay.remove();
            }
        });
    }

    document
        .getElementById("closeSeedModal")
        .addEventListener("click", function () {
            overlay.remove();
        });

    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) overlay.remove();
    });
}
