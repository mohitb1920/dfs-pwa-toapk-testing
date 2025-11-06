import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { uploadFiles } from "./ComplaintDetails";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import { useTranslation } from "react-i18next";
import ResponceInputRenderer from "./ResponceInputRenderer";
import { acceptedFileTypes } from "../../components/Constants";
import FilesRenderer from "./FilesRenderer";
import { TENANT_ID } from "../../components/Utils";
import { getUser } from "../../services/loginService";
import { ShowCauseService } from "../../services/ShowCause";
import { useQueryClient } from "react-query";
import { formattedDateTime } from "../../components/CustomTimelineStepper";

function ShowCauseNotice(props) {
  const {
    complaintId,
    setOpenShowCause,
    showcauseDetails,
    refetchShowcauseDetails,
  } = props;
  const { t } = useTranslation();
  const client = useQueryClient();
  const userInfo = useMemo(() => getUser(), []);

  const [preview, setPreview] = useState(false);
  const [respond, setRespond] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionAccess, setActionAccess] = useState(false);
  const [respondAccess, setRespondAccess] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState({
    message: "",
    success: false,
  });
  const timeFrame = "7";

  useEffect(() => {
    if (showcauseDetails) {
      const { issuedTo, issuedBy, status } = showcauseDetails || {};
      if (status === "ISSUED" && issuedTo === userInfo?.uuid) {
        setRespondAccess(true);
      } else if (status === "RESPONDED" && issuedBy === userInfo?.uuid) {
        setActionAccess(true);
        setRespondAccess(true);
      }
    }
  }, [showcauseDetails]);

  const renderFiles = (files) => {
    return (
      <FilesRenderer
        preview={preview}
        t={t}
        selectedFiles={files}
        setSelectedFiles={setSelectedFiles}
      />
    );
  };

  const handleSubmit = async (status) => {
    const { comments, documents } = showcauseDetails;
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
    showcauseDetails.status = status;
    showcauseDetails.comments = [
      ...(comments || []),
      {
        tenantId: TENANT_ID,
        comments: remarks,
        commentedBy: userInfo?.uuid,
        showcauseId: showcauseDetails.id,
      },
    ];
    const newFiles = uploadedFiles.map((file, index) => ({
      fileStoreId: file.fileStoreId,
      documentType: selectedFiles[index]?.type,
      uploadedBy: userInfo?.uuid,
      tenantId: TENANT_ID,
      showcauseId: showcauseDetails.id,
    }));
    showcauseDetails.documents = [...(documents || []), ...newFiles];

    const payload = { showcause: showcauseDetails };
    const response = await ShowCauseService.update(payload, complaintId);
    if (response?.status === 200) {
      setSubmissionStatus({
        success: true,
        message: `GRM_SHOWCAUSE_RESPONSE_${status}`,
      });
    } else {
      setSubmissionStatus({
        message: "GRM_RESPONSE_SUBMISSION_ERROR",
        success: false,
      });
    }
    setLoading(false);
  };

  const refreshData = async () => {
    await refetchShowcauseDetails();
    await client.refetchQueries(["fetchShowCauseData"]);
  };

  const handleClose = async () => {
    setOpen(false);
    setOpenShowCause(false);
    await refreshData();
  };

  const handleCloseResponse = () => {
    setRespond(false);
    setPreview(false);
    setRemarks("");
    setSelectedFiles([]);
  };

  const {
    issueDate,
    responseDueDate,
    recipientName,
    recipientDesignation,
    senderName,
    senderDesignation,
    senderContactInfo,
  } = showcauseDetails?.showcauseContent || {};

  const renderShowcauseHistory = () => {
    const { issuedTo, issuedBy, comments, documents } = showcauseDetails || {};
    const issuedToData = {};
    const issuedByData = {};

    const issuedToComments = comments?.filter(
      (comment) => comment.commentedBy === issuedTo
    );
    const issuedToDocuments = documents?.filter(
      (document) => document.uploadedBy === issuedTo
    );
    const issuedByComments = comments?.filter(
      (comment) => comment.commentedBy === issuedBy
    );
    const issuedBydocuments = documents?.filter(
      (document) => document.uploadedBy === issuedBy
    );

    if (issuedToComments?.length > 0) {
      issuedToData.comment = issuedToComments[0]?.comments;
      issuedToData.designation = recipientDesignation;
      issuedToData.createdTime = issuedToComments[0]?.auditDetails?.createdTime;
    }

    if (issuedByComments?.length > 0) {
      issuedByData.comment = issuedByComments[0]?.comments;
      issuedByData.designation = senderDesignation;
      issuedByData.createdTime = issuedByComments[0]?.auditDetails?.createdTime;
    }

    if (issuedToDocuments?.length > 0) {
      issuedToData.documents = issuedToDocuments;
    }

    if (issuedBydocuments?.length > 0) {
      issuedByData.documents = issuedBydocuments;
    }

    const showcauseResponses = [
      { ...issuedToData, label: issuedTo },
      { ...issuedByData, label: issuedBy },
    ].filter((obj) => Object.keys(obj).length > 1);

    return (
      <Box mt={2}>
        {showcauseResponses.map((data) => (
          <Box key={data.label} className="bg-white py-2 rounded-lg">
            <Box>
              <Typography variant="subtitle1" className="farmer-key" mb={1}>
                {`${`${data.designation} ${t("GRM_RESPONSE")}`}`}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666666" }}>
                {formattedDateTime(data?.createdTime || new Date())}
              </Typography>
              <Box>
                <Typography
                  variant="body2"
                  mt={1}
                  sx={{
                    background: "#f2f2f2",
                    padding: 1,
                    borderRadius: "5px",
                  }}
                >
                  {t("GRM_COMMENT")}: {data?.comment ? data?.comment : ""}
                </Typography>
              </Box>
            </Box>
            <Box className="pt-1">
              <Box className="p-1">
                {data?.documents?.some((file) =>
                  acceptedFileTypes.includes(file.documentType)
                ) ? (
                  renderFiles(data?.documents)
                ) : (
                  <Box className="pt-1">{t("GRM_NO_ATTACHMENTS")}</Box>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box className="w-11/12 m-auto pb-10">
      <Typography className="details-page-header" mt={3}>
        {t("GRM_SHOWCAUSE_DETAILS")}
      </Typography>
      <Box className="mt-4">
        <Box>
          {[
            issueDate,
            recipientName,
            recipientDesignation,
            t("SHCN_HEADER_TEXT"),
          ].map((text, index) => (
            <Typography key={index} className="letter-content">
              {text},
            </Typography>
          ))}
        </Box>
        <Box className="letter-content my-3">{t("SHCN_SUBJECT")}</Box>
        <Box className="letter-content mb-2">
          {t("SHCN_GREETING")} {recipientName},
        </Box>
        <Box>
          <Typography className="letter-content">
            {t("SHCN_BODY_PART_1")}{" "}
            <span className="complaint-link">{complaintId}</span>{" "}
            {t("SHCN_BODY_PART_2")}{" "}
            <span className="font-semibold">
              {timeFrame} {t("SHCN_BODY_WORD_DAYS")}
            </span>{" "}
            {t("SHCN_BODY_PART_3")}{" "}
            <span className="complaint-link">{complaintId}</span>{" "}
            {t("SHCN_BODY_PART_4")}{" "}
            <span className="font-semibold">{senderDesignation}</span>{" "}
            {t("SHCN_BODY_PART_5")}
          </Typography>
          <Typography sx={{ marginTop: "12px" }} className="letter-content">
            {t("SHCN_BODY_PART_6")}{" "}
            <span className="font-semibold">{responseDueDate}</span>.{" "}
            {t("SHCN_BODY_PART_7")}
          </Typography>
        </Box>
        <Box className="letter-footer mt-5">
          {[
            t("SCHN_FOOTER"),
            senderName,
            senderDesignation,
            senderContactInfo,
          ].map((text, index) => (
            <Typography key={index} className="letter-content">
              {text},
            </Typography>
          ))}
        </Box>
        <Box className="mt-4 letter-content">
          *****{t("SHCN_INFO_TEXT")}*****
        </Box>
      </Box>
      {renderShowcauseHistory()}
      {respond && (
        <ResponceInputRenderer
          t={t}
          preview={preview}
          remarks={remarks}
          setRemarks={setRemarks}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          renderFiles={renderFiles}
          respond={respond}
          setPreview={setPreview}
          isShowcause={true}
          setRespond={setRespond}
          handleCloseResponse={handleCloseResponse}
        />
      )}
      <Box className="mt-1 flex justify-end">
        <Button
          variant="outlined"
          className="complaint-cancel-button"
          onClick={() => setOpenShowCause(false)}
        >
          {t("COMMON_BACK")}
        </Button>
        {respondAccess && !respond && (
          <Button
            variant="contained"
            className="compaint-respond-button"
            onClick={() => setRespond(true)}
          >
            {t("COMMON_RESPOND")}
          </Button>
        )}
        {respond && preview && (
          <>
            <Button
              variant="contained"
              className="edit-complaint"
              onClick={() => setPreview(false)}
            >
              {t("COMMON_EDIT")}
            </Button>
            {actionAccess ? (
              <>
                <Button
                  variant="contained"
                  className={
                    remarks ? "reject-complaint-button" : "button-rounded-full"
                  }
                  onClick={() => handleSubmit("REJECTED")}
                  disabled={!remarks}
                >
                  {t("COMMON_REJECT")}
                </Button>
                <Button
                  variant="contained"
                  className={remarks ? "edit-complaint" : "button-rounded-full"}
                  onClick={() => handleSubmit("ACCEPTED")}
                  disabled={!remarks}
                >
                  {t("COMMON_ACCEPT")}
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                className={
                  remarks ? "compaint-respond-button" : "button-rounded-full"
                }
                onClick={() => handleSubmit("RESPONDED")}
                disabled={!remarks}
              >
                {t("COMMON_SUBMIT")}
              </Button>
            )}
          </>
        )}
      </Box>
      <ConfirmationDialog
        open={open}
        onClose={handleClose}
        loading={loading}
        status={submissionStatus.success}
        t={t}
      >
        {!loading && submissionStatus.success ? (
          <Box
            className="flex flex-col tems-center justify-center m-2 mb-5 fle"
            data-testid="ticket-details"
          >
            <Typography>
              {t(submissionStatus.message)}{" "}
              <span className="font-bold ml-2 block">{complaintId}</span>{" "}
              {t(`${submissionStatus.message}_TAIL`)}
            </Typography>
          </Box>
        ) : (
          <Typography>{t(submissionStatus.message)}</Typography>
        )}
      </ConfirmationDialog>
    </Box>
  );
}

export default ShowCauseNotice;
