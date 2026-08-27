import Alpine from "alpinejs";
import * as echarts from "echarts/core";
import CTFd from "./index";
import { getOption } from "./utils/graphs/echarts/scoreboard";
import { embed } from "./utils/graphs/echarts";

window.Alpine = Alpine;
window.CTFd = CTFd;

// Default scoreboard polling interval to every 5 minutes
const scoreboardUpdateInterval = window.scoreboardUpdateInterval || 300000;

Alpine.data("ScoreboardDetail", () => ({
  data: {},
  show: true,
  activeBracket: null,
  range: null, // hours to display, null means show everything

  render() {
    let optionMerge = window.scoreboardChartOptions;
    let option = getOption(CTFd.config.userMode, this.data, optionMerge);

    if (this.range) {
      let maxTime = null;
      for (const team of Object.values(this.data)) {
        for (const solve of team.solves) {
          const time = new Date(solve.date).getTime();
          if (maxTime === null || time > maxTime) {
            maxTime = time;
          }
        }
      }

      if (maxTime !== null) {
        option.xAxis[0].min = maxTime - this.range * 60 * 60 * 1000;
        option.xAxis[0].max = maxTime;
      }
    }

    embed(this.$refs.scoregraph, option);
  },

  setRange(hours) {
    this.range = hours;
    this.render();
  },

  downloadImage() {
    const chart = echarts.getInstanceByDom(this.$refs.scoregraph);
    if (!chart) return;

    const link = document.createElement("a");
    link.href = chart.getDataURL({ pixelRatio: 2, backgroundColor: "#0c0d0e" });
    link.download = "scoreboard.png";
    link.click();
  },

  toggleFullscreen() {
    const panel = this.$refs.scoregraphpanel;
    if (!document.fullscreenElement) {
      panel.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  },

  async update() {
    this.data = await CTFd.pages.scoreboard.getScoreboardDetail(10, this.activeBracket);
    this.render();
    this.show = Object.keys(this.data).length > 0;
  },

  async init() {
    this.update();

    document.addEventListener("fullscreenchange", () => {
      echarts.getInstanceByDom(this.$refs.scoregraph)?.resize();
    });

    setInterval(() => {
      this.update();
    }, scoreboardUpdateInterval);
  },
}));

Alpine.data("ScoreboardList", () => ({
  standings: [],
  brackets: [],
  activeBracket: null,

  async update() {
    this.brackets = await CTFd.pages.scoreboard.getBrackets(CTFd.config.userMode);
    this.standings = await CTFd.pages.scoreboard.getScoreboard();
  },

  async init() {
    this.$watch("activeBracket", value => {
      this.$dispatch("bracket-change", value);
    });

    this.update();

    setInterval(() => {
      this.update();
    }, scoreboardUpdateInterval);
  },
}));

Alpine.start();
