import React, { useEffect, useMemo, useState } from "react";
import AppliedSchemesGrid from "./AppliedSchemesGrid";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
import { Box, Container } from "@mui/material";
import SearchBar from "../../components/SearchBar";
import CustomDropdown from "../../components/DropDownComponent";
import { useAppliedSchemes } from "../../Hooks/useAppliedSchemes";

// filter options for schemes
const options = [
  { id: "all", value: "Applied" },
  { id: "approved", value: "ACCEPTED" },
  { id: "rejected", value: "REJECTED" },
  { id: "failed", value: "FAILED" },
  { id: "submitted successfully", value: "SUBMITTED_SUCCESSFULLY" },
  { id: "in process", value: "REQUEST_IN_PROCESS" },
];
const statusMap = {
  approved: ["ACCEPTED", "APPROVED"],
  rejected: ["REJECTED"],
  failed: ["SUBMISSION_ERROR", "SYSTEM_ERROR", "FAILED"],
  "submitted successfully": ["SUBMITTED_SUCCESSFULLY"],
  "in process": ["IN_SUBMISSION","REQUEST_IN_PROCESS"],
};
const sortOptions = [
  { id: "default", value: "schemes.default" },
  { id: "latest", value: "schemes.latest" },
  { id: "ascending", value: "schemes.sortAlphAsc" },
  { id: "descending", value: "schemes.sortAlphDesc" },
];

