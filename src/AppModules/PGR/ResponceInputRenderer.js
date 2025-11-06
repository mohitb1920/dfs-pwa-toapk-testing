import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { acceptedFileTypes } from "../../components/Constants";
import AttachmentIcon from "@mui/icons-material/Attachment";
import CloseIcon from "@mui/icons-material/Close";
import { CustomDropdown } from "./ComplaintsInbox";
import { CustomTextField } from "../../components/CustomComponents";

function ResponceInputRenderer(props) {
  const {
    t,
    preview,
    remarks,
    setRemarks,
    selectedFiles,
    setSelectedFiles,
    renderFiles,
    respond,
    onSubmitClick,
    setPreview,
    isShowcause,
    dropdownOptions = [],
    isSaoUser = false,
    satisfactionCategory,
    setSatisfactionCategory,
    otherComments,
    setOtherComments,
    handleCloseResponse,
  } = props;
  const fileInputRef = useRef(null);
  const [fileError, setFileError] = useState({
    size: false,
    reject: false,
  });

  const handleFileUpload = () => {
    const selectedFile = fileInputRef.current.files[0];
    const fileSizeMB = selectedFile.size / (1024 * 1024);
    if (acceptedFileTypes.indexOf(selectedFile.type) <= -1) {
      setFileError({ size: false, reject: true });
      return;
    }
    if (fileSizeMB > 10) {
      setFileError({ reject: false, size: true });
      return;
    }
    setFileError({ reject: false, size: false });
    setSelectedFiles([...selectedFiles, selectedFile]);
  };

  const handleDropdownChange = (value) => {
    setSatisfactionCategory(value);
    setOtherComments("");
  };

  return (
    <Box data-testid="employee-response">
      <Paper
        className="remarks-input-box"
        sx={{
          borderColor:
            respond && preview && !remarks
              ? "#A5292B"
              : preview
              ? "#cccccc"
              : "#0089ff",
        }}
      >
        <CloseIcon
          sx={{
            position: "absolute",
            right: "5px",
            top: "5px",
            cursor: "pointer",
          }}
          fontSize="small"
          onClick={handleCloseResponse}
        />
        {isSaoUser && (
          <Box sx={{ mr: 4, mt: 2, ml: 2 }}>
            <CustomDropdown
              id="sao-dissatisfaction-category"
              options={dropdownOptions}
              getOptionLabel={(option) => option.title}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("GRM_DISSATISFACTION_CATEGORY")}
                  placeholder={t("GRM_SELECT")}
                />
              )}
              onChange={(event, newValue) => handleDropdownChange(newValue)}
              disabled={preview}
            />
            {satisfactionCategory?.value === "other" && (
              <CustomTextField
                variant="outlined"
                fullWidth
                multiline
                size="small"
                sx={{ mt: 1 }}
                placeholder={t("GRM_COMMENT")}
                label={t("GRM_PLEASE_SPECIFY")}
                inputProps={{
                  "aria-label": "Other Comments to a grievance",
                  maxLength: 48,
                }}
                autoFocus
                value={otherComments}
                onChange={(e) => setOtherComments(e.target.value)}
                error={preview && !otherComments}
                helperText={
                  preview && !otherComments
                    ? t("GRM_OTHER_COMMENTS_ERROR")
                    : `${otherComments.length}/${48}`
                }
                disabled={preview}
              />
            )}
          </Box>
        )}
        <Typography px={2} py={1}>
          {t("GRM_COMMENT")} <span className="required-field"> *</span>
        </Typography>
        <InputBase
          sx={{
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            px: 2,
          }}
          inputProps={{
            "aria-label": "Comments to a grievance",
            maxLength: isSaoUser ? 880 : 1024,
            "data-testid": "remarks-input",
          }}
          fullWidth
          multiline
          autoFocus
          onChange={(e) => setRemarks(e.target.value)}
          value={remarks}
          disabled={preview}
        />
        <Box className="flex justify-between p-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: "none" }}
            disabled={selectedFiles?.length > 4}
          />
          <IconButton
            onClick={() => fileInputRef.current.click()}
            disabled={preview}
          >
            <AttachmentIcon />
          </IconButton>
          <Box>
            {respond && !preview && (
              <Button
                variant="contained"
                className="compaint-respond-button"
                onClick={() => {
                  setRemarks(remarks.trim());
                  setPreview(true);
                }}
              >
                {t("COMMON_PREVIEW")}
              </Button>
            )}
            {!isShowcause && respond && preview && (
              <>
                <Button
                  variant="contained"
                  className="edit-complaint"
                  onClick={() => setPreview(false)}
                >
                  {t("COMMON_EDIT")}
                </Button>
                <Button
                  variant="contained"
                  className={
                    !remarks ||
                    (isSaoUser &&
                      satisfactionCategory?.value === 0 &&
                      !otherComments)
                      ? ""
                      : "compaint-respond-button"
                  }
                  onClick={onSubmitClick}
                  disabled={
                    !remarks ||
                    (isSaoUser &&
                      satisfactionCategory?.value === 0 &&
                      !otherComments)
                  }
                >
                  {t("COMMON_SUBMIT")}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Paper>
      <Typography
        variant="caption"
        color={respond && preview && !remarks && "#A5292B"}
      >
        {respond && preview && !remarks
          ? t("REMARKS_EMPTY_ERROR")
          : `${remarks.length}/${isSaoUser ? 880 : 1024}`}
      </Typography>
      {fileError.size && (
        <Box className="pt-2 text-red text-sm">{t("FILE_SIZE_ERROR")}</Box>
      )}
      {fileError.reject && (
        <Box className="pt-2 text-red text-sm">{t("FILE_SIZE_INFO")}</Box>
      )}
      {selectedFiles?.length > 4 && (
        <Box className="pt-2 text-red text-sm">{t("MAX_FILES_INFO")}</Box>
      )}
      <Box className="pt-3">
        {/* <Typography variant="subtitle1" className="farmer-key">
          {t("GRM_ATTACHMENTS")}
        </Typography> */}
        <Box className="pb-1">
          {renderFiles(selectedFiles)}
          {/* {selectedFiles?.length === 0 && (
            <Box className="pt-2 pb-4 text-center">
              {t("GRM_NO_ATTACHMENTS")}
            </Box>
          )} */}
        </Box>
      </Box>
    </Box>
  );
}

export default ResponceInputRenderer;
