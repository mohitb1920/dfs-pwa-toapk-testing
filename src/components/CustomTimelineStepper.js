import {
  Box,
  CircularProgress,
  Container,
  Dialog,
  IconButton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { format, toDate } from "date-fns";
import {
  acceptedFileTypes,
  citizenEmployeeActions,
  employeeActions,
} from "./Constants";
import { pgrRoles } from "./Utils";
import { useTranslation } from "react-i18next";
import FilesRenderer from "../AppModules/PGR/FilesRenderer";
import ResponceInputRenderer from "../AppModules/PGR/ResponceInputRenderer";
import { getUser } from "../services/loginService";
import ShowCauseNotice from "../AppModules/PGR/ShowCauseNotice";
import CustomButton from "./Button/CustomButton";
import { ButtonColor, ButtonSize } from "./Button/ButtonEnums";
import InteractiveElement from "./InteractiveElement/InteractiveElement";

export const formattedDateTime = (dateTime) => {
  return format(toDate(dateTime), " MMM dd, yyyy 'at' hh:mm a");
};

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    marginLeft: 5,
    borderColor: "#096B37",
  },
}));

const ColorStepIconRoot = styled("div")((props) => ({
  backgroundColor: "transparent",
  zIndex: 1,
  color: "#000",
  width: 35,
  height: 35,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  border: `1px solid ${props?.bordercolor || "#096B37"}`,
}));

const StatusPill = (applicationStatus, t) => {
  const match = applicationStatus?.match(
    /^(PENDINGATSAO|PENDING|RESOLVED|REOPENED)/
  );
  const status = match ? match[0] : applicationStatus;
  const colorPalette = {
    RESOLVED: { light: "#4AB14C", main: "#fff" },
    CLOSEDAFTERRESOLUTION: { light: "#4AB14C", main: "#fff" },
    PENDING: { light: "#FAA21E", main: "#fff" },
    REOPENED: { light: "#FAA21E", main: "#fff" },
  };
  const backgroundColor = colorPalette[status]?.light || "#4AB14C";
  const color = colorPalette[status]?.main || "#fff";

  return (
    <Box
      sx={{ background: backgroundColor, color: color }}
      className="ticket-status-pill"
    >
      {t(`GRM_${status}`)}
    </Box>
  );
};

function ColorStepIcon(props) {
  const { className, type } = props;

  const icons = {
    showcause: <WarningIcon sx={{ color: "#A5292B" }} />,
    resolving: (
      <HistoryIcon sx={{ color: "#faa21e", width: "1.3em", height: "1.2em" }} />
    ),
    approve: <CheckIcon sx={{ color: "#096B37" }} />,
    current: (
      <CheckCircleIcon
        sx={{ color: "#096B37", width: "1.3em", height: "1.2em" }}
      />
    ),
  };

  const bgColors = {
    showcause: "#A5292B",
    resolving: "#faa21e",
    approve: "#096B37",
    current: "#096B37",
  };

  return (
    <ColorStepIconRoot className={className} bordercolor={bgColors[type]}>
      {icons[String(type)]}
    </ColorStepIconRoot>
  );
}

ColorStepIcon.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node,
  type: PropTypes.string,
};

const getAssignerName = (user) => {
  const roles = user?.roles || [];
  if (roles && roles.length > 0) {
    const userRoles = roles.filter((role) => pgrRoles.includes(role.code));
    return userRoles?.[0]?.name || "Employee";
  }
  return "null";
};

