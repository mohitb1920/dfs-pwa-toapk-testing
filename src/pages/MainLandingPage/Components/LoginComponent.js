import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Collapse,
  IconButton,
  FormControl,
  InputAdornment,
  LinearProgress,
  styled,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { useTranslation } from "react-i18next";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { authenticateUser } from "../../../services/loginService";
import {
  dispatchNotification,
  homePageImages,
} from "../../../components/Utils";
import { useDispatch } from "react-redux";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { ImageCarouselComponent } from "./ImageCarouselComponent";
import { ThemeContext } from "../../../theme";
import "../Styles/LoginComponent.css";
import { CssTextField } from "../../../components/Form/CustomWidget";
import InteractiveElement from "../../../components/InteractiveElement/InteractiveElement";

const BackgroundBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
}));
const setEmployeeDetails = (userResponse) => {
  const userInfo = userResponse?.UserRequest ?? {};
  const userRoles = userInfo?.roles?.map((roleData) => roleData?.code) ?? [];
  const saoRoles = userRoles?.filter((role) => role === "SAO") ?? [];
  const techSupportRoles = userRoles?.filter((role) => role === "TIRO") ?? [];
  const isAgent =
    userRoles?.some((role) => role === "ASSISTEDMODE_AGENT") ?? false;
  localStorage.setItem("DfsWeb.isSupportUser", techSupportRoles.length > 0);
  localStorage.setItem("DfsWeb.isSaoUser", saoRoles.length > 0);
  localStorage.setItem("DfsWeb.user-info", JSON.stringify(userInfo));
  localStorage.setItem("DfsWeb.access-token", userResponse?.access_token);
  localStorage.setItem("DfsWeb.isAgentUser", isAgent);
};

