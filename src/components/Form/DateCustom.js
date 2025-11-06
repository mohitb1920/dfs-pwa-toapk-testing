import React, { useState, useRef, useEffect } from "react";
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./DateCustom.css";
import { Box, IconButton, InputAdornment, useTheme } from "@mui/material";
import { CssTextField } from "./CustomWidget";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useTranslation } from "react-i18next";

export default function DateCustom({
  value,
  onChange,
  disabled,
  error,
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear())), // Default maxDate to one year in the past
  minDate = new Date(1900, 0, 1),
  className = "",
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef(null);
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";

  function handleChange(newDate) {
    if (disabled) return;
    setIsOpen(false);

    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    onChange(formattedDate);
  }

  function toggleCalendar() {
    if (disabled) return;
    setIsOpen(!isOpen);
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  }

  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);

  return (
    <Box className="date-picker-container">
      <CssTextField
        type="text"
        value={formatDate(value)}
        onClick={toggleCalendar}
        readOnly
        placeholder={t("SELECT_Date")}
        className={`${"date-input"} ${className}`}
        disabled={disabled}
        darkTheme={isDarkTheme}
        error={error}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" style={{ zIndex: 2 }}>
              <IconButton>
                <CalendarMonthIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {isOpen && (
        <div
          ref={calendarRef}
          className={`calendar-dropdown ${isOpen ? "open" : ""}`}
        >
          <Calendar
            date={value ? new Date(value) : maxDate} // Open the calendar at maxDate if no value is set
            onChange={handleChange}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
      )}
    </Box>
  );
}
