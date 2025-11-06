import {
  Box,
  Checkbox,
  FormControl,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomDatePicker from "../../components/CustomDatePicker";
import { CustomDropdown } from "../../AppModules/PGR/ComplaintsInbox";
import CustomButton from "../../components/Button/CustomButton";
import { ButtonColor } from "../../components/Button/ButtonEnums";
import { useTranslation } from "react-i18next";
import useMandiPriceFilterOptions from "../../Hooks/useMandiPriceFilterOptions";
import { MandiService } from "../../services/MandiService";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { getFromToEpochTimes } from "../../components/Utils";

export const searchFilters = [
  {
    id: "districtOptions",
    label: "COMMON_DISTRICT",
    type: "dropdown",
    key: "district",
  },
  {
    id: "marketOptions",
    label: "MANDI_MARKET",
    type: "dropdown",
    key: "market",
  },
  {
    id: "commodityOptions",
    label: "MANDI_COMMODITY_CROP",
    type: "dropdown",
    key: "commodity",
  },
  { id: "fromDate", label: "MANDI_FROM_DATE", type: "date" },
  {
    id: "toDate",
    label: "MANDI_TO_DATE",
    type: "date",
  },
];

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

function MandiFiltersRenderer(props) {
  const { setSearchParams, setAnchorEl, setOrder, setOrderBy } = props;
  const { t, i18n } = useTranslation();
  const [optionsFilters, setOptionsFilters] = useState({});
  const [marketOptions, setMarketOptions] = useState(null);
  const [marketsLoading, setMarketsLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [dateRangeFilter, setDateRangeFilter] = useState({});
  const [dateError, setDateError] = useState(false);

  const { isLoading: filtersLoading, data: filtersData } =
    useMandiPriceFilterOptions({ locale: i18n.language });

  const handleChange = (value, id) => {
    const updatedFilters = { ...filters };
    if (id === "district") {
      const filter = value === null ? {} : { districtCode: value?.code };
      setOptionsFilters(filter);
      delete updatedFilters["market"];
    }
    if (value) {
      setFilters({
        ...updatedFilters,
        [id]: value,
      });
    } else {
      delete updatedFilters[id];
      setFilters(updatedFilters);
    }
  };

  const handleApplyFilters = () => {
    let params = {};
    if ("district" in filters) params.districtCode = [filters.district.code];
    if ("market" in filters)
      params.marketCenterCode = filters.market.map((item) => item.code);
    if ("commodity" in filters)
      params.commodityCode = filters.commodity.map((item) => item.code);

    const { fromDate, toDate } = dateRangeFilter;

    if ((fromDate && !toDate) || (!fromDate && toDate)) {
      setDateError(true);
      return;
    } else if (fromDate && toDate) {
      const { fromEpochTime, toEpochTime } = getFromToEpochTimes(
        fromDate,
        toDate
      );
      if (fromEpochTime && toEpochTime) {
        params = {
          ...params,
          dateFrom: fromEpochTime,
          dateTo: toEpochTime,
        };
        setDateError(false);
      } else {
        setDateError(true);
        setDateRangeFilter({
          ...(fromEpochTime && { fromDate }),
          ...(toEpochTime && { toDate }),
        });
        return;
      }
    } else {
      setDateError(false);
    }
    setAnchorEl(null);
    setSearchParams({ ...params, locale: i18n.language });
  };

  const resetFiltersAndSort = () => {
    setFilters({});
    setOptionsFilters({});
    setDateRangeFilter({});
    setDateError(false);
    setOrder("ASC");
    setOrderBy("");
    setSearchParams({ locale: i18n.language });
  };

  const getMarketOptions = async () => {
    let criteria = {};
    if (optionsFilters?.districtCode) {
      criteria = { districtCode: [optionsFilters.districtCode] };
    }
    setMarketsLoading(true);
    const response = await MandiService.search({
      requestBody: {
        SearchCriteria: { ...criteria, locale: i18n.language },
        GroupbyCriteria: "MARKET",
      },
      requestParams: {
        tenantId: "br",
      },
    });
    if (response?.Data?.length > 0) {
      setMarketOptions(response.Data);
    }
    setMarketsLoading(false);
  };

  useEffect(() => {
    getMarketOptions();
  }, [optionsFilters, i18n.language]);

  useEffect(() => {
    const updatedFilters = { ...filters };
    if (filters?.district) {
      const selectedOptions = filtersData?.districtOptions?.filter(
        (option) => filters.district?.code === option.code
      );
      updatedFilters.district = selectedOptions?.[0] ?? {};
    }
    if (filters?.market && filters?.market.length > 0) {
      const selectedOptions = marketOptions?.filter((option) =>
        filters.market.some((filter) => filter.code === option.code)
      );
      updatedFilters.market = selectedOptions;
    }
    if (filters?.commodity && filters?.commodity.length > 0) {
      const selectedOptions = filtersData?.commodityOptions?.filter((option) =>
        filters.commodity.some((filter) => filter.code === option.code)
      );
      updatedFilters.commodity = selectedOptions;
    }
    setFilters(updatedFilters);
  }, [filtersData, marketOptions]);

  return (
    <Box>
      {(filtersLoading || marketsLoading) && (
        <Box className="m-auto mb-1" sx={{ width: "97%" }}>
          <LinearProgress color="success" />
        </Box>
      )}
      <Box className="mandi-price-filters-container mobile-drawer">
        <Box className="md:flex justify-between w-full">
          <Box className="mandi-price-filter-box">
            {searchFilters.map((item) => {
              if (item.type === "date")
                return (
                  <Box
                    className="mandi-price-filter-item sm:max-w-[190px]"
                    key={item.id}
                  >
                    <Typography variant="h7" className="mandi-filter-label">
                      {t(item.label)}
                    </Typography>
                    <CustomDatePicker
                      customFilters={dateRangeFilter}
                      setCustomFilters={setDateRangeFilter}
                      label={item.id}
                    />
                    {dateError && !dateRangeFilter?.[item.id] && (
                      <Typography variant="caption" color={"#d32f2f"}>
                        {t("MANDI_DATE_FILTER_ERROR")}
                      </Typography>
                    )}
                  </Box>
                );
              else if (item.type === "dropdown") {
                return (
                  <Box className="mandi-price-filter-item" key={item.id}>
                    <FormControl sx={{ minWidth: "180px", width: "100%" }}>
                      <Typography variant="h7" className="mandi-filter-label">
                        {t(item.label)}
                      </Typography>
                      <CustomDropdown
                        id="support-issue-category"
                        options={
                          (item.id === "marketOptions"
                            ? marketOptions
                            : filtersData?.[item.id]) ?? []
                        }
                        getOptionLabel={(option) => t(option.name)}
                        size="small"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("COMMON_SELECT")}
                          />
                        )}
                        onChange={(event, newValue) =>
                          handleChange(newValue, item.key)
                        }
                        value={filters?.[item.key] ?? []}
                        multiple={item.key !== "district"}
                        disableCloseOnSelect={item.key !== "district"}
                        {...(item.key !== "district" && {
                          renderOption: (props, option, { selected }) => {
                            const { key, ...optionProps } = props;
                            return (
                              <li key={key} {...optionProps}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  style={{
                                    marginRight: 0,
                                    marginLeft: 0,
                                    paddingLeft: 0,
                                  }}
                                  checked={selected}
                                  color="success"
                                />
                                {t(option.name)}
                              </li>
                            );
                          },
                        })}
                        openOnFocus
                      />
                    </FormControl>
                  </Box>
                );
              }
              return <></>;
            })}
          </Box>
          <Box className="flex mt-6 justify-end">
            <CustomButton
              color={ButtonColor.SECONDARY}
              onClick={resetFiltersAndSort}
              sx={{ marginRight: "5px" }}
            >
              {t("COMMON_RESET")}
            </CustomButton>
            <CustomButton onClick={handleApplyFilters}>
              {t("COMMON_SEARCH")}
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default MandiFiltersRenderer;
