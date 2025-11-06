import React, { useEffect, useState } from "react";
import useSchemesData from "../../Hooks/useSchemesData";
import { styled } from "@mui/material/styles";
import { Box, Typography, Pagination, Container, Tabs, Tab } from "@mui/material";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import { useTranslation } from "react-i18next";
import { SchemesList } from "./SchemesList";
import CustomPagination from "../../components/CustomPagination";
import AppliedSchemeList from "./AppliedSchemeList";

function SchemePage({ isMobile }) {
  let { data: schemes, isLoading, refetch } = useSchemesData({});
  const isCitizen = localStorage.getItem("DfsWeb.isCitizenUser") === "true";
  const { t } = useTranslation();
  const [showAppliedSchemes, setShowAppliedSchemes] = useState(false);
  const [page, setPage] = React.useState(1);
  const itemsPerPage = showAppliedSchemes ? 4:10;
  const [pageCount, setPageCount] = useState(
    Math.ceil(schemes?.length / itemsPerPage)
  );

  const handleChangePage = (value) => {
    setPage(value);
  };
  return (
    <Container variant="primary">
      <Box className="schemes-page">
        <Box sx={{ flexGrow: 1 }}>
          <Box className="breadcrumbs-container">
            <BasicBreadcrumbs />
          </Box>
          <Box className="header-container !items-start sm:items-center mb-11">
            <Typography
              className="!font-bold sm:text-center"
              variant={isMobile ? "h5" : "h1"}
              sx={{marginTop: "24px"}}
            >
              {t("schemes.schemesForFarmers")}
            </Typography>
          </Box>
          {isCitizen && <SchemeTabs setShowAppliedSchemes={setShowAppliedSchemes}/>}
          {showAppliedSchemes ? <AppliedSchemeList data={schemes}
            page={page}
            handlePageCount={setPageCount}
            handlePage={setPage}
            itemsPerPage={itemsPerPage}
            isMobile={isMobile}/> : <SchemesList
            data={schemes}
            isSchemesPage={true}
            page={page}
            handlePageCount={setPageCount}
            handlePage={setPage}
            itemsPerPage={itemsPerPage}
            isMobile={isMobile}
          />}
        </Box>
        <Box className="pagination-container">
          <Typography>
            {t("schemes.paginationTitle", { count: itemsPerPage })}
          </Typography>
          <CustomPagination
            t={t}
            pageCount={pageCount}
            page={page}
            onChange={handleChangePage}
          />
        </Box>
      </Box>
    </Container>
  );
}

export default SchemePage;

const SchemeTabs = ({ setShowAppliedSchemes }) => {
  const {t} = useTranslation();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setShowAppliedSchemes(newValue === 1);
  };

  return (
    <Box
      sx={{
        paddingBottom: "1.5rem",
      }}
    >
      <Box
        sx={{
          width: "100%",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tabs value={value} onChange={handleChange} textColor="inherit">
          <Tab
            label={t("All_Schemes")}
            sx={{ fontWeight: value === 0 ? "bold" : "normal" }}
          />
          <Tab
            label={t("Applied_Schemes")}
            sx={{ fontWeight: value === 1 ? "bold" : "normal" }}
          />
        </Tabs>
      </Box>
    </Box>
  );
};
