import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import BasicBreadcrumbs from "../../../components/BreadCrumbsBar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./AgentGrm.css";
import AgentConfirmationDialog from "../../../components/AgentConfirmationModal";
import CategorySelection from "./CategorySelection";
import CustomButton from "../../../components/Button/CustomButton";
import { ButtonColor } from "../../../components/Button/ButtonEnums";
import DetailsInputForm from "./DetailsInputForm";
import { SchemeService } from "../../../services/Schemes";
import { customExceptions } from "../../../constants";
import { OtpInputRenderer } from "../../../components/FarmerDbtVerification";
import { uploadFiles } from "../../PGR/ComplaintDetails";
import { PGRService } from "../../../services/PGR";
import { dispatchNotification } from "../../../components/Utils";
import CustomStepper from "../../../components/CustomStepper";
import { grmSteps } from "./CreateComplaint";
import "../../../styles/AgentConfirmationDialog.css";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CopyToClipboard from "react-copy-to-clipboard";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import { ReactComponent as CopyToClipboardIcon } from "../../../assets/copy-to-clipboard.svg";

const getPayload = ({
  farmerData,
  formData,
  otp,
  uploadedFiles,
  selectedFiles,
}) => {
  const { identifiers, mobileNumber, userUuid, userId, address } =
    farmerData || {};
  const dbtData = identifiers?.find((item) => item.identifierType === "DBTID");
  const { subCategory } = formData;
  const verificationDocuments = uploadedFiles.map((file, index) => ({
    fileStoreId: file.fileStoreId,
    documentType: selectedFiles[index]?.type,
  }));
  const addressObj = address?.[0] || {};
  return {
    proxyRequest: {
      mobileNumber: null,
      dbtId: dbtData?.identifierId,
      payload: {
        service: {
          tenantId: "br",
          serviceCode: subCategory?.serviceCode,
          description: formData.description,
          additionalDetail: null,
          accountId: userUuid,
          businessService: subCategory?.workflow,
          source: "web", //to change later,
          address: {
            doorNo: addressObj?.doorNo || null,
            landmark: addressObj?.landmark || null,
            city: addressObj?.blockLG || null,
            district: addressObj?.districtLG,
            state: "br",
            country: "India",
            pincode: addressObj?.pincode || "",
            buildingName: addressObj?.buildingName || null,
            street: addressObj?.street || null,
            region: addressObj?.panchayatLG || null,
            locality: { code: addressObj?.villageLG || null },
            geoLocation: {
              latitude: addressObj?.latitude || null,
              longitude: addressObj?.longitude || null,
              additionalDetails: {},
            },
          },
          citizen: {
            id: userId,
            userName: mobileNumber,
            type: "CITIZEN",
            mobileNumber: mobileNumber,
            tenantId: "br",
            uuid: userUuid,
            active: true,
            name: "Ramesh",
          },
          selfComplaint: false,
        },
        workflow: {
          action: "APPLY",
          assignes: [],
          comments: formData.description,
          verificationDocuments,
        },
      },
      categoryType: "GRM_APPLY",
      tenantId: "br",
      otp: otp,
      echoResponse: null,
    },
  };
};

