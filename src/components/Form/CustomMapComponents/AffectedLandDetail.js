import React, { useEffect } from "react";
import Mapper from "../Mapper";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Box, Typography, useTheme } from "@mui/material";
import useCropData from "../../../Hooks/useCropData";

function AffectedLandDetail({
  scheme,
  schemeName,
  schemeId,
  language,
  methods,
  disableAll,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { control, watch, setValue, setError, clearErrors } = methods;
  const data = useCropData(schemeId, { farmerCall: !disableAll });

  const farmerTypeWatch = useWatch({
    control,
    name: "landAndSubsidyDetails.farmerTypeDieasel",
  });

  const groupDetailsWatch = useWatch({
    control,
    name: "affectedLandDetail.groupDetails",
  });
  const groupDetails2Watch = useWatch({
    control,
    name: "affectedLandDetail.groupDetails2",
  });

  const totalLandWatch = useWatch({
    control,
    name: "affectedLandDetail.totalLand",
  });

  const totalAreaWatch = useWatch({
    control,
    name: "affectedLandDetail.totalArea",
    defaultValue: 0,
  });

  useEffect(() => {
    if (disableAll || !data?.data?.farmer) return;

    const swayamId = data?.data?.farmer.find(
      (f) => f.FarmerType === "स्वयं"
    )?.FarmerID;
    const bataidarId = data?.data?.farmer.find(
      (f) => f.FarmerType === "बटाईदार"
    )?.FarmerID;

    const shouldUpdateSwayam =
      groupDetailsWatch?.length > 0 &&
      swayamId &&
      groupDetailsWatch.some((detail) => detail.typeofLand !== swayamId);

    const shouldUpdateBataidar =
      groupDetails2Watch?.length > 0 &&
      bataidarId &&
      groupDetails2Watch.some((detail) => detail.typeofLand !== bataidarId);

    if (shouldUpdateSwayam) {
      const updatedGroupDetails = groupDetailsWatch.map((detail) => ({
        ...detail,
        typeofLand: swayamId,
      }));
      setValue("affectedLandDetail.groupDetails", updatedGroupDetails, {
        shouldDirty: true,
      });
    }

    if (shouldUpdateBataidar) {
      const updatedGroupDetails2 = groupDetails2Watch.map((detail) => ({
        ...detail,
        typeofLand: bataidarId,
      }));
      setValue("affectedLandDetail.groupDetails2", updatedGroupDetails2, {
        shouldDirty: true,
      });
    }
  }, [
    data?.data?.farmer,
    groupDetailsWatch,
    groupDetails2Watch,
    setValue,
    disableAll,
  ]);

  useEffect(() => {
    if (disableAll) return;

    if (farmerTypeWatch?.valueHindi !== undefined) {
      if (farmerTypeWatch.valueHindi === "बटाईदार") {
        setValue("affectedLandDetail.groupDetails", []);
        clearErrors("affectedLandDetail.groupDetails");
      } else if (farmerTypeWatch.valueHindi === "स्वयं") {
        setValue("affectedLandDetail.groupDetails2", []);
        clearErrors("affectedLandDetail.groupDetails2");
      }
    }
  }, [farmerTypeWatch?.valueHindi, disableAll]);

  useEffect(() => {
    if (disableAll) return;

    // if (!groupDetailsWatch && !groupDetails2Watch) {
    //   setValue("affectedLandDetail.totalArea", 0);
    //   return;
    // }

    let totalArea = 0;

    if (
      farmerTypeWatch.valueHindi !== "बटाईदार" &&
      groupDetailsWatch?.length > 0
    ) {
      totalArea += groupDetailsWatch.reduce((sum, farmer) => {
        const area = parseFloat(farmer.farmerLandArea);
        return sum + (isNaN(area) ? 0 : area);
      }, 0);
    }

    if (
      farmerTypeWatch.valueHindi !== "स्वयं" &&
      groupDetails2Watch?.length > 0
    ) {
      totalArea += groupDetails2Watch.reduce((sum, farmer) => {
        const area = parseFloat(farmer.farmerLandArea);
        return sum + (isNaN(area) ? 0 : area);
      }, 0);
    }

    setValue("affectedLandDetail.totalArea", totalArea);
  }, [
    groupDetailsWatch,
    groupDetails2Watch,
    farmerTypeWatch?.valueHindi,
    disableAll,
  ]);

  useEffect(() => {
    if (disableAll) return;

    const totalLand = parseFloat(totalLandWatch);
    if (!isNaN(totalLand) && totalLand < totalAreaWatch) {
      setError("affectedLandDetail.totalArea", {
        type: "manual",
        message: t("schemes.totalLandError", {
          minRequired: totalAreaWatch.toFixed(2),
        }),
      });
    } else {
      clearErrors("affectedLandDetail.totalArea");
    }
  }, [totalLandWatch, totalAreaWatch, disableAll]);

  const getWidthClass = (type) => {
    if (["string", "date"].includes(type)) {
      return "w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]";
    }
    return "w-full";
  };

  const isGroupDetailsDisabled = (key) => {
    if (!farmerTypeWatch?.valueHindi) return false;

    if (key === "groupDetails") {
      return farmerTypeWatch.valueHindi === "बटाईदार";
    }

    if (key === "groupDetails2") {
      return farmerTypeWatch.valueHindi === "स्वयं";
    }

    return false;
  };

  return (
    <div className="flex flex-wrap gap-4">
      {Object.keys(scheme.properties).map((key) => {
        const property = scheme.properties[key];
        const widthClass = getWidthClass(property.type);
        return (
          <div key={key} className={`${widthClass}`}>
            <div className="h-full">
              <Mapper
                key={key}
                parent={schemeName}
                relation={key}
                obj={property}
                type={property.type}
                register={methods.register}
                language={language}
                control={methods.control}
                reset={methods.reset}
                setValue={methods.setValue}
                disableAll={disableAll || isGroupDetailsDisabled(key)}
                methods={methods}
                schemeId={schemeId}
                minimum={isGroupDetailsDisabled(key) ? 0 : undefined}
              />
            </div>
          </div>
        );
      })}
      <div className={`w-full`}>
        <div className="h-full">
          <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Typography
              variant="h6"
              className="input-label w-fit !mx-auto"
              color={theme.palette.text.primary}
            >
              {t("schemes.totalAreaAcre", {
                area: (totalAreaWatch / 100).toFixed(2),
              })}
            </Typography>
            {methods.formState.errors.affectedLandDetail?.totalArea && (
              <Typography
                color={theme.palette.text.error}
                sx={{ fontSize: "0.8rem", margin: "auto" }}
              >
                {t("schemeErrors.totalAreaError", {
                  max:
                    parseFloat(totalLandWatch).toFixed(2) +
                    " (" +
                    t("Total_Land") +
                    ")",
                })}
              </Typography>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}

export default AffectedLandDetail;
