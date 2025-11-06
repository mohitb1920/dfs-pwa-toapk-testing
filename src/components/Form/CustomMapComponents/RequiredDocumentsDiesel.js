import React, { useEffect, useState } from "react";
import Mapper from "../Mapper";
import { useWatch } from "react-hook-form";

function RequiredDocumentsDiesel({
  scheme,
  schemeName,
  schemeId,
  language,
  methods,
  disableAll,
}) {
  const { errors, watch, clearErrors, trigger, control, setValue, unregister } =
    methods;
  const farmerTypeWatch = useWatch({
    control,
    name: "landAndSubsidyDetails.farmerTypeDieasel",
  });

  useEffect(() => {
    if (disableAll) return;
    if (!farmerTypeWatch?.valueHindi) {
      unregister("requiredDocuments.LeaseDoc");
      unregister("requiredDocuments.LandDoc");
    } else if (farmerTypeWatch?.valueHindi === "बटाईदार") {
      unregister("requiredDocuments.LandDoc");
    } else if (farmerTypeWatch?.valueHindi === "स्वयं") {
      unregister("requiredDocuments.LeaseDoc");
    }
  }, [farmerTypeWatch?.valueHindi]);

  return (
    <div className="flex flex-wrap gap-y-8 gap-x-4">
      {Object.keys(scheme.properties).map((key) => {
        const property = scheme.properties[key];
        if (
          (farmerTypeWatch?.valueHindi === undefined &&
            ["LeaseDoc", "LandDoc"].includes(key)) ||
          (farmerTypeWatch?.valueHindi === "बटाईदार" &&
            ["LandDoc"].includes(key)) ||
          (farmerTypeWatch?.valueHindi === "स्वयं" &&
            ["LeaseDoc"].includes(key)) ||
          key === "labelLink2"
        ) {
          return null;
        }

        if (property.type === "label")
          return (
            <div key={key} className={`w-full`}>
              <div className="h-full">
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
                  linkTitle={
                    scheme.properties["labelLink"][`titleName-${language}`]
                  }
                  methods={methods}
                />
              </div>
            </div>
          );
        return (
          <div key={key} className={`w-full`}>
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

export default RequiredDocumentsDiesel;
