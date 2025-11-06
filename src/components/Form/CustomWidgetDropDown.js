import {
  FormControl,
  InputBase,
  MenuItem,
  Select,
  Typography,
  FormHelperText,
  CircularProgress,
  Box,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Controller } from "react-hook-form";
import useCropData from "../../Hooks/useCropData";
import ApiDataFilter from "./ApiDataFilter";
import pmksyCrop from "./jsons/pmksy_crop.json";
import pmksySprinkler from "./jsons/pmksy_sprinkler.json";
import pmksyInfoSource from "./jsons/pmksy_info_source.json";
import pmksyCompany from "./jsons/pmksy_company.json";
import yantriEquipments from "./jsons/SCHEME015_Other_Equipments.json";
import { useTranslation } from "react-i18next";
import { color } from "highcharts";

export const StyledDropdown = styled(InputBase)(
  ({ theme, error, disabled, darkTheme }) => ({
    "& .MuiInputBase-input": {
      borderRadius: 8,
      position: "relative",
      backgroundColor: disabled ? "#F0F5F2" : theme.palette.background.paper,
      border: `${disabled ? "1px" : "1px"} solid ${
        disabled ? "#A2ABA6" : "#A2ABA6"
      }`,
      fontSize: 16,
      padding: "8px 12px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      color: darkTheme ? "#FFFFFF" : "rgba(28, 33, 30, 1)",
      "-webkit-text-fill-color": darkTheme ? "#FFFFFF" : "rgba(28, 33, 30, 1)",
      "&:focus": {
        borderRadius: 8,
        borderColor: disabled ? "#A2ABA6" : "#2f6a31",
      },
      ...(error && {
        borderColor: "#d32f2f !important",
      }),
    },
    "& .MuiSelect-select": {
      paddingRight: "32px",
      backgroundColor: darkTheme ? "#1A1D21" : "#FFFFFF",
      border: "1px solid #A2ABA6",
      color: darkTheme ? "#FFFFFF" : "rgba(28, 33, 30, 1)",
      "-webkit-text-fill-color": darkTheme ? "#FFFFFF" : "rgba(28, 33, 30, 1)",
    },
    // "&.MuiInputBase-root": {
    //   // Ensure we are targeting the root when disabled
    //   backgroundColor: "#F0F5F2 !important",
    //   "&.Mui-disabled": {
    //     backgroundColor: "#F0F5F2 !important",
    //     color: "#1C211E !important",
    //     "-webkit-text-fill-color": "#1C211E !important",
    //     cursor: "not-allowed !important",
    //   },
    // },
    // Directly target disabled `.MuiSelect-select` when inside `.Mui-disabled`
    "& .Mui-disabled.MuiSelect-select": {
      color: darkTheme ? "#FFFFFF" : "rgba(28, 33, 30, 1)",
      "-webkit-text-fill-color": darkTheme ? "#FFFFFF" : "rgba(28, 33, 30, 1)",
      backgroundColor: darkTheme ? "#222529" : "#F0F5F2",
      borderColor: "#A2ABA6",
    },
  })
);
export const CustomSelect = (props) => {
  const { t, i18n } = useTranslation();
  const {
    parent,
    relation,
    schemeId,
    label,
    required = true,
    register,
    options,
    rawErrors,
    minLength,
    maxLength,
    requiredLength,
    name,
    reset,
    disable,
    methods,
  } = props;

  const fetchParameters = {
    cropCall: false,
    seasonCall: false,
    farmerCall: false,
    irrigationCall: false,
    landCall: false,
    effectedCall: false,
  };

  const additionalParameters = {
    aadharCall: false,
    name: "",
    aadharNo: "",
  };
  if (schemeId === "SCHEME013") {
    fetchParameters.cropCall = true;
    fetchParameters.seasonCall = true;
    fetchParameters.farmerCall = true;
    fetchParameters.landCall = true;
    fetchParameters.effectedCall = true;
  } else if (schemeId === "SCHEME008") {
    fetchParameters.cropCall = true;
    fetchParameters.seasonCall = true;
    fetchParameters.farmerCall = true;
    fetchParameters.irrigationCall = true;
  } else if (schemeId === "SCHEME012" && relation === "component") {
    fetchParameters.cropCall = true;
  }

  const language = i18n.language === "hi_IN" ? "hi" : "en";
  const data = useCropData(schemeId, fetchParameters);
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";
  let dropOptions = options[language] || options;

  if (schemeId === "SCHEME013") {
    if (relation === "cropsName")
      dropOptions = data?.data?.crops || dropOptions;
    else if (relation === "farmerType") dropOptions = data?.data?.farmer;
    else if (relation === "landType") dropOptions = data?.data?.lands;
    else if (relation === "lossReason") dropOptions = data?.data?.effected;
  } else if (
    schemeId === "SCHEME008" &&
    ["season", "farmerTypeDieasel"].includes(relation)
  ) {
    dropOptions = bihardieseloptions(data, relation, dropOptions);
  } else if (schemeId === "SCHEME012" && relation === "component") {
    dropOptions = districtFiltering(methods, data, dropOptions);
  } else if (schemeId === "SCHEME001") {
    if (relation === "farmerCrop") {
      dropOptions = pmksyCrop["crop-list"];
    } else if (relation === "sourceOfInformation") {
      dropOptions = pmksyInfoSource["info-source-list"];
    } else if (relation === "devicesToBeInstalled")
      dropOptions = pmksySprinkler["sprinkler-list"];
    else if (
      relation === "returnPolicy1" ||
      relation === "returnPolicy2" ||
      relation === "returnPolicy3"
    )
      dropOptions = pmksyCompany["company-list"];
    else if (relation === "sprinklerType")
      dropOptions = pmksySprinkler["sprinkler-list"].find(
        (e) => e.id === 5
      ).type;
  } else if (schemeId === "SCHEME015") {
    if (
      relation === "implimentName" ||
      relation === "implementId1" ||
      relation === "implementId2" ||
      relation === "implementId3" ||
      relation === "implementId4" ||
      relation === "implementId5"
    ) {
      dropOptions = yantriEquipments["other_equipments-list"];
    }
  }

  dropOptions = Array.isArray(dropOptions) ? dropOptions : [];

  return (
    <Controller
      name={parent ? `${parent}.${relation}` : relation}
      control={methods.control}
      defaultValue={{ index: "", id: "", value: "" }}
      rules={{
        validate: (value) => {
          if (parent === "appliedComponentsSabji" && relation === "areaApplied") {
            const totalArea = methods.watch(
              "appliedComponentsSabji2.totalArea"
            );
            if (parseFloat(value.value) > totalArea) {
              return t("schemeErrors.appliedAcreageError", {
                floatVal: value.value,
                totalArea,
              });
            }
          }
          const error = rawErrors?.[relation];
          if (error) return error.message;
          if (
            required &&
            (!value ||
              value?.id === undefined ||
              value?.id === null ||
              value?.id === "")
          ) {
            return `${t("schemeErrors.fieldIsRequired")}`;
          }
          return validateReturnPolicy(
            value,
            schemeId,
            parent,
            relation,
            methods,
            t
          );
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
              className={error ? "required-field input-label" : "input-label"}
              color={theme.palette.text.primary}
            >
              {t(label)}
              {required && <span className="required-field">&nbsp;*</span>}
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
                      maxWidth: { xs: 200, lg: "fit-content" },
                      width: { lg: "fit-content !important" },
                    },
                  },
                }}
                onChange={(e) => {
                  const selectedOption = dropOptions[e.target.value];
                  field.onChange({
                    ...field.value,
                    index: e.target.value,
                    id:
                      selectedOption?.["CropID"] ||
                      selectedOption?.["SeasonID"] ||
                      selectedOption?.["FarmerID"] ||
                      selectedOption.CompanyID ||
                      selectedOption.id ||
                      e.target.value,
                    value:
                      selectedOption?.["CropName"] ||
                      selectedOption?.["SeasonName"] ||
                      selectedOption?.["FarmerType"] ||
                      selectedOption?.["CompanyName"] ||
                      selectedOption?.value ||
                      selectedOption?.["hi"] ||
                      selectedOption?.id ||
                      selectedOption,
                    cropUnits: selectedOption?.cropUnit,
                    valueEnglish:
                      selectedOption?.["en"] || options["en"]?.[e.target.value],
                    valueHindi: options["hi"]?.[e.target.value],
                    season: selectedOption?.["SeasonID"],
                    mobileNumber: selectedOption?.mobileNumber,
                    address: selectedOption?.address,
                  });
                }}
                value={field.value?.index ?? -1}
                disabled={disable}
              >
                {dropOptions && dropOptions.length > 0 ? (
                  dropOptions.map((option, index) => (
                    <MenuItem
                      key={index}
                      value={index}
                      className="!whitespace-normal !break-words"
                    >
                      {option?.["SeasonName"] ||
                        option?.["CropName"] ||
                        option?.["CompanyName"] ||
                        option?.["FarmerType"] ||
                        option?.[language] ||
                        option?.value || option?.id ||
                        option}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value={field.value?.index ?? -1}>
                    {field.value?.value}
                  </MenuItem>
                )}
              </Select>
              {error && (
                <FormHelperText style={{ color: "#F13005" }}>
                  {error.message}
                </FormHelperText>
              )}
            </Box>
          </FormControl>
        );
      }}
    />
  );
};

