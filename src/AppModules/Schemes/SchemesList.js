import { Box, Container, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import CustomDropdown from "../../components/DropDownComponent";
import { useTranslation } from "react-i18next";
import SchemesGrid from "./SchemesGrid";
import { styled } from "@mui/material/styles";

export const SchemesList = ({
  data,
  isSchemesPage,
  minHeight = "1125px",
  itemsPerPage,
  page,
  handlePage,
  handlePageCount,
  isMobile,
}) => {
  const { t, i18n } = useTranslation();
  const schemes = data;

  const [searchQuery, setSearchQuery] = useState("");
  const options = [
    { id: "all", value: "allSchemes" },
    { id: "state", value: "schemesState" },
    { id: "centrally_sponsored", value: "schemesSponsored" },
    { id: "central", value: "schemesCentral" },
    { id: "open", value: "schemes.open" },
    { id: "closed", value: "schemes.closed" },
    { id: "Directorate of Agriculture", value: "AGRICULTURE" },
    { id: "Directorate of Horticulture", value: "HORTICULTURE" },
    { id: "Directorate of Soil Conservation", value: "SOIL_CONSERVATION" },
    // { id: "new", value: "schemes.new" },
  ];

  const sortOptions = [
    { id: "default", value: "schemes.default" },
    { id: "latest", value: "schemes.latest" },
    { id: "ascending", value: "schemes.sortAlphAsc" },
    { id: "descending", value: "schemes.sortAlphDesc" },
  ];

  const filterSchemes = (schemes, activeTab, query) => {
    if (!schemes || schemes.length === 0) return [];
    let filtered = schemes;
    if (activeTab === "all") {
      // Do nothing; already all schemes
    } else if (
      ["state", "centrally_sponsored", "central"].includes(activeTab)
    ) {
      filtered = filtered.filter((scheme) => scheme.schemeLevel === activeTab);
    } else if (activeTab === "open") {
      filtered = filtered.filter((scheme) => scheme.isApplyEnabled);
    } else if (activeTab === "closed") {
      filtered = filtered.filter((scheme) => !scheme.isApplyEnabled);
    } else if (
      [
        "Directorate of Agriculture",
        "Directorate of Horticulture",
        "Directorate of Soil Conservation",
      ].includes(activeTab)
    ) {
      filtered = filtered.filter((scheme) => {
        const subDeptName = t(scheme.subDepartmentName[`en`]); // Use `hi` if needed
        return subDeptName === activeTab;
      });
    }
    if (query) {
      const lowerQuery = query.toLowerCase();

      filtered = filtered.filter((scheme) => {
        const nameEn = t(
          scheme.schemeName["title-en"] || scheme.schemeName["title"]
        );
        const nameHi = t(
          scheme.schemeName["title-hi"] || scheme.schemeName["title"]
        );

        return (
          nameEn.toLowerCase().includes(lowerQuery) ||
          nameHi.toLowerCase().includes(lowerQuery)
        );
      });
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
      if (isSchemesPage) {
        handlePageCount(newPageCount);
        handlePage(1);
      }
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
        scheme.schemeName[`title-${language}`] || scheme.schemeName[`title`]
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

  const paginatedSchemes = filteredSchemes.slice(
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

  return (
    <Box className="w-full flex flex-col flex-grow gap-y-3 sm:gap-y-10">
      {!isSchemesPage &&<Box className="header-container !items-start sm:items-center">
        <Typography
          className="!font-bold sm:text-center"
          variant={isMobile ? "h6" : "h1"}
          sx={{
            ...(isMobile
              ? { margin: 0 }
              : { margin: "0px auto 0px auto" }),
          }}
        >
          {t("schemes.schemesForFarmers")}
        </Typography>
      </Box>}
      {isSchemesPage && (
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
            <Box
              sx={{ width: { xs: "100%", md: "48%" }, mb: { xs: 0, sm: 0 } }}
            >
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
      )}

      <Box className="schemes-content">
        <TransitionBox
          className={
            isTransitioning
              ? "fade-exit fade-exit-active"
              : "fade-enter fade-enter-active"
          }
        >
          <Box sx={{ minHeight: `${minHeight} !important` }}>
            <SchemesGrid
              data={
                isSchemesPage
                  ? paginatedSchemes
                  : isMobile
                  ? filteredSchemes.slice(0, 2)
                  : filteredSchemes.slice(0, 8)
              }
              isSchemesPage={isSchemesPage}
              isMobile={isMobile}
            />
          </Box>
        </TransitionBox>
      </Box>
    </Box>
  );
};
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
