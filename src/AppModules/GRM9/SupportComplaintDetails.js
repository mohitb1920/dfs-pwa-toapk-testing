import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { useQueryClient } from "react-query";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSupportComplaintDetails from "../../Hooks/useSupportComplaintDetails";
import useWorkflowDetails from "../../Hooks/useWorkFlowDetails";
import FilesRenderer from "../PGR/FilesRenderer";
import {
  historyElement,
  updatePgr,
  uploadFiles,
} from "../PGR/ComplaintDetails";
import { PGRService } from "../../services/PGR";
import { INVALID_ROLE } from "../../constants";
import CustomTimelineStepper from "../../components/CustomTimelineStepper";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { onSendOtp } from "./ReportIssue";
import { TENANT_ID } from "../../components/Utils";
import VerifyOtpModal from "./VerifyOtpModal";
import { getTimeline } from "../../services/Workflow";

const userDetails = {
  name: "COMMON_NAME",
  mobileNumber: "COMMON_MOBILE_NUMBER",
  category: "GRM_CATEGORY",
  subCategory: "GRM_SUB_CATEGORY",
};

function SupportComplaintDetails() {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isSupportUser = useMemo(
    () => localStorage.getItem("DfsWeb.isSupportUser") === "true",
    []
  );
  const [open, setOpen] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    success: false,
    code: "",
  });
  const [complaintTimelineData, setComplaintTimelineData] = useState([]);
  const [otpLoading, setOtpLoading] = useState(false);
  const [openOtpModal, setOpenOtpModal] = useState(!isSupportUser);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otp, setOtp] = useState("");
  const [waitTime, setWaitTime] = useState(null);
  const [contact, setContact] = useState("");
  const [complaintData, setComplaintData] = useState(null);
  const client = useQueryClient();

  const handleOtpModalClose = () => {
    navigate(-1);
  };

  const handleSearchTicket = async (mobileNumber) => {
    const response = await PGRService.supportSearch(
      TENANT_ID,
      {
        serviceRequestId: complaintId,
        otpReference: otp,
        mobileNumber,
      },
      isSupportUser
    );
    if (response.status === 200) {
      setOpenOtpModal(false);
      setComplaintData(response);
      setOtpError(t(""));
    } else {
      const { data } = response;
      setOtpError(
        t(`GRM9_${data?.Errors?.[0]?.code}` || "SOMETHING_WENT_WRONG")
      );
    }
    setOtp("");
  };

  const callSendOtp = async (mobileNumber) => {
    await onSendOtp({
      formData: { mobileNumber, type: "TECH_SUPPORT_WEB" },
      userType: "CITIZEN",
      setLoading,
      setOtp,
      setOtpSuccess,
      setWaitTime,
      setOtpError,
      setSubmissionStatus,
      t,
    })
  }

  useEffect(() => {
    const mobileNumber = sessionStorage.getItem("tech-support-search-contact");
    if (!isSupportUser && mobileNumber) {
      setComplaintData(null);
      setContact(mobileNumber);

      const sendOtp = async () => {
        setContact(mobileNumber);
        setOpenOtpModal(true);
        await callSendOtp(mobileNumber);
      };

      sendOtp();
    }
  }, []);

  const { isLoading, complaintDetails } = useSupportComplaintDetails({
    tenantId: "br",
    id: complaintId,
    isSupportUser,
    complaintData,
    openOtpModal,
  });

  const workflowDetails = useWorkflowDetails({
    tenantId: "br",
    id: complaintId,
    moduleCode: complaintDetails?.service?.businessService,
    role: "EMPLOYEE",
    status: complaintDetails?.service?.applicationStatus,
    enabled: !isLoading && isSupportUser,
  });

  const combinedShowcauseDetails = { issuedTo: [], issuedBy: [] };

  useEffect(() => {
    if (!isSupportUser && complaintDetails) {
      const timeline = getTimeline(complaintDetails?.processInstances);
      setComplaintTimelineData(timeline);
    }
  }, [complaintDetails]);

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

  const onSubmitClick = async () => {
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
    const userAction = "RESOLVE";
    const userComments = remarks;
    complaintDetails.workflow.action = userAction;
    complaintDetails.workflow.assignes = null;
    complaintDetails.workflow.comments = userComments;
    complaintDetails.workflow.verificationDocuments = uploadedFiles.map(
      (file, index) => ({
        fileStoreId: file.fileStoreId,
        documentType: selectedFiles[index]?.type,
      })
    );
    complaintDetails.service.address = {};
    await updatePgr({
      complaintDetails,
      setSubmissionStatus,
      submissionStatus,
      employee: false
    }
    );
    setLoading(false);
  };

  const hasRespondAccess = useMemo(() => {
    const nextAction = "RESOLVE";
    if (workflowDetails?.data?.nextActions?.length > 0) {
      const resolveAction = workflowDetails?.data?.nextActions.filter(
        (item) => item.action === nextAction
      );
      return resolveAction?.length > 0;
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
    if (submissionStatus?.success || submissionStatus.code === INVALID_ROLE)
      navigate(-1);
    await refreshData();
  };

  const renderFarmerQuery = () => {
    const hisotry = [];
    const farmerQuery = complaintTimelineData.find(
      (item) => item?.performedAction === "APPLY"
    );
    hisotry.push(
      historyElement(
        { ...farmerQuery, wfComment: complaintDetails?.service?.description },
        t,
        renderFiles
      )
    );

    return hisotry;
  };

  return (
    <Box className="complaint-details-container">
      {!openOtpModal && (
        <>
          <Box className="flex justify-center p-4 pb-2">
            <Typography className="details-page-header">
              {t("GRM_GRIEVANCE_DETAILS")}
            </Typography>
          </Box>
          {isLoading || workflowDetails?.isLoading ? (
            <Box className="flex items-center justify-center h-96">
              <CircularProgress color="success" />
            </Box>
          ) : (
            <>
              <Box className="flex justify-between items-center mb-2 bg-white px-1 py-2 rounded-md">
                <Typography className="complaint-number">
                  &nbsp; {complaintId}
                </Typography>
              </Box>
              <Box className="details-box-border">
                <Box className="flex justify-between border-b border-primary py-2 px-4">
                  <Typography className="farmer-box-header">
                    {t("GRM_USER_DETAILS")}
                  </Typography>
                </Box>
                <Grid container spacing={3} className="farmer-grid">
                  {Object.entries(userDetails).map(([key, value]) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={key}
                      sx={{ paddingTop: "10px !important", display: "flex" }}
                    >
                      <Typography variant="subtitle1" className="farmer-key">
                        {t(value)}:{" "}
                      </Typography>
                      <Typography variant="body1" className="farmer-value">
                        {" "}
                        {complaintDetails?.farmerDetails?.[`${key}`]}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Box>
              {renderFarmerQuery()}
              <CustomTimelineStepper
                complaintTimelineData={complaintTimelineData}
                complaintStatus={complaintDetails?.service?.applicationStatus}
                hasRespondAccess={hasRespondAccess}
                remarks={remarks}
                setRemarks={setRemarks}
                onSubmitClick={onSubmitClick}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                complaintId={complaintId}
                isSaoUser={false}
                combinedShowcauseDetails={combinedShowcauseDetails}
                isShowcauseLoading={false}
                refetchShowcauseDetails={() => {}}
              />
              <Box className="mt-10 flex justify-end">
                <Button
                  variant="outlined"
                  className="complaint-cancel-button"
                  onClick={() => navigate(-1)}
                >
                  {t("COMMON_BACK")}
                </Button>
              </Box>
            </>
          )}
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
              <Typography>
                {t("GRM_TICKET_NUMBER")}:
                <span className="font-bold ml-2">
                  {complaintId}
                </span>
              </Typography>
              <Typography>{t("GRM_RESOLVE_SUCCESS_MSG")}</Typography>
            </Box>
          )}
        </>
      </ConfirmationDialog>
      <VerifyOtpModal
        open={openOtpModal}
        handleClose={handleOtpModalClose}
        handleSubmit={handleSearchTicket}
        mobileNumber={contact}
        loading={otpLoading}
        otp={otp}
        setOtp={setOtp}
        waitTime={waitTime}
        setWaitTime={setWaitTime}
        otpSuccess={otpSuccess}
        otpError={otpError}
        onSendOtp={() =>
          callSendOtp(contact)
        }
        submissionStatus={submissionStatus}
        setSubmissionStatus={setSubmissionStatus}
      />
    </Box>
  );
}

export default SupportComplaintDetails;
