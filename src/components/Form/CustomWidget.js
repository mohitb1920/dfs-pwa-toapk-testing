import {
  FormControl,
  InputBase,
  TextField,
  Typography,
  FormHelperText,
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Checkbox,
  Box,
  useTheme,
  Select,
} from "@mui/material";
import "./CustomWidget.css";
import { styled } from "@mui/material/styles";
import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import useCropData from "../../Hooks/useCropData";
import { urls } from "../../Utils/Urls";
import { Request } from "../../services/Request";
import FarmerNameonDBT from "./Functionalities/FarmerNameonDBT";
import FarmerLandArea from "./Functionalities/FarmerLandArea";
import DateCustom from "./DateCustom";
import { useTranslation } from "react-i18next";
import FilesUpload from "../FilesUpload";
import FilesRenderer from "../FilesRenderer";
import { getCurrentLanguage } from "../Utils";

export const CustomTextPreview = function (props) {
  const {
    relation,
    parent,
    disable,
    label,
    required = true,
    control,
    schemeId,
    minLength,
    maxLength,
    requiredLength,
    number,
    isInt,
    email,
    minimum,
    maximum,
    watch,
    placeholder,
    defaultValue,
    value,
    rawErrors,
    methods,
  } = props;

  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Controller
      name={parent ? `${parent}.${relation}` : relation}
      control={methods.control}
      render={({ field, fieldState: { error } }) => {
        const fieldValue =
          field.value !== undefined ? field.value : defaultValue;

        return (
          <Box className="flex flex-col gap-2">
            <Typography
              variant="body2"
              className="leading-[26px] tracking-[-0.32px]"
              color={theme.palette.text.textGrey}
            >
              {t(label)
                .replace(/\(.*?\)/g, "")
                .trim()}
            </Typography>
            <Typography
              variant="h6"
              className="!font-bold"
              color={theme.palette.text.primary}
            >
              {fieldValue || "No data available"}
            </Typography>
          </Box>
        );
      }}
    />
  );
};

export const CssTextField = styled(TextField)(
  ({ theme, error, disabled, darkTheme = false }) => ({
    "& .MuiOutlinedInput-root": {
      height: "40px",
      backgroundColor: `${theme.palette.background.default}`,
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: disabled ? "rgba(0, 0, 0, 0.1)" : "transparent",
        borderRadius: "8px",
        zIndex: 0,
      },

      "&.MuiOutlinedInput-root input": {
        position: "relative",
        zIndex: 1,
        padding: "12px 16px !important",
        color: theme.palette.text.primary,
        WebkitTextFillColor: theme.palette.text.primary,
        cursor: disabled ? "not-allowed" : "text",
        backgroundColor: "transparent",
      },
      "& fieldset": {
        border: `1px solid ${darkTheme ? "#F0F5F2" : "#A2ABA6"}`,
        borderRadius: "8px",
        backgroundColor: darkTheme
          ? disabled
            ? "#222529"
            : "#1A1D21"
          : disabled
          ? "#F0F5F2"
          : "#FFFFFF",
      },
      "&:hover fieldset": {
        borderColor: disabled ? "#D3D3D3" : darkTheme ? "#85BC31" : "#2f6a31",
      },
      "&.Mui-focused fieldset": {
        borderColor: disabled ? "#D3D3D3" : darkTheme ? "#85BC31" : "#2f6a31",
      },
      ...(error && {
        "&.Mui-error fieldset": {
          borderColor: "#F13005 !important",
        },
      }),
    },

    "& .MuiInputAdornment-root": {
      zIndex: 2, // Ensures the adornment is above the input background
      backgroundColor: `${theme.palette.background.default}`,
    },

    "& .MuiFormHelperText-root": {
      color: theme.palette.text.error,
    },

    "& input:-internal-autofill-selected": {
      appearance: "menulist-button",
      "background-image": "none !important",
      "background-color": "transparent !important", // Keeps background transparent
      color: darkTheme ? "#fff !important" : "black !important",
    },
  })
);

