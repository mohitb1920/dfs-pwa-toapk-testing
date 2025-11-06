import React, { useEffect, useCallback, useRef } from "react";
import useLandData from "../../../Hooks/useLandData";
import Mapper from "../Mapper";
import { Box, Fade, Typography, useTheme } from "@mui/material";
import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";

function LandDetailsCustom({
  scheme,
  schemeName,
  language,
  methods,
  disableAll,
  schemeId,
}) {
  const { t } = useTranslation();
  const theme = useTheme()
  const sameAddress = methods.watch(`${schemeName}.sameAddress`, "");
  const farmerDistrict = methods.watch(`${schemeName}.farmerDistrict`, "");
  const farmerBlock = methods.watch(`${schemeName}.farmerBlock`, "");
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

  const farmerPinCodeObject = scheme.properties["farmerPinCode"];
  farmerPinCodeObject.requiredLength = 6;
  const client = useQueryClient();
  const prevDistrictIdRef = useRef(farmerDistrict.id);
  const prevBlockIdRef = useRef(farmerBlock.id);
  const prevPanchayatIdRef = useRef(farmerGramPanchayat.id);

  const prevSameAddressRef = useRef(sameAddress);
  const clearDependentFields = useCallback(
    (changedField) => {
      if (disableAll) return;
      if (sameAddress) return;
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
    [schemeName, setValue, scheme, sameAddress]
  );

  useEffect(() => {
    if (disableAll) return;
    if (farmerDistrict.id !== prevDistrictIdRef.current) {
      client?.invalidateQueries(["fetchLocationData", schemeId]);
      clearDependentFields("farmerDistrict");
      prevDistrictIdRef.current = farmerDistrict.id;
    }
  }, [farmerDistrict.id, client, schemeId, clearDependentFields]);

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

  const data = useLandData(
    schemeId,
    schemeName,
    farmerDistrict.id,
    farmerBlock.id,
    farmerGramPanchayat.id,
    farmerVillage.id,
    sameAddress,
    {
      farmerDistrictObject,
      farmerBlockObject,
      farmerPanchayatObject,
      farmerVillageObject,
    },
    methods
  );

  useEffect(() => {
    if (disableAll) return;

    const handleSameAddressTrue = () => {
      const farmerData = methods.getValues()?.farmerData;
      const districtLg = farmerData?.Individual?.address?.[0]?.districtLG;

      if (data.data?.districts) {
        const isPresent =
          data.data?.districts.some((district) => district.id === districtLg)

        if (isPresent) {
          farmerDistrictObject.options = [];
          farmerBlockObject.options = [];
          farmerPanchayatObject.options = [];
          farmerVillageObject.options = [];

          methods.setValue(`${schemeName}.farmerDistrict`, {
            id: districtLg,
            value: farmerData?.Individual?.address?.[0]?.district,
          });
          methods.setValue(`${schemeName}.farmerBlock`, {
            id: farmerData?.Individual?.address?.[0]?.blockLG,
            value: farmerData?.Individual?.address?.[0]?.block,
          });
          methods.setValue(`${schemeName}.farmerGramPanchayat`, {
            id: farmerData?.Individual?.address?.[0]?.panchayatLG,
            value: farmerData?.Individual?.address?.[0]?.panchayat,
          });
          methods.setValue(`${schemeName}.farmerVillage`, {
            id: farmerData?.Individual?.address?.[0]?.villageLG,
            value: farmerData?.Individual?.address?.[0]?.village,
          });
          methods.clearErrors(`${schemeName}`);
        } else {
          methods.setValue(`${schemeName}.sameAddress`, false);
          methods.setError(`${schemeName}.sameAddress`, {
            type: "manual",
            message: `${t("schemeErrors.districtNotEligible")}`,
          });
        }
      }
    };

    // Only clear fields if transitioning from sameAddress true to false
    if (!sameAddress && prevSameAddressRef.current) {
      farmerDistrictObject.options = [];
      farmerBlockObject.options = [];
      farmerPanchayatObject.options = [];
      farmerVillageObject.options = [];

      methods.setValue(`${schemeName}.farmerDistrict`, { id: "", value: "" });
      methods.setValue(`${schemeName}.farmerBlock`, { id: "", value: "" });
      methods.setValue(`${schemeName}.farmerGramPanchayat`, {
        id: "",
        value: "",
      });
      methods.setValue(`${schemeName}.farmerVillage`, { id: "", value: "" });
      farmerDistrictObject.options = [];
      farmerBlockObject.options = [];
      farmerPanchayatObject.options = [];
      farmerVillageObject.options = [];
    } else if (sameAddress) {
      handleSameAddressTrue();
    }

    // Update the previous sameAddress value
    prevSameAddressRef.current = sameAddress;
  }, [sameAddress, data.data?.districts]);

  if (data.data?.districts && !sameAddress) {
    farmerDistrictObject.options = data.data.districts;
  }
  if (data.data?.blocks && !sameAddress) {
    farmerBlockObject.options = data.data.blocks || [];
  }
  if (data.data?.panchayats && !sameAddress) {
    farmerPanchayatObject.options = data.data.panchayats;
  }
  if (data.data?.villages && !sameAddress) {
    farmerVillageObject.options = data.data.villages;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
      <Mapper
        parent={schemeName}
        relation={"sameAddress"}
        obj={scheme.properties["sameAddress"]}
        schemeId={schemeId}
        type={"checkbox"}
        methods={methods}
        register={methods.register}
        language={language}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll}
      />
      <Mapper
        parent={schemeName}
        relation={"farmerDistrict"}
        type={"string"}
        methods={methods}
        obj={farmerDistrictObject}
        register={methods.register}
        language={language}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll || farmerDistrictObject.options?.length === 0}
      />
      <Mapper
        parent={schemeName}
        relation={"farmerBlock"}
        obj={farmerBlockObject}
        methods={methods}
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
        parent={schemeName}
        relation={"farmerGramPanchayat"}
        obj={farmerPanchayatObject}
        methods={methods}
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
        parent={schemeName}
        relation={"farmerVillage"}
        type={"string"}
        methods={methods}
        obj={farmerVillageObject}
        register={methods.register}
        language={language}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        setValue={methods.setValue}
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
      {!disableAll &&
        (data.isLoading ? (
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
        ))}
    </Box>
  );
}

export default LandDetailsCustom;
