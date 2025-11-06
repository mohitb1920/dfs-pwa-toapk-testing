import {
  Box,
  Button,
  FormHelperText,
  Typography,
  useTheme,
} from "@mui/material";
import FormComponent from "./FormComponent";
import {
  dispatchNotification,
  mainextractSchemas,
} from "../../components/Utils";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CustomButton from "../../components/Button/CustomButton";
import { ButtonColor } from "../../components/Button/ButtonEnums";
import { useWatch } from "react-hook-form";
import TypeSelectComponent from "../../components/TypeSelectComponent";
import { useDispatch } from "react-redux";

function SchemeMainApplicationType(props) {
  const { methods, fields, handleMoveAhead, schemeId } = props;
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isInitialRender = useRef(true);
  const previousApplicationType = useRef(methods.getValues("applicationType"));
  const isCitizen = localStorage.getItem("DfsWeb.isCitizenUser") === "true";
  const [applicationType, setApplicationType] = useState(
    methods.getValues("applicationType")
  );
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (applicationType !== previousApplicationType.current) {
      const valuesToKeep = {
        applicationType,
        farmerData: methods.getValues("farmerData"),
        mainSchemeId: methods.getValues("mainSchemeId"),
        personalInformation: methods.getValues("personalInformation"),
        bankInformation: methods.getValues("bankInformation"),
        locationInformation: methods.getValues("locationInformation"),
      };

      const fieldNames = Object.keys(methods.getValues());

      fieldNames.forEach((field) => {
        if (!Object.keys(valuesToKeep).includes(field)) {
          methods.setValue(field, undefined);
        }
      });

      Object.entries(valuesToKeep).forEach(([key, value]) => {
        methods.setValue(key, value);
      });

      previousApplicationType.current = applicationType;
    }
  }, [applicationType, methods]);

  const onSubmit = async (data) => {
    // console.error("Submitted ", data);
    // localStorage.setItem(schemeId + "formData", JSON.stringify(data));
  };

  const onError = (error) => {
    // console.error(error);
  };

  const handleNextClick = async () => {
    try {
      // await methods.handleSubmit(onSubmit)();
    } catch (error) {
      onError(error);
    } finally {
      const selectedType = methods.getValues("applicationType");

      // Check if application type is not selected
      if (!selectedType) {
        dispatchNotification(
          "error",
          [t("schemes.applicationTypeRequired")],
          dispatch
        );
      }

      if (schemeId === "SCHEME001" && selectedType === "समूह") {
        setApplicationType("");
        methods.setError("applicationType", {
          type: "manual",
          message: `${t("schemeErrors.pmksyError")}`,
        });
        dispatchNotification("error", [t("schemeErrors.pmksyError")], dispatch);
      } else if (selectedType === "समूह" || selectedType === "व्यक्ति") {
        handleMoveAhead(true);
      }
    }
  };

  const onCancelClick = () => {
    const confirmCancel = window.confirm(
      !isCitizen ? t("schemes.confirmCancel") : "Are you sure you want to cancel?"
    );
    if (confirmCancel) {
      navigate(`${window.contextPath}/schemes`);
    }
  };

  const scheme = mainextractSchemas(fields);

  const options = scheme?.properties?.applicationType?.options;

  return (
    <Box className="schemes-form">
      <Box className="scheme-details-main">
        <Box className="flex flex-col items-start gap-2">
          <Typography
            variant="h3"
            className="font-bold"
            color={theme.palette.text.primary}
          >
            {t("schemes.createSchemeApplication")}
          </Typography>
          <Typography variant="h6" color={theme.palette.text.textGrey}>
            {t("schemes.enterDetailsForFarmerApplication")}
          </Typography>
        </Box>
        <Box className="scheme-application-form-box">
          <Typography
            variant="h5"
            className="scheme-form-component-title !font-semibold"
            color={theme.palette.text.primary}
          >
            {t("schemes.applicationForm")}
          </Typography>
          <Box className="flex flex-col sm:flex-row gap-6">
            {options?.[`${i18n.language === "hi_IN" ? "hi" : "en"}`].map(
              (option, index) => (
                <TypeSelectComponent
                  key={index}
                  id={options?.hi?.[index]}
                  text={option}
                  svgPath={`${options?.en?.[index]}.svg`}
                  selected={applicationType}
                  setSelected={setApplicationType}
                />
              )
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <CustomButton color={ButtonColor.SECONDARY} onClick={onCancelClick}>
            {t("schemes.cancel")}
          </CustomButton>
          <CustomButton onClick={handleNextClick}>
            {t("schemes.next")}
          </CustomButton>
        </Box>
      </Box>
    </Box>
  );
}

export default SchemeMainApplicationType;
