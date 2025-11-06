import { useEffect, useRef } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Mapper from "../Mapper";
import useCropData from "../../../Hooks/useCropData";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

function MakhanaComponentsAndLandDescription({
  scheme,
  schemeId,
  schemeName,
  language,
  methods,
  disableAll,
  rawErrors,
}) {
  const { errors, setValue, watch, setError, clearErrors, control } = methods;
  const selectedPartTarget = (`${schemeName}.` + (schemeName === "appliedComponentScreenHorti"
      ? "farmerPartName"
      : "component"));
  const selectedPart = methods.watch(selectedPartTarget,"");

  const groupDetailsWatch = useWatch({
    control,
    name: `${schemeName}.groupDetails`,
  });

  const farmerLandTypeTarget =
    `${schemeName}.` + (schemeName === "appliedComponentScreenHorti"
      ? "farmerLandType"
      : "farmerType");
  const farmerLandType = methods.watch(farmerLandTypeTarget);
  const farmerPartNameObject =
    scheme.properties[(schemeName === "appliedComponentScreenHorti" ? "farmerPartName" : "component")];

  useEffect(() => {
    if (disableAll) return;
    clearErrors("componentsAndLandDescription.appliedHortiArea");
  }, [selectedPart.id, clearErrors, disableAll]);
  const previousPartId = useRef(selectedPart.id);
  useEffect(() => {
    if (disableAll) return;
    if (selectedPart.id !== previousPartId.current) {
      methods.setValue(`${schemeName}.groupDetails`, []);
      methods.trigger(`${schemeName}.groupDetails`);
      previousPartId.current = selectedPart.id;
    }
  }, [selectedPart.id, methods, disableAll, previousPartId]);
  const data = useCropData(schemeId, { cropCall: true });
  const district = methods.watch("landDetails.farmerDistrict", "");
  const prevDistrictRef = useRef(district);

  useEffect(() => {
    if (disableAll) return;

    if (district !== prevDistrictRef.current && district !== "") {
      methods.setValue(selectedPartTarget, {});
      methods.setValue("componentsAndLandDescription.appliedHortiArea", "");
      methods.setValue(farmerLandTypeTarget, "");
      methods.setValue(`${schemeName}.groupDetails`, []);
    }
    prevDistrictRef.current = district;
  }, [district, methods, disableAll]);

  let selectedCrop;
  if (["SCHEME014","SCHEME064"].includes(schemeId))
    if (data?.data?.crops) {
      farmerPartNameObject.options = data?.data?.crops;
      const filteredCrops = data.data.crops.filter(
        (crop) => crop.district === district.id
      );
      selectedCrop = filteredCrops.find((item) => item.id === selectedPart.id);
      farmerPartNameObject.options = filteredCrops;
    }
  useEffect(() => {
    if (disableAll) return;
    const totalArea = groupDetailsWatch?.reduce((sum, farmer) => {
      const area = parseFloat(farmer.farmerLandArea);
      return sum + (isNaN(area) ? 0 : area);
    }, 0);

    setValue("componentsAndLandDescription.totalArea", totalArea);
    if (selectedCrop && totalArea > selectedCrop.max && ["SCHEME014"].includes(schemeId)) {
      setError("componentsAndLandDescription.totalArea", {
        type: "manual",
        message: `Total area should not exceed ${selectedCrop.max} acres`,
      });
    } else {
      clearErrors("componentsAndLandDescription.totalArea");
    }
  }, [
    groupDetailsWatch,
    setValue,
    methods,
    disableAll,
    selectedCrop,
    setError,
    clearErrors,
  ]);

  const { t } = useTranslation();
  const theme = useTheme();

  const previousFarmerLandType = useRef(farmerLandType?.id);

  useEffect(() => {
    if (farmerLandType?.id !== previousFarmerLandType.current) {
      methods.setValue("requiredDocuments.LandDoc", []);
      previousFarmerLandType.current = farmerLandType.id;
    }
  }, [farmerLandType?.id,methods]);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
        <Mapper
          parent={schemeName}
          relation={"irrigationSource"}
          type={"string"}
          schemeId={schemeId}
          obj={scheme.properties["irrigationSource"]}
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
        <Mapper
          parent={schemeName}
          relation={"irrigationPump"}
          type={"string"}
          schemeId={schemeId}
          obj={scheme.properties["irrigationPump"]}
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
        <Mapper
          methods={methods}
          parent={schemeName}
          relation={
            schemeName === "appliedComponentScreenHorti"
              ? "farmerPartName"
              : "component"
          }
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
        <Mapper
          parent={schemeName}
          relation={
            schemeName === "appliedComponentScreenHorti"
              ? "farmerLandType"
              : "farmerType"
          }
          type={"string"}
          schemeId={schemeId}
          obj={
            scheme.properties[
              schemeName === "appliedComponentScreenHorti"
                ? "farmerLandType"
                : "farmerType"
            ]
          }
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
        <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Typography
            variant="h6"
            className="input-label w-fit !mx-auto"
            color={theme.palette.text.primary}
          >
            {t("schemes.totalAreaAcre", {
              area: watch("componentsAndLandDescription.totalArea", 0).toFixed(
                2
              ),
            })}
          </Typography>
          {methods.formState.errors.componentsAndLandDescription?.totalArea && (
            <Typography
              color={theme.palette.text.error}
              sx={{ fontSize: "0.8rem", margin: "auto" }}
            >
              {t("schemeErrors.totalAreaError", {
                max: parseFloat(selectedCrop.max).toFixed(2),
              })}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
}

export default MakhanaComponentsAndLandDescription;
