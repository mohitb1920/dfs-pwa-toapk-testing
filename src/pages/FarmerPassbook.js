import {
  Box,
  Container,
  Drawer,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BasicBreadcrumbs from "../components/BreadCrumbsBar";
import { useTranslation } from "react-i18next";
import useSchemesData from "../Hooks/useSchemesData";
import { CustomDropdown } from "../AppModules/PGR/ComplaintsInbox";
import PropTypes from "prop-types";
import CustomDatePicker from "../components/CustomDatePicker";
import { useLocation, useNavigate } from "react-router-dom";
import CustomTable from "../components/CustomTable";
import {
  ConvertTimestampToDate,
  dispatchNotification,
  exportPdf,
  getFromToEpochTimes,
} from "../components/Utils";
import CustomButton from "../components/Button/CustomButton";
import { ButtonColor } from "../components/Button/ButtonEnums";
import {
  downloadFarmerPassbook,
  farmerPassbookSearch,
} from "../services/AgentService";
import { useDispatch } from "react-redux";
import { getPayload } from "../AppModules/Agent/FarmerPassbookOtpPage";
import UrlDialog from "../components/dialog/UrlDialog";
import useUrlDialog from "../Hooks/useUrlDialog";

const passbookFilters = [
  {
    id: "financialYear",
    label: "Choose_Year",
    type: "dropdown",
  },
  {
    id: "schemeCodes",
    label: "schemes.schemeSubName",
    type: "dropdown",
  },
  { id: "fromDate", label: "MANDI_FROM_DATE", type: "date" },
  {
    id: "toDate",
    label: "MANDI_TO_DATE",
    type: "date",
  },
];

const columns = [
  {
    id: "slNumber",
    label: "SL_NO",
    align: "left",
  },
  {
    id: "schemeName",
    label: "schemes.schemeSubName",
    align: "left",
    width: "100px",
  },
  {
    id: "subSchemeName",
    label: "Sub_Scheme_Name",
    align: "left",
  },
  {
    id: "applicationDate",
    label: "Application_Date",
    align: "left",
    width: "140px",
  },
  {
    id: "applicationNumber",
    label: "agentTrack.SCHEME_TICKET_NUMBER",
    align: "left",
  },
  {
    id: "benefitType",
    label: "Subsidy_Type",
    align: "left",
  },
  {
    id: "subsidyDisburseDate",
    label: "Settlement_Date",
    align: "left",
    width: "140px",
  },
  {
    id: "inputAmountQuantity",
    label: "Benefit_Allocation",
    align: "left",
  },
];

const yearOptions = [
  { label: "FY 2020-21", value: "2020-21" },
  { label: "FY 2021-22", value: "2021-22" },
  { label: "FY 2022-23", value: "2022-23" },
  { label: "FY 2023-24", value: "2023-24" },
  { label: "FY 2024-25", value: "2024-25" },
];

function FarmerPassbook({ isMobile }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { response, dbtId } = location.state ?? "";
  const [schemeOptions, setSchemeOptions] = useState([]);
  const [dateRangeFilter, setDateRangeFilter] = useState({});
  const [dateError, setDateError] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [dropdownFilters, setDropdownFilters] = useState({});
  const [page, setPage] = useState(0);
  const [passbookResponse, setPassbookResponse] = useState(response ?? {});
  const [searchParams, setSearchParams] = useState(null);
  const [schemesLoading, setSchemesLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { open, externalUrl, handleLinkClick, handleClose } = useUrlDialog();

  const handleChange = (value, id) => {
    const updatedFilters = { ...dropdownFilters };
    if (value) {
      setDropdownFilters({
        ...updatedFilters,
        [id]: value,
      });
    } else {
      delete updatedFilters[id];
      setDropdownFilters(updatedFilters);
    }
  };

  const handleSearch = async () => {
    setAnchorEl(null);
    let params = {};
    if ("financialYear" in dropdownFilters)
      params.financialYear = dropdownFilters.financialYear.value;
    if ("schemeCodes" in dropdownFilters)
      params.schemeNames = [dropdownFilters.schemeCodes.value];

    const { fromDate, toDate } = dateRangeFilter;
    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      setDateError(true);
      return;
    } else if (fromDate && toDate) {
      const { fromEpochTime, toEpochTime } = getFromToEpochTimes(
        fromDate,
        toDate
      );
      if (fromEpochTime && toEpochTime) {
        params = {
          ...params,
          applicationStartDate: fromEpochTime,
          applicationEndDate: toEpochTime,
        };
        setDateError(false);
      } else {
        setDateError(true);
        setDateRangeFilter({
          ...(fromEpochTime && { fromDate }),
          ...(toEpochTime && { toDate }),
        });
        return;
      }
    } else {
      setDateError(false);
    }
    setSearchParams(params);
  };

  const handleDownloadPdf = async () => {
    const payload = getPayload({
      dbtId,
      categoryType: "FARMER_PASSBOOK_PDF_GET",
      additionalFileds: { tokenId: response.tokenId },
      customSearchCriteria: { ...searchParams },
    });
    const pdfResponse = await downloadFarmerPassbook(payload);
    if (pdfResponse?.status === 200) {
      exportPdf(pdfResponse, "Passbook");
    } else if (
      pdfResponse?.data?.Errors?.[0]?.code === "FARMER_PASSBOOK_TOKEN_EXPIRED"
    ) {
      handleLinkClick("agent-access");
    } else {
      dispatchNotification("error", ["COMMON_PDF_DOWNLOAD_FAIL"], dispatch);
    }
  };

  const valueRenderer = ({ value, column, row }) => {
    if (["applicationDate", "subsidyDisburseDate"].includes(column.id))
      return ConvertTimestampToDate(value);
    if (column.id === "inputAmountQuantity") {
      const isAmount = ["Cash", "Rupees"].includes(row?.benefitType);
      return isAmount ? <p>&#8377;{Math.round(value ?? 0)}</p> : value;
    }
    if (column.id === "benefitType") {
      const isAmount = ["Cash", "Rupees"].includes(value);
      return t(isAmount ? "COMMON_AMOUNT" : value);
    }
    return value;
  };

  const resetFiltersAndSort = () => {
    setDateRangeFilter({});
    setDropdownFilters({});
    setDateError(false);
    setSearchParams({});
  };

  const updatePassbookData = async () => {
    const payload = getPayload({
      dbtId,
      categoryType: "FARMER_PASSBOOK_GET",
      additionalFileds: { tokenId: response.tokenId },
      customSearchCriteria: { ...searchParams, pageNo: page + 1, pageSize },
    });
    const searchResponse = await farmerPassbookSearch(payload);
    if (searchResponse?.status === 200) {
      const { proxyResponse } = searchResponse?.data ?? {};
      setPassbookResponse(proxyResponse);
    } else if (
      searchResponse?.data?.Errors?.[0]?.code ===
      "FARMER_PASSBOOK_TOKEN_EXPIRED"
    ) {
      handleLinkClick("agent-access");
    }
  };

  useEffect(() => {
    updatePassbookData();
  }, [searchParams, page, pageSize]);

  const filtersRenderer = () => {
    return (
      <Box className="grm-form-inner-card lg:flex justify-between max-sm:!bg-transparent max-sm:!p-0">
        <Box className="flex max-sm:flex-col gap-3 sm:gap-1">
          {passbookFilters.map((filter) => {
            if (filter.type === "date") {
              return (
                <Box
                  className="mandi-price-filter-item sm:max-w-[190px]"
                  key={filter.id}
                >
                  <Typography variant="h7" className="mandi-filter-label">
                    {t(filter.label)}
                  </Typography>
                  <CustomDatePicker
                    customFilters={dateRangeFilter}
                    setCustomFilters={setDateRangeFilter}
                    label={filter.id}
                  />
                  {dateError && !dateRangeFilter?.[filter.id] && (
                    <Typography variant="caption" color={"#d32f2f"}>
                      {t("MANDI_DATE_FILTER_ERROR")}
                    </Typography>
                  )}
                </Box>
              );
            } else if (filter.type === "dropdown") {
              return (
                <Box className="md:w-[180px]">
                  <Typography variant="h7" className="mandi-filter-label">
                    {t(filter.label)}
                  </Typography>
                  {filter.id === "schemeCodes" && schemesLoading ? (
                    <Skeleton
                      variant="rectangular"
                      height={40}
                      animation="wave"
                    />
                  ) : (
                    <CustomDropdown
                      id="support-issue-category"
                      options={
                        filter.id === "schemeCodes"
                          ? schemeOptions
                          : yearOptions
                      }
                      getOptionLabel={(option) => option.label}
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={t("COMMON_SELECT")}
                        />
                      )}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      value={dropdownFilters?.[filter.id] ?? null}
                      onChange={(event, newValue) =>
                        handleChange(newValue, filter.id)
                      }
                      openOnFocus
                    />
                  )}
                </Box>
              );
            }
            return <></>;
          })}
        </Box>
        <Box className="flex mt-6 max-sm:justify-end">
          <CustomButton
            color={ButtonColor.SECONDARY}
            onClick={resetFiltersAndSort}
            sx={{ marginRight: "5px" }}
          >
            {t("COMMON_RESET")}
          </CustomButton>
          <CustomButton onClick={handleSearch}>
            {t("COMMON_SEARCH")}
          </CustomButton>
        </Box>
      </Box>
    );
  };

  const getSchemeOptions = async () => {
    const payload = getPayload({
      dbtId,
      categoryType: "FARMER_PASSBOOK_GET",
      additionalFileds: { tokenId: response.tokenId },
      additionalPayload: { GroupByCriteria: "scheme_name" },
      isSchemesCall: true,
    });
    const searchResponse = await farmerPassbookSearch(payload);
    if (searchResponse?.status === 200) {
      const { proxyResponse } = searchResponse?.data ?? {};
      const { dropdownData } = proxyResponse ?? [];
      const options = dropdownData.map((scheme) => {
        return {
          label: scheme,
          value: scheme,
        };
      });
      setSchemeOptions(options);
    }
    setSchemesLoading(false);
  };

  useEffect(() => {
    setSchemesLoading(true);
    getSchemeOptions();
  }, []);

  useEffect(() => {
    if (!response) {
      navigate(-1);
    }
  }, [response, navigate]);

  return (
    <Container variant="primary">
      <Box className="inner-box-screen m-auto">
        <Box className="breadcrumbs-container mb-[24px]">
          <BasicBreadcrumbs />
        </Box>
        <Box className="grm-form-inner-cards-container !gap-y-5">
          <Box className="flex justify-between sm:block max-sm:items-center">
            <Typography
              variant={isMobile ? "subtitle2" : "h3"}
              className="verify-farmer-details-text"
            >
              {t("FARMER_PASSBOOK")}
            </Typography>
            {isMobile && (
              <Box className="flex">
                <CustomButton
                  color={ButtonColor.SECONDARY}
                  onClick={handleDownloadPdf}
                  sx={{ marginRight: "5px" }}
                >
                  {t("PDF")}{" "}
                  <img
                    src={`${window.contextPath}/assets/download-icon.svg`}
                    alt="download-icon"
                    className="ml-2 image-filter-invert"
                  />
                </CustomButton>
                <img
                  src={`${window.contextPath}/assets/filters-icon.svg`}
                  alt="filters"
                  className="ml-2 image-filter-invert"
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                />
                <Drawer
                  anchor="bottom"
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  className="custom-mobile-drawer"
                >
                  <Typography
                    variant="h5"
                    className="mobile-filters-header-text"
                  >
                    {t("Filters")}
                  </Typography>
                  {filtersRenderer()}
                </Drawer>
              </Box>
            )}
          </Box>
          {!isMobile &&
            passbookResponse &&
            !passbookResponse?.isProcessing &&
            filtersRenderer()}
          {passbookResponse && passbookResponse?.isProcessing && (
            <Container variant="white" className="!rounded-lg">
              <Box className="h-40 flex items-center justify-center">
                <Typography variant="body2" className="text-center">
                  {t("PROCESSING_PASSBOOK_INFO")}
                </Typography>
              </Box>
            </Container>
          )}
          {passbookResponse && !passbookResponse?.isProcessing && (
            <>
              {!isMobile && (
                <Box className="flex justify-end">
                  <CustomButton
                    color={ButtonColor.SECONDARY}
                    onClick={handleDownloadPdf}
                    sx={{ marginRight: "5px" }}
                  >
                    {" "}
                    <img
                      src={`${window.contextPath}/assets/download-icon.svg`}
                      alt="download-icon"
                      className="mr-2 image-filter-invert"
                    />{" "}
                    {t("Download_PDF")}
                  </CustomButton>
                </Box>
              )}
              <CustomTable
                tableData={{
                  data: passbookResponse?.Data,
                  totalCount: passbookResponse?.totalCounts,
                }}
                columns={columns}
                valueRenderer={valueRenderer}
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
              />
            </>
          )}
        </Box>
      </Box>
      <UrlDialog
        open={open}
        externalUrl={externalUrl}
        handleClose={handleClose}
        t={t}
        content="passbookSessionTimeout"
        showCloseButton={false}
        proceedProps={{ internal: true }}
      />
    </Container>
  );
}

FarmerPassbook.propTypes = {
  isMobile: PropTypes.bool,
};

export default FarmerPassbook;
