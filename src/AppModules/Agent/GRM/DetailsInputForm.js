import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import SupportFileUploader from "../../GRM9/SupportFileUploader";
import FilesRenderer from "../../PGR/FilesRenderer";
import FarmerDetailsCard from "../../../components/FarmerDetailsCard";
import CustomTextDispayBox from "../../../components/CustomTextDispayBox";
import { CustomTextField } from "../../../components/CustomComponents";

const categories = {
  category: "agentGrm.CATEGORY",
  subCategory: "agentGrm.SUB_CATEGORY",
  subSubCategory: "agentGrm.GRIEVANCE_SUBJECT",
};

function DetailsInputForm({
  formData,
  setFormData,
  preview,
  errors,
  setSelectedFiles,
  selectedFiles,
  farmerDetails,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";

  const handleInputChange = (event) => {
    const input = event.target.value;
    setFormData({
      ...formData,
      description: input,
    });
  };

  return (
    <Box className="flex flex-col gap-[40px]">
      <Box className="grm-form-inner-cards-container">
        <FarmerDetailsCard farmerDetails={farmerDetails} />
      </Box>
      <Box className="grm-form-inner-cards-container">
        <Box className="grm-form-inner-card">
          <Box className="flex flex-col lg:flex-row gap-[24px]">
            {Object.entries(categories).map(([key, value]) => (
              <Box key={key} className="xl:min-w-[336px]">
                <Typography className="grm-form-category-selected-header">
                  {t(value)}
                </Typography>
                <CustomTextDispayBox>
                  {key === "category" && t(formData?.[key])}
                  {key === "subCategory" && t(formData?.[key]?.subCategory)}
                  {key === "subSubCategory" && t(formData?.[key]?.name)}
                </CustomTextDispayBox>
              </Box>
            ))}
          </Box>
        </Box>
        <Box className="grm-form-inner-card">
          <Typography className="grm-form-inner-card-header">
            {t(`${preview ? "COMMON_DESCRIPTION" : "agentGrm.ADD_DETAILS"}`)}{" "}
            <span className="required-asterisk">*</span>
          </Typography>
          <CustomTextField
            placeholder={t("agentGrm.WRITE_COMMENTS")}
            id="outlined-comments"
            size="small"
            fullWidth
            multiline
            minRows={3}
            onChange={(e) => handleInputChange(e)}
            value={formData.description || ""}
            inputProps={{
              maxLength: 1024,
            }}
            helperText={
              errors?.description
                ? t("REMARKS_EMPTY_ERROR")
                : `${formData.description?.length ?? 0}/1024`
            }
            disabled={preview}
            error={errors?.description}
            isDarkTheme={isDarkTheme}
          />
        </Box>
        {!preview && (
          <Box className="grm-form-inner-card">
            <Typography className="grm-form-inner-card-header">
              {t("agentGrm.UPLOAD_FILES")}
            </Typography>
            <SupportFileUploader
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
            />
          </Box>
        )}
        {(selectedFiles.length > 0 || preview) && (
          <Box className="grm-form-inner-card">
            <Typography className="grm-form-inner-card-header">
              {t("agentGrm.SELECTED_FILES")}
            </Typography>
            {preview && selectedFiles.length === 0 && (
              <Typography className="support-no-file-selected">
                {t("COMMON_NO_FILE_SELECTED")}
              </Typography>
            )}
            <FilesRenderer
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              preview={preview}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default DetailsInputForm;
