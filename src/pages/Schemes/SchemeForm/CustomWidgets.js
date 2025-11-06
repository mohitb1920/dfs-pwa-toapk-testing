import {
  FormControl,
  InputBase,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import "../../../styles/CustomWidgets.css";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import moment from "moment";

const CssTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& input": {
      padding: "11px 14px !important",
    },
    "& fieldset": {
      border: "1px solid rgba(76, 175, 80, 1)",
      borderRadius: "10px",
    },
    "&:hover fieldset": {
      borderColor: "#2f6a31",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2f6a31",
    },
  },
});

export const CustomTextbox = function (props) {
  const { schema, rawErrors, required } = props;

  let error = false;
  if (rawErrors && rawErrors?.length !== 0) {
    error = true;
  }

  return (
    <>
      <Typography
        className={error ? "required-field input-label" : "input-label"}
      >
        {schema.title}
        {required && <span className="required-field">&nbsp;*</span>}
      </Typography>
      <CssTextField
        id="outlined-basic"
        variant="outlined"
        error={error}
        value={props.value}
        required={props.required}
        onChange={(event) => props.onChange(event.target.value)}
      />
    </>
  );
};

const StyledDatePicker = styled(DatePicker)(({ theme, error }) => ({
  "& .MuiOutlinedInput-root": {
    "& input": {
      padding: "11px 14px !important",
    },
    "& fieldset": {
      border: "1px solid rgba(76, 175, 80, 1) !important",
      borderRadius: "10px",
    },
    "&:hover fieldset": {
      borderColor: "#2f6a31",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2f6a31",
    },
    ...(error && {
      "&.Mui-error fieldset": {
        borderColor: "#d32f2f !important",
      },
    }),
  },
}));

export const CustomDatePicker = (props) => {
  const { schema, required, rawErrors, value } = props;
  const handleDateChage = (date) => {
    const dateString = moment(date).format("YYYY-MM-DD");
    const parsedDate = moment(dateString, "YYYY-MM-DD").toDate();

    props.onChange(dateString);
  };
  let error = false;
  if (rawErrors && rawErrors?.length !== 0) {
    error = true;
  }

  return (
    <>
      <Typography
        className={error ? "required-field input-label" : "input-label"}
      >
        {schema.title}
        {required && <span className="required-field">&nbsp;*</span>}
      </Typography>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <StyledDatePicker
          format="DD MMMM, YYYY"
          value={moment(value, "YYYY-MM-DD")}
          onChange={(date) => handleDateChage(date)}
          error={error}
        />
      </LocalizationProvider>
    </>
  );
};

export const StyledDropdown = styled(InputBase)(({ theme, error }) => ({
  "& .MuiInputBase-input": {
    borderRadius: 10,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid rgba(76, 175, 80, 1)",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderRadius: 10,
      borderColor: "#2f6a31",
    },
    ...(error && {
      borderColor: "#d32f2f !important",
    }),
  },
}));

export const CustomSelect = (props) => {
  const { schema, required, rawErrors, value } = props;
  const [age, setAge] = useState("");
  const handleChange = (event) => {
    setAge(event.target.value);
    props.onChange(event.target.value);
  };
  let error = false;
  if (rawErrors && rawErrors?.length !== 0) {
    error = true;
  }
  return (
    <div>
      <Typography
        className={error ? "required-field input-label" : "input-label"}
      >
        {" "}
        {schema.title}
        {required && <span className="required-field">&nbsp;*</span>}
      </Typography>
      <FormControl sx={{ width: "100%" }} variant="standard" error={error}>
        <Select
          id="demo-customized-select"
          value={value}
          onChange={handleChange}
          input={<StyledDropdown error={error} />}
        >
          {schema.enum.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
