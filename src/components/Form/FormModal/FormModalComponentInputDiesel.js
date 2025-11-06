import {
  Box,
  Button,
  Divider,
  FormHelperText,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";
import FormModalFields from "./FormModalFields";
import { useTranslation } from "react-i18next";
import { dispatchNotification, getCurrentLanguage } from "../../Utils";
import { useFieldArray, useWatch } from "react-hook-form";
import CustomButton from "../../Button/CustomButton";
import { ButtonState } from "../../Button/ButtonEnums";
import { useDispatch } from "react-redux";

function FormModalComponentInputDiesel(props) {
  const {
    label,
    methods,
    scheme,
    schemeName,
    schemeId,
    setValue,
    setEditIndex,
    editIndex,
    disableAll,
    min = 1,
    max = Infinity,
    maxValue,
    minValue,
    error,
  } = props;

  const control = methods.control;

  const dispatch = useDispatch();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";
  const { t } = useTranslation();

  const { fields, append, remove } = useFieldArray({
    control,
    name: schemeName,
  });

  const groupDetailsWatch = useWatch({
    control,
    name: "familyDetails.memberDetails",
  });

  const addNewGroup = async () => {
    if (disableAll || fields.length >= max) return;
    if (
      groupDetailsWatch?.length > 0 &&
      !groupDetailsWatch?.[groupDetailsWatch.length - 1]?.["verified"]
    ) {
      dispatchNotification("error", ["schemeErrors.addNewRowError"], dispatch);
      return;
    }
    append({});
    await methods.trigger(schemeName);
  };

  const removeGroup = async (index) => {
    if (!disableAll && fields.length > min) {
      remove(index);
      methods.clearErrors(schemeName);
      const remainingFields = fields.filter((_, i) => i !== index);
      if (remainingFields.length < min) {
        methods.setError(schemeName, {
          type: "min",
          message: t("schemeErrors.pleaseEnterValueMin", { min: min }),
        });
      } else {
        setTimeout(() => {
          methods.trigger(schemeName);
          remainingFields.forEach((_, i) => {
            methods.trigger(`${schemeName}.${i}`);
          });
        }, 0);
      }
    }
  };

  useEffect(() => {
    if (!disableAll) {
      if (fields.length < min) {
        methods.setError(schemeName, {
          type: "min",
          message: t("schemeErrors.pleaseEnterValueMin", { min: min }),
        });
      } else {
        methods.clearErrors(schemeName);
      }
    }
  }, [fields.length, min, methods, t]);

  const languagef = getCurrentLanguage();
  const language = languagef === "hi_IN" ? "hi" : "en";

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: `${
            disableAll ? "transparent" : isDarkTheme ? "#222529" : "#F5F7F8"
          }`,
          padding: `${disableAll ? "0" : "24px"}`,
          borderRadius: "12px",
        }}
      >
        {!disableAll && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0 20px 0",
            }}
          >
            <Typography
              variant="subtitle1"
              className="!font-semibold"
              color={theme.palette.text.primary}
            >
              {scheme?.title === "group_statement" ||
              scheme?.title === "Subgroup_Details"
                ? t("schemes.addRecord")
                : t(scheme?.[`title-${language}`] || scheme?.title)}
            </Typography>
            <CustomButton
              disabled={disableAll}
              state={
                disableAll || fields.length >= max
                  ? ButtonState.DISABLED
                  : ButtonState.ENABLED
              }
              onClick={addNewGroup}
            >
              {t(label)}
            </CustomButton>
          </Box>
        )}
        {fields.map((field, index) => (
          <>
            <Box
              key={field.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {!(disableAll || fields.length <= min) && (
                  <Button
                    variant="outlined"
                    disabled={disableAll || fields.length <= min}
                    sx={{
                      border: "0px !important",
                    }}
                    onClick={() => removeGroup(index)}
                  >
                    <Box
                      component="img"
                      alt="Logo"
                      src={`${window.contextPath}/assets/DeleteTrash.svg`}
                      sx={{ position: "relative", zIndex: 10 }}
                    />
                  </Button>
                )}
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <FormModalFields
                  language={language}
                  {...props}
                  index={index}
                  errors={methods.formState.errors}
                />
              </Box>
            </Box>
            <Divider
              sx={{
                borderColor: "#B5B6B6",
                borderWidth: "1px",
                marginTop: "1rem",
              }}
            />
          </>
        ))}
      </Box>
      {methods.formState.errors.familyDetails && (
        <FormHelperText style={{ color: theme.palette.text.error }}>
          {methods.formState.errors.familyDetails?.message}
        </FormHelperText>
      )}
      {error && <FormHelperText style={{ color: theme.palette.text.error }}>{error}</FormHelperText>}
    </Box>
  );
}

export default FormModalComponentInputDiesel;
