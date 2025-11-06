import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import useAgentHistory from "../../Hooks/useAgentHistory";
import { ConvertTimestampToDateTime } from "../../components/Utils";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import CustomDatePicker from "../../components/CustomDatePicker";
import CustomButton from "../../components/Button/CustomButton";
import { ButtonColor } from "../../components/Button/ButtonEnums";
import CustomTable from "../../components/CustomTable";

const infoCards = {
  farmerRegistration: "AGENT_FARMER_REGISTRATIONS",
  schemesApplied: "AGENT_SCHEMES_APPLIED",
  grmRequests: "AGENT_GRM_REQUESTS",
};

const columns = [
  {
    id: "auditDetails",
    label: "DATE_TIME",
    align: "left",
    sort: false,
    width: "150px",
  },
  {
    id: "categoryType",
    label: "TYPE_OF_REQUEST",
    align: "left",
    sort: false,
  },
  {
    id: "categoryId",
    label: "HISTORY_TICKET_NUMBER",
    align: "left",
    sort: false,
  },
  {
    id: "farmerName",
    label: "BENIFICIARY_NAME",
    align: "left",
    sort: false,
    maxWidth: "300px",
  },
  {
    id: "farmerId",
    label: "BENIFICIARY_ID",
    align: "left",
    sort: false,
  },
];

const generateCardData = (data) => {
  const cardData = {
    farmerRegistration: 0,
    schemesApplied: 0,
    grmRequests: 0,
  };

  if (!Array.isArray(data)) {
    return cardData;
  }

  data.forEach((item) => {
    switch (item.categoryType) {
      case "PROFILE_CREATE":
      case "DBT_PROFILE_CREATE":
      case "PROFILE_UPDATE":
        cardData.farmerRegistration += item.categoryCount;
        break;
      case "SCHEME_APPLY":
        cardData.schemesApplied += item.categoryCount;
        break;
      case "GRM_APPLY":
        cardData.grmRequests += item.categoryCount;
        break;
      default:
        break;
    }
  });

  return cardData;
};