export const CssSelect = styled(Select)(
  ({ theme, error, disabled, darkTheme = false }) => ({
    height: "40px",
    backgroundColor: theme.palette.background.default,
    borderRadius: "8px",
    // Style the notched outline if using the outlined variant:
    "& .MuiOutlinedInput-notchedOutline": {
      border: `1px solid ${darkTheme ? "#F0F5F2" : "#A2ABA6"}`,
      borderRadius: "8px",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: disabled ? "#D3D3D3" : darkTheme ? "#85BC31" : "#2f6a31",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: disabled ? "#D3D3D3" : darkTheme ? "#85BC31" : "#2f6a31",
    },
    // Style the select text
    "& .MuiSelect-select": {
      padding: "12px 16px",
      color: theme.palette.text.primary,
      backgroundColor: "transparent",
    },
    // Adjust any error styling if needed
    ...(error && {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#F13005 !important",
      },
    }),
  })
);

export const CustomTextbox = function (props) {
  const {
    relation,
    parent,
    disable,
    label,
    required = true,
    control,
    schemeId,
    minLength,
    maxLength,
    requiredLength,
    number,
    isInt,
    email,
    minimum,
    maximum,
    watch,
    placeholder,
    defaultValue,
    value,
    rawErrors,
    methods,
  } = props;
  const getValidationRules = () => {
    const rules = {
      required: {
        value: required,
        message: t("schemeErrors.fieldIsRequired"),
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
          if (value?.length < (minLength || requiredLength)) {
            return t("schemeErrors.minLengthError", {
              length: minLength || requiredLength,
            });
          }
        }
        if (maxLength || requiredLength) {
          if (value?.length > (maxLength || requiredLength)) {
            return t("schemeErrors.maxLengthError", {
              length: maxLength || requiredLength,
            });
          }
        }
        if (minimum !== undefined && value < minimum) {
          return t("schemeErrors.minValueError", { min: minimum });
        }
        if (maximum !== undefined && value > maximum) {
          return t("schemeErrors.maxValueError", { max: maximum });
        }

        if (
          parent === "appliedComponentScreenHorti" &&
          relation === "appliedHortiArea"
        ) {
          const totalArea = methods.watch(
            "appliedComponentScreenHorti.totalArea",
            0
          );
          const selectedPart = methods.watch(
            "appliedComponentScreenHorti.farmerPartName",
            ""
          );
          const groupDetails = methods.watch(
            "appliedComponentScreenHorti.groupDetails"
          );
          //For Strawberry
          if (schemeId === "SCHEME063" && groupDetails?.[0]?.farmerLandArea) {
            let appliedArea = (parseFloat(value) * 0.03088815); //converting 125sqm to 1 acre
            appliedArea = appliedArea.toFixed(2);
            const availableArea = parseFloat(totalArea);
            if (appliedArea > availableArea) {
              return t("schemeErrors.appliedAcreageError",{
                floatVal: appliedArea,
                totalArea: totalArea,
              });
            }
          }
          if (
            selectedPart.id === "695" ||
            selectedPart.id === "696" ||
            ["SCHEME036", "SCHEME057"].includes(schemeId) ||
            (selectedPart?.cropUnits?.toLowerCase().includes("unit") &&
              !["SCHEME060", "SCHEME062"].includes(schemeId))
          )
            return true;
          if (
            (groupDetails?.[0]?.farmerLandArea) &&
            (parseFloat(value) > parseFloat(totalArea))
          ) {
            let floatVal = parseFloat(value);
            floatVal = floatVal
              .toFixed(floatVal % 1 === 0 ? 2 : 10)
              .replace(/\.?0+$/, "");
            return t("schemeErrors.appliedAcreageError", {
              floatVal: floatVal,
              totalArea: totalArea,
            });
          }
        }
        return true;
      },
    };

    return rules;
  };
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";

  if (schemeId === "SCHEME001" && relation === "farmerName")
    return <FarmerNameonDBT {...props} />;

  if (
    [
      "SCHEME014",
      "SCHEME030",
      "SCHEME032",
      "SCHEME033",
      "SCHEME036",
      "SCHEME045",
      "SCHEME048",
      "SCHEME049",
      "SCHEME050",
      "SCHEME051",
      "SCHEME052",
      "SCHEME056",
      "SCHEME064",
    ].includes(schemeId) &&
    relation === "farmerLandArea"
  ) {
    return <FarmerLandArea {...props} />;
  }

  return (
    <Controller
      name={parent ? `${parent}.${relation}` : relation}
      control={methods.control}
      rules={getValidationRules()}
      render={({ field, fieldState: { error } }) => {
        const fieldValue =
          field.value !== undefined ? field.value : defaultValue;

        return (
          <Box className="flex flex-col gap-2">
            <Typography
              className={error ? "required-field input-label" : "input-label"}
              color={theme.palette.text.primary}
            >
              {["SCHEME060", "SCHEME062", "SCHEME063"].includes(schemeId)
                ? t(label)
                : t(label).replace(/\(.*?\)/g, "").trim()}
              {required && label && label?.length > 0 && (
                <span className="required-field">&nbsp;*</span>
              )}
            </Typography>
            <CssTextField
              {...field}
              value={field.value ?? ""}
              variant="outlined"
              error={!!error}
              disabled={disable}
              darkTheme={isDarkTheme}
              placeholder={disable ? "" : t("ENTER_VALUE")}
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
            />
          </Box>
        );
      }}
    />
  );
};

