import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import AssetsDetailCard from "./Components/AssetsDetailCard";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import { Box, Container, Typography } from "@mui/material";
import { useAssetsData } from "../../Hooks/useAssets";
import CustomButton from "../../components/Button/CustomButton";
import { ButtonColor, ButtonSize } from "../../components/Button/ButtonEnums";
import ActionConfirmationDialog from "../../components/ActionConfirmationDialog";
import { Facility } from "../../services/FacilityService";
import AgentConfirmationDialog from "../../components/AgentConfirmationModal";

function AssetsDetailPage({ isMobile }) {
  const l = useLocation();
  const location = JSON.parse(localStorage.getItem("DfsWeb.locationData"));
  const { data, categoryCode, category, isDataCleanup = false } = l.state || {};
  const [name, setName] = useState();
  const [open, setOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState(
    i18n.language === "en_IN" ? "en" : "hi"
  );
  let { data: categories, isLoading: loading } = useAssetsData({ language });

  const handleDeleteAsset = async () => {
    setOpen(false);
    setOpenDeleteModal(true);
    setDeleteLoading(true);
    const payload = { Facilities: [data] };
    const response = await Facility.delete(payload);
    if (response?.status === 202) {
      setDeleteLoading(false);
      setDeleteStatus(true);
    }
  };

  const onClose = () => {
    setOpenDeleteModal(false);
    if (deleteStatus) navigate(-1);
  };

  // assign category name and selected category
  useEffect(() => {
    if (categories != null) {
      let categoryName = "";
      categories?.some((data) => {
        if (category == null || category == data.superCategoryCode) {
          return data?.subCategories?.some((d) => {
            if (categoryCode == null || categoryCode == d.categorycode) {
              categoryName = d.category;
              return true;
            }
            return false;
          });
        }
        return false;
      });
      setName(categoryName);
    }
  }, [categories, category, language]);

  useEffect(() => {
    setLanguage(i18n.language === "en_IN" ? "en" : "hi");
  }, [i18n.language]);

  return (
    <Container variant="primary">
      <Box className="assets-page">
        <Box className="inner-box-screen">
          <Box className="breadcrumbs-container" sx={{ pb: "40px" }}>
            <BasicBreadcrumbs />
          </Box>
          {name != null && (
            <>
              {isDataCleanup && (
                <Box className="mb-3 flex justify-end">
                  <CustomButton
                    color={ButtonColor.PRIMARY}
                    size={ButtonSize.MEDIUM}
                    onClick={() => setOpen(true)}
                  >
                    {t("COMMON_DELETE")}
                  </CustomButton>
                </Box>
              )}
              <AssetsDetailCard
                assets={data}
                t={t}
                language={language}
                latitude={location?.latitude}
                longitude={location?.longitude}
                isDetailsPage={true}
                name={name}
                categoryId={categoryCode}
                isDataCleanup={isDataCleanup}
                isMobile={isMobile}
              />
            </>
          )}
        </Box>
      </Box>
      <ActionConfirmationDialog
        open={open}
        setOpen={setOpen}
        onContinueClick={handleDeleteAsset}
        actionHeader={"COMMON_DELETE"}
        warningText={"COMMON_DELETE_WARNING"}
        isDelete={true}
      />
      <AgentConfirmationDialog
        open={openDeleteModal}
        loading={deleteLoading}
        status={deleteStatus}
        t={t}
        onClose={onClose}
      >
        {!deleteLoading && (
          <Typography>
            {deleteStatus ? t("DELETE_SUCCESSFUL") : t("DELETE_FAILED")}
          </Typography>
        )}
      </AgentConfirmationDialog>{" "}
    </Container>
  );
}

export default AssetsDetailPage;
