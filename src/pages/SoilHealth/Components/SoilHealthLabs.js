import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomDropdown } from "../../../AppModules/PGR/ComplaintsInbox";
import { useSoilHealthLabsData } from "../../../Hooks/useSoilHealthData";
import useDistrict from "../../../Hooks/useDistrict";
import { capitalizeFirstLetter } from "../../../components/Utils";
import CustomPagination from "../../../components/CustomPagination";
import SoilDetailCard from "./SoilDetailCard";
import PropTypes from "prop-types";

function SoilHealthLabs({ t, location, language }) {
  const [labsDataPaginated, setLabsDataPaginated] = useState([]);
  const [pageNumberLabs, setPageNumberLabs] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [districtValues, setDistrictValues] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  //fetch labs data
  let { data: labsData, isLoading: isLabsLoading } = useSoilHealthLabsData({
    language,
  });
  //fetch district list
  const {
    data: districtData,
    isLoading: isDistrictLoading,
    isError: isDistrictError,
  } = useDistrict("br");
  useEffect(() => {
    if (labsDataPaginated?.length > 0) {
      setPageCount(Math.ceil(labsDataPaginated?.length / 10));
    }
  }, [labsDataPaginated, selectedDistrict]);
  //filter and get data according to page number
  useEffect(() => {
    setPageNumberLabs(1);
    if (labsData?.length > 0) {
      setLabsDataPaginated(
        labsData.filter((lab) => {
          if (selectedDistrict === null || selectedDistrict === "") return true;
          return lab.districtLgCode == selectedDistrict?.id;
        })
      );
    }
  }, [labsData, pageCount, selectedDistrict]);
  //set district dropdown values
  useEffect(() => {
    if (!isDistrictLoading && !isDistrictError && districtData) {
      const formattedDistricts = districtData.map((district) => ({
        id: district.code,
        name: district.name,
      }));
      setDistrictValues(formattedDistricts);
    }
  }, [isDistrictLoading, isDistrictError, districtData]);
  const handleFilter = (selectedId) => {
    setSelectedDistrict(selectedId);
  };
  const handleChangePage = (value) => {
    setPageNumberLabs(value);
  };
  return (
    <Box>
      {isLabsLoading && (
        <Box className="flex justify-center items-center h-[300px]">
          <CircularProgress></CircularProgress>
        </Box>
      )}
      {!isLabsLoading && (
        <Box>
          <Box className="grm-form-inner-cards-container items-end !p-4">
            <Box className="flex w-fit gap-4  items-center !justify-center">
              <Typography className="!font-medium">
                {t("filterByDistrict")}
              </Typography>
              <Box className="min-w-44">
                <CustomDropdown
                  //   className="w-48"
                  id="district-autocomplete"
                  options={districtValues}
                  getOptionLabel={(option) =>
                    capitalizeFirstLetter(option.name || "")
                  }
                  value={selectedDistrict}
                  onChange={(event, newValue) => handleFilter(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} placeholder={t("COMMON_SELECT")} />
                  )}
                  size="small"
                  openOnFocus
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.id
                  }
                />
              </Box>
            </Box>
          </Box>
          {labsDataPaginated.length === 0 && (
            <Box>
              <div className="no-Data">{t("MANDI_NO_MARKET_DATA")}</div>{" "}
            </Box>
          )}
          <Box className="gap-4 py-4 w=full">
            {labsDataPaginated
              .slice((pageNumberLabs - 1) * 10, pageNumberLabs * 10)
              .map((lab, index) => (
                <SoilDetailCard
                  data={lab}
                  t={t}
                  latitude={location?.latitude}
                  longitude={location?.longitude}
                />
              ))}
          </Box>
          <Box className="pagination-container">
            <Typography>
              {t("schemes.paginationTitle", { count: 10 })}
            </Typography>
            <CustomPagination
              t={t}
              pageCount={pageCount}
              page={pageNumberLabs}
              onChange={handleChangePage}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
SoilHealthLabs.propTypes = {
  location: PropTypes.any,
  language: PropTypes.string,
  t: PropTypes.func,
};
export default SoilHealthLabs;
