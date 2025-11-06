import { createContext } from "react";
import { createTheme } from "@mui/material/styles";

const generateTheme = (fontSize, mode) => {
  return createTheme({
    palette: {
      mode,

      ...(mode === "light"
        ? {
            button: {
              primaryBackground: "rgba(247, 213, 8, 1)",
              primaryColor: "rgba(28, 33, 30, 1)",
              primaryHoverBackground: "rgba(133, 188, 49, 1)",
              secondaryBackground: "rgba(255, 255, 255, 1)",
              secondaryColor: "rgba(92, 100, 96, 1)",
              secondaryHoverBackground: "rgba(133, 188, 49, 0.3)",
              secondaryHoverColor: "rgba(28, 33, 30, 1)",
              disabledBackground: "rgba(162, 171, 166, 1)",
              disabledColor: "rgba(255, 255, 255, 1)",
            },
            background: {
              default: "#ffffff",
              contactCardGradient:
                "linear-gradient(270deg, #FFFFFF 0%, rgba(219, 239, 188, 0.8) 100%)",
              primaryGreen: "rgba(26, 92, 75, 1)",
              tertiaryGreen: "rgba(240, 245, 242, 1)",
              white: "#fff",
              tertiaryWhite: "#fff",
            },
            icon: {
              faqIcon: "rgba(240, 245, 242, 1)",
            },
            text: {
              primary: "rgba(28, 33, 30, 1)",
              white: "#ffffff",
              secondary: "rgba(26, 92, 75, 1)",
              textGrey: "rgba(92, 100, 96, 1)",
              textGreen: "rgba(26, 92, 75, 1)",
              yellow: "rgba(247, 213, 8, 1)",
              greyGreen: "rgba(240, 245, 242, 1)",
              darkGreyGreen: "rgba(61, 69, 65, 1)",
              newsDate: "rgba(121, 130, 125, 1)",
              error: "rgba(226, 41, 42, 1)",
              success: "rgba(133, 188, 49, 1)",
              warning: "rgba(238, 116, 30, 1)",
            },
          }
        : {
            button: {
              primaryBackground: "rgba(133, 188, 49, 1)",
              primaryColor: "rgba(26, 29, 33, 1)",
              primaryHoverBackground: "rgba(247, 213, 8, 1)",
              secondaryBackground: "rgba(28, 33, 30, 1)",
              secondaryColor: "rgba(133, 188, 49, 1)",
              secondaryHoverBackground: "rgba(255, 255, 255, 1)",
              secondaryHoverColor: "rgba(28, 33, 30, 1)",
              disabledBackground: "rgba(162, 171, 166, 1)",
              disabledColor: "rgba(255, 255, 255, 1)",
            },
            background: {
              default: "rgba(26, 29, 33, 1)",
              primaryGreen: "rgba(133, 188, 49, 1)",
              tertiaryGreen: "rgba(34, 37, 41, 1)",
              white: "#1a1d21",
              tertiaryWhite: "rgba(34, 37, 41, 1)",
            },
            icon: {
              faqIcon: "rgba(133, 188, 49, 1)",
            },
            text: {
              primary: "#ffffff",
              white: "#000000",
              secondary: "rgba(255, 255, 255, 1)",
              textGrey: "rgba(255, 255, 255, 1)",
              textGreen: "rgba(133, 188, 49, 1)",
              yellow: "rgba(133, 188, 49, 1)",
              greyGreen: "rgba(133, 188, 49, 1)",
              darkGreyGreen: "rgba(133, 188, 49, 1)",
              newsDate: "rgba(133, 188, 49, 1)",
              disabled: "rgba(255, 255, 255, 1)",
              error: "rgba(226, 41, 42, 1)",
              success: "rgba(133, 188, 49, 1)",
              warning: "rgba(238, 116, 30, 1)",
            },
          }),
    },

    typography: {
      // Global default font settings
      fontFamily: "Inter, sans-serif",
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
      fontWeightBold: 700,

      // Customizing header variants
      h0: {
        fontSize: "5rem",
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: "0.015em",
      },
      h1: {
        fontSize: "3rem",
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: "0.015em",
      },
      h2: {
        fontSize: "2.5rem",
        fontWeight: 700,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: "2rem",
        fontWeight: 500,
      },
      h4: {
        fontSize: "1.75rem",
        fontWeight: 500,
      },
      h5: {
        fontSize: "1.5rem",
        fontWeight: 400,
      },
      h6: {
        fontSize: "1.25rem",
        fontWeight: 400,
      },

      // Customizing subtitle variants
      subtitle1: {
        fontSize: "1.125rem",
        fontWeight: 400,
      },
      subtitle2: {
        fontSize: "1rem",
        fontWeight: 500,
      },

      // Customizing body variants
      body1: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.5,
      },
      body2: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.43,
      },

      // Customizing button text
      button: {
        textTransform: "uppercase",
        fontWeight: 500,
      },

      // Customizing caption text
      caption: {
        fontSize: "0.75rem",
        fontWeight: 400,
        lineHeight: 1.66,
      },
      h7: {
        fontSize: ".875rem",
        fontWeight: 400,
      },
      // Customizing overline text
      overline: {
        fontSize: "0.75rem",
        fontWeight: 400,
        textTransform: "uppercase",
        lineHeight: 2.66,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            fontSize: "1rem",
            fontWeight: "600 !important",
            textTransform: "none",
            "&.MuiButton-sizeSmall": {
              borderRadius: "4px",
              fontSize: "1rem",
              padding: "0.2rem 1rem",
            },
            "&.MuiButton-sizeMedium": {
              borderRadius: "6px",
              fontSize: "1rem",
              padding: "0.5rem 1rem",
            },
            "&.MuiButton-sizeLarge": {
              borderRadius: "8px",
              fontSize: "1rem",
              padding: "0.5rem 1rem",
            },
          },
        },
        variants: [
          {
            props: { variant: "primary" },
            style: ({ theme }) => ({
              fontWeight: 600,
              fontSize: "1rem",
              backgroundColor: theme.palette.button.primaryBackground,
              color: theme.palette.button.primaryColor,
              "&:hover": {
                backgroundColor: theme.palette.button.primaryHoverBackground,
              },
              "&.Mui-disabled": {
                backgroundColor: theme.palette.button.disabledBackground,
                color: theme.palette.button.disabledColor,
              },
            }),
          },
          {
            props: { variant: "secondary" },
            style: ({ theme }) => ({
              backgroundColor: theme.palette.button.secondaryBackground,
              border: `1px solid ${theme.palette.button.secondaryColor}`,
              color: theme.palette.button.secondaryColor,
              "&:hover": {
                backgroundColor: theme.palette.button.secondaryHoverBackground,
                color: theme.palette.button.secondaryHoverColor,
                border: `1px solid ${theme.palette.button.secondaryHoverBackground}`,
              },
              "&.Mui-disabled": {
                backgroundColor: theme.palette.button.disabledBackground,
                color: theme.palette.button.disabledColor,
              },
            }),
          },

          {
            props: { variant: "tertiary" },
            style: ({ theme }) => ({
              border: `none`,
              color: "rgba(92, 100, 96, 1)",
              borderRadius: "0 !important",
              "&.Mui-disabled": {
                backgroundColor: theme.palette.button.disabledBackground,
                color: theme.palette.button.disabledColor,
              },
            }),
          },
          {
            props: { variant: "textButtonBlack" },
            style: ({ theme }) => ({
              border: `none`,
              color: theme.palette.button.secondaryColor,
              borderRadius: "0 !important",
              "&.Mui-disabled": {
                color: theme.palette.button.disabledBackground,
              },
            }),
          },
          {
            props: { variant: "textButton" },
            style: ({ theme }) => ({
              border: `none`,
              color: theme.palette.button.primary,
              borderRadius: "0 !important",
              "&.Mui-disabled": {
                // backgroundColor: theme.palette.button.disabledBackground,
                color: theme.palette.button.disabledColor,
              },
            }),
          },
        ],
      },
      MuiMenu: {
        styleOverrides: {
          paper: ({ theme }) => ({
            backgroundColor: theme.palette.background.tertiaryGreen,
          }),
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            textTransform: "none",
            "&.MuiButton-sizeSmall": {
              borderRadius: "4px",
            },
            "&.MuiButton-sizeMedium": {
              borderRadius: "6px",
            },
            "&.MuiButton-sizeLarge": {
              borderRadius: "8px",
            },
          },
        },
        variants: [
          {
            props: { variant: "primary" },
            style: ({ theme }) => ({
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(26, 29, 33, 1) !important"
                  : "none",
              width: "100%",
              maxWidth: "100% !important",

              // backgroundImage:
              //   theme.palette.mode === "dark"
              //     ? "rgba(26, 29, 33, 1)"
              //     : "linear-gradient(270deg, #FFFFFF 0%, rgba(219, 239, 188, 0.8) 100%)",
              // boxShadow: theme.shadows[2],
              borderRadius: 0,
              color: theme.palette.text.primary,
              padding: "0px !important",
            }),
          },
          {
            props: { variant: "white" },
            style: ({ theme }) => ({
              backgroundColor: theme.palette.background.white,
              width: "100%",
              maxWidth: "100% !important",
              borderRadius: 0,
              color: theme.palette.text.primary,
              padding: "0px !important",
            }),
          },
          {
            props: { variant: "tertiaryWhite" },
            style: ({ theme }) => ({
              backgroundColor: theme.palette.background.tertiaryWhite,
              width: "100%",
              maxWidth: "100% !important",
              borderRadius: 0,
              color: theme.palette.text.primary,
              padding: "0px !important",
            }),
          },
          {
            props: { variant: "primaryGreen" },
            style: ({ theme }) => ({
              backgroundColor: theme.palette.background.primaryGreen,
              width: "100%",
              maxWidth: "none !important",
              borderRadius: 0,
              color: theme.palette.text.white,
              padding: "0px",
            }),
          },
          {
            props: { variant: "tertiaryGreen" },
            style: ({ theme }) => ({
              backgroundColor: theme.palette.background.tertiaryGreen,
              width: "100%",
              maxWidth: "none !important",
              borderRadius: 0,
              color: theme.palette.text.primary,
              padding: "0px",
            }),
          },
          {
            props: { variant: "gradient" },
            style: ({ theme }) => ({
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(26, 29, 33, 1) !important"
                  : "none",
              width: "100%",
              maxWidth: "100% !important",

              background:
                theme.palette.mode === "dark"
                  ? "rgba(26, 29, 33, 1)"
                  : "linear-gradient(90deg,rgba(115, 232, 148, 0.3) 0%,rgba(26, 92, 75, 0.2) 100%),#18342d",
              // boxShadow: theme.shadows[2],
              borderRadius: 0,
              color: theme.palette.text.primary,
              padding: "0px !important",
            }),
          },
        ],
      },
      MuiCard: {
        variants: [
          {
            props: { variant: "customCard" },
            style: ({ theme }) => ({
              backgroundColor:
                theme.palette.mode === "dark" ? "transparent" : "transparent",
              backgroundImage:
                theme.palette.mode === "dark"
                  ? "none"
                  : "linear-gradient(270deg, #FFFFFF 0%, rgba(219, 239, 188, 0.8) 100%)",
              // boxShadow: theme.shadows[2],
              borderRadius: "8px",
              border:
                theme.palette.mode === "dark" ? `1px solid white` : "none",
              padding: theme.spacing(2),
              color: theme.palette.text.primary,
            }),
          },
          {
            props: { variant: "opacityCard" },
            style: ({ theme }) => ({
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(34, 37, 41, 1)"
                  : "rgba(255, 255, 255, 0.15)",
              // backgroundImage:
              //   theme.palette.mode === "dark"
              //     ? "none"
              //     : "linear-gradient(270deg, #FFFFFF 0%, rgba(219, 239, 188, 0.8) 100%)",
              // boxShadow: theme.shadows[2],
              borderRadius: "8px",

              padding: theme.spacing(2),
              color: "#fff",
            }),
          },
          {
            props: { variant: "white" },
            style: ({ theme }) => ({
              backgroundColor: "white",

              borderRadius: "8px",
              padding: theme.spacing(2),
              color: "black",
            }),
          },
        ],
      },
      MuiAccordion: {
        styleOverrides: {
          root: {
            margin: 0,
            "&.Mui-expanded": {
              margin: 0,
            },
          },
        },
      },
      MuiTypography: {
        variants: [
          {
            props: { variant: "primary" },
            style: ({ theme }) => ({
              color: theme.palette.text.primary,
            }),
          },
          {
            props: { variant: "error" },
            style: ({ theme }) => ({
              color: theme.palette.text.error,
            }),
          },
          {
            props: { variant: "primary-green" },
            style: ({ theme }) => ({
              color: theme.palette.text.textGreen,
            }),
          },
        ],
      },
      MuiTextField: {
        styleOverrides: {
          root: ({ theme }) => ({
            "& input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill":
              {
                "-webkit-box-shadow": "none", // Removes any autofill background changes
                "-webkit-text-fill-color": theme.palette.text.primary, // Keep text color adjustment
                color: theme.palette.text.primary,
                transition:
                  "background-color 5000s ease-in-out 0s, color 5000s ease-in-out 0s",
              },
            "& .MuiOutlinedInput-root": {
              minHeight: "40px",
              "&::before": {
                content: '""',
                // position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "transparent",
                borderRadius: "8px",
                zIndex: 0,
              },
              "&.Mui-disabled ::before": {
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              },
              "& fieldset": {
                borderColor: theme.palette.grey[400],
                borderRadius: "8px",
              },
              "&:hover fieldset": {
                borderColor:
                  theme.palette.mode === "dark" ? "#85BC31" : "#2f6a31",
              },
              "&.Mui-focused fieldset": {
                borderColor:
                  theme.palette.mode === "dark" ? "#85BC31" : "#2f6a31",
              },
              "&.Mui-error fieldset": {
                borderColor: "#F13005 !important",
              },
              "&.Mui-disabled input": {
                cursor: "not-allowed",
                color: "rgba(0, 0, 0, 0.6)",
              },
              "&.Mui-disabled": {
                color: theme.palette.text.disabled,
                "-webkit-text-fill-color": theme.palette.text.disabled,
                cursor: "not-allowed",
                "& fieldset": {
                  borderColor: theme.palette.action.disabled,
                },
              },
            },
          }),
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: ({ theme }) => ({
            minHeight: "auto", // Remove default min-height if needed
          }),
          indicator: ({ theme }) => ({
            backgroundColor: theme.palette.text.textGreen,
            width: "auto",
            height: "3px",
          }),
        },
      },
      MuiTab: {
        styleOverrides: {
          root: ({ theme }) => ({
            textTransform: "none", // Use your typography setting
            fontWeight: theme.typography.fontWeightMedium,
            minWidth: 0,
            padding: theme.spacing(1, 2),
            // Ensure tabs have a smooth transition when selected
            transition: "color 0.3s ease-in-out",
            "&.Mui-selected": {
              color: theme.palette.text.textGreen,
              fontWeight: theme.typography.fontWeightBold,
            },
            // Adjust focus styles if needed
            "&:focus": {
              color: theme.palette.button.primaryHoverBackground,
            },
          }),
        },
      },
    },
  });
};

export default generateTheme;

export const ThemeContext = createContext();
