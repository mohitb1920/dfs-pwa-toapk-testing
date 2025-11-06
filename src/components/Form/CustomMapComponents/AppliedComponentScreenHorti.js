import { useEffect, useRef } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Mapper from "../Mapper";
import useCropData from "../../../Hooks/useCropData";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

function AppliedComponentSchemeHorti({
  scheme,
  schemeId,
  schemeName,
  language,
  methods,
  disableAll,
  rawErrors,
}) {
  const { errors, setValue, watch, clearErrors, control } = methods;
  const selectedPart = methods.watch(
    "appliedComponentScreenHorti.farmerPartName",
    ""
  );
  const groupDetailsWatch = useWatch({
    control,
    name: "appliedComponentScreenHorti.groupDetails",
  });
  const farmerLandType = methods.watch(`${schemeName}.farmerLandType`);
  const farmerPartNameObject = scheme.properties["farmerPartName"];
  const appliedHortiArea = scheme.properties["appliedHortiArea"];

  const isStaticData = [
    "SCHEME057",
    "SCHEME058",
    "SCHEME059",
    "SCHEME060",
  ].includes(schemeId);

  useEffect(() => {
    if (disableAll) return;
    clearErrors("appliedComponentScreenHorti.appliedHortiArea");
  }, [selectedPart.id, clearErrors, disableAll]);
  const previousPartId = useRef(selectedPart.id);
  useEffect(() => {
    if (disableAll) return;

    if (selectedPart.id !== previousPartId.current && selectedPart?.id !== "") {
      methods.setValue("appliedComponentScreenHorti.groupDetails", []);
      methods.trigger("appliedComponentScreenHorti.groupDetails");
      previousPartId.current = selectedPart.id;
    }
  }, [selectedPart.id, methods, disableAll, previousPartId]);
  const data = useCropData(schemeId, { cropCall: true });
  const district = methods.watch("landDetails.farmerDistrict", "");
  const prevDistrictRef = useRef(district);

  useEffect(() => {
    if (disableAll) return;

    if (
      district !== prevDistrictRef.current &&
      (district?.id !== prevDistrictRef.current?.id) &&
      district !== "" &&
      district?.id !== ""
    ) {
      methods.setValue("appliedComponentScreenHorti.farmerPartName", {});
      methods.setValue("appliedComponentScreenHorti.appliedHortiArea", "");
      methods.setValue("appliedComponentScreenHorti.farmerLandType", "");
      methods.setValue("appliedComponentScreenHorti.groupDetails", []);
    }
    prevDistrictRef.current = district;
  }, [district, methods, disableAll]);

  if (
    [
      "SCHEME030",
      "SCHEME036",
      "SCHEME022",
      "SCHEME016",
      "SCHEME014",
      "SCHEME032",
      "SCHEME033",
      "SCHEME045",
      "SCHEME046",
      "SCHEME048",
      "SCHEME049",
      "SCHEME050",
      "SCHEME052",
      "SCHEME057",
      "SCHEME058",
      "SCHEME059",
      "SCHEME063",
    ].includes(schemeId)
  ) {
    if (data?.data?.crops) {
      farmerPartNameObject.options = data?.data?.crops;
      if (data.data.crops?.[0]?.min)
        appliedHortiArea.minimum = parseFloat(data.data.crops[0].min);
      if (data.data.crops?.[0]?.max)
        appliedHortiArea.maximum = parseFloat(data.data.crops[0].max);
      const filteredCrops = data.data.crops.filter(
        (crop) => crop.district === district.id
      );
      const selectedCrop = filteredCrops.find(
        (item) => item.id === selectedPart.id
      );
      farmerPartNameObject.options = filteredCrops;
      if (selectedCrop && selectedCrop.min)
        appliedHortiArea.minimum = parseFloat(selectedCrop.min);
      if (selectedCrop && selectedCrop.max)
        appliedHortiArea.maximum = parseFloat(selectedCrop.max);
    }
  }

  useEffect(() => {
    if (disableAll) return;

    const totalArea = groupDetailsWatch?.reduce((sum, farmer) => {
      const area = parseFloat(farmer.farmerLandArea);
      return sum + (isNaN(area) ? 0 : area);
    }, 0);

    setValue("appliedComponentScreenHorti.totalArea", totalArea);
    if (groupDetailsWatch?.length > 0)
      methods.trigger("appliedComponentScreenHorti.appliedHortiArea");
  }, [groupDetailsWatch, setValue, methods, disableAll]);

  const previousFarmerLandType = useRef(farmerLandType?.id);

  useEffect(() => {
    if (disableAll) return;

    if (farmerLandType?.id !== previousFarmerLandType.current) {
      methods.setValue("requiredDocuments.LandDoc", []);
      previousFarmerLandType.current = farmerLandType.id;
    }
  }, [farmerLandType?.id, disableAll]);

  const { t } = useTranslation();
  const theme = useTheme();

  const isAppliedAreaVisible =
    (disableAll && selectedPart?.value) ||
    isStaticData ||
    (selectedPart &&
      selectedPart.index !== "" &&
      selectedPart.index <
        (farmerPartNameObject.options.length ||
          farmerPartNameObject.options.en?.length));

  return (
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
        <Mapper
          methods={methods}
          parent={schemeName}
          relation={"farmerPartName"}
          type={"string"}
          schemeId={schemeId}
          obj={farmerPartNameObject}
          register={methods.register}
          language={language}
          errors={errors}
          control={methods.control}
          reset={methods.reset}
          setValue={methods.setValue}
          disableAll={disableAll}
          watch={methods.watch}
        />
        {isAppliedAreaVisible && (
          <Mapper
            parent={schemeName}
            methods={methods}
            relation={"appliedHortiArea"}
            type={"string"}
            schemeId={schemeId}
            obj={appliedHortiArea}
            register={methods.register}
            language={language}
            errors={errors}
            control={methods.control}
            reset={methods.reset}
            setValue={methods.setValue}
            disableAll={disableAll}
            watch={methods.watch}
            maxLength={5}
          />
        )}
        <Mapper
          parent={schemeName}
          relation={"farmerLandType"}
          type={"string"}
          schemeId={schemeId}
          obj={scheme.properties["farmerLandType"]}
          register={methods.register}
          language={language}
          errors={rawErrors}
          control={methods.control}
          reset={methods.reset}
          setValue={methods.setValue}
          disableAll={disableAll}
          watch={methods.watch}
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
          schemeId={schemeId}
          obj={scheme.properties["groupDetails"]}
          register={methods.register}
          language={language}
          errors={errors}
          control={methods.control}
          reset={methods.reset}
          setValue={methods.setValue}
          disableAll={disableAll}
          watch={methods.watch}
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
}

export default AppliedComponentSchemeHorti;
