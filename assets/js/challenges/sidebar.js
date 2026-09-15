// Estado del sidebar (Tu equipo / Ranking general / Tiempo restante).
// Se mezcla dentro del componente Alpine `ChallengeBoard`.
import CTFd from "../index";

const TOP_N = 5;

function pad(n) {
  return String(n).padStart(2, "0");
}

export function formatCountdown(endUnixSeconds, now = Date.now()) {
  if (!endUnixSeconds) return "--:--:--";
  const remaining = Math.max(0, Math.floor(endUnixSeconds - now / 1000));
  const h = Math.floor(remaining / 3600);
  const m = Math.floor((remaining % 3600) / 60);
  const s = remaining % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

async function fetchJson(url) {
  try {
    const response = await CTFd.fetch(url, { method: "GET" });
    if (!response.ok) return null;
    const body = await response.json();
    return body.success ? body.data : null;
  } catch (error) {
    console.log(`Error fetching ${url}`);
    console.log(error);
    return null;
  }
}

export default function sidebar() {
  const init = window.init || {};
  const isTeams = init.userMode === "teams";

  return {
    account: null,
    accountId: isTeams ? init.teamId : init.userId,
    ranking: [],
    countdown: "--:--:--",
    _countdownTimer: null,

    async loadSidebar() {
      const [account, ranking] = await Promise.all([
        fetchJson(isTeams ? "/api/v1/teams/me" : "/api/v1/users/me"),
        fetchJson("/api/v1/scoreboard"),
      ]);
      this.account = account;
      this.ranking = Array.isArray(ranking) ? ranking.slice(0, TOP_N) : [];
    },

    startCountdown() {
      const end = init.end;
      const tick = () => {
        this.countdown = formatCountdown(end);
      };
      tick();
      this._countdownTimer = setInterval(tick, 1000);
    },

    accountScore() {
      return this.account ? this.account.score : "—";
    },

    accountPlace() {
      if (!this.account || !this.account.place) return "—";
      return `#${this.account.place}`;
    },

    isMe(entry) {
      return entry.account_id === this.accountId;
    },
  };
}
