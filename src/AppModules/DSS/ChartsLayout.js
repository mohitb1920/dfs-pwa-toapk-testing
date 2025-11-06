import { Box } from "@mui/material";
import React, { useCallback, useContext } from "react";
import Summary from "./Summary";
import CustomBarChart from "./CustomBarChart";
import CustomPieChart from "./CustomPieChart";
import FilterContext from "./FilterContext";
import GenericChartHead from "./GenericChartHead";
import RatingComponent from "./RatingComponent";
import PropTypes from "prop-types";

function ChartsLayout(props) {
  const { rowData, moduleCode, districtsMap, isDarkTheme, isMobile, initData } =
    props;
  const { value } = useContext(FilterContext);
  let seedSubSchemes = new Map();
  if (
    Array.isArray(initData?.seedSubSchemes) &&
    initData.seedSubSchemes.length > 0
  ) {
    seedSubSchemes = new Map(
      initData.seedSubSchemes.map((scheme) => [
        `code-${scheme.Code}`,
        scheme.SubScheme,
      ])
    );
  }

  const renderChart = (chart, title) => {
    switch (chart.chartType) {
      case "stackedBar":
        return (
          <CustomBarChart
            data={chart}
            title={title}
            districtsMap={districtsMap}
            isDarkTheme={isDarkTheme}
            isMobile={isMobile}
            type={"column"}
            stacking={null}
            moduleCode={moduleCode}
          />
        );
      case "donut":
        return (
          <CustomPieChart
            data={chart}
            title={title}
            isDarkTheme={isDarkTheme}
            isMobile={isMobile}
            moduleCode={moduleCode}
          />
        );
      case "stackedColumn":
        return (
          <CustomBarChart
            data={chart}
            title={title}
            districtsMap={districtsMap}
            isDarkTheme={isDarkTheme}
            type={"column"}
            stacking={"normal"}
            moduleCode={moduleCode}
            isMobile={isMobile}
          />
        );
      case "horizontalBar":
        return (
          <CustomBarChart
            data={chart}
            title={title}
            districtsMap={districtsMap}
            isDarkTheme={isDarkTheme}
            type={"bar"}
            stacking={"normal"}
            moduleCode={moduleCode}
            isMobile={isMobile}
            seedSubSchemes={seedSubSchemes}
          />
        );
      default:
        return null;
    }
  };

  const renderVisualizer = useCallback(
    (visualizer, key) => {
      switch (visualizer.vizType) {
        case "summary":
          return (
            <Summary
              data={visualizer}
              moduleCode={moduleCode}
              isMobile={isMobile}
            />
          );
        case "rating":
          return (
            <GenericChartHead
              key={key}
              amountValue={value}
              header={visualizer.name}
              moduleCode={moduleCode}
              districtsMap={districtsMap}
              isMobile={isMobile}
            >
              <RatingComponent
                data={visualizer?.charts?.[0]}
                title={visualizer.name}
                districtsMap={districtsMap}
                isDarkTheme={isDarkTheme}
                type={"bar"}
                stacking={null}
              />
            </GenericChartHead>
          );
        case "chart":
          return (
            <GenericChartHead
              key={key}
              amountValue={value}
              header={visualizer.name}
              moduleCode={moduleCode}
              districtsMap={districtsMap}
              isMobile={isMobile}
              seedSubSchemes={seedSubSchemes}
            >
              {renderChart(visualizer?.charts?.[0], visualizer.name)}
            </GenericChartHead>
          );

        default:
          return null;
      }
    },
    [isDarkTheme, moduleCode]
  );

  return (
    <Box key={rowData?.name}>
      <Box style={{ position: "relative" }}>
        {rowData.vizArray.map(
          useCallback(
            (chart, key) => {
              return renderVisualizer(chart, key);
            },
            [renderVisualizer]
          )
        )}
      </Box>
    </Box>
  );
}

ChartsLayout.prototypes = {
  rowData: PropTypes.object,
  moduleCode: PropTypes.string,
  districtsMap: PropTypes.instanceOf(Map),
  isDarkTheme: PropTypes.bool,
  isMobile: PropTypes.bool,
  initData: PropTypes.object,
};

export default ChartsLayout;
