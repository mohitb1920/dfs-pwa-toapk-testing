import React, { useState, useEffect, useRef } from "react";
import Mapper from "../Mapper";
import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import useCropData from "../../../Hooks/useCropData";
import { useWatch } from "react-hook-form";

function AppliedComponentsRKVY({
  scheme,
  schemeName,
  language,
  methods,
  disableAll,
  schemeId,
}) {
  const { errors, watch, control, setValue } = methods;
  const selectedPart = methods.watch("componentsMushroomHut.component", "");
  const componentObject = scheme.properties["component"];
  const componentCost = scheme.properties["componentCost"];

  const subLabelComponentCost = componentCost.dependent?.options?.[language];
  let subLabel = ["NA", "NA", "NA"];
  componentObject.options = [];

  const data = useCropData(schemeId, { cropCall: true });
  const district = methods.watch("landDetails.farmerDistrict", "");
  const prevDistrictRef = useRef(district);

  useEffect(() => {
    if (disableAll) return;

    if (district !== prevDistrictRef.current && district !== "") {
      methods.setValue("componentsMushroomHut.component", { id: "" });
      methods.setValue("componentsMushroomHut.groupDetails", []);

      // const data = localStorage.getItem(schemeId + "formData");
      // const farmerschemeData = JSON.parse(data);
      // farmerschemeData?.appliedComponentScreenHorti = {};
      // localStorage.setItem(
      //   schemeId + "formData",
      //   JSON.stringify(farmerschemeData)
      // );
    }
    prevDistrictRef.current = district;
  }, [district, methods, disableAll]);

  if (["SCHEME010"].includes(schemeId) && data.isLoading === false)
    if (data?.data?.crops) {
      const filteredCrops = data.data.crops.filter(
        (crop) => crop.district === district.id
      );
      componentObject.options = filteredCrops;
      const selectedCrop = filteredCrops.find(
        (item) => item.id === selectedPart.id
      );
      const values = [
        selectedCrop?.unitCost,
        selectedCrop?.subsidy,
        selectedCrop?.amount,
      ];

      subLabel[0] = subLabelComponentCost[0] + " " + values[0];
      subLabel[1] = subLabelComponentCost[1] + " " + values[1];
      subLabel[2] = subLabelComponentCost[2] + " " + values[2];
    }

  const { t } = useTranslation();
  const theme = useTheme();

  const groupDetailsWatch = useWatch({
    control,
    name: "componentsMushroomHut.groupDetails",
  });
  useEffect(() => {
    if (disableAll) return;

    const totalArea = groupDetailsWatch?.reduce((sum, farmer) => {
      const area = parseFloat(farmer.farmerLandArea);
      return sum + (isNaN(area) ? 0 : area);
    }, 0);

    setValue("componentsMushroomHut.totalArea", totalArea);
  }, [groupDetailsWatch, setValue, methods, disableAll]);
  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
        <Mapper
          parent={schemeName}
          relation={"component"}
          obj={componentObject}
          type={"string"}
          register={methods.register}
          language={language}
          errors={errors}
          control={methods.control}
          reset={methods.reset}
          setValue={methods.setValue}
          disableAll={disableAll}
          watch={watch}
          methods={methods}
        />
        {selectedPart.id != "" && (
          <Mapper
            parent={schemeName}
            relation={"componentCost"}
            obj={componentCost}
            type={"label"}
            register={methods.register}
            language={language}
            subLabel={subLabel}
            errors={errors}
            control={methods.control}
            reset={methods.reset}
            setValue={methods.setValue}
            disableAll={disableAll}
            watch={watch}
            methods={methods}
          />
        )}
        <Mapper
          parent={schemeName}
          relation={"groupDetails"}
          type={"subGroup"}
          obj={scheme.properties["groupDetails"]}
          register={methods.register}
          language={language}
          errors={errors}
          control={methods.control}
          reset={methods.reset}
          setValue={methods.setValue}
          disableAll={disableAll}
          schemeId={schemeId}
          watch={watch}
          methods={methods}
        />
        <Typography
          variant="h6"
          className="input-label w-fit !mx-auto"
          color={theme.palette.text.primary}
        >
          {t("schemes.totalAreaAcre", {
            area: watch("componentsMushroomHut.totalArea", 0).toFixed(2),
          })}
        </Typography>
      </Box>
    </>
  );
}

export default AppliedComponentsRKVY;
