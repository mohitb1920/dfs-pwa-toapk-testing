import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  sendOtp,
  validateDBTLinkStatus,
  validateOtp,
} from "../../services/loginService";
import OTPPopup from "../Agent/OTPPopup";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@emotion/react";
import { useDispatch } from "react-redux";
import { dispatchNotification } from "../../components/Utils";
import PropTypes from "prop-types";

function FarmerSelfRegistration({ mobile: mobileNumber, open, setOpen }) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [dbtId, setDBTId] = useState("");
  const [mobile, setMobile] = useState(mobileNumber);
  const [maskedMobile, setMaskedMobile] = useState(
    mobileNumber.replace(/.(?=.{4})/g, "X")
  );
  const {t} = useTranslation();
  const theme = useTheme();

  switch (step) {
    case 0:
      return haveDBT({ setStep, open, setOpen, t });
    case 1:
      return (
        <EnterDBT
          {...{
            setStep,
            mobile,
            setMobile,
            open,
            setOpen,
            dbtId,
            setDBTId,
            setMaskedMobile,
            mobileNumber,
            t,
            loading,
            setLoading,
          }}
        />
      );
    case 2:
      return makeDBT({ setStep, open, setOpen,t });
    case 3:
      return createDBT({ open, setOpen,t, theme });
    case 4:
      return EnterMobile({
        mobile,
        setMobile,
        setStep,
        open,
        setOpen,
        dbtId,
        maskedMobile,
        t,
        loading,
        setLoading,
        mobileNumber
      });
    case 5:
      return <EnterOTP {...{ open, setOpen, dbtId, mobile, maskedMobile,t }} />;
    default:
      setOpen(false);
      return null;
  }
}

export default FarmerSelfRegistration;

FarmerSelfRegistration.propTypes = {
  mobile: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

//step 0
const haveDBT = ({ setStep, open, setOpen, t }) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{t("selfRegistration.haveDBT")}</DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
        <DialogActions>
          <Button variant="secondary" onClick={() => setStep(2)}>
            {t("COMMON_NO")}
          </Button>
          <Button variant="primary" onClick={() => setStep(1)} autoFocus>
            {t("COMMON_YES")}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

//step 2
const makeDBT = ({ setStep, open, setOpen, t }) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{t("selfRegistration.registerDBT")}</DialogTitle>
      <DialogContent>
        <DialogContentText></DialogContentText>
        <DialogActions>
          <Button variant="secondary" onClick={() => setStep(5)}>
            {t("COMMON_NO")}
          </Button>
          <Button variant="primary" onClick={() => setStep(3)} autoFocus>
            {t("COMMON_YES")}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

//step 3
const createDBT = ({ open, setOpen, t, theme }) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      {/* <DialogTitle className="text-center">Register Here</DialogTitle> */}
      <DialogContent>
        <DialogContentText>
          <Typography variant="body2" color={theme.palette.text.primary}>{t("selfRegistration.dbtLinkHelper")}</Typography>
          <a href="https://dbtagriculture.bihar.gov.in/" target="_blank" rel="noreferrer" className="block text-center">
            https://dbtagriculture.bihar.gov.in
          </a>
        </DialogContentText>
        <DialogActions>
          <Button variant="primary" onClick={() => setOpen(false)}>
            {t("COMMON_CLOSE")}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

// step 1
const EnterDBT = ({
  setStep,
  mobile,
  setMobile,
  open,
  setOpen,
  dbtId,
  setDBTId,
  setMaskedMobile,
  mobileNumber,
  t,
  loading,
  setLoading,
}) => {
  const [consent, setConsent] = useState(false);
  const dispatch = useDispatch();

  const handleDBTInput = (e) => {
    const value = e.target.value;
    if (/^\d{0,13}$/.test(value)) {
      setDBTId(value);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await validateDBTLinkStatus({
      dbtId: dbtId,
      mobileNumber: mobile,
    });
    if (res?.data?.isLinked) {
      setStep(5);
    } else if (res?.data?.dbtMobile) {
      //getting masked mobile here
      setMobile("");
      setStep(4);
      setMaskedMobile(res?.data?.dbtMobile);
    } else if (res?.data?.errorMessage?.includes("DBTServiceError: No DBT User Found.")) {
        dispatchNotification("error", ["INVALID_DBT_ID"], dispatch);
    } else {
        dispatchNotification("error", ["farmerRegistration.UNEXPECTED_ERROR"], dispatch);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      {loading && <LinearProgress color="success" />}
      <DialogTitle className="text-center">{t("selfRegistration.dbtDetails")}</DialogTitle>
      <DialogContent>
        <Box className="flex flex-col gap-4 mt-2">
          <Box>
          <Typography className="input-label">{t("selfRegistration.dbtInputLabel")}<span className="required-field">&nbsp;*</span></Typography>
          <TextField
            value={dbtId}
            onChange={handleDBTInput}
            fullWidth
            autoFocus
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: 13,
            }}
          />
          </Box>
          <Typography>{t("selfRegistration.fetchPermission")}</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                color="success"
              />
            }
            label={t("selfRegistration.fetchData")}
          />
        </Box>
        <DialogActions>
          <Button
            variant="secondary"
            onClick={() => {
              setMobile(mobileNumber);
              setDBTId("");
              setStep(2);
              setMaskedMobile(mobileNumber.replace(/.(?=.{4})/g, "X"));
            }}
          >
            {t("COMMON_NO")}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!consent || dbtId.length < 13}
          >
            {t("selfRegistration.continue")}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

EnterDBT.propTypes = {
  setStep: PropTypes.func.isRequired,
  mobile: PropTypes.string.isRequired,
  setMobile: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  dbtId: PropTypes.string.isRequired,
  setDBTId: PropTypes.func.isRequired,
  setMaskedMobile: PropTypes.func.isRequired,
  mobileNumber: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
};

// step 4
const EnterMobile = ({
  mobile,
  setMobile,
  setStep,
  open,
  setOpen,
  dbtId,
  maskedMobile,
  t,
  loading,
  setLoading,
  mobileNumber
}) => {

  const dispatch = useDispatch();

  const handleMobileInput = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setMobile(value);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await validateDBTLinkStatus({
      dbtId: dbtId,
      mobileNumber: mobile,
    });
    if (res?.data?.isLinked) {
      const otpRes = await sendOtp({
        otp: {
          mobileNumber: mobile,
          userType: "CITIZEN",
          type: "REGISTER",
          tenantId: "br",
        },
      });
      if (otpRes?.status === 201) {
        setStep(5);
      } else if (
        otpRes?.data?.error?.fields?.[0]?.message.includes("Already")
      ) {
        dispatchNotification("error", ["MOBILE_ALREADY_REGISTERED"], dispatch);
      }
    } else if (res?.data?.dbtMobile) {
      dispatchNotification("error", [t("selfRegistration.mobileInputHelper",{maskedMobile})], dispatch);
    } else {
        dispatchNotification("error", ["farmerRegistration.UNEXPECTED_ERROR"], dispatch);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      {loading && <LinearProgress color="success" />}
      <DialogTitle className="text-center">{t("selfRegistration.dbtDetails")}</DialogTitle>
      <DialogContent>
        <Box className="flex flex-col gap-4 mt-2">
          <Box>
          <Typography className="input-label">{t("selfRegistration.mobileInputLabel")}<span className="required-field">&nbsp;*</span></Typography>
          <TextField
            value={mobile}
            onChange={handleMobileInput}
            fullWidth
            autoFocus
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
              maxLength: 10,
            }}
          />
          </Box>
          <Typography>
            {t("selfRegistration.mobileInputHelper",{maskedMobile})}
          </Typography>
        <DialogActions>
          <Button
            variant="secondary"
            onClick={() => {
              setMobile(mobileNumber);
              setStep(1);
            }}
            >
            {t("selfRegistration.back")}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={mobile.length < 10}
            >
            {t("selfRegistration.continue")}
          </Button>
        </DialogActions>
            </Box>
      </DialogContent>
    </Dialog>
  );
};

