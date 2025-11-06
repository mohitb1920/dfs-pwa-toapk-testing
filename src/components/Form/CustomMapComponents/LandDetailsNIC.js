import React, { useEffect, useCallback, useRef } from "react";
import Mapper from "../Mapper";
import { Box, Fade, Typography, useTheme } from "@mui/material";
import { useQueryClient } from "react-query";
import useNICLandData from "../../../Hooks/useNICLandData";
import { useTranslation } from "react-i18next";

function LandDetailsNIC({
  scheme,
  schemeName,
  language,
  methods,
  disableAll,
  schemeId,
}) {
  const { t } = useTranslation();
  const theme = useTheme()
  const farmerGramPanchayat = methods.watch(
    `${schemeName}.farmerGramPanchayat`,
    ""
  );
  const farmerVillage = methods.watch(`${schemeName}.farmerVillage`, "");
  const {
    watch,
    setValue,
    control,
    register,
    reset,
    formState: { errors },
  } = methods;
  const farmerDistrictObject = scheme.properties["farmerDistrict"];
  if (!farmerDistrictObject.options) farmerDistrictObject.options = [];

  const farmerBlockObject = scheme.properties["farmerBlock"];
  if (!farmerBlockObject.options) farmerBlockObject.options = [];

  const farmerPanchayatObject = scheme.properties["farmerGramPanchayat"];
  if (!farmerPanchayatObject.options) farmerPanchayatObject.options = [];

  const farmerVillageObject = scheme.properties["farmerVillage"];
  if (!farmerVillageObject.options) farmerVillageObject.options = [];

  const client = useQueryClient();
  const prevPanchayatIdRef = useRef(farmerGramPanchayat.id);

  const clearDependentFields = useCallback(
    (changedField) => {
      const clearMap = {
        farmerDistrict: ["farmerBlock", "farmerGramPanchayat", "farmerVillage"],
        farmerBlock: ["farmerGramPanchayat", "farmerVillage"],
        farmerGramPanchayat: ["farmerVillage"],
      };

      clearMap[changedField]?.forEach((field) => {
        setValue(`${schemeName}.${field}`, { id: "", value: "" });
        scheme.properties[field].options = [];
      });
    },
    [schemeName, setValue, scheme]
  );

  useEffect(() => {
    if (farmerGramPanchayat.id !== prevPanchayatIdRef.current) {
      clearDependentFields("farmerGramPanchayat");
      prevPanchayatIdRef.current = farmerGramPanchayat.id;
    }
  }, [farmerGramPanchayat.id, clearDependentFields]);

  // const farmerData = JSON.parse(localStorage.getItem("farmerInfo"));
  const farmerData = methods.getValues()?.farmerData;
  const blockLg = farmerData?.Individual?.address[0]?.blockLG;

  useEffect(() => {
    setValue(`${schemeName}.farmerDistrict`, {
      id: farmerData?.Individual?.address[0]?.districtLG,
      value: farmerData?.Individual?.address[0]?.district,
    });
    setValue(`${schemeName}.farmerBlock`, {
      id: farmerData?.Individual?.address[0]?.blockLG,
      value: farmerData?.Individual?.address[0]?.block,
    });
  }, [setValue, schemeName, farmerData]);

  const data = useNICLandData(
    schemeId,
    schemeName,
    blockLg,
    farmerGramPanchayat.id,
    farmerVillage.id,
    {
      farmerPanchayatObject,
      farmerVillageObject,
    },
    methods
  );

  if (data.data?.panchayats) {
    farmerPanchayatObject.options = data.data.panchayats;
  }
  if (data.data?.villages) {
    farmerVillageObject.options = data.data.villages;
  }

  const isChecked = false;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <Mapper
        methods={methods}
        parent={schemeName}
        relation={"farmerDistrict"}
        type={"string"}
        obj={farmerDistrictObject}
        register={methods.register}
        language={language}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={
          disableAll || farmerDistrictObject.options?.length === 0 || isChecked
        }
      />
      <Mapper
        methods={methods}
        parent={schemeName}
        relation={"farmerBlock"}
        obj={farmerBlockObject}
        type={"string"}
        register={methods.register}
        language={language}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll || farmerBlockObject.options?.length === 0}
      />
      <Mapper
        methods={methods}
        parent={schemeName}
        relation={"farmerGramPanchayat"}
        obj={farmerPanchayatObject}
        type={"string"}
        register={methods.register}
        language={language}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll || farmerPanchayatObject.options?.length === 0}
      />
      <Mapper
        methods={methods}
        parent={schemeName}
        relation={"farmerVillage"}
        type={"string"}
        obj={farmerVillageObject}
        register={methods.register}
        language={language}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll || farmerVillageObject.options?.length === 0}
      />

      {data.isLoading ? (
        <Fade in={data.isLoading}>
          <Typography variant="body1" className="!mt-4" color="#FFFF00">
            {t("schemes.fetchingLocationData")}
          </Typography>
        </Fade>
      ) : data.isLoadingError ? (
        <Fade in={data.isLoadingError}>
          <Typography variant="body1" className="!mt-4" color={theme.palette.text.error}>
            {t("SOMETHING_WENT_WRONG")}
          </Typography>
        </Fade>
      ) : (
        <Fade in={!(data.isLoading || data.isLoadingError)}>
          <Typography variant="body1" className="!mt-4" color="#399918">
            {t("schemes.locationDataLoaded")}
          </Typography>
        </Fade>
      )}
    </Box>
  );
}

export default LandDetailsNIC;
