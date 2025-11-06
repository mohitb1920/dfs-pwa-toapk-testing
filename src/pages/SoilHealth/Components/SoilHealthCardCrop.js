import { Box, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomDropdown } from "../../../AppModules/PGR/ComplaintsInbox";
import CustomPagination from "../../../components/CustomPagination";
import { useNavigate } from "react-router-dom";
import SoilHealthCardCard from "./SoilHealthCardCard";
import { useDispatch, useSelector } from "react-redux";
import { soilHealthCardTestGrid } from "../../../Modules/Actions/soilHealthActions";
import PropTypes from "prop-types";

function SoilHealthCardCrop({ isMobile, t }) {
  const [financialYearList, setFinancialYearList] = useState([]);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState("");
  useEffect(() => {
    const generateFinancialYears = (startYear, count) => {
      const years = [];
      for (let i = 0; i < count; i++) {
        const currentYear = startYear - i;
        const nextYear = (currentYear + 1).toString().slice(-2);
        years.push(`${currentYear}-${nextYear}`);
      }
      return years;
    };

    const currentYear = new Date().getFullYear();
    const list = generateFinancialYears(currentYear, 5);
    setFinancialYearList(list);
  }, []);
  useEffect(() => {
    setSelectedFinancialYear(financialYearList[0]);
  }, [financialYearList]);
  const responseData = useSelector((state) => {
    return state.soilHealthReducer.response;
  });

  const handleFilter = (selectedId) => {
    setSelectedFinancialYear(selectedId);
  };
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [dataList, setDataList] = useState([]);
  const [tokenId, setTokenId] = useState(null);
  const handleChangePage = (value) => {
    setPageNumber(value);
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const viewButtonClicked = (data) => {
    dispatch(soilHealthCardTestGrid(data?.["TestGrid"]));
    navigate(`${window.contextPath}/Soil_health/soil-health-details`, {
      state: {
        testGrid: data?.["TestGrid"],
        farmerName: data?.["FarmerName"],
        tokenId: tokenId,
      },
    });
  };
  useEffect(() => {
    if (selectedFinancialYear !== "") {
      setTokenId(responseData?.["tokenId"]);
      setDataList(
        responseData?.["SoilTestAnalysisStatuses"].filter((item) => {
          const itemYear = new Date(item?.["TestDate"])?.getFullYear();
          return (
            !selectedFinancialYear ||
            itemYear.toString() === selectedFinancialYear?.split("-")?.[0]
          );
        })
      );
    }
  }, [selectedFinancialYear, pageNumber]);
  return (
    <Box className="gap-6 flex flex-col my-6">
      <Box className="grm-form-inner-cards-container items-end !p-4">
        <Box className="flex w-fit gap-4  items-center !justify-center">
          <Typography className="!font-medium">
            {t("FinancialYears")}
          </Typography>
          <Box className="min-w-44">
            <CustomDropdown
              id="district-autocomplete"
              options={financialYearList}
              value={selectedFinancialYear}
              defaultValue={financialYearList[0]}
              onChange={(event, newValue) => handleFilter(newValue)}
              renderInput={(params) => (
                <TextField {...params} placeholder={t("COMMON_SELECT")} />
              )}
              size="small"
              openOnFocus
              disableClearable
              isOptionEqualToValue={(option, value) => option === value}
            />
          </Box>
        </Box>
      </Box>
      {dataList?.length === 0 && (
        <Box className="h-80 flex items-center justify-center w-full">
          {t("selectAnotherYear")}
        </Box>
      )}
      {selectedFinancialYear !== "" && (
        <Box
          className={isMobile ? "flex justify-between gap-3" : "schemes-grid"}
        >
          {dataList?.map((item, index) => {
            return (
              <SoilHealthCardCard data={item} onClick={viewButtonClicked} />
            );
          })}
        </Box>
      )}

      <Box className="pagination-container">
        <Typography>{t("schemes.paginationTitle", { count: 10 })}</Typography>
        <CustomPagination
          t={t}
          pageCount={Math.ceil(dataList?.length / 10)}
          page={pageNumber}
          onChange={handleChangePage}
        />
      </Box>
    </Box>
  );
}
SoilHealthCardCrop.propTypes = {
  isMobile: PropTypes.bool,
  t: PropTypes.func,
};
export default SoilHealthCardCrop;
