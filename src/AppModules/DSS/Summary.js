import React, { useContext, useMemo } from "react";
import { TENANT_ID } from "../../components/Utils";
import { useTranslation } from "react-i18next";
import FilterContext from "./FilterContext";
import useGetChart from "../../Hooks/useGetChart";
import { Box, CircularProgress } from "@mui/material";
import SummaryCountCard from "../../components/SummaryCountCard";
import { cardProps, localizationKeys } from "./Utils";

const Chart = ({ data, moduleCode, isMobile }) => {
  const { id } = data;
  const tenantId = TENANT_ID;
  const { t } = useTranslation();
  const { value, setValue } = useContext(FilterContext);
  const { isLoading, data: response } = useGetChart({
    key: id,
    type: "metric",
    tenantId,
    requestDate: {
      ...value?.requestDate,
      startDate: value?.range?.startDate?.getTime(),
      endDate: value?.range?.endDate?.getTime(),
    },
    filters: value?.filters,
  });
  const isClickable = useMemo(
    () => moduleCode === "farmersRegistrations",
    [moduleCode]
  );

  const handleStatusCardClick = (statusKey) => {
    const status = statusKey.match(/_(\d+)$/)?.[1];
    let newStatus = "";
    if (value?.cardStatus && value?.cardStatus === status) {
      newStatus = null;
    } else {
      newStatus = status;
    }
    setValue({ ...value, cardStatus: newStatus });
  };

  const constructChartData = (responseData) => {
    var result = {};
    if (id === "noOfFarmersLinkedWithDBT") {
      result = {
        COMMON_MASTERS_DBT_1: 0,
        COMMON_MASTERS_DBT_0: 0,
      };
      const data = responseData?.[0];
      if (data?.plots?.length > 0) {
        data.plots.forEach((plot) => {
          if (plot.name === "0") {
            result["COMMON_MASTERS_DBT_0"] = plot.value;
          } else if (plot.name === "1") {
            result["COMMON_MASTERS_DBT_1"] = plot.value;
          }
        });
      }
    } else if (id === "grievancesCountByStatus") {
      const data = responseData?.[0];
      result = {
        DSS_GRM_TOTAL: 0,
        DSS_GRM_PENDING: 0,
        DSS_GRM_RESOLVED: 0,
        DSS_GRM_VERIFICATION_PENDING: 0,
        DSS_GRM_VERIFIED: 0,
      };
      if (data?.plots?.length > 0) {
        result["DSS_GRM_TOTAL"] = data?.headerValue;
        data.plots.forEach((plot) => {
          if (
            plot?.name?.toLowerCase()?.startsWith("PENDINGATL".toLowerCase())
          ) {
            result["DSS_GRM_PENDING"] = plot.value + result["DSS_GRM_PENDING"];
          } else if (
            plot?.name?.toLowerCase()?.includes("RESOL".toLowerCase())
          ) {
            result["DSS_GRM_RESOLVED"] =
              plot.value + result["DSS_GRM_RESOLVED"];
          } else if (plot?.name === "PENDINGATSAO") {
            result["DSS_GRM_VERIFICATION_PENDING"] =
              plot.value + result["DSS_GRM_VERIFICATION_PENDING"];
          } else if (plot?.name === "CLOSEDAFTERVERIFICATION") {
            result["DSS_GRM_VERIFIED"] =
              plot.value + result["DSS_GRM_VERIFIED"];
          }
        });
      }
    } else {
      responseData?.forEach((status) => {
        const localizationKey =
          localizationKeys?.[status.headerName] ?? status.headerName;
        result[localizationKey] = status.headerValue;
      });
    }
    return result;
  };

  const chartData = useMemo(
    () => constructChartData(response?.responseData?.data),
    [response]
  );

  if (isLoading) {
    return (
      <Box className="h-96 flex justify-center items-center">
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <Box className="summary-cards-container">
      {Object.entries(chartData).map(([key, count], index) => {
        return (
          <SummaryCountCard
            label={key}
            value={count}
            t={t}
            cardProps={
              cardProps?.[key] ?? {
                color: "rgba(106, 124, 111, 1)",
                icon: `Pending.svg`,
              }
            }
            isClickable={isClickable}
            selected={
              value.cardStatus !== null && key.includes(value.cardStatus)
            }
            handleClick={isClickable ? handleStatusCardClick : () => {}}
            isMobile={isMobile}
          />
        );
      })}
    </Box>
  );
};

function Summary({ data, moduleCode, isMobile }) {
  return (
    <div>
      {data.charts.map((chart, key) => (
        <Chart
          data={chart}
          key={key}
          moduleCode={moduleCode}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}

export default Summary;
