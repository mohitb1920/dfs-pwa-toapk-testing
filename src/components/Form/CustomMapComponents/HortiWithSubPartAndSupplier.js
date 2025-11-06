import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useRef } from "react";
import { useWatch } from "react-hook-form";
import Mapper from "../Mapper";
import useCropData from "../../../Hooks/useCropData";
import useCompanyData from "../../../Hooks/useCompanyData";
import { useTranslation } from "react-i18next";
import { convertToAcre } from "../../Utils";

const HortiWithSubPartAndSupplier = ({
  scheme,
  schemeId,
  schemeName,
  language,
  methods,
  disableAll,
  rawErrors,
}) => {
  const { errors, setValue, watch, control } = methods;
  const theme = useTheme();
  const { t } = useTranslation();

  // Registering fields for triggering re-renders
  const [
    partName,
    subPartName,
    supplier,
    appliedArea,
    farmerLandType,
    groupDetails,
  ] = useWatch({
    control,
    name: [
      "appliedComponentScreenHorti.farmerPartName",
      "appliedComponentScreenHorti.farmerSubPartName",
      "appliedComponentScreenHorti.supplierName",
      "appliedComponentScreenHorti.appliedHortiArea",
      "appliedComponentScreenHorti.farmerLandType",
      "appliedComponentScreenHorti.groupDetails",
    ],
  });
  const district = useWatch({ control, name: "landDetails.farmerDistrict", defaultValue: "" });

  // Initializing variables
  const farmerPartName = scheme?.properties?.farmerPartName;
  const appliedHortiArea = scheme.properties["appliedHortiArea"];
  const farmerSubPartName = scheme.properties["farmerSubPartName"];
  const supplierName = scheme.properties["supplierName"];
  const prevDistrictRef = useRef(district);
  const prevPartNameRef = useRef(partName);
  const previousFarmerLandType = useRef(farmerLandType?.id);

  // Extracting the sub-component mappings
  const subComponentMappings = farmerSubPartName?.dependency?.cropCode;
  const subComponentArray = useMemo(() => {
    return [...new Set(Object.values(subComponentMappings).flat())];
  }, [subComponentMappings]);

  // Extracting the component to be shown based on district
  const data = useCropData(schemeId, { cropCall: true, companyCall:true }, {}, partName?.id);
  const companyData = useCompanyData(schemeId, partName?.id);

  // Calculating the total area
  useEffect(() => {
    if (disableAll) return;

    const totalArea = groupDetails?.reduce((sum, farmer) => {
      const area = parseFloat(farmer.farmerLandArea);
      return sum + (isNaN(area) ? 0 : area);
    }, 0);

    setValue("appliedComponentScreenHorti.totalArea", totalArea);
    if (groupDetails?.length > 0){
      methods.trigger("appliedComponentScreenHorti.appliedHortiArea");
    }
  }, [groupDetails, setValue, methods, disableAll]);

  // Resetting the form fields when district changes
  useEffect(() => {
    if (disableAll) return;

    if (
      district !== prevDistrictRef.current &&
      district !== "" &&
      district?.id !== ""
    ) {
      setValue("appliedComponentScreenHorti.farmerPartName", {});
      setValue("appliedComponentScreenHorti.farmerSubPartName", {});
      setValue("appliedComponentScreenHorti.supplierName", {});
      setValue("appliedComponentScreenHorti.appliedHortiArea", "");
      setValue("appliedComponentScreenHorti.farmerLandType", "");
      setValue("appliedComponentScreenHorti.groupDetails", []);
    }
    prevDistrictRef.current = district;
  }, [district, disableAll, setValue]);

  // Resetting fields when partName changes
  useEffect(() => {
    if (disableAll) return;

    if ( partName?.id !== prevPartNameRef.current?.id) {
      setValue("appliedComponentScreenHorti.farmerSubPartName", {});
      setValue("appliedComponentScreenHorti.supplierName", {});
    }
    prevPartNameRef.current = partName;
  }, [partName, disableAll, setValue]);

  // Setting dropdown options, min and max for appliedHortiArea
  if (["SCHEME060", "SCHEME062"].includes(schemeId)) {
    if (data?.data?.crops) {
      farmerPartName.options = data?.data?.crops;
      if (data.data.crops?.[0]?.min)
        appliedHortiArea.minimum = convertToAcre(parseFloat(data.data.crops[0].min),data.data.crops[0].cropUnit);
      if (data.data.crops?.[0]?.max)
        appliedHortiArea.maximum = convertToAcre(
          parseFloat(data.data.crops[0].max),
          data.data.crops[0].cropUnit
        );
      const filteredCrops = data.data.crops.filter(
        (crop) =>
          crop.district === district.id && !subComponentArray.includes(crop.id)
      );
      const selectedCrop = filteredCrops.find(
        (item) => item?.id === partName?.id
      );
      farmerPartName.options = filteredCrops;
      if (selectedCrop?.min)
        appliedHortiArea.minimum = convertToAcre(parseFloat(selectedCrop.min),selectedCrop.cropUnit);
      if (selectedCrop?.max)
        appliedHortiArea.maximum = convertToAcre(
          parseFloat(selectedCrop.max),
          selectedCrop.cropUnit
        );
      const subCropIds = subComponentMappings?.[selectedCrop?.id] || [];
      const filteredSubCrops = data.data.crops.filter(
        (crop) => subCropIds.includes(crop.id) && crop.district === district.id
      );
      farmerSubPartName.options = filteredSubCrops;
    }
    if(companyData?.data){
        supplierName.options = companyData?.data;
    }
  }

  // resetting land doc when farmerLandType changes
  useEffect(() => {
    if (farmerLandType?.id !== previousFarmerLandType.current) {
      setValue("requiredDocuments.LandDoc", []);
      previousFarmerLandType.current = farmerLandType?.id;
    }
  }, [farmerLandType?.id,setValue]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
      <Mapper
        methods={methods}
        parent={schemeName}
        relation={"farmerPartName"}
        type={"string"}
        schemeId={schemeId}
        obj={farmerPartName}
        register={methods.register}
        language={language}
        errors={errors}
        control={control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll}
        watch={useWatch}
      />
      {farmerSubPartName.options?.length !== 0 && (
        <Mapper
          methods={methods}
          parent={schemeName}
          relation={"farmerSubPartName"}
          type={"string"}
          schemeId={schemeId}
          obj={scheme.properties.farmerSubPartName}
          required={farmerSubPartName.options?.length !== 0}
          register={methods.register}
          language={language}
          errors={errors}
          control={control}
          reset={methods.reset}
          setValue={methods.setValue}
          disableAll={disableAll}
          watch={useWatch}
        />
      )}
      <Mapper
        methods={methods}
        parent={schemeName}
        relation={"supplierName"}
        type={"string"}
        schemeId={schemeId}
        obj={scheme.properties.supplierName}
        register={methods.register}
        language={language}
        errors={errors}
        control={control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll}
        watch={useWatch}
      />
      {
        supplier?.id && (<Box className="flex flex-col">
          <Typography variant="caption">{t("address")}: {supplier.address}</Typography>
          <Typography variant="caption">{t("farmerRegistration.MOBILE_NUMBER")}: {supplier.mobileNumber}</Typography>
        </Box>)
      }
      <Mapper
        methods={methods}
        parent={schemeName}
        relation={"appliedHortiArea"}
        type={"string"}
        schemeId={schemeId}
        obj={appliedHortiArea}
        register={methods.register}
        language={language}
        errors={errors}
        control={control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll}
        watch={useWatch}
      />
      <Mapper
        parent={schemeName}
        relation={"farmerLandType"}
        type={"string"}
        schemeId={schemeId}
        obj={scheme.properties["farmerLandType"]}
        register={methods.register}
        language={language}
        errors={rawErrors}
        control={control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll}
        watch={useWatch}
        methods={methods}
      />

      {(farmerLandType?.value === "Gair-Ryot" ||
        farmerLandType?.value === "Gair-Raiyat" ||
        farmerLandType?.value === "गैर-रैयत") && (
        <Mapper
          parent={schemeName}
          relation={"labelLink"}
          obj={scheme.properties["labelLink"]}
          type={"label"}
          register={methods.register}
          language={language}
          errors={errors}
          control={control}
          reset={methods.reset}
          setValue={methods.setValue}
          disableAll={disableAll}
          linkTitle={scheme.properties["labelLink"][`titleName-${language}`]}
          methods={methods}
        />
      )}

      <Mapper
        parent={schemeName}
        relation={"groupDetails"}
        type={"subGroup"}
        schemeId={schemeId}
        obj={scheme.properties["groupDetails"]}
        register={methods.register}
        language={language}
        errors={errors}
        control={control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll}
        watch={useWatch}
        methods={methods}
      />
      <Typography
        variant="h6"
        className="input-label w-fit !mx-auto"
        color={theme.palette.text.primary}
      >
        {t("schemes.totalAreaAcre", {
          area: watch("appliedComponentScreenHorti.totalArea", 0).toFixed(2),
        })}
      </Typography>
    </Box>
  );
};

export default HortiWithSubPartAndSupplier;
