import { Avatar, Box, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { useTranslation } from "react-i18next";
import { acceptedFileTypes } from "../../components/Constants";

function SupportFileUploader(props) {
  const { selectedFiles, setSelectedFiles } = props;
  const [fileError, setFileError] = useState(false);
  const [fileTypeError, setFileTypeError] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();

  const onDrop = (files) => {
    if (!acceptedFileTypes.includes(files[0].type)) {
      setFileTypeError(true);
    } else if (files.length > 0 && files[0].size > 10 * 1024 * 1024) {
      setFileTypeError(false);
      setFileError(true);
    } else if (
      files.length > 0 &&
      acceptedFileTypes.indexOf(files[0].type) > -1
    ) {
      setFileError(false);
      setFileTypeError(false);
      setSelectedFiles([...selectedFiles, files[0]]);
    }
  };

  return (
    <Dropzone
      onDrop={onDrop}
      multiple={false}
      disabled={selectedFiles.length > 4}
    >
      {({ getRootProps, getInputProps }) => (
        <Box {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} data-testid="dropzone" />
          <Box className="flex flex-col justify-center items-center">
            <Avatar
              alt="alt-logo"
              src={`${window.contextPath}/assets/${theme.palette.mode}/UploadIcon2.svg`}
              className="file-upload-logo"
            />
            {selectedFiles.length > 4 ? (
              <Box className="pt-1 ">{t("MAX_FILES_INFO")}</Box>
            ) : (
              <>
                <Typography className="dropzone-drag-drop-text">
                  {t("COMMON_CHOOSE")}{" "}
                  <span className="dropzone-drag-drop-text-browse">
                    {t("FILE_TO_UPLOAD")}
                  </span>
                </Typography>
                {fileError && (
                  <Box className="pt-1 text-red font-semibold">
                    {t("FILE_SIZE_ERROR")}
                  </Box>
                )}
                {fileTypeError && (
                  <Box className="pt-2 font-semibold" color="#F13005">
                    {t("FILE_TYPE_ERROR")}
                  </Box>
                )}
                <Box className="dropzone-file-size-info-text">
                  ({t("FILE_SIZE_INFO")})
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
    </Dropzone>
  );
}

export default SupportFileUploader;
