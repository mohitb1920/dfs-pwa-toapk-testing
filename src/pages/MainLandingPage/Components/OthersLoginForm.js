import { Box, Button, FormControl, Typography } from "@mui/material";
import { useState } from "react";
import { CssTextField } from "../../../components/Form/CustomWidget";
import { authenticateUser } from "../../../services/loginService";
import { userProfileData } from "../../../Modules/Actions/userProfileActions";

const setEmployeeDetails = (userResponse,dispatch) => {
  const userInfo = userResponse?.UserRequest ?? {};
  const userRoles = userInfo?.roles?.map((roleData) => roleData?.code) ?? [];
  const saoRoles = userRoles?.filter((role) => role === "SAO") ?? [];
  const techSupportRoles = userRoles?.filter((role) => role === "TIRO") ?? [];
  const isAgent =
    userRoles?.some((role) => role === "ASSISTEDMODE_AGENT") ?? false;
  localStorage.setItem("DfsWeb.isSupportUser", techSupportRoles.length > 0);
  localStorage.setItem("DfsWeb.isSaoUser", saoRoles.length > 0);
  dispatch(userProfileData(userInfo?.name));
  localStorage.setItem("DfsWeb.user-info", JSON.stringify(userInfo));
  localStorage.setItem("DfsWeb.access-token", userResponse?.access_token);
  localStorage.setItem("DfsWeb.isAgentUser", isAgent);
};

const OthersLoginForm = ({
  t,
  ourTheme,
  navigate,
  dispatchNotification,
  queryClient,
  dispatch,
  loading,
  setLoading,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
    const username = formData.get("user_login");
    const password = formData.get("password");
    let isValid = true;

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
        setEmployeeDetails(response?.data,dispatch);
        queryClient.resetQueries();
        navigate(`${window.contextPath}/home`);
      } else if (response?.response?.data?.error_description) {
        dispatchNotification("error", [response.response.data.error], dispatch);
      } else {
        dispatchNotification("error", ["COMMON_SERVER_ERROR"], dispatch);
      }
    }
    setLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById("submitButton").click();
    }
  };

  return (
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
              sx={{ minWidth: { sm: "300px" }, width: { xs: "100%" } }}
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
              type="password"
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
              sx={{ minWidth: { sm: "300px" }, width: { xs: "100%" } }}
              darkTheme={ourTheme === "dark"}
            />
          </FormControl>
        </Box>
        <Button
          variant="primary"
          style={{ height: "52px", color: "#1C211E" }}
          fullWidth
          id="submitButton"
          type="submit"
          disabled={loading}
        >
          {t("Login")}
        </Button>
      </Box>
    </form>
  );
};

export default OthersLoginForm;