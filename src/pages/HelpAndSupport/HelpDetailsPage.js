import {
  Box,
  Container,
  Drawer,
  FormControl,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import { useTranslation } from "react-i18next";
import helpData from "./HelpSupport.json";
import { useLocation } from "react-router-dom";
import { ThemeContext } from "../../theme";
import HelpSectionMDMS from "./components/HelpSectionMDMS";
import useDistrict from "../../Hooks/useDistrict";
import useDistrictBlocks from "../../Hooks/useDistrictBlocks";
import useBlockPanchayats from "../../Hooks/useBlockPanchayats";
import { CustomDropdown } from "../../AppModules/PGR/ComplaintsInbox";
import { capitalizeFirstLetter } from "../../components/Utils";
import NavigateNextSharpIcon from "@mui/icons-material/NavigateNextSharp";

function HelpDetailsPage({ isMobile }) {
  const { t } = useTranslation();
  const l = useLocation();
  const { ourTheme } = useContext(ThemeContext);
  const theme = useTheme();
  const { id } = l.state || {};

  const [selectedSection, setSelectedSection] = useState(id);
  const [selectedData, setSelectedData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  //selected filter address default patna
  const [selectedDistrict, setSelectedDistrict] = useState({
    id: 212,
    name: "PATNA",
  });
  const [selectedBlock, setSelectedBlock] = useState({
    id: 1964,
    name: "PANDARAK",
  });
  const [selectedPanchayat, setSelectedPanchayat] = useState({
    id: 99062,
    name: "LEMUABAD",
  });

  const districtRef = useRef(null);
  const blockRef = useRef(null);
  const panchayatRef = useRef(null);

  const handleClick = (id) => {
    setSelectedDistrict({
      id: 212,
      name: "PATNA",
    });
    setSelectedBlock({
      id: 1964,
      name: "PANDARAK",
    });
    setSelectedPanchayat({
      id: 99062,
      name: "LEMUABAD",
    });
    setSelectedSection(id);
  };

  const [dropdownValues, setDropdownValues] = useState({
    district: [],
    block: [],
    panchayat: [],
    village: [],
  });

  const {
    data: districtData,
    isLoading: isDistrictLoading,
    isError: isDistrictError,
  } = useDistrict("br");
  const {
    data: blockData,
    isLoading: isBlockLoading,
    isError: isBlockError,
  } = useDistrictBlocks("br", selectedDistrict?.id, {
    enabled: !!selectedDistrict?.id,
  });
  const {
    data: panchayatData,
    isLoading: isPanchayatLoading,
    isError: isPanchayatError,
  } = useBlockPanchayats("br", selectedBlock?.id, {
    enabled: !!selectedBlock?.id,
  });

  useEffect(() => {
    helpData?.help?.forEach((section) => {
      if (section.id === selectedSection) {
        setSelectedData(section);
      }
    });
  }, [selectedSection]);
  useEffect(() => {
    if (!isDistrictLoading && !isDistrictError && districtData) {
      const formattedDistricts = districtData.map((district) => ({
        id: district.code,
        name: district.name,
      }));
      setSelectedPanchayat();
      setSelectedBlock();
      setDropdownValues((prevValues) => ({
        ...prevValues,
        district: formattedDistricts,
        block: [],
        panchayat: [],
      }));
    }
  }, [isDistrictLoading, isDistrictError, districtData]);

  useEffect(() => {
    if (!isBlockLoading && !isBlockError && blockData) {
      const formattedBlocks = blockData.map((block) => ({
        id: block.code,
        name: block.name,
      }));
      setSelectedPanchayat();
      setDropdownValues((prevValues) => ({
        ...prevValues,
        block: formattedBlocks,
        panchayat: [],
      }));
    }
  }, [isBlockLoading, isBlockError, blockData]);

  useEffect(() => {
    if (!isPanchayatLoading && !isPanchayatError && panchayatData) {
      const formattedPanchayats = panchayatData.map((panchayat) => ({
        id: panchayat.code,
        name: panchayat.name,
      }));

      setDropdownValues((prevValues) => ({
        ...prevValues,
        panchayat: formattedPanchayats,
      }));
    }
  }, [isPanchayatLoading, isPanchayatError, panchayatData]);

  const handleChange = (value, key) => {
    if (key === "district") {
      setSelectedDistrict(value);
      setSelectedBlock(null);
      setSelectedPanchayat(null);
    } else if (key === "block") {
      setSelectedBlock(value);
      setSelectedPanchayat(null);
    } else if (key === "panchayat") {
      setSelectedPanchayat(value);
    }
  };

  useEffect(() => {
    if (selectedData?.filters?.includes("district") && districtRef.current) {
      districtRef.current.focus();
    } else if (selectedData?.filters?.includes("block") && blockRef.current) {
      blockRef.current.focus();
    } else if (
      selectedData?.filters?.includes("panchayat") &&
      panchayatRef.current
    ) {
      panchayatRef.current.focus();
    }
  }, [selectedData?.filters]);

  const categoriesRenderer = ({ isDrawer }) => {
    return (
      <>
        <Typography
          variant="h5"
          paddingBottom="24px"
          className="!font-semibold"
          textAlign={isDrawer ? "center" : "left"}
        >
          {t("Categories")}
        </Typography>
        <List
          className="sticky top-0 !pt-0"
          sx={{ position: "sticky", top: 0 }}
        >
          {helpData?.help?.map((section, index) => (
            <ListItem
              button
              key={section.id}
              selected={section.id === selectedSection}
              sx={{
                backgroundColor:
                  section.id === selectedSection
                    ? ourTheme === "dark"
                      ? "rgba(133, 188, 49, 1) !important"
                      : "#1A5C4B !important"
                    : "transparent",
                borderRadius: "4px",
                color:
                  section.id === selectedSection
                    ? ourTheme === "light"
                      ? "white"
                      : "black"
                    : theme.palette.text.primary,
                "&:hover": {
                  backgroundColor:
                    section.id === selectedSection
                      ? theme.palette.mode === "dark"
                        ? "#1A5C4B"
                        : "#D1E7DD"
                      : theme.palette.action.hover,
                },
              }}
              onClick={() => {
                handleClick(section.id);
                if (isDrawer) setAnchorEl(null);
              }}
              secondaryAction={
                section.id === selectedSection && (
                  <NavigateNextSharpIcon
                    sx={{
                      color: theme.palette.text.white,
                    }}
                  />
                )
              }
            >
              <ListItemText
                primary={t(section.title)}
                className="!font-semibold"
              />
            </ListItem>
          ))}
        </List>
      </>
    );
  };

  return (
    <Container variant="primary">
      <Box className="assets-page">
        <Box className=" !pb-10">
          <Box className="breadcrumbs-container" sx={{ pb: 1.5 }}>
            <BasicBreadcrumbs />
          </Box>
          <Box className="header-help-details-page">
            <Box className="flex justify-between max-sm:w-full items-center">
              <Typography
                className="scheme-header-name"
                variant={isMobile ? "h5" : "h1"}
                sx={{
                  whiteSpace: "noWrap",
                }}
              >
                {t("DFSWEB_HELP")}
              </Typography>
              {isMobile && (
                <Box className="help-mobile-filter-container">
                  <img
                    src={`${window.contextPath}/assets/filters-icon.svg`}
                    alt="filters"
                    className="ml-2 image-filter-invert"
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                  />
                </Box>
              )}
            </Box>
            <Box className="search-bar-container-help">
              {selectedData?.filters?.includes("district") && (
                <Box className="mandi-price-filter-item">
                  <FormControl sx={{ minWidth: "180px", width: "100%" }}>
                    <Typography className="mandi-filter-label">
                      {t("COMMON_DISTRICT")}
                    </Typography>
                    <CustomDropdown
                      id="district-autocomplete"
                      options={dropdownValues.district}
                      getOptionLabel={(option) =>
                        capitalizeFirstLetter(option.name || "")
                      }
                      value={selectedDistrict}
                      onChange={(event, newValue) =>
                        handleChange(newValue, "district")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={t("COMMON_SELECT")}
                          inputRef={districtRef}
                        />
                      )}
                      size="small"
                      openOnFocus
                      isOptionEqualToValue={(option, value) =>
                        option.id === value?.id
                      }
                    />
                  </FormControl>
                </Box>
              )}
              {selectedData?.filters?.includes("block") && (
                <Box className="mandi-price-filter-item">
                  <FormControl sx={{ minWidth: "180px", width: "100%" }}>
                    <Typography className="mandi-filter-label">
                      {t("COMMON_BLOCK")}
                    </Typography>
                    <CustomDropdown
                      id="block-autocomplete"
                      options={dropdownValues.block}
                      getOptionLabel={(option) =>
                        capitalizeFirstLetter(option.name || "")
                      }
                      value={selectedBlock}
                      onChange={(event, newValue) =>
                        handleChange(newValue, "block")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={t("COMMON_SELECT")}
                          inputRef={blockRef}
                        />
                      )}
                      size="small"
                      openOnFocus
                      isOptionEqualToValue={(option, value) =>
                        option.id === value?.id
                      }
                    />
                  </FormControl>
                </Box>
              )}
              {selectedData?.filters?.includes("panchayat") && (
                <Box className="mandi-price-filter-item">
                  <FormControl sx={{ minWidth: "180px", width: "100%" }}>
                    <Typography className="mandi-filter-label">
                      {t("COMMON_VILLAGE_PANCHAYAT")}
                    </Typography>
                    <CustomDropdown
                      id="panchayat-autocomplete"
                      options={dropdownValues.panchayat}
                      getOptionLabel={(option) =>
                        capitalizeFirstLetter(option.name || "")
                      }
                      value={selectedPanchayat}
                      onChange={(event, newValue) =>
                        handleChange(newValue, "panchayat")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={t("COMMON_SELECT")}
                          inputRef={panchayatRef}
                        />
                      )}
                      size="small"
                      openOnFocus
                      isOptionEqualToValue={(option, value) =>
                        option.id === value?.id
                      }
                    />
                  </FormControl>
                </Box>
              )}
              <Box className="help-location-filter-container">
                {selectedData?.filters?.includes("district") &&
                  selectedDistrict != null && (
                    <Box className="pin-locationStyle">
                      <img
                        src={`${window.contextPath}/assets/distance.svg`}
                        style={{
                          filter: ourTheme === "light" ? "" : "invert(1)",
                        }}
                        alt="Distance"
                      />
                      <Typography variant="body1" className="!font-semibold">
                        {capitalizeFirstLetter(selectedDistrict?.name)}
                      </Typography>
                    </Box>
                  )}
              </Box>
            </Box>
          </Box>
          <Box className="text-box-screen-reader">
            <Grid
              container
              columnSpacing={2}
              gap={{ xs: "1rem", md: "0" }}
              marginLeft={{ xs: "-8px", sm: "-4px" }}
              paddingInline="8px"
            >
              {/* filter left side  */}
              {isMobile ? (
                <Drawer
                  anchor="bottom"
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                  className="custom-mobile-drawer"
                >
                  {categoriesRenderer({ isDrawer: true })}
                </Drawer>
              ) : (
                <Grid
                  item
                  xs={12}
                  md={4}
                  backgroundColor={theme.palette.background.tertiaryGreen}
                  className="filter-box-style"
                >
                  <> {categoriesRenderer({ isDrawer: false })}</>
                </Grid>
              )}
              {/* help right side  */}
              <Grid
                item
                xs={12}
                md={8}
                sx={{
                  paddingLeft: { xs: "0px !important", sm: "16px !important" },
                }}
              >
                <Box className="main-assets-container" height="100%">
                  <Box className="section-heading-container">
                    <img
                      src={`${window.contextPath}/assets/light/${selectedData["image-detail"]}`}
                      alt="Category"
                      className="image-header"
                    />
                    <Typography
                      variant={isMobile ? "h6" : "h3"}
                      sx={{ fontWeight: 700, overflowWrap: "anywhere" }}
                    >
                      {t(selectedData.title)}
                    </Typography>
                  </Box>

                  <HelpSectionMDMS
                    selectedData={selectedData}
                    selectedDistrict={selectedDistrict}
                    selectedSection={selectedSection}
                    setSelectedDistrict={setSelectedDistrict}
                    selectedBlock={selectedBlock}
                    selectedPanchayat={selectedPanchayat}
                    t={t}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default HelpDetailsPage;
