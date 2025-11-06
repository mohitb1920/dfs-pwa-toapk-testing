import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  MenuItem,
  Container,
  Typography,
  Menu,
  useTheme,
  Drawer,
  useMediaQuery,
  Collapse,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/AppBar.css";
import { useTranslation } from "react-i18next";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import {
  TENANT_ID,
  getCurrentLanguage,
  getRoleBasedModules,
  pgrRoles,
} from "./Utils";
import { getUser } from "../services/loginService";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { LocalizationService } from "../services/AppLocalizationService";
import ContrastSharpIcon from "@mui/icons-material/ContrastSharp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { ThemeContext } from "../theme";
import { useWeatherHomeData } from "../Hooks/useAssets";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { isToday, parse } from "date-fns";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ActionConfirmationDialog from "./ActionConfirmationDialog";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import { makeStyles } from "@mui/styles";
import InteractiveElement from "./InteractiveElement/InteractiveElement";
const logoUrl =
  "https://filestoragedfs.blob.core.windows.net/publicresources/images/bihar-krishi.svg";

const useStyles = makeStyles({
  customMenu: {
    border: "0.5px solid #A2ABA6",
    marginTop: "3px",
    "& .MuiMenuItem-root": {
      justifyContent: "center",
      minHeight: "25px",
    },
  },
  languageChangeMenu: {
    border: "0.5px solid #A2ABA6",
    marginTop: "3px",
    "& .MuiMenuItem-root": {
      minHeight: "25px",
    },
  },
  customSubMenu: {
    border: "0.5px solid #A2ABA6",
    minWidth: "130px !important",
    "& .MuiMenuItem-root": {
      minHeight: "25px",
      marginInline: "8px",
      borderRadius: "4px",
      paddingLeft: "10px",
    },
  },
});

