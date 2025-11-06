import { Controller } from "react-hook-form";
import { Typography, Box, useTheme } from "@mui/material";
import { CssTextField } from "../CustomWidget";
import useCropData from "../../../Hooks/useCropData";
import { useTranslation } from "react-i18next";

function FarmerLandArea(props) {
  const {
    relation,
    parent,
    disable,
    label,
    language,
    rawErrors,
    required = true,
    register,
    control,
    watch,
    modalSetValue,
    schemeId,
    minLength,
    maxLength,
    requiredLength,
    number,
    isInt,
    email,
    minimum,
    maximum,
    placeholder,
    defaultValue,
  } = props;

  const data = useCropData(schemeId, { cropCall: true });
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";

  let min = minimum;
  let max = maximum;
  if (
    [
      "SCHEME014",
      "SCHEME030",
      "SCHEME045",
      "SCHEME048",
      "SCHEME049",
      "SCHEME050",
      "SCHEME051",
      "SCHEME052",
      "SCHEME056",
    ].includes(schemeId)
  ) {
    const district = watch("landDetails.farmerDistrict", "");
    if (data?.data?.crops) {
      const filteredCrops = data.data.crops.filter(
        (crop) => crop.district === district.id
      );
      const selectedPart = watch(
        "appliedComponentScreenHorti.farmerPartName",
        ""
      );
      const selectedCrop = filteredCrops.find(
        (item) => item.id === selectedPart.id
      );
      if (selectedPart.id === "695" || selectedPart.id === "696") min = 0;
      else if (selectedCrop?.min) {
        min = parseFloat(selectedCrop.min);
      }
      if (selectedCrop?.max && schemeId === "SCHEME014")
        max = parseFloat(selectedCrop.max);
    }
  }

  const getValidationRules = () => {
    const rules = {
      required: {
        value: required,
        message: `${t("schemeErrors.fieldIsRequired")}`,
      },
      validate: (value) => {
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return t("schemeErrors.invalidEmail");
        }
        if (number) {
          if (isInt && !/^[0-9]+$/.test(value)) {
            return t("schemeErrors.invalidIntegerFormat");
          } else if (required && !isInt && !/^[0-9]*\.?[0-9]+$/.test(value)) {
            return t("schemeErrors.invalidDecimalFormat");
          }
        }
        if (minLength || requiredLength) {
          if (value.length < (minLength || requiredLength)) {
            return t("schemeErrors.minLengthError", {
              length: minLength || requiredLength,
            });
          }
        }
        if (maxLength || requiredLength) {
          if (value.length > (maxLength || requiredLength)) {
            return t("schemeErrors.maxLengthError", {
              length: maxLength || requiredLength,
            });
          }
        }
        if (min !== undefined && value < min) {
          return t("schemeErrors.minValueError", { min: min });
        }
        if (max !== undefined && value > max) {
          return t("schemeErrors.maxValueError", { max: max });
        }
        return true;
      },
    };
    return rules;
  };
  return (
    <Controller
      name={parent ? `${parent}.${relation}` : relation}
      control={control}
      defaultValue=""
      rules={getValidationRules()}
      render={({ field, fieldState: { error } }) => {
        return (
          <Box className="flex flex-col gap-2">
            <Typography
              className={error ? "required-field input-label" : "input-label"}
              color={theme.palette.text.primary}
            >
              {t(label)}
              {required && <span className="required-field">&nbsp;*</span>}
            </Typography>
            <CssTextField
              {...field}
              variant="outlined"
              error={!!error}
              disabled={disable}
              darkTheme={isDarkTheme}
              placeholder={t("ENTER_VALUE")}
              helperText={error ? error.message : null}
              inputProps={{
                maxLength: maxLength || requiredLength,
                readOnly: disable,
              }}
              onChange={(e) => {
                const value = e.target.value;
                if (number && isInt && !/^[0-9]+$/.test(value)) {
                  const numericValue = value.replace(/\D/g, "");
                  field.onChange(numericValue);
                } else if (number && required && !isInt) {
                  if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                    if (value.startsWith(".")) {
                      field.onChange(`0${value}`);
                    } else {
                      field.onChange(value);
                    }
                  }
                } else field.onChange(e.target.value);
              }}
              sx={{ width: "100%" }}
            />
          </Box>
        );
      }}
    />
  );
}

export default FarmerLandArea;
