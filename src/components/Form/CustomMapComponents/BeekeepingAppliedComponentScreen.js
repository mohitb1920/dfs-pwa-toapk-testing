import Mapper from "../Mapper";
import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import useCropData from "../../../Hooks/useCropData";
import { useEffect } from "react";
function BeekeepingAppliedComponentScreen({
  scheme,
  schemeName,
  schemeId,
  language,
  methods,
  disableAll,
}) {
  const theme = useTheme()
  const selectedPart = methods.watch("appliedComponents.farmerPartName", "");
  const farmerPartNameObject = scheme.properties["farmerPartName"];
  farmerPartNameObject.options = [];
  const componentCount = scheme.properties["componentCount"];
  const data = useCropData(schemeId, { cropCall: true });
  const district = methods.watch("landDetails.farmerDistrict", "");
  const { errors } = methods;

  if (["SCHEME009", "SCHEME011"].includes(schemeId))
    if (data?.data?.crops) {
      if (data.data.crops?.[0]?.min)
        componentCount.minimum = parseFloat(data.data.crops[0].min);
      if (data.data.crops?.[0]?.max)
        componentCount.maximum = parseFloat(data.data.crops[0].max);
      const filteredCrops = data.data.crops.filter(
        (crop) => crop.district === district.id
      );
      const selectedCrop = filteredCrops.find(
        (item) => item.id === selectedPart.id
      );
      farmerPartNameObject.options = filteredCrops;
      if (selectedCrop && selectedCrop.min)
        componentCount.minimum = parseFloat(selectedCrop.min);
      if (selectedCrop && selectedCrop.max)
        componentCount.maximum = parseFloat(selectedCrop.max);
    }

  if (componentCount) componentCount.maxlength = 2;
  const { t } = useTranslation();
  const foodGradeContainer = methods.watch(
    "appliedComponents.FoodGradeContainer",
    ""
  );
  const honeyExtractor = methods.watch("appliedComponents.HoneyExtractor", "");
  useEffect(() => {
    if (
      ["SCHEME011"].includes(schemeId) &&
      honeyExtractor.id === 0 &&
      foodGradeContainer.id > 0
    ) {
      methods.setError("appliedComponents.foodGradeContainer", {
        type: "manual",
        message: "Only one a Food Grade Container or a Honey Extractor",
      });
    } else {
      methods.clearErrors("appliedComponents.foodGradeContainer");
    }
  }, [honeyExtractor, foodGradeContainer, schemeId, methods]);

  return (
    <div className="flex flex-wrap gap-y-8 gap-x-4">
      <div
        key={"farmerPartName"}
        className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}
      >
        <div className="h-full">
          <Mapper
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
            methods={methods}
          />
        </div>
      </div>

      {Object.entries(scheme.properties)
        .slice(1)
        .map(([key, property]) => {
          if (key === "componentCount")
            return (
              <div key={key} className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}>
                <div className="h-full">
                  <Mapper
                    parent={schemeName}
                    relation={"componentCount"}
                    type={"string"}
                    schemeId={schemeId}
                    obj={componentCount}
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
                </div>
              </div>
            );
          return (
            <div key={key} className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}>
              <div className="h-full">
                <Mapper
                  parent={schemeName}
                  relation={key}
                  type={property.type}
                  schemeId={schemeId}
                  obj={property}
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
              </div>
            </div>
          );
        })}
      {["SCHEME011"].includes(schemeId) &&
        honeyExtractor.id === 0 &&
        foodGradeContainer.id > 0 && (
          <Typography color={theme.palette.text.error}>
            {t("schemes.appliedBeeScreenError")}
          </Typography>
        )}
    </div>
  );
}

export default BeekeepingAppliedComponentScreen;
