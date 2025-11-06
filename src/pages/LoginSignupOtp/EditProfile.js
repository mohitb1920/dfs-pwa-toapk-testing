import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useMemo, useRef, useState } from "react";
import {
  changePassword,
  getUser,
  updateUser,
} from "../../services/loginService";
import { dispatchNotification } from "../../components/Utils";
import { useDispatch } from "react-redux";
import PasswordForm from "./PasswordForm";
import { customExceptions } from "../../constants";
import { useTranslation } from "react-i18next";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { uploadFiles } from "../../AppModules/PGR/ComplaintDetails";
import EditCitizenProfile from "./EditCitizenProfile";
import PropTypes from "prop-types";
import { userProfileData } from "../../Modules/Actions/userProfileActions";

export const ProfileHeaderSection = (props) => {
  const {
    fileInputRef,
    handleImageClick,
    imageUrl,
    name,
    buttonText,
    buttonClick,
    isMobile,
    photoUploadMessage = null,
    photoUploadSuccess = true,
  } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Box className="edit-profile-header-section green-linear-gradient">
      <Box className="flex justify-end w-full">
        <img
          src={`${window.contextPath}/assets/wheatgrains.svg`}
          alt="wheat"
          className="wheat-logo pr-5"
        />
        <img
          src={`${window.contextPath}/assets/wheatgrains.svg`}
          alt="wheat"
          className="wheat-logo"
        />
      </Box>
      <Box className="profilePhotoBox">
        <Box
          className="profile-image-container"
          // onClick={() => fileInputRef.current.click()}
        >
          <Box>
            <Box className="image-box-effect">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageClick}
                style={{ display: "none" }}
              />
              <Avatar
                // alt={"cases-logo"}
                src={
                  imageUrl !== null
                    ? imageUrl
                    : `${window.contextPath}/assets/supportofficiallogo.svg`
                }
                className="header-profile-image"
              ></Avatar>

              <CameraAltIcon
                className="header-camera-icon"
                onClick={() => fileInputRef.current.click()}
              />
            </Box>
            {photoUploadMessage && (
              <Typography
                variant="body1"
                color={
                  photoUploadSuccess ? theme.palette.text.textGreen : "red"
                }
              >
                {t(photoUploadMessage)}
              </Typography>
            )}
          </Box>

          {(name || buttonText) && (
            <Box className="name-box-styles">
              {name && (
                <Typography
                  variant={isMobile ? "h5" : "h3"}
                  className="edit-profile-employee-name"
                >
                  {name}
                </Typography>
              )}
              {(buttonText) && (
                <Button variant="secondary" size="small" onClick={buttonClick}>
                  {buttonText}
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

ProfileHeaderSection.propTypes = {
  fileInputRef: PropTypes.object,
  handleImageClick: PropTypes.func,
  imageUrl: PropTypes.string,
  name: PropTypes.string,
  buttonText: PropTypes.string,
  buttonClick: PropTypes.func,
  isMobile: PropTypes.bool,
  photoUploadMessage: PropTypes.string,
  photoUploadSuccess: PropTypes.bool,
};

function EditProfile({ isMobile }) {

  const isCitizenUser = localStorage.getItem("DfsWeb.isCitizenUser") === "true";

  const { t } = useTranslation();
  const userInfo = getUser() || {};
  const [changepassword, setChangepassword] = useState(false);
  const [name, setName] = useState(userInfo?.name ? userInfo.name : "");
  const [email, setEmail] = useState(userInfo?.emailId ? userInfo.emailId : "");
  const [mobileNumber, setMobileNumber] = useState(
    userInfo?.mobileNumber ? userInfo.mobileNumber : ""
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUploadStatus, setImageUploadStatus] = useState({});
  const dispatch = useDispatch();
  const isAgentUser = useMemo(() => localStorage.getItem("DfsWeb.isAgentUser"));
  const fileInputRef = useRef(null);

  if (isCitizenUser) return(<EditCitizenProfile isMobile={isMobile}/>);

  const enableSubmit = () => {
    if (
      !changepassword &&
      selectedFile.length === 0 &&
      (((userInfo?.name ? name === userInfo.name : name === "") &&
        mobileNumber === userInfo.mobileNumber &&
        (userInfo?.emailId ? email === userInfo.emailId : email === "")) ||
        Boolean(errors?.mobile && errors?.mobile !== null))
    ) {
      return true;
    }

    return (
      (changepassword &&
        (!currentPassword ||
          !newPassword ||
          !confirmPassword ||
          errors.newPassword !== null ||
          errors.confirmPassword !== null)) ||
      (errors?.mobile && errors?.mobile !== null)
    );
  };

  const clearFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const onChangePasswordClick = () => {
    if (changepassword) {
      clearFields();
      const filteredErrors =
        "mobile" in errors ? { mobile: errors.mobile } : {};
      setErrors(filteredErrors);
    }
    setChangepassword(!changepassword);
  };

  const handleMobileInputChange = (event) => {
    const { value } = event.target;
    if (value.match(/\D/)) {
      event.preventDefault();
      return;
    }
    setMobileNumber(value);
    if (value.length < 10) {
      setErrors({
        ...errors,
        mobile: { message: "COMMON_MOBILE_VALIDATION_ERROR" },
      });
    } else {
      setErrors({ ...errors, mobile: null });
    }
  };

  const updateProfile = async () => {
    setLoading(true);

    let uploadedFiles = [];
    if (selectedFile.length > 0) {
      uploadedFiles = await uploadFiles(
        selectedFile,
        imageUploadStatus,
        setImageUploadStatus
      );
    }
    const requestData = {
      ...userInfo,
      name,
      emailId: email,
      mobileNumber: mobileNumber,
      ...(Array.isArray(uploadedFiles) && uploadedFiles.length > 0
        ? { photo: uploadedFiles[0].fileStoreId }
        : {}),
    };
    const response = await updateUser(requestData);
    if (response.status === 200) {
      dispatchNotification(
        "success",
        ["COMMON_USER_UPDATE_SUCCESSFUL"],
        dispatch
      );
      const { mobile: _, ...newState } = errors;
      setErrors(newState);
      const { user } = response?.data || {};
      const updatedUser = {
        ...userInfo,
        name: user[0]?.name,
        emailId: user[0]?.emailId,
        mobileNumber: user[0]?.mobileNumber,
      };
      dispatch(userProfileData(user[0]?.name));
      localStorage.setItem("DfsWeb.user-info", JSON.stringify(updatedUser));
    } else {
      dispatchNotification("error", ["COMMON_USER_UPDATE_FAILED"], dispatch);
    }
    if (changepassword) {
      const passwordUpdateData = {
        existingPassword: currentPassword,
        newPassword: newPassword,
        tenantId: "br",
        type: "EMPLOYEE",
        username: userInfo?.userName,
        confirmPassword: confirmPassword,
      };
      const res = await changePassword(passwordUpdateData);
      if (res.status === 200) {
        dispatchNotification(
          "success",
          ["COMMON_PASSWORD_UPDATE_SUCCESS"],
          dispatch
        );
        clearFields();
        setErrors({});
        setChangepassword(false);
      } else if (res?.data?.Errors?.[0]) {
        dispatchNotification(
          "error",
          [
            customExceptions[res.data.Errors[0]?.code] ||
              res.data.Errors[0]?.description,
          ],
          dispatch
        );
      } else {
        dispatchNotification(
          "error",
          ["COMMON_PASSWORD_UPDATE_FAILED"],
          dispatch
        );
      }
    }
    setLoading(false);
  };

  const handleImageClick = () => {
    const file = fileInputRef.current.files[0];
    const objectUrl = URL.createObjectURL(file);
    setSelectedFile([file]);
    setImageUrl(objectUrl);
  };

  return (
    <Box className="edit-profile-page">
      <Box className="w-11/12 m-auto mb-10" sx={{ maxWidth: "1200px" }}>
        <Box className="breadcrumbs-container mt-5">
          <BasicBreadcrumbs />
        </Box>
        <ProfileHeaderSection
          fileInputRef={fileInputRef}
          handleImageClick={handleImageClick}
          imageUrl={imageUrl}
          name={name}
          buttonText={t("COMMON_CHANGE_PASSWORD")}
          buttonClick={onChangePasswordClick}
          isMobile={isMobile}
        />
        {/* <Box className="flex justify-end">
          <Button
            onClick={onChangePasswordClick}
            sx={{ marginLeft: "10px" }}
            color="inherit"
            className="change-password-button"
          >
            {t("COMMON_CHANGE_PASSWORD")}
          </Button>
        </Box> */}
        <Box className="edit-profile-form-container">
          {loading ? (
            <Box
              className="flex justify-center items-center"
              sx={{ height: "50vh" }}
            >
              {" "}
              <CircularProgress color="success" />
            </Box>
          ) : (
            <>
              <Box className="edit-profile-form-section">
                <Typography variant="primary" className="edit-profile-header">
                  {t("EDIT_PROFILE")}
                </Typography>
                <Box className="grid lg:grid-cols-3 md:grid-cols-1">
                  <Box className="">
                    <Typography variant="primary" className="add-field-label">
                      {t("COMMON_FULL_NAME")}
                    </Typography>
                    <Box className="add-field-input">
                      <TextField
                        placeholder="Enter your fullname here"
                        id="outlined-title-en"
                        size="small"
                        fullWidth
                        sx={{ mr: "10px" }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isAgentUser}
                      />
                    </Box>
                  </Box>
                  <Box className="">
                    <Typography variant="primary" className="add-field-label">
                      {t("COMMON_MOBILE_NUMBER")}{" "}
                      <span className="required-field"> *</span>
                    </Typography>
                    <Box className="add-field-input">
                      <TextField
                        placeholder="9876543210"
                        id="outlined-title-en"
                        size="small"
                        fullWidth
                        sx={{ mr: "10px" }}
                        inputProps={{
                          maxLength: 10,
                        }}
                        value={mobileNumber}
                        onChange={(e) => handleMobileInputChange(e)}
                        error={errors?.mobile || false}
                        helperText={t(errors?.mobile?.message)}
                        disabled={isAgentUser}
                      />
                    </Box>
                  </Box>
                  <Box className="">
                    <Typography variant="primary" className="add-field-label">
                      {t("COMMON_EMAIL")}
                    </Typography>
                    <Box className="add-field-input">
                      <TextField
                        placeholder="Please enter a valid email"
                        id="outlined-title-en"
                        size="small"
                        fullWidth
                        sx={{ mr: "10px" }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isAgentUser}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
              {changepassword && (
                <Box className="edit-profile-form-section mt-5">
                  <Typography variant="primary" className="edit-profile-header">
                    {t("COMMON_CHANGE_PASSWORD")}
                  </Typography>
                  <PasswordForm
                    currentPassword={currentPassword}
                    setCurrentPassword={setCurrentPassword}
                    newPassword={newPassword}
                    setNewPassword={setNewPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    errors={errors}
                    setErrors={setErrors}
                    fieldClassName={"mr-2"}
                    containerClass="grid lg:grid-cols-3 md:grid-cols-1"
                  />
                </Box>
              )}
              <Box className="flex justify-end mt-5">
                <Button
                  variant="primary"
                  disabled={enableSubmit()}
                  onClick={updateProfile}
                >
                  {" "}
                  &nbsp; {t("COMMON_SUBMIT")} &nbsp;
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default EditProfile;

EditProfile.propTypes = {
  isMobile: PropTypes.bool,
};