function AgentHistory({ isMobile }) {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedCard, setSelectedCard] = useState(null);
  const [count, setCount] = useState({
    farmerRegistration: 0,
    schemesApplied: 0,
    grmRequests: 0,
  });
  const [dateRangeFilter, setDateRangeFilter] = useState({
    toDate: null,
    fromDate: null,
  });
  const [dateError, setDateError] = useState(false);
  const [dateSearch, setDateSearch] = useState({});

  const theme = useTheme();

  const { isLoading, data, isError, refetch } = useAgentHistory(
    {
      ...(dateSearch?.fromDate && { fromDate: dateSearch.fromDate }),
      ...(dateSearch?.toDate && { toDate: dateSearch.toDate }),
      pageSize: rowsPerPage,
      pageNo: page,
    },
    selectedCard
  );

  const handleCardClick = (card) => {
    if (card === selectedCard) {
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
      setPage(0);
    }
  };

  const handleSearch = () => {
    let params = {};
    const { fromDate, toDate } = dateRangeFilter;

    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      setDateError(true);
    } else if (fromDate && toDate) {
      const date1 = new Date(fromDate);
      const date2 = new Date(toDate);
      const fromEpochTime = date1.getTime();
      const toEpochTime = date2.setHours(23, 59, 59, 999);
      params = {
        fromDate: fromEpochTime,
        toDate: toEpochTime,
      };
      setSelectedCard(null);
      setDateSearch(params);
      setDateError(false);
    } else {
      setDateError(false);
    }
  };

  const handleReset = () => {
    setSelectedCard(null);
    setDateError(false);
    setDateSearch({});
    setDateRangeFilter({ fromDate: null, toDate: null });
  };

  const cardData = useMemo(
    () => generateCardData(data?.categoryCountList),
    [data]
  );

  const totalCount = Object.values(cardData).reduce(
    (sum, value) => sum + value,
    0
  );

  const cellValueRenderer = ({ value, column }) => {
    if (column.id === "auditDetails") {
      return ConvertTimestampToDateTime(value.createdTime);
    }
    if (column.id === "categoryType") return t(value);
    if (column.id === "categoryId") {
      return value?.includes("IND") ? " - " : value;
    }
    return value;
  };

  useEffect(() => {
    if (selectedCard === null) {
      setCount(cardData);
    }
  }, [cardData, selectedCard]);

  useEffect(() => {
    refetch();
  }, []);

  if (isError) {
    return (
      <Box className="flex items-center justify-center h-96">
        Error Fetching History. Please try again later.
      </Box>
    );
  }

  return (
    <Box
      className="w-11/12 m-auto mt-5"
      sx={{ maxWidth: "1200px", marginBottom: "80px" }}
    >
      <Box className="breadcrumbs-container my-5">
        <BasicBreadcrumbs />
      </Box>
      <Box className="history-page-details-container">
        <Box className="mb-5 md:flex justify-between">
          <Typography
            variant={isMobile ? "h5" : "h3"}
            className="agent-grm-card-header"
          >
            {t("COMMON_HISTORY")}
          </Typography>
          <Box className="sm:flex gap-2 mt-5 md:mt-0">
            <Box className="flex gap-1">
              <Box className="sm:max-w-[190px] mb-4 sm:mb-0">
                <CustomDatePicker
                  placeholder={t("MANDI_FROM_DATE")}
                  customFilters={dateRangeFilter}
                  setCustomFilters={setDateRangeFilter}
                  label={"fromDate"}
                />
                {dateError && !dateRangeFilter?.["fromDate"] && (
                  <Typography variant="caption" color={"#d32f2f"}>
                    {t("MANDI_DATE_FILTER_ERROR")}
                  </Typography>
                )}
              </Box>
              <Box className="sm:max-w-[190px]">
                <CustomDatePicker
                  placeholder={t("MANDI_TO_DATE")}
                  customFilters={dateRangeFilter}
                  setCustomFilters={setDateRangeFilter}
                  label={"toDate"}
                />
                {dateError && !dateRangeFilter?.["toDate"] && (
                  <Typography variant="caption" color={"#d32f2f"}>
                    {t("MANDI_DATE_FILTER_ERROR")}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box className="flex mt-0 justify-end">
              <CustomButton
                color={ButtonColor.SECONDARY}
                onClick={handleReset}
                sx={{ marginRight: "5px" }}
              >
                {t("COMMON_RESET")}
              </CustomButton>
              <CustomButton onClick={handleSearch}>
                {t("COMMON_SEARCH")}
              </CustomButton>
            </Box>
          </Box>
        </Box>
        <Grid container spacing={4} sx={{ marginTop: "0" }}>
          {Object.entries(infoCards).map(([key, value]) => (
            <Grid item xs={12} md={4} key={key} className="!pt-3 !sm:pt-1">
              <Box
                className={`green-linear-gradient history-info-card ${
                  selectedCard === key && "history-info-card-selected"
                }`}
                onClick={() => handleCardClick(key)}
              >
                <Typography
                  className="history-info-count"
                  sx={
                    selectedCard === key
                      ? { color: theme.palette.text.primary }
                      : { color: theme.palette.text.yellow }
                  }
                >
                  {count[key]}
                </Typography>
                <Typography
                  className="history-info-label"
                  sx={
                    selectedCard === key
                      ? { color: theme.palette.text.black }
                      : { color: "#fff" }
                  }
                >
                  {t(value)}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
        {isLoading ? (
          <Box className="flex items-center justify-center h-60">
            <CircularProgress color="success" />
          </Box>
        ) : (
          <Box className="mt-6">
            <CustomTable
              tableData={{ data: data?.agentAuditList ?? [], totalCount }}
              columns={columns}
              valueRenderer={cellValueRenderer}
              page={page}
              pageSize={rowsPerPage}
              setPage={setPage}
              setPageSize={setRowsPerPage}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default AgentHistory;