function GrmCreateForm({ isMobile }) {
  const [formData, setFormData] = useState(
    JSON.parse(sessionStorage.getItem("Agent-GRM-formData")) || {
      category: null,
      subCategory: null,
      subSubCategory: null,
    }
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpValidationError, setOtpValidationError] = useState({
    message: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
  });
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [waitTime, setWaitTime] = useState(null);
  const [farmerDetails, setFarmerDetails] = useState({});
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";

  const farmerData = JSON.parse(sessionStorage.getItem("Agent-grm-farmerData"));

  useEffect(() => {
    const farmerData = JSON.parse(
      sessionStorage.getItem("Agent-grm-farmerData")
    );
    if (!farmerData) {
      navigate(-1);
    } else {
      const {
        identifiers,
        name,
        fatherHusbandName,
        gender,
        dateOfBirth,
        individualType,
        mobileNumber,
        address = [],
      } = farmerData || {};
      const details = {
        dbtId:
          identifiers?.find((item) => item.identifierType === "DBTID")
            ?.identifierId ?? " - ",
        farmerName: name?.givenName ?? " - ",
        fatherName: fatherHusbandName ?? " - ",
        gender: gender ?? " - ",
        dob: dateOfBirth ?? " - ",
        farmerType: individualType ?? " - ",
        mobileNumber: mobileNumber ?? " - ",
        district: address?.[0]?.district ?? " - ",
        block: address?.[0]?.block ?? " - ",
        panchayat: address?.[0]?.panchayat ?? " - ",
        village: address?.[0]?.village ?? " - ",
      };
      setFarmerDetails(details);
    }
  }, [navigate]);

  const steps = [
    {
      component: (
        <CategorySelection
          formData={formData}
          setFormData={setFormData}
          preview={preview}
          errors={errors}
          setErrors={setErrors}
          isMobile={isMobile}
        />
      ),
    },
    {
      component: (
        <DetailsInputForm
          formData={formData}
          setFormData={setFormData}
          preview={preview}
          errors={errors}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          farmerDetails={farmerDetails}
        />
      ),
    },
  ];

  const handleNextClick = () => {
    if (currentStep === 0) {
      let validations = {};
      if (!formData.category) {
        validations.category = "agentGrm.CATEGORY_SELECTION_ERROR";
      }
      if (!formData.subCategory) {
        validations.subCategory = "agentGrm.SUB_CATEGORY_SELECTION_ERROR";
      }
      if (!formData.subSubCategory) {
        validations.subSubCategory =
          "agentGrm.SUB_SUB_CATEGORY_SELECTION_ERROR";
      }
      if (Object.keys(validations).length > 0) {
        setErrors(validations);
        return;
      } else {
        setErrors({});
      }
      setCurrentStep(currentStep + 1);
    }
    if (currentStep === 1) {
      let validations = {};
      if (!formData?.description || !formData?.description?.trim()) {
        validations.description = true;
      }
      if (Object.keys(validations).length > 0) {
        setErrors(validations);
        return;
      } else {
        setErrors({});
      }
      setFormData({ ...formData, description: formData.description.trim() });
      setPreview(true);
    }
    sessionStorage.setItem("Agent-GRM-formData", JSON.stringify(formData));
  };

  const handlePreviousClick = () => {
    setMobileNumber("");
    setOtp("");
    setWaitTime(null);
    if (currentStep > 0 && preview) {
      setPreview(false);
      return;
    }
    if (currentStep > 0) {
      setPreview(false);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleOtpSend = async () => {
    const { identifiers } = farmerData;
    const dbtData = identifiers?.find(
      (item) => item.identifierType === "DBTID"
    );
    const requestData = {
      otp: {
        mobileNumber: null,
        dbtId: dbtData?.identifierId,
        categoryType: "GRM_APPLY",
        userType: "CITIZEN",
        tenantId: "br",
        additionalFields: {
          categoryName: formData?.category,
        },
      },
    };
    setOtp("");
    const response = await SchemeService.otpFarmerSchemeGet(requestData);

    if (response?.ResponseInfo?.status === "successful") {
      const contact = response?.message;
      setOtpValidationError({ message: "" });
      dispatchNotification("success", [t("schemes.otpSuccess")], dispatch);
      setWaitTime(30);
      setMobileNumber(contact);
    } else {
      const { data } = response;
      setOtpValidationError({
        message:
          t(
            customExceptions[
              response?.Errors?.[0]?.code || data?.error?.fields?.[0]?.code
            ]
          ) ||
          data?.error?.fields?.[0]?.message ||
          "SOMETHING_WENT_WRONG",
      });
    }
  };

  const handleVerifyOtp = async () => {
    let uploadedFiles = [];
    setLoading(true);
    setOpen(true);
    if (selectedFiles.length > 0) {
      uploadedFiles = await uploadFiles(
        selectedFiles,
        submissionStatus,
        setSubmissionStatus
      );
    }
    if (uploadedFiles?.error) {
      setLoading(false);
      return;
    }

    const payload = getPayload({
      farmerData,
      formData,
      otp,
      uploadedFiles,
      selectedFiles,
    });

    const response = await PGRService.createAgentGrievance(payload);
    if (response?.status === 201) {
      setSubmissionStatus({
        success: true,
        message: "",
        response: response?.data?.proxyResponse?.ServiceWrappers[0] || [],
      });
    } else {
      setSubmissionStatus({
        success: false,
        message:
          response?.data?.Errors?.[0]?.code || "GRM_RESPONSE_SUBMISSION_ERROR",
      });
    }
    setLoading(false);
  };

  const onClose = () => {
    setOpen(false);
    if (submissionStatus?.success) {
      setMobileNumber("");
    }
    setOtp("");
    setSubmissionStatus({ ...submissionStatus, message: "" });
  };

  const onDoneCLick = () => {
    navigate(`${window.contextPath}/grm-create`);
  };

  return (
    <Box className="w-[95%] sm:w-11/12 m-auto mt-5 max-w-content-max-width mb-10">
      <Box className="breadcrumbs-container mb-[24px]">
        <BasicBreadcrumbs />
      </Box>
      {!isMobile && (
        <Box className="pb-[40px] pt-[16px]">
          <CustomStepper
            steps={grmSteps}
            activeStep={submissionStatus?.success ? 3 : preview ? 2 : 1}
          />
        </Box>
      )}
      <Box className="container-card">
        <Box>
          <Typography
            variant={isMobile ? "h5" : "h2"}
            className="agent-grm-card-header !mb-2"
          >
            {t("agentGrm.grmApplication")}
          </Typography>
          <Typography
            variant={isMobile ? "h7" : "subtitle2"}
            className="agent-grm-card-sub-header"
          >
            {currentStep === 0 ? t("agentGrm.grmApplicationSubText") : "  "}
          </Typography>
        </Box>
        {submissionStatus?.success && (
          <Box className="grm-create-service-request-id">
            <Typography className="grm-service-request-id">
              {submissionStatus.response?.service?.serviceRequestId}
            </Typography>
          </Box>
        )}
        <Box>
          {steps[currentStep].component}
          {mobileNumber && currentStep === 1 && (
            <Box className="grm-form-inner-cards-container max-sm:mt-[-20px] mt-[-32px]">
              <OtpInputRenderer
                mobileNumber={mobileNumber}
                otpValue={otp}
                setOtpValue={setOtp}
                otpValidationError={otpValidationError}
                setOtpValidationError={setOtpValidationError}
                dispatch={dispatch}
                t={t}
                isSubmit={true}
                waitTime={waitTime}
                setWaitTime={setWaitTime}
                onResendOtp={handleOtpSend}
              />
            </Box>
          )}
        </Box>
        <Box className="flex justify-between">
          <CustomButton color={ButtonColor.SECONDARY} onClick={onDoneCLick}>
            {t("COMMON_CLOSE")}
          </CustomButton>
          <Box className="flex gap-2">
            {currentStep === 1 && !submissionStatus?.success && (
              <CustomButton
                color={ButtonColor.SECONDARY}
                onClick={handlePreviousClick}
              >
                {t("COMMON_PREVIOUS")}
              </CustomButton>
            )}
            {submissionStatus?.success ? (
              <CustomButton onClick={onDoneCLick}>
                {t("COMMON_DONE")}
              </CustomButton>
            ) : preview ? (
              <CustomButton
                onClick={mobileNumber ? handleVerifyOtp : handleOtpSend}
              >
                {t(
                  mobileNumber ? "agentGrm.SUBMIT" : "COMMON_PROCEED_WITH_OTP"
                )}
              </CustomButton>
            ) : (
              <CustomButton onClick={handleNextClick}>
                {t(`${currentStep === 1 ? "COMMON_PREVIEW" : "COMMON_NEXT"}`)}
                <ArrowForwardIcon sx={{ marginLeft: "8px" }} />
              </CustomButton>
            )}
          </Box>
        </Box>
      </Box>
      <AgentConfirmationDialog
        open={open}
        loading={loading}
        status={submissionStatus?.success || false}
        t={t}
        onClose={onClose}
      >
        <>
          <Typography>{t(submissionStatus.message)}</Typography>
          {!loading && submissionStatus.success && (
            <Box
              className="flex flex-col items-center justify-center"
              data-testid="ticket-details"
            >
              <Typography
                variant={isMobile ? "h6" : "h5"}
                className="confirmation-dialog-text-main"
                color={theme.palette.text.textGreen}
              >
                {t("COMMON_CONGRATS")}
              </Typography>
              <Box
                className={`sm:flex sm:w-max pb-[8px] ${
                  isDarkTheme ? "text-primary-dark-theme" : "text-primary"
                } sm:text-[20px]`}
              >
                <Box className="flex max-sm:justify-center max-sm:pb-2">
                  {t("agentGrm.GRM_TICKET_NUMBER")} {isMobile ? "" : ":"}
                </Box>
                <Box className="flex items-center">
                  <Box className="font-bold ml-2 mr-[10px]">
                    {submissionStatus.response?.service?.serviceRequestId}
                  </Box>
                  {copied ? (
                    <DoneAllOutlinedIcon color="success" />
                  ) : (
                    <CopyToClipboard
                      text={
                        submissionStatus.response?.service?.serviceRequestId
                      }
                      onCopy={() => setCopied(true)}
                    >
                      <CopyToClipboardIcon cursor={"pointer"} />
                    </CopyToClipboard>
                  )}
                </Box>
              </Box>
              <Typography>{t("agentGrm.GRM_CREATE_SUCCESS_MSG")}</Typography>
            </Box>
          )}
        </>
      </AgentConfirmationDialog>
    </Box>
  );
}

export default GrmCreateForm;
