import React, { useState, useEffect, useRef } from "react";
import Mapper from "../Mapper";
import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import useCropData from "../../../Hooks/useCropData";
import { useWatch } from "react-hook-form";
import { SchemeService } from "../../../services/Schemes";

function AppliedComponentsSabji({
  scheme,
  schemeName,
  language,
  methods,
  disableAll,
  schemeId,
}) {
  const { errors, watch, control, setError, clearErrors, setValue } = methods;
  const { t } = useTranslation();
  const theme = useTheme();

  const selectedPart = methods.watch(
    "appliedComponentsSabji.farmerPartName",
    ""
  );
  const selectedSubComponent = methods.watch(
    "appliedComponentsSabji.subComponent",
    ""
  );
  const selectedAreaApplied = methods.watch(
    "appliedComponentsSabji.areaApplied",
    ""
  );

  const farmerPartNameObject = scheme.properties["farmerPartName"];
  const prevSelectedPartRef = useRef(selectedPart?.id);
  const [subComponentObject, setSubComponentObject] = useState(
    scheme.properties["subComponent"]
  );
  const prevSelectedSubComponenttRef = useRef(selectedSubComponent?.id);
  const beechraCount = scheme.properties["noOfBeechra"];
  const hasBeechra = selectedPart?.id === "1";
  const areaApplied = scheme.properties["areaApplied"];
  const [seedQuantity, setSeedQuantity] = useState("");
  const [seedUnit, setSeedUnit] = useState("");

  const data = useCropData(schemeId, { cropCall: true });
  const district = methods.watch("landDetails.farmerDistrict", "");
  const prevDistrictRef = useRef(district);
  const farmerLandType = methods.watch(`${schemeName}.farmerType`);
  const previousFarmerLandType = useRef(farmerLandType?.id);

  useEffect(() => {
    if (disableAll) return;

    if (district !== prevDistrictRef.current && district !== "") {
      methods.setValue("appliedComponentsSabji.farmerPartName", { id: "" });
      methods.setValue("appliedComponentsSabji.subComponent", { id: "" });
      methods.setValue("appliedComponentsSabji.areaApplied", "");
      methods.setValue("appliedComponentsSabji2.farmerLandType", "");
      methods.setValue("appliedComponentsSabji.groupDetails", []);
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

  if (
    ["SCHEME026"].includes(schemeId) &&
    !data.isLoading &&
    data?.data?.crops
  ) {
    const filteredCrops = data.data.crops.filter(
      (crop) => crop.district === district.id
    );

    const filteredComponent = filteredCrops.reduce((acc, item) => {
      if (!acc.some((obj) => obj.id === item.componentCode)) {
        acc.push({
          id: item.componentCode,
          value: item.componentName,
        });
      }
      return acc;
    }, []);

    farmerPartNameObject.options = filteredComponent;
  }

  useEffect(() => {
    if (disableAll) return;

    if (prevSelectedPartRef.current !== selectedPart?.id) {
      methods.setValue("appliedComponentsSabji.subComponent", { id: "" });
      methods.setValue("appliedComponentsSabji.areaApplied", "");

      const filteredCrops = data?.data?.crops?.filter(
        (crop) => crop.district === district.id
      );

      const filteredSubComponent =
        filteredCrops?.reduce((acc, item) => {
          if (
            !acc.some((obj) => obj.id === item.id) &&
            item.componentCode === selectedPart?.id
          ) {
            acc.push(item);
          }
          return acc;
        }, []) || [];

      setSubComponentObject((prev) => ({
        ...prev,
        options: filteredSubComponent,
      }));

      prevSelectedPartRef.current = selectedPart.id;
    }
  }, [selectedPart?.id, subComponentObject, disableAll, data, district]);

  useEffect(() => {
    if (disableAll) return;

    if (
      !hasBeechra &&
      prevSelectedSubComponenttRef.current !== selectedSubComponent?.id
    ) {
      methods.setValue("appliedComponentsSabji.areaApplied", "");

      prevSelectedSubComponenttRef.current = selectedSubComponent.id;
    }
  }, [selectedSubComponent?.id, hasBeechra, disableAll]);

  useEffect(() => {
    let shouldCallApi = true; // Guard to prevent outdated calls

    const fetchSubsidy = async () => {
      if (!shouldCallApi) return;

      try {
        const response = await SchemeService.subsidySabji(
          schemeId,
          selectedPart.id,
          selectedSubComponent.id
        );
        processSeedQuantity(response, selectedPart.id);
      } catch (error) {
        console.error("API call failed", error);
      }
    };

    if (selectedPart?.id && !hasBeechra) {
      const timer = setTimeout(() => {
        if (selectedSubComponent?.id) {
          fetchSubsidy();
        }
      }, 100); // Wait for 100ms to stabilize state

      return () => {
        shouldCallApi = false; // Prevent outdated API call
        clearTimeout(timer); // Cleanup timeout if dependencies change
      };
    }
  }, [selectedPart?.id, selectedSubComponent?.id, hasBeechra, disableAll]);

  const processSeedQuantity = (response, componentCode) => {
    let value = response?.[0]?.SeedQuantityPerHa * 0.4;

    if (componentCode === "2") {
      setSeedQuantity(Math.floor(value * 1000));
      setSeedUnit("schemes.gramUnit");
      methods.setValue("appliedComponentsSabji.seedQuantity", {value: Math.floor(value * 1000), unit: "ग्राम"})
    } else if (componentCode === "3") {
      setSeedQuantity(Math.floor(value));
      setSeedUnit("schemes.kilogramUnit");
      methods.setValue("appliedComponentsSabji.seedQuantity", {value: Math.floor(value), unit: "किलो ग्राम"})
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
        <Mapper
          parent={schemeName}
          relation={"farmerPartName"}
          obj={farmerPartNameObject}
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
          relation={"subComponent"}
          obj={subComponentObject}
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
        {hasBeechra && (
          <Mapper
            parent={schemeName}
            relation={"noOfBeechra"}
            obj={beechraCount}
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
        )}
        {selectedPart?.value && !hasBeechra && (
          <Mapper
            parent={schemeName}
            relation={"areaApplied"}
            obj={areaApplied}
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
        )}
        {selectedPart?.value && !hasBeechra && (
          <Typography
            variant="h6"
            className="input-label w-fit !mx-auto"
            color={theme.palette.text.primary}
          >
            {t("schemes.seedQuantity", {
              quantity: selectedAreaApplied
                ? seedQuantity * parseFloat(selectedAreaApplied?.value)
                : "",
              unit: selectedAreaApplied ? t(seedUnit) : "",
            })}
          </Typography>
        )}
      </Box>
    </>
  );
}

export default AppliedComponentsSabji;