EnterMobile.propTypes = {
  mobile: PropTypes.string.isRequired,
  setMobile: PropTypes.func.isRequired,
  setStep: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  dbtId: PropTypes.string.isRequired,
  maskedMobile: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  mobileNumber: PropTypes.string.isRequired,
};

//step 5
const EnterOTP = ({ open, setOpen, dbtId, mobile, maskedMobile,t }) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleVerify = async () => {
    const res = await validateOtp({
      RequestInfo: {},
      User: {
        username: mobile,
        tenantId: "br",
        otpReference: otp,
        mobileNumber: mobile,
      },
    });

    if (res?.status === 200) {
      localStorage.setItem(
        "details",
        JSON.stringify({
          dbtId: dbtId,
          mobile: mobile,
        })
      );
      localStorage.setItem(
        "DfsWeb.user-info",
        JSON.stringify(res?.data?.UserRequest)
      );
      localStorage.setItem("DfsWeb.isCitizenUser", true);
      localStorage.setItem("DfsWeb.access-token", res?.data?.access_token);
      localStorage.setItem("DfsWeb.isLoggedIn", true);
      localStorage.setItem("DfsWeb.hasDBTlinked", !!dbtId);
      navigate("/farmer-registration");
    } else if (res?.response?.data?.error?.message.includes("OTP validation unsuccessful")) {
      dispatchNotification("error", ["INVALID_OTP"], dispatch);
    } else {
      dispatchNotification("error", ["farmerRegistration.UNEXPECTED_ERROR"], dispatch);
    }
    setOtp("");
  };

  const handleResendOTP = async () => {
    const res = await sendOtp({
      otp: {
        mobileNumber: mobile,
        userType: "CITIZEN",
        type: "REGISTER",
        tenantId: "br",
      },
    });
    if (res?.status === 201) {
      dispatchNotification("success", [t("schemes.otpSuccess")], dispatch);
    } else {
      dispatchNotification("error", ["farmerRegistration.UNEXPECTED_ERROR"], dispatch);
    }
    setOtp("");
  };

  // send otp for the first time
  useEffect(() => {
    handleResendOTP();
  }, []);

  return (
    <OTPPopup
      open={open}
      onClose={() => setOpen(false)}
      onResend={handleResendOTP}
      handleVerifyOTP={handleVerify}
      maskedMobileNumber={maskedMobile}
      errorMessageOTPValidation={""}
      otp={otp}
      setOtp={setOtp}
    />
  );
};

EnterOTP.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  dbtId: PropTypes.string.isRequired,
  mobile: PropTypes.string.isRequired,
  maskedMobile: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
};
