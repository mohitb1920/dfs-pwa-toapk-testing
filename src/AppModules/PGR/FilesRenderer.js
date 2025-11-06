import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { fileUrl } from "../../components/Utils";
import { Document, Page, pdfjs } from "react-pdf";
import { acceptedFileTypes } from "../../components/Constants";
import PropTypes from "prop-types";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function FilesRenderer(props) {
  const { preview, selectedFiles, setSelectedFiles } = props;

  const [openPreview, setOpenPreview] = useState(false);
  const [previewFile, setPreviewFile] = useState({});
  const [numPages, setNumPages] = useState(null);
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";

  const onViewClick = (file, type) => {
    if (file?.fileStoreId) {
      setPreviewFile({
        type: type,
        url: fileUrl(file?.fileStoreId),
      });
    } else {
      const objectUrl = URL.createObjectURL(file);
      setPreviewFile({ type: type, url: objectUrl });
    }
    setOpenPreview(true);
  };

  const getFileUrl = (file) => {
    return file?.fileStoreId
      ? fileUrl(file?.fileStoreId)
      : URL.createObjectURL(file);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <Box>
      <Grid container>
        {selectedFiles.map((file, index) => {
          const type = file?.documentType || file?.type;
          const name = file?.documentType || file?.name;
          if (acceptedFileTypes.includes(type)) {
            return (
              <Grid mr={1} key={index}>
                <Box className="attachment-details">
                  <Box className="flex items-center">
                    <Avatar
                      alt="attachment"
                      src={`${window.contextPath}/assets//${theme.palette.mode}/documentUpload.svg`}
                      className="attachment-logo"
                    />
                    <Box>
                      <Typography variant="primary">
                        {name?.length > 14 ? name?.slice(0, 14) + "..." : name}
                      </Typography>
                    </Box>
                  </Box>
                  <Box className="ml-1 flex items-center">
                    {type?.includes("zip") ? (
                      <Link to={getFileUrl(file)} target="_blank">
                        <DownloadOutlinedIcon
                          sx={{ color: isDarkTheme ? "#fff" : "#5C6460" }}
                        />
                      </Link>
                    ) : (
                      <img
                        src={`${window.contextPath}/assets/${theme.palette.mode}/preview.svg`}
                        alt={file.status}
                        className="w-5 h-5"
                        onClick={() => onViewClick(file, type)}
                      />
                    )}
                    {!file?.fileStoreId && !preview && (
                      <IconButton
                        sx={{ ml: 1 }}
                        onClick={() => handleRemoveFile(index)}
                      >
                        <img
                          src={`${
                            window.contextPath
                          }${"/assets/DeleteTrash.svg"}`}
                          alt={"Delete File Icon"}
                          className="w-5 h-5"
                        />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Grid>
            );
          }
          return null;
        })}
      </Grid>
      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        maxWidth="lg"
      >
        <DialogTitle sx={{ m: 0, p: 1.5, minWidth: "20vw" }} id="image-preview">
          Preview
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setOpenPreview(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        {previewFile.type === "application/pdf" && (
          <Document
            file={previewFile.url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <CircularProgress color="success" data-testid="pdf-document" />
            }
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index}`}
                pageNumber={index + 1}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                width={"800"}
              />
            ))}
          </Document>
        )}
        {(previewFile.type === "image/png" ||
          previewFile.type === "image/jpeg") && (
          <img
            src={previewFile.url}
            alt="preview"
            style={{ maxHeight: "90vh", minHeight: "50vh" }}
          />
        )}
      </Dialog>
    </Box>
  );
}

FilesRenderer.propTypes = {
  preview: PropTypes.bool,
  t: PropTypes.func,
  selectedFiles: PropTypes.array,
  setSelectedFiles: PropTypes.func,
};

export default FilesRenderer;