function AppAppBar(props) {
  const {
    handleLogout,
    increaseFontSize,
    resetTextSize,
    decreaseFontSize,
    ourTheme,
  } = props;
  const [appLanguage, setAppLanguage] = React.useState(
    getCurrentLanguage() || "en_IN"
  );
  const theme = useTheme();
  const loggedIn = localStorage.getItem("DfsWeb.isLoggedIn") === "true";
  const { toggleTheme } = React.useContext(ThemeContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElLang, setAnchorElLang] = React.useState(null);
  const [anchorElAcc, setAnchorElAcc] = React.useState(null);
  const [userRole, setUserRole] = useState("Employee");
  const [name, setName] = useState("User");
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const pages = getRoleBasedModules();
  const isMobile = useMediaQuery("(max-width:640px)");
  const classes = useStyles();
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [anchorElMenuItem, setAnchorElMenuItem] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  // Refs for measuring
  const containerRef = useRef(null);
  const rightRef = useRef(null);
  const measureRef = useRef(null);
  const focusRef = useRef(null);

  // State
  const [buttonWidths, setButtonWidths] = useState([]);
  const [moreBtnWidth, setMoreBtnWidth] = useState(0);
  const [visiblePages, setVisiblePages] = useState(pages);
  const [overflowPages, setOverflowPages] = useState([]);
  const [anchorElMore, setAnchorElMore] = useState(null);

  const handleMoreOpen = (e) => setAnchorElMore(e.currentTarget);
  const handleMoreClose = () => setAnchorElMore(null);

  // Helper for shallow comparing arrays of numbers
  const arraysEqual = (a, b) =>
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((v, i) => v === b[i]);

  // Measure button widths once on mount or when pages change
  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const children = Array.from(el.children);
    if (children.length === 0) return;

    const widths = children.map((child) => child.offsetWidth);
    const measuredMore = widths.pop() || 0; // last child is "More"

    setMoreBtnWidth((prev) => (prev !== measuredMore ? measuredMore : prev));
    setButtonWidths((prev) => (arraysEqual(prev, widths) ? prev : widths));
  }, [pages]);

  // Function to recalculate visible vs overflow
  const splitPages = () => {
    const container = containerRef.current;
    const right = rightRef.current;
    if (!container || !right || buttonWidths.length === 0) return;

    const avail = container.clientWidth - right.clientWidth;
    const totalBtnWidth = buttonWidths.reduce((sum, w) => sum + w, 0);

    // If all buttons fit without needing "More"
    if (totalBtnWidth <= avail) {
      if (visiblePages.length !== pages.length || overflowPages.length !== 0) {
        setVisiblePages(pages);
        setOverflowPages([]);
      }
      return;
    }

    // Need overflow: reserve space for "More"
    let used = 0;
    let splitIndex = buttonWidths.length;
    for (let i = 0; i < buttonWidths.length; i++) {
      if (used + buttonWidths[i] + moreBtnWidth > avail) {
        splitIndex = i;
        break;
      }
      used += buttonWidths[i];
    }

    const newVisible = pages.slice(0, splitIndex);
    const newOverflow = pages.slice(splitIndex);

    // Only update if changed
    if (
      visiblePages.length !== newVisible.length ||
      overflowPages.length !== newOverflow.length ||
      !arraysEqual(
        visiblePages.map((p) => p.key),
        newVisible.map((p) => p.key)
      ) ||
      !arraysEqual(
        overflowPages.map((p) => p.key),
        newOverflow.map((p) => p.key)
      )
    ) {
      setVisiblePages(newVisible);
      setOverflowPages(newOverflow);
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    setAnchorEl(null);
    setExpandedMenu(null);
  };
  const onPageClick = (path, key) => {
    if (path === null) {
      navigate(`${window.contextPath}/${key}`);
    } else {
      navigate(path);
    }
  };
  const handleLanguageChange = async (lang) => {
    setAnchorElLang(null);
    await LocalizationService.changeLanguage(lang, TENANT_ID);
    setAppLanguage(lang);
  };

  const handleMenuClick = (path, key) => {
    handleCloseNavMenu();
    handleMoreClose();
    if (path === null) {
      navigate(`${window.contextPath}/${key}`);
    } else if (path === "logout") {
      setOpen(true);
    } else {
      navigate(path);
    }
  };

  const onLogout = () => {
    setOpen(false);
    handleLogout();
    setName("User");
  };

  const greetingElement = (style) => {
    return (
      <Box
        sx={{
          flexGrow: 0,
          display: style,
          marginRight: "14px",
          alignSelf: "center",
        }}
      >
        {loggedIn && (
          <Box className="max-sm:h-14 items-center max-sm:flex">
            <Typography variant="body1">{name}</Typography>
          </Box>
        )}
      </Box>
    );
  };
  const userInfo = useSelector((state) => state.profileData);

  useEffect(() => {
    if (loggedIn) {
      setName(userInfo?.name || name);
      const userRoles = userInfo?.roles ?? [];
      const userRole = userRoles.find((role) => pgrRoles.includes(role.code));
      setUserRole(userRole?.name ?? userRoles[0]?.name);
      focusRef?.current?.focus();
    }
  }, [loggedIn,userInfo?.name]);

  const logoutMenuItem = () => (
    <MenuItem
      key="logout"
      data-testid="menu-item-logout"
      onClick={() => handleMenuClick("logout")}
      sx={{ padding: "10px 15px" }}
    >
      <LogoutOutlinedIcon
        color={ourTheme === "light" ? "error" : "#FFFFF"}
        sx={{ ml: "10px" }}
      />
      <Typography
        textAlign="center"
        ml={"10px"}
        sx={{ color: ourTheme === "light" ? "#d32f2f" : "#FFFFF" }}
      >
        {t("ACTION_LOGOUT")}
      </Typography>
    </MenuItem>
  );

  const editProfileMenuItem = () => (
    <MenuItem
      key="edit"
      data-testid="menu-item-edit-profile"
      sx={{ padding: "10px 15px" }}
      onClick={() => handleMenuClick(`${window.contextPath}/edit-profile`)}
    >
      {/* <EditIcon color="success" /> */}
      <Typography textAlign="center" ml={"10px"}>
        {t("EDIT_PROFILE")}
      </Typography>
    </MenuItem>
  );
  const profileRole = () => (
    <div style={{ paddingInline: "2px" }}>
      <Typography
        sx={{ fontWeight: 600, fontSize: "15px", color: "black", px: "1" }}
      >
        {userRole}{" "}
      </Typography>
    </div>
  );
  const onDoneCLick = () => {
    navigate(`${window.contextPath}/home`);
  };
  const pathnames = location.pathname.split("/").filter((x) => x);

  const preferredLocation = useSelector((state) => {
    return state.weatherLocation;
  });
  let { data: weatherData } = useWeatherHomeData({
    blockLG: preferredLocation?.blockLG,
    districtLg: preferredLocation?.districtLg,
  });
  const [todayWeatherData, setTodayWeatherData] = useState();

  useEffect(() => {
    setTodayWeatherData(weatherData?.weather);
    weatherData?.weatherForecast?.forEach((e) => {
      const dateCheck = isToday(
        parse(e.date || "", "yyyy-MM-dd HH:mm:ss", new Date())
      );

      if (dateCheck) {
        const weatherToday = {
          block: e.block,
          district: e.district,
          cloudiness: e.cloudiness,
          date: e.date,
          humidityAverage: e.humidity,
          rainmm: e.rainmm,
          tempMaxCenti: e.tempMaxCenti,
          tempMinCenti: e.tempMinCenti,
          windDirectionInCardinal: e.windDirectionInCardinal,
          windDirection: e.windDirection,
          windSpeedMaxms: e.windSpeedms,
        };

        setTodayWeatherData(weatherToday);
      }
    });
  }, [weatherData]);
  const handleWeatherClick = () => {
    let path = `${window.contextPath}/weatherdata`;
    navigate(path);
  };

  const fontSizeActions = [
    { onClick: decreaseFontSize, symbol: "-" },
    { onClick: resetTextSize, symbol: " " },
    { onClick: increaseFontSize, symbol: "+" },
  ];

  const mobileAccessibilityMenuItems = [
    {
      type: "navigate",
      navigateTo: `${window.contextPath}/screenreaderaccess`,
      icon: `${window.contextPath}/assets/screen-reader-icon.svg`,
      alt: "Screen Reader Access Icon",
      onClick: () => {
        setAnchorElAcc(null);
        navigate(`${window.contextPath}/screenreaderaccess`);
      },
    },
  ];

  const handleMenuOpen = (event, key) => {
    setAnchorElMenuItem(event.currentTarget);
    setOpenMenu(key);
  };

  const handleMenuClose = () => {
    setAnchorElMenuItem(null);
    setOpenMenu(null);
  };

  const handleMenuItemClick = (path) => {
    handleMenuClose();
    onPageClick(path, null);
  };

  const handleMenuExpand = (key) => {
    handleMenuClose();
    setExpandedMenu((prev) => (prev === key ? null : key)); // Toggle the expanded menu
  };

  const isParentSelected = (page) => {
    // Check if the current location matches any submenu item's path or the parent's path
    if (page.isMenu) {
      return page.menuItems.some((item) =>
        location.pathname.includes(item.path)
      );
    }
    return page.path !== null && location.pathname.includes(page.path);
  };

  const isActivePageUnderMore = () => {
    const state = overflowPages.some((page) => {
      if (page.isMenu) {
        return page.menuItems.some((item) =>
          location.pathname.includes(item.path)
        );
      }
      return page.path !== null && location.pathname.includes(page.path);
    });
    return state ? {borderBottom:`solid 1px ${theme.palette.text.primary}`,
                      fontWeight: "700 !important"
                    } : {fontWeight: "400 !important"}
  }

  const renderMenuItems = overflowPages.flatMap((p) => {
    const mainItem = (
      <MenuItem
        key={p.key}
        onClick={() => {
          if (p.isMenu) {
            handleMenuExpand(p.title);
          } else {
            onPageClick(p.path, p.key);
            handleMoreClose();
          }
        }}
        className="!justify-between"
        sx={{
          fontWeight: isParentSelected(p) ? "700 !important" : "400 !important",
        }}
      >
        {t(p.title)}
        {p.isMenu &&
          (expandedMenu === p.title ? (
            <KeyboardArrowUp sx={{ marginLeft: 1 }} />
          ) : (
            <KeyboardArrowDown sx={{ marginLeft: 1 }} />
          ))}
      </MenuItem>
    );

    const subItems =
      p.isMenu && expandedMenu === p.title
        ? p.menuItems.map((menuItem, index) => (
            <MenuItem
              key={`${p.key}-${index}`}
              onClick={() => handleMenuClick(menuItem.path, null)}
              className="px-3 py-2 flex items-center"
              sx={{
                pl: 4,
                fontWeight:
                  menuItem.path !== null &&
                  location.pathname.includes(menuItem.path)
                    ? "700"
                    : "400",
              }}
            >
              <Typography textAlign="center" ml="10px">
                {t(menuItem.title)}
              </Typography>
            </MenuItem>
          ))
        : [];

    return [mainItem, ...subItems];
  });

  // 3) Run splitPages on resize or when widths/pages change
  useEffect(() => {
    splitPages();
    const onResize = () => requestAnimationFrame(splitPages);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [buttonWidths, moreBtnWidth, pages, todayWeatherData, loggedIn]);

  return (
    <div>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 1)",
          color: "#000",
          boxShadow: "none",
        }}
      >
        {/* Hidden in DOM. Used for calculating button sizes */}
        <Box
          ref={measureRef}
          sx={{
            position: "absolute",
            visibility: "hidden",
            height: 0,
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          className="flex"
        >
          {pages?.map((page) => (
            <div className="button-style" key={page.title}>
              <Button
                variant="textButton"
                className="button-style text-nowrap"
                href={page?.path === null ? page.key : null}
                onClick={
                  page?.isMenu
                    ? (event) => handleMenuOpen(event, page.title)
                    : () => onPageClick(page?.path, page?.key)
                }
                sx={{
                  borderBottom: isParentSelected(page)
                    ? `solid 1px ${theme.palette.text.primary}`
                    : "none",
                  fontWeight: isParentSelected(page)
                    ? "700 !important"
                    : "400 !important",
                }}
              >
                {t(page?.title)}
                {page?.isMenu && (
                  <>
                    {openMenu === page.title ? (
                      <KeyboardArrowUp sx={{ marginLeft: 1 }} />
                    ) : (
                      <KeyboardArrowDown sx={{ marginLeft: 1 }} />
                    )}
                  </>
                )}
              </Button>
            </div>
          ))}
          <Button className="button-style text-nowrap">
            {t("schemes.more")}
            <KeyboardArrowUp sx={{ marginLeft: 1 }} />
          </Button>
        </Box>
        <Container
          variant="primary"
          maxWidth="100%"
          sx={{
            display: "flex",
            justifyContent: "end",
            minHeight: "0px !important",
          }}
          className="top-bar"
        >
          {/* Buttons */}
          <Box className="topnav-container-mobile-style">
            {isMobile && (
              <Box className="flex justify-center items-center ml-4">
                <img
                  src={`${window.contextPath}/assets/${ourTheme}/DfsLogo.svg`}
                  alt="DfsLogo"
                  className="mobile-topnav-logo"
                />
              </Box>
            )}
            <Box className="topnav-accessibility-container">
              {!isMobile ? (
                <>
                  <Box className="item-box">
                    <Typography
                      ref={focusRef}
                      component="a"
                      href="#main-content"
                      onClick={() => {
                        const mainContent =
                          document.getElementById("main-content");
                        if (mainContent) {
                          mainContent.focus();
                        }
                      }}
                      className="language-options"
                    >
                      {t("Skip_to_main_content")}
                    </Typography>
                  </Box>
                  {fontSizeActions.map((action, index) => (
                    <Box className="item-box" key={index}>
                      <Typography
                        role="button"
                        tabIndex="0"
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            action.onClick();
                          }
                        }}
                        onClick={action.onClick}
                        className="language-options Aicon"
                      >
                        {t("Acc")}
                        {action.symbol}
                      </Typography>
                    </Box>
                  ))}{" "}
                  <Box className="item-box">
                    <IconButton color="inherit" onClick={toggleTheme}>
                      <ContrastSharpIcon />
                    </IconButton>
                  </Box>
                  <Box className="item-box">
                    <Typography
                      role="button"
                      tabIndex="0"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          navigate(`${window.contextPath}/sitemap`);
                        }
                      }}
                      onClick={() => {
                        navigate(`${window.contextPath}/sitemap`);
                      }}
                      className="language-options"
                    >
                      {t("Sitemap")}
                    </Typography>
                  </Box>
                  <Box className="item-box">
                    <Typography
                      component="a"
                      href="#main-content"
                      onClick={() => {
                        navigate(`${window.contextPath}/screenreaderaccess`);
                      }}
                      className="language-options"
                    >
                      {t("ScreenReader")}
                    </Typography>
                  </Box>
                </>
              ) : (
                <>
                  <Box
                    onClick={(event) => {
                      setAnchorElAcc(event.currentTarget);
                    }}
                    className="accessibility-mobile-dropdown"
                  >
                    <img
                      src={`${window.contextPath}/assets/Accessibility-icon.svg`}
                      alt="Accessibility Icon"
                      className="accessibility-menu-header-icon"
                    />
                    {Boolean(anchorElAcc) ? (
                      <ArrowDropUpIcon style={{ marginLeft: "8px" }} />
                    ) : (
                      <ArrowDropDownIcon style={{ marginLeft: "8px" }} />
                    )}
                  </Box>
                  <Menu
                    anchorEl={anchorElAcc}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    open={Boolean(anchorElAcc)}
                    onClose={() => setAnchorElAcc(null)}
                    classes={{ paper: classes.customMenu }}
                  >
                    {fontSizeActions.map((action, index) => (
                      <MenuItem onClick={action.onClick} key={index}>
                        <Typography tabIndex="0" className="language-options">
                          {t("Acc")}
                          {action.symbol}
                        </Typography>
                      </MenuItem>
                    ))}
                    <MenuItem
                      onClick={() => {
                        setAnchorElAcc(null);
                        toggleTheme();
                      }}
                    >
                      <ContrastSharpIcon />
                    </MenuItem>
                    {mobileAccessibilityMenuItems.map((item, index) => (
                      <MenuItem key={index} onClick={item.onClick}>
                        {item.type === "link" ? (
                          <Typography component="a" href={item.href}>
                            <img
                              src={item.icon}
                              alt={item.alt}
                              className="accessibility-menu-icons"
                            />
                          </Typography>
                        ) : (
                          <img
                            src={item.icon}
                            alt={item.alt}
                            className="accessibility-menu-icons"
                          />
                        )}
                      </MenuItem>
                    ))}
                  </Menu>
                  <Typography
                    onClick={() => {
                      setAnchorElAcc(null);
                      navigate(`${window.contextPath}/sitemap`);
                    }}
                    className="!ml-2 !mr-0"
                  >
                    <img
                      src={`${window.contextPath}/assets/sitemap-icon.svg`}
                      alt={"Sitemap Icon"}
                      className="accessibility-menu-icons"
                    />
                  </Typography>
                </>
              )}
              <Box className="item-box">
                <Typography
                  role="button"
                  tabIndex="0"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      setAnchorElLang(event.currentTarget);
                    }
                  }}
                  onClick={(event) => {
                    setAnchorElLang(event.currentTarget);
                  }}
                  className="language-options"
                >
                  {appLanguage === "en_IN" ? "English" : "हिंदी"}
                  {Boolean(anchorElLang) ? (
                    <ArrowDropUpIcon style={{ marginLeft: "8px" }} />
                  ) : (
                    <ArrowDropDownIcon style={{ marginLeft: "8px" }} />
                  )}
                </Typography>
              </Box>
              <Box className="item-box">
                <Menu
                  anchorEl={anchorElLang}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={Boolean(anchorElLang)}
                  onClose={() => setAnchorElLang(null)}
                  classes={{ paper: classes.languageChangeMenu }}
                >
                  <MenuItem onClick={() => handleLanguageChange("en_IN")}>
                    English
                  </MenuItem>
                  <MenuItem onClick={() => handleLanguageChange("hi_IN")}>
                    हिंदी
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Box>
        </Container>
        <Container
          variant="primary"
          maxWidth="100%"
          className="middle-container"
          sx={{ pl: "0 !important" }}
        >
          <Toolbar
            className="!mx-1 sm:!mx-[40px] !py-[8px]"
            disableGutters
            sx={{ justifyContent: "space-between" }}
          >
            <Box display="flex" alignItems="center">
              <img
                src={logoUrl}
                className="svgIcon-appbar sm:mr-2 object-fill cursor-pointer"
                onClick={() => navigate(`${window.contextPath}/home`)}
                alt="Bihar Krishi Logo"
              />
              <Box>
                <Typography
                  variant="body2"
                  fontWeight="700"
                  className="text_dept"
                >
                  {t("DepartofAgri")}
                </Typography>
                <Typography variant="caption" className="text_govt">
                  {t("govtOfBihar")}
                </Typography>
              </Box>
            </Box>
            <Box
              className="flex"
              alignItems="center"
              sx={{ objectFit: "contain" }}
            >
              <Box
                className="flex justify-center w-full align-baseline"
                sx={{
                  display: { xs: "none", md: "flex" },
                  justifyContent: "center",
                  alignItems: "stretch",
                }}
              >
                <Box
                  className="sideBorder"
                  sx={{ display: { md: "flex", xs: "none" } }}
                />
                <img
                  src={`${window.contextPath}/assets/${ourTheme}/DfsLogo.svg`}
                  alt="DfsLogo"
                />
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  alignItems: "center",
                  display: { xs: "flex", md: "none" },
                }}
              >
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor="left"
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    "& .MuiDrawer-paper": {
                      width: "232px",
                    },
                  }}
                >
                  <Box
                    className="flex flex-col h-full p-2"
                    role="presentation"
                    onClick={(e) => e.stopPropagation()} // Prevent Drawer from closing when clicking inside
                  >
                    <Box className="pl-5 py-2 flex justify-between items-center">
                      <img
                        src={logoUrl}
                        className="svgIcon-appbar sm:mr-2 object-fill cursor-pointer w-14"
                        onClick={() =>
                          handleMenuClick(`${window.contextPath}/home`)
                        }
                        alt="Bihar Krishi Logo"
                      />
                      <CloseIcon
                        onClick={handleCloseNavMenu}
                        className="cursor-pointer"
                      />
                    </Box>
                    {pages?.map((page) => (
                      <React.Fragment key={page.title}>
                        <MenuItem
                          component="div"
                          data-testid="menu-item"
                          onClick={
                            page?.isMenu
                              ? () => handleMenuExpand(page.title)
                              : () => handleMenuClick(page.path, page.key)
                          }
                          className="py-3 px-2 flex items-center !justify-between"
                        >
                          <Typography
                            textAlign="center"
                            style={{
                              fontWeight: isParentSelected(page)
                                ? "700"
                                : "400",
                            }}
                            ml={"10px"}
                          >
                            {t(page.title)}
                          </Typography>
                          {page?.isMenu && (
                            <>
                              {expandedMenu === page.title ? (
                                <KeyboardArrowUp sx={{ marginLeft: 1 }} />
                              ) : (
                                <KeyboardArrowDown sx={{ marginLeft: 1 }} />
                              )}
                            </>
                          )}
                        </MenuItem>
                        {page?.isMenu && (
                          <Collapse
                            in={expandedMenu === page.title}
                            timeout="auto"
                            unmountOnExit
                            className="pl-3"
                          >
                            {page?.menuItems?.map((menuItem, index) => (
                              <MenuItem
                                key={`${menuItem.title}-${index}`}
                                onClick={() =>
                                  handleMenuClick(menuItem.path, null)
                                }
                                className="px-3 py-2 flex items-center"
                              >
                                <Typography
                                  textAlign="center"
                                  style={{
                                    fontWeight:
                                      menuItem?.path !== null &&
                                      location.pathname.includes(menuItem?.path)
                                        ? "700"
                                        : "400",
                                  }}
                                  ml={"10px"}
                                >
                                  {t(menuItem.title)}
                                </Typography>
                              </MenuItem>
                            ))}
                          </Collapse>
                        )}
                      </React.Fragment>
                    ))}
                    {loggedIn && editProfileMenuItem()}
                    {loggedIn && logoutMenuItem()}
                    {!loggedIn && (
                      <Box className="min-w-20 px-4">
                        <Button variant="primary" onClick={onDoneCLick}>
                          {t("Login")}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Drawer>
              </Box>
            </Box>
          </Toolbar>
        </Container>

        <Container variant="tertiaryGreen" className="top-bottom-bar">
          <Toolbar
            disableGutters
            className="toolbarBottomNav"
            ref={containerRef}
          >
            <Box
              className="pr-2"
              sx={{
                flexGrow: 1,
                display: {
                  xs: "none",
                  md: "flex",
                  justifyContent: "start",
                  alignItems: "end",
                },
              }}
            >
              {visiblePages?.map((page) => (
                <div className="button-style" key={page.title}>
                  <Button
                    variant="textButton"
                    className="button-style text-nowrap"
                    href={page?.path === null ? page.key : null}
                    onClick={
                      page?.isMenu
                        ? (event) => handleMenuOpen(event, page.title)
                        : () => onPageClick(page?.path, page?.key)
                    }
                    sx={{
                      borderBottom: isParentSelected(page)
                        ? `solid 1px ${theme.palette.text.primary}`
                        : "none",
                      fontWeight: isParentSelected(page)
                        ? "700 !important"
                        : "400 !important",
                    }}
                  >
                    {t(page?.title)}
                    {page?.isMenu && (
                      <>
                        {openMenu === page.title ? (
                          <KeyboardArrowUp sx={{ marginLeft: 1 }} />
                        ) : (
                          <KeyboardArrowDown sx={{ marginLeft: 1 }} />
                        )}
                      </>
                    )}
                  </Button>
                  {page?.isMenu && (
                    <Menu
                      anchorEl={anchorElMenuItem}
                      open={openMenu === page.title}
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                      classes={{ paper: classes.customSubMenu }}
                    >
                      {page?.menuItems?.map((menuItem, index) => (
                        <MenuItem
                          key={`${menuItem.title}-${index}`}
                          onClick={() => handleMenuItemClick(menuItem.path)}
                          sx={{
                            fontWeight:
                              menuItem?.path !== null &&
                              location.pathname.includes(menuItem?.path)
                                ? "700 !important"
                                : "400 !important",
                          }}
                        >
                          {t(menuItem.title)}
                        </MenuItem>
                      ))}
                    </Menu>
                  )}
                </div>
              ))}
              {overflowPages.length > 0 && (
                <React.Fragment>
                  <Button
                    onClick={handleMoreOpen}
                    className="button-style text-nowrap"
                    variant="textButton"
                    sx={isActivePageUnderMore()}
                  >
                    {t("schemes.more")}
                    {anchorElMore ? (
                      <KeyboardArrowUp sx={{ marginLeft: 1 }} />
                    ) : (
                      <KeyboardArrowDown sx={{ marginLeft: 1 }} />
                    )}
                  </Button>
                  <Menu
                    anchorEl={anchorElMore}
                    open={Boolean(anchorElMore)}
                    onClose={handleMoreClose}
                  >
                    {renderMenuItems}
                  </Menu>
                </React.Fragment>
              )}
            </Box>
            <Box className="ml-auto flex" ref={rightRef}>
              {greetingElement({ xs: "flex", md: "none" })}
              {todayWeatherData != null && (
                <Box className="weather-data-box">
                  <InteractiveElement onClick={() => handleWeatherClick()}>
                    <Box className="home-temp-box">
                      <Box className="temp-box">
                        <Typography variant="h7" className="temp-style ">
                          {todayWeatherData?.tempMaxCenti} °C
                        </Typography>
                        <ArrowUpwardIcon
                          className="px-1"
                          sx={{ color: "rgba(92, 100, 96, 1)" }}
                        />
                        <Typography variant="h7" className="temp-style">
                          {todayWeatherData?.tempMinCenti} °C
                        </Typography>
                        <ArrowDownwardIcon
                          className="px-1"
                          sx={{ color: "rgba(92, 100, 96, 1)" }}
                        />
                      </Box>
                      <Box
                        className="temp-box"
                        sx={{ flexGrow: 1, display: "flex" }}
                      >
                        <Typography
                          variant="caption"
                          className="weather-location-style"
                        >
                          {todayWeatherData?.block}
                          {todayWeatherData?.district
                            ? `, ${todayWeatherData.district}`
                            : ""}
                        </Typography>
                      </Box>
                    </Box>
                  </InteractiveElement>
                </Box>
              )}
              <Box
                className="py-2"
                sx={{
                  flexGrow: 0,
                  alignItems: "center",
                  display: {
                    xs: "none",
                    md: "flex",
                    paddingRight: "10px",
                  },
                }}
              >
                {loggedIn && (
                  <InteractiveElement
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget);
                    }}
                  >
                    <Box
                      className="account-name-box"
                      aria-controls="menu-profile"
                      aria-haspopup="true"
                    >
                      <AccountCircleIcon
                        fontSize="large"
                        className="account-icons-style mr-2"
                      />
                      {greetingElement({ md: "flex" })}
                      <ExpandMoreIcon className="ml-2" />
                    </Box>
                  </InteractiveElement>
                )}
                <Menu
                  id="menu-profile"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  {/* {profileRole()} */}
                  {editProfileMenuItem()}
                  {logoutMenuItem()}
                </Menu>
              </Box>
              {!isMobile && !loggedIn && pathnames.length > 0 && (
                <div className="flex items-center py-2 mr-4 sm:mr-0">
                  <Button variant="primary" onClick={() => onDoneCLick()}>
                    {t("Login")}
                  </Button>
                </div>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <ActionConfirmationDialog
        open={open}
        setOpen={setOpen}
        onContinueClick={onLogout}
        actionHeader={"COMMON_LOGOUT"}
        warningText={"COMMON_LOGOUT_WARNING"}
      />
    </div>
  );
}

export default AppAppBar;
