import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { ReactComponent as ActiveStepIcon } from "../assets/stepper-active.svg";
import { ReactComponent as CompletedStepIcon } from "../assets/stepper-completed.svg";
import { ReactComponent as ActiveStepDarkIcon } from "../assets/stepper-active-dark.svg";
import { ReactComponent as CompletedStepDarkIcon } from "../assets/stepper-completed-dark.svg";
import PropTypes from "prop-types";
import { Box, Step, StepLabel, Stepper, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";

const ColorlibConnector = styled(StepConnector)(({ theme, isDarkTheme }) => {
  return {
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: isDarkTheme ? "#85BC31" : "#1A5C4B",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: isDarkTheme ? "#85BC31" : "#1A5C4B",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#D7DEDA",
      borderTopWidth: "5px",
      borderRadius: "8px",
    },
  };
});

const ColorStepIconRoot = styled("div")((props) => ({
  backgroundColor: "transparent",
  zIndex: 1,
  color: "#000",
  width: "40px",
  height: "40px",
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(!props.ownerState.active && !props.ownerState.completed
    ? { border: "2px solid #A2ABA6 " }
    : {}),
}));

function ColorStepIcon(props) {
  const { className, active, completed, isDarkTheme } = props;
  const type = completed ? "completed" : active ? "active" : "";

  const icons = {
    completed: isDarkTheme ? <CompletedStepDarkIcon /> : <CompletedStepIcon />,
    active: isDarkTheme ? <ActiveStepDarkIcon /> : <ActiveStepIcon />,
  };

  return (
    <ColorStepIconRoot className={className} ownerState={{ completed, active }}>
      {icons[String(type)]}
    </ColorStepIconRoot>
  );
}

ColorStepIcon.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
};

function CustomStepper(props) {
  const { steps, activeStep } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";

  return (
    <Box>
      <Stepper
        activeStep={activeStep}
        connector={<ColorlibConnector isDarkTheme={isDarkTheme} />}
        className="custom-stepper"
      >
        {steps?.map((step, index) => (
          <Step key={index} active={activeStep === index}>
            <StepLabel
              StepIconComponent={(stepLabelProps) => (
                <ColorStepIcon {...stepLabelProps} isDarkTheme={isDarkTheme} />
              )}
              sx={{ padding: 0 }}
            >
              <span
                className={`custom-stepper-label ${
                  activeStep === index && "custom-stepper-label-active"
                }`}
              >
                {t(step)}
              </span>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default CustomStepper;
