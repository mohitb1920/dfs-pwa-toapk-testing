import {
  Box,
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { CachedOutlined } from "@mui/icons-material";
import { isEnabled } from "@jsonforms/core";
import axiosInstance from "../services/CreateAxios";
import { ProfileSubmitOTPPopup } from "../AppModules/Agent/ProfileSubmitOTPPopup";
import { createFarmerResponse } from "../AppModules/Agent/FarmerResponse";
import RegistrationSuccessText from "../AppModules/Agent/RegistrationSuccessText";
import { useNavigate } from "react-router-dom";
import AgentConfirmationDialog from "../AppModules/Agent/RegistrationSuccessPopup";
import { useTranslation } from "react-i18next";
import { resendOtp } from "../services/ResendOtp.js";
import "../styles/FarmerRegistrationStyles.css";
import { ProfileHeaderSection } from "../pages/LoginSignupOtp/EditProfile.js";
import BasicBreadcrumbs from "./BreadCrumbsBar.js";
import { useDispatch } from "react-redux";
import DateCustom from "./Form/DateCustom.js";

const FarmerRegistrationFormComposer = ({
  formJson,
  dropdownValues,
  setSelectedAddress,
  language,
  handleDbtSync,
  registrationFormDetails,
  dataFromDBT,
  dbtId,
  authToken,
  selectedAddress,
  errorMessageDBTSync,
  errorMessageOTPValidation,
  setErrorMessageOTPValidation,
  OTPResentMessage,
  setOTPResentMessage,
  farmerResponse,
  setFarmerResponse,
  otp,
  setOtp,
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
  const [isUpdated, setIsUpdated] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handlePhotoUpload = async (event) => {
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
      if (error.response && error.response.data && error.response.data.Errors) {
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

  const [maskedMobileNumber, setMaskedMobileNumber] = useState("");
  function getSendOTPCreateProfileBody() {
    if (dataFromDBT) {
      return {
        RequestInfo: {
          authToken: authToken,
        },
        otp: {
          mobileNumber: null,
          dbtId: dbtId,
          ticketId: null,
          categoryType: "DBT_PROFILE_CREATE",
          tenantId: "br",
          userType: "CITIZEN",
        },
      };
    } else {
      return {
        RequestInfo: {
          authToken: authToken,
        },
        otp: {
          mobileNumber: watch("farmerMobileNumber"),
          dbtId: null,
          ticketId: null,
          categoryType: "PROFILE_CREATE",
          tenantId: "br",
          userType: "CITIZEN",
          additionalFields: {
            farmerName: watch("farmerName"),
          },
        },
      };
    }
  }
  const [isOtpDialogOpen, setOtpDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(
        "/agent/v1/otp/_send",
        getSendOTPCreateProfileBody()
      );
      if (response?.data?.ResponseInfo?.status === "successful") {
        setFarmerResponse(
          createFarmerResponse(
            getValues(),
            selectedAddress,
            profilePicStoreId,
            dataFromDBT,
            farmerResponse
          )
        );
        setMaskedMobileNumber(response.data.message);
        setOtpDialogOpen(true);
        setErrorMessageSubmitForm(null);
      } else setErrorMessageSubmitForm(`farmerRegistration.OTP_SEND_FAILED`);
    } catch (error) {
      const errorMessage = error.response?.data?.Errors?.[0]?.code
        ? `farmerRegistration.${error.response.data.Errors[0].code}`
        : `farmerRegistration.UNEXPECTED_ERROR`;

      setErrorMessageSubmitForm(errorMessage);
    }
  };
  const onError = (errors) => {};

  const handleCloseOtpDialog = () => {
    setOtpDialogOpen(false);
  };
  const handleCloseSuccessDialog = () => {
    setIsSuccessDialogOpen(false);
  };

  const handleNavigateToHome = () => {
    navigate(`${window.contextPath}/home`);
  };

  const handleResendOtp = async () => {
    setOtp("");
    resendOtp(
      getSendOTPCreateProfileBody(),
      setOtp,
      setOTPResentMessage,
      t,
      dispatch
    );
  };

  function isDisabled(key, enabled, title) {
    return (
      !enabled ||
      (registrationFormDetails?.[key] !== null &&
        registrationFormDetails?.[key] !== "" &&
        dataFromDBT) ||
      (dataFromDBT && title != "PINCODE")
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
      registrationFormDetails?.["farmerCategory"] === null ||
      registrationFormDetails?.["farmerCategory"] === ""
    ) {
      setValue("farmerCategory", t("farmerRegistration.NOT_AVAILABLE"));
    }
  }, [registrationFormDetails, setValue, t]);

  function stringToDate(dateString) {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }

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
              render={({ field, fieldState: { error } }) => (
                <DateCustom
                  // {...field}
                  value={
                    stringToDate(registrationFormDetails?.[key]) || field?.value
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
                  value={registrationFormDetails?.[key] || field?.value || ""}
                  type={
                    dataFromDBT ? "text" : type === "number" ? "number" : type
                  }
                  variant="outlined"
                  error={!!errors[key]}
                  fullWidth
                  disabled={isDisabled(key, enabled, title)}
                  className="h-10 !rounded-lg"
                  onBeforeInput={(event) => {
                    const upcomingChar = event.data;
                    if (type === "number") {
                      // Allow only digits from 0 to 9
                      if (!/^[0-9]$/.test(upcomingChar)) {
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
                    select={!dataFromDBT}
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
                            setSelectedAddress((prev) => ({
                              ...prev,
                              [key]: selectedOption.id,
                            }));

                            field.onChange(selectedOption.name);
                          }
                        : (event) => field.onChange(event.target.value)
                    }
                    className="lg:w-2/3 h-10 !rounded-lg"
                    placeholder={t("COMMON_SELECT")}
                  >
                    {!optionsFromAPI
                      ? properties[key]?.options?.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {t(`farmerRegistration.${option}`)}{" "}
                          </MenuItem>
                        ))
                      : dropdownValues?.[key]?.map((option, index) => (
                          <MenuItem key={index} value={option.name}>
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

  const formTitle = t(
    `farmerRegistration.${formJson?.personalDetails?.["title"]}`
  );
  const getWidthClass = () => {
    // if (["string", "date", "textPreview"].includes(type)) {
    return "w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-11px)]";
    // }
    // return "w-full";
  };
  return (
    <Box className="mainContainer">
      <Box className="inner-box-screen">
        <Box className="breadcrumbs-container mt-5 pb-10">
          <BasicBreadcrumbs />
        </Box>
        {/* <Box className="bg-green-500 text-black py-4 px-6 mb-4 mt-8">
          <h2 className="text-3xl font-semibold">{formTitle}</h2>
        </Box> */}
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          // className="p-3"
          noValidate
        >
          <ProfileHeaderSection
            fileInputRef={fileInputRef}
            handleImageClick={handlePhotoUpload}
            imageUrl={avatarUrl}
            photoUploadSuccess={photoUploadSuccess}
            photoUploadMessage={photoUploadMessage}
          />

          <Box
            className="farmer-registration-form-grid flex flex-col !px-6 !pt-6 !pb-10 gap-6 !rounded-xl"
            sx={{
              backgroundColor: theme.palette.background.tertiaryGreen,
            }}
          >
            <Container
              variant="primary"
              className="profile-container !rounded-xl"
            >
              <Box className=" flex flex-col gap-4 p-6">
                <Box className="flex justify-between flex-col lg:flex-row gap-4">
                  <Typography variant="h6" className="!font-bold">
                    {t("PERSONAL_DETAILS")}
                  </Typography>
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
                          <>
                            <TextField
                              {...field}
                              variant="outlined"
                              type="number"
                              required={false}
                              className="h-10 !w-full"
                              disabled={false}
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
                            {errorMessageDBTSync && (
                              <Typography
                                color="error"
                                className="mt-2 "
                                sx={{
                                  fontSize: "1rem",
                                  marginTop: "0.5rem",
                                  borderRadius: "1px",
                                  textAlign: "left",
                                }}
                              >
                                {t(errorMessageDBTSync)}
                              </Typography>
                            )}
                          </>
                        )}
                      />
                    </Box>
                    <Button
                      variant="primary"
                      className="self-end"
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
                      disabled={farmerDbtId.length !== 13}
                    >
                      {t("farmerRegistration.DBT_SYNC")}
                    </Button>
                  </Box>
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
                        <div className={`${widthClass}`}>
                          {renderField(key, personalDetailsProperties)}
                        </div>
                      );
                    })}
                </div>
              </Box>
            </Container>
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
                        <div className={`${widthClass}`}>
                          {renderField(key, locationDetailsProperties)}
                        </div>
                      );
                    })}
                </div>
              </Box>
            </Container>
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
                          <div className={`${widthClass}`}>
                            {renderField(key, bankDetailsProperties)}{" "}
                          </div>
                        );
                      })}
                  </div>
                </Box>
              </Container>
            )}
            <Box className="w-full flex justify-end">
              <Button type="submit" variant="primary">
                {t("farmerRegistration.SUBMIT")}
              </Button>
            </Box>
            {errorMessageSubmitForm && (
              <Typography
                color="red"
                sx={{
                  fontSize: "1rem",
                  borderRadius: "1px",
                  textAlign: "right", // Ensure text is right-aligned
                }}
              >
                {t(errorMessageSubmitForm)}
              </Typography>
            )}
          </Box>
        </form>
        <ProfileSubmitOTPPopup
          open={isOtpDialogOpen}
          onClose={handleCloseOtpDialog}
          onResend={handleResendOtp}
          formData={getValues()}
          authToken={authToken}
          dbtId={dbtId}
          dataFromDBT={dataFromDBT}
          maskedMobileNumber={maskedMobileNumber}
          farmerResponse={farmerResponse}
          errorMessageOTPValidation={errorMessageOTPValidation}
          setErrorMessageOTPValidation={setErrorMessageOTPValidation}
          OTPResentMessage={OTPResentMessage}
          setOTPResentMessage={setOTPResentMessage}
          setIsSuccessDialogOpen={setIsSuccessDialogOpen}
          setIsUpdated={setIsUpdated}
          otp={otp}
          setOtp={setOtp}
        />

        <AgentConfirmationDialog
          open={isSuccessDialogOpen}
          onClose={handleCloseSuccessDialog}
          loading={false}
          status={true}
          downloadReceipt={false}
          handleNavigateToHome={handleNavigateToHome}
          t={t}
        >
          <RegistrationSuccessText t={t} isUpdated={isUpdated} />
        </AgentConfirmationDialog>
      </Box>
    </Box>
  );
};

export default FarmerRegistrationFormComposer;
