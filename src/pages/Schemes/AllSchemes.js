import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedSchemeData } from "../../Modules/Actions/schemesActions";
import { Button, Typography } from "@mui/material";
import { farmerSchemesList } from "../../components/Constants";
import { useTranslation } from "react-i18next";

function AllSchemes(props) {
  const { schemeTypes } = props;
  const [showMoreSchemes, setShowMoreSchemes] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onMoreClick = (scheme) => {
    dispatch(setSelectedSchemeData(scheme));
    navigate("/schemes/scheme-details");
  };

  const schemeCard = (scheme, index) => {
    return (
      <div className="scheme-card" key={index}>
        <Typography className="scheme-header">{scheme.title}</Typography>
        <Typography className="scheme-summary">{`${scheme.summary.substring(
          0,
          180
        )} ...`}</Typography>
        <div className="more-container">
          <Typography className="dbt-text">
            Last DBT Payment: {scheme.date}
          </Typography>
          <div
            className="more-button"
            data-testid="more-info-button"
            onClick={() => onMoreClick(scheme)}
          >
            {t("schemes.more")}
          </div>
        </div>
      </div>
    );
  };

  const schemesListRender = () => {
    const displaySchemes = farmerSchemesList.slice(0, 3);
    return <>{displaySchemes.map((item, index) => schemeCard(item, index))}</>;
  };

  const moreSchemesListRender = () => {
    const moreSchemes = farmerSchemesList.slice(3, farmerSchemesList.length);
    return <>{moreSchemes.map((item, index) => schemeCard(item, index))}</>;
  };

  return (
    <div style={{ width: "100%" }}>
      {schemeTypes.map((scheme, index) => (
        <div className="scheme-details" key={scheme}>
          <div className="scheme-category">
            <Typography className="scheme-category-text header-hindi-text">
              {t(`schemes.${scheme}`)}
            </Typography>
          </div>
          <div className="schemes-list">
            {schemesListRender()}
            {showMoreSchemes !== scheme && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  variant="outlined"
                  className="more-schemes-button"
                  data-testid="more-schemes-button"
                  onClick={() => {
                    setShowMoreSchemes(scheme);
                  }}
                >
                  +6 {t("schemes.more")}
                </Button>
              </div>
            )}
            {showMoreSchemes === scheme && (
              <div>
                <div className="schemes-list">{moreSchemesListRender()}</div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{
                      padding: "3px 25px",
                      borderRadius: "12px",
                      marginTop: "-15px",
                      marginBottom: "15px",
                    }}
                    onClick={() => {
                      setShowMoreSchemes("");
                    }}
                    data-testid="close-button"
                  >
                    {t("schemes.close")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AllSchemes;
