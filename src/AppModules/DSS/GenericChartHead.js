import {
  Box,
  CircularProgress,
  Container,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import "../../styles/Dashboard.css";
import { useTranslation } from "react-i18next";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { SessionStorage } from "../../Utils/LocalStorage";
import FilterContext from "./FilterContext";
import {
  ConvertTimestampToDate,
  dispatchNotification,
} from "../../components/Utils";
import {
  Download,
  farmerRequestParams,
  farmersReportColumns,
  schemesReportColumns,
  schemesRequestParams,
} from "./Utils";
import { DashboardService } from "../../services/DashboardService";
import { useDispatch } from "react-redux";

const farmerLabels = {
  district: "districtLG",
  block: "block",
  panchayat: "panchayat",
};
const schemeLabels = {
  district: "districtCode",
  block: "blockName",
  panchayat: "panchayatName",
};

function GenericChartHead({
  header,
  children,
  showHeader = true,
  amountValue = {},
  moduleCode,
  districtsMap,
  seedSubSchemes = {},
  isMobile,
}) {
  const { t } = useTranslation();
  const { value } = useContext(FilterContext);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prevFilters, setPrevFilters] = useState(null);
  const [exportChartData, setExportChartData] = useState(null);
  const open = Boolean(anchorEl);
  const schemesRequest = moduleCode === "schemesApplications";
  const isSeedSubsidyScheme = header === "SEED_APPLICATIONS_PER_SUB_SCHEME";

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getFilters = () => {
    const sessionKey = `${header}_DRILL_FILTERS`;
    const drillFilters = SessionStorage.get(sessionKey)?.barSelected || [];
    const selectedFilters = [];
    const filterHeaders = [];
    const filterValues = [];

    const startDate = value?.range?.startDate?.getTime();
    const endDate = value?.range?.endDate?.getTime();
    const dateFilters = {
      field: "createdTime",
      value: [startDate, endDate],
      operator: "BETWEEN",
    };
    selectedFilters.push(dateFilters);
    filterHeaders.push("From Date", "To Date", "");
    filterValues.push(
      ConvertTimestampToDate(startDate),
      ConvertTimestampToDate(endDate),
      ""
    );

    const labels = schemesRequest ? schemeLabels : farmerLabels;
    if (schemesRequest && isSeedSubsidyScheme) {
      const scheme = {
        field: "schemeName",
        value: ["Seed subsidy scheme"],
        operator: "EQUAL",
      };
      selectedFilters.push(scheme);
      filterHeaders.push("Scheme Name");
      filterValues.push("Seed subsidy scheme");
    }

    if (!schemesRequest && value?.cardStatus !== null) {
      const isDbtLinked = value?.cardStatus === "1";
      const status = {
        field: "isDBTUser",
        value: [isDbtLinked ? true : false],
        operator: "EQUAL",
      };
      selectedFilters.push(status);
      filterHeaders.push("DBT Status");
      filterValues.push(isDbtLinked ? "DBT Linked" : "DBT Not Linked");
    }

    if (drillFilters.length > 0) {
      if (schemesRequest) {
        const scheme = {
          field: isSeedSubsidyScheme ? "subSchemeCode" : "schemeName",
          value: [drillFilters[0]],
          operator: "EQUAL",
        };
        selectedFilters.push(scheme);
        filterHeaders.push(
          isSeedSubsidyScheme ? "Sub Scheme Name" : "Scheme Name"
        );
        filterValues.push(
          isSeedSubsidyScheme
            ? seedSubSchemes?.get(drillFilters[0]) ?? drillFilters[0]
            : drillFilters[0]
        );
        drillFilters.shift();
      }
      drillFilters.forEach((item, index) => {
        const filter = {
          field:
            index === 0
              ? labels.district
              : index === 1
              ? labels.block
              : labels.panchayat,
          value: [item.toString()],
          operator: "EQUAL",
        };
        selectedFilters.push(filter);
        filterHeaders.push(
          index === 0 ? "District" : index === 1 ? "Block" : "Panchayat"
        );
        filterValues.push(item);
      });
    }
    if (drillFilters.length === 0 && value?.filters?.district?.length > 0) {
      const filter = {
        field: labels.district,
        value: value?.filters?.district,
        operator: "EQUAL",
      };
      selectedFilters.push(filter);
      filterHeaders.push("District");
      filterValues.push(value.filters.district.join(", "));
    }
    return { selectedFilters, filterHeaders, filterValues };
  };

  const getFilteredChartData = async (selectedFilters) => {
    setLoading(true);
    if (
      JSON.stringify(prevFilters) === JSON.stringify(selectedFilters) &&
      exportChartData !== null
    ) {
      return exportChartData;
    }
    const response = await DashboardService.getExportData({
      data: {
        filters: selectedFilters,
        ...(schemesRequest ? schemesRequestParams : farmerRequestParams),
      },
      schemesRequest,
    });
    if (response?.status === 200) {
      setExportChartData(response?.data?.documents || []);
      return response?.data?.documents || [];
    } else {
      dispatchNotification(
        "error",
        response?.data?.Errors?.[0]?.message || t("ES_SOMETHING_WRONG"),
        dispatch
      );
      return null;
    }
  };

  const exportToExcel = async () => {
    handleClose();
    const { selectedFilters, filterHeaders, filterValues } = getFilters();
    let fileName = schemesRequest
      ? "Scheme Applications"
      : "Farmer Registrations";
    fileName += `(${value?.range?.title})`;
    const index = filterHeaders.indexOf("District");
    if (index !== -1) {
      const districtNames = [];
      if (typeof filterValues[index] === "string") {
        value?.filters?.district?.forEach((code) => {
          districtNames.push(districtsMap.get(parseInt(code)));
        });
      } else {
        districtNames.push(districtsMap.get(parseInt(filterValues[index])));
      }
      filterValues[index] = districtNames.join(", ");
    }
    const dataJson = await getFilteredChartData(selectedFilters);
    if (dataJson && dataJson?.length > 0) {
      setPrevFilters(selectedFilters);
      const fileHeaders = [filterHeaders, filterValues, []];
      const columns = schemesRequest
        ? schemesReportColumns
        : farmersReportColumns;
      const data = { dataJson, columns };
      Download.CustomExcel(fileHeaders, data, fileName);
    }
    setLoading(false);
  };

  const menuItems = [
    ...([
      "APPLICATIONS_PER_SCHEME",
      "DSS_FARMERS_REGISTERED",
      "SEED_APPLICATIONS_PER_SUB_SCHEME",
    ].includes(header)
      ? [
          {
            i18nKey: "Download_As_Excel",
            icon: "file-excel-export.svg",
            altText: "Download as Excel",
            handleClick: exportToExcel,
          },
        ]
      : []),
  ];

  return (
    <Container variant="tertiaryWhite">
      <Box className="generic-chart-wrapper">
        {loading && (
          <Box className="absolute-loader">
            <CircularProgress color="success" />
          </Box>
        )}
        <Box className="flex justify-between px-2">
          {showHeader && (
            <Typography
              variant={isMobile ? "h7" : "h6"}
              className="generic-chart-header"
            >
              {t(header)}
            </Typography>
          )}
          {menuItems?.length > 0 && (
            <MoreHorizIcon className="cursor-pointer" onClick={handleClick} />
          )}
          <Menu
            id="chart-menu"
            aria-labelledby="chart export menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {menuItems.map((option) => (
              <MenuItem onClick={option.handleClick}>
                <img
                  alt=""
                  src={`${window.contextPath}/assets/${option.icon}`}
                  className="h-5 mr-2 image-filter-invert"
                />
                {t(option.i18nKey)}
              </MenuItem>
            ))}
          </Menu>
        </Box>
        {children}
      </Box>
    </Container>
  );
}

export default GenericChartHead;
