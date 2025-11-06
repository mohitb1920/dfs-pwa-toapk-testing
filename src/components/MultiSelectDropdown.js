import React from "react";
import { CustomDropdown } from "../AppModules/PGR/ComplaintsInbox";
import {
  Box,
  Checkbox,
  FormControl,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function MultiSelectDropdown(props) {
  const {
    dropdownOptions,
    handleChange,
    key,
    selected = [],
    multiSelect = true,
    displayLabel,
    hideChips = false,
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";

  return (
    <Box>
      <FormControl sx={{ minWidth: "180px", width: "100%" }}>
        <Typography variant="body2" className="!font-semibold !mb-2">
          {t(displayLabel)}
        </Typography>
        <CustomDropdown
          id="support-issue-category"
          options={dropdownOptions}
          getOptionLabel={(option) => t(option?.name)}
          size="small"
          renderInput={(params) => (
            <TextField {...params} placeholder={t("COMMON_SELECT")} />
          )}
          {...(hideChips && { renderTags: () => null })}
          onChange={(event, newValue) => handleChange(newValue, key)}
          value={selected}
          multiple={multiSelect}
          disableCloseOnSelect={multiSelect}
          {...(multiSelect && {
            renderOption: (props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key} {...optionProps}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{
                      marginRight: 0,
                      marginLeft: 0,
                      paddingLeft: 0,
                    }}
                    checked={selected}
                    color="success"
                  />
                  {t(option.name)}
                </li>
              );
            },
          })}
          openOnFocus
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: isDarkTheme ? "#1a1d21" : "#fff",
              "& fieldset": {
                borderColor: "#A5A5A5 !important",
                borderRadius: "4px !important",
              },
              "&:hover fieldset": {
                borderColor: isDarkTheme
                  ? "#85BC31 !important"
                  : "#2f6a31 !important",
              },
            },
          }}
        />
      </FormControl>
    </Box>
  );
}

export default MultiSelectDropdown;
