import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { logoutUser } from "../../services/loginService";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

const ForceLogoutPopup = ({ open, onClose, setStepper }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logoutUser(dispatch);
    navigate(`${window.contextPath}/`);
  };

  const handleClose = () => {
    onClose();
    setStepper(0);
    handleLogout();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs">
      <DialogContent className="!p-0">
        <Container variant="primary">
          <Box className="!px-3 !py-6 gap-6 flex flex-col items-center rounded-md">
            <img
              src="../../assets/accountCard.svg"
              alt=""
              style={{ height: "96px", borderRadius: "53px" }}
            />

            {/* <Typography
              variant="h6"
              className="!font-bold w-[271px] text-center"
              sx={{
                color: theme.palette.text.textGreen,
                lineHeight: "28px",
              }}
            >
              {t("farmerRegistration.RE_LOGIN_HEADER")}
            </Typography> */}

            <Box className="flex justify-center items-center">
              <Typography
                variant="body1"
                className="text-center"
                sx={{
                  color: theme.palette.text.textGrey,
                }}
              >
                {t("farmerRegistration.RE_LOGIN_MESSAGE")}
              </Typography>
            </Box>
            <Button variant="primary" onClick={handleLogout}>
              <Box className="items-center flex justify-center rounded-lg w-44 sm:w-72">
                {t("appBar.logout")}
              </Box>
            </Button>
          </Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
};
export default ForceLogoutPopup;

ForceLogoutPopup.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  setStepper: PropTypes.func,
};
