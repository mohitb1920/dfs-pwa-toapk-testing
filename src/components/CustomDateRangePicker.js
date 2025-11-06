import React, { useEffect, useMemo, useRef, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { createStaticRanges, DateRangePicker } from "react-date-range";
import "../styles/CustomDateRangePicker.css";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  addMonths,
  differenceInDays,
  endOfDay,
  endOfToday,
  endOfYear,
  endOfYesterday,
  format,
  startOfMonth,
  startOfQuarter,
  startOfToday,
  startOfWeek,
  startOfYear,
  startOfYesterday,
  subSeconds,
  subYears,
} from "date-fns";
import { getDefaultFinacialYear, getDuration } from "./Utils";
import PropTypes from "prop-types";

function isEndDateFocused(focusNumber) {
  return focusNumber === 1;
}

function isStartDateFocused(focusNumber) {
  return focusNumber === 0;
}

function CustomDateRangePicker(props) {
  const { values, onFilterChange } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [focusedRange, setFocusedRange] = useState([0, 0]);
  const [selectionRange, setSelectionRange] = useState(values);
  const wrapperRef = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    if (!isModalOpen) {
      const startDate = selectionRange?.startDate;
      const endDate = selectionRange?.endDate;
      const interval = getDuration(
        selectionRange?.startDate,
        selectionRange?.endDate
      );
      const title = `${format(
        selectionRange?.startDate,
        "MMM d, yyyy"
      )} - ${format(selectionRange?.endDate, "MMM d, yyyy")}`;
      onFilterChange({
        range: { startDate, endDate, interval, title },
        requestDate: { startDate, endDate, interval, title },
      });
    }
  }, [selectionRange, isModalOpen]);

  const staticRanges = useMemo(() => {
    return createStaticRanges([
      {
        label: t("DSS_TODAY"),
        range: () => ({
          startDate: startOfToday(new Date()),
          endDate: endOfToday(new Date()),
        }),
      },
      {
        label: t("DSS_YESTERDAY"),
        range: () => ({
          startDate: startOfYesterday(new Date()),
          endDate: subSeconds(endOfYesterday(new Date()), 1),
        }),
      },
      {
        label: t("DSS_THIS_WEEK"),
        range: () => ({
          startDate: startOfWeek(new Date()),
          endDate: endOfToday(new Date()),
        }),
      },
      {
        label: t("DSS_THIS_MONTH"),
        range: () => ({
          startDate: startOfMonth(new Date()),
          endDate: endOfToday(new Date()),
        }),
      },
      {
        label: t("DSS_THIS_QUARTER"),
        range: () => ({
          startDate: startOfQuarter(new Date()),
          endDate: subSeconds(endOfToday(new Date()), 1),
        }),
      },
      {
        label: t("DSS_THIS_YEAR"),
        range: () => {
          return {
            startDate: getDefaultFinacialYear().startDate,
            endDate: getDefaultFinacialYear().endDate,
          };
        },
      },
      {
        label: t("DSS_PREVIOUS_YEAR"),
        range: () => {
          if (new Date().getMonth() < 3) {
            return {
              startDate: subYears(addMonths(startOfYear(new Date()), 3), 2),
              endDate: subSeconds(
                subYears(addMonths(endOfYear(new Date()), 3), 2),
                1
              ),
            };
          } else {
            return {
              startDate: subYears(addMonths(startOfYear(new Date()), 3), 1),
              endDate: subSeconds(
                subYears(addMonths(endOfYear(new Date()), 3), 1),
                1
              ),
            };
          }
        },
      },
    ]);
  }, [i18n.language]);

  const handleSelect = (ranges, e) => {
    let { range1: selection } = ranges;
    selection = { ...selection, endDate: endOfDay(selection?.endDate) };
    const { startDate, endDate, title, interval } = selection;
    if (
      staticRanges.some((range) => {
        let newRange = range.range();
        return (
          differenceInDays(newRange.startDate, startDate) === 0 &&
          differenceInDays(newRange.endDate, endDate) === 0
        );
      })
    ) {
      setSelectionRange(selection);
      setIsModalOpen(false);
    } else if (isStartDateFocused(focusedRange[1])) {
      setSelectionRange(selection);
    } else if (isEndDateFocused(focusedRange[1])) {
      setSelectionRange({ title, interval, startDate, endDate: endDate });
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Box className="custom-date-picker-wrap" ref={wrapperRef}>
        <Box
          className={`select ${isModalOpen ? "dss-input-active-border" : ""}`}
        >
          <input
            className={`custom-date-picker-wrap--elipses`}
            type="text"
            value={values?.title ? `${values?.title}` : "Select"}
            readOnly
            onClick={() => setIsModalOpen((prevState) => !prevState)}
          />
          <img
            src={`${window.contextPath}/assets/calender-icon.svg`}
            alt="calender icon"
            onClick={() => setIsModalOpen((prevState) => !prevState)}
          />
        </Box>
        {isModalOpen && (
          <Box
            className="options-card"
            style={{ overflow: "visible", width: "unset", maxWidth: "unset" }}
          >
            <DateRangePicker
              className="pickerShadow"
              focusedRange={focusedRange}
              ranges={[selectionRange]}
              rangeColors={["#669933"]}
              onChange={handleSelect}
              onRangeFocusChange={setFocusedRange}
              retainEndDateOnFirstSelection={true}
              showSelectionPreview={true}
              inputRanges={[]}
              maxDate={new Date()}
              staticRanges={staticRanges}
            />
          </Box>
        )}
      </Box>
    </>
  );
}

CustomDateRangePicker.propTypes = {
  values: PropTypes.object,
  onFilterChange: PropTypes.func,
};

export default CustomDateRangePicker;
