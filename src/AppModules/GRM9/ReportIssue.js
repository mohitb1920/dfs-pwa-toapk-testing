import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomTextField } from "../../pages/Announcements/AnnouncementConfigurator";
import { CustomDropdown } from "../PGR/ComplaintsInbox";
import { MdmsService } from "../../services/MDMS";
import { TENANT_ID } from "../../components/Utils";
import FilesRenderer from "../PGR/FilesRenderer";
import VerifyOtpModal from "./VerifyOtpModal";
import { customExceptions } from "../../constants";
import { sendOtp, validateDBTLinkStatus } from "../../services/loginService";
import { PGRService } from "../../services/PGR";
import { uploadFiles } from "../PGR/ComplaintDetails";
import SupportFileUploader from "./SupportFileUploader";
import { useNavigate } from "react-router-dom";
import { SchemeService } from "../../services/Schemes";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateForm = (formData, category, subCategory, userType) => {
  let errorData = {};

  const validationRules = [
    { field: formData.fullName, name: "fullName" },
    {
      field: formData.contact,
      name: "contact",
      condition: formData.contact?.length === 10,
    },
    { field: formData.description, name: "description" },
    { field: category, name: "category", condition: category === null },
    {
      field: subCategory,
      name: "subCategory",
      condition: subCategory === null,
    },
    {
      field: userType === "CITIZEN" && formData.dbtUser,
      name: "dbtUser",
      condition: userType === "CITIZEN",
    },
    {
      field:
        userType === "CITIZEN" &&
        formData.dbtUser === "yes" &&
        formData.dbtId.length === 13,
      name: "dbtId",
      condition: userType === "CITIZEN" && formData.dbtUser === "yes",
    },
    {
      field:
        userType === "EMPLOYEE" &&
        formData.email &&
        emailRegex.test(formData.email),
      name: "email",
      condition: userType === "EMPLOYEE",
    },
  ];

  validationRules.forEach(({ field, name, condition = true }) => {
    if (name === "contact" ? !field || !condition : !field && condition) {
      errorData = { ...errorData, [name]: true };
    }
  });

  return errorData;
};

export const onSendOtp = async ({
  formData,
  userType,
  setLoading,
  setOtp,
  setOtpSuccess,
  setWaitTime,
  setOtpError,
  setSubmissionStatus,
  t,
  agentOtp = false,
}) => {
  setLoading(true);
  setSubmissionStatus({
    message: "",
    success: false,
    submitted: false,
  });
  const requestData = {
    otp: {
      userType,
      tenantId: TENANT_ID,
      ...formData,
    },
  };
  const response = agentOtp
    ? await SchemeService.otpFarmerSchemeGet(requestData)
    : await sendOtp(requestData, true);
  if (
    response?.data?.isSuccessful ||
    response?.ResponseInfo?.status === "successful"
  ) {
    setOtpSuccess(true);
    setOtpError("");
    setWaitTime(30);
  } else {
    const { data } = response;
    setOtpError(
      t(customExceptions[data?.error?.fields?.[0]?.code]) ||
        data?.Errors?.[0]?.code ||
        "SOMETHING_WENT_WRONG"
    );
  }
  setOtp("");
  setLoading(false);
};

export const vaidateDBTMobileLink = async (
  formData,
  setError,
  setDbtLoading
) => {
  setDbtLoading(true);
  const requestData = {
    RequestInfo: {
      apiId: "string",
      ver: "string",
      ts: 0,
      action: "string",
      did: "string",
      key: "string",
      msgId: "string",
      requesterId: "string",
      authToken: null,
    },
    mobileNumber: formData.contact,
    dbtId: formData?.dbtId,
  };
  const response = await validateDBTLinkStatus(requestData, true);
  const { data } = response;
  if (!data?.isLinked) {
    setError({
      error: true,
      message: data?.errorMessage?.includes("No DBT User Found")
        ? "COMMON_NO_DBT_USER_FOUND"
        : "COMMON_DBT_NOT_LINKED",
    });
  }
  setDbtLoading(false);
  return data?.isLinked ?? false;
};