function CustomTimelineStepper(props) {
  const {
    complaintTimelineData,
    complaintStatus,
    hasRespondAccess,
    hasReopenAccess,
    remarks,
    setRemarks,
    onSubmitClick,
    selectedFiles,
    setSelectedFiles,
    complaintId,
    isSaoUser,
    satisfactionCategory,
    setSatisfactionCategory,
    otherComments,
    setOtherComments,
    combinedShowcauseDetails,
    isShowcauseLoading,
    refetchShowcauseDetails,
    onReopenSubmit,
    isAgentUser = false,
  } = props;
  const { t, i18n } = useTranslation();
  const userInfo = useMemo(() => getUser(), []);
  const [preview, setPreview] = useState(false);
  const [respond, setRespond] = useState(false);
  const [complaintSteps, setComplaintSteps] = useState([]);
  const [openShowCause, setOpenShowCause] = useState(false);
  const [issuedStatus, setIssuedStatus] = useState("");

  const saoOptions = useMemo(
    () => [
      { title: t("GRM_DELAY_IN_RESOLUTION"), value: "Delay in Resolution" },
      { title: t("GRM_COMMUNICATION_ISSUES"), value: "Communication Issues" },
      {
        title: t("GRM_PARTIAL_INCORRECT_RESOLUTION"),
        value: "Partial/Incorrect Resolution",
      },
      { title: t("GRM_TECHNICAL_ISSUES"), value: "Techinical Issues" },
      { title: t("GRM_ANY_OTHER"), value: "other" },
    ],
    [i18n.language, t]
  );

  const isRespondedToShowcause = useMemo(() => {
    const { comments } = combinedShowcauseDetails?.issuedTo || {};
    if (comments?.length > 0) {
      const commentByMe = comments.filter(
        (obj) => obj.commentedBy === userInfo.uuid
      );
      return commentByMe.length > 0;
    }
    return false;
  }, [combinedShowcauseDetails]);

  const isAccOrRejToShowcause = useMemo(() => {
    const { comments } = combinedShowcauseDetails?.issuedBy || {};
    if (comments?.length > 0) {
      const commentByMe = comments.filter(
        (obj) => obj.commentedBy === userInfo.uuid
      );
      return commentByMe.length > 0;
    }
    return false;
  }, [combinedShowcauseDetails]);

  const isAcceptedShowcause = useMemo(() => {
    const { status } = combinedShowcauseDetails?.issuedBy || {};
    return isAccOrRejToShowcause && status === "ACCEPTED";
  }, [isAccOrRejToShowcause]);

  const historyElement = (data, index) => {
    const { performedAction } = data;
    const createdEpoch = data?.auditDetails?.createdEpoch;
    const timeStamp = formattedDateTime(createdEpoch);

    const generateStepData = (
      stepLabel,
      role,
      uuid,
      description = "",
      documents = null,
      type = "approve",
      action = "ACTION"
    ) => ({
      stepLabel,
      role,
      uuid,
      description,
      documents,
      timeStamp,
      type,
      action,
    });

    if (performedAction === "ESCALATE") {
      const showcauseDisabled = true;
      const issuedTouser =
        complaintTimelineData?.[index + 1]?.assignes?.[0] ?? {};
      const showCauseIssuedTo = getAssignerName(issuedTouser);
      const issuedByUser = data?.assignes?.[0] ?? {};
      const ticketAssignedTo = getAssignerName(issuedByUser);
      const steps = [
        generateStepData(
          `${t("GRM_ASSIGNED_TO")} ${ticketAssignedTo} ${t(
            "GRM_ASSIGNED_TO_SUFFIX"
          )}`,
          ticketAssignedTo,
          null
        ),
        ...(isAgentUser || showcauseDisabled
          ? []
          : [
              generateStepData(
                `${t("GRM_SHOWCAUSE_ISSUED_TO")} ${showCauseIssuedTo} ${t(
                  "GRM_SHOWCAUSE_ISSUED_TO_SUFFIX"
                )}`,
                showCauseIssuedTo,
                { issuedTo: issuedTouser?.uuid, issuedBy: issuedByUser?.uuid },
                "",
                null,
                "showcause"
              ),
            ]),
      ];
      return steps;
    }
    if (["APPLY", "ASSIGN", "REASSIGN"].includes(performedAction)) {
      const roleName = getAssignerName(data?.assignes?.[0]);
      const stepLabel = (() => {
        switch (performedAction) {
          case "CLOSE":
            return `${t("GRM_ASSIGNED_VERIFICATION")} ${roleName} ${t(
              "GRM_ASSIGNED_VERIFICATION_SUFFIX"
            )}`;
          case "APPLY":
            return t("GRM_TICKET_CREATED");
          default:
            return `${t("GRM_ASSIGNED_TO")} ${roleName} ${t(
              "GRM_ASSIGNED_TO_SUFFIX"
            )}`;
        }
      })();
      return [generateStepData(stepLabel, roleName, null)];
    } else {
      const employeeAction = employeeActions.includes(performedAction);
      const roleName = getAssignerName(data?.assigner);
      const verifyAction = performedAction === "VERIFY";
      const prefix = verifyAction ? "GRM_VERIFIED_BY" : "GRM_RESOLVED_BY";
      const suffix = verifyAction
        ? "GRM_VERIFIED_BY_SUFFIX"
        : "GRM_RESOLVED_BY_SUFFIX";
      const stepLabel = `${
        employeeAction
          ? `${t(prefix)} ${roleName} ${t(suffix)}`
          : `${t("GRM_REOPENED_BY_FARMER")}`
      }`;
      const comments = verifyAction
        ? JSON.parse(data?.wfComment)
        : data?.wfComment || "";
      return [
        generateStepData(
          stepLabel,
          roleName,
          null,
          comments,
          data?.wfDocuments,
          "approve",
          performedAction
        ),
      ];
    }
  };

  const renderComplaintHistory = () => {
    const hisotry = [];
    for (let i = 0; i < complaintTimelineData.length; i++) {
      if (
        citizenEmployeeActions.indexOf(
          complaintTimelineData[i]?.performedAction
        ) > -1
      ) {
        hisotry.push(...(historyElement(complaintTimelineData[i], i) || []));
      }
    }
    return hisotry;
  };

  const respondStep = (index) => {
    const respondingUser = complaintSteps[index].role;
    const respondStep = {
      stepLabel: isSaoUser
        ? `${t("GRM_GRIEVANCE_FOR_VERIFICATION")}`
        : `${t("GRM_RESOLVING_BY")} ${respondingUser} ${t(
            "GRM_RESOLVING_BY_SUFFIX"
          )}`,
      description: "",
      documents: null,
      timeStamp: formattedDateTime(new Date().getTime()),
      type: "resolving",
    };
    return respondStep;
  };

  const handleRespond = () => {
    const steps = [...complaintSteps];
    const step = respondStep(0);
    steps.unshift(step);
    setComplaintSteps(steps);
    setRespond(true);
  };

  const reopenStep = {
    stepLabel: t("REOPEN_BY_FARMER"),
    description: "",
    documents: null,
    timeStamp: formattedDateTime(new Date().getTime()),
    type: "resolving",
  };

  const handleReopen = () => {
    const steps = [...complaintSteps];
    steps.unshift(reopenStep);
    setComplaintSteps(steps);
    setRespond(true);
  };

  const handleCloseResponse = () => {
    const steps = [...complaintSteps];
    steps.shift();
    setComplaintSteps(steps);
    setRespond(false);
    setPreview(false);
    setRemarks("");
    setSelectedFiles([]);
    setSatisfactionCategory(null);
    setOtherComments("");
  };

  const handleShowCauseResponse = (status) => {
    setIssuedStatus(status);
    setOpenShowCause(true);
  };

  useEffect(() => {
    let steps = [];
    steps = renderComplaintHistory();
    if (complaintSteps.length > 0 && respond) {
      const step = hasReopenAccess ? reopenStep : respondStep(1);
      steps.unshift(step);
    }
    setComplaintSteps(steps);
  }, [complaintTimelineData, i18n.language]);

  const renderFiles = (files) => {
    return (
      <FilesRenderer
        t={t}
        selectedFiles={files}
        setSelectedFiles={setSelectedFiles}
        preview={preview}
      />
    );
  };

  const descriptionFields = [
    {
      key: "satisfactionCategory",
      label: t("GRM_DISSATISFACTION_CATEGORY"),
      isHighlighted: true,
    },
    { key: "otherComments", label: t("GRM_DESCRIPTION") },
    { key: "remarks", label: t("GRM_COMMENT") },
  ];

  return (
    <Container variant="white" className="!rounded-[12px]">
      <Box className="mt-[40px] p-[16px] sm:p-[32px]">
        {isShowcauseLoading ? (
          <Box className="flex items-center justify-center h-60">
            <CircularProgress color="success" />
          </Box>
        ) : (
          <>
            <Box className="flex justify-between items-center">
              <Box className="flex items-center">
                <Typography mr={1}>{t("GRM_STATUS")}: </Typography>
                {StatusPill(complaintStatus, t)}
              </Box>
              {hasReopenAccess && !respond && (
                <CustomButton
                  color={ButtonColor.SECONDARY}
                  size={ButtonSize.SMALL}
                  onClick={handleReopen}
                >
                  {t("COMMON_REOPEN")}
                </CustomButton>
              )}
            </Box>
            <Box sx={{ py: 2 }}>
              <Stepper orientation="vertical" connector={<ColorlibConnector />}>
                {complaintSteps?.map((step, index) => (
                  <Step key={index} active>
                    <StepLabel
                      StepIconComponent={(stepLabelProps) => (
                        <ColorStepIcon
                          {...stepLabelProps}
                          type={
                            index === 0 && step?.type !== "resolving"
                              ? "current"
                              : step?.type
                          }
                        />
                      )}
                      sx={{ padding: 0 }}
                    >
                      {step.stepLabel}
                    </StepLabel>
                    <StepContent
                      sx={{ marginLeft: "17px", borderColor: "#096B37" }}
                    >
                      <Typography
                        variant="subtitle2"
                        className="timeline-timestamp"
                      >
                        {step.timeStamp}
                      </Typography>
                      {index === 0 && (hasRespondAccess || hasReopenAccess) && (
                        <Box className="mt-2">
                          {!respond ? (
                            <>
                              {!hasReopenAccess && (
                                <InteractiveElement onClick={handleRespond}>
                                  <Box className="grm-comment-min-box">
                                    <img
                                      src={`${window.contextPath}/assets/comment.svg`}
                                      alt="Comment Icon"
                                      width={20}
                                      height={20}
                                    />{" "}
                                    &nbsp;{t("GRM_COMMENT")}
                                  </Box>
                                </InteractiveElement>
                              )}
                            </>
                          ) : (
                            <ResponceInputRenderer
                              t={t}
                              preview={preview}
                              remarks={remarks}
                              setRemarks={setRemarks}
                              selectedFiles={selectedFiles}
                              setSelectedFiles={setSelectedFiles}
                              renderFiles={renderFiles}
                              respond={respond}
                              onSubmitClick={
                                isAgentUser ? onReopenSubmit : onSubmitClick
                              }
                              setPreview={setPreview}
                              isShowcause={false}
                              setRespond={setRespond}
                              dropdownOptions={saoOptions}
                              isSaoUser={isSaoUser}
                              setSatisfactionCategory={setSatisfactionCategory}
                              satisfactionCategory={satisfactionCategory}
                              otherComments={otherComments}
                              setOtherComments={setOtherComments}
                              handleCloseResponse={handleCloseResponse}
                            />
                          )}
                        </Box>
                      )}
                      {userInfo?.uuid &&
                        userInfo?.uuid === step?.uuid?.issuedTo && (
                          <Box className="mt-2">
                            <Box
                              className="grm-comment-min-box"
                              onClick={() =>
                                handleShowCauseResponse("issuedTo")
                              }
                            >
                              <img
                                src={`${window.contextPath}/assets/comment.svg`}
                                alt="Comment Icon"
                                width={20}
                                height={20}
                              />{" "}
                              &nbsp;
                              {isRespondedToShowcause
                                ? t("GRM_VIEW_RESPONSE")
                                : t("GRM_ADD_RESPONSE")}
                            </Box>
                          </Box>
                        )}
                      {userInfo?.uuid &&
                        userInfo?.uuid === step?.uuid?.issuedBy && (
                          <Box className="mt-2">
                            <Box
                              className="grm-comment-min-box"
                              onClick={() =>
                                handleShowCauseResponse("issuedBy")
                              }
                            >
                              <img
                                src={`${window.contextPath}/assets/comment.svg`}
                                alt="Comment Icon"
                                width={20}
                                height={20}
                              />{" "}
                              &nbsp;
                              {isAccOrRejToShowcause
                                ? isAcceptedShowcause
                                  ? t("GRM_VIEW_ACCEPTED_RESPONSE")
                                  : t("GRM_VIEW_REJECTED_RESPONSE")
                                : t("GRM_ACCEPT_REJECT_RESPONSE")}
                            </Box>
                          </Box>
                        )}
                      {step.description && (
                        <Container variant="tertiaryGreen" className="!px-0">
                          <Box className="step-comments-section">
                            {step.action === "VERIFY" ? (
                              <>
                                {descriptionFields.map(
                                  ({ key, label, isHighlighted }) =>
                                    step.description[key] ? (
                                      <Typography
                                        key={key}
                                        className="version-history-comments"
                                      >
                                        {label}:{" "}
                                        {isHighlighted ? (
                                          <span className="satisfaction-highlight-text">
                                            {step.description[key] === "other"
                                              ? "Any Other"
                                              : step.description[key]}
                                          </span>
                                        ) : (
                                          step.description[key]
                                        )}
                                      </Typography>
                                    ) : null
                                )}
                              </>
                            ) : (
                              <Typography className="version-history-comments">
                                {t("GRM_COMMENT")}: {step.description}
                              </Typography>
                            )}
                          </Box>
                        </Container>
                      )}
                      <Box className="pt-2 flex flex-wrap">
                        {step?.documents &&
                        step?.documents?.some((file) =>
                          acceptedFileTypes.includes(file.documentType)
                        ) ? (
                          renderFiles(step.documents)
                        ) : (
                          <>
                            {step.documents !== null && (
                              <Box className="pt-2 pb-4 text-center">
                                {t("GRM_NO_ATTACHMENTS")}
                              </Box>
                            )}
                          </>
                        )}
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </>
        )}
        <Dialog
          open={openShowCause}
          onClose={() => setOpenShowCause(false)}
          maxWidth="lg"
        >
          <IconButton
            aria-label="close"
            onClick={() => setOpenShowCause(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <ShowCauseNotice
            complaintId={complaintId}
            status={issuedStatus}
            setOpenShowCause={setOpenShowCause}
            showcauseDetails={combinedShowcauseDetails[issuedStatus]}
            refetchShowcauseDetails={refetchShowcauseDetails}
          />
        </Dialog>
      </Box>
    </Container>
  );
}

export default CustomTimelineStepper;