export const LoginComponent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleUsernameInput = (event) => {
    if (usernameError !== "") setUsernameError("");
    setUsername(event.target.value);
  };

  const handlePasswordInput = (event) => {
    if (passwordError !== "") setPasswordError("");
    setPassword(event.target.value);
  };
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.target);
    const loginType = formData.get("user_login");
    const username = formData.get("user_login");
    const password = formData.get("password");
    let isValid = true;

    if (!loginType.trim()) {
      setUsernameError("COMMON_USERNAME_REQUIRED");
      isValid = false;
    }
    if (!username.trim()) {
      setUsernameError("COMMON_USERNAME_REQUIRED");
      isValid = false;
    }
    if (!password.trim()) {
      setPasswordError("COMMON_PASSWORD_REQUIRED");
      isValid = false;
    }

    if (isValid) {
      const requestParams = {
        username,
        password,
        userType: "EMPLOYEE",
        tenantId: "br",
      };
      const response = await authenticateUser(requestParams);
      if (response?.status === 200) {
        localStorage.setItem("DfsWeb.isLoggedIn", true);
        setEmployeeDetails(response?.data);
        queryClient.resetQueries();
        navigate(`${window.contextPath}/home`);
      } else if (response?.response?.data?.error_description) {
        dispatchNotification(
          "error",
          [response?.response?.data?.error],
          dispatch
        );
      } else {
        dispatchNotification("error", ["COMMON_SERVER_ERROR"], dispatch);
      }
    }
    setLoading(false);
  };
  const onForgotPassword = () => {
    navigate(`${window?.contextPath}/change-password`);
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("submitButton").click();
    }
  };
  const { ourTheme } = useContext(ThemeContext);
  useEffect(() => {
    document.body.classList.toggle("light-theme", ourTheme === "light");
    document.body.classList.toggle("dark-theme", ourTheme === "dark");
  }, [ourTheme]);
  return (
    <Container variant="primary">
      <BackgroundBox>
        <Box
          sx={{
            display: "flex",
            height: "100%",
            width: "100%",
            flexDirection: isSmallScreen ? "column" : "row",
          }}
        >
          <Box
            className="flex justify-end w-full"
            sx={{
              width: isSmallScreen ? "100%" : "70%",
              overflow: "hidden",
            }}
          >
            <ImageCarouselComponent
              images={homePageImages}
              height={"none"}
              borderRadius={"0px"}
              showPlayPause={true}
            />
          </Box>

          {/* Right side: Login form */}
          <Box
            className="leftSideLoginIn"
            sx={{
              width: isSmallScreen ? "100%" : "30%",
              height: "100%",
              minHeight: { xs: "0px", sm: "50vh" },
              display: "flex",
              flexDirection: "column",
            }}
          >
            {loading && <LinearProgress color="success" />}
            <Container
              sx={{
                borderRadius: "8px",
                maxWidth: "none !important",
                padding: "0px !important",
              }}
            >
              <Container
                variant="primaryGreen"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "15px 20px 15px 40px",
                  // backgroundColor: "rgba(24, 52, 45, 1)",
                }}
              >
                <Box className="lockedRoundedIcon-box">
                  <LockRoundedIcon className="lockedRoundedIcon" />
                </Box>

                <Typography variant="h5" className="!font-medium">
                  {t("LogInToAccount")}
                </Typography>
                {/* <IconButton color="#fff" onClick={handleToggle}>
                {open ? (
                  <ArrowDropUpIcon color="#fff" />
                ) : (
                  <ArrowDropDownIcon color="#fff" />
                )}
              </IconButton> */}
              </Container>

              <Collapse
                in={true}
                timeout={500} // Add a timeout for smooth transition
                sx={{
                  // Remove the shadow below the Collapse
                  boxShadow: "none",
                  padding: "0px 20px 20px 20px",
                }}
              >
                {/* Form Fields */}
                <form onSubmit={handleSubmit}>
                  <Box className="flex flex-col gap-4 sm:gap-6 pt-5 sm:pt-6">
                    <Box className="farmer-dbt-input-section !m-0 !p-0">
                      <Typography className="farmer-dbt-input-header-text">
                        {t("COMMON_USERNAME")}
                      </Typography>
                      <FormControl className="w-full">
                        <CssTextField
                          value={username}
                          name="user_login"
                          id="user_login"
                          placeholder={t("e.g. mukesh1234@email.com")}
                          onChange={handleUsernameInput}
                          error={!!usernameError}
                          helperText={usernameError && t(usernameError)}
                          className="!m-0"
                          sx={{
                            minWidth: { sm: "300px" },
                            width: { xs: "100%" },
                          }}
                          darkTheme={ourTheme === "dark"}
                        />
                      </FormControl>
                    </Box>
                    <Box className="farmer-dbt-input-section !m-0 !p-0">
                      <Typography className="farmer-dbt-input-header-text">
                        {t("COMMON_PASSWORD")}
                      </Typography>
                      <FormControl className="w-full">
                        <CssTextField
                          name="password"
                          id="user_password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          autoComplete="new-password"
                          onKeyDown={handleKeyPress}
                          placeholder={t("COMMON_ENTER_PASSWORD")}
                          onChange={handlePasswordInput}
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          error={!!passwordError}
                          helperText={passwordError && t(passwordError)}
                          className="!m-0"
                          sx={{
                            minWidth: { sm: "300px" },
                            width: { xs: "100%" },
                          }}
                          darkTheme={ourTheme === "dark"}
                        />
                      </FormControl>
                    </Box>
                    <Button
                      variant="primary"
                      style={{
                        height: "52px",
                        color: "#1C211E",
                      }}
                      fullWidth
                      id="submitButton"
                      type="submit"
                      disabled={loading}
                    >
                      {t("Login")}
                    </Button>
                  </Box>
                  <>
                    <Typography
                      variant="body2"
                      align="center"
                      sx={{ mt: 2 }}
                      color={theme.palette.text.textGreen}
                      style={{ cursor: "pointer" }}
                    >
                      <InteractiveElement
                        onClick={onForgotPassword}
                        // style={{
                        //   textDecoration: "none",
                        //   textDecorationLine: "underline",
                        // }}
                      >
                        {t("CantLogin")}
                      </InteractiveElement>
                    </Typography>
                  </>
                </form>
              </Collapse>
            </Container>
          </Box>
        </Box>
      </BackgroundBox>
    </Container>
  );
};
