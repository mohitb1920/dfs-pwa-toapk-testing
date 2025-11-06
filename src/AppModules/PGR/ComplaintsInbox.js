import {
  Autocomplete,
  Avatar,
  Box,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  Pagination,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/styles";
import ComplaintsTable from "./ComplaintsTable";
import useInboxData from "../../Hooks/useInboxData";
import { getUser } from "../../services/loginService";
import RefreshIcon from "@mui/icons-material/Refresh";
import ClearIcon from "@mui/icons-material/Clear";
import {
  commonResolvedSubstring,
  getCurrentLanguage,
} from "../../components/Utils";
import { useTranslation } from "react-i18next";
import useShowCauseData from "../../Hooks/useShowCauseData";
import useComplaintsCount from "../../Hooks/useComplaintsCount";
import { PersistantStorage } from "../../Utils/LocalStorage";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CustomDatePicker from "../../components/CustomDatePicker";
import CustomTableFilterButton from "../../components/CustomTableFilterButton";
import CustomButton from "../../components/Button/CustomButton";
import { ButtonColor, ButtonState } from "../../components/Button/ButtonEnums";
import {
  getUserShowcauseFilters,
  getUserStatusFilters,
  userSpecificParameters,
} from "./PGRUtils";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";

const BootstrapInput = styled(Select)(({ theme }) => ({
  "& .css-n70jm4-MuiInputBase-root-MuiInput-root-MuiSelect-root": {
    borderBottom: "none",
  },
}));

export const CustomDropdown = styled(Autocomplete)({
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#49454F",
    },
    color: "#A2ABA6",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#A5A5A5",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#A5A5A5",
      borderWidth: "1px",
    },
  },
});

const showCauseFilters = ["issuedTo", "issuedBy"];

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const getInitialFilter = (userShowcauseFilters) => {
  const filterKeys = Object.keys(userShowcauseFilters);
  if (filterKeys.length === 1) {
    return filterKeys[0];
  }
  return "issuedTo";
};