function ReportIssue() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(null);
  const [userType, setUserType] = useState("CITIZEN");
  const [preview, setPreview] = useState(false);
  const [formData, setFormdata] = useState({});
  const [errors, setErrors] = useState({});
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otp, setOtp] = useState("");
  const [waitTime, setWaitTime] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    success: false,
    submitted: false,
  });
  const [dbtVerificationError, setDbtVerificationError] = useState({
    error: false,
    message: "",
  });
  const [dbtLoading, setDbtLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const getDropdownOptions = async () => {
      const response = await MdmsService.getTechSupportDropdownOptions(
        TENANT_ID,
        "PGR"
      );
      const { ServiceDefs = [] } = response?.["RAINMAKER-PGR"] || {};
      setDropdownOptions(ServiceDefs);
    };

    getDropdownOptions();
  }, []);

  const handleCategoryChange = (value) => {
    setCategory(value);
    if (errors.hasOwnProperty("category")) {
      const newErrors = { ...errors };
      delete newErrors["category"];
      setErrors(newErrors);
    }
    if (subCategory !== null && category?.category !== value?.category)
      setSubCategory(null);
  };

  const handleSubCategoryChange = (value) => {
    setSubCategory(value);
    if (errors.hasOwnProperty("subCategory")) {
      const newErrors = { ...errors };
      delete newErrors["subCategory"];
      setErrors(newErrors);
    }
  };

  const resetFormData = () => {
    setSubCategory(null);
    setCategory(null);
    setFormdata({});
    setErrors({});
    setSelectedFiles([]);
  };

  const handleUserChange = (type) => {
    resetFormData();
    setPreview(false);
    setUserType(type);
    setSubmissionStatus({
      message: "",
      success: false,
      submitted: false,
    });
  };

  const handleInputChange = (event, fieldName) => {
    let input = "";
    if (
      (fieldName === "contact" || fieldName === "dbtId") &&
      event.target.value.match(/\D/)
    ) {
      event.preventDefault();
    } else {
      input = event.target.value;
      if (errors.hasOwnProperty(fieldName)) {
        const newErrors = { ...errors };
        delete newErrors[fieldName];
        setErrors(newErrors);
      }
    }
    if (
      (fieldName === "contact" || fieldName === "dbtId") &&
      dbtVerificationError.error
    ) {
      setDbtVerificationError({ error: false, message: "" });
    }
    setFormdata((prevState) => ({
      ...prevState,
      [fieldName]: input,
    }));
  };

  const handleClose = () => {
    setOpenOtpModal(false);
    if (submissionStatus.success) {
      navigate(`${window.contextPath}/technical-support/report-track-issue`);
    }
    setPreview(false);
    setSubmissionStatus({
      message: "",
      success: false,
      submitted: false,
    });
  };

  const handleSubmit = async () => {
    const { contact, fullName, description } = formData;
    setLoading(true);
    let uploadedFiles = [];
    if (selectedFiles.length > 0) {
      uploadedFiles = await uploadFiles(
        selectedFiles,
        {
          message: "",
          success: false,
          submitted: true,
        },
        setSubmissionStatus
      );
    }
    if (uploadedFiles?.error) {
      setLoading(false);
      return;
    }
    const grievanceDetails = {
      RequestInfo: {
        apiId: "Rainmaker",
        action: "",
        did: 1,
        key: "",
        msgId: "20170310130900|en_IN",
        requesterId: "",
        ts: 1513579888683,
        ver: ".01",
        authToken: null,
        userInfo: {
          type: userType,
        },
      },
      service: {
        tenantId: TENANT_ID,
        userType,
        serviceCode: subCategory.serviceCode,
        description,
        businessService: "GRM9",
        source: "web",
        name: fullName,
        mobileNumber: contact,
        selfComplaint: true,
        otpReference: otp,
        email: formData?.email ?? null,
      },
      workflow: {
        action: "APPLY",
        comments: description,
        verificationDocuments: uploadedFiles.map((file, index) => ({
          fileStoreId: file.fileStoreId,
          documentType: selectedFiles[index]?.type,
        })),
      },
    };
    const response = await PGRService.createSupportGrievance(grievanceDetails);
    if (response?.status === 200) {
      setSubmissionStatus({
        success: true,
        message: "SUPPORT_GRM_SUCCESS",
        submitted: true,
        response: response.data.ServiceWrappers?.[0],
      });
    } else {
      setSubmissionStatus({
        success: false,
        message:
          response?.data?.Errors?.[0]?.code ?? "SUPPORT_GRM_CREATE_ERROR",
        submitted: true,
      });
      setOtp("");
    }
    setLoading(false);
  };

  const callSendOtp = async () => {
    await onSendOtp({
      formData: {
        mobileNumber: formData.contact,
        type: "TECH_SUPPORT_WEB",
      },
      userType,
      setLoading,
      setOtp,
      setOtpSuccess,
      setWaitTime,
      setOtpError,
      setSubmissionStatus,
      t,
    });
  };

  const handleButtonClick = async () => {
    if (!preview) {
      let correctedFormdata = { ...formData };
      if (formData.hasOwnProperty("description")) {
        correctedFormdata = {
          ...formData,
          description: formData.description.trim(),
        };
      }
      if (formData.hasOwnProperty("fullName")) {
        correctedFormdata = {
          ...formData,
          fullName: formData.fullName.trim(),
        };
      }
      setFormdata(correctedFormdata);
      const errorData = validateForm(
        correctedFormdata,
        category,
        subCategory,
        userType
      );
      setErrors(errorData);
      if (Object.keys(errorData).length === 0) {
        setPreview(true);
      }
    } else {
      let isMobileLinked = false;
      if (userType === "CITIZEN" && formData?.dbtUser === "yes") {
        isMobileLinked = await vaidateDBTMobileLink(
          formData,
          setDbtVerificationError,
          setDbtLoading
        );
      } else {
        isMobileLinked = true;
      }
      if (isMobileLinked) {
        setDbtVerificationError({ error: false, message: "" });
        setOpenOtpModal(true);
        await callSendOtp();
      }
    }
  };

  const categoryOptions = useMemo(() => {
    return dropdownOptions
      .filter(
        (option, index, self) =>
          index === self.findIndex((t) => t.category === option.category)
      )
      .sort((a, b) => {
        const orderA = a.displayOrder ?? Infinity; // Place missing displayOrder at the end
        const orderB = b.displayOrder ?? Infinity;
        return orderA - orderB; // Ascending order
      });
  }, [dropdownOptions]);

  const subCategoryOptions = useMemo(() => {
    return dropdownOptions
      .filter((option) => option.category === category?.category)
      .sort((a, b) => {
        const orderA = a.displayOrder ?? Infinity; // Handle missing displayOrder
        const orderB = b.displayOrder ?? Infinity;
        return orderA - orderB; // Ascending order
      });
  }, [category, dropdownOptions]);
  

  return (
    <Box className="report-issue-page-container">
      <Box className="ml-3 tech-support-page-logo">
        <img
          src={`${window.contextPath}/assets/reportissuebanner.svg`}
          alt=""
          style={{ maxHeight: "80vh" }}
        />
      </Box>
      <Box className="report-issue-form">
        <Typography>{t("SUPPORT_WHO_ARE_YOU")}?</Typography>
        <Box className="flex gap-2 mt-1 flex-wrap">
          <Box
            className={`support-user-type-card ${
              userType === "CITIZEN" && "support-user-selected"
            }`}
            onClick={() => handleUserChange("CITIZEN")}
          >
            <img
              src={`${window.contextPath}/assets/supportfarmerlogo.svg`}
              alt=""
              style={{ width: "60px" }}
            />
            <Typography ml={2}>{t("SUPPORT_FARMER")}</Typography>
          </Box>
          <Box
            className={`support-user-type-card ${
              userType === "EMPLOYEE" && "support-user-selected"
            }`}
            onClick={() => handleUserChange("EMPLOYEE")}
          >
            <img
              src={`${window.contextPath}/assets/supportofficiallogo.svg`}
              alt=""
              style={{ width: "60px" }}
            />
            <Typography ml={2}>{t("SUPPORT_GOVT_OFFICIAL")}</Typography>
          </Box>
        </Box>
        <Box className="mt-2">
          <Box className="flex gap-2 flex-wrap">
            <Box className="support-input-item-flex">
              <Typography className="support-input-field-label">
                {t("COMMON_FULL_NAME")}*
              </Typography>
              <CustomTextField
                placeholder={t("COMMON_ENTER_FULLNAME")}
                id="outlined-full-name"
                size="small"
                fullWidth
                onChange={(e) => handleInputChange(e, "fullName")}
                value={formData.fullName || ""}
                disabled={preview}
                helperText={
                  errors.fullName && t("COMMON_NAME_VALIDATION_ERROR")
                }
                error={errors.fullName}
              />
            </Box>
            <Box className="support-input-item-flex">
              <Typography className="support-input-field-label">
                {t("COMMON_MOBILE_NUMBER")}*
              </Typography>
              <CustomTextField
                placeholder={t("COMMON_ENTER_MOBILE_NUMBER")}
                id="outlined-mobile"
                size="small"
                fullWidth
                onChange={(e) => handleInputChange(e, "contact")}
                value={formData.contact || ""}
                inputProps={{
                  maxLength: 10,
                }}
                helperText={
                  errors.contact && t("COMMON_MOBILE_VALIDATION_ERROR")
                }
                error={errors.contact}
                disabled={preview}
              />
            </Box>
          </Box>
          {userType === "CITIZEN" && (
            <Box>
              <Typography className="support-input-field-label">
                {t("SUPPORT_DO_YOU_HAVE_DBT_ID")}?
              </Typography>
              <FormControl>
                <RadioGroup
                  aria-labelledby="dbt-buttons-group-label"
                  name="radio-buttons-group"
                  row
                  onChange={(e) => handleInputChange(e, "dbtUser")}
                  value={formData?.dbtUser || ""}
                >
                  <FormControlLabel
                    value="yes"
                    control={
                      <Radio
                        color="success"
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 32,
                          },
                        }}
                        disabled={preview}
                      />
                    }
                    label={t("COMMON_YES")}
                  />
                  <FormControlLabel
                    value="no"
                    control={
                      <Radio
                        color="success"
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: 32,
                          },
                        }}
                        disabled={preview}
                      />
                    }
                    label={t("COMMON_NO")}
                  />
                </RadioGroup>
              </FormControl>
              {formData?.dbtUser === "yes" && (
                <>
                  <Box>
                    <Typography className="support-input-field-label">
                      {t("COMMON_DBT_ID")}*
                    </Typography>
                    <CustomTextField
                      placeholder={t("ENTER_DBT_NUMBER")}
                      id="outlined-dbt-number"
                      size="small"
                      fullWidth
                      inputProps={{
                        maxLength: 13,
                      }}
                      onChange={(e) => handleInputChange(e, "dbtId")}
                      value={formData.dbtId || ""}
                      disabled={preview}
                    />
                  </Box>
                  {dbtVerificationError.error && (
                    <Typography
                      color={"#d32f2f"}
                      sx={{ fontSize: "12px", mt: "-8px", mb: 1 }}
                    >
                      {t(dbtVerificationError.message)}
                    </Typography>
                  )}
                </>
              )}
              {(errors.dbtUser || errors.dbtId) && (
                <Box>
                  <Typography variant="caption" color={"#d32f2f"} ml={1.8}>
                    {errors.dbtUser
                      ? t("PLEASE_SELECT_ONE")
                      : errors.dbtId
                      ? t("DBT_ID_IS_REQUIRED")
                      : " "}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          {userType === "EMPLOYEE" && (
            <Box>
              <Typography className="support-input-field-label">
                {t("COMMON_EMAIL_ID")}*
              </Typography>
              <CustomTextField
                placeholder={t("COMMON_ENTER_MAIL_ID")}
                id="outlined-mail-id"
                size="small"
                fullWidth
                onChange={(e) => handleInputChange(e, "email")}
                value={formData.email || ""}
                helperText={errors.email && t("COMMON_EMAIL_VALIDATION_ERROR")}
                error={errors.email}
                disabled={preview}
              />
            </Box>
          )}
          <Box>
            <Typography className="support-input-field-label">
              {t("COMMON_CATEGORY")}*
            </Typography>
            <CustomDropdown
              id="support-issue-category"
              options={categoryOptions}
              getOptionLabel={(option) => t(option.category)}
              size="small"
              renderInput={(params) => (
                <TextField {...params} placeholder={t("COMMON_SELECT")} />
              )}
              onChange={(event, newValue) => handleCategoryChange(newValue)}
              disabled={preview}
              value={category}
            />
            {errors.category && (
              <Typography variant="caption" color={"#d32f2f"} ml={1.8}>
                {t("CATEGORY_VALIDATION_ERROR")}
              </Typography>
            )}
          </Box>
          <Box className="mt-2">
            <Typography className="support-input-field-label">
              {t("COMMON_SUB_CATEGORY")}*
            </Typography>
            <CustomDropdown
              id="support-issue-subCategory"
              options={subCategoryOptions}
              getOptionLabel={(option) => t(option.subCategory)}
              size="small"
              renderInput={(params) => (
                <TextField {...params} placeholder={t("COMMON_SELECT")} />
              )}
              onChange={(event, newValue) => handleSubCategoryChange(newValue)}
              disabled={category === null || preview}
              value={subCategory}
            />
            {errors.subCategory && (
              <Typography variant="caption" color={"#d32f2f"} ml={1.8}>
                {t("SUBCATEGORY_VALIDATION_ERROR")}
              </Typography>
            )}
          </Box>
          <Box mt={1}>
            <Typography className="support-input-field-label">
              {t("COMMON_DESCRIPTION")}*
            </Typography>
            <CustomTextField
              placeholder={t("WRITE_IN_BRIEF")}
              id="outlined-description"
              size="small"
              fullWidth
              multiline
              minRows={2}
              onChange={(e) => handleInputChange(e, "description")}
              value={formData.description || ""}
              inputProps={{
                maxLength: 1024,
              }}
              helperText={
                errors.description
                  ? t("REMARKS_EMPTY_ERROR")
                  : `${formData.description?.length ?? 0}/1024`
              }
              error={errors.description}
              disabled={preview}
            />
          </Box>
          {!preview && (
            <Box className="mb-2">
              <Typography className="support-input-field-label">
                {t("COMMON_UPLOAD_FILES")}
              </Typography>
              <SupportFileUploader
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
              />
            </Box>
          )}
          <Box>
            {preview && (
              <>
                <Typography className="support-input-field-label">
                  {t("COMMON_SELECTED_FILES")}
                </Typography>
                {selectedFiles.length === 0 && (
                  <Typography className="support-no-file-selected">
                    {t("COMMON_NO_FILE_SELECTED")}
                  </Typography>
                )}
              </>
            )}
            <FilesRenderer
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              preview={preview}
            />
          </Box>
          {dbtLoading && (
            <Box className="flex items-center justify-center h-20">
              <CircularProgress color="success" />
            </Box>
          )}
          <Box className="flex my-4">
            {preview && (
              <Button
                variant="contained"
                onClick={() => setPreview(false)}
                className="support-action-button-edit"
                disabled={dbtLoading}
              >
                &nbsp;&nbsp;&nbsp;&nbsp; {t("COMMON_EDIT")}
                &nbsp;&nbsp;&nbsp;&nbsp;
              </Button>
            )}
            <Button
              variant="contained"
              onClick={() => handleButtonClick()}
              className="support-action-button"
              disabled={dbtLoading}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;{" "}
              {preview ? t("COMMON_SUBMIT") : t("COMMON_PREVIEW")}
              &nbsp;&nbsp;&nbsp;&nbsp;
            </Button>
          </Box>
        </Box>
      </Box>
      <VerifyOtpModal
        open={openOtpModal}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        mobileNumber={formData.contact}
        userType={userType}
        loading={loading}
        otp={otp}
        setOtp={setOtp}
        waitTime={waitTime}
        setWaitTime={setWaitTime}
        otpSuccess={otpSuccess}
        otpError={otpError}
        onSendOtp={callSendOtp}
        submissionStatus={submissionStatus}
        setSubmissionStatus={setSubmissionStatus}
      />
    </Box>
  );
}

export default ReportIssue;
