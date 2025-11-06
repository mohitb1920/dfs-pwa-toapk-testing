import React, { useEffect } from "react";
import {
  aboutScheme,
  schemeBenefits,
  schemeEligibility,
} from "../../components/Constants";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ColorButton = styled(Button)(({ theme }) => ({
  color: "#fff",
  padding: "5px 80px",
  fontSize: "1rem",
  backgroundColor: "#4CAF50",
  borderRadius: 20,
  textTransform: "none",
  verticalAlign: "top",
  "&:hover": {
    backgroundColor: "#367c39",
  },
}));

function SchemeDetails() {
  const { t } = useTranslation();
  const selectedScheme = useSelector(
    (state) => state.schemesDetails.selectedScheme
  );

  const navigate = useNavigate();

  const onApplyClick = () => {
    navigate("/scheme/application-form");
  };

  useEffect(() => {}, [selectedScheme]);

  return (
    <div className="scheme-details-layout">
      <div className="scheme-details-header">{selectedScheme.title}</div>
      <div className="scheme-details-content">
        <div className="scheme-content-header">About the Scheme:</div>
        <div className="scheme-content-content">{aboutScheme}</div>
        <div className="scheme-content-header">Benefits:</div>
        <div className="scheme-content-content">{schemeBenefits}</div>
        <div className="scheme-content-header">Eligibility Criteria:</div>
        <div className="scheme-content-content">{schemeEligibility}</div>
      </div>
      <div className="button-container">
        <ColorButton variant="contained" onClick={onApplyClick}>
          {t("schemes.apply")}
        </ColorButton>
      </div>
    </div>
  );
}

export default SchemeDetails;
