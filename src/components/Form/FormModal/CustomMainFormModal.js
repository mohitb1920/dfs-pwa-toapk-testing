import React, { useState, useEffect, forwardRef } from "react";
import Mapper from "../Mapper";
import { Controller, useWatch } from "react-hook-form";
import useCropData from "../../../Hooks/useCropData";
import { StyledDropdown } from "../CustomWidgetDropDown";
import { useTranslation } from "react-i18next";
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

const CustomMainFormModal = forwardRef(
  (
    {
      scheme,
      language,
      disable,
      control,
      register,
      errors,
      reset,
      schemeId,
      methods,
      schemeName,
      index,
    },
    ref
  ) => {
    const data = useCropData(schemeId, { cropCall: true });
    const farmerPartNameObject = scheme.properties["fruitPlant"];
    const appliedHortiArea = scheme.properties["appliedPlants"];
    const district = methods.watch("landDetails.farmerDistrict", "");
    const { t } = useTranslation();
    const theme = useTheme();
    const isDarkTheme = theme.palette.mode === "dark";
    const [originalOptions, setOriginalOptions] = useState([]);

    const groupDetailsWatch = useWatch({
      control,
      name: "appliedComponentsLandDetails.plantDetails",
    });

    const selectedPart = groupDetailsWatch?.[index]?.["fruitPlant"];
    const appliedPlants = groupDetailsWatch?.[index]?.["appliedPlants"];

    useEffect(() => {
      if (data?.data?.crops) {
        const filteredCrops = data.data.crops.filter(
          (crop) => crop.district === district.id
        );
        setOriginalOptions(filteredCrops);
      }
    }, [data?.data?.crops, district.id]);

    const getFilteredOptions = () => {
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

    const selectedCrop = originalOptions.find(
      (item) => item.id === selectedPart?.id
    );

    useEffect(() => {
      if (selectedCrop) {
        if (selectedCrop.min) {
          appliedHortiArea.minimum = parseFloat(selectedCrop.min);
        }
        if (selectedCrop.max) {
          appliedHortiArea.maximum = parseFloat(selectedCrop.max);
        }
        appliedHortiArea.maxlength = 5;
        methods.setValue(
          `${schemeName}[${index}].requiredPlants`,
          selectedCrop.requiredAcre
        );
        methods.clearErrors(`${schemeName}[${index}].requiredPlants`);
      }
    }, [selectedCrop?.id]);

    useEffect(() => {
      if (selectedCrop?.requiredAcre && appliedPlants) {
        const plantsRakwa = (
          parseFloat(appliedPlants) / parseFloat(selectedCrop.requiredAcre)
        ).toFixed(2);

        const currentPlantsRakwa = methods.getValues(
          `${schemeName}[${index}].plantsRakwa`
        );
        if (currentPlantsRakwa !== plantsRakwa) {
          methods.setValue(`${schemeName}[${index}].plantsRakwa`, plantsRakwa);
          methods.clearErrors(`${schemeName}[${index}].plantsRakwa`);
        }
      }
    }, [selectedCrop?.id, appliedPlants]);

    const modifiedFarmerPartNameObject = {
      required: true,
      ...farmerPartNameObject,
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
        <div className="w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]">
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
                if (data.status === "loading" || data.isLoading)
                  return <CircularProgress />;
                return (
                  <FormControl
                    className="flex flex-col gap-2"
                    variant="outlined"
                    error={!!error}
                    fullWidth
                  >
                    <Typography
                      className={
                        error ? "required-field input-label" : "input-label"
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
        <div className="w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]">
          <div className="h-full">
            <Mapper
              parent={`${schemeName}[${index}]`}
              relation="requiredPlants"
              type="string"
              obj={scheme.properties["requiredPlants"]}
              register={register}
              language={language}
              errors={errors}
              control={control}
              reset={reset}
              disableAll={true}
              methods={methods}
            />
          </div>
        </div>
        <div className="w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]">
          <div className="h-full">
            <Mapper
              parent={`${schemeName}[${index}]`}
              relation="appliedPlants"
              type="string"
              obj={appliedHortiArea}
              register={register}
              language={language}
              errors={errors}
              control={control}
              reset={reset}
              disableAll={disable}
              methods={methods}
            />
          </div>
        </div>
        <div className="w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]">
          <div className="h-full">
            <Mapper
              parent={`${schemeName}[${index}]`}
              relation="plantsRakwa"
              type="string"
              obj={scheme.properties["plantsRakwa"]}
              register={register}
              language={language}
              errors={errors}
              control={control}
              reset={reset}
              disableAll={true}
              methods={methods}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default CustomMainFormModal;
