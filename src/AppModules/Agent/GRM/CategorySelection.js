import { Box, TextField, Typography, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdmsService } from "../../../services/MDMS";
import { TENANT_ID } from "../../../components/Utils";
import { CustomDropdown } from "../../PGR/ComplaintsInbox";
import TypeSelectComponent from "../../../components/TypeSelectComponent";

const categories = [
  {
    type: "Government services related",
    icon: `grm-govt-service.svg`,
  },
  {
    type: "Private sector services related",
    icon: `grm-private-service.svg`,
  },
];

function CategorySelection({
  formData,
  setFormData,
  preview,
  errors,
  setErrors,
  isMobile,
}) {
  const [dropdownOptions, setDropdownOptions] = useState([]);

  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";

  const getCategoryData = async () => {
    const serviceDefs = await MdmsService.getServiceDefs(TENANT_ID, "PGR");
    setDropdownOptions(serviceDefs);
  };

  const subCategoryOptions = useMemo(() => {
    if (!dropdownOptions || !formData.category) return [];

    return dropdownOptions
      .filter((option) => option.category === formData.category)
      .filter(
        (option, index, self) =>
          index === self.findIndex((t) => t.subCategory === option.subCategory)
      );
  }, [dropdownOptions, formData.category]);

  const subSubCategoryOptions = useMemo(() => {
    if (!dropdownOptions || !formData.subCategory) return [];

    return dropdownOptions.filter(
      (option) => option.subCategory === formData.subCategory.subCategory
    );
  }, [dropdownOptions, formData.subCategory]);

  const handleCategoryChange = (type) => {
    if (errors.hasOwnProperty("category")) {
      const newErrors = { ...errors };
      delete newErrors["category"];
      setErrors(newErrors);
    }
    setFormData({
      ...formData,
      category: type,
      subCategory: null,
      subSubCategory: null,
    });
  };

  const handleSubCategoryChange = (value) => {
    let updatedData = { ...formData, subCategory: value };

    if (
      formData.subSubCategory !== null &&
      formData?.subCategory?.subCategory !== value?.subCategory
    )
      updatedData = { ...updatedData, subSubCategory: null };

    setFormData(updatedData);
    if (errors.hasOwnProperty("subCategory")) {
      const newErrors = { ...errors };
      delete newErrors["subCategory"];
      setErrors(newErrors);
    }
  };

  const handleSubSubCategoryChange = (value) => {
    setFormData({ ...formData, subSubCategory: value });
    if (errors.hasOwnProperty("subSubCategory")) {
      const newErrors = { ...errors };
      delete newErrors["subSubCategory"];
      setErrors(newErrors);
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  return (
    <Box className="grm-form-inner-cards-container">
      <Box className="grm-form-inner-card">
        <Typography
          variant={isMobile ? "subtitle2" : "h5"}
          className="grm-form-inner-card-header"
        >
          {t("agentGrm.selectCategoryType")}
        </Typography>
        <Box className="flex flex-col justify-center sm:justify-start sm:flex-row gap-[24px] sm:mt-[16px]">
          {categories.map((item) => (
            <TypeSelectComponent
              id={item.type}
              text={item.type}
              svgPath={item.icon}
              selected={formData?.category}
              setSelected={handleCategoryChange}
            />
          ))}
        </Box>
        {errors?.category && (
          <Typography
            variant="caption"
            color={isDarkTheme ? "#F8CACA" : "#d32f2f"}
          >
            {t(errors.category)}
          </Typography>
        )}
      </Box>
      <Box className="grm-form-inner-card">
        <Typography
          className="grm-form-inner-card-header"
          variant={isMobile ? "subtitle2" : "h5"}
        >
          {t("agentGrm.selectSubCategoryType")}
        </Typography>
        <Box className="flex flex-col lg:flex-row gap-3 sm:w-4/5 sm:mt-[16px]">
          <Box className="w-full">
            <Typography className="support-input-field-label">
              {t("agentGrm.COMMON_SUB_CATEGORY")}{" "}
              <span className="required-asterisk">*</span>
            </Typography>
            <CustomDropdown
              id="support-issue-category"
              options={subCategoryOptions}
              getOptionLabel={(option) => t(option.subCategory)}
              size="small"
              renderInput={(params) => (
                <TextField {...params} placeholder={t("COMMON_SELECT")} />
              )}
              onChange={(event, newValue) => handleSubCategoryChange(newValue)}
              disabled={preview || !formData?.category}
              value={formData.subCategory}
            />
            {errors?.subCategory && (
              <Typography
                variant="caption"
                color={isDarkTheme ? "#F8CACA" : "#d32f2f"}
              >
                {t(errors.subCategory)}
              </Typography>
            )}
          </Box>
          <Box className="w-full">
            <Typography className="support-input-field-label">
              {t("agentGrm.COMMON_SUB_SUB_CATEGORY")}{" "}
              <span className="required-asterisk">*</span>
            </Typography>
            <CustomDropdown
              id="support-issue-category"
              options={subSubCategoryOptions}
              getOptionLabel={(option) => t(option.name)}
              size="small"
              renderInput={(params) => (
                <TextField {...params} placeholder={t("COMMON_SELECT")} />
              )}
              onChange={(event, newValue) =>
                handleSubSubCategoryChange(newValue)
              }
              disabled={preview || !formData?.subCategory}
              value={formData.subSubCategory}
            />
            {errors?.subSubCategory && (
              <Typography
                variant="caption"
                color={isDarkTheme ? "#F8CACA" : "#d32f2f"}
              >
                {t(errors.subSubCategory)}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default CategorySelection;
