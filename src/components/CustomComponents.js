import { styled, TextField } from "@mui/material";

export const CustomTextField = styled(TextField)(({ isDarkTheme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "5px",
    fontSize: "14px",
    "& fieldset": {
      borderColor: "#E0E3E7",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#A5A5A5",
      borderWidth: "1px",
    },
    "&.Mui-error fieldset": {
      borderColor: isDarkTheme ? "#F8CACA" : "#d32f2f",
      borderWidth: "1px",
    },
    "&.Mui-disabled input": {
      "-webkit-text-fill-color": isDarkTheme ? "#fff" : "#595959",
    },
    "&.Mui-disabled textarea": {
      "-webkit-text-fill-color": isDarkTheme ? "#fff" : "#595959",
    },
  },
  "& .MuiFormHelperText-root": {
    "&.Mui-error": {
      color: isDarkTheme ? "#F8CACA" : "#d32f2f",
    },
  },
}));
