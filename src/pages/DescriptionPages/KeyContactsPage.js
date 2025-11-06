import {
  Box,
  Container,
  Divider,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import { useTranslation } from "react-i18next";
import ContactCard from "../MainLandingPage/Components/ContactCard";
import ContactsIcon from "@mui/icons-material/Contacts";
import SearchBar from "../../components/SearchBar";
import CustomPagination from "../../components/CustomPagination";
import { ThemeContext } from "../../theme";
import { useFileStoreData } from "../../Hooks/useFileStoreData";

function KeyContactsPage({ isHomepage = true, isMobile }) {
  const { t, i18n } = useTranslation();

  const itemsPerPage = 10;

  const [language, setLanguage] = useState(
    i18n.language === "en_IN" ? "en" : "hi"
  );
  useEffect(() => {
    setLanguage(i18n.language === "en_IN" ? "en" : "hi");
  }, [i18n.language]);

  const jsonUrl =
    "https://filestoragedfs.blob.core.windows.net/publicresources/json/AssistedMode/allContacts.json";
  const { data, isLoading, error, isSuccess } = useFileStoreData({
    url: jsonUrl,
    key: "allContacts",
  });
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    filterAndPaginateData();
  }, [searchQuery, isSuccess]);

  useEffect(() => {
    paginateData();
  }, [page]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setPageCount(Math.ceil(filteredData.length / itemsPerPage));
    let k = itemsPerPage;
    if (k > filteredData.length) {
      k = filteredData.length;
    }
    setPaginatedData(filteredData.slice(0, k));
  }, [filteredData]);

  const filterAndPaginateData = () => {
    let filtered = data?.["contacts"]?.filter((contact) => {
      return (
        contact?.name?.en
          ?.toLowerCase()
          ?.includes(searchQuery?.toLowerCase()) ||
        contact?.name?.hi?.includes(searchQuery?.toLowerCase()) ||
        contact?.position?.en
          ?.toLowerCase()
          .includes(searchQuery?.toLowerCase()) ||
        contact?.position?.hi?.includes(searchQuery?.toLowerCase()) ||
        contact?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    });
    setFilteredData(filtered ?? []);
  };

  const paginateData = () => {
    let k = itemsPerPage;
    if (k > filteredData.length) {
      k = filteredData.length;
    }
    const paginatedDataTemp = filteredData.slice(
      (page - 1) * itemsPerPage,
      (page - 1) * itemsPerPage + k
    );
    setPaginatedData(paginatedDataTemp);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };
  const { ourTheme } = useContext(ThemeContext);
  useEffect(() => {
    // Set the theme class on the body element
    document.body.classList.toggle("light-theme", ourTheme === "light");
    document.body.classList.toggle("dark-theme", ourTheme === "dark");
  }, [ourTheme]);

  if (isLoading)
    return [1, 2].map((index) => (
      <Box key={index} mb={2}>
        <Skeleton variant="rectangular" height={50} width="100%" />
        <Skeleton variant="text" width="100%" height={30} />
        <Divider />
      </Box>
    ));

  let component = (
    <Grid container spacing={3} sx={{ alignContent: "center" }}>
      <Grid item xs={12} sm={12}>
        <Box className="contacts-page-header">
          <Box className="contacts-icon-wrapper">
            <ContactsIcon sx={{ mr: 2 }} />
            <Typography variant={isMobile ? "h5" : "h3"}>
              {t("KeyContacts")}
            </Typography>
          </Box>
          <Box
            className="search-bar-container flex justify-normal sm:justify-center mt-3 sm:mt-0"
            sx={{
              width: { xs: "100%", sm: "auto", md: "30%" },
            }}
          >
            <SearchBar
              setSearchQuery={setSearchQuery}
              placeholder="SearchContact"
            />
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} sm={12} className="!pt-4">
        <Box className={isHomepage ? "key-contacts-page" : ""}>
          <ContactCard
            contactList={paginatedData}
            isHomeScreen={false}
            language={language}
            t={t}
            isMobile={isMobile}
          />
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
      </Grid>
    </Grid>
  );

  if (isHomepage) {
    component = (
      <Container variant="primary" sx={{ height: "100%" }}>
        <Box
          className="key-contacts-page"
          sx={{
            pb: 5,
          }}
        >
          <Box
            className="breadcrumbs-container w-[95%] m-auto"
            sx={{ mb: 1.5 }}
          >
            <BasicBreadcrumbs />
          </Box>
          <Box className="inner-box-screen m-auto">{component}</Box>
        </Box>
      </Container>
    );
  }
  return component;
}

export default KeyContactsPage;
