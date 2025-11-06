import React, { useContext, useEffect, useMemo, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useTranslation } from "react-i18next";
import FilterContext from "./FilterContext";
import useGetChart from "../../Hooks/useGetChart";
import { capitalize, TENANT_ID } from "../../components/Utils";
import { localizationKeys } from "./Utils";
import { Box, CircularProgress, Rating, Typography } from "@mui/material";
import { SessionStorage } from "../../Utils/LocalStorage";
import RemovableChip from "../../components/RemovableChip";
import { setHighchartsTheme } from "./Highcharts-theme";

const barColors = ["#1A5C4B", "#85BC31"];
const sessionKey = "FARMER_DRILL_FILTERS";

const getKeyByValue = (map, searchValue) => {
  for (let [key, value] of map.entries()) {
    if (value.toLowerCase() === searchValue.toLowerCase()) return key;
  }
};
function RattingBox({ averageRating, totalUser, t }) {
  return (
    <Box className="flex flex-col items-center">
      <Typography className="!text-[7rem] !font-bold">
        {averageRating}
      </Typography>
      <Rating
        name="half-rating-read"
        defaultValue={averageRating}
        precision={0.1}
        readOnly
        className=""
        sx={{
          "& .MuiRating-iconEmpty": {
            stroke: "#FFD700",
          },
        }}
      />
      <Typography variant="h6">
        {totalUser} {t("Reviews")}
      </Typography>
    </Box>
  );
}
function RatingComponent(props) {
  const { data, title, districtsMap, isDarkTheme, isMobile } = props;
  const { t } = useTranslation();
  const { id } = data;
  const { value } = useContext(FilterContext);
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
          selectedType: barSelected[0].toString(),
          ...(barSelected.length > 1
            ? { selectedSubType: barSelected[1].toString() }
            : {}),
          ...(barSelected.length > 2
            ? { selectedSubSubType: barSelected[2].toString() }
            : {}),
        }
      : value?.filters,
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
    const categories = ["5", "4", "3", "2", "1"];
    const series = [];
    data?.forEach((group) => {
      const { headerName, headerValue, plots } = group;
      const seriesItem = {
        name: headerName,
        value: parseFloat(headerValue),
      };
      series.push(seriesItem);
      //   categories.add(headerName);
    });
    // const categoriesArray = Array.from(categories);
    var averageRating = 0;
    var totalUser = 0;
    const ratingArray = categories.map((category) => {
      const item = series.find((item) => item.name.includes(`${category}`));
      return item ? item.value : 0;
    });
    series.map((item, index) => {
      averageRating += item.value * (5 - index);
      totalUser += item.value;
    });
    averageRating = averageRating / (totalUser === 0 ? 1 : totalUser);
    averageRating = Math.trunc(averageRating * 10) / 10;
    const finalSeries = [{ data: ratingArray, color: barColors[0] }];

    return {
      categories: categories,
      series: finalSeries,
      averageRating,
      totalUser,
    };
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
    const bars = [...barSelected];
    if (barSelected.length === 0) {
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

  setHighchartsTheme(isDarkTheme, isMobile);

  const options = useMemo(
    () => ({
      chart: {
        type: "bar",
        backgroundColor: isDarkTheme ? "#1a1d21" : "#fff",
      },
      title: { text: "" },
      xAxis: {
        min: 0,
        categories: chartData?.categories ?? [],
        crosshair: true,
        accessibility: {
          description: "Customer Reviews",
        },
        title: {
          text: null,
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: "",
        },
      },
      tooltip: {
        formatter: function () {
          const percentage = (
            (this.y / (chartData.totalUser === 0 ? 1 : chartData.totalUser)) *
            100
          ).toFixed(1);
          return `
              <b>${this.x} ${t(this.x > 1 ? "Stars" : "Star")}</b><br/>
                ${t("Reviews")}: ${this.y}<br/>
              ${t("Percentage")}: ${percentage}%`;
        },

        backgroundColor: isDarkTheme ? "#333333" : "#ffffff",
        style: {
          color: isDarkTheme ? "#ffffff" : "#000000",
        },
      },
      legend: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          borderRadius: 50,
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: chartData?.series ?? [],
    }),
    [chartData, title, t, isDarkTheme]
  );

  const chartWidth = Math.max(200, (chartData?.categories?.length ?? 0) * 50);

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
              text={`${
                index === 0
                  ? "District: "
                  : index === 1
                  ? "Block: "
                  : "Panchayat: "
              }
                    ${
                      districtsMap.get(bar) ||
                      `${bar.charAt(0).toUpperCase()}${bar
                        .slice(1)
                        .toLowerCase()}`
                    }`}
              onClick={() => removeFilter(index)}
            />
          ))}
        </Box>
      )}
      {chartData?.series?.length === 0 || chartData.averageRating == 0 ? (
        <Box className="h-52 flex justify-center items-center">
          {t("DSS_NO_DATA")}
        </Box>
      ) : (
        <Box className="flex items-center justify-between gap-[40px] flex-col md:flex-row">
          <RattingBox
            averageRating={chartData.averageRating}
            totalUser={chartData.totalUser}
            t={t}
          ></RattingBox>
          <Box className="w-full overflow-auto">
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
              containerProps={{ style: { minWidth: `${chartWidth}px` } }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default RatingComponent;
