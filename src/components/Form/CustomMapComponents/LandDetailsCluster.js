import React, { useCallback, useEffect, useRef } from "react";
import { Box, Typography, Fade, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import Mapper from "../Mapper";
import useCropData from "../../../Hooks/useCropData";

function LandDetailsCustomSpecial({
  scheme,
  schemeName,
  language,
  methods,
  disableAll,
  schemeId,
}) {
  const { t } = useTranslation();
  const theme = useTheme()
  const {
    watch,
    setValue,
    control,
    register,
    reset,
    formState: { errors },
  } = methods;

  const farmerDistrict = methods.watch(`${schemeName}.farmerDistrict`, "");
  const farmerBlock = methods.watch(`${schemeName}.farmerBlock`, "");
  const farmerGramPanchayat = methods.watch(
    `${schemeName}.farmerGramPanchayat`,
    ""
  );
  const farmerVillage = methods.watch(`${schemeName}.farmerVillage`, "");

  const farmerDistrictObject = scheme.properties["farmerDistrict"];
  if (!farmerDistrictObject.options) farmerDistrictObject.options = [];

  const farmerBlockObject = scheme.properties["farmerBlock"];
  if (!farmerBlockObject.options) farmerBlockObject.options = [];

  const farmerPanchayatObject = scheme.properties["farmerGramPanchayat"];
  if (!farmerPanchayatObject.options) farmerPanchayatObject.options = [];

  const farmerVillageObject = scheme.properties["farmerVillage"];
  if (!farmerVillageObject.options) farmerVillageObject.options = [];

  const farmerPinCodeObject = scheme.properties["farmerPinCode"];
  farmerPinCodeObject.requiredLength = 6;
  const prevDistrictIdRef = useRef(farmerDistrict.id);
  const prevBlockIdRef = useRef(farmerBlock.id);
  const prevPanchayatIdRef = useRef(farmerGramPanchayat.id);

  const clearDependentFields = useCallback(
    (changedField) => {
      if (disableAll) return;
      const clearMap = {
        farmerDistrict: ["farmerBlock", "farmerGramPanchayat", "farmerVillage"],
        farmerBlock: ["farmerGramPanchayat", "farmerVillage"],
        farmerGramPanchayat: ["farmerVillage"],
      };

      clearMap[changedField]?.forEach((field) => {
        methods.setValue(`${schemeName}.${field}`, { id: "", value: "" });
        scheme.properties[field].options = [];
      });
    },
    [schemeName, setValue, scheme]
  );

  useEffect(() => {
    if (disableAll) return;
    if (farmerDistrict.id !== prevDistrictIdRef.current) {
      clearDependentFields("farmerDistrict");
      prevDistrictIdRef.current = farmerDistrict.id;
    }
  }, [farmerDistrict.id, schemeId, clearDependentFields]);

  useEffect(() => {
    if (disableAll) return;
    if (farmerBlock.id !== prevBlockIdRef.current) {
      clearDependentFields("farmerBlock");
      prevBlockIdRef.current = farmerBlock.id;
    }
  }, [farmerBlock.id, clearDependentFields]);

  useEffect(() => {
    if (disableAll) return;
    if (farmerGramPanchayat.id !== prevPanchayatIdRef.current) {
      clearDependentFields("farmerGramPanchayat");
      prevPanchayatIdRef.current = farmerGramPanchayat.id;
    }
  }, [farmerGramPanchayat.id, clearDependentFields]);

  const { data, isLoading, isError } = useCropData(schemeId, {
    cropCall: true,
  });

  const crops = data?.crops;

  if (crops) {
    farmerDistrictObject.options = filterOptions(crops, "", "district");
  }
  if (crops && farmerDistrict.id) {
    farmerBlockObject.options = filterOptions(
      crops,
      farmerDistrict.id,
      "block"
    );
  }
  if (crops && farmerBlock.id) {
    farmerPanchayatObject.options = filterOptions(
      crops,
      farmerBlock.id,
      "panchayat"
    );
  }
  if (crops && farmerGramPanchayat.id) {
    farmerVillageObject.options = filterOptions(
      crops,
      farmerGramPanchayat.id,
      "village"
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <Mapper
        parent={schemeName}
        relation={"farmerDistrict"}
        obj={scheme.properties["farmerDistrict"]}
        type={"string"}
        methods={methods}
        register={register}
        language={language}
        errors={errors}
        control={control}
        setValue={setValue}
        disableAll={disableAll || farmerDistrictObject.options?.length === 0}
      />
      <Mapper
        parent={schemeName}
        relation={"farmerBlock"}
        obj={scheme.properties["farmerBlock"]}
        type={"string"}
        methods={methods}
        register={register}
        language={language}
        errors={errors}
        control={control}
        setValue={setValue}
        disableAll={disableAll || farmerBlockObject.options?.length === 0}
      />
      <Mapper
        parent={schemeName}
        relation={"farmerGramPanchayat"}
        obj={scheme.properties["farmerGramPanchayat"]}
        type={"string"}
        methods={methods}
        register={register}
        language={language}
        errors={errors}
        control={control}
        setValue={setValue}
        disableAll={disableAll || farmerPanchayatObject.options?.length === 0}
      />
      <Mapper
        parent={schemeName}
        relation={"farmerVillage"}
        obj={scheme.properties["farmerVillage"]}
        type={"string"}
        methods={methods}
        register={register}
        language={language}
        errors={errors}
        control={control}
        setValue={setValue}
        disableAll={disableAll || farmerVillageObject.options?.length === 0}
      />
      <Mapper
        parent={schemeName}
        relation={"farmerPinCode"}
        type={"string"}
        methods={methods}
        obj={farmerPinCodeObject}
        register={methods.register}
        language={language}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll}
      />
      {isLoading ? (
        <Fade in={isLoading}>
          <Typography variant="body1" className="!mt-4" color="#FFFF00">
            {t("schemes.fetchingLocationData")}
          </Typography>
        </Fade>
      ) : isError ? (
        <Fade in={isError}>
          <Typography variant="body1" className="!mt-4" color={theme.palette.text.error}>
            {t("SOMETHING_WENT_WRONG")}
          </Typography>
        </Fade>
      ) : (
        <Fade in={!isLoading}>
          <Typography variant="body1" className="!mt-4" color="#399918">
            {t("schemes.locationDataLoaded")}
          </Typography>
        </Fade>
      )}
    </Box>
  );
}

const filterOptions = (data, parentId, currentLevel) => {
  if (!data || !Array.isArray(data)) return [];

  // Define relationships for clean and flexible mapping
  const mapping = {
    district: { parentField: null },
    block: { parentField: "district" },
    panchayat: { parentField: "block" },
    village: { parentField: "panchayat" },
  };

  const levelMapping = mapping[currentLevel];
  if (!levelMapping) throw new Error(`Invalid currentLevel: ${currentLevel}`);

  const { parentField } = levelMapping;

  const uniqueIds = {};

  // Filter items if parentField exists and parentId is provided
  const filteredArray =
    parentField && parentId
      ? data.filter((item) => item[`${parentField}Id`] === parentId)
      : data;

  // Map filtered data to unique options
  return filteredArray
    .filter((item) => {
      const id = item[`${currentLevel}Id`];
      if (uniqueIds[id]) return false;
      uniqueIds[id] = true;
      return true;
    })
    .map((obj) => ({
      id: obj[`${currentLevel}Id`],
      value: obj[`${currentLevel}Name`],
    }));
};

export default LandDetailsCustomSpecial;
