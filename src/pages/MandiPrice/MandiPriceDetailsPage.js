import { useLocation, useNavigate } from "react-router-dom";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import {
  Box,
  Button,
  ButtonBase,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { capitalize, ConvertTimestampToDate } from "../../components/Utils";
import MandiPriceGraph from "../../components/MandiPriceGraph";
import { ReactComponent as MinPriceIcon } from "../../assets/MinPriceIcon.svg";
import { ReactComponent as MaxPriceIcon } from "../../assets/MaxPriceIcon.svg";
import { ReactComponent as NoPriceChangeIcon } from "../../assets/NoPriceChangeIcon.svg";
import { ReactComponent as LeftArrow } from "../../assets/left-arrow.svg";
import { ReactComponent as RightArrow } from "../../assets/right-arrow.svg";
import useMandiPriceInboxData from "../../Hooks/useMandiPriceTableData";
import { searchFilters } from "./MandiFiltersRenderer";
import CustomDatePicker from "../../components/CustomDatePicker";
import moment from "moment";

export const changeCheck = (
  change,
  iconSize = { height: 25, width: 25, fontSize: "1rem", class: "" }
) => {
  if (change >= 0) {
    return (
      <Box
        className={`flex items-center justify-between ml-2 w-24 sm:w-28 ${iconSize.class}`}
      >
        <Typography
          sx={{
            fontSize: iconSize.fontSize,
          }}
        >
          {change?.toFixed(2)}%
        </Typography>
        {change === 0 ? (
          <NoPriceChangeIcon height={iconSize.height} width={iconSize.width} />
        ) : (
          <MaxPriceIcon height={iconSize.height} width={iconSize.width} />
        )}
      </Box>
    );
  } else {
    return (
      <Box className="flex items-center justify-between ml-2 w-24 sm:w-28">
        <Typography
          sx={{
            fontSize: iconSize.fontSize,
          }}
        >
          {-1 * change?.toFixed(2)}%
        </Typography>
        <MinPriceIcon height={iconSize.height} width={iconSize.width} />
      </Box>
    );
  }
};

const todayDate = moment().format("D-MMM-YYYY");

function MandiPriceDetailsPage({ isMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const today = moment();
  const [dateRangeFilter, setDateRangeFilter] = useState({
    toDate: today,
    fromDate: moment().subtract(10, "days"),
  });
  const [searchParams, setSearchParams] = useState({});
  const commodityData = location.state?.data ?? {};

  const {
    additionalFields,
    commodityCode,
    marketCenterCode,
    gradeCode,
    varietyCode,
  } = commodityData ?? {};

  const { isLoading, data: commodityPriceData } = useMandiPriceInboxData(
    {
      dateTo: searchParams.toDate,
      dateFrom: searchParams.fromDate,
      commodityCode: [commodityCode],
      marketCenterCode: [marketCenterCode],
      districtCode: [additionalFields?.districtLg],
      gradeCode: [gradeCode],
      varietyCode: [varietyCode],
      tenantId: "br",
      pageSize: 10,
      pageNo: 1,
      locale: i18n.language,
    },
    Boolean(searchParams?.fromDate && searchParams?.toDate)
  );

  const adjustDateRange = (days) => {
    setDateRangeFilter((prev) => {
      const toDate = prev.toDate ? prev.toDate.clone() : moment();
      const newToDate = moment.min(moment(), toDate.add(days, "days"));
      const newFromDate = newToDate.clone().subtract(10, "days");
      return { fromDate: newFromDate, toDate: newToDate };
    });
  };

  const constructChartData = (data) => {
    let result = [];
    for (let i = 0; i < data?.length; i++) {
      const row = data[i];
      const recordObj = {
        price: row.modalPrice,
        date: ConvertTimestampToDate(row.arrivalDate),
        trend: row.priceTrend,
      };
      result.unshift(recordObj);
    }
    return result;
  };

  const getValue = (key, item) => {
    const data = commodityPriceData?.data?.[0] ?? commodityData;
    if (key === "district") {
      return capitalize(data?.additionalFields?.[item?.key] || " - ");
    }
    if (key === "commodity") {
      return capitalize(data?.[item?.key] || " - ");
    }
    if (key === "market") {
      return capitalize(data?.marketCenter || " - ");
    }
  };

  const chartData = useMemo(
    () => constructChartData(commodityPriceData?.data),
    [commodityPriceData]
  );

  const datePickersRenderer = () => {
    return (
      <Box className="flex items-center gap-1">
        <ButtonBase
          onClick={() => adjustDateRange(-10)}
          focusRipple
          sx={{
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <LeftArrow className="arrow-inside-box" />
        </ButtonBase>
        <Box className="flex gap-1">
          <Box className="sm:max-w-[180px] mb-4 sm:mb-0">
            <CustomDatePicker
              placeholder={t("MANDI_FROM_DATE")}
              customFilters={dateRangeFilter}
              setCustomFilters={setDateRangeFilter}
              label={"fromDate"}
            />
          </Box>
          <Box className="sm:max-w-[180px]">
            <CustomDatePicker
              placeholder={t("MANDI_TO_DATE")}
              customFilters={dateRangeFilter}
              setCustomFilters={setDateRangeFilter}
              label={"toDate"}
            />
          </Box>
        </Box>
        <ButtonBase
          focusRipple
          onClick={
            dateRangeFilter.toDate?.format("DD-MMM-YYYY") === todayDate
              ? () => {}
              : () => adjustDateRange(10)
          }
          sx={{
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <RightArrow className="arrow-inside-box" />
        </ButtonBase>
      </Box>
    );
  };

  useEffect(() => {
    const { fromDate, toDate } = dateRangeFilter;

    if (fromDate && toDate) {
      const date1 = new Date(fromDate);
      const date2 = new Date(toDate);
      const fromEpochTime = date1.getTime();
      const toEpochTime = date2.setHours(23, 59, 59, 999);
      setSearchParams({
        ...searchParams,
        fromDate: fromEpochTime,
        toDate: toEpochTime,
      });
    }
  }, [dateRangeFilter]);

  useEffect(() => {
    if (location.state === null) {
      navigate(`${window.contextPath}/mandi`);
    }
  }, [location.state, navigate]);

  return (
    <Box className="commodity-price-details-page">
      <Box className="breadcrumbs-container">
        <BasicBreadcrumbs />
      </Box>
      <Box>
        {isLoading ? (
          <Skeleton
            variant="text"
            sx={{ fontSize: "2.5rem", margin: "29px 0px" }}
            animation="wave"
            width={300}
          />
        ) : (
          <Typography
            variant={isMobile ? "h5" : "h2"}
            className="mandi-price-main-header"
          >
            {commodityPriceData?.data?.[0]?.commodity ??
              commodityData?.commodity ??
              " - "}
          </Typography>
        )}
        <Box className="mandi-price-filters-container max-sm:mb-3">
          <Box className="selected-commodity-headers-container">
            <Box className="mandi-price-filter-box gap-y-[18px]">
              {searchFilters.map((item) => {
                if (item.type !== "date") {
                  const { key } = item;
                  return (
                    <Box className="mandi-commodity-selected">
                      {getValue(key, item)}
                    </Box>
                  );
                }
                return <></>;
              })}
            </Box>
            {isMobile && <Box className="pt-7"> {datePickersRenderer()} </Box>}
            <Box className="mt-1 sm:mt-0 w-full sm:w-auto">
              {commodityData?.modalPrice ? (
                <>
                  <Typography
                    variant="body2"
                    className="text-right sm:text-left !mb-2 arrival-date-text"
                  >
                    {ConvertTimestampToDate(commodityData?.arrivalDate)}
                  </Typography>
                  <Box className="mandi-today-price">
                    <Box>
                      &#8377;{commodityData.modalPrice}/{t("PRICE_QUINTOL")}
                    </Box>
                    <Box>
                      {changeCheck(commodityData?.priceTrend, {
                        height: 20,
                        width: 20,
                        fontSize: "16px",
                        class: "today-price-trend",
                      })}
                    </Box>
                  </Box>
                </>
              ) : (
                ""
              )}
            </Box>
          </Box>
        </Box>
        {!isMobile && (
          <Box className="mandi-price-table-header-container">
            <Typography variant="h4" className="mandi-price-chart-header">
              {t("MANDI_COMMODITY_PRICE_TREND")}
            </Typography>
            {datePickersRenderer()}
          </Box>
        )}
        <Box>
          {isLoading ? (
            <Skeleton variant="rectangular" height={300} animation="wave" />
          ) : (
            <MandiPriceGraph data={chartData} />
          )}
        </Box>
        <Typography variant="h4" className="mandi-price-table-header">
          {t("MANDI_PAST_PRICES_LABEL")}
        </Typography>
        {isLoading ? (
          <Skeleton variant="rectangular" height={400} animation="wave" />
        ) : (
          <>
            {chartData?.length === 0 ? (
              <Box className="flex items-center justify-center h-[300px]">
                <Typography variant="primary">
                  {t("MANDI_NO_MARKET_DATA")}
                </Typography>
              </Box>
            ) : (
              <Box className="commodity-past-prices-container">
                {chartData
                  .filter((item) => item.date !== todayDate)
                  .reverse()
                  .map((e, index) => {
                    return (
                      <Box
                        className="commodity-past-price-row"
                        sx={
                          index === chartData.length - 1
                            ? { borderBottom: "none !important" }
                            : {}
                        }
                      >
                        <Typography className="w-[112px] md:pl-16 sm:w-3/5 lg:w-4/6">
                          {e.date}
                        </Typography>
                        <Box className="flex items-center gap-2">
                          <Typography>
                            &#8377;{e.price}/{t("PRICE_QUINTOL")}
                          </Typography>
                          <Box>{changeCheck(e.trend)}</Box>
                        </Box>
                      </Box>
                    );
                  })}
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

export default MandiPriceDetailsPage;
