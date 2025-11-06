import {
  Box,
  Button,
  MobileStepper,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import React, { useRef, useState } from "react";
import ApplicationForm from "./SchemeForm/ApplicationRJSF";
import { existingSchema } from "../../components/Constants";
import { makeStyles } from "@mui/styles";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { useNavigate } from "react-router";
import { extractSchemas } from "../../components/Utils";
import ApplicationPreview from "./SchemeForm/ApplicationPreview";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  customDots: {
    "& .MuiMobileStepper-dot": {
      width: 12,
      height: 12,
      backgroundColor: "#ccc",
      borderRadius: "50%",
      margin: "0 4px",
    },
    "& .MuiMobileStepper-dotActive": {
      width: "12px",
      height: "12px",
      background: "#4CAF50",
    },
  },
}));

function SchemeApplicationForm() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = useState({});
  const [liveValidate, setLiveValidate] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const formRef = useRef(null);
  const steps = [];

  const setApplicationFormData = (event) => {
    
    setFormData(event.formData);
  };

  const handleSteps = (jsonSchema, step) => {
    if (step === "Preview") {
      return (
        <ApplicationPreview formData={formData} setActiveStep={setActiveStep} />
      );
    }
    return (
      <ApplicationForm
        jsonSchema={jsonSchema}
        formRef={formRef}
        formData={formData}
        setApplicationFormData={setApplicationFormData}
        liveValidate={liveValidate}
      />
    );
  };
  const handleNext = async () => {
    if (formRef.current) {
      if (formRef.current.validateForm()) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setLiveValidate(false);
      } else {
        setLiveValidate(true);
      }
    }
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const closeApplicationForm = () => {
    navigate("/schemes/scheme-details");
  };

  const extractedSchemas = extractSchemas(existingSchema, steps);

  if (steps.length !== 0) steps.push("Preview");
  return (
    <Box className="application-form-body">
      <Box className="application-header-container">
        <Box sx={{ display: "flex" }}>
          <Box className="scheme-title">
            Ayushman Bharat Pradhan Mantri Jan Arogya Yojana
          </Box>
          <HighlightOffOutlinedIcon
            sx={{ cursor: "pointer" }}
            fontSize="large"
            onClick={closeApplicationForm}
          />
        </Box>
        <Box className="registration-form-text">
          {t("schemes.registrationForm")}
        </Box>
      </Box>
      {/* <Stepper activeStep={activeStep} className="stepper-container">
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper> */}
      {handleSteps(extractedSchemas[activeStep], steps[activeStep])}
      {activeStep !== steps.length - 1 && (
        <>
          <Box className="navigation-buttons-container">
            {activeStep !== 0 && (
              <Button
                variant="outlined"
                onClick={handleBack}
                sx={{ visibility: activeStep === 0 ? "hidden" : "visible" }}
                className="navigation-button back"
                data-testid="back-button"
              >
                {t("schemes.back")}
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              className="navigation-button next"
              data-testid="save-button"
            >
              {activeStep === steps.length - 2
                ? t("schemes.preview")
                : t("schemes.save")}
            </Button>
          </Box>
          <Box className="mobile-stepper-container">
            <MobileStepper
              variant="dots"
              steps={steps.length - 1}
              position="static"
              activeStep={activeStep}
              classes={{ dots: classes.customDots }}
            />
          </Box>
        </>
      )}
    </Box>
  );
}

export default SchemeApplicationForm;
