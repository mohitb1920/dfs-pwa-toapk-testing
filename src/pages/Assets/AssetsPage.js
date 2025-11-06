import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAssetsData } from "../../Hooks/useAssets";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  Drawer,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AssetsDetailCard from "./Components/AssetsDetailCard";
import { AssetsService } from "../../services/AssetsService";
import CustomPagination from "../../components/CustomPagination";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import {
  AssetsCardLoader,
  AssetsCategoryBarLoader,
  AssetsHeaderLoader,
} from "./loader/AssetsCardLoader";
function AssetsPage({ isMobile }) {
  const l = useLocation();
  const queryParams = new URLSearchParams(l.search);
  const cat = queryParams.get("cat");
  const catId = queryParams.get("catId");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [language, setLanguage] = useState(
    i18n.language == "en_IN" ? "en" : "hi"
  );
  const itemsPerPage = 10;
  const tenantId = "br";
  const location = JSON.parse(localStorage.getItem("DfsWeb.locationData"));
  const [category, setCategory] = useState(
    cat ?? localStorage.getItem("assetsSuperCategoryCode")
  );
  const [categoryId, setCategoryId] = useState(
    catId ?? localStorage.getItem("assetsCategorycode")
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHeaderLoading, setIsHeaderLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  let { data: categories, isLoading: loading } = useAssetsData({ language });

  useEffect(() => {
    setLanguage(i18n.language == "en_IN" ? "en" : "hi");
  }, [i18n.language]);

  // assign category name and selected category
  useEffect(() => {
    if (categories != null) {
      setIsHeaderLoading(true);
      categories?.some((data) => {
        if (category == null || category == data.superCategoryCode) {
          return data?.subCategories?.some((d) => {
            if (categoryId == null || categoryId == d.categorycode) {
              setSelectedCategory(d);
              setCategory(data.superCategoryCode);
              localStorage.setItem(
                "assetsSuperCategoryCode",
                data.superCategoryCode
              );
              setCategoryId(d.categorycode);
              localStorage.setItem("assetsCategorycode", d.categorycode);
              return true;
            }
            return false;
          });
        }
        return false;
      });
      setIsHeaderLoading(false);
    }
  }, [categories, category, categoryId, language]);

  //fetch category data as we change the category
  useEffect(() => {
    if (searchText == "" && categoryId != null) {
      fetchAssetsData("");
    }
  }, [pageNo, categoryId, searchText, language]);

  const fetchAssetsData = async (value) => {
    setIsLoading(true);
    //Fetch assets data
    const st = value?.length > 2 ? value : null;
    // if (st == null) setIsHeaderLoading(true);
    const response = await AssetsService.makeAssetsCall(
      tenantId,
      location?.latitude,
      location?.longitude,
      categoryId,
      st,
      itemsPerPage,
      pageNo
    );
    let assetsData = [];
    if (response.status === 200) {
      assetsData = response["data"]["Facilities"];
      setAssets(assetsData);
      setPageCount(assetsData["lastPage"] ?? 0);
    }
    // setIsHeaderLoading(false);
    setIsLoading(false);
  };

  const handleChangePage = (value) => {
    setPageNo(value);
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleCategoryChange = (category, categoryCode) => {
    setCategory(category);
    setCategoryId(categoryCode);
    setPageNo(1);
    setSearchText("");
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    setPageNo(1);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    setDebounceTimeout(
      setTimeout(() => {
        fetchAssetsData(value);
      }, 1000)
    );
  };

  function handleClick(row, categoryCode) {
    let path = `${window.contextPath}/assets-section/assets-details`;
    navigate(path, {
      state: {
        data: row,
        categoryCode: categoryCode,
        category: category,
      },
    });
  }

  const filtersRenderer = ({ isDrawer }) => {
    categories?.sort((a, b) => a.superCategoryCode - b.superCategoryCode);
    return (
      <>
        {loading && <AssetsCategoryBarLoader isDetailsPage={false} />}
        {!loading && (
          <>
            <Typography
              variant="h5"
              paddingBottom="24px"
              className="!font-semibold text-center sm:text-left"
            >
              {t("Categories")}
            </Typography>
            {categories?.map((category, index) => (
              <Accordion
                key={index}
                expanded={expanded === category.title}
                onChange={handleChange(category.title)}
                className="custom-accordion"
              >
                <AccordionSummary
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{
                        color: expanded === category.title ? "white" : null,
                      }}
                    />
                  }
                  aria-controls={`${category.title}-content`}
                  id={`${category.title}-header`}
                  className="assets-accordion-summary"
                  style={{
                    backgroundColor:
                      expanded === category.title
                        ? theme.palette.background.primaryGreen
                        : "transparent",
                    color: expanded === category.title ? "white" : null,
                    borderRadius: "8px 8px 0px 0px",
                  }}
                >
                  <Typography>{t(category?.title)}</Typography>
                </AccordionSummary>
                <AccordionDetails className="accordion-details">
                  {category?.subCategories?.length > 0 && (
                    <List>
                      {category.subCategories.map((option, idx) => (
                        <ListItem
                          button
                          style={
                            categoryId == option.categorycode
                              ? {
                                  border: "1px solid rgba(26, 92, 75, 1)",
                                }
                              : {}
                          }
                          key={idx}
                          onClick={() => {
                            if (isDrawer) setAnchorEl(null);
                            handleCategoryChange(
                              category.superCategoryCode,
                              option.categorycode
                            );
                          }}
                        >
                          {option.category}
                        </ListItem>
                      ))}
                    </List>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </>
    );
  };

  return (
    <Container variant="primary">
      <Box className="assets-page">
        <Box>
          <Box className="breadcrumbs-container" sx={{ pb: 1.5 }}>
            <BasicBreadcrumbs />
          </Box>
          <Box className="header-Assets">
            <Typography
              className="scheme-header-name"
              variant={isMobile ? "h5" : "h2"}
              sx={{
                whiteSpace: "noWrap",
              }}
            >
              {t("DFSWEB_ASSETS")}
            </Typography>
            <Box className="flex">
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder={t("SearchAssets")}
                value={searchText}
                onChange={handleSearchChange}
                className="assets-search-bar"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton edge="start" aria-label="search">
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(162, 171, 166, 1)",
                      borderRadius: "6px",
                    },
                  },
                }}
              />
              {isMobile && (
                <img
                  src={`${window.contextPath}/assets/filters-icon.svg`}
                  alt="filters"
                  className="ml-2 image-filter-invert"
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                />
              )}
            </Box>
          </Box>
          <Grid
            container
            columnSpacing={2}
            marginLeft={{ xs: "-8px", sm: "-16px" }}
            paddingInline="8px"
          >
            {/* filter left side  */}

            {!isMobile && (
              <Grid
                item
                xs={12}
                md={4}
                backgroundColor={theme.palette.background.tertiaryGreen}
                className="filter-box-style"
              >
                {filtersRenderer({ isDrawer: false })}
              </Grid>
            )}
            {/* Assets right side  */}
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                paddingLeft: { xs: "0px !important", sm: "16px !important" },
              }}
            >
              <Box className="main-assets-container" height="100%">
                {isHeaderLoading && <AssetsHeaderLoader />}
                {!isHeaderLoading && (
                  <Box className="section-heading-container">
                    <img
                      src={selectedCategory.url}
                      alt="Category"
                      className="image-header"
                    />
                    <Typography
                      variant={isMobile ? "h6" : "h3"}
                      sx={{ fontWeight: 700 }}
                    >
                      {selectedCategory.category}
                    </Typography>
                  </Box>
                )}
                {isLoading &&
                  Array.from({ length: itemsPerPage }).map((_, index) => (
                    <AssetsCardLoader isDetailsPage={false} />
                  ))}
                {!isLoading &&
                  (assets["result"] ?? []).map((category) => (
                    <div
                      tabindex="0"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleClick(category, selectedCategory.categorycode)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleClick(category, selectedCategory.categorycode);
                        }
                      }}
                    >
                      <AssetsDetailCard
                        assets={category}
                        t={t}
                        language={language}
                        latitude={location?.latitude}
                        longitude={location?.longitude}
                        categoryId={categoryId}
                        isMobile={isMobile}
                      />
                    </div>
                  ))}
                {!isLoading &&
                  (assets["result"] == null ||
                    assets["result"].length === 0) && (
                    <div className="no-Data">{t("MANDI_NO_MARKET_DATA")}</div>
                  )}
                <Box className="pagination-container">
                  <Typography>
                    {t("schemes.paginationTitle", { count: itemsPerPage })}
                  </Typography>
                  <CustomPagination
                    t={t}
                    pageCount={pageCount}
                    page={pageNo}
                    onChange={handleChangePage}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Drawer
        anchor="bottom"
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        className="custom-mobile-drawer"
      >
        {filtersRenderer({ isDrawer: true })}
      </Drawer>
    </Container>
  );
}

export default AssetsPage;
