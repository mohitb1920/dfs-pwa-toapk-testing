import { forwardRef, useEffect, useState } from "react";
import Mapper from "./Mapper";
import { Controller, useWatch } from "react-hook-form";
import {
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { StyledDropdown } from "./CustomWidgetDropDown";
import { useTranslation } from "react-i18next";

const AddBananaStrainModal = forwardRef(
  (
    {
      scheme,
      schemeId,
      schemeName,
      index,
      control,
      language,
      methods,
      disable,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isDarkTheme = theme.palette.mode === "dark";
    // Track all selected varieties
    const groupDetailsWatch = useWatch({
      control,
      name: "appliedComponentScreenHorti.bananaDetails",
    });

    const varietyObj = scheme.properties["fruitPlant"];

    const getFilteredOptions = () => {
      let originalOptions = varietyObj?.options?.[language] || [];

      originalOptions = originalOptions.map((value, index) => ({
        id: index + 1,
        value: value,
      }));

      if (!originalOptions.length) return [];
      const selectedValues =
        groupDetailsWatch?.reduce((acc, item, idx) => {
          if (idx !== index && item.fruitPlant?.id) {
            acc.push(item.fruitPlant.id);
          }
          return acc;
        }, []) || [];

      return originalOptions.filter(
        (option) => !selectedValues.includes(option.id)
      );
    };

    const getWidthClass = (type) => {
      return ["string", "date", "label"].includes(type)
        ? "w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]"
        : "w-full";
    };

    const modifiedFarmerPartNameObject = {
      required: true,
      ...varietyObj,
      options: {
        en: getFilteredOptions(),
        hi: getFilteredOptions(),
      },
    };

    const dropOptions = modifiedFarmerPartNameObject.options[language];

    const label =
      modifiedFarmerPartNameObject.label ||
      modifiedFarmerPartNameObject[`title-${language}`] ||
      modifiedFarmerPartNameObject[`title`];

    return (
      <div className="flex flex-wrap gap-y-8 gap-x-4">
        {Object.entries(scheme.properties).map(([fieldKey, fieldProps]) => {
          const { type } = fieldProps;
          const widthClass = getWidthClass(type);

          if (fieldKey === "fruitPlant") {
            return (
              <div key={fieldKey} className={`${widthClass}`}>
                <div className="h-full">
                  <Controller
                    name={`${schemeName}[${index}].fruitPlant`}
                    control={methods.control}
                    defaultValue={{ index: "", id: "", value: "" }}
                    rules={{
                      validate: (value) => {
                        if (
                          modifiedFarmerPartNameObject.required &&
                          value?.id === ""
                        ) {
                          return `${t("schemeErrors.fieldIsRequired")}`;
                        }
                      },
                    }}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <FormControl
                          className="flex flex-col gap-2"
                          variant="outlined"
                          error={!!error}
                          fullWidth
                        >
                          <Typography
                            className={
                              error
                                ? "required-field input-label"
                                : "input-label"
                            }
                            color={theme.palette.text.primary}
                          >
                            {t(label)}
                            {modifiedFarmerPartNameObject.required && (
                              <span className="required-field">&nbsp;*</span>
                            )}
                          </Typography>
                          <Box>
                            <Select
                              {...field}
                              label={label}
                              input={
                                <StyledDropdown
                                  error={!!error}
                                  disabled={disable}
                                  darkTheme={isDarkTheme}
                                />
                              }
                              sx={{ height: "40px", width: "100%" }}
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    maxHeight: 500,
                                    maxWidth: 200,
                                  },
                                },
                              }}
                              onChange={(e) => {
                                const selectedOption = dropOptions.find(
                                  (option) => option.id === e.target.value
                                );
                                field.onChange({
                                  ...field.value,
                                  index: e.target.value,
                                  id: e.target.value,
                                  value:
                                    selectedOption?.value ||
                                    selectedOption?.["hi"] ||
                                    selectedOption,
                                  cropUnits: selectedOption?.cropUnit,
                                  valueEnglish: selectedOption?.["en"],
                                  valueHindi: selectedOption?.["hi"],
                                });
                              }}
                              value={field.value?.index ?? -1}
                              disabled={disable}
                            >
                              {dropOptions && dropOptions.length > 0 ? (
                                dropOptions.map((option, index) => (
                                  <MenuItem key={index} value={option.id}>
                                    {option.value || option}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem value={field.value?.index ?? -1}>
                                  {field.value?.value}
                                </MenuItem>
                              )}
                            </Select>
                            {error && (
                              <FormHelperText style={{ color: theme.palette.text.error }}>
                                {error.message}
                              </FormHelperText>
                            )}
                          </Box>
                        </FormControl>
                      );
                    }}
                  />
                </div>
              </div>
            );
          }

          return (
            <div key={fieldKey} className={`${widthClass}`}>
              <div className="h-full">
                <Mapper
                  type={type}
                  methods={methods}
                  schemeId={schemeId}
                  parent={`${schemeName}[${index}]`}
                  relation={fieldKey}
                  // Conditionally pass fieldProps or modified fieldProps for fruitPlant
                  obj={fieldProps}
                  language={language}
                  disableAll={disable}
                  errors={methods.formState.errors}
                  register={methods.register}
                  control={methods.control}
                  watch={methods.watch}
                  setValue={methods.setValue}
                  reset={methods.reset}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

export default AddBananaStrainModal;