const bihardieseloptions = (data, relation, dropOptions) => {
  let seasonTemp = dropOptions || [];
  let cropTemp = dropOptions || [];
  let farmerTemp = dropOptions || [];

  if (data.status === "success" && relation === "season") {
    seasonTemp = ApiDataFilter(data.data, "seasons", [
      "SeasonID",
      "STATUS",
      "SeasonName",
    ]);

    return seasonTemp;
  } else if (data.status === "success" && relation === "cropName") {
    cropTemp = ApiDataFilter(data.data, "crops", ["CropID", , "CropName"]);
    return cropTemp;
  } else if (data.status === "success" && relation === "farmerTypeDieasel") {
    farmerTemp = ApiDataFilter(data.data, "farmer", [
      "FarmerID",
      ,
      "FarmerType",
    ]);

    return farmerTemp;
  }
};

const districtFiltering = (methods, data, dropOptions) => {
  const district = methods.watch("landDetails.farmerDistrict", "");
  let res = dropOptions || [];
  if (data?.data?.crops) {
    res = data.data.crops.filter((crop) => crop.district === district.id);
  }
  return res;
};

const validateReturnPolicy = (
  value,
  schemeId,
  parent,
  relation,
  methods,
  t
) => {
  if (schemeId === "SCHEME001" && relation.startsWith("returnPolicy")) {
    const otherPolicies = [
      "returnPolicy1",
      "returnPolicy2",
      "returnPolicy3",
    ].filter((policy) => policy !== relation);

    for (const policy of otherPolicies) {
      const otherValue = methods.watch(
        `${parent ? `${parent}.` : ""}${policy}`
      );
      if (otherValue && otherValue.id === value.id) {
        return t("schemeErrors.duplicateReturnPolicy");
      }
    }
  }
  return true;
};
