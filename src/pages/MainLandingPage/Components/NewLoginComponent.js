import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Collapse,
  FormControl,
  LinearProgress,
  styled,
  useMediaQuery,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/system";
import { useTranslation } from "react-i18next";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { useDispatch } from "react-redux";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import {
  dispatchNotification,
  homePageImages,
} from "../../../components/Utils";
import { ImageCarouselComponent } from "./ImageCarouselComponent";
import { ThemeContext } from "../../../theme";
import "../Styles/LoginComponent.css";
import { CssSelect } from "../../../components/Form/CustomWidget";
import FarmerLoginForm from "./FarmerLoginForm";
import OthersLoginForm from "./OthersLoginForm";
import { ExpandMore } from "@mui/icons-material";
import InteractiveElement from "../../../components/InteractiveElement/InteractiveElement";

// -------------------------- Shared Utils --------------------------
const BackgroundBox = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
}));

export const LoginComponent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { ourTheme } = useContext(ThemeContext);
  const tenantId = "br";

  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("farmer"); // default type
  const [showUserTypeDropDown, setShowUserTypeDropDown] = useState(true);

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  useEffect(() => {
    document.body.classList.toggle("light-theme", ourTheme === "light");
    document.body.classList.toggle("dark-theme", ourTheme === "dark");
  }, [ourTheme]);

  const onForgotPassword = () => {
    navigate(`${window?.contextPath}/change-password`);
  };

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
                }}
              >
                <Box className="lockedRoundedIcon-box">
                  <LockRoundedIcon className="lockedRoundedIcon" />
                </Box>
                <Typography variant="h5" className="!font-medium">
                  {t("LogInToAccount")}
                </Typography>
              </Container>

              <Collapse
                in={true}
                timeout={500}
                sx={{
                  boxShadow: "none",
                  padding: "0px 20px 20px 20px",
                }}
              >
                {/* User type selector */}
                {showUserTypeDropDown && (
                  <Box className="flex flex-col gap-4 sm:gap-6 pt-5 sm:pt-6">
                    <Box className="farmer-dbt-input-section !m-0 !p-0">
                      <Typography className="farmer-dbt-input-header-text">
                        {t("COMMON_LOGIN_TYPE")}
                      </Typography>
                      <FormControl className="w-full">
                        <CssSelect
                          value={userType}
                          onChange={handleUserTypeChange}
                          sx={{
                            minWidth: { sm: "300px" },
                            width: { xs: "100%" },
                          }}
                          variant="outlined" // ensure you use the outlined variant to match the style
                          darkTheme={ourTheme === "dark"}
                          IconComponent={ExpandMore}
                        >
                          <MenuItem value="farmer">{t("Farmer")}</MenuItem>
                          <MenuItem value="others">{t("Others")}</MenuItem>
                        </CssSelect>
                      </FormControl>
                    </Box>
                  </Box>
                )}
                {/* Render the correct login form */}
                {userType === "farmer" ? (
                  <FarmerLoginForm
                    t={t}
                    ourTheme={ourTheme}
                    navigate={navigate}
                    dispatchNotification={dispatchNotification}
                    queryClient={queryClient}
                    dispatch={dispatch}
                    setShowUserTypeDropDown={setShowUserTypeDropDown}
                    loading={loading}
                    setLoading={setLoading}
                    tenantId={tenantId}
                  />
                ) : (
                  <OthersLoginForm
                    t={t}
                    ourTheme={ourTheme}
                    navigate={navigate}
                    dispatchNotification={dispatchNotification}
                    queryClient={queryClient}
                    dispatch={dispatch}
                    loading={loading}
                    setLoading={setLoading}
                    tenantId={tenantId}
                  />
                )}
                {showUserTypeDropDown && (
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{ mt: 2 }}
                    color={theme.palette.text.textGreen}
                  >
                    <InteractiveElement
                      onClick={onForgotPassword}
                      sx={{textDecoration: "underline" }}
                    >
                      {t("CantLogin")}
                    </InteractiveElement>
                  </Typography>
                )}
              </Collapse>
            </Container>
          </Box>
        </Box>
      </BackgroundBox>
    </Container>
  );
};
