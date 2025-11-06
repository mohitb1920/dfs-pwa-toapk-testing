import React, { useState, useEffect } from "react";
import Mapper from "../Mapper";
import { Box, Typography } from "@mui/material";
import { use } from "i18next";
import { useWatch } from "react-hook-form";

function ApplicantDetailsHortiGroup({
  scheme,
  schemeName,
  language,
  methods,
  disableAll,
  schemeId,
}) {
  const { control, errors } = methods;
  const [localDisableAll, setLocalDisableAll] = useState(disableAll);
  const groupNameValue = useWatch({
    control,
    name: `${schemeName}.groupName.value`,
  });

  useEffect(() => {
    if (disableAll) return;

    if (groupNameValue === "Cooperative(VegFed)") {
      methods.setValue(`${schemeName}.companyName`, "");
      methods.setValue(`${schemeName}.dateRegistration`, null);
      methods.setValue(`${schemeName}.companyRegistrationDate`, null);
      setLocalDisableAll(true);
    } else {
      setLocalDisableAll(disableAll);
    }
  }, [groupNameValue, disableAll]);

  return (
    <div className="flex flex-wrap gap-y-8 gap-x-4">
      {Object.keys(scheme.properties).map((key) => {
        const property = scheme.properties[key];
        if (property.type === "string") {
          return (
            <div key={key} className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}>
              <div className="h-full">
                <Mapper
                  methods={methods}
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
                  disableAll={
                    key === "companyName"
                      ? localDisableAll || disableAll
                      : disableAll
                  }
                  required={key === "companyName" ? !localDisableAll : true}
                />
              </div>
            </div>
          );
        }
        return null;
      })}
      <div
        key={"dateRegistration"}
        className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}
      >
        <div className="h-full">
          <Mapper
            methods={methods}
            parent={schemeName}
            relation={
              ["SCHEME012"].includes(schemeId)
                ? "companyRegistrationDate"
                : "dateRegistration"
            }
            obj={
              scheme.properties[
                ["SCHEME012"].includes(schemeId)
                  ? "companyRegistrationDate"
                  : "dateRegistration"
              ]
            }
            type={"date"}
            register={methods.register}
            language={language}
            errors={errors}
            control={methods.control}
            reset={methods.reset}
            setValue={methods.setValue}
            disableAll={localDisableAll || disableAll}
            required={!localDisableAll}
          />
        </div>
      </div>
      <div key={"GroupDoc"} className={`w-full`}>
        <div className="h-full">
          <Mapper
            methods={methods}
            parent={schemeName}
            relation={"GroupDoc"}
            type={"file"}
            obj={scheme.properties["GroupDoc"]}
            register={methods.register}
            language={language}
            errors={errors}
            control={methods.control}
            reset={methods.reset}
            setValue={methods.setValue}
            disableAll={disableAll}
            schemeId={schemeId}
          />
        </div>
      </div>
    </div>
  );
}

export default ApplicantDetailsHortiGroup;
