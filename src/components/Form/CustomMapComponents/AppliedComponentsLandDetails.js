import React, { useEffect, useMemo, useRef } from "react";
import Mapper from "../Mapper";
import useCropData from "../../../Hooks/useCropData";
import { useWatch } from "react-hook-form";
import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

function AppliedComponentsLandDetails({
  scheme,
  schemeName,
  language,
  methods,
  disableAll,
  schemeId,
}) {
  const { errors, watch, setValue, control, setError, clearErrors } = methods;
  const data = useCropData(schemeId, { cropCall: true });
  const { t } = useTranslation();
  const theme = useTheme();
  const farmerPartNameObject = scheme.properties["component"];
  const district = methods.watch("landDetails.farmerDistrict", "");

  const selectedPart = methods.watch(
    "appliedComponentsLandDetails.component",
    ""
  );
  const previousPartId = useRef(selectedPart.id);
  useEffect(() => {
    if (disableAll) return;
    if (selectedPart.id !== previousPartId.current) {
      methods.setValue("appliedComponentsLandDetails.subGroupDetails", []);
      methods.setValue("appliedComponentsLandDetails.plantDetails", []);
      methods.trigger("appliedComponentsLandDetails.subGroupDetails");
      methods.trigger("appliedComponentsLandDetails.plantDetails");
      previousPartId.current = selectedPart.id;
    }
  }, [selectedPart.id, methods, disableAll, previousPartId]);
  if (data?.data?.crops) {
    farmerPartNameObject.options = data?.data?.crops;
    const filteredCrops = data.data.crops.filter(
      (crop) => crop.district === district.id
    );

    const result = filteredCrops.reduce((acc, item) => {
      if (!acc.some((obj) => obj.id === item.componentCode)) {
        acc.push({
          id: item.componentCode,
          value: item.componentName,
        });
      }
      return acc;
    }, []);

    farmerPartNameObject.options = result;
  }

  const prevDistrictRef = useRef(district);
  useEffect(() => {
    if (disableAll) return;

    if (district !== prevDistrictRef.current && district !== "") {
      methods.setValue("appliedComponentsLandDetails.component", {});
    }
    prevDistrictRef.current = district;
  }, [district, methods, disableAll]);
  const groupDetailsWatch = useWatch({
    control,
    name: "appliedComponentsLandDetails.subGroupDetails",
  });

  const plantGroupDetailsWatch = useWatch({
    control,
    name: "appliedComponentsLandDetails.plantDetails",
  });

  useEffect(() => {
    if (disableAll) return;

    const totalArea = groupDetailsWatch?.reduce((sum, farmer) => {
      const area = parseFloat(farmer.farmerLandArea);
      return sum + (isNaN(area) ? 0 : area);
    }, 0);

    setValue("appliedComponentsLandDetails.totalArea", totalArea);
  }, [groupDetailsWatch, setValue, methods, disableAll]);

  useEffect(() => {
    if (disableAll) return;

    const totalAppliedFruit = plantGroupDetailsWatch?.reduce((sum, farmer) => {
      const area = parseFloat(farmer.appliedPlants);
      return sum + (isNaN(area) ? 0 : area);
    }, 0);

    const plantsRakwa = plantGroupDetailsWatch?.reduce((sum, farmer) => {
      const area = parseFloat(farmer.plantsRakwa);
      return sum + (isNaN(area) ? 0 : area);
    }, 0);

    setValue("appliedComponentsLandDetails.totalAppliedFruitArea", {
      totalAppliedFruit,
      plantsRakwa,
    });

    const totalArea = watch("appliedComponentsLandDetails.totalArea", 0);

    if (plantsRakwa > totalArea) {
      setError("appliedComponentsLandDetails.totalAppliedFruitArea", {
        type: "manual",
        message: "Applied fruit area cannot be greater than total area",
      });
    } else {
      clearErrors("appliedComponentsLandDetails.totalAppliedFruitArea");
    }
  }, [
    plantGroupDetailsWatch,
    setValue,
    methods,
    disableAll,
    watch,
    setError,
    clearErrors,
    watch("appliedComponentsLandDetails.totalArea", 0),
  ]);

  const appliedPlantLabelObject = useMemo(() => {
    const base = { ...scheme.properties["cropCount"] };
    return {
      ...base,
      "title-en": `${base["title-en"]}:- ${watch(
        "appliedComponentsLandDetails.totalAppliedFruitArea",
        0
      ).totalAppliedFruit?.toFixed(2)}`,
      "title-hi": `${base["title-hi"]}:- ${watch(
        "appliedComponentsLandDetails.totalAppliedFruitArea",
        0
      ).totalAppliedFruit?.toFixed(2)}`,
    };
  }, [
    scheme.properties,
    watch("appliedComponentsLandDetails.totalAppliedFruitArea"),
  ]);

  const appliedAreaLabelObject = useMemo(() => {
    const base = { ...scheme.properties["appliedArea"] };
    return {
      ...base,
      "title-en": `${base["title-en"]}:- ${watch(
        "appliedComponentsLandDetails.totalAppliedFruitArea",
        0
      ).plantsRakwa?.toFixed(2)}`,
      "title-hi": `${base["title-hi"]}:- ${watch(
        "appliedComponentsLandDetails.totalAppliedFruitArea",
        0
      ).plantsRakwa?.toFixed(2)}`,
    };
  }, [
    scheme.properties,
    watch("appliedComponentsLandDetails.totalAppliedFruitArea"),
  ]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Mapper
        parent={schemeName}
        relation={"component"}
        obj={farmerPartNameObject}
        type={"string"}
        register={methods.register}
        language={language}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll}
        schemeId={schemeId}
        methods={methods}
      />
      <Mapper
        parent={schemeName}
        relation={"subGroupDetails"}
        obj={scheme.properties["groupDetails"]}
        type={"subGroup"}
        register={methods.register}
        language={language}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll}
        schemeId={schemeId}
        schemeName={schemeName}
        scheme={scheme}
        watch={watch}
        methods={methods}
      />
      <Typography
        variant="h6"
        className="input-label w-fit !mx-auto"
        color={theme.palette.text.primary}
      >
        {t("schemes.totalAreaAcre", {
          area: watch("appliedComponentsLandDetails.totalArea", 0).toFixed(2),
        })}
      </Typography>
      <Mapper
        parent={schemeName}
        relation={"note"}
        type={"label"}
        obj={scheme.properties["note"]}
        register={methods.register}
        language={language}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll}
        schemeId={schemeId}
        methods={methods}
      />

      <Mapper
        parent={schemeName}
        relation={"plantDetails"}
        type={"subGroup"}
        obj={scheme.properties["plantDetails"]}
        register={methods.register}
        language={language}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll}
        schemeId={schemeId}
        scheme={scheme}
        methods={methods}
        watch={watch}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: "10px",
          justifyContent: "space-between",
          marginTop: "10px",
          padding: "5px",
        }}
      >
        <Mapper
          parent={schemeName}
          relation={"cropCount"}
          type={"label"}
          obj={appliedPlantLabelObject}
          register={methods.register}
          language={language}
          errors={errors}
          control={methods.control}
          reset={methods.reset}
          setValue={methods.setValue}
          disableAll={disableAll}
          schemeId={schemeId}
          methods={methods}
        />

        <Mapper
          parent={schemeName}
          relation={"appliedArea"}
          type={"label"}
          obj={appliedAreaLabelObject}
          register={methods.register}
          language={language}
          errors={errors}
          control={methods.control}
          reset={methods.reset}
          setValue={methods.setValue}
          disableAll={disableAll}
          schemeId={schemeId}
          methods={methods}
        />
      </Box>
      {methods.formState.errors.appliedComponentsLandDetails
        ?.totalAppliedFruitArea && (
        <Typography color={theme.palette.text.error} sx={{ fontSize: "0.8rem", margin: "auto" }}>
          {t("schemeErrors.totalAreaShuskError")}
        </Typography>
      )}
    </Box>
  );
}

export default AppliedComponentsLandDetails;
