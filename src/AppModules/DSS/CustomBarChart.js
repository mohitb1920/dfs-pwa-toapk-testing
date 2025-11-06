import React, { useContext, useEffect, useMemo, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import { useTranslation } from "react-i18next";
import FilterContext from "./FilterContext";
import useGetChart from "../../Hooks/useGetChart";
import { capitalize, TENANT_ID } from "../../components/Utils";
import { cardProps, chipLabels, localizationKeys } from "./Utils";
import { Box, CircularProgress } from "@mui/material";
import { SessionStorage } from "../../Utils/LocalStorage";
import RemovableChip from "../../components/RemovableChip";
import { setHighchartsTheme } from "./Highcharts-theme";
import PropTypes from "prop-types";

const getKeyByValue = (map, searchValue) => {
  for (let [key, value] of map.entries()) {
    if (value.toLowerCase() === searchValue.toLowerCase()) return key;
  }
};

function CustomBarChart(props) {
  const {
    data,
    title,
    districtsMap,
    isDarkTheme,
    isMobile,
    type,
    stacking,
    moduleCode,
    seedSubSchemes = new Map(),
  } = props;
  const { t } = useTranslation();
  const { id } = data;
  const { value } = useContext(FilterContext);
  const sessionKey = `${title}_DRILL_FILTERS`;
  const drillFilters = SessionStorage.get(sessionKey);
  const [isBarClicked, setIsBarClicked] = useState(
    drillFilters?.isBarClicked || false
  );
  const [barSelected, setBarSelected] = useState(
    drillFilters?.barSelected || []
  );
  const [drillDownId, setdrillDownId] = useState(
    drillFilters?.drillDownId || []
  );
  const isseedSchemesChart = id === "seedApplicationsPerSubScheme";
  const { isLoading, data: response } = useGetChart({
    key: isBarClicked ? drillDownId[drillDownId.length - 1] : id,
    type: "metric",
    tenantId: TENANT_ID,
    requestDate: {
      ...value?.requestDate,
      startDate: value?.range?.startDate?.getTime(),
      endDate: value?.range?.endDate?.getTime(),
    },
    filters: isBarClicked
      ? {
          ...value?.filters,
          ...(value.cardStatus !== null
            ? { status: value.cardStatus === "0" ? false : true }
            : {}),
          selectedType: isseedSchemesChart
            ? "Seed subsidy scheme"
            : barSelected[0].toString(),
          ...(isseedSchemesChart
            ? { subScheme: barSelected[0].toString() }
            : {}),
          ...(barSelected.length > 1
            ? { selectedSubType: barSelected[1].toString() }
            : {}),
          ...(barSelected.length > 2
            ? { selectedSubSubType: barSelected[2].toString() }
            : {}),
          ...(barSelected.length > 3
            ? { selectedSubSubSubType: barSelected[3].toString() }
            : {}),
        }
      : {
          ...value?.filters,
          ...(value.cardStatus !== null
            ? { status: value.cardStatus === "0" ? false : true }
            : {}),
          ...(isseedSchemesChart
            ? { selectedType: "Seed subsidy scheme" }
            : {}),
        },
    moduleLevel: value?.moduleLevel,
  });

  useEffect(() => {
    if (
      value?.filters?.district &&
      value?.filters?.district?.length > 0 &&
      barSelected.length > 0 &&
      value?.filters?.district.indexOf(barSelected[0].toString()) === -1
    ) {
      setIsBarClicked(false);
      setBarSelected([]);
      setdrillDownId([]);
      SessionStorage.set(sessionKey, {
        isBarClicked: false,
      });
    }
  }, [value]);

  const constructChartData = (data) => {
    const categories = new Set(); // To store unique category names
    const series = [];

    data?.forEach((group) => {
      const { headerName, plots } = group;
      const seriesItem = {
        name: headerName,
        data: [],
      };
      plots.forEach((plot) => {
        const { name, value } = plot;
        categories.add(name);
        seriesItem.data.push({ name, value });
      });

      series.push(seriesItem);
    });

    // Converting Set to Array and sort
    const categoriesArray = Array.from(categories).sort();

    const finalSeries = series.map((seriesItem, index) => {
      const data = categoriesArray.map(
        (category) =>
          seriesItem.data.find((d) => d.name === category)?.value || 0
      );
      return {
        name: t(localizationKeys?.[seriesItem.name] ?? seriesItem.name),
        data,
        color:
          cardProps[localizationKeys?.[seriesItem.name] ?? seriesItem.name]
            .color,
      };
    });

    return { categories: categoriesArray, series: finalSeries };
  };

  const removeFilter = (index) => {
    if (index > 0 && index < barSelected.length) {
      const updatedBars = barSelected.slice(0, index);
      const updatedDrillIds = drillDownId.slice(0, index);
      setBarSelected(updatedBars);
      setdrillDownId(updatedDrillIds);
      SessionStorage.set(sessionKey, {
        isBarClicked: true,
        drillDownId: updatedDrillIds,
        barSelected: updatedBars,
      });
    } else {
      setIsBarClicked(false);
      setBarSelected([]);
      setdrillDownId([]);
      SessionStorage.set(sessionKey, {
        isBarClicked: false,
      });
    }
  };

  const chartData = useMemo(
    () => constructChartData(response?.responseData?.data),
    [response, t]
  );

  function onBarClick() {
    const districtIndex = moduleCode === "schemesApplications" ? 1 : 0;
    const bars = [...barSelected];
    if (barSelected.length === districtIndex) {
      const id = getKeyByValue(districtsMap, this.category);
      bars.push(id);
    } else {
      bars.push(this.category);
    }
    setIsBarClicked(true);
    setdrillDownId([...drillDownId, response?.responseData?.drillDownChartId]);
    setBarSelected(bars);
    SessionStorage.set(sessionKey, {
      isBarClicked: true,
      drillDownId: [...drillDownId, response?.responseData?.drillDownChartId],
      barSelected: bars,
    });
  }

  const getSuffixHoverValue = () => {
    switch (id) {
      case "noOfFarmersLinkedWithDBT":
        return " Farmers";
      case "grievancesCountByStatus":
        return " Ticket";
      default:
        return;
    }
  };

  const getSubSchemeName = (key) => {
    const name = seedSubSchemes.get(key) || key;
    return name;
  };

  setHighchartsTheme(isDarkTheme);

  const options = useMemo(
    () => ({
      chart: {
        type: type,
        backgroundColor: isDarkTheme ? "#222529" : "#fff",
        height: 500,
      },
      title: { text: "" },
      xAxis: {
        categories: chartData?.categories ?? [],
        crosshair: true,
        accessibility: {
          description: "Farmer Registrations",
        },
        min: 0,
        ...(isMobile
          ? {}
          : {
              max: Math.min(
                moduleCode === "schemesApplications" ? 8 : 20,
                chartData?.categories?.length - 1
              ),
              scrollbar: {
                enabled: true,
              },
            }),
        labels: {
          formatter: function () {
            return isseedSchemesChart && barSelected.length === 0
              ? getSubSchemeName(this.value)
              : capitalize(this.value ?? "");
          },
          style: {
            color: isDarkTheme ? "#ffffff" : "#000000", // Axis labels color
            width: "150px", // Set maximum width
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          },
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "",
        },
        labels: {
          style: {
            color: isDarkTheme ? "#ffffff" : "#000000", // Y-axis labels color
          },
        },
      },
      tooltip: {
        valueSuffix: ` ${t(getSuffixHoverValue())}`,
        backgroundColor: isDarkTheme ? "#333333" : "#ffffff", // Tooltip background color
        style: {
          color: isDarkTheme ? "#ffffff" : "#000000", // Tooltip text color
        },
      },
      legend: {
        align: "right",
        verticalAlign: "top",
        itemStyle: {
          color: isDarkTheme ? "#ffffff" : "#000000",
          fontSize: isMobile ? "12px" : "16px",
        },
        itemHoverStyle: {
          color: isDarkTheme ? "#ffffff" : "#000000", // Legend label color
        },
      },
      plotOptions: {
        [type === "column" ? "column" : "series"]: {
          stacking: stacking,
          pointPadding: 0.3,
          borderWidth: 0,
          pointWidth: 10,
          cursor: "pointer",
          point: {
            events: {
              click:
                response?.responseData?.drillDownChartId !== "none"
                  ? onBarClick
                  : null,
            },
          },
        },
      },
      series: chartData?.series ?? [],
    }),
    [chartData, title, t, isDarkTheme]
  );

  const drilldownLabels = [
    ...(moduleCode === "schemesApplications" ? ["Scheme"] : []),
    ...chipLabels,
  ];

  if (isLoading) {
    return (
      <Box className="h-40 flex justify-center items-center">
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <Box>
      {isBarClicked && (
        <Box className="chips-container">
          <span>{t("DSS_FILTERS_APPLIED")}: </span>
          {barSelected.map((bar, index) => (
            <RemovableChip
              key={index}
              text={`${drilldownLabels[index]}: ${
                districtsMap.get(bar) ||
                seedSubSchemes.get(bar) ||
                `${bar.charAt(0).toUpperCase()}${bar.slice(1).toLowerCase()}`
              }`}
              onClick={() => removeFilter(index)}
            />
          ))}
        </Box>
      )}
      {chartData?.series?.length === 0 ||
      !chartData?.series ||
      (chartData?.series?.[0]?.data?.length === 0 &&
        chartData?.series?.[0]?.data?.length === 0) ? (
        <Box className="h-72 flex justify-center items-center">
          {t("DSS_NO_DATA")}
        </Box>
      ) : (
        <Box className="w-full overflow-auto">
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            containerProps={{
              style: {
                ...(type === "bar" ? { minHeight: "400px" } : {}),
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

CustomBarChart.prototypes = {
  data: PropTypes.object,
  title: PropTypes.string,
  districtsMap: PropTypes.any,
  isDarkTheme: PropTypes.bool,
  isMobile: PropTypes.bool,
  type: PropTypes.string,
  stacking: PropTypes.any,
  moduleCode: PropTypes.string,
  seedSubSchemes: PropTypes.any,
};

export default CustomBarChart;
