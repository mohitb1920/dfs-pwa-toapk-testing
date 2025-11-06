import React, { useContext, useEffect, useState } from "react";
import CustomDateRangePicker from "../../components/CustomDateRangePicker";
import FilterContext from "./FilterContext";
import MultiSelectDropdown from "../../components/MultiSelectDropdown";
import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import CustomButton from "../../components/Button/CustomButton";
import { ButtonColor } from "../../components/Button/ButtonEnums";
import { getDefaultFinacialYear, getDuration } from "../../components/Utils";
import { format } from "date-fns";

function Filters(props) {
  const {
    showDateRange = true,
    t,
    showDistrictDropdown = true,
    tenantDistricts,
    setAnchorEl,
  } = props;
  const { value, setValue } = useContext(FilterContext);
  const [selectedDistricts, setSelectedDistricts] = useState(() =>
    tenantDistricts?.filter((dist) =>
      value?.filters?.district?.find(
        (selectedDistrict) => selectedDistrict === dist?.code
      )
    )
  );
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  const handleDateChange = (data) => {
    setSelectedDateRange(data);
  };

  const selectDistrict = (e, data) => {
    const districtSelected = tenantDistricts?.filter((ulb) => {
      return !!e.find((dist) => {
        return ulb?.code === dist?.code;
      });
    });
    setSelectedDistricts(districtSelected);
  };

  const handleSearch = () => {
    let newValue = { ...value };
    if (selectedDistricts?.length > 0) {
      newValue = {
        ...value,
        filters: {
          ...value.filters,
          district: selectedDistricts.map((allPropsData) => allPropsData?.code),
        },
      };
    }
    if (selectedDateRange !== null) {
      newValue = {
        ...newValue,
        ...selectedDateRange,
      };
    }
    setValue(newValue);
    setAnchorEl(null);
  };

  const handleReset = () => {
    const startDate = getDefaultFinacialYear().startDate;
    const endDate = getDefaultFinacialYear().endDate;
    const title = `${format(startDate, "MMM d, yyyy")} - ${format(
      endDate,
      "MMM d, yyyy"
    )}`;
    const interval = getDuration(startDate, endDate);
    setSelectedDistricts([]);
    setSelectedDateRange(null);
    setValue({
      ...value,
      range: { startDate, endDate, title, interval },
      requestDate: {
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        interval: interval,
        title: title,
      },
      filters: { ...value?.filters, district: [] },
    });
  };

  useEffect(() => {
    setSelectedDistricts(
      tenantDistricts?.filter((dist) =>
        value?.filters?.district?.find(
          (selectedDistrict) => selectedDistrict === dist?.code
        )
      )
    );
  }, [value?.filters?.district]);

  return (
    <Box className="sm:flex justify-between">
      <Box className="flex gap-2 max-sm:flex-col">
        {showDateRange && (
          <Box className="filters-input max-sm:w-full">
            <Typography variant="body2" className="!font-semibold !mb-2">
              {t("ES_DSS_DATE_RANGE")}
            </Typography>
            <CustomDateRangePicker
              onFilterChange={handleDateChange}
              values={selectedDateRange?.range ?? value?.range}
            />
          </Box>
        )}
        {showDistrictDropdown && (
          <Box className="filters-input sm:w-52">
            <MultiSelectDropdown
              dropdownOptions={tenantDistricts}
              selected={selectedDistricts}
              handleChange={selectDistrict}
              displayLabel={"ES_DSS_DISTRICT"}
              hideChips={true}
            />
          </Box>
        )}
      </Box>
      <Box className="flex mt-6 justify-end">
        <CustomButton
          color={ButtonColor.SECONDARY}
          onClick={handleReset}
          sx={{ marginRight: "5px" }}
        >
          {t("COMMON_RESET")}
        </CustomButton>
        <CustomButton onClick={handleSearch}>{t("COMMON_SEARCH")}</CustomButton>
      </Box>
    </Box>
  );
}

Filters.propTypes = {
  showDateRange: PropTypes.bool,
  t: PropTypes.func,
  tenantDistricts: PropTypes.array,
  showDistrictDropdown: PropTypes.bool,
};

export default Filters;
