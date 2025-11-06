import {
  Box,
  Button,
  Container,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { CachedOutlined } from "@mui/icons-material";
import { isEnabled } from "@jsonforms/core";
import axiosInstance from "../services/CreateAxios.js";
import RegistrationSuccessText from "../AppModules/Agent/RegistrationSuccessText.js";
import { useNavigate } from "react-router-dom";
import AgentConfirmationDialog from "../AppModules/Agent/RegistrationSuccessPopup.js";
import { useTranslation } from "react-i18next";
import "../styles/FarmerRegistrationStyles.css";
import { ProfileHeaderSection } from "../pages/LoginSignupOtp/EditProfile.js";
import BasicBreadcrumbs from "./BreadCrumbsBar.js";
import DateCustom from "./Form/DateCustom.js";
import { editFarmerResponse } from "../AppModules/Agent/FarmerEditResposne.js";
import PropTypes from "prop-types";
import { createFarmerResponse } from "../AppModules/Agent/FarmerResponse.js";
import { useDispatch } from "react-redux";
import { userProfileData } from "../Modules/Actions/userProfileActions.js";

const FarmerProfileEditFormComposer = ({
  formJson,
  dropdownValues,
  setSelectedAddress,
  handleDbtSync,
  registrationFormDetails,
  dataFromDBT,
  dbtId,
  authToken,
  selectedAddress,
  farmerResponse,
  setFarmerResponse,
  userName,
  isEditProfilePage,
  imageUrl = null,
  setCancelled = () => {},
  profileData,
  dbtLoading,
  isMobile = false,
  mobileNumber,
  showDBTfield,
}) => {
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    register,
    formState: { errors },
    clearErrors,
  } = useForm();
  const [errorMessageSubmitForm, setErrorMessageSubmitForm] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [profilePicStoreId, setProfilePicStoreId] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [photoUploadMessage, setPhotoUploadMessage] = useState(null);
  const [photoUploadSuccess, setPhotoUploadSuccess] = useState(null);
  const [isEditable, setIsEditable] = useState(!isEditProfilePage);
  let userDetails = JSON.parse(localStorage.getItem("DfsWeb.user-info"));
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEditProfilePage) {
      setValue("farmerMobileNumber", mobileNumber);
    }
  }, [mobileNumber]);

  const handlePhotoUpload = async (event) => {
    if (isEditProfilePage && !isEditable) {
      setIsEditable(true);
    }
    const file = event.target.files[0];
    if (!file) return;
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const extension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      setPhotoUploadSuccess(false);
      setPhotoUploadMessage("farmerRegistration.EG_FILESTORE_INVALID_INPUT");
      return;
    }

    setAvatarUrl(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post(
        "/filestore/v1/files?module=FarmerProfile&tenantId=br",
        formData
      );
      setProfilePicStoreId(response?.data?.files?.[0]?.fileStoreId);
      setPhotoUploadSuccess(true);
      setPhotoUploadMessage("farmerRegistration.PHOTO_UPLOAD_SUCCESS");
    } catch (error) {
      setPhotoUploadSuccess(false);
      if (error?.response?.data?.Errors) {
        const errorInfo = error.response.data.Errors.find(
          (err) => err.code === "EG_FILESTORE_INVALID_INPUT"
        );
        if (errorInfo) {
          setPhotoUploadMessage(
            "farmerRegistration.EG_FILESTORE_INVALID_INPUT"
          );
        } else {
          setPhotoUploadMessage("farmerRegistration.UNEXPECTED_ERROR");
        }
      } else {
        setPhotoUploadMessage("farmerRegistration.UNEXPECTED_ERROR");
      }
    }
  };

  const DOBWatch = watch("DOB");
  const farmerDbtId = watch("farmerDbtId") || "";
  const calculatedAgeFunction = (key) => {
    const dateOfBirth = DOBWatch;
    if (dateOfBirth) {
      const [day, month, year] = dateOfBirth.split("/");
      const birthDate = new Date(`${year}-${month}-${day}`);
      const currentDate = new Date();
      let calculatedAge = currentDate.getFullYear() - birthDate.getFullYear();

      if (
        currentDate.getMonth() < birthDate.getMonth() ||
        (currentDate.getMonth() === birthDate.getMonth() &&
          currentDate.getDate() < birthDate.getDate())
      ) {
        calculatedAge -= 1;
      }

      setValue(key, calculatedAge);
    }
  };

  useEffect(() => {
    calculatedAgeFunction("age");
  }, [DOBWatch, setValue, getValues, t]);

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const onSubmit = async (data) => {
    const url = isEditProfilePage
      ? "/farmer-profile/v1/_update"
      : "/farmer-profile/v1/_create";
    const res = isEditProfilePage
      ? editFarmerResponse(
          getValues(),
          selectedAddress,
          profilePicStoreId,
          farmerResponse,
          profileData
        )
      : createFarmerResponse(
          getValues(),
          selectedAddress,
          profilePicStoreId,
          dataFromDBT,
          farmerResponse,
          userDetails
        );
    const response = await axiosInstance.post(url, {
      RequestInfo: {
        authToken: authToken,
      },
      Individual: res.Individual,
      BankDetails: res.BankDetails,
    });
    if (response?.data?.responseInfo?.status === "successful") {
      const name = response?.data?.Individual?.name?.givenName;
      dispatch(userProfileData(name));
      userDetails = { ...userDetails, name: name };
      localStorage.setItem("DfsWeb.user-info", JSON.stringify(userDetails));
      if (dataFromDBT) {
        localStorage.setItem("DfsWeb.hasDBTlinked", "true");
      }
      if (!isEditProfilePage) {
        localStorage.removeItem("details");
        localStorage.setItem(
          "DfsWeb.farmerId",
          response?.data?.Individual?.individualId
        );
      }
      setIsSuccessDialogOpen(true);
    }
  };
  const onError = (errors) => {};

  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
  };

  const handleNavigateToHome = () => {
    navigate(`${window.contextPath}/home`);
  };

  function isDisabled(key, enabled, title) {
    return (
      !enabled ||
      (dataFromDBT && title != "PINCODE") ||
      key === "farmerMobileNumber" ||
      !isEditable ||
      (title === "PINCODE" &&
        profileData?.Individual?.address?.[0]?.pincode &&
        profileData?.Individual?.identifiers?.some(
          (identifier) => identifier?.identifierType === "DBTID"
        ))
    );
  }

  useEffect(() => {
    if (registrationFormDetails) {
      Object.keys(registrationFormDetails).forEach((key) => {
        if (key === "age") {
          calculatedAgeFunction(key);
        } else {
          setValue(key, registrationFormDetails[key]);
        }
      });
    }
    if (
      (registrationFormDetails?.["farmerCategory"] === null ||
        registrationFormDetails?.["farmerCategory"] === "") &&
      dataFromDBT
    ) {
      setValue("farmerCategory", "NOT_AVAILABLE");
    }
    if (dbtId) {
      setValue("farmerDbtId", dbtId);
    }
  }, [registrationFormDetails, setValue, t]);

  useEffect(() => {
    if (selectedAddress) {
      Object.keys(selectedAddress).forEach((key) => {
        if (!selectedAddress[key]) {
          setValue(key, "");
        }
      })
    }
  }, [selectedAddress]);

  useEffect(() => {
    setAvatarUrl(imageUrl);
  }, [imageUrl]);

  function stringToDate(dateString) {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }

  const handleCancel = () => {
    setCancelled(true);
    setIsEditable(false);
    fileInputRef.current.value = null;
    setAvatarUrl(imageUrl);
    setProfilePicStoreId(null);
    setErrorMessageSubmitForm(null);
    setPhotoUploadMessage(null);
    setPhotoUploadSuccess(null);
    setValue("farmerDbtId", dbtId || "");
    setFarmerResponse(null);
    clearErrors();
  };

  const renderField = (key, properties) => {
    const { type, enabled, validation, optionsFromAPI, title } =
      properties[key];

    const errorMessage = errors && errors[key]?.message;
    const isRequired = validation?.required; // Check if the field is required

    const labelWithAsterisk = `${t(
      `farmerRegistration.${properties[key]?.["title"]}`
    )}${isRequired === true ? "*" : ""}`;

    switch (type) {
      case "date":
        return (
          <Box className="flex flex-col gap-1">
            <Typography
              variant="subtitle2"
              className="!font-semibold"
              color={theme.palette.text.primary}
            >
              {labelWithAsterisk}
            </Typography>
            <Controller
              name={key}
              control={control}
              rules={
                !dataFromDBT
                  ? {
                      required: {
                        value: validation?.required,
                        message: validation?.errorMessages?.required,
                      },
                    }
                  : undefined
              }
              render={({ field, fieldState: { error } }) => (
                <DateCustom
                  // {...field}
                  value={
                    field?.value || stringToDate(registrationFormDetails?.[key])
                  }
                  error={!!error}
                  disabled={isDisabled(key, enabled)}
                  onKeyDown={(e) => e.preventDefault()} // Prevent manual typing
                  className="!rounded-lg"
                  onChange={(value) => {
                    field.onChange(value); // Update the field's value
                  }}
                  maxDate={
                    new Date(
                      new Date().setFullYear(new Date().getFullYear() - 1)
                    )
                  }
                />
              )}
            />
            {errors[key] && (
              <Typography color="red" sx={{ fontSize: "1rem" }}>
                {t(
                  `farmerRegistration.${errors[key]?.message || errorMessage}`
                )}
              </Typography>
            )}
          </Box>
        );

      case "text":
      case "file":
      case "number":
        return (
          <Box className="flex flex-col gap-1">
            <Typography
              variant="subtitle2"
              className="!font-semibold"
              color={theme.palette.text.primary}
            >
              {labelWithAsterisk}
            </Typography>
            <Controller
              name={key}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder={t("ENTER_VALUE")}
                  type={dataFromDBT ? "text" : type}
                  variant="outlined"
                  error={!!errors[key]}
                  fullWidth
                  disabled={isDisabled(key, enabled, title)}
                  className="h-10 !rounded-lg"
                  onBeforeInput={(event) => {
                    const upcomingChar = event.data;
                    if (type === "number") {
                      // Allow only digits from 0 to 9
                      if (!/^\d$/.test(upcomingChar)) {
                        event.preventDefault();
                      }
                    } else if (type === "text") {
                      if (!/^[a-zA-Z\s]*$/.test(upcomingChar)) {
                        event.preventDefault();
                      }
                    }
                  }}
                  inputProps={{
                    maxLength: validation?.maxLength,
                    minLength: validation?.minLength,
                    onInput: (e) => {
                      if (e.target.value.length > validation?.maxLength) {
                        e.target.value = e.target.value.slice(
                          0,
                          validation?.maxLength
                        );
                      }
                    },
                  }}
                  onKeyDown={(event) => {
                    if (type === "number") {
                      if (
                        event.key === "e" ||
                        event.key === "E" ||
                        event.key === "+" ||
                        event.key === "-"
                      ) {
                        event.preventDefault();
                      }
                    }
                  }}
                  {...register(key, {
                    required: {
                      value: validation?.required,
                      message: validation?.errorMessages?.required,
                    },
                    pattern: {
                      value: new RegExp(validation?.pattern),
                      message: validation?.errorMessages?.pattern,
                    },
                    maxLength: {
                      value: validation?.maxLength,
                      message: validation?.errorMessages?.maxLength,
                    },
                    minLength: {
                      value: validation?.minLength,
                      message: validation?.errorMessages?.minLength,
                    },
                  })}
                />
              )}
            />

            {errorMessage && (
              <Typography color="red" sx={{ fontSize: "1rem" }}>
                {t(`farmerRegistration.${errorMessage}`)}
              </Typography>
            )}
          </Box>
        );
      case "select":
        return (
          <Box className="flex flex-col gap-1">
            <Typography
              variant="subtitle2"
              className="!font-semibold"
              color={theme.palette.text.primary}
            >
              {labelWithAsterisk}
            </Typography>
            <Controller
              name={key}
              control={control}
              rules={{
                required: {
                  value: validation?.required,
                  message: validation?.errorMessages?.required,
                },
              }}
              render={({ field }) => {
                return (
                  <TextField
                    select={true}
                    {...field}
                    variant="outlined"
                    fullWidth
                    error={!!errors[key]}
                    value={field?.value || ""}
                    required={false}
                    disabled={
                      optionsFromAPI
                        ? isDisabled(key, enabled) ||
                          dropdownValues[key].length === 0
                        : isDisabled(key, isEnabled)
                    }
                    onChange={
                      optionsFromAPI
                        ? (event) => {
                            const selectedDistrictName = event?.target?.value;
                            const selectedOption = dropdownValues[key].find(
                              (district) =>
                                district.name === selectedDistrictName
                            );
                            setSelectedAddress((prev) => {
                              let flag = false;
                              const obj = {};
                              Object.keys(prev).forEach((prevKey) => {
                                obj[prevKey] = prev[prevKey];
                                if (flag) obj[prevKey] = "";
                                if (prevKey === key) {
                                  flag = true;
                                  obj[prevKey] = selectedOption.id;
                                } 
                              })
                              return obj;
                            });

                            field.onChange(selectedOption.name);
                          }
                        : (event) => field.onChange(event.target.value)
                    }
                    className="lg:w-2/3 h-10 !rounded-lg"
                    placeholder={t("COMMON_SELECT")}
                  >
                    {field?.value === "NOT_AVAILABLE" && (
                      <MenuItem value="NOT_AVAILABLE">
                        {t("farmerRegistration.NOT_AVAILABLE")}
                      </MenuItem>
                    )}
                    {!optionsFromAPI
                      ? properties[key]?.options?.map((option) => (
                          <MenuItem key={option.id} value={option}>
                            {t(`farmerRegistration.${option}`)}{" "}
                          </MenuItem>
                        ))
                      : dropdownValues?.[key]?.map((option) => (
                          <MenuItem key={option.id} value={option.name}>
                            {option.name}
                          </MenuItem>
                        ))}
                  </TextField>
                );
              }}
            />

            {errorMessage && (
              <Typography color="red" sx={{ fontSize: "1rem" }}>
                {t(`farmerRegistration.${errorMessage}`)}
              </Typography>
            )}
          </Box>
        );

      default:
        return null;
    }
  };
  const personalDetailsProperties = formJson?.personalDetails?.properties;
  const locationDetailsProperties = formJson?.locationDetails?.properties;
  const bankDetailsProperties = formJson?.bankDetails?.properties;

  const getWidthClass = () => {
    return "w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-11px)]";
  };

  return (
    <Box className="mainContainer">
      <Box className="inner-box-screen">
        <Box className="breadcrumbs-container mt-5 pb-10">
          <BasicBreadcrumbs />
        </Box>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <ProfileHeaderSection
            fileInputRef={fileInputRef}
            handleImageClick={handlePhotoUpload}
            imageUrl={avatarUrl}
            photoUploadSuccess={photoUploadSuccess}
            photoUploadMessage={photoUploadMessage}
            name={userName}
            buttonClick={
              isEditProfilePage
                ? isEditable
                  ? handleCancel
                  : () => setIsEditable(true)
                : null
            }
            buttonText={isEditProfilePage ? t("COMMON_EDIT") : null}
            isMobile={isMobile}
          />

          <Box
            className="farmer-registration-form-grid flex flex-col !px-6 !pt-6 !pb-10 gap-6 !rounded-xl"
            sx={{
              backgroundColor: theme.palette.background.tertiaryGreen,
            }}
          >
            {/* personal details */}
            <Container
              variant="primary"
              className="profile-container !rounded-xl"
            >
              {dbtLoading && <LinearProgress color="success" />}
              <Box className=" flex flex-col gap-4 p-6">
                {/* section header and dbt input */}
                <Box className="flex justify-between flex-col lg:flex-row gap-4">
                  <Typography variant="h6" className="!font-bold">
                    {t("PERSONAL_DETAILS")}
                  </Typography>
                  {showDBTfield && (
                    <Box className="flex flex-col  sm:flex-row justify-start items-start sm:items-end gap-3 sm:w-full !w-auto">
                      <Box className="flex flex-col gap-1 justify-start items-start w-full sm:w-auto">
                        <Typography
                          variant="subtitle2"
                          className="!font-semibold"
                          color={theme.palette.text.primary}
                        >
                          {t("farmerRegistration.DBT_ID")}
                        </Typography>
                        <Controller
                          name={"farmerDbtId"}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              variant="outlined"
                              type="number"
                              required={false}
                              className="h-10 !w-full"
                              disabled={
                                (isEditProfilePage && !isEditable) ||
                                (isEditable && dataFromDBT)
                              }
                              placeholder={t("ENTER_VALUE")}
                              onKeyDown={(event) => {
                                if (
                                  ["e", "E", "+", "-", "."].includes(event.key)
                                ) {
                                  event.preventDefault();
                                }
                              }}
                              onChange={(event) => {
                                const value = event.target.value;
                                if (/^\d{0,13}$/.test(value)) {
                                  field.onChange(value);
                                }
                              }}
                            />
                          )}
                        />
                      </Box>
                      {isEditProfilePage && (
                        <Button
                          variant="primary"
                          className="self-end"
                          size="large"
                          startIcon={<CachedOutlined />}
                          sx={{
                            "&:disabled": {
                              color: `${theme.palette.text.white} !important`,
                            },
                            fontSize: "14px",
                          }}
                          onClick={() => {
                            const dbtIdValue = getValues("farmerDbtId");
                            clearErrors();
                            setErrorMessageSubmitForm(null);
                            handleDbtSync(dbtIdValue);
                          }}
                          disabled={farmerDbtId.length !== 13 || !isEditable}
                        >
                          {t("farmerRegistration.DBT_SYNC")}
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>

                <div className=" flex flex-wrap gap-4">
                  {Object.keys(personalDetailsProperties)
                    .sort(
                      (a, b) =>
                        personalDetailsProperties[a].order -
                        personalDetailsProperties[b].order
                    )
                    .map((key) => {
                      const widthClass = getWidthClass();
                      return (
                        <div className={`${widthClass}`} key={key}>
                          {renderField(key, personalDetailsProperties)}
                        </div>
                      );
                    })}
                </div>
              </Box>
            </Container>
            {/* location details */}
            <Container
              variant="primary"
              className="profile-container !rounded-xl"
            >
              <Box className=" flex flex-col gap-4 p-6">
                <Typography variant="h6" className="!font-bold">
                  {t("Location_DETAILS")}
                </Typography>
                 <div className=" flex flex-wrap gap-4">
                  {Object.keys(locationDetailsProperties)
                    .sort(
                      (a, b) =>
                        locationDetailsProperties[a].order -
                        locationDetailsProperties[b].order
                    )
                    .map((key) => {
                      const widthClass = getWidthClass();
                      return (
                        <div className={`${widthClass}`} key={key}>
                          {renderField(key, locationDetailsProperties)}
                        </div>
                      );
                    })}
                </div>
              </Box>
            </Container>
            {/* Bank Details */}
            {dataFromDBT && (
              <Container
                variant="primary"
                className="profile-container !rounded-xl"
              >
                <Box className=" flex flex-col gap-4 p-6">
                  <Typography variant="h6" className="!font-bold">
                    {t("Bank_DETAILS")}
                  </Typography>
                  <div className=" flex flex-wrap gap-4">
                    {Object.keys(bankDetailsProperties)
                      .sort(
                        (a, b) =>
                          bankDetailsProperties[a].order -
                          bankDetailsProperties[b].order
                      )
                      .map((key) => {
                        const widthClass = getWidthClass();
                        return (
                          <div className={`${widthClass}`} key={key}>
                            {renderField(key, bankDetailsProperties)}{" "}
                          </div>
                        );
                      })}
                  </div>
                </Box>
              </Container>
            )}

            {isEditable && (
              <Box className="w-full flex items-center">
                <div className="flex-1">
                  {isEditProfilePage && (
                    <Button variant="secondary" onClick={handleCancel}>
                      {t("schemes.cancel")}
                    </Button>
                  )}
                </div>
                <div>
                  <Button type="submit" variant="primary">
                    {t("farmerRegistration.SUBMIT")}
                  </Button>
                </div>
              </Box>
            )}
            {errorMessageSubmitForm && (
              <Typography
                color="red"
                sx={{
                  fontSize: "1rem",
                  borderRadius: "1px",
                  textAlign: "right",
                }}
              >
                {t(errorMessageSubmitForm)}
              </Typography>
            )}
          </Box>
        </form>

        <AgentConfirmationDialog
          open={isSuccessDialogOpen}
          onClose={handleCloseSuccessDialog}
          loading={false}
          status={true}
          downloadReceipt={false}
          handleNavigateToHome={handleNavigateToHome}
          t={t}
        >
          <RegistrationSuccessText t={t} isUpdated={isEditProfilePage} />
        </AgentConfirmationDialog>
      </Box>
    </Box>
  );
};

export default FarmerProfileEditFormComposer;

FarmerProfileEditFormComposer.propTypes = {
  isMobile: PropTypes.bool,
  formJson: PropTypes.object,
  dropdownValues: PropTypes.object,
  setSelectedAddress: PropTypes.func,
  handleDbtSync: PropTypes.func,
  registrationFormDetails: PropTypes.object,
  dataFromDBT: PropTypes.bool,
  dbtId: PropTypes.string,
  authToken: PropTypes.string,
  selectedAddress: PropTypes.object,
  farmerResponse: PropTypes.object,
  setFarmerResponse: PropTypes.func,
  userName: PropTypes.string,
  isEditProfilePage: PropTypes.bool,
  imageUrl: PropTypes.string,
  setCancelled: PropTypes.func,
  profileData: PropTypes.object,
  dbtLoading: PropTypes.bool,
  mobileNumber: PropTypes.string,
  showDBTfield: PropTypes.bool,
};
