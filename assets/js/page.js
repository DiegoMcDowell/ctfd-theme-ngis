import Alpine from "alpinejs";
import CTFd from "./index";

window.CTFd = CTFd;
window.Alpine = Alpine;

Alpine.start();

async function fetchScoreboard() {
  const res = await fetch("/api/v1/scoreboard");
  const data = await res.json();
  return data.data;
}

function renderScoreboard(entries) {
  const widget = document.getElementById("scoreboard-widget");

  const rows = entries
    .map(
      entry => `
        <li>${entry.pos}. ${entry.name} — ${entry.score} pts</li>
    `,
    )
    .join("");

  widget.innerHTML = `<ul>${rows}</ul>`;
}

async function updateScoreboard() {
  const entries = await fetchScoreboard();
  renderScoreboard(entries);
}

document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("ctf-countdown");
  if (!el) return;

  const endTime = parseInt(el.dataset.endTime, 10) * 1000; // ms

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const remaining = Math.floor((endTime - Date.now()) / 1000);

    if (remaining <= 0) {
      document.getElementById("cd-hours").textContent = "00";
      document.getElementById("cd-minutes").textContent = "00";
      document.getElementById("cd-seconds").textContent = "00";
      return;
    }
    const h = Math.floor(remaining / 3600);
    const m = Math.floor((remaining % 3600) / 60);
    const s = remaining % 60;

    document.getElementById("cd-hours").textContent = pad(h);
    document.getElementById("cd-minutes").textContent = pad(m);
    document.getElementById("cd-seconds").textContent = pad(s);
  }

  tick();
  setInterval(tick, 1000);
});

updateScoreboard();
setInterval(updateScoreboard, 10000);
