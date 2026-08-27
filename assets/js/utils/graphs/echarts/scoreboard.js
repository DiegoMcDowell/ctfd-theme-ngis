import { colorHash } from "@ctfdio/ctfd-js/ui";
import { mergeObjects } from "../../objects";
import { cumulativeSum } from "../../math";
import dayjs from "dayjs";

const AXIS_LINE_COLOR = "rgba(255, 255, 255, 0.15)";
const AXIS_LABEL_COLOR = "rgba(255, 255, 255, 0.5)";
const SPLIT_LINE_COLOR = "rgba(255, 255, 255, 0.08)";

export function getOption(mode, places, optionMerge) {
  let option = {
    backgroundColor: "transparent",
    title: {
      show: false,
      text: "Top 10 " + (mode === "teams" ? "Teams" : "Users"),
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          color: "#fff",
        },
      },
      backgroundColor: "#0c0d0e",
      borderColor: "rgba(229, 9, 20, 0.5)",
      textStyle: {
        color: "#fff",
      },
    },
    legend: {
      type: "scroll",
      orient: "horizontal",
      align: "left",
      bottom: 0,
      icon: "circle",
      itemWidth: 10,
      itemHeight: 10,
      pageIconColor: "#fff",
      pageTextStyle: {
        color: AXIS_LABEL_COLOR,
      },
      data: [],
    },
    toolbox: {
      show: false,
    },
    grid: {
      top: 20,
      bottom: 55,
      containLabel: true,
    },
    xAxis: [
      {
        type: "time",
        boundaryGap: false,
        data: [],
        axisLine: {
          lineStyle: {
            color: AXIS_LINE_COLOR,
          },
        },
        axisLabel: {
          color: AXIS_LABEL_COLOR,
        },
        splitLine: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLine: {
          show: false,
        },
        axisLabel: {
          color: AXIS_LABEL_COLOR,
        },
        splitLine: {
          lineStyle: {
            color: SPLIT_LINE_COLOR,
            type: "dashed",
          },
        },
      },
    ],
    series: [],
  };

  const teams = Object.keys(places);
  for (let i = 0; i < teams.length; i++) {
    const team_score = [];
    const times = [];
    for (let j = 0; j < places[teams[i]]["solves"].length; j++) {
      team_score.push(places[teams[i]]["solves"][j].value);
      const date = dayjs(places[teams[i]]["solves"][j].date);
      times.push(date.toDate());
    }

    const total_scores = cumulativeSum(team_score);
    let scores = times.map(function (e, i) {
      return [e, total_scores[i]];
    });

    const color = colorHash(places[teams[i]]["name"] + places[teams[i]]["id"]);

    option.legend.data.push({
      name: places[teams[i]]["name"],
      itemStyle: {
        color: color,
      },
      textStyle: {
        color: color,
      },
    });

    const data = {
      name: places[teams[i]]["name"],
      type: "line",
      smooth: true,
      symbolSize: 6,
      showSymbol: true,
      lineStyle: {
        width: 2,
        color: color,
        shadowBlur: 8,
        shadowColor: color,
      },
      itemStyle: {
        color: color,
      },
      data: scores,
    };
    option.series.push(data);
  }

  if (optionMerge) {
    option = mergeObjects(option, optionMerge);
  }
  return option;
}
