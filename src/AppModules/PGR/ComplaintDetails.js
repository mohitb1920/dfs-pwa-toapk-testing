import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useQueryClient } from "react-query";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import useComplaintDetails from "../../Hooks/useComplaintDetails";
import { PGRService } from "../../services/PGR";
import { UploadServices } from "../../services/UploadService";
import useWorkflowDetails from "../../Hooks/useWorkFlowDetails";
import { INVALID_ROLE } from "../../constants";
import {
  dispatchNotification,
  exportPdf,
  getUserRoles,
} from "../../components/Utils";
import { TENANT_ID, acceptedFileTypes } from "../../components/Constants";
import { useTranslation } from "react-i18next";
import FilesRenderer from "./FilesRenderer";
import { useDispatch } from "react-redux";
import CustomTimelineStepper from "../../components/CustomTimelineStepper";
import useShowcauseDetails from "../../Hooks/useShowcauseDetails";
import { getUser } from "../../services/loginService";
import CustomButton from "../../components/Button/CustomButton";
import VerifyOtpModal from "../GRM9/VerifyOtpModal";
import { onSendOtp } from "../GRM9/ReportIssue";
import FarmerDetailsCard from "../../components/FarmerDetailsCard";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import { ButtonColor } from "../../components/Button/ButtonEnums";
import CustomTextDispayBox from "../../components/CustomTextDispayBox";

const categories = {
  category: "GRM_CATEGORY",
  subCategory: "GRM_SUB_CATEGORY",
  subSubCategory: "GRM_GRIEVANCE_SUBJECT",
};

export const uploadFiles = async (
  selectedFiles,
  submissionStatus,
  setSubmissionStatus
) => {
  const response = await UploadServices.Filestorage("pgr", selectedFiles, "br");
  if (response.status === 201 && response?.data?.files) {
    return response.data.files;
  } else {
    setSubmissionStatus({
      ...submissionStatus,
      message: "DOCUMENT_UPLOAD_FAIL_ERROR",
    });
    return { error: true };
  }
};

export const updatePgr = async ({
  complaintDetails,
  setSubmissionStatus,
  submissionStatus,
  employee,
  isAgentUser = false,
  otp = "",
  setOpenOtpModal = () => {},
  setOpen = () => {},
}) => {
  let payload = null;
  if (isAgentUser) {
    payload = {
      proxyRequest: {
        mobileNumber: null,
        dbtId: null,
        ticketId: complaintDetails.service.serviceRequestId,
        categoryType: "GRM_REOPEN",
        tenantId: TENANT_ID,
        otp,
        echoResponse: null,
        payload: {
          service: complaintDetails.service,
          workflow: complaintDetails.workflow,
        },
      },
    };
  } else {
    payload = {
      service: complaintDetails.service,
      workflow: complaintDetails.workflow,
    };
  }
  const response = await PGRService.update(payload, employee, isAgentUser);
  if (response?.status === 200 || response?.status === 201) {
    setSubmissionStatus({
      success: true,
      message: "",
      response: response?.data?.ServiceWrappers?.[0] ?? {},
    });
    if (isAgentUser) {
      setOpenOtpModal(false);
      setOpen(true);
    }
  } else if (isAgentUser) {
    setSubmissionStatus({
      message: response?.data?.Errors?.[0]?.code,
      submitted: true,
      success: false,
    });
  } else if (response?.data?.Errors?.[0]?.code === INVALID_ROLE) {
    setSubmissionStatus({
      ...submissionStatus,
      message: "ESCALATION_ERROR",
      code: INVALID_ROLE,
    });
  } else {
    setSubmissionStatus({
      ...submissionStatus,
      message: "GRM_RESPONSE_SUBMISSION_ERROR",
    });
  }
};

