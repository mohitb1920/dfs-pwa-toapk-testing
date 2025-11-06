import React, { useState, useEffect, useRef } from "react";
import Mapper from "../Mapper";
import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import useCropData from "../../../Hooks/useCropData";
import { useWatch } from "react-hook-form";

function AppliedComponentsTea({
  scheme,
  schemeName,
  language,
  methods,
  disableAll,
  schemeId,
}) {
  const { errors, watch, control, setError, clearErrors, setValue } = methods;
  const selectedPart = methods.watch("appliedComponentsTea.component", "");
  const componentObject = scheme.properties["component"];
  const componentCost = scheme.properties["unitCost"];

  const subLabelComponentCost = componentCost.dependent?.options?.[language];
  let subLabel = ["NA", "NA", "NA"];
  componentObject.options = [];

  const data = useCropData(schemeId, { cropCall: true });
  const district = methods.watch("landDetails.farmerDistrict", "");
  const prevDistrictRef = useRef(district);
  const farmerLandType = methods.watch(`${schemeName}.farmerType`);
  const previousFarmerLandType = useRef(farmerLandType?.id);

  useEffect(() => {
    if (disableAll) return;

    if (district !== prevDistrictRef.current && district !== "") {
      methods.setValue("appliedComponentsTea.component", { id: "" });
      methods.setValue("appliedComponentsTea.groupDetails", []);
    }
    prevDistrictRef.current = district;
  }, [district, methods, disableAll]);

  useEffect(() => {
    if (disableAll) return;

    if (farmerLandType?.id !== previousFarmerLandType.current) {
      methods.setValue("requiredDocuments.LandDoc", []);
      previousFarmerLandType.current = farmerLandType.id;
    }
  }, [farmerLandType?.id, disableAll]);

  let selectedCrop;
  if (["SCHEME016"].includes(schemeId) && data.isLoading === false)
    if (data?.data?.crops) {
      const filteredCrops = data.data.crops.filter(
        (crop) => crop.district === district.id
      );
      componentObject.options = filteredCrops;
      selectedCrop = filteredCrops.find((item) => item.id === selectedPart.id);
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
    name: "appliedComponentsTea.groupDetails",
  });

  useEffect(() => {
    if (disableAll) return;

    const totalArea = groupDetailsWatch?.reduce((sum, farmer) => {
      const area = parseFloat(farmer.farmerLandArea);
      return sum + (isNaN(area) ? 0 : area);
    }, 0);

    setValue("appliedComponentsTea.totalArea", totalArea);
    if (
      selectedCrop &&
      selectedCrop.max &&
      parseFloat(selectedCrop.max) &&
      totalArea > selectedCrop.max
    ) {
      setError("appliedComponentsTea.totalArea", {
        type: "manual",
        message: `Total area should not exceed ${selectedCrop?.max} acres`,
      });
    } else if (
      selectedCrop &&
      selectedCrop.min &&
      parseFloat(selectedCrop.min) &&
      totalArea < selectedCrop.min
    ) {
      setError("appliedComponentsTea.totalArea", {
        type: "manual",
        message: `MinError`,
      });
    } else {
      clearErrors("appliedComponentsTea.totalArea");
    }
  }, [groupDetailsWatch, setValue, methods, disableAll]);

  const totalArea = methods.watch("appliedComponentsTea.totalArea");
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
        <Mapper
          parent={schemeName}
          relation={"farmerType"}
          obj={scheme.properties["farmerType"]}
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
        {farmerLandType?.value === "Gair-Ryot" ||
        farmerLandType?.value === "Gair-Raiyat" ||
        farmerLandType?.value === "गैर-रैयत" ? (
          <Mapper
            parent={schemeName}
            relation={"labelLink"}
            obj={scheme.properties["labelLink"]}
            type={"label"}
            register={methods.register}
            language={language}
            errors={errors}
            control={methods.control}
            reset={methods.reset}
            setValue={methods.setValue}
            disableAll={disableAll}
            linkTitle={scheme.properties["labelLink"][`titleName-${language}`]}
            methods={methods}
          />
        ) : null}
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

        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Typography
            variant="h6"
            className="input-label w-fit !mx-auto"
            color={theme.palette.text.primary}
          >
            {t("schemes.totalAreaAcre", {
              area: watch("appliedComponentsTea.totalArea", 0).toFixed(2),
            })}
          </Typography>
          {methods.formState.errors.appliedComponentsTea?.totalArea && (
            <Typography
              color={theme.palette.text.error}
              sx={{ fontSize: "0.8rem", margin: "auto" }}
            >
              {methods.formState.errors.appliedComponentsTea?.totalArea
                .message === "MinError"
                ? t("schemeErrors.totalAreaMinError", {
                    min: parseFloat(selectedCrop?.min).toFixed(2),
                  })
                : t("schemeErrors.totalAreaError", {
                    max: parseFloat(selectedCrop?.max).toFixed(2),
                  })}
            </Typography>
          )}
        </Box>
        {selectedPart.id != "" &&
          totalArea > 0 &&
          !methods.formState.errors.appliedComponentsTea?.totalArea && (
            <Mapper
              parent={schemeName}
              relation={"unitCost"}
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
      </Box>
    </>
  );
}

export default AppliedComponentsTea;
