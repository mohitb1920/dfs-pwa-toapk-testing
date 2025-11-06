import React, { useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import HelpDataCard from "./HelpDataCard";
import { useHelpData } from "../../../Hooks/UseHelp";

function HelpSectionMDMS({
  selectedData,
  selectedDistrict,
  selectedSection,
  setSelectedDistrict,
  selectedBlock,
  selectedPanchayat,
  t,
}) {
  // const [helpData, setHelpData] = useState([]);
  const [dbtRelatedServiceData, setDbtRelatedServiceData] = useState();

  const {
    data: helpData,
    isLoading,
    error,
    revalidate,
  } = useHelpData({
    selectedData: selectedData,
    name: selectedData.masterName,
    selectedDistrict,
    selectedBlock,
    selectedPanchayat,
  });

  const section = selectedData?.id === 3 ? "DBT" : "Other";

  return (
    <Box>
      {isLoading && (
        <Box className="w-full h-28 flex justify-center items-center">
          <CircularProgress />
        </Box>
      )}
      {!isLoading &&
        (!helpData ||
          helpData.length === 0 ||
          (helpData?.[0]?.localInfo &&
            (helpData[0].localInfo?.content?.[selectedDistrict?.id] === null ||
              helpData[0].localInfo?.content?.[selectedDistrict?.id] ===
                undefined))) && (
          <Box className="no-item-style-help">
            <img src={`${window.contextPath}/assets/NodataHelp.svg`} alt="" />
            <Typography variant="body1">{t("help.noDataFound")}</Typography>
          </Box>
        )}
      {!isLoading &&
        ([3, 4].includes(selectedData?.id) ? (
          <Box>
            <HelpDataCard
              dbtRelatedServiceData={
                helpData?.find(item => item?.name?.includes(section))?.serviceList 
              }
            />
          </Box>
        ) : (
          helpData?.map((data) => {
            return (
              <Box>
                <HelpDataCard
                  district={
                    data?.district ??
                    data?.["localInfo"]?.["content"]?.[selectedDistrict?.id]
                      ?.district
                  }
                  block={data?.block}
                  panchayat={data?.panchayat}
                  districtCode={data?.districtCode}
                  content={selectedData.id == 2 ? data?.["content"] : null}
                  dao={
                    selectedData.id == 2
                      ? null
                      : data?.["localInfo"]?.["content"]?.[
                          selectedDistrict?.id
                        ]?.["DAO"]
                  }
                  dho={
                    selectedData.id == 2
                      ? null
                      : data?.["localInfo"]?.["content"]?.[
                          selectedDistrict?.id
                        ]?.["DHO"]
                  }
                  ade={
                    selectedData.id == 2
                      ? null
                      : data?.["localInfo"]?.["content"]?.[
                          selectedDistrict?.id
                        ]?.["ADE"]
                  }
                  adc={
                    selectedData.id == 2
                      ? null
                      : data?.["localInfo"]?.["content"]?.[
                          selectedDistrict?.id
                        ]?.["ADC"]
                  }
                  ma={
                    data?.["localInfo"]?.["content"]?.[selectedDistrict?.id]?.[
                      "MA"
                    ]
                  }
                  oci={
                    data?.["localInfo"]?.["content"]?.[selectedDistrict?.id]?.[
                      "OCI"
                    ]
                  }
                  si={
                    data?.["localInfo"]?.["content"]?.[selectedDistrict?.id]?.[
                      "SI"
                    ]
                  }
                  si1={
                    data?.["localInfo"]?.["content"]?.[selectedDistrict?.id]?.[
                      "SI-1"
                    ]
                  }
                  si2={
                    data?.["localInfo"]?.["content"]?.[selectedDistrict?.id]?.[
                      "SI-2"
                    ]
                  }
                  si3={
                    data?.["localInfo"]?.["content"]?.[selectedDistrict?.id]?.[
                      "SI-3"
                    ]
                  }
                  sao={
                    data?.["localInfo"]?.["content"]?.[selectedDistrict?.id]?.[
                      "SAO"
                    ]
                  }
                  ac={data?.["AC"]}
                  ks={data?.["KS"]}
                  bac={data?.["BAC"]}
                  adpp={data?.["ADPP"]}
                  ethanol={data?.["Ethanol"]}
                  fpo={data?.["FPO"]}
                  fp={data?.["FP"]}
                />
              </Box>
            );
          })
        ))}
    </Box>
  );
}

export default HelpSectionMDMS;
