import { useEffect, useRef } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Mapper from "../Mapper";
import useCropData from "../../../Hooks/useCropData";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { type } from "@testing-library/user-event/dist/cjs/utility/type.js";

function AppliedComponentSchemeHortiKela({
  scheme,
  schemeId,
  schemeName,
  language,
  methods,
  disableAll,
  rawErrors,
}) {
  const { errors, watch, setValue, setError, clearErrors, control } = methods;
  const { t } = useTranslation();
  const theme = useTheme();

  // Using useWatch instead of methods.watch
  const selectedPart = useWatch({
    control,
    name: "appliedComponentScreenHorti.farmerPartName",
  });

  const groupDetailsWatch = useWatch({
    control,
    name: "appliedComponentScreenHorti.groupDetails",
  });

  const strainDetailsWatch = useWatch({
    control,
    name: "appliedComponentScreenHorti.bananaDetails",
    defaultValue: [],
  });

  const farmerLandType = useWatch({
    control,
    name: `${schemeName}.farmerLandType`,
  });

  const district = useWatch({
    control,
    name: "landDetails.farmerDistrict",
  });

  const totalArea = useWatch({
    control,
    name: "appliedComponentScreenHorti.totalArea",
    defaultValue: 0,
  }).toFixed(2);

  const totalAppliedArea = useWatch({
    control,
    name: "appliedComponentScreenHorti.totalAppliedArea",
    defaultValue: 0,
  }).toFixed(2);

  // Scheme-related data
  const farmerPartNameObject = scheme.properties["farmerPartName"];
  const appliedHortiArea = scheme.properties["appliedHortiArea"];
  const data = useCropData(schemeId, { cropCall: true });
  const isBanana = selectedPart?.id === "507";

  const previousPartId = useRef(selectedPart?.id);
  const prevDistrictRef = useRef(district);

  const previousFarmerLandType = useRef(farmerLandType?.id);

  // Clear errors when farmer part changes
  useEffect(() => {
    if (!disableAll) {
      if (isBanana)
        methods.setValue(
          "appliedComponentScreenHorti.appliedHortiArea",
          undefined
        );
      clearErrors("appliedComponentScreenHorti.appliedHortiArea");
    }
  }, [selectedPart?.id, isBanana, clearErrors, disableAll]);

  // Reset group details and trigger validation when farmer part changes
  useEffect(() => {
    if (!disableAll && selectedPart?.id !== previousPartId.current) {
      methods.setValue("appliedComponentScreenHorti.groupDetails", []);
      methods.trigger("appliedComponentScreenHorti.groupDetails");
      methods.setValue("appliedComponentScreenHorti.bananaDetails", []);
      methods.trigger("appliedComponentScreenHorti.bananaDetails");
      previousPartId.current = selectedPart?.id;
    }
  }, [selectedPart?.id, methods, disableAll]);

  // Handle district change and reset relevant fields
  useEffect(() => {
    if (
      !disableAll &&
      district !== prevDistrictRef.current &&
      district !== ""
    ) {
      methods.setValue("appliedComponentScreenHorti.farmerPartName", {});
      methods.setValue("appliedComponentScreenHorti.appliedHortiArea", "");
      methods.setValue("appliedComponentScreenHorti.farmerLandType", "");
      methods.setValue("appliedComponentScreenHorti.groupDetails", []);
      methods.setValue("appliedComponentScreenHorti.bananaDetails", []);
    }
    prevDistrictRef.current = district;
  }, [district, methods, disableAll]);

  let selectedCrop;

  // Update farmer part options and applied area limits based on scheme data
  useEffect(() => {
    if (["SCHEME031", "SCHEME033"].includes(schemeId) && data?.data?.crops) {
      farmerPartNameObject.options = data.data.crops;

      if (selectedCrop && !isBanana && data.data.crops?.[0]?.min) {
        appliedHortiArea.minimum = parseFloat(data.data.crops?.[0]?.min);
      }

      if (selectedCrop && !isBanana && data.data.crops?.[0]?.max) {
        appliedHortiArea.maximum = parseFloat(data.data.crops[0].max);
      }

      const filteredCrops = data.data.crops.filter(
        (crop) => crop.district === district?.id
      );
      selectedCrop = filteredCrops.find((item) => item.id === selectedPart?.id);

      farmerPartNameObject.options = filteredCrops;

      if (selectedCrop && !isBanana && selectedCrop?.min) {
        appliedHortiArea.minimum = parseFloat(selectedCrop.min);
      }

      if (selectedCrop && !isBanana && selectedCrop?.max) {
        appliedHortiArea.maximum = parseFloat(selectedCrop.max);
      }
    }
  }, [data, selectedPart?.id, district, schemeId]);

  if (["SCHEME031", "SCHEME033"].includes(schemeId))
    if (data?.data?.crops) {
      const filteredCrops = data.data.crops.filter(
        (crop) => crop.district === district?.id
      );
      selectedCrop = filteredCrops.find(
        (item) => item?.id === selectedPart?.id
      );
    }

  // Calculate total area based on group details and trigger validations
  useEffect(() => {
    if (!disableAll) {
      const totalArea = groupDetailsWatch?.reduce((sum, farmer) => {
        const area = parseFloat(farmer.farmerLandArea);
        return sum + (isNaN(area) ? 0 : area);
      }, 0);

      if (totalArea <= selectedCrop?.max)
        setValue("appliedComponentScreenHorti.totalArea", totalArea);
      else setValue("appliedComponentScreenHorti.totalArea", 0);

      methods.trigger("appliedComponentScreenHorti.appliedHortiArea");

      if (selectedCrop && totalArea > selectedCrop.max) {
        setError("componentsAndLandDescription.totalArea", {
          type: "manual",
          message: `Total area should not exceed ${selectedCrop.max} acres`,
        });
      } else {
        clearErrors("componentsAndLandDescription.totalArea");
      }
    }
  }, [groupDetailsWatch, setValue, methods, disableAll, setError, clearErrors]);

  // Calculate total area based on group details and trigger validations
  useEffect(() => {
    if (!disableAll) {
      const totalAppliedArea = strainDetailsWatch?.reduce((sum, farmer) => {
        const area = parseFloat(farmer["appliedAreaBanana"]);
        return sum + (isNaN(area) ? 0 : area);
      }, 0);

      setValue(
        "appliedComponentScreenHorti.totalAppliedArea",
        totalAppliedArea
      );

      if (selectedCrop && !isBanana) {
        clearErrors("appliedComponentScreenHorti.bananaDetails");
      }

      if (
        isBanana &&
        totalAppliedArea < selectedCrop.min
      ) {
        setError("appliedComponentScreenHorti.totalAppliedArea", {
          type: "manual",
          message: `MinError`,
        });
      } else {
        clearErrors("appliedComponentScreenHorti.totalAppliedArea");
      }

      if (totalAppliedArea > totalArea) {
        methods.setError("appliedComponentScreenHorti.totalAppliedArea", {
          type: "manual",
          message: "Applied Area must be lesser than Total area.",
        });
      } else if (selectedCrop && totalAppliedArea >= selectedCrop.min) {
        methods.clearErrors("appliedComponentScreenHorti.totalAppliedArea");
      }
    }
  }, [
    strainDetailsWatch,
    setValue,
    methods,
    totalArea,
    totalAppliedArea,
    disableAll,
  ]);

  useEffect(() => {
    if (disableAll) return;

    if (farmerLandType?.id !== previousFarmerLandType.current) {
      methods.setValue("requiredDocuments.LandDoc", []);
      previousFarmerLandType.current = farmerLandType.id;
    }
  }, [farmerLandType?.id, disableAll]);

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
        control={control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll}
        watch={useWatch}
      />

      {selectedPart?.value && !isBanana && (
        <Mapper
          parent={schemeName}
          methods={methods}
          relation={"appliedHortiArea"}
          type={"string"}
          schemeId={schemeId}
          obj={{
            ...appliedHortiArea,
            totalArea: totalArea,
          }}
          register={methods.register}
          language={language}
          errors={errors}
          control={control}
          reset={methods.reset}
          setValue={methods.setValue}
          disableAll={disableAll}
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

      <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* ... (rest of the JSX remains the same) ... */}
        <Typography
          variant="h6"
          className="input-label w-fit !mx-auto"
          color={theme.palette.text.primary}
        >
          {t("schemes.totalAreaAcre", {
            area: totalArea,
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

      {selectedPart?.value && isBanana && (
        <>
          <Mapper
            parent={schemeName}
            relation={"bananaDetails"}
            type={"subGroup"}
            schemeId={schemeId}
            obj={scheme.properties["bananaDetails"]}
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
            {t("schemes.totalAppliedAreaAcre", {
              area: totalAppliedArea,
            })}
          </Typography>

          {methods.formState.errors.appliedComponentScreenHorti
            ?.totalAppliedArea && (
            <Typography
              color={theme.palette.text.error}
              sx={{ fontSize: "0.8rem", margin: "auto" }}
            >
              {methods.formState.errors.appliedComponentScreenHorti
                ?.totalAppliedArea.message === "MinError"
                ? t("schemeErrors.minValueError", { min: selectedCrop.min })
                : t("schemeErrors.totalAppliedAreaError", {
                    max: parseFloat(totalArea).toFixed(2),
                  })}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}

export default AppliedComponentSchemeHortiKela;
