import React, { useContext, useMemo } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useTranslation } from "react-i18next";
import FilterContext from "./FilterContext";
import useGetChart from "../../Hooks/useGetChart";
import { TENANT_ID } from "../../components/Utils";
import { Box, CircularProgress } from "@mui/material";

function CustomPieChart(props) {
  const { data, isDarkTheme, isMobile, moduleCode } = props;
  const { t } = useTranslation();
  const { id } = data;
  const { value } = useContext(FilterContext);
  const { isLoading, data: response } = useGetChart({
    key: id,
    type: "metric",
    tenantId: TENANT_ID,
    requestDate: {
      ...value?.requestDate,
      startDate: value?.range?.startDate?.getTime(),
      endDate: value?.range?.endDate?.getTime(),
    },
    filters: {
      ...value?.filters,
      ...(value.cardStatus !== null
        ? { status: value.cardStatus === "0" ? false : true }
        : {}),
    },
    moduleLevel: value?.moduleLevel,
  });

  const chartData = useMemo(() => {
    if (!response) return null;
    return response?.responseData?.data?.[0]?.plots.reduce((acc, plot) => {
      const suffix =
        id === "numberOfSchemesPerCategory"
          ? plot.name.replace(/Directorate of/g, "").trim()
          : plot.name;
      const dataPoint = {
        name: t(`COMMON_MASTERS_DBT_${suffix}`),
        y: plot.value,
        color: ["Directorate of Agriculture", "1"].includes(plot.name)
          ? "#1A5C4B"
          : "#85BC31",
      };
      acc = acc.concat(dataPoint);
      const sortedData = Array.isArray(acc)
        ? acc.sort((a, b) => (b.name === "COMMON_MASTERS_DBT_1" ? 1 : -1))
        : [];
      return sortedData;
    }, []);
  }, [response, t]);

  const totalCount = chartData?.reduce((sum, point) => sum + point.y, 0);

  const options = useMemo(
    () => ({
      chart: {
        type: "pie",
        backgroundColor: isDarkTheme ? "#222529" : "#fff",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      title: {
        text: " ",
      },
      subtitle: {
        text: `<span style="font-size: ${isMobile ? "16px" : "20px"}; color: ${
          isDarkTheme ? "#fff" : "#1C211E"
        };">${t(
          moduleCode === "schemesApplications"
            ? "DSS_TOTAL_APPLICATIONS"
            : "DSS_TOTAL_FARMERS"
        )}: <b>${totalCount}</b></span>`,
        align: "right",
        useHTML: true,
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.0f}%</b>",
        backgroundColor: isDarkTheme ? "#333333" : "#ffffff", // Tooltip background color
        style: {
          color: isDarkTheme ? "#ffffff" : "#000000", // Tooltip text color
        },
      },
      legend: {
        align: "left",
        verticalAlign: "bottom",
        labelFormatter: function () {
          return this.name + ": <strong>" + this.y + "</strong>";
        },
        itemStyle: {
          color: isDarkTheme ? "#ffffff" : "#000000", // Legend label color
          fontSize: isMobile ? "12px" : "16px",
        },
        itemHoverStyle: {
          color: isDarkTheme ? "#ffffff" : "#000000", // Legend label color
        },
      },
      plotOptions: {
        series: {
          allowPointSelect: true,
          cursor: "pointer",
          borderRadius: 8,
          dataLabels: [
            {
              enabled: true,
              distance: 20,
              format: "{point.name}",
              style: {
                fontSize: isMobile ? "0.8em" : "1em",
              },
            },
            {
              enabled: true,
              distance: -15,
              format: "{point.percentage:.0f}%",
              style: {
                fontSize: "0.9em",
              },
            },
          ],
          showInLegend: true,
        },
      },
      series: [
        {
          name: t(
            moduleCode === "schemesApplications" ? "APPLICATIONS" : "Farmers"
          ),
          colorByPoint: true,
          innerSize: "75%",
          data: chartData ?? [],
        },
      ],
    }),
    [chartData, moduleCode, isDarkTheme, isMobile]
  );

  if (isLoading) {
    return (
      <Box className="h-40 flex justify-center items-center">
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <div>
      {chartData?.length === 0 || !chartData ? (
        <Box className="h-52 flex justify-center items-center">
          {t("DSS_NO_DATA")}
        </Box>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </div>
  );
}

export default CustomPieChart;
