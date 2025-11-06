import React, { useState } from "react";
import PropTypes from "prop-types";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { styled } from "@mui/material/styles";
import moment from "moment";

const StyledDatePicker = styled(DatePicker)(() => ({
  width: "-webkit-fill-available",
  "& .MuiInputLabel-root": {
    "&.Mui-focused": {
      color: "#49454F",
    },
    top: "-7px",
    color: "#A2ABA6",
  },
  "& .MuiOutlinedInput-root": {
    "& input": {
      padding: "9px 12px !important",
      fontSize: "16px",
    },
    "& fieldset": {
      border: "1px solid #A5A5A5 !important",
      borderRadius: "5px",
    },
    "&:hover fieldset": {
      border: "1px solid #A5A5A5 !important",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#A5A5A5",
      borderWidth: "1px",
    },
  },
}));

const CustomDatePicker = (props) => {
  const { label, customFilters, setCustomFilters, placeholder } = props;
  const [open, setOpen] = useState(false);

  const handleDateChage = (date) => {
    const today = moment();
    const { fromDate, toDate } = customFilters;
    if (date && date.isAfter(today, "day")) {
      delete customFilters[label];
      setCustomFilters({ ...customFilters });
      return;
    }
    if (label === "fromDate") {
      if (toDate && date?.isAfter(toDate, "day")) {
        setCustomFilters({ ...customFilters, [label]: toDate });
      } else {
        setCustomFilters({ ...customFilters, [label]: date });
      }
    }
    if (label === "toDate") {
      if (fromDate && date?.isBefore(fromDate, "day")) {
        setCustomFilters({ ...customFilters, [label]: fromDate });
      } else {
        setCustomFilters({ ...customFilters, [label]: date });
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <StyledDatePicker
        open={open}
        onClose={() => setOpen(false)}
        format="DD-MM-YYYY"
        value={customFilters?.[label] || null}
        onChange={(date) => handleDateChage(date)}
        label={placeholder}
        error={false}
        {...(label === "toDate"
          ? { minDate: customFilters?.["fromDate"] }
          : {})}
        maxDate={
          label === "fromDate"
            ? customFilters?.["toDate"] || moment()
            : moment()
        }
        minDate={
          label === "toDate"
            ? customFilters?.["fromDate"] || moment("2020-01-01")
            : moment("2020-01-01")
        }
        slotProps={{
          field: {
            readOnly: true,
          },
          textField: {
            onClick: () => setOpen(true),
          },
        }}
      />
    </LocalizationProvider>
  );
};

CustomDatePicker.propTypes = {
  onChange: PropTypes.func,
};

export default CustomDatePicker;
