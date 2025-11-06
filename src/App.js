import React, { useEffect, useMemo, useState } from "react";
import { ThemeProvider, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/system";
import "./styles/App.css";
import AppAppBar from "./components/AppBar";
import { ApplicationRoutes } from "./Route";
import NotificationSelector from "./NotificationSelector";
import { useInitStore } from "./Hooks/Store";
import { logoutUser } from "./services/loginService";
import { Footer } from "./components/Footer";
import generateTheme, { ThemeContext } from "./theme";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { usePageLoadTimer } from "./Hooks/PageLoadHook/usePageLoadTimer";

window.contextPath = "";

function App() {
  usePageLoadTimer();
  const [fontSize, setFontSize] = useState(
    JSON.parse(sessionStorage.getItem("DFSAPP-FontSize")) ?? 16
  );
  const [ourTheme, setOurTheme] = useState(
    sessionStorage.getItem("DFSAPP-ourTheme") ?? "light"
  );
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:640px)");

  const increaseFontSize = () => {
    setFontSize((prevSize) => Math.min(prevSize + 0.5, 18)); // Limit max font size to 32px
  };
  const resetTextSize = () => {
    setFontSize(16);
  };
  useEffect(() => {
    sessionStorage.setItem("DFSAPP-FontSize", JSON.stringify(fontSize));
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  const toggleTheme = () => {
    setOurTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };
  useEffect(() => {
    sessionStorage.setItem("DFSAPP-ourTheme", ourTheme);
  }, [ourTheme]);

  const decreaseFontSize = () => {
    setFontSize((prevSize) => Math.max(prevSize - 0.5, 14));
  };

  const { data: initData } = useInitStore();
  const isMdUp = useMediaQuery(useTheme().breakpoints.up("md"));
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await logoutUser(dispatch);
    navigate(`${window.contextPath}/`);
  };

  const theme = useMemo(
    () => generateTheme(fontSize, ourTheme),
    [fontSize, ourTheme]
  );
  useEffect(() => {
    document.body.classList.toggle("light-theme", ourTheme === "light");
    document.body.classList.toggle("dark-theme", ourTheme === "dark");
  }, [ourTheme]);
  return (
    <div className="app-container">
      <ThemeContext.Provider value={{ ourTheme, toggleTheme }}>
        <ThemeProvider theme={theme}>
          <NotificationSelector>
            <AppAppBar
              handleLogout={handleLogout}
              decreaseFontSize={decreaseFontSize}
              increaseFontSize={increaseFontSize}
              ourTheme={ourTheme}
              resetTextSize={resetTextSize}
            />
            <div className={`app-body ${isMdUp ? "app-body-md" : ""}`}>
              <ApplicationRoutes isMobile={isMobile} initData={initData} />
            </div>
            <Footer initData={initData} />
          </NotificationSelector>
        </ThemeProvider>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
