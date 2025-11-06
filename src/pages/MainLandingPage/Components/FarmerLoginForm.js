import { useRef, useState } from "react";
import { authenticateUser, sendOtp } from "../../../services/loginService";
import { Box, Button, FormControl, Typography } from "@mui/material";
import { CssTextField } from "../../../components/Form/CustomWidget";
import OTPinput from "../../../components/OTPinput";
import { getFarmerprofile } from "../../../services/CitizenServices";
import { dispatchNotification } from "../../../components/Utils";
import { t } from "i18next";
import FarmerSelfRegistration from "../../../AppModules/Farmer/FarmerSelfRegistration";
import { userProfileData } from "../../../Modules/Actions/userProfileActions";

const verifyMobile = async (mobileNumber, tenantId, dispatch) => {
  const requestData = {
    RequestInfo: {
      apiId: "Rainmaker",
      ver: ".01",
      ts: "",
      action: "token",
      did: "1",
      key: "",
      msgId: "20170310130900|en_IN",
      authToken: null,
    },
    otp: {
      mobileNumber,
      userType: "CITIZEN",
      type: "login",
      tenantId,
    },
  };
    const response = await sendOtp(requestData);
    if (response?.data?.isSuccessful) {
      dispatchNotification("success", [t("schemes.otpSuccess")], dispatch);
    }
    return response;
};

const setEmployeeDetails = async (userResponse,dispatch) => {
  let userInfo = userResponse?.UserRequest ?? {};
  localStorage.setItem("DfsWeb.access-token", userResponse?.access_token);
  const response = await getFarmerprofile(userResponse?.access_token, userInfo.uuid);
  const name = response?.data?.Individual?.name?.givenName;
  userInfo = {...userInfo,name: name, };
  dispatch(userProfileData(name));
  localStorage.setItem("DfsWeb.user-info", JSON.stringify(userInfo));
  localStorage.setItem("DfsWeb.isCitizenUser", true);
  const hasValidDBTID = response?.data?.Individual?.identifiers?.some(
    (identifier) =>
      identifier?.identifierType === "DBTID" && !!identifier?.identifierId
  );
  localStorage.setItem("DfsWeb.hasDBTlinked", hasValidDBTID);
  localStorage.setItem("DfsWeb.farmerId", response?.data?.Individual?.individualId);
  localStorage.setItem("DfsWeb.isLoggedIn", true);
};

const FarmerLoginForm = ({
  t,
  ourTheme,
  navigate,
  dispatchNotification,
  queryClient,
  dispatch,
  setShowUserTypeDropDown,
  loading,
  setLoading,
  tenantId,
}) => {
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [mobileVerified, setMobileVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [open,setOpen] = useState(false);
  const maskedMobile = mobile.replace(/.(?=.{4})/g, "*");

  const timerRef = useRef(null);

  const handleMobileInput = (event) => {
    if (mobileError !== "") setMobileError("");
    const { value } = event.target;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setMobile(value);
    }
    // setMobile(event.target.value);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startOtpTimer = () => {
    clearTimer();
    setTimer(30);
    setCanResend(false);

    timerRef.current = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearTimer();
          setCanResend(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    if (!mobileVerified) {
      if (!mobile.trim()) {
        setMobileError("COMMON_MOBILE_REQUIRED");
        setLoading(false);
        return;
      }
      if (!/^\d{10}$/.test(mobile.trim())) {
        setMobileError("COMMON_MOBILE_INVALID_LENGTH");
        setLoading(false);
        return;
      }
      const verifyResponse = await verifyMobile(mobile, tenantId, dispatch);
      if (verifyResponse?.data?.isSuccessful) {
        setMobileVerified(true);
        setLoading(false);
        setShowUserTypeDropDown(false);
        startOtpTimer();
        return;
      } else {
        setMobileError(t("COMMON_MOBILE_INVALID"));
        setOpen(true);
        setLoading(false);
        return;
      }
    }

    // Once mobile is verified, validate OTP input.
    if (!otp.trim()) {
      setOtpError("COMMON_OTP_REQUIRED");
      setLoading(false);
      return;
    }

    const params = {
      username: mobile,
      password: otp,
      userType: "CITIZEN",
      tenantId: "br",
    };
    const response = await authenticateUser(params);
    if (response?.status === 200) {
      await setEmployeeDetails(response?.data,dispatch);
      queryClient.resetQueries();
      navigate(`${window.contextPath}/home`);
    } else {
      dispatchNotification("error", ["OTP_VALIDATION_FAILED"], dispatch);
      setOtp("");
    }
    setLoading(false);
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <Box className="flex flex-col gap-4 sm:gap-6 pt-5 sm:pt-6">
        {!mobileVerified ? (
          <Box className="farmer-dbt-input-section !m-0 !p-0">
            <Typography className="farmer-dbt-input-header-text">
              {t("COMMON_MOBILE")}
            </Typography>
            <FormControl className="w-full">
              <CssTextField
                value={mobile}
                name="mobile"
                id="user_mobile"
                placeholder="e.g. 81XXXXXX86"
                onChange={handleMobileInput}
                error={!!mobileError}
                helperText={mobileError && t(mobileError)}
                sx={{ minWidth: { sm: "300px" }, width: { xs: "100%" } }}
                darkTheme={ourTheme === "dark"}
              />
            </FormControl>
            <Typography className="pt-2">
              {t("dbt_dfs_registered_phone")}
            </Typography>
          </Box>
        ) : (
          <>
            <Box className="farmer-dbt-input-section !m-0 !p-0">
              <Typography variant="body2">
                {t("otp_sent_message_1", { maskedMobile })}
                {t("otp_sent_message_2")}
              </Typography>
            </Box>
            <Box className="farmer-dbt-input-section !m-0 !p-0">
              <Typography className="farmer-dbt-input-header-text">
                {t("home.ENTER_OTP")}
              </Typography>
              <FormControl className="w-full">
                <OTPinput otp={otp} setOtp={setOtp} />
              </FormControl>
            </Box>
          </>
        )}

        <Button
          variant="primary"
          style={{ height: "52px", color: "#1C211E" }}
          fullWidth
          id="submitButton"
          type="submit"
          disabled={loading || mobile.length < 10}
        >
          {t(!mobileVerified ? "Login" : "schemes.verify")}
        </Button>
        {mobileVerified &&
          (!canResend ? (
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              {t("farmerRegistration.DIDNOT_RECIEVE")}{" "}
              <span style={{ textDecoration: "underline" }}>
                {t("farmerRegistration.RETRY1")} {timer}
                {"s "}
                {t("farmerRegistration.RETRY2")}
              </span>
            </Typography>
          ) : (
            <Button
              onClick={() => {
                verifyMobile(mobile, tenantId, dispatch);
                startOtpTimer();
              }}
              variant="textButtonBlack"
              sx={{
                fontFamily: "Inter",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "20px",
              }}
            >
              <span
                style={{
                  textDecoration: "underline",
                  textTransform: "none",
                }}
              >
                {t("farmerRegistration.RESEND_OTP")}
              </span>
            </Button>
          ))}
      </Box>
    </form>
    {open && (<FarmerSelfRegistration mobile={mobile} setMobile={setMobile} open={open} setOpen={setOpen} />)}
    </>
  );
};

export default FarmerLoginForm;
