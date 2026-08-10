import Alpine from "alpinejs";
import CTFd from "./index";

window.CTFd = CTFd;
window.Alpine = Alpine;

Alpine.start();

async function fetchScoreboard() {
    const res = await fetch('/api/v1/scoreboard');
    const data = await res.json();
    return data.data;
}

function renderScoreboard(entries) {
    const widget = document.getElementById('scoreboard-widget');

    const rows = entries.map(entry => `
        <li>${entry.pos}. ${entry.name} — ${entry.score} pts</li>
    `).join('');

    widget.innerHTML = `<ul>${rows}</ul>`;
}

async function updateScoreboard(){
    const entries = await fetchScoreboard();
    renderScoreboard(entries);
}

updateScoreboard();
setInterval(updateScoreboard, 10000);