export const historyElement = (data, t, renderFiles) => {
  return (
    <Container variant="white" className="!rounded-[12px]">
      <Box key={data?.status} className="mt-[40px] p-[16px] sm:p-[32px]">
        <Box>
          <Typography variant="subtitle1" className="farmer-key" mb={1}>
            {t("GRM_DESCRIPTION")}
          </Typography>
          <Box>
            <CustomTextDispayBox style={{ lineHeight: 1.5 }}>
              {data?.wfComment ? data?.wfComment : ""}
            </CustomTextDispayBox>
          </Box>
        </Box>
        <Box className="pt-2">
          {data?.wfDocuments &&
          data?.wfDocuments?.some((file) =>
            acceptedFileTypes.includes(file.documentType)
          ) ? (
            renderFiles(data.wfDocuments)
          ) : (
            <Box className="py-1">{t("GRM_NO_ATTACHMENTS")}</Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

function ComplaintDetails() {
  const { complaintId } = useParams();
  const location = useLocation();
  const { stateComplaintId } = location.state ?? "";
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width:640px)");
  const userInfo = useMemo(() => getUser(), []);
  const isSaoUser = useMemo(
    () => localStorage.getItem("DfsWeb.isSaoUser") === "true",
    []
  );
  const isAgentUser = useMemo(
    () => localStorage.getItem("DfsWeb.isAgentUser") === "true",
    []
  );
  const isKccUser = useMemo(() => {
    const userRoles = getUserRoles();
    const KCC = userRoles?.filter((role) => ["KCC"].includes(role));
    return KCC?.length > 0;
  }, []);
  const [open, setOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [fetchedData, setFetchedData] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    success: false,
    code: "",
  });
  const [complaintTimelineData, setComplaintTimelineData] = useState([]);
  const [satisfactionCategory, setSatisfactionCategory] = useState(null);
  const [otherComments, setOtherComments] = useState("");
  const [openOtpModal, setOpenOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [waitTime, setWaitTime] = useState(null);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [otpError, setOtpError] = useState("");
  const client = useQueryClient();

  useEffect(() => {
    if (isAgentUser && !stateComplaintId && !isKccUser) {
      navigate(`${window.contextPath}/track`);
    }
  }, [stateComplaintId]);

  const handleOtpModalClose = () => {
    setOpenOtpModal(false);
  };

  const {
    isLoading,
    complaintDetails,
    revalidate: refetchComplaintDetails,
  } = useComplaintDetails({
    tenantId: "br",
    id: complaintId,
    fetchedData,
  });

  const workflowDetails = useWorkflowDetails({
    tenantId: "br",
    id: complaintId,
    moduleCode: complaintDetails?.service?.businessService,
    role: "EMPLOYEE",
    status: complaintDetails?.service?.applicationStatus,
    enabled: !isLoading,
  });

  const {
    data: combinedDetails,
    isLoading: isShowcauseLoading,
    revalidate: refetchShowcauseDetails,
  } = useShowcauseDetails({
    tenantId: TENANT_ID,
    id: complaintId,
    uuid: userInfo?.uuid,
    isAgentUser,
  });

  const combinedShowcauseDetails = []; //* isAgentUser ? [] : combinedDetails; showcause disabled*//

  useEffect(() => {
    if (workflowDetails) {
      const { data: { timeline: complaintTimelineData } = {} } =
        workflowDetails;
      if (complaintTimelineData) {
        setComplaintTimelineData(complaintTimelineData);
      }
    }
  }, [workflowDetails]);

  const renderFiles = (files) => {
    return (
      <FilesRenderer
        preview={true}
        t={t}
        selectedFiles={files}
        setSelectedFiles={setSelectedFiles}
      />
    );
  };

  const callSendOtp = async () => {
    await onSendOtp({
      formData: {
        mobileNumber: null,
        dbtId: null,
        categoryType: "GRM_REOPEN",
        ticketId: complaintId,
        additionalFields: {
          farmerName: complaintDetails?.farmerDetails?.farmerName,
        },
      },
      userType: "CITIZEN",
      setLoading,
      setOtp,
      setOtpSuccess,
      setWaitTime,
      setOtpError,
      setSubmissionStatus,
      t,
      agentOtp: true,
    });
  };

  const onSubmitClick = async () => {
    let uploadedFiles = [];
    setLoading(true);
    if (!isAgentUser) setOpen(true);
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
    const saoComments = (() => {
      let comments = { remarks };
      if (satisfactionCategory) {
        comments = {
          ...comments,
          satisfactionCategory: satisfactionCategory?.value,
        };
      }
      if (otherComments) {
        comments = { ...comments, otherComments };
      }
      return JSON.stringify(comments);
    })();
    const userAction = (() => {
      if (isAgentUser && stateComplaintId) return "REOPEN";
      if (isKccUser) return "RESOLVE-KCC";
      if (isSaoUser) return "VERIFY";
      return "RESOLVE";
    })();
    const userComments = isSaoUser ? saoComments : remarks;
    complaintDetails.workflow.action = userAction;
    complaintDetails.workflow.assignes = null;
    complaintDetails.workflow.comments = userComments;
    complaintDetails.workflow.verificationDocuments = uploadedFiles.map(
      (file, index) => ({
        fileStoreId: file.fileStoreId,
        documentType: selectedFiles[index]?.type,
      })
    );
    await updatePgr({
      complaintDetails,
      setSubmissionStatus,
      submissionStatus,
      employee: true,
      isAgentUser,
      otp,
      setOpenOtpModal,
      setOpen,
    });
    setOtp("");
    setLoading(false);
  };

  const onReopenSubmit = async () => {
    setOpenOtpModal(true);
    await callSendOtp();
  };

  const handlePdfDownload = async () => {
    setPdfLoading(true);
    const {
      block,
      dbtId,
      district,
      dob,
      farmerName,
      farmerType,
      fatherName,
      gender,
      mobileNumber,
      panchayat,
      village,
    } = complaintDetails?.farmerDetails || {};
    const farmerProfile = {
      dbtRegistrationNo: dbtId,
      name: farmerName,
      fatherOrHusbandName: fatherName,
      mobileNo: mobileNumber,
      dob,
      gender,
      farmerType,
      blockName: block,
      villageName: village,
      districtName: district,
      panchayatName: panchayat,
    };

    const response = await PGRService.downloadPdf(
      { farmerProfile },
      complaintId
    );
    if (response?.status === 200) {
      exportPdf(response, complaintId);
    } else {
      dispatchNotification("error", ["COMMON_PDF_DOWNLOAD_FAIL"], dispatch);
    }
    setPdfLoading(false);
  };
  useEffect(() => {
    if (!isLoading) {
      setFetchedData(true);
    }
  }, [isLoading]);

  const hasRespondAccess = useMemo(() => {
    if (isAgentUser) return false;
    const nextAction = (() => {
      if (isKccUser) return "RESOLVE-KCC";
      if (isSaoUser) return "VERIFY";
      return "RESOLVE";
    })();
    if (workflowDetails?.data?.nextActions?.length > 0) {
      const resolveAction = workflowDetails?.data?.nextActions.filter(
        (item) => item.action === nextAction
      );
      return resolveAction?.length > 0;
    }
    return false;
  }, [workflowDetails]);

  const hasReopenAccess = useMemo(() => {
    if (!isAgentUser || !stateComplaintId) return false;
    if (workflowDetails?.data?.processInstances?.length > 0) {
      const reopenAction =
        workflowDetails.data.processInstances[0]?.state?.actions.filter(
          (item) => item.action === "REOPEN"
        );
      return reopenAction?.length > 0;
    }
    return false;
  }, [workflowDetails]);

  const refreshData = async () => {
    await client.refetchQueries(["fetchInboxData"]);
  };

  const handleClose = async () => {
    setOpen(false);
    setSubmissionStatus({
      message: "",
      success: false,
      code: "",
    });
    if (isAgentUser && submissionStatus?.success) {
      setFetchedData(false);
      refetchComplaintDetails();
    } else {
      if (submissionStatus?.success || submissionStatus.code === INVALID_ROLE) {
        navigate(-1);
      }
      await refreshData();
    }
  };

  const renderFarmerQuery = () => {
    const hisotry = [];
    const farmerQuery = complaintTimelineData.find(
      (item) => item?.performedAction === "APPLY"
    );
    hisotry.push(
      historyElement(
        { ...farmerQuery, wfComment: complaintDetails?.details?.description },
        t,
        renderFiles
      )
    );

    return hisotry;
  };

  return (
    <Container variant="primary">
      <Box className="complaint-details-container">
        <Box className="breadcrumbs-container my-5">
          <BasicBreadcrumbs />
        </Box>
        {isLoading || workflowDetails?.isLoading ? (
          <Box
            className="flex items-center justify-center"
            sx={{ height: "612px" }}
          >
            <CircularProgress color="success" />
          </Box>
        ) : (
          <>
            <Box className="py-1 sm:py-4">
              <Typography
                variant={isMobile ? "h5" : "h1"}
                className="details-page-header"
              >
                {t("GRM_GRIEVANCE_DETAILS")}
              </Typography>
            </Box>
            <Box className="sm:flex justify-between items-center mb-2 px-1 py-2 rounded-md">
              <Typography
                variant={isMobile ? "subtitle2" : "h3"}
                className="complaint-number max-sm:!pb-0"
              >
                {complaintId}
              </Typography>
              <Box className="flex justify-end mt-2 sm:block sm:mt-0">
                {pdfLoading ? (
                  <CircularProgress size={30} color="success" />
                ) : (
                  <Tooltip title={t("GRM_DOWNLOAD_TOOLTIP")}>
                    <CustomButton
                      onClick={handlePdfDownload}
                      sx={{ cursor: "pointer" }}
                      color={ButtonColor.SECONDARY}
                    >
                      {t("COMMON_DOWNLOAD")}{" "}
                    </CustomButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
            <Box className="grm-form-inner-cards-container">
              <FarmerDetailsCard
                farmerDetails={complaintDetails?.farmerDetails ?? {}}
              />
            </Box>
            <Box className="category-timeline-container">
              <Grid container spacing={3} className="complaint-categories-grid">
                {Object.entries(categories).map(([key, value]) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={key}
                    className="complaint-categories-grid-item"
                  >
                    <Typography variant="subtitle1" className="farmer-key">
                      {t(value)}:{" "}
                    </Typography>
                    <CustomTextDispayBox>
                      {complaintDetails?.details?.[`${key}`]}
                    </CustomTextDispayBox>
                  </Grid>
                ))}
              </Grid>
              {renderFarmerQuery()}
              <CustomTimelineStepper
                complaintTimelineData={complaintTimelineData}
                complaintStatus={complaintDetails?.service?.applicationStatus}
                hasRespondAccess={hasRespondAccess}
                hasReopenAccess={hasReopenAccess}
                remarks={remarks}
                setRemarks={setRemarks}
                onSubmitClick={onSubmitClick}
                onReopenSubmit={onReopenSubmit}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                complaintId={complaintId}
                isSaoUser={isSaoUser}
                satisfactionCategory={satisfactionCategory}
                setSatisfactionCategory={setSatisfactionCategory}
                otherComments={otherComments}
                setOtherComments={setOtherComments}
                combinedShowcauseDetails={combinedShowcauseDetails}
                isShowcauseLoading={isShowcauseLoading}
                refetchShowcauseDetails={refetchShowcauseDetails}
                isAgentUser={isAgentUser}
              />
            </Box>
            <Box className="mt-10 flex justify-end">
              <CustomButton onClick={() => navigate(-1)}>
                {t("COMMON_BACK")}
              </CustomButton>
            </Box>
          </>
        )}
        <ConfirmationDialog
          open={open}
          onClose={handleClose}
          loading={loading}
          status={submissionStatus.success}
          t={t}
        >
          <>
            <Typography>{t(submissionStatus.message)}</Typography>
            {!loading && submissionStatus.success && (
              <Box
                className="flex flex-col tems-center justify-center m-2 mb-5 fle"
                data-testid="ticket-details"
              >
                {isSaoUser && (
                  <Typography>{t("GRM_VERIFIED_SUCCESS_MSG")}</Typography>
                )}
                <Typography>
                  {t("GRM_TICKET_NUMBER")}:
                  <span className="font-bold ml-2">{complaintId}</span>
                </Typography>
                {!isSaoUser && (
                  <Typography>
                    {t(`GRM_${isAgentUser ? "REOPEN" : "RESOLVE"}_SUCCESS_MSG`)}
                  </Typography>
                )}
              </Box>
            )}
          </>
        </ConfirmationDialog>
        <VerifyOtpModal
          open={openOtpModal}
          handleClose={handleOtpModalClose}
          handleSubmit={onSubmitClick}
          mobileNumber={complaintDetails?.farmerDetails?.mobileNumber}
          loading={loading}
          otp={otp}
          setOtp={setOtp}
          waitTime={waitTime}
          setWaitTime={setWaitTime}
          otpSuccess={otpSuccess}
          otpError={otpError}
          onSendOtp={() => callSendOtp()}
          submissionStatus={submissionStatus}
          setSubmissionStatus={setSubmissionStatus}
        />
      </Box>
    </Container>
  );
}

export default ComplaintDetails;