const AppliedSchemeList = ({
  data,
  minHeight = "550px",
  itemsPerPage,
  page,
  handlePage,
  handlePageCount,
  isMobile,
}) => {
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: schemes, isLoading, error } = useAppliedSchemes();

  const normalizedQuery = searchQuery.trim().toLowerCase();

  // 1) Find all data entries whose title-en or title-hi matches
  const matchingIdSet = useMemo(() => {
    if (!normalizedQuery) return new Set();

    const ids = data
      .filter((item) => {
        const en = (item.schemeName?.["title-en"] || "").toLowerCase();
        const hi = (item.schemeName?.["title-hi"] || "").toLowerCase();
        return en.includes(normalizedQuery) || hi.includes(normalizedQuery);
      })
      .map((item) => item.id);

    return new Set(ids);
  }, [data, normalizedQuery]);

  const filterSchemes = (schemes, activeTab, query) => {
    if (!schemes || schemes.length === 0) return [];
    let filtered = schemes;

    if (activeTab !== "all") {
      const statuses = statusMap[activeTab];
      if (statuses) {
        filtered = filtered.filter((scheme) => statuses.includes(scheme.status));
      }
    }

    if (normalizedQuery) {
      filtered = filtered.filter((scheme) => matchingIdSet.has(scheme?.mdmsId));
    }

    return filtered;
  };

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [active, setActive] = useState("all");
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [sortMethod, setSortMethod] = useState("default");

  useEffect(() => {
    let filtered = filterSchemes(schemes, active, searchQuery);
    filtered = sortSchemes(filtered, sortMethod);
    setIsTransitioning(true);
    setTimeout(() => {
      setFilteredSchemes(filtered);
      const newPageCount = Math.ceil(filtered.length / itemsPerPage);
      handlePageCount(newPageCount);
      handlePage(1);

      setIsTransitioning(false);
    }, 300);
  }, [schemes, active, sortMethod, itemsPerPage, searchQuery]);

  const sortSchemes = (schemes, method) => {
    const language = i18n.language === "hi_IN" ? "hi" : "en";
    const getSortValue = (scheme) => {
      if (!scheme) {
        console.warn("Encountered undefined scheme object during sorting");
        return "";
      }
      return t(
        scheme.schemeApplication.schemeName
      );
    };

    const compareStrings = (a, b) => {
      const language = i18n.language;
      const options = { numeric: true, sensitivity: "base" };

      if (language === "hi") {
        return a.localeCompare(b, "hi-IN-u-co-standard", options);
      } else {
        return a.localeCompare(b, undefined, options);
      }
    };

    try {
      switch (method) {
        case "ascending":
          return [...schemes].sort((a, b) =>
            compareStrings(getSortValue(a), getSortValue(b))
          );
        case "descending":
          return [...schemes].sort((a, b) =>
            compareStrings(getSortValue(b), getSortValue(a))
          );
        case "latest":
          return [...schemes].sort((a, b) => {
            if (a.isApplyEnabled && !b.isApplyEnabled) return -1;
            if (!a.isApplyEnabled && b.isApplyEnabled) return 1;

            const dateA = a.startDate ? parseInt(a.startDate) : 0;
            const dateB = b.startDate ? parseInt(b.startDate) : 0;
            return dateB - dateA;
          });
        default:
          return [...schemes].sort((a, b) => {
            if (a.isApplyEnabled && !b.isApplyEnabled) return -1;
            if (!a.isApplyEnabled && b.isApplyEnabled) return 1;
            const endDateA = a.endDate
              ? new Date(a.endDate).getTime()
              : Infinity;
            const endDateB = b.endDate
              ? new Date(b.endDate).getTime()
              : Infinity;

            return endDateA - endDateB;
          });
      }
    } catch (error) {
      console.error("Error occurred while sorting schemes:", error);
      return schemes; // Return unsorted schemes in case of error
    }
  };
  const paginatedSchemes = filteredSchemes?.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleFilter = (selectedId) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActive(selectedId);
      handlePage(1);
      setIsTransitioning(false);
    }, 300);
  };

  const handleSort = (selectedId) => {
    setSortMethod(selectedId);
  };

  const dataDictionary = useMemo(() => {
    return (
      data?.reduce((dict, item) => {
        dict[item.id] = item;
        return dict;
      }, {}) || {}
    );
  }, [data]);

  return (
    <Box className="w-full flex flex-col flex-grow gap-y-3 sm:gap-y-10">
      {/* Filters */}
      <Container
        variant="tertiaryGreen"
        className="schemes-filter-container"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          padding: { xs: "16px", md: "24px" },
          // backgroundColor: "#F0F5F2",
          borderRadius: "12px",
          minWidth: { xs: "300px" },
        }}
      >
        <Box
          className="schemes-filter-sort-box"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            width: "100%",
            mb: { xs: 2, md: 0 },
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "48%" }, mb: { xs: 0, sm: 0 } }}>
            <CustomDropdown
              label="schemes.filterBy"
              options={options}
              onChange={handleFilter}
              prefilledValue="all"
            />
          </Box>
          <Box sx={{ width: { xs: "100%", md: "48%" } }}>
            <CustomDropdown
              label="schemes.sortBy"
              options={sortOptions}
              onChange={handleSort}
              prefilledValue="default"
            />
          </Box>
        </Box>
        <Box
          className="search-bar-container"
          sx={{
            width: { xs: "100%", sm: "auto", md: "30%" },
            mt: { xs: 2, md: 0 },
            display: "flex",
            justifyContent: "center",
            marginLeft: "10px",
          }}
        >
          <SearchBar setSearchQuery={setSearchQuery} />
        </Box>
      </Container>
      <Box className="schemes-content">
        <TransitionBox
          className={
            isTransitioning
              ? "fade-exit fade-exit-active"
              : "fade-enter fade-enter-active"
          }
        >
          <Box sx={{ minHeight: `${minHeight} !important` }}>
            <AppliedSchemesGrid
              isMobile={isMobile}
              data={paginatedSchemes}
              schemeData={dataDictionary}
            />
          </Box>
        </TransitionBox>
      </Box>
    </Box>
  );
};

export default AppliedSchemeList;

const TransitionBox = styled(Box)`
  transition: opacity 0.2s ease-in-out, transform 0.3s ease-in-out;
  &.fade-enter {
    opacity: 0;
    transform: translateY(20px);
  }
  &.fade-enter-active {
    opacity: 1;
    transform: translateY(0);
  }
  &.fade-exit {
    opacity: 1;
    transform: translateY(0);
  }
  &.fade-exit-active {
    opacity: 0;
    transform: translateY(-20px);
  }
`;
