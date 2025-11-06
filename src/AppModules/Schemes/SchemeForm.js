import { Box, Button } from "@mui/material";
import { useRef, useState } from "react";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import {  extractSchemasTest, getCurrentLanguage, TENANT_ID } from "../../components/Utils";
import { useTranslation } from "react-i18next";
import "../../styles/Schemes.css";
import FormComposer from "../../components/Form/FormComposer";
import PreviewPage from "./PreviewPage";
import useSpecificSchemeData from "../../Hooks/useSpecificSchemeData";
import MappingBackend from "./Mapping/MappingBackend";
import applyScheme from "./Mapping/submitScheme";
import CustomModal from "../../components/CustomModal";
import SuccesApplyComponent from "./SuccesApplyComponent";
import { useLocalizationStore } from "../../Hooks/Store";
function SchemeForm({schemeId,farmerData}) {
  const [activeStep, setActiveStep] = useState(0);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const steps = [];
  const [applicationType, setApplicationType] = useState(null);
  const formRef = useRef(null);
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(false);


  let { data: scheme, isLoading, refetch } = useSpecificSchemeData(schemeId);
  const stateCode = TENANT_ID;
  const moduleCode = [schemeId];
  const languagef = getCurrentLanguage();
  const { data} = useLocalizationStore({stateCode,  moduleCode, languagef});
  if (!farmerData) return <div>Empty</div>;
  if (!scheme || !scheme[schemeId]) {
    return <div>Empty</div>;
  }

  const selectedScheme = scheme[schemeId][0];

  if (!selectedScheme) {
    return <div>Empty</div>;
  }

  
  const formFields2 = selectedScheme.formFields2;
  const formFields1 = selectedScheme.formFields;

  const handleSchemeSubmit =  () => {
    const storedData = localStorage.getItem(schemeId + "formData");
    const mainId = localStorage.getItem("farmer." + schemeId + ".mainId");
    const farmerTokendd = localStorage.getItem("farmer.farmerInfo");
    const farmerToken = JSON.parse(farmerTokendd);
    let filledData;

    if (schemeId === "SCHEME001") {
      if (storedData && mainId) {
        filledData = MappingBackend(
          JSON.parse(storedData),
          mainId,
          schemeId,
          farmerData,
          farmerToken
        );
      }
    }

    try{
       applyScheme(filledData);
    }
    catch(error){
      console.error(error);
    }
    setModalOpen(true);
  };
  const handleSubmit = () => {
    if (formRef.current && formRef.current.submit) {
      formRef.current.submit();
    }
  };
  const handleNext = () => {
    handleSubmit();
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSteps = (jsonSchema, step, totalSchemas) => {
    if (step === "Preview") {
      return (
        <>
          <PreviewPage
            data={totalSchemas}
            dataNames={steps}
            language={languagef==="hi_IN"?"hi":"en"}
            schemeId={selectedScheme.id}
          />
        </>
      );
    }
    return (
      <>
        <FormComposer
          scheme={jsonSchema}
          schemeId={selectedScheme.id}
          schemeName={step}
          farmerData={farmerData}
          language={languagef==="hi_IN"?"hi":"en"}
          ref={formRef}
          setIsSubmitting={setIsSubmitting}
          setHasErrors={setHasErrors}
          setMoveAhead={setActiveStep}
          handleApplicationType={setApplicationType}
          
        />
      </>
    );
  };

  const handleModalClose = () => {    
    setModalOpen(false);
  };
  const closeApplicationForm = () => {
    navigate(`${window.contextPath}/schemes`);
  };

  const firstExtract = extractSchemasTest(formFields1, steps);
  const extractedSchemas = extractSchemasTest(
    formFields2,
    steps,
    applicationType
  );
  const combinedSchemas = [...firstExtract, ...extractedSchemas];

  if (steps.length !== 0) steps.push("Preview");
  return (
    <>
    <Box className="application-form-body">


      <Box sx={{ minHeight: "50vh" }}>
        {handleSteps(
          combinedSchemas[activeStep],
          steps[activeStep],
          combinedSchemas
        )}
      </Box>
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
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSchemeSubmit}
            className="navigation-button submit"
            data-testid="save-button"
          >
            {t("COMMON_SUBMIT")}
          </Button>
        ) : (
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
        )}
      </Box>
    </Box>
    <CustomModal handleModalClose={handleModalClose}
        open={modalOpen}
        dialogHeader={"Scheme Application"}
        maxWidth="xs">
          <SuccesApplyComponent schemeName={selectedScheme.schemeName[`title-${languagef==="hi_IN"?"hi":"en"}`] || selectedScheme.schemeName[`title`]}/>
        </CustomModal>
    </>
  );
}

export default SchemeForm;