export const CustomDatePicker = (props) => {
  const {
    label,
    required = true,
    rawErrors,
    value,
    control,
    parent,
    relation,
    disable,
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Controller
      name={parent ? `${parent}.${relation}` : relation}
      control={control}
      defaultValue={value || ""}
      rules={{ required: required && `${t("schemeErrors.fieldIsRequired")}` }}
      render={({ field, fieldState: { error } }) => (
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
            <DateCustom
              value={field.value}
              onChange={field.onChange}
              disabled={disable}
              error={!!error}
            />
            {error && (
              <FormHelperText style={{ color: theme.palette.text.error }}>
                {error.message}
              </FormHelperText>
            )}
          </Box>
        </FormControl>
      )}
    />
  );
};

export const StyledRadioGroup = styled(RadioGroup)(
  ({ theme, error, disabled, darkTheme }) => ({
    flexDirection: "row",
    "& .MuiFormControlLabel-root": {
      color: disabled
        ? "rgba(0, 0, 0, 0.38)"
        : error
        ? theme.palette.text.error
        : "black",

      // Specific color for radio option text
      "& .MuiFormControlLabel-label": {
        color: theme.palette.text.primary,
      },

      "& .MuiRadio-root": {
        color: disabled ? "rgba(0, 0, 0, 0.38)" : theme.palette.text.primary,
        padding: 0,
        marginRight: 8,
        "&.Mui-checked": {
          color: disabled ? "black" : "#00A86B",
        },
        "& svg": {
          width: "1.2em",
          height: "1.2em",
        },
        "& .MuiSvgIcon-root": {
          fontSize: "1.2rem",
          marginLeft: "4px",
        },
      },
      "& .MuiRadio-root .MuiSvgIcon-root": {
        transform: "scale(1)",
      },
      "& .MuiRadio-root.Mui-checked .MuiSvgIcon-root:nth-of-type(2)": {
        transform: "scale(0.9)",
      },
      "& .MuiRadio-root:not(.Mui-checked) .MuiSvgIcon-root:nth-of-type(2)": {
        display: "none",
        border: "none",
      },
      "& .MuiTypography-root": {
        fontSize: "0.9rem",
      },

      "& .MuiRadio-root.Mui-checked": {
        "& .MuiSvgIcon-root": {
          backgroundColor: "green",
          borderRadius: "1rem",
          transform: "scale(0.6)",
        },
        "& .MuiSvgIcon-root:nth-of-type(2)": {
          color: "white",
        },
      },
    },
  })
);

