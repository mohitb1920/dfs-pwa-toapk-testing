import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Mapper from "../Mapper";
import { useTranslation } from "react-i18next";

const EquipmentDetails = ({
  scheme,
  schemeName,
  language,
  methods,
  disableAll,
}) => {
  const { register, control, errors, setValue, reset, watch } = methods;
  const selectedDevice = watch("equipmentDetails.devicesToBeInstalled", "");
  const selectedSource = watch("equipmentDetails.sourceOfInformation", "");
  const selectedBorvel = watch("equipmentDetails.individualBorvel", "");
  const { t } = useTranslation();

  useEffect(() => {
    if (
      selectedDevice?.value &&
      (selectedDevice.value === "Sprinkler" ||
        selectedDevice.value === "स्प्रिंकलर")
    ) {
      methods.unregister(`${schemeName}.individualBorvel`);
      methods.unregister(`${schemeName}.individualBorvelWork`);
    } else if (
      [
        "Drip",
        "Mini Sprinkler",
        "Micro Sprinkler",
        "ड्रिप",
        "मिनी स्प्रिंकलर",
        "माइक्रो स्प्रिंकलर",
      ].includes(selectedDevice?.value)
    ) {
      methods.unregister(`${schemeName}.sprinklerType`);
    }
  }, [selectedDevice]);

  useEffect(() => {
    if (
      selectedSource?.value !== "Others" &&
      selectedSource?.value !== "अन्य"
    ) {
      methods.unregister(`${schemeName}.ifOther`);
    }
  }, [selectedSource]);

  return (
    <Box sx={{display:"flex",flexDirection:"column",rowGap:"0.6rem"}}>
      <Mapper
        methods={methods}
        parent={schemeName}
        relation={"sourceOfInformation"}
        type={"string"}
        schemeId={"SCHEME001"}
        watch={methods.watch}
        obj={scheme.properties["sourceOfInformation"]}
        register={methods.register}
        language={language}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll}
      />

      {(selectedSource?.value === "Others" ||
        selectedSource?.value === "अन्य") && (
        <Mapper
        methods={methods}
          parent={schemeName}
          relation={"ifOther"}
          obj={scheme.properties["ifOther"]}
          type={"string"}
          watch={methods.watch}
          schemeId={"SCHEME001"}
          maxLength={6}
          register={methods.register}
          language={language}
          errors={errors}
          control={methods.control}
          reset={methods.reset}
          setValue={methods.setValue}
          disableAll={disableAll}
        />
      )}
      <Mapper
      methods={methods}
        parent={schemeName}
        relation={"devicesToBeInstalled"}
        type={"string"}
        schemeId={"SCHEME001"}
        watch={methods.watch}
        obj={scheme.properties["devicesToBeInstalled"]}
        register={methods.register}
        language={language}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll}
      />

      {selectedDevice && (
        <>
          {[
            "Drip",
            "Mini Sprinkler",
            "Micro Sprinkler",
            "ड्रिप",
            "मिनी स्प्रिंकलर",
            "माइक्रो स्प्रिंकलर",
          ].includes(selectedDevice?.value) && (
            <>
              <Mapper
              methods={methods}
                parent={schemeName}
                relation={"otherSchemes"}
                obj={scheme.properties["otherSchemes"]}
                type={"label"}
                schemeId={"SCHEME001"}
                watch={methods.watch}
                register={methods.register}
                language={language}
                errors={errors}
                control={methods.control}
                reset={methods.reset}
                setValue={methods.setValue}
                disableAll={disableAll}
              />

              <Mapper
              methods={methods}
                parent={schemeName}
                relation={"individualBorvel"}
                obj={scheme.properties["individualBorvel"]}
                type={"checkbox"}
                schemeId={"SCHEME001"}
                register={methods.register}
                language={language}
                watch={methods.watch}
                errors={errors}
                control={methods.control}
                reset={methods.reset}
                setValue={methods.setValue}
                disableAll={disableAll}
              />
              <Mapper
              methods={methods}
                parent={schemeName}
                relation={"individualBorvelWork"}
                obj={scheme.properties["individualBorvelWork"]}
                type={"radio"}
                schemeId={"SCHEME001"}
                watch={methods.watch}
                register={methods.register}
                language={language}
                errors={errors}
                control={methods.control}
                reset={methods.reset}
                setValue={methods.setValue}
                disableAll={disableAll ?? !selectedBorvel}
              />
            </>
          )}
          {selectedDevice?.value &&
            (selectedDevice.value === "Sprinkler" ||
              selectedDevice.value === "स्प्रिंकलर") && (
              <Mapper
              methods={methods}
                parent={schemeName}
                relation={"sprinklerType"}
                obj={scheme.properties["sprinklerType"]}
                type={"string"}
                schemeId={"SCHEME001"}
                watch={methods.watch}
                register={methods.register}
                language={language}
                errors={errors}
                control={methods.control}
                reset={methods.reset}
                setValue={methods.setValue}
                disableAll={disableAll}
              />
            )}
        </>
      )}

      <Mapper
      methods={methods}
        parent={schemeName}
        relation={"pincode"}
        obj={scheme.properties["pincode"]}
        type={"string"}
        schemeId={"SCHEME001"}
        watch={methods.watch}
        register={methods.register}
        language={language}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll}
      />
    </Box>
  );
};

export default EquipmentDetails;
