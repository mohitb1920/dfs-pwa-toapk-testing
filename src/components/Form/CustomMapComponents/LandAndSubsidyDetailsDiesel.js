import React, { useEffect, useState } from "react";
import Mapper from "../Mapper";
import useCropData from "../../../Hooks/useCropData";

function LandAndSubsidyDetailsDiesel({
  scheme,
  schemeName,
  schemeId,
  language,
  methods,
  disableAll,
}) {
  const { errors, watch, clearErrors, trigger } = methods;
  const irrigationObject = scheme["properties"]["numberOfIrrigation"];
  const cropObject = scheme["properties"]["cropName"];
  const cropName = methods.watch(`${schemeName}.cropName`);

  const data = useCropData(schemeId, {
    cropCall: true,
    seasonCall: true,
    irrigationCall: true,
  });

  cropObject.options = data?.data?.crops;

  const result = data.data?.irrigation?.find(
    (irrigation) =>
      irrigation.crop === cropName?.id && irrigation.season === cropName?.season
  );

  if (result?.max) irrigationObject.maximum = parseFloat(result.max);
  irrigationObject.maxlength = 5;

  useEffect(() => {
    if (disableAll) return;
    if (cropName) {
      trigger(`${schemeName}.numberOfIrrigation`);
    }
  }, [cropName, disableAll]);

  return (
    <div className="flex flex-wrap gap-y-8 gap-x-4">
      {Object.keys(scheme.properties).map((key) => {
        const property = scheme.properties[key];
        if (property.title?.toLowerCase()?.includes("number")) {
          return (
            <div key={key} className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}>
              <div className="h-full">
                <Mapper
                  key={key}
                  parent={schemeName}
                  relation={key}
                  obj={irrigationObject}
                  type={"string"}
                  register={methods.register}
                  language={language}
                  errors={errors}
                  control={methods.control}
                  reset={methods.reset}
                  setValue={methods.setValue}
                  disableAll={disableAll}
                  methods={methods}
                />
              </div>
            </div>
          );
        } else if (key === "cropName") {
          return (
            <div key={key} className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}>
              <div className="h-full">
                <Mapper
                  key={key}
                  parent={schemeName}
                  relation={key}
                  obj={cropObject}
                  type={"string"}
                  register={methods.register}
                  language={language}
                  errors={errors}
                  control={methods.control}
                  reset={methods.reset}
                  setValue={methods.setValue}
                  disableAll={disableAll}
                  methods={methods}
                  schemeId={schemeId}
                />
              </div>
            </div>
          );
        }
        return (
          <div key={key} className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}>
            <div className="h-full">
              <Mapper
                key={key}
                parent={schemeName}
                relation={key}
                obj={property}
                type={property.type}
                register={methods.register}
                language={language}
                errors={errors}
                control={methods.control}
                reset={methods.reset}
                setValue={methods.setValue}
                disableAll={disableAll}
                methods={methods}
                schemeId={schemeId}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LandAndSubsidyDetailsDiesel;