export const CustomRadioGroup = ({
  name,
  control,
  label,
  required = true,
  options,
  parent,
  relation,
  schemeId,
  disable,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";
  const languagef = getCurrentLanguage();
  const language = languagef === "hi_IN" ? "hi" : "en";

  return (
    <Controller
      name={parent ? `${parent}.${relation}` : relation}
      defaultValue=""
      control={control}
      rules={{
        required: {
          value: required,
          message: `${t("schemeErrors.radioRequired")}`,
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <FormControl component="fieldset" error={!!error}>
          <Box
            sx={{ display: "flex", alignItems: "center", columnGap: "10px" }}
          >
            <FormLabel component="legend">
              <Typography
                className={error ? "required-field input-label" : "input-label"}
                color={theme.palette.text.primary}
              >
                {t(label)}
                {required && label?.length > 0 && (
                  <span className="required-field">&nbsp;*</span>
                )}
              </Typography>
            </FormLabel>
            <StyledRadioGroup
              {...field}
              value={field.value}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
              disabled={disable}
            >
              {options?.hi?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={options[language]?.[index]}
                  disabled={disable}
                />
              ))}
            </StyledRadioGroup>
          </Box>
          {error && (
            <FormHelperText style={{ color: theme.palette.text.error }}>
              {error.message}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

const StyledCheckbox = styled(Checkbox)(({ theme, error }) => ({
  color: theme.palette.success.main,
  "&.Mui-checked": {
    color: theme.palette.success.main,
  },
  "& .MuiSvgIcon-root": {
    width: 24,
    height: 24,
  },
  "&:hover": {
    backgroundColor: "transparent",
  },
  ...(error && {
    color: theme.palette.text.error,
    "&.Mui-checked": {
      color: theme.palette.text.error,
    },
  }),
}));

export const CustomCheckbox = (props) => {
  const {
    label,
    required = true,
    language,
    control,
    name,
    parent,
    relation,
    disable,
    schemeId,
    isCheckedPossible = true,
  } = props;

  const schemeIdsRequiringConfirmation = [
    "SCHEME030",
    "SCHEME032",
    "SCHEME036",
    "SCHEME045",
    "SCHEME048",
    "SCHEME049",
    "SCHEME050",
    "SCHEME051",
    "SCHEME052",
  ];
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Controller
      name={parent ? `${parent}.${relation}` : relation}
      control={control}
      defaultValue={false}
      rules={{
        required: {
          value: required,
          message: `${t("schemeErrors.checkboxRequired")}`,
        },
      }}
      render={({ field, fieldState: { error } }) => {
        const handleChange = (e) => {
          const processChange = () => {
            if (isCheckedPossible === false) {
              field.onChange(false);
              error = { message: "Flag value is false" };
            } else if (field.value) {
              field.onChange(false);
            } else {
              field.onChange(true);
            }
          };
          processChange();
          // if (schemeIdsRequiringConfirmation.includes(schemeId)) {
          //   console.debug(error);
          //   const confirmLandDetails = window.confirm(
          //     t("schemes.confirmLandDetails", {
          //       component: t("Applied_Components"),
          //     })
          //   );
          //   if (confirmLandDetails) {
          //     processChange();
          //   }
          // } else {
          //   processChange();
          // }
        };

        let temp = label;
        if (
          temp ===
            "The above description given by me is correct. In case the details are incorrect, I will be responsible for the cancellation of the application. Grant money can be recovered from me and punitive action can be taken against me." ||
          temp ===
            "मेरे द्वारा दिया गया उपर्युक्त विवरण सही है| विवरण गलत होने की स्थिति में आवेदन रद्द होने की जिम्मेवारी मेरी होगी| मुझसे अनुदान राशि वसूल की जा सकती है तथा मेरे ऊपर दंडात्मक कार्रवाई की जा सकती है|" ||
          temp ===
            "I hereby declare that all the details shared above are correct. If any of the above information is found to be untrue, I shall be responsibe for the rejection of this application and the subsidy amount can be recovered from me and I shall be liable for penal proceedings." ||
          temp ===
            "मैं प्रमाणित करता हूँ / करती हूँ कि मेरे द्वारा दिया गया उपर्युक्त विवरण सही है| विवरण गलत होने की स्थिति में आवेदन रद्द होने की जिम्मेवारी मेरी होगी| मुझसे अनुदान राशि वसूल की जा सकती है तथा मेरे ऊपर दंडात्मक कार्रवाई की जा सकती है| " ||
          temp ===
            "I certify/I assure that the above description given by me is correct. In case the details are incorrect, I will be responsible for the cancellation of the application. Grant money can be recovered from me and punitive action can be taken against me." ||
          temp ===
            "मैं प्रमाणित करता हूँ / करती हूँ कि मेरे द्वारा दिया गया उपर्युक्त विवरण सही है| विवरण गलत होने की स्थिति में आवेदन रद्द होने की जिम्मेवारी मेरी होगी| मुझसे अनुदान राशि वसूल की जा सकती है तथा मेरे ऊपर दंडात्मक कार्रवाई की जा सकती है|"
        )
          temp = t("schemes.farmerConsent");
        return (
          <Box>
            <FormControlLabel
              control={
                <StyledCheckbox
                  {...field}
                  checked={field.value || false}
                  onChange={handleChange}
                  // onChange={(e) => field.onChange(e.target.checked)}
                  error={error ? "true" : undefined}
                  disabled={disable}
                />
              }
              label={
                <Typography
                  className={
                    error ? "required-field input-label" : "input-label"
                  }
                  color={theme.palette.text.primary}
                >
                  {temp}
                  {required && <span className="required-field">&nbsp;*</span>}
                </Typography>
              }
            />
            {error && (
              <FormHelperText style={{ color: theme.palette.text.error }}>
                {error.message
                  ? error.message
                  : `${t("schemeErrors.districtNotEligible")}`}
              </FormHelperText>
            )}
          </Box>
        );
      }}
    />
  );
};

//File Uploader ----------------------------------------------------------------------------------------
const StyledFileInput = styled(InputBase)(({ theme, error }) => ({
  display: "none",
  "& .MuiInputBase-input": {
    borderRadius: 10,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid rgba(76, 175, 80, 1)",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderRadius: 10,
      borderColor: "#2f6a31",
    },
    ...(error && {
      borderColor: "#F13005 !important",
    }),
  },
}));

export const CustomFileUploader = (props) => {
  const {
    label,
    schemeId,
    required = true,
    control,
    name,
    parent,
    relation,
    fileTypes,
    dependent,
    disable,
    methods,
  } = props;

  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const formName = dependent?.formName;
  const fieldName = dependent?.fieldName;
  const [isUploadFailed, setIsUploadFailed] = useState(false);
  let fileRequired = required;
  let watchedValue;
  let displayLabel = name;
  if (fieldName && formName) {
    watchedValue = methods.watch(`${formName}.${fieldName}`, "");
    watchedValue = watchedValue.valueHindi;
    if (dependent && dependent.list) {
      const matchedItem = dependent.list.find(
        (item) => item.name === watchedValue
      );

      if (matchedItem) {
        const currentLanguage = i18n.language === "hi_IN" ? "hi" : "en";
        displayLabel =
          matchedItem.text?.title ||
          matchedItem.text[currentLanguage] ||
          matchedItem.text.en;
      }
    }
  }

  if (schemeId === "SCHEME015") {
    fileRequired = watchedValue === "सामान्य" ? false : true;
  }

  return (
    <Controller
      name={parent ? `${parent}.${relation}` : relation}
      control={control}
      defaultValue={[]}
      rules={{
        required: {
          value: fileRequired,
          message: `${t("schemeErrors.fileRequired")}`,
        },
        validate: (files) => {
          // Check if there are no valid files
          const hasValidFile = files.some((file) => file.status !== "error");
          if (fileRequired && !hasValidFile) {
            return `${t("schemeErrors.fileRequired")}`;
          }
          return true;
        },
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const handleFilesChange = (newFiles) => {
          onChange(newFiles);
        };

        const validFileCount = value.reduce((count, file) => {
          if (file.status !== "error") {
            count++;
          }
          return count;
        }, 0);

        return (
          <Box className="flex flex-col gap-2">
            <Typography
              className={error ? "required-field input-label" : "input-label"}
              color={theme.palette.text.primary}
            >
              {t(displayLabel)}
              {fileRequired && <span className="required-field">&nbsp;*</span>}
            </Typography>
            {validFileCount === 0 && (
              <FilesUpload
                isUploadFailed={isUploadFailed}
                setIsUploadFailed={setIsUploadFailed}
                selectedFiles={value}
                setSelectedFiles={handleFilesChange}
                disabled={disable}
                validFileCount={validFileCount}
                fileLength={1}
                acceptedFileTypes={fileTypes}
              />
            )}
            <FilesRenderer
              preview={!!disable}
              files={value}
              setSelectedFiles={handleFilesChange}
            />
            {error && (
              <FormHelperText style={{ color: theme.palette.text.error }}>
                {error.message}
              </FormHelperText>
            )}
          </Box>
        );
      }}
    />
  );
};

export const CustomLabel = (props) => {
  const {
    name,
    label,
    options,
    subLabel,
    linkTitle,
    parent,
    relation,
    schemeId,
    methods,
    disable,
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();

  const isDownloadableLink = (text) => {
    const fileExtensions = [
      "pdf",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "txt",
      "csv",
      "zip",
      "rar",
      "mp3",
      "mp4",
      "jpg",
      "jpeg",
      "png",
      "gif",
    ];

    try {
      const url = new URL(text);
      const hasFileExtension = fileExtensions.some((ext) =>
        url.pathname.toLowerCase().endsWith(`.${ext}`)
      );
      const hasDownloadPath =
        url.pathname.includes("/download/") ||
        url.pathname.endsWith("/download");

      return hasFileExtension || hasDownloadPath;
    } catch {
      return false;
    }
  };

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", ""); // This will force download instead of navigation
    link.setAttribute("target", "_blank"); // Open in a new tab if download doesn't start
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (relation === "noteHistory") {
    return (
      <TotalApplyLabel schemeId={schemeId} label={label} methods={methods} />
    );
  }

  return (
    <>
      {isDownloadableLink(label) ? (
        <NotesTypography
          variant="body1"
          style={{
            fontSize: "1rem",
            color: !disable
              ? theme.palette.text.textGreen
              : theme.palette.text.textGrey,
            cursor: !disable ? "pointer" : "not-allowed",
            textDecoration: "underline",
            margin: "auto",
            width: "fit-content",
            pointerEvents: !disable ? "auto" : "none",
          }}
          onClick={!disable ? () => handleDownload(label) : null}
        >
          {linkTitle || name || "Download Document"}
        </NotesTypography>
      ) : (
        <Box className="flex flex-col gap-2">
          <Typography
            variant="body1"
            color={theme.palette.text.primary}
            sx={{
              fontSize: "0.9rem",
              fontWeight: "bold",
              wordBreak: "break-word",
            }}
          >
            {t(label)}
          </Typography>
          {options?.length > 0 && (
            <ul>
              {options.map((option, index) => (
                <li key={index} style={{ color: theme.palette.text.primary }}>
                  {option}
                </li>
              ))}
            </ul>
          )}
          {subLabel?.length > 0 && (
            <ul>
              {subLabel.map((item, index) => (
                <li key={index} style={{ color: theme.palette.text.primary }}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </Box>
      )}
    </>
  );
};

const NotesTypography = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  marginTop: theme.spacing(1),
  color: theme.palette.text.secondary,
  wordBreak: "break-word",
}));

const TotalApplyLabel = (props) => {
  const { schemeId, label, methods } = props;
  function getIdentifierValue(identifiers, type) {
    const identifier = identifiers.find((id) => id.identifierType === type);
    return identifier ? identifier.identifierId : null;
  }
  let dbt = getIdentifierValue(
    methods.getValues()?.farmerData?.Individual?.identifiers,
    "DBTID"
  );

  let {
    data: schemeAgri,
    isLoading: isLoadingAgri,
    refetch: refetchAgri,
  } = useCropData(schemeId, { seasonCall: true });

  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoadingAgri && schemeAgri?.seasons && dbt) {
        const season = schemeAgri.seasons[0];

        if (season.SeasonID !== undefined && season.SeasonID !== null) {
          const seasonId = season.SeasonID;

          try {
            const response = await Request({
              url: urls.SchemeAgriInfo,
              useCache: false,
              method: "POST",
              params: {
                apiName: "total",
                mdmsId: schemeId,
                regId: dbt,
                seasonId: seasonId,
              },
            });

            setResponseData(response?.data || {});
            setIsLoading(false);
          } catch (error) {
            console.error("Error:", error);
            setError(error);
            setIsLoading(false);
          }
        } else {
          setError("Season ID is not defined or null");
          setIsLoading(false);
        }
      } else if (isLoadingAgri) {
        setIsLoading(true);
      } else {
        setError("Something went wrong");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [schemeAgri, dbt, schemeId, isLoadingAgri]);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.toString()}</Typography>;

  const sum = responseData?.reduce(
    (total, item) => total + parseInt(item.TotalAppApply, 10),
    0
  );
  return (
    <Typography
      variant="body1"
      className="font-bold !mb-4"
      color={theme.palette.text.primary}
    >
      {label?.replace("{}", sum)}
    </Typography>
  );
};
