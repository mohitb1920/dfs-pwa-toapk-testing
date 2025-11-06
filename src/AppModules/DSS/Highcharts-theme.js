import Highcharts from "highcharts";

export const setHighchartsTheme = (isDarkTheme) => {
  Highcharts.setOptions({
    title: {
      style: {
        color: isDarkTheme ? "#ffffff" : "#000000", // Title color based on theme
      },
    },
    tooltip: {
      backgroundColor: isDarkTheme ? "#333333" : "#ffffff", // Tooltip background color
      style: {
        color: isDarkTheme ? "#ffffff" : "#000000", // Tooltip text color
      },
    },
    xAxis: {
      labels: {
        style: {
          color: isDarkTheme ? "#ffffff" : "#000000", // Axis labels color
        },
      },
    },
    yAxis: {
      title: {
        style: {
          color: isDarkTheme ? "#ffffff" : "#000000", // Y-axis title color
        },
      },
      labels: {
        style: {
          color: isDarkTheme ? "#ffffff" : "#000000", // Y-axis labels color
        },
      },
    },
    legend: {
      itemStyle: {
        color: isDarkTheme ? "#ffffff" : "#000000", // Legend label color
      },
      itemHoverStyle: {
        color: isDarkTheme ? "#ffffff" : "#000000", // Legend label color
      },
    },
    plotOptions: {
      series: {
        dataLabels: {
          style: {
            color: isDarkTheme ? "#ffffff" : "#000000", // Data labels color
          },
        },
      },
    },
  });
};
