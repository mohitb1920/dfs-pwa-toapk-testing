import React, { useEffect, useState } from "react";
import { Select, MenuItem, FormControl, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const StyledContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  columnGap: "16px",
});

const StyledLabel = styled(Typography)({
  minWidth: "fit-content", // Adjust based on your longest label
  whiteSpace: "nowrap",
  fontWeight: 700,
  fontSize: "1rem",
  marginRight: "6px",
});

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 200,
  width: "100%",
  // Remove the maxWidth: none,
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    fontSize: "1rem",
    backgroundColor:
      theme.palette.mode === "dark" ? "rgba(26, 29, 33, 1)" : "white",
    "& fieldset": {
      borderColor: "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: "#bdbdbd",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#bdbdbd",
    },
  },
  "& .MuiSelect-icon": {
    color: "#757575",
  },
  [theme.breakpoints.up("sm")]: {
    width: "100%",
    marginBottom: 0,
    marginRight: "16px",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    marginBottom: "0",
  },
}));

const CustomDropdown = ({ label, options, onChange, prefilledValue }) => {
  const [selectedValue, setSelectedValue] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    setSelectedValue(prefilledValue || "");
  }, [prefilledValue]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <StyledContainer>
      <StyledLabel>{t(label)}</StyledLabel>
      <StyledFormControl variant="outlined">
        <Select
          value={selectedValue}
          onChange={handleChange}
          displayEmpty
          IconComponent={KeyboardArrowDownIcon}
          placeholder={t("COMMON_SELECT")}
          inputProps={{
            "aria-label": t(label),
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {t(option.value)}
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>
    </StyledContainer>
  );
};

export default CustomDropdown;
