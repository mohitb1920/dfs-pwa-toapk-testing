import React from "react";
import Mapper from "../Mapper";

function LandAndSubsidyDetails({
  scheme,
  schemeName,
  language,
  methods,
  disableAll,
}) {
  const {
    register,
    control,
    errors,
    setValue,
    reset,
    watch,
    setError,
    clearErrors,
  } = methods;

  const irrigationObject = scheme["numberOfIrrigation"];

  return (
    <div className="flex flex-wrap -mx-2">
      {Object.keys(scheme.properties).map((key) => {
        let property = scheme.properties[key];
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
        }
        return (
          <div key={key} className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}>
            <div className="h-full">
              <Mapper
                key={key}
                parent={schemeName}
                relation={key}
                obj={property}
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
      })}
    </div>
  );
}

export default LandAndSubsidyDetails;