function ComplaintsInbox({ localizationLoading }) {
  const userInfo = useMemo(() => getUser(), []);
  const isSaoUser = useMemo(
    () => localStorage.getItem("DfsWeb.isSaoUser") === "true",
    []
  );
  const isSupportUser = useMemo(
    () => localStorage.getItem("DfsWeb.isSupportUser") === "true",
    []
  );
  const userStatusFilters = useMemo(() => getUserStatusFilters(), []);
  const userShowcauseFilters = useMemo(() => getUserShowcauseFilters(), []);
  const userParams = useMemo(
    () => userSpecificParameters(userInfo),
    [userInfo]
  );
  const { t } = useTranslation();
  const [section, setSection] = useState(
    () => sessionStorage.getItem("grm_section") || "assigned"
  );
  const [count, setCount] = useState(
    () => PersistantStorage.get("grm_count") || { resolved: "", pending: "" }
  );
  const [pageOffset, setPageOffset] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const isAssignedTab = useMemo(() => section === "assigned", [section]);
  const defaultShowcauseFilter = useMemo(
    () => getInitialFilter(userShowcauseFilters),
    []
  );
  const [searchParams, setSearchParams] = useState(() => {
    const statusFilter = sessionStorage.getItem("statusFilter");
    return {
      filters: {
        wfQuery: { assignee: userInfo.uuid },
      },
      search: {},
      sortOrder: "DESC",
      customFilters: {},
      applicationStatus: statusFilter
        ? statusFilter
        : isAssignedTab
        ? userStatusFilters.pending
        : defaultShowcauseFilter,
    };
  });
  const [rotation, setRotation] = useState(0);
  const [customFilters, setCustomFilters] = useState({});

  useEffect(() => {
    const statusFilter = sessionStorage.getItem("statusFilter") || "issuedTo";
    const isShowCauseStatus = statusFilter.includes("issued");
    const status =
      section === "assigned"
        ? isShowCauseStatus
          ? userStatusFilters.pending
          : statusFilter
        : isShowCauseStatus
        ? statusFilter
        : defaultShowcauseFilter;
    setSearchParams({ ...searchParams, applicationStatus: status });
    sessionStorage.setItem("statusFilter", status);
    sessionStorage.setItem("grm_section", section);
  }, [section]);

  const handleChangePage = (event, newPage) => {
    setPageOffset((newPage - 1) * pageSize);
  };

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
    if (e.target.value === "") {
      setSearchParams({
        ...searchParams,
        search: {},
      });
    }
  };

  const resetCustomFilters = () => {
    setCustomFilters({});
    setSearchParams({
      ...searchParams,
      customFilters: {},
    });
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onSearch();
    }
  };

  const onSearch = async () => {
    setSearchParams({
      ...searchParams,
      search: { serviceRequestId: searchInput.trim() },
    });
    setPageOffset(0);
    await refetch();
  };

  const handleSlaDropdownChange = (value) => {
    if (value?.length === 0) {
      const filters = { ...customFilters };
      delete filters.slaDaysLeft;
      setCustomFilters(filters);
    } else {
      setCustomFilters({ ...customFilters, slaDaysLeft: value });
    }
  };
  const handleCustomSearch = async () => {
    let selectedFilters = {};
    if (customFilters?.fromDate && customFilters?.toDate) {
      const { fromDate, toDate } = customFilters;
      const date1 = new Date(fromDate);
      const date2 = new Date(toDate);
      const fromEpochTime = date1.getTime();
      const toEpochTime = date2.setHours(23, 59, 59, 999);
      selectedFilters = {
        ...selectedFilters,
        fromDate: fromEpochTime,
        toDate: toEpochTime,
      };
    }
    if (customFilters?.slaDaysLeft) {
      const slas = [];
      customFilters.slaDaysLeft.forEach((item) => slas.push(item.value));
      selectedFilters = {
        ...selectedFilters,
        slaDaysLeft: slas.join(),
      };
    }
    setSearchParams({
      ...searchParams,
      customFilters: selectedFilters,
    });
    setPageOffset(0);
    await refetch();
  };

  const getLocaleText = (complaints, totalCount) => {
    const language = getCurrentLanguage();
    if (language === "hi_IN") {
      return `${totalCount} ${t("GRM_ENTRIES")} ${pageOffset + 1} ${t(
        "COMMON_OF"
      )} ${complaints?.complaints?.length + pageOffset} ${t(
        "GRM_SHOWING_DATA"
      )}`;
    }
    return `Showing data of ${pageOffset + 1} to ${
      complaints?.complaints?.length + pageOffset
    }${" "} of ${totalCount} Entries`;
  };

  const getCountText = (complaints, totalCount) => {
    return complaints?.complaints?.length > 0
      ? getLocaleText(complaints, totalCount)
      : `0 ${t("GRM_COMPLAINTS")}`;
  };

  const commonParams = {
    ...searchParams,
    offset: pageOffset,
    limit: pageSize,
  };

  let {
    data: complaints,
    isLoading: isLoadingComplaints,
    refetch: refetchComplaints,
  } = useInboxData(
    commonParams,
    isAssignedTab,
    isSaoUser,
    userStatusFilters,
    userParams
  );

  let {
    data: showcauses,
    isLoading: isLoadingShowcauses,
    refetch: refetchShowcause,
  } = useShowCauseData(
    commonParams,
    !isAssignedTab && showCauseFilters.includes(searchParams.applicationStatus)
  );

  const {
    data: showcauseCount,
    isLoading: isCountLoading,
    refetch: refetchCount,
  } = useComplaintsCount(commonParams);

  const inboxData = isAssignedTab ? complaints : showcauses;
  const isLoading =
    (isAssignedTab ? isLoadingComplaints : isLoadingShowcauses) ||
    isCountLoading;
  const refetch = isAssignedTab ? refetchComplaints : refetchShowcause;

  const handleRefresh = () => {
    refetch();
    if (!isAssignedTab) {
      refetchCount();
    }
    setRotation(rotation + 360);
  };

  const handleSectionChange = async (section) => {
    setCustomFilters((prevState) => {
      const { slaDaysLeft, ...newState } = prevState;
      return newState;
    });
    setSearchParams((prevState) => {
      const { slaDaysLeft, ...newState } = prevState.customFilters;
      return { ...prevState, search: {}, customFilters: newState };
    });
    setSearchInput("");
    setSection(section);
    if (isAssignedTab) {
      refetchCount();
    }
    await refetch();
  };

  const handleResolvedFilter = (item) => {
    let newStatus = null;
    if (item?.status) {
      newStatus = item.status;
    } else {
      newStatus = userStatusFilters.resolved;
    }
    sessionStorage.setItem("statusFilter", newStatus);
    if (searchParams.applicationStatus !== newStatus) {
      setSearchParams({
        ...searchParams,
        applicationStatus: newStatus,
        search: {},
      });
      setSearchInput("");
    }
    setPageOffset(0);
  };

  const handlePendingFilter = () => {
    sessionStorage.setItem("statusFilter", userStatusFilters.pending);
    if (searchParams.applicationStatus !== userStatusFilters.pending) {
      setSearchParams({
        ...searchParams,
        applicationStatus: userStatusFilters.pending,
        search: {},
      });
      setSearchInput("");
    }
    setPageOffset(0);
  };

  const handleShowcauseFilter = (key) => {
    setPageOffset(0);
    sessionStorage.setItem("statusFilter", key);
    setSearchParams({
      ...searchParams,
      applicationStatus: key,
    });
  };

  const disableCustomSearch = useMemo(() => {
    const { slaDaysLeft, fromDate, toDate } = customFilters;
    const onlySlaSelected = slaDaysLeft && !fromDate && !toDate;
    const bothDateFiltersSelected = fromDate && toDate;
    const allFiltersSelected = slaDaysLeft && fromDate && toDate;
    if (onlySlaSelected || bothDateFiltersSelected || allFiltersSelected)
      return false;

    return true;
  }, [customFilters]);

  const resolved = useMemo(() => {
    const keyword = searchParams.applicationStatus.includes("KCC")
      ? "KCC"
      : isSaoUser
      ? "VERIFICATION"
      : commonResolvedSubstring;
    return searchParams.applicationStatus.includes(keyword);
  }, [searchParams.applicationStatus, isSaoUser]);

  const issuedByMe = useMemo(
    () => searchParams.applicationStatus === "issuedBy",
    [searchParams.applicationStatus]
  );

  const totalCount = useMemo(() => {
    if (searchParams?.search?.serviceRequestId)
      return inboxData?.complaints?.length ?? 0;
    if (isAssignedTab) {
      return complaints?.totalCount;
    } else if (issuedByMe) {
      return showcauseCount?.issuedBy;
    } else {
      return showcauseCount?.issuedTo;
    }
  }, [
    inboxData,
    isAssignedTab,
    complaints?.totalCount,
    issuedByMe,
    showcauseCount?.issuedTo,
    showcauseCount?.issuedBy,
    searchParams,
  ]);

  useEffect(() => {
    if (
      complaints &&
      isAssignedTab &&
      ((resolved && complaints?.totalCount !== count.resolved) ||
        (!resolved && complaints?.totalCount !== count.pending)) &&
      Object.keys(customFilters).length === 0 &&
      Object.keys(searchParams.search).length === 0
    ) {
      let updatedCount = {};
      if (resolved) {
        updatedCount = {
          ...count,
          resolved: complaints?.totalCount,
        };
      } else {
        updatedCount = {
          ...count,
          pending: complaints?.totalCount,
        };
      }
      setCount(updatedCount);
      PersistantStorage.set("grm_count", updatedCount);
    }
  }, [complaints?.totalCount]);

  useEffect(() => {
    if (
      showcauseCount &&
      Object.keys(customFilters).length === 0 &&
      Object.keys(searchParams.search).length === 0
    ) {
      const updatedCount = { ...count, ...showcauseCount };
      setCount(updatedCount);
      PersistantStorage.set("grm_count", updatedCount);
    }
  }, [showcauseCount]);

  const slaOptions = [
    { title: "GRM_0_DAYS", value: 0 },
    { title: "GRM_1_DAYS", value: 1 },
    { title: "GRM_2_DAYS", value: 2 },
    { title: "GRM_3_DAYS", value: 3 },
    { title: "GRM_4_DAYS", value: 4 },
    { title: "GRM_5_DAYS", value: 5 },
    { title: "GRM_6_DAYS", value: 6 },
    { title: "GRM_7_DAYS", value: 7 },
  ];

  return (
    <Container variant="white">
      {localizationLoading ? (
        <Box className="flex items-center justify-center h-96">
          <CircularProgress color="success" />
        </Box>
      ) : (
        <Box className="inbox-page-layout">
          <Box className="breadcrumbs-container mb-[24px]">
            <BasicBreadcrumbs />
          </Box>
          <Container variant="tertiaryGreen" className="inbox-page-container">
            <Typography variant="h2" className="agent-grm-card-header">
              {t("DFSWEB_GRM")}
            </Typography>
            <Box className="white-bg-container">
              <Box className="tabs-search-container">
                <Box className="complaint-tabs-container">
                  {isSaoUser ? (
                    <Box className={`complaints-count-tab`}>
                      <Typography variant="h5" className="tab-header">
                        {resolved
                          ? t("GRM_VERIFICATION_SUBMITTED")
                          : t("GRM_ASSIGNED_FOR_VERIFICATION")}{" "}
                        : {(resolved ? count.resolved : count.pending) || "0"}
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Box
                        className={`complaints-count-tab ${
                          section === "assigned" ? "" : "opacity-50"
                        }`}
                        onClick={() => handleSectionChange("assigned")}
                      >
                        <Typography variant="h5" className="tab-header">
                          {resolved ? t("GRM_RESOLVED") : t("GRM_PENDING")}{" "}
                          {t("GRM_CASES")} :{" "}
                          {(resolved ? count.resolved : count.pending) || "0"}
                        </Typography>
                      </Box>
                      {!isSupportUser && false && (
                        <Box
                          className={`complaints-count-tab ${
                            section === "showcause" ? "" : "opacity-50"
                          }`}
                          onClick={() => handleSectionChange("showcause")}
                        >
                          <Typography variant="h5" className="tab-header">
                            {t("GRM_SHOW_CAUSE_NOTICES")} :{" "}
                            {(defaultShowcauseFilter === "issuedBy" ||
                            issuedByMe
                              ? count?.issuedBy
                              : count?.issuedTo) || "0"}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
                <Box>
                  <Paper component="form" className="complaint-search-bar">
                    <IconButton
                      type="button"
                      sx={{ p: "10px" }}
                      aria-label="search"
                      onClick={onSearch}
                      disabled={!searchInput}
                      color="inherit"
                    >
                      <SearchIcon />
                    </IconButton>
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder={t("GRM_SEARCH_PLACEHOLDER")}
                      inputProps={{ "aria-label": "search By Ticket No" }}
                      onChange={handleSearchInput}
                      onKeyDown={handleKeyPress}
                      value={searchInput}
                    />
                  </Paper>
                </Box>
              </Box>
              <Grid container sx={{ mt: 1 }}>
                {!resolved && !isSaoUser && (
                  <Grid item xs={12} sm={6} md={4} lg={3} mb={1}>
                    <CustomDropdown
                      multiple
                      id="days-remaining-filter"
                      options={slaOptions}
                      size="small"
                      disableCloseOnSelect
                      onChange={(event, newValue) =>
                        handleSlaDropdownChange(newValue)
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      value={customFilters?.slaDaysLeft || []}
                      getOptionLabel={(option) => t(option.title)}
                      renderOption={(props, option, { selected }) => {
                        const { key, ...optionProps } = props;
                        return (
                          <li key={key} {...optionProps}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 5 }}
                              checked={selected}
                              color="success"
                            />
                            {t(option.title)}
                          </li>
                        );
                      }}
                      style={{ marginRight: 10 }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("GRM_DAYS_REMAINING_TO_REPLY")}
                          placeholder={t("GRM_SELECT")}
                        />
                      )}
                      disabled={resolved}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6} md={2.5} lg={3} mb={1}>
                  <Box mr={"10px"}>
                    <CustomDatePicker
                      placeholder={t("GRM_FROM_DATE")}
                      customFilters={customFilters}
                      setCustomFilters={setCustomFilters}
                      label={"fromDate"}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={2.5} lg={3} mb={1}>
                  <Box mr={"10px"}>
                    <CustomDatePicker
                      placeholder={t("GRM_TO_DATE")}
                      customFilters={customFilters}
                      setCustomFilters={setCustomFilters}
                      label={"toDate"}
                    />
                  </Box>
                </Grid>
                {(resolved || isSaoUser) && (
                  <Grid item xs={12} sm={6} md={4} lg={3} mb={1}></Grid>
                )}
                <Grid item xs={12} sm={6} md={3} lg={3} mb={1}>
                  <CustomButton
                    sx={{ mr: 1 }}
                    state={
                      disableCustomSearch
                        ? ButtonState.DISABLED
                        : ButtonState.ENABLED
                    }
                    onClick={() => handleCustomSearch()}
                  >
                    {t("COMMON_SEARCH")}
                  </CustomButton>
                  <CustomButton
                    color={ButtonColor.SECONDARY}
                    onClick={resetCustomFilters}
                    state={
                      Object.keys(customFilters).length === 0 &&
                      Object.keys(searchParams.customFilters).length === 0
                        ? ButtonState.DISABLED
                        : ButtonState.ENABLED
                    }
                  >
                    {t("COMMON_RESET")}
                  </CustomButton>
                </Grid>
              </Grid>
            </Box>
            <Box className="filters-container white-bg-container">
              <Box className="table-filters">
                {isAssignedTab ? (
                  <Box className="flex gap-4">
                    <CustomTableFilterButton
                      onClick={handlePendingFilter}
                      testid="pending-button"
                      title="GRM_PENDING"
                      t={t}
                      pending={true}
                      active={!resolved}
                    />
                    {userParams.additionalFilters.map((item) => (
                      <CustomTableFilterButton
                        onClick={() => handleResolvedFilter(item)}
                        testid={`${item.key}-button`}
                        key={item.key}
                        active={searchParams.applicationStatus?.includes(
                          item.key
                        )}
                        title={item.value}
                        t={t}
                      />
                    ))}
                  </Box>
                ) : (
                  <>
                    {Object.entries(userShowcauseFilters).map(
                      ([key, value]) => (
                        <Box
                          className={`table-filter ${
                            key !== searchParams.applicationStatus &&
                            "opacity-50"
                          }`}
                          onClick={() => handleShowcauseFilter(key)}
                          data-testid={`${key}-button`}
                          key={key}
                        >
                          {t(value)}
                        </Box>
                      )
                    )}
                  </>
                )}
                <Box className="table-filter">
                  {t("GRM_SORT_BY")} :
                  <FormControl variant="standard" sx={{ ml: 1, minWidth: 100 }}>
                    <BootstrapInput
                      labelId="sort by select"
                      id="sort by select"
                      label="Sort by"
                      value={searchParams.sortOrder || "none"}
                      defaultValue={"none"}
                      onChange={(event) => {
                        setSearchParams({
                          ...searchParams,
                          sortOrder: event.target.value,
                        });
                      }}
                      sx={{
                        "&:before, &:after": {
                          borderBottom: "none",
                        },
                        "&:hover:before, &:hover:after": {
                          borderBottom: "none",
                        },
                      }}
                    >
                      <MenuItem value={"DESC"}>{t("GRM_SORT_NEWEST")}</MenuItem>
                      <MenuItem value={"ASC"}>{t("GRM_SORT_OLDEST")}</MenuItem>
                    </BootstrapInput>
                  </FormControl>
                </Box>
                <IconButton onClick={handleRefresh}>
                  <RefreshIcon
                    color="success"
                    sx={{
                      transform: `rotate(${rotation}deg)`,
                      transition: "transform 1s ease",
                    }}
                  />
                </IconButton>
              </Box>
            </Box>
            <Box className="table-container">
              <ComplaintsTable
                section={section}
                complaints={inboxData}
                isLoading={isLoading}
                searchParams={searchParams}
                resolved={resolved}
                isSaoUser={isSaoUser}
                isSupportUser={isSupportUser}
              />

              <Box className="complaints-pagination">
                {
                  <Typography color={"#B5B7C0"}>
                    {getCountText(inboxData, totalCount)}
                  </Typography>
                }
                <Pagination
                  count={Math.ceil(totalCount / pageSize)}
                  page={pageOffset / pageSize + 1}
                  shape="rounded"
                  color="success"
                  onChange={handleChangePage}
                />
              </Box>
            </Box>
          </Container>
        </Box>
      )}
    </Container>
  );
}

export default ComplaintsInbox;
