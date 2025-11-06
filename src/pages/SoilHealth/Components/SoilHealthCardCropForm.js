import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { CustomDropdown } from "../../../AppModules/PGR/ComplaintsInbox";
import {
  useCropListData,
  useFertilizerListData,
  useYieldListData,
} from "../../../Hooks/useSoilHealthData";
import {
  capitalizeFirstLetter,
  dispatchNotification,
  TENANT_ID,
} from "../../../components/Utils";
import { useDispatch, useSelector } from "react-redux";
import { SoilHealthService } from "../../../services/SoilHealthService";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
const areaUnitList = [
  { hi: "एकड़", en: "Acre", id: 1 },
  { hi: "कट्ठा", en: "Hectare", id: 2 },
  { hi: "हेक्टेयर", en: "Katha", id: 3 },
];
function SoilHealthCardCropForm({
  t,
  isMobile,
  language,
  setSelectedSoilCard,
  testGrid,
  setDownloadUrl,
  setDownloadCardCriteria,
  downloadCardCriteria,
  tokenId,
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [submitClicked, setSubmitClicked] = useState(false);
  //fetch crop List
  let { data: cropList, isLoading: isCropListLoading } = useCropListData({});
  let { data: yieldList, isLoading: isYieldListLoading } = useYieldListData({
    language,
  });
  let { data: nitrogenList, isLoading: isNitrogenListLoading } =
    useFertilizerListData({ fertilizer: "nitrogen" });
  let { data: phosphateList, isLoading: isPhosphateListLoading } =
    useFertilizerListData({ fertilizer: "phosphate" });
  let { data: potashList, isLoading: isPotashListLoading } =
    useFertilizerListData({ fertilizer: "potash" });
  const [selectedArea, setSelectedArea] = useState();
  const [selectedAreaUnit, setSelectedAreaUnit] = useState();
  const [selectedNitrogen, setSelectedNitrogen] = useState();
  const [selectedPhosphate, setSelectedPhosphate] = useState();
  const [selectedPotash, setSelectedPotash] = useState();
  const [selectedCrop, setSelectedCrop] = useState({
    crop1: null,
    crop2: null,
    crop3: null,
    crop4: null,
  });
  const [yieldLists, setYieldLists] = useState({
    yieldList1: [],
    yieldList2: [],
    yieldList3: [],
    yieldList4: [],
  });

  const [selectedYield, setSelectedYield] = useState({
    yield1: null,
    yield2: null,
    yield3: null,
    yield4: null,
  });
  const [cropError, setCropErrop] = useState(false);
  const [npkError, setNpkError] = useState(false);
  const [areaError, setAreaError] = useState(false);
  const [buttonLoader, setButtonLoader] = useState(false);

  const validateCropSelection = () => {
    const cropValues = Object.values(selectedCrop);
    const yieldValues = Object.values(selectedYield);

    for (let i = 0; i < cropValues?.length; i++) {
      if (cropValues[i] && yieldValues[i]) {
        return true;
      }
    }

    return false;
  };
  const validateNpkSelection = () => {
    const isNpkValid =
      !!selectedNitrogen && !!selectedPhosphate && !!selectedPotash;

    return isNpkValid;
  };
  const dbtIdData = useSelector((state) => {
    return state.soilHealthReducer.dbtID;
  });
  const responseData = useSelector((state) => {
    return state.soilHealthReducer.response;
  });
  const dispatch = useDispatch();
  // Function to fetch yield list for a given crop
  const fetchYieldList = async (cropName, index) => {
    const categoryType = "SOIL_CARD_TARGET_YIELD";
    try {
      setYieldLists((prevLists) => ({
        ...prevLists,
        [`yieldList${index + 1}`]: [],
      }));
      setSelectedYield((prevLists) => ({
        ...prevLists,
        [`yield${index + 1}`]: null,
      }));
      const response = await SoilHealthService.makeYieldListCall({
        dbtId: dbtIdData,
        categoryType,
        tokenId,
        testGrid,
        cropName,
      });
      if (response.status === 200) {
        const { TargetYield } = response.data?.proxyResponse || {};
        const yieldList = [];
        TargetYield?.forEach((item) => {
          if (item.Success === "true") {
            const min = parseInt(item.MinTargetYield || "0");
            const max = parseInt(item.MaxTargetYield || "0");
            const increment = parseInt(item.IncrementValue || "10");
            const values = [];

            if (increment === 0) {
              values.push(`${min} q/ha`);
            } else {
              for (let i = min; i <= max; i += increment) {
                values.push(`${i} q/ha`);
              }
            }
            yieldList.push(...values);
          }
        });
        setYieldLists((prevLists) => ({
          ...prevLists,
          [`yieldList${index + 1}`]: yieldList,
        }));
      } else {
        dispatchNotification("error", ["SessionTimeout"], dispatch);
        navigate(`${window.contextPath}/farmer-details`);
      }
    } catch (error) {
      dispatchNotification("error", ["NETWORK_ERROR"], dispatch);
    }
  };
  //change crop and fetch yield
  const handleCropChange = (event, newValue, index, name) => {
    setSelectedCrop((prevValue) => ({
      ...prevValue,
      [name]: newValue,
    }));
    if (newValue) fetchYieldList(newValue, index);
  };

  const makeSoilDownloadApi = async () => {
    setButtonLoader(true);
    const response = await SoilHealthService.makeSoilHealthDetailCall({
      dbtId: dbtIdData,
      categoryType: "SOIL_CARD_DOWNLOAD_GET",
      tenantId: TENANT_ID,
      tokenId: responseData?.tokenId,
      testGrid: testGrid,
      DownloadCardCriteria: downloadCardCriteria,
    });
    if (response?.status == 200) {
      const urlDownload =
        response?.["data"]?.["proxyResponse"]?.["DownloadCard"]?.[
          "DownloadPDFLink"
        ];
      setDownloadUrl(urlDownload);
      setSelectedSoilCard(2);
    } else {
      dispatchNotification("error", ["SessionTimeout"], dispatch);
      navigate(`${window.contextPath}/farmer-details`);
    }
    setCropErrop(false);
    setAreaError(false);
    setButtonLoader(false);
  };
  useEffect(() => {
    if (submitClicked) makeSoilDownloadApi();
    setSubmitClicked(false);
  }, [submitClicked]);
  const handleSubmit = async () => {
    const cropE = validateCropSelection();
    const npkE = validateNpkSelection();
    const areaE = selectedArea != null && selectedAreaUnit != null;
    setCropErrop(!cropE);
    setAreaError(!areaE);
    if (!cropE || !npkE || !areaE) {
      return;
    }
    setDownloadCardCriteria((prevValue) => ({
      ...prevValue,
      OpType: "D",
      landqty: selectedArea,
      Avlland: selectedAreaUnit?.["en"],
      FertN1: selectedNitrogen ?? "None",
      FertP1: selectedPhosphate ?? "None",
      FertK1: selectedPotash ?? "None",
      FertN2: "None",
      FertP2: "None",
      FertK2: "None",
      crop1: selectedCrop["crop1"] ?? "None",
      crop2: selectedCrop["crop2"] ?? "None",
      crop3: selectedCrop["crop3"] ?? "None",
      crop4: selectedCrop["crop4"] ?? "None",
      tyl1: selectedYield["yield1"]?.["quantity"] ?? "None",
      tyl2: selectedYield["yield2"]?.["quantity"] ?? "None",
      tyl3: selectedYield["yield3"]?.["quantity"] ?? "None",
      tyl4: selectedYield["yield4"]?.["quantity"] ?? "None",
    }));
    setSubmitClicked(true);
  };
  if (
    isYieldListLoading ||
    isCropListLoading ||
    isNitrogenListLoading ||
    isPhosphateListLoading ||
    isPotashListLoading
  ) {
    return (
      <Box className="flex w-full h-80 justify-center items-center">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box className="flex flex-col gap-6">
      <Box className="grm-form-inner-cards-container !p-10 gap-5">
        <Box
          className="flex flex-col  px-8 py-6 gap-6 inner-detail-container items-end justify-center"
          style={{ background: theme.palette.background.default }}
        >
          <Box
            className={`flex gap-6 inner-detail-container items-center justify-end ${
              isMobile ? "flex-col !items-start" : "flex-row"
            }`}
          >
            <Typography>{t("LandSize")}</Typography>
            <Box className="flex flex-row gap-6 inner-detail-container items-center justify-end">
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={selectedArea}
                onChange={(event) => {
                  setSelectedArea(event.target.value);
                }}
                className="!w-16"
                error={areaError && !selectedArea}
              />
              <CustomDropdown
                id="district-autocomplete"
                options={areaUnitList}
                getOptionLabel={(option) =>
                  capitalizeFirstLetter(option?.[language] || "")
                }
                value={selectedAreaUnit}
                onChange={(event, newValue) => {
                  setSelectedAreaUnit(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t("COMMON_SELECT")}
                    error={areaError && !selectedAreaUnit}
                  />
                )}
                noOptionsText={t("NoOptions")}
                size="small"
                openOnFocus
                className="w-40"
                isOptionEqualToValue={(option, value) =>
                  option.id === value?.id
                }
              />
            </Box>
          </Box>
          {areaError && (
            <Typography color="error">{t("selectArea")}</Typography>
          )}
        </Box>
        <Box
          className="flex flex-col  px-8 py-6 gap-6 inner-detail-container"
          style={{ background: theme.palette.background.default }}
        >
          <Typography
            variant="h6"
            className={`${
              isMobile ? "key-value-valueStyle-mobile" : "key-value-valueStyle"
            }`}
          >
            {t("selectCrop")}
          </Typography>
          {[1, 2, 3, 4].map((_, index) => {
            const name = `crop${index + 1}`;
            const yieldValue = `yield${index + 1}`;

            return (
              <Box className="flex flex-col gap-4" key={index}>
                <Typography
                  variant="h5"
                  className={`${
                    isMobile
                      ? "key-value-valueStyle-mobile"
                      : "key-value-valueStyle"
                  }`}
                >
                  {t("Crop")}-{index + 1}
                </Typography>
                <Box className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <Box className="w-full md:w-1/2">
                    <Typography className="pb-2 !font-semibold">
                      {t("Crop")}
                    </Typography>
                    <CustomDropdown
                      id="district-autocomplete"
                      options={cropList?.map((item) => item.FCrops)}
                      value={selectedCrop?.[name]}
                      onChange={(event, newValue) =>
                        handleCropChange(event, newValue, index, name)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={t("COMMON_SELECT")}
                          error={cropError && !selectedCrop[name]} // Highlight error
                        />
                      )}
                      noOptionsText={t("NoOptions")}
                      size="small"
                      openOnFocus
                    />
                  </Box>
                  <Box className="w-full md:w-1/2">
                    <Typography className="pb-2 !font-semibold">
                      {t("Yield")}
                    </Typography>
                    <CustomDropdown
                      id="district-autocomplete"
                      options={yieldLists[`yieldList${index + 1}`]}
                      value={selectedYield?.[yieldValue]}
                      onChange={(event, newValue) => {
                        setSelectedYield((prevValue) => ({
                          ...prevValue,
                          [yieldValue]: newValue,
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={t("COMMON_SELECT")}
                          error={cropError && !selectedYield[yieldValue]} // Highlight error
                        />
                      )}
                      noOptionsText={t("NoOptions")}
                      size="small"
                      openOnFocus
                    />
                  </Box>
                </Box>
              </Box>
            );
          })}
          {cropError && (
            <Typography color="error">{t("selectAtLeast1Crop")}</Typography>
          )}
        </Box>
        <Box
          className="flex flex-col  px-8 py-6 gap-6 inner-detail-container"
          style={{ background: theme.palette.background.default }}
        >
          <Typography
            variant="h6"
            className={`${
              isMobile ? "key-value-valueStyle-mobile" : "key-value-valueStyle"
            }`}
          >
            {t("selectNPK")}
          </Typography>

          <Box className="flex flex-col gap-4">
            <Typography
              variant="h5"
              className={`${
                isMobile
                  ? "key-value-valueStyle-mobile"
                  : "key-value-valueStyle"
              }`}
            >
              {t("NPKGroup")}-1
            </Typography>
            <Box className="flex flex-col md:flex-row justify-between items-start gap-6">
              <Box className="w-full md:w-1/2">
                <Typography className="pb-2 !font-semibold">
                  {t("Nitrogen")}
                </Typography>
                <CustomDropdown
                  id="district-autocomplete"
                  options={nitrogenList?.map((item) => item.Fcode)}
                  value={selectedNitrogen}
                  onChange={(event, newValue) => {
                    setSelectedNitrogen(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t("COMMON_SELECT")}
                      error={!selectedNitrogen}
                    />
                  )}
                  noOptionsText={t("NoOptions")}
                  size="small"
                  openOnFocus
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.id
                  }
                />
                {!selectedNitrogen && (
                  <Typography color="error">{t("selectAValue")}</Typography>
                )}
              </Box>
              <Box className="w-full md:w-1/2 ">
                <Typography className="pb-2 !font-semibold">
                  {t("Phosphate")}
                </Typography>
                <CustomDropdown
                  id="district-autocomplete"
                  options={phosphateList?.map((item) => item.Fcode)}
                  value={selectedPhosphate}
                  onChange={(event, newValue) => {
                    setSelectedPhosphate(newValue);
                  }}
                  noOptionsText={t("NoOptions")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t("COMMON_SELECT")}
                      error={!selectedPhosphate}
                    />
                  )}
                  size="small"
                  openOnFocus
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.id
                  }
                />
                {!selectedPhosphate && (
                  <Typography color="error">{t("selectAValue")}</Typography>
                )}
              </Box>
              <Box className="w-full md:w-1/2 ">
                <Typography className="pb-2 !font-semibold">
                  {t("Potash")}
                </Typography>
                <CustomDropdown
                  id="district-autocomplete"
                  options={potashList?.map((item) => item.Fcode)}
                  value={selectedPotash}
                  onChange={(event, newValue) => {
                    setSelectedPotash(newValue);
                  }}
                  noOptionsText={t("NoOptions")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t("COMMON_SELECT")}
                      error={!selectedPotash}
                    />
                  )}
                  size="small"
                  openOnFocus
                  isOptionEqualToValue={(option, value) =>
                    option.id === value?.id
                  }
                />
                {!selectedPotash && (
                  <Typography color="error">{t("selectAValue")}</Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="flex flex-row justify-between items-center">
          <Button
            variant="secondary"
            href="#main-content"
            onClick={() => {
              const mainContent = document.getElementById("soil-detail");
              if (mainContent) {
                mainContent.focus();
              }
              setSelectedSoilCard(0);
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={buttonLoader ? () => {} : () => handleSubmit()}
          >
            {buttonLoader ? (
              <>
                <CircularProgress className="mx-6" />
              </>
            ) : (
              t("GenerateReport")
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
SoilHealthCardCropForm.propTypes = {
  setSelectedSoilCard: PropTypes.any,
  isMobile: PropTypes.bool,
  setDownloadUrl: PropTypes.any,
  setDownloadCardCriteria: PropTypes.any,
  downloadCardCriteria: PropTypes.any,
  t: PropTypes.func,
  language: PropTypes.string,
  setSelectedSoilCard: PropTypes.any,
  testGrid: PropTypes.any,
};
export default SoilHealthCardCropForm;
