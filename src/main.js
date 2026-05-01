import "./style.css";
import { initState } from "./js/state/appState.js";

// запуск прилож после загрузки страницф
document.addEventListener("DOMContentLoaded", function () {
    console.log("App started!");
    initState();
});
