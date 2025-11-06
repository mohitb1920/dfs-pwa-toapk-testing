import { useEffect, useRef } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import Mapper from "../Mapper";
import { useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

function AppliedComponentsSabji2({
  scheme,
  schemeId,
  schemeName,
  language,
  methods,
  disableAll,
  rawErrors,
}) {
  const { errors, setValue, watch, clearErrors, control } = methods;
  const { t } = useTranslation();
  const theme = useTheme();
  const groupDetailsWatch = useWatch({
    control,
    name: "appliedComponentsSabji2.groupDetails",
  });
  const farmerLandType = methods.watch(`${schemeName}.farmerLandType`);

  const selectedAreaApplied = useWatch({
    control,
    name: "appliedComponentsSabji.areaApplied",
  });

  
  useEffect(() => {
    if (disableAll) return;
    
    const totalArea = groupDetailsWatch?.reduce((sum, farmer) => {
      const area = parseFloat(farmer.farmerLandArea);
      return sum + (isNaN(area) ? 0 : area);
    }, 0);
    
    setValue("appliedComponentsSabji2.totalArea", totalArea);
    
    // Compare totalArea and selectedAreaApplied.value
    if (groupDetailsWatch?.length > 0 && parseFloat(selectedAreaApplied?.value) > totalArea) {
      methods.setError("appliedComponentsSabji.areaApplied", {
        type: "manual",
        message: t("schemeErrors.appliedAcreageError", {
          floatVal: selectedAreaApplied?.value,
          totalArea: totalArea,
        }),
      });
    } else {
      methods.clearErrors("appliedComponentsSabji.areaApplied");
    }
  }, [groupDetailsWatch, selectedAreaApplied, setValue, methods, language, disableAll, t]);

  const previousFarmerLandType = useRef(farmerLandType?.id);

  useEffect(() => {
    if (disableAll) return;

    if (farmerLandType?.id !== previousFarmerLandType.current) {
      methods.setValue("requiredDocuments.LandDoc", []);
      previousFarmerLandType.current = farmerLandType.id;
    }
  }, [farmerLandType?.id, disableAll]);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
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
            area: watch("appliedComponentsSabji2.totalArea", 0).toFixed(2),
          })}
        </Typography>
      </Box>
    </>
  );
}

export default AppliedComponentsSabji2;
