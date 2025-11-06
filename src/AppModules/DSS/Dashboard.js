import {
  Box,
  CircularProgress,
  Container,
  Drawer,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import Filters from "./Filters";
import FilterContext from "./FilterContext";
import { format } from "date-fns";
import {
  getDefaultFinacialYear,
  getDuration,
  TENANT_ID,
} from "../../components/Utils";
import { useTranslation } from "react-i18next";
import useDistrict from "../../Hooks/useDistrict";
import { useParams } from "react-router-dom";
import { useLocalizationStore } from "../../Hooks/Store";
import useDashoardConfig from "../../Hooks/useDashboardConfig";
import ChartsLayout from "./ChartsLayout";
import RemovableChip from "../../components/RemovableChip";
import { SessionStorage } from "../../Utils/LocalStorage";
import PropTypes from "prop-types";

const key = "DSS_FILTERS";

const getInitialRange = () => {
  const data = SessionStorage.get(key);
  const startDate = data?.range?.startDate
    ? new Date(data?.range?.startDate)
    : getDefaultFinacialYear().startDate;
  const endDate = data?.range?.endDate
    ? new Date(data?.range?.endDate)
    : getDefaultFinacialYear().endDate;
  const title = `${format(startDate, "MMM d, yyyy")} - ${format(
    endDate,
    "MMM d, yyyy"
  )}`;
  const interval = getDuration(startDate, endDate);
  const tenantId = TENANT_ID;
  const district = data?.filters?.district || [];
  return {
    startDate,
    endDate,
    title,
    interval,
    tenantId,
    district,
  };
};

function Dashboard({ initData }) {
  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery("(max-width:640px)");
  const [filters, setFilters] = useState(() => {
    const { startDate, endDate, title, interval, district, tenantId } =
      getInitialRange();
    return {
      range: { startDate, endDate, title, interval },
      requestDate: {
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        interval: interval,
        title: title,
      },
      filters: { tenantId, district },
      cardStatus: null,
    };
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const { dashboardCode } = useParams();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";
  const moduleCode =
    dashboardCode === "farmersDashboard"
      ? "farmersRegistrations"
      : dashboardCode;
  const stateCode = TENANT_ID;
  const { isLoading: localizationLoading } = useLocalizationStore({
    stateCode,
    moduleCode: "rainmaker-hcm-dss",
    language: i18n.language,
  });
  const { data: tenantDistricts, isLoading: isDistrictsLoading } =
    useDistrict("br");

  const { data: response, isLoading } = useDashoardConfig(moduleCode);

  let districtsMap = new Map();
  if (
    tenantDistricts &&
    Array.isArray(tenantDistricts) &&
    tenantDistricts.length > 0
  ) {
    districtsMap = new Map(
      tenantDistricts.map((district) => [Number(district.code), district.name])
    );
  }

  const handleFilters = (data) => {
    SessionStorage.set(key, data);
    setFilters(data);
  };

  const provided = useMemo(
    () => ({ value: filters, setValue: handleFilters }),
    [filters]
  );

  const removeDist = (id) => {
    const updatedDistricts = [...filters?.filters?.district].filter(
      (dist, index) => index !== id
    );
    handleFilters({
      ...filters,
      filters: { ...filters?.filters, district: updatedDistricts },
    });
  };

  const dashboardConfig = response?.responseData;

  if (isDistrictsLoading || localizationLoading || isLoading) {
    return (
      <Box className="h-96 flex justify-center items-center">
        <CircularProgress color="success" />
      </Box>
    );
  }
  return (
    <FilterContext.Provider value={provided}>
      <Container variant="primary">
        <Box className="inner-box-screen m-auto mb-20 max-sm:px-1">
          <Box className="breadcrumbs-container">
            <BasicBreadcrumbs />
          </Box>
          <Box className="flex justify-between">
            <Typography
              variant={isMobile ? "subtitle2" : "h2"}
              className="py-5 !font-bold"
            >
              {t(dashboardConfig?.[0]?.name)}
            </Typography>
            {isMobile && (
              <img
                src={`${window.contextPath}/assets/filters-icon.svg`}
                alt="filters"
                className="ml-2 image-filter-invert cursor-pointer"
                onClick={(event) => setAnchorEl(event.currentTarget)}
              />
            )}
          </Box>
          {(!isMobile || filters?.filters?.district?.length > 0) && (
            <Box className="tertiary-green-card">
              {!isMobile && (
                <Filters
                  t={t}
                  tenantDistricts={tenantDistricts}
                  setAnchorEl={setAnchorEl}
                />
              )}
              {filters?.filters?.district?.length > 0 && (
                <Box className="chips-container mt-3">
                  {filters?.filters?.district &&
                    filters.filters.district.map((filter, id) => (
                      <RemovableChip
                        key={id}
                        text={`${t(`DSS_HEADER_DIST`)}: ${districtsMap.get(
                          parseInt(filter)
                        )}`}
                        onClick={() => removeDist(id)}
                      />
                    ))}
                </Box>
              )}
            </Box>
          )}
          <Drawer
            anchor="bottom"
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            className="custom-mobile-drawer"
          >
            <Typography variant="h5" className="mobile-filters-header-text">
              {t("Filters")}
            </Typography>
            <Filters
              t={t}
              tenantDistricts={tenantDistricts}
              setAnchorEl={setAnchorEl}
            />
          </Drawer>
          <Box className="flex flex-col gap-6 sm:pt-6">
            {dashboardConfig?.[0]?.visualizations.map((row, key) => {
              return (
                <ChartsLayout
                  rowData={row}
                  moduleCode={moduleCode}
                  districtsMap={districtsMap}
                  isDarkTheme={isDarkTheme}
                  isMobile={isMobile}
                  initData={initData}
                />
              );
            })}
          </Box>
        </Box>
      </Container>
    </FilterContext.Provider>
  );
}

Dashboard.prototypes = {
  initData: PropTypes.object,
};

export default Dashboard;
