import { Box, Typography, useTheme } from "@mui/material";
import React, { useCallback, useState } from "react";
import Dropzone from "react-dropzone";
import { useTranslation } from "react-i18next";
import { UploadServices } from "../services/UploadService";
import { TENANT_ID } from "./Utils";

const extensionToMimeType = {
  pdf: "application/pdf",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
};

const FileStatus = {
  PENDING: "pending",
  UPLOADING: "uploading",
  SUCCESS: "success",
  ERROR: "error",
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

function FilesUpload(props) {
  const {
    isUploadFailed,
    setIsUploadFailed,
    selectedFiles,
    setSelectedFiles,
    disabled,
    validFileCount,
    fileLength,
    acceptedFileTypes,
  } = props;
  const [fileError, setFileError] = useState(false);
  const [fileTypeError, setFileTypeError] = useState(false);
  const [folderDropError, setFolderDropError] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";
  const tenantId = TENANT_ID;

  const isUploadInProgress = selectedFiles.some(
    (file) => file.status === FileStatus.UPLOADING
  );

  const uploadFile = async (file) => {
    const newFile = {
      src: getStatusIcon(FileStatus.PENDING),
      type: file.type,
      name: file.name,
      progress: 0,
      status: FileStatus.UPLOADING,
      originalFile: file,
    };

    // Add new file to array first
    let updatedFiles = [...selectedFiles, newFile];
    const fileIndex = updatedFiles.length - 1;
    setSelectedFiles(updatedFiles);

    try {
      const response = await UploadServices.Filestorage(
        "pgr",
        [file],
        tenantId,
        (progress) => {
          // Update progress
          updatedFiles = [...updatedFiles];
          updatedFiles[fileIndex] = {
            ...updatedFiles[fileIndex],
            progress,
          };
          setSelectedFiles(updatedFiles);
        }
      );

      const data = await response.data;

      // Update final status
      updatedFiles = [...updatedFiles];
      updatedFiles[fileIndex] = {
        ...updatedFiles[fileIndex],
        status: FileStatus.SUCCESS,
        fileStoreId: data.files[0].fileStoreId,
        progress: 100,
      };
      setSelectedFiles(updatedFiles);
    } catch (err) {
      // console.error("File upload failed:", err);
      // setIsUploadFailed(true);

      // Update error status
      updatedFiles = [...updatedFiles];
      updatedFiles[fileIndex] = {
        ...updatedFiles[fileIndex],
        status: FileStatus.ERROR,
        progress: 0,
      };
      setSelectedFiles(updatedFiles);
    }
  };

  const clearErrors = () => {
    setFileError(false);
    setFileTypeError(false);
    setFolderDropError(false);
    setIsUploadFailed(false);
  };

  let fileTypes = acceptedFileTypes;
  if (!acceptedFileTypes || acceptedFileTypes.length === 0) {
    fileTypes = ["pdf", "jpg", "jpeg", "png"];
  }

  const onDrop = async (files) => {
    if (disabled) return;
    clearErrors();
    if (files.length === 0) {
      setFolderDropError(true);
      return;
    }
    if (files.length > 0 && files[0].size > 2 * 1024 * 1024) {
      setFileError(true);
    } else if (files.length > 0) {
      const allowedMimeTypes = fileTypes.map((ext) => extensionToMimeType[ext]);

      if (allowedMimeTypes.includes(files[0].type)) {
        setFileError(false);
        setFileTypeError(false);

        const file = files[0];
        const newFile = {
          src: getStatusIcon(FileStatus.PENDING),
          type: file.type,
          name: file.name,
          progress: 0,
          status: FileStatus.UPLOADING,
          originalFile: file,
        };

        const updatedFiles = [...selectedFiles, newFile];
        setSelectedFiles(updatedFiles);
        await uploadFile(file);
      } else {
        setFileTypeError(true);
      }
    }
  };

  return (
    <Box className="file-upload-container">
      <Dropzone
        onDrop={onDrop}
        multiple={false}
        disabled={
          disabled || validFileCount >= fileLength || isUploadInProgress
        }
        onDragEnter={clearErrors}
        onFileDialogOpen={clearErrors}
      >
        {({ getRootProps, getInputProps }) => (
          <Box
            {...getRootProps()}
            className="flex flex-col items-center p-8 border border-[#A2ABA6] rounded-lg"
            bgcolor={
              isDarkTheme
                ? theme.palette.background.tertiaryGreen
                : theme.palette.background.default
            }
          >
            <input {...getInputProps()} data-testid="dropzone" />
            <Box className="flex flex-col justify-center items-center gap-4">
              <img
                alt="alt-logo"
                src={`${window.contextPath}/assets/${theme.palette.mode}/UploadIcon2.svg`}
                className="w-[64px] h-[64px] cursor-pointer"
              />

              {validFileCount >= fileLength ? (
                <Typography>{t("MAX_FILES_INFO")}</Typography>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    className="text-center font-normal text-base leading-[22.4px]"
                  >
                    <span
                      className="text-center font-normal text-base leading-[22.4px]"
                      style={{ color: theme.palette.text.textGrey }}
                    >
                      {`${t("COMMON_CHOOSE")} `}
                    </span>
                    <span
                      className="text-center font-medium text-base leading-5 underline decoration-solid cursor-pointer"
                      style={{
                        color: theme.palette.text.textGreen,
                        letterSpacing: "-0.02em",
                        textUnderlinePosition: "from-font",
                        textDecorationSkipInk: "none",
                      }}
                    >
                      {t("FILE_TO_UPLOAD")}
                    </span>
                  </Typography>
                </>
              )}
            </Box>

            {isUploadFailed && (
              <Box className="pt-2 font-semibold" color={theme.palette.text.error}>
                {t("FILE_UPLOAD_FAILED_ERROR")}
              </Box>
            )}

            {fileError && (
              <Box className="pt-1 font-semibold" color={theme.palette.text.error}>
                {t("schemes.fileSizeInfo")}
              </Box>
            )}
            {fileTypeError && (
              <Box className="pt-2 font-semibold" color={theme.palette.text.error}>
                {t("FILE_TYPE_ERROR")}
              </Box>
            )}
            {folderDropError && (
              <Box className="pt-2 font-semibold" color={theme.palette.text.error}>
                {t("FOLDER_UPLOAD_NOT_SUPPORTED")}
              </Box>
            )}
            <Typography
              className="text-sm text-gray-500"
              color={theme.palette.text.primary}
            >
              ({t("schemes.fileSizeInfo")})
            </Typography>
          </Box>
        )}
      </Dropzone>
    </Box>
  );
}

export default FilesUpload;
