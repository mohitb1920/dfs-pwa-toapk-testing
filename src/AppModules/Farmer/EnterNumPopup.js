import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  FormControl,
  LinearProgress,
  Typography,
} from "@mui/material";
import { t } from "i18next";
import { CssTextField } from "../../components/Form/CustomWidget";
import { useContext, useState } from "react";
import { ThemeContext } from "../../theme";
import axiosInstance from "../../services/CreateAxios";
import { sendOtp } from "../../services/loginService";
import { dispatchNotification } from "../../components/Utils";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

const EnterNumPopup = ({ dbtId, open, onClose,mobile, setMobile, setStepper, maskedMobileNumber }) => {
  const dispatch = useDispatch();
  const { ourTheme } = useContext(ThemeContext);
  const [mobileError, setMobileError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post(
        "farmer/v1/dbt/_linked?tenantId=br",
        {
          RequestInfo: {
            authToken: null,
          },
          dbtId: dbtId,
          mobileNumber: mobile,
        }
      );
      const otpRequestData = {
        RequestInfo: {
          authToken: null,
        },
        otp: {
          mobileNumber: mobile,
          userType: "CITIZEN",
          type: "REGISTER",
          tenantId: "br",
        },
      };
      const res = await sendOtp(otpRequestData);
      if (res?.status === 201) {
        setStepper(1);
      }else if (res?.data?.error?.fields?.[0]?.message.includes("Already")) {
        dispatchNotification("error", ["MOBILE_ALREADY_REGISTERED"], dispatch);
      }
    } catch (error) {
      console.error(error);
      setMobileError("MOBILE_MISMATCH");
    } finally {
      setLoading(false);
    }
  };

  const handleMobileInput = (event) => {
    if (mobileError !== "") setMobileError("");
    const { value } = event.target;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setMobile(value);
    }
  };

  const handleClose = () => {
    setMobile("");
    onClose();
    setMobileError("");
    setStepper(0);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
        {loading && <LinearProgress color="success" />}
      <form onSubmit={handleSubmit}>
        <DialogContent className="!p-0">
          <Container variant="primary">
            <Box className="!px-3 !py-6 gap-6 flex flex-col items-center rounded-md">
              <Box className="farmer-dbt-input-section !m-0 !p-0">
                <Typography className="farmer-dbt-input-header-text">
                  {t("COMMON_MOBILE")}
                </Typography>
                <FormControl className="w-full">
                  <CssTextField
                    value={mobile}
                    name="mobile"
                    onChange={handleMobileInput}
                    error={!!mobileError}
                    helperText={mobileError && t(mobileError)}
                    sx={{ minWidth: { sm: "300px" }, width: { xs: "100%" } }}
                    darkTheme={ourTheme === "dark"}
                  />
                </FormControl>
                <Typography className="pt-4 px-2">
                  {t("MOBILE_NUM_CHANGE_1",{maskedMobileNumber: maskedMobileNumber})}
                </Typography>
                <Typography className="pt-2 px-2">
                  {t("MOBILE_NUM_CHANGE_2")}
                </Typography>
              </Box>
              <Box className="flex justify-around w-full">
                <Button variant="secondary" onClick={handleClose}>
                  {t("schemes.cancel")}
                </Button>
                <Button
                  variant="primary"
                  disabled={mobile.length !== 10}
                  type="submit"
                >
                  {t("selfRegistration.continue")}
                </Button>
              </Box>
            </Box>
          </Container>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EnterNumPopup;

EnterNumPopup.propTypes = {
  dbtId: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  setStepper: PropTypes.func,
  mobile: PropTypes.string,
  setMobile: PropTypes.func,
  maskedMobileNumber: PropTypes.string,
};
