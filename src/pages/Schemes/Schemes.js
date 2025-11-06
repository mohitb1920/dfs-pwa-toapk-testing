import {
  Avatar,
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  FormGroup,
  Popover,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import "../../styles/Schemes.css";
import { useStyles } from "../../components/Utils";
import { useTranslation } from "react-i18next";
import AllSchemes from "./AllSchemes";
import MySchemes from "./MySchemes";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const filterOptions = [
  {
    title: "schemeTypes",
    options: ["agricultureSchemes", "fisheriesSchemes", "horticultureSchemes"],
  },
  {
    title: "farmerTypes",
    options: ["small", "medium", "large"],
  },
  {
    title: "landSize",
    options: ["<2acres", "2-5acres", ">5acres"],
  },
];
const schemeTypes = [
  "agricultureSchemes",
  "fisheriesSchemes",
  "horticultureSchemes",
];

function Schemes() {
  const [selected, setSelected] = useState("all");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openFilters, setOpenFilters] = useState({
    schemeTypes: true,
    farmerTypes: true,
    landSize: true,
  });
  const [filters, setFilters] = useState({
    agricultureSchemes: false,
    fisheriesSchemes: false,
    horticultureSchemes: false,
    samll: false,
    medium: false,
    large: false,
    "<2acres": false,
    "2-5acres": false,
    ">5acres": false,
  });
  const classes = useStyles();
  const { t } = useTranslation();

  const onSchemesClick = (type) => {
    setSelected(type);
  };
  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleCheckBox = (title, event) => {
    setFilters((prevOptions) => ({
      ...prevOptions,
      [title]: event.target.checked,
    }));
  };

  const handleArrowClick = (type) => {
    setOpenFilters((prevState) => ({
      ...prevState,
      [type]: !prevState[type],
    }));
  };

  const checkBoxRenderer = (title) => {
    return (
      <FormControlLabel
        control={
          <Checkbox
            inputProps={{ "aria-label": "controlled" }}
            data-testid="checkbox"
            checked={filters[title]}
            color="success"
            onChange={(event) => handleCheckBox(title, event)}
            size="small"
          />
        }
        label={
          <Typography sx={{ fontSize: "13px !important" }}>
            {t(`schemes.${title}`)}
          </Typography>
        }
        sx={{ mr: "5px" }}
        key={title}
      />
    );
  };

  const openFilter = Boolean(anchorEl);
  return (
    <>
      <div className="schemes-page">
        <div className="buttons-container">
          <div className="tab-buttons">
            <div
              className={`scheme-button ${selected === "all" ? "active" : ""}`}
              onClick={() => onSchemesClick("all")}
              data-testid="all-schemes-tab"
            >
              <p className="button-text">{t("schemes.allschemes")}</p>
            </div>
            <div
              className={`scheme-button ${
                selected === "mySchemes" ? "active" : ""
              }`}
              onClick={() => onSchemesClick("mySchemes")}
              data-testid="my-schemes-tab"
            >
              <p className="button-text">{t("schemes.myschemes")}</p>
            </div>
          </div>
          <div>
            <Avatar
              data-testid="avatar"
              src={`/assets/filterIcon.svg`}
              className={classes.filterIcon}
              onClick={handleFilterClick}
            />
          </div>
        </div>
        <div className="schemes-container">
          {selected === "all" ? (
            <AllSchemes schemeTypes={schemeTypes} />
          ) : (
            <MySchemes />
          )}
        </div>
      </div>
      <Popover
        open={openFilter}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box className="filter-popup-body">
          {filterOptions.map((item) => (
            <Box key={item.title}>
              <Box className="filter-header">
                <Typography className="filter-header-text">
                  {t(`schemes.${item.title}`)}
                </Typography>
                {openFilters[item.title] ? (
                  <KeyboardArrowDownIcon
                    data-testid="keyboard-arrow-down-icon"
                    onClick={() => handleArrowClick(item.title)}
                    sx={{ cursor: "pointer" }}
                  />
                ) : (
                  <KeyboardArrowRightIcon
                    data-testid="keyboard-arrow-right-icon"
                    onClick={() => handleArrowClick(item.title)}
                    sx={{ cursor: "pointer" }}
                  />
                )}
              </Box>
              <Collapse in={openFilters[item.title]}>
                <Box>
                  <FormGroup sx={{ paddingLeft: "10px" }}>
                    {item.options.map((scheme) => checkBoxRenderer(scheme))}
                  </FormGroup>
                </Box>
              </Collapse>
            </Box>
          ))}
        </Box>
      </Popover>
    </>
  );
}

export default Schemes;
