import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  IconButton,
  LinearProgress,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Document, Page, pdfjs } from "react-pdf";
import PropTypes from "prop-types";
import { fileUrl } from "./Utils";
import { useTranslation } from "react-i18next";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const FileStatus = {
  PENDING: "pending",
  UPLOADING: "uploading",
  SUCCESS: "success",
  ERROR: "error",
};
function FilesRenderer(props) {
  const { setSelectedFiles, files, preview = false } = props;

  const [openPreview, setOpenPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState({});
  const [numPages, setNumPages] = useState(null);

  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";

  const closePreview = () => {
    setPreviewFile(null);
    setNumPages(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case FileStatus.SUCCESS:
        return "/assets/agentOperationSuccess.svg";
      case FileStatus.ERROR:
        return "/assets/agentOperationFail.svg";
      case FileStatus.UPLOADING:
      case FileStatus.PENDING:
      default:
        return "/assets/documentUpload.svg";
    }
  };

  const getActionIcon = (status, index) => {
    switch (status) {
      case FileStatus.SUCCESS:
        return "/assets/DeleteTrash.svg";
      default:
        return `/assets/${theme.palette.mode}/cross.svg`;
    }
  };

  const getProgress = (file) => {
    switch (file.status) {
      case FileStatus.UPLOADING:
        return `${t("FILE_UPLOADING")} ${file.progress}%`;
      case FileStatus.SUCCESS:
        // Assuming file.size is in bytes, we can format it to KB or MB if needed
        const fileSize = (file.originalFile.size / (1024 * 1024)).toFixed(2); // Convert bytes to KB
        return `${t("FILE_UPLOADED")} ${fileSize} MB`;
      case FileStatus.ERROR:
        return t("FILE_UPLOAD_FAILED");
      default:
        return "";
    }
  };

  const onViewClick = (file, type) => {
    if (file?.fileStoreId) {
      setPreviewFile({
        name: file?.name,
        type: type,
        url: fileUrl(file?.fileStoreId),
      });
    } else {
      const objectUrl = URL.createObjectURL(file);
      setPreviewFile({ type: type, url: objectUrl });
    }
    setOpenPreview(true);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
  };

  return (
    <Box className="">
      <Box className="flex flex-wrap gap-4">
        {files?.map((file, index) => {
          if(preview && file.status === FileStatus.ERROR) return;
          
          const type = file?.documentType || file?.type;
          const name = file?.documentType || file?.name;

          return (
            <Box
              key={index + ""}
              className="flex flex-col border border-[#D7DEDA] rounded-[4px] mb-4 w-full md:w-[calc(50%-8px)] lg:w-[273px]"
              bgcolor={
                isDarkTheme
                  ? theme.palette.background.tertiaryGreen
                  : theme.palette.background.default
              }
            >
              <Box
                key={index + " "}
                className="flex w-full justify-between items-start p-2 gap-2"
              >
                <Box className="flex items-start gap-2">
                  <Avatar
                    src={`${window.contextPath}${getStatusIcon(file.status)}`}
                    alt={file.status}
                    className="!w-[32px] !h-[32px]"
                  />
                  <Box className="flex flex-col justify-center items-start gap-1">
                    <Typography
                      className="!text-sm !font-semibold !leading-5"
                      color={theme.palette.text.primary}
                    >
                      {name?.length > 14 ? name?.slice(0, 14) + "..." : name}
                    </Typography>
                    <span
                      class="font-normal text-xs leading-[120%] text-[#5C6460]"
                      style={{
                        color:
                          file.status === FileStatus.ERROR
                            ? theme.palette.text.error
                            : theme.palette.text.textGrey,
                      }}
                    >
                      {getProgress(file)}
                    </span>
                  </Box>
                </Box>
                <Box className="flex min-w-6">
                  {file.status === FileStatus.SUCCESS && (
                    <IconButton
                      className="!p-1"
                      onClick={() => onViewClick(file, type)}
                    >
                      <img
                        src={`${window.contextPath}/assets/${theme.palette.mode}/preview.svg`}
                        alt={file.status}
                        className="w-4 h-4"
                      />
                    </IconButton>
                  )}
                  {!preview && (
                    <IconButton
                      className="!p-1"
                      onClick={() => removeFile(index)}
                    >
                      <img
                        src={`${window.contextPath}${getActionIcon(
                          file.status,
                          index
                        )}`}
                        alt={file.status}
                        className="w-4 h-4"
                      />
                    </IconButton>
                  )}
                </Box>
              </Box>
              {!preview && (
                <LinearProgress
                  className="w-full !h-2"
                  variant="determinate"
                  value={file.progress}
                  sx={{
                    // Set the background to white
                    backgroundColor: isDarkTheme ? "#FFFFFF" : "#D7DEDA",
                    // Apply gradient to the progress bar (the filled portion)
                    "& .MuiLinearProgress-bar": {
                      background: isDarkTheme
                        ? "linear-gradient(90deg, rgba(115, 232, 148, 0.40) 0%, rgba(26, 92, 75, 0.20) 100%), #85BC31;"
                        : "linear-gradient(90deg, rgba(115, 232, 148, 0.4) 0%, rgba(26, 92, 75, 0.2) 100%), linear-gradient(0deg, #18342D, #18342D), #1A5C4B",
                    },
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>

      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        maxWidth="lg"
      >
        <DialogTitle className="flex items-center justify-between">
          <Typography>{previewFile?.name}</Typography>
          <IconButton onClick={() => setOpenPreview(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box className="p-4">
          {previewFile?.type === "application/pdf" ? (
            <Document
              file={previewFile.url}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={
                <CircularProgress color="success" data-testid="pdf-document" />
              }
            >
              {Array.from(new Array(numPages)).map((_, index) => (
                <Page
                  key={`page_${index}`}
                  pageNumber={index + 1}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  width={800}
                />
              ))}
            </Document>
          ) : (
            <img
              src={previewFile?.url}
              alt="preview"
              className="max-h-[90vh] w-auto mx-auto"
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
}

FilesRenderer.propTypes = {
  preview: PropTypes.bool,
  selectedfilesFiles: PropTypes.array,
  setSelectedFiles: PropTypes.func,
};

export default FilesRenderer;
