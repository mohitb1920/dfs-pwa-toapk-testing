import { useEffect, useState } from "react";
import {
  dispatchNotification,
  mainextractSchemas,
} from "../../components/Utils";
import { Box, Button } from "@mui/material";
import FormComponent from "./FormComponent";
import PreviewFormPage from "./PreviewFormPage";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import CustomButton from "../../components/Button/CustomButton";
import { ButtonColor } from "../../components/Button/ButtonEnums";
function SchemeMainForm(props) {
  const {
    methods,
    fields,
    farmerData,
    schemeId,
    mainSchemeId,
    handleMoveNext,
  } = props;
  const selectedSource = methods.watch("applicationType", "");
  const steps = [];
  const extractedSchemas = mainextractSchemas(fields, selectedSource, steps);
  const [previewClick, setPreviewClick] = useState(false);
  const { t } = useTranslation();
  const isCitizen = localStorage.getItem("DfsWeb.isCitizenUser") === "true";

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    // console.error("Submitted ", data);
    // localStorage.setItem(schemeId + "formData", JSON.stringify(data));
    setPreviewClick(true);
  };
  const onError = (error) => {
    // console.error(error);
    dispatchNotification("error", ["SCHEME_HAS_ERRORS"], dispatch);
  };

  const handlePreviewClick = async () => {
    try {
      await methods.handleSubmit(onSubmit, onError)();
    } catch (error) {
      onError(error);
    }
  };

  const handlePreviousClick = () => {
    if (selectedSource) {
      handleMoveNext(false);
    } else {
      const confirmCancel = window.confirm(
        !isCitizen ? t("schemes.confirmCancel") : "Are you sure you want to cancel?"
      );
      if (confirmCancel) {
        navigate(`${window.contextPath}/schemes`); // Navigate to /schemes if confirmed
      }
    }
  };

  let isFormValid = Object.keys(methods.formState.errors).length === 0;
  return (
    <>
      {(!previewClick || (previewClick && !isFormValid)) && (
        <Box className="scheme-details-input-box">
          <Box className="schemes-form">
            <Box
              sx={{ display: "flex", flexDirection: "column", rowGap: "2.5rem" }}
            >
              <>
                {Object.entries(extractedSchemas).map(([key, property]) => (
                  <FormComponent
                    scheme={property}
                    schemeName={steps[key]}
                    {...props}
                  />
                ))}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <CustomButton
                    color={ButtonColor.SECONDARY}
                    variant="outlined"
                    className="scheme-form-cancel-button"
                    onClick={handlePreviousClick}
                  >
                    {selectedSource
                      ? `${t("schemes.previous")}`
                      : `${t("schemes.cancel")}`}
                  </CustomButton>
                  {
                    <CustomButton onClick={handlePreviewClick}>
                      {t("schemes.preview")}
                    </CustomButton>
                  }
                </Box>
              </>
            </Box>
          </Box>
        </Box>
      )}
      {previewClick && isFormValid && (
        <PreviewFormPage
          mainSchemeId={mainSchemeId}
          schemeId={schemeId}
          methods={methods}
          handleBackClick={setPreviewClick}
        />
      )}
    </>
  );
}

export default SchemeMainForm;
