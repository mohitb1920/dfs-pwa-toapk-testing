import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import SchemeTitleHeader from "./SchemeTitleHeader";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import SchemeDBTInput from "./SchemeDBTInput";
import { useEffect, useState } from "react";
import SchemeFormField from "./SchemeFormField";
import { getFarmerprofile } from "../../services/CitizenServices";
import { NewsSkeletonLoader } from "../../pages/MainLandingPage/SkeletonLoader/SkeletonLoaders";

function SchemePageForm() {
  const location = useLocation();
  const handleGoBack = () => {
    window.history.back();
  };
  const {
    mainId,
    schemeId,
    selectedScheme,
    level,
    startDate,
    endDate,
    active,
  } = location.state || {};
  if (!schemeId) handleGoBack();
  const scheme = JSON.parse(selectedScheme);
  const [farmerData, setFarmerData] = useState();
  const [verifyFarmer, setVerifyFarmer] = useState(localStorage.getItem("DfsWeb.isCitizenUser") === "true");
  const [mainSchemeId, setMainSchemeId] = useState(mainId);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const response = await getFarmerprofile();
        if (isMounted) {
          setFarmerData(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (localStorage.getItem("DfsWeb.isCitizenUser") === "true") {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Box className="schemes-page">
      <Box className="breadcrumbs-container">
        <BasicBreadcrumbs
          schemeId={schemeId}
          level={level}
          startDate={startDate}
          endDate={endDate}
          active={active}
          mainSchemeId={mainId}
        />
      </Box>
      <Box className="scheme-details-main">
        <Box className="scheme-details-container">
          <SchemeTitleHeader
            schemeId={schemeId}
            level={level}
            scheme={scheme}
            startDate={startDate}
            endDate={endDate}
            active={active}
          />
        </Box>

        {!verifyFarmer && (
          <Box className="scheme-details-input-box">
            <SchemeDBTInput
              schemeId={schemeId}
              handleVerify={setVerifyFarmer}
              handleFarmerData={setFarmerData}
            />
          </Box>
        )}

        {verifyFarmer && (
          <>
            {farmerData ? (
              <SchemeFormField
                mainSchemeId={mainSchemeId}
                schemeId={schemeId}
                farmerData={farmerData}
              />
            ) : (
              <NewsSkeletonLoader/>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

export default SchemePageForm;
