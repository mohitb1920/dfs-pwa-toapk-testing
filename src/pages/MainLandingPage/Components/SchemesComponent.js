import React from "react";
import useSchemesData from "../../../Hooks/useSchemesData";
import { Box, Button, CircularProgress, Container } from "@mui/material";
import { SchemesList } from "../../../AppModules/Schemes/SchemesList";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../Styles/SchemesComponent.css";

export const SchemesComponent = ({ isMobile }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  let { data: schemes, isLoading } = useSchemesData({});

  if (isLoading)
    return (
      <Box className="min-h-[1100px] flex justify-center items-center">
        <CircularProgress />
      </Box>
    );
  const onViewAllSchemes = () => {
    navigate(`${window?.contextPath}/schemes`);
  };

  return (
    <Container variant="primary" className="mainContainerSchemes">
      <Box className="inner-box-screen2 mainBoxSchemes max-sm:px-1">
        <SchemesList
          data={schemes ?? []}
          isSchemesPage={false}
          minHeight={"30vh"}
          isMobile={isMobile}
        />
        <Button
          variant="primary"
          className="schemesviewAll"
          id="knowMore"
          type="button"
          onClick={onViewAllSchemes}
        >
          {t("ViewAllSchemes")}
        </Button>
      </Box>
    </Container>
  );
};
