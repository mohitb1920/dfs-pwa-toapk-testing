import React, { useEffect, useState } from "react";
import Mapper from "../Mapper";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function InsecticideDetails({
  scheme,
  schemeName,
  language,
  methods,
  disableAll,
}) {
  const { errors, watch, clearErrors } = methods;

  const stringFields = Object.keys(scheme.properties).filter(
    (key) => ["string", "checkbox"].includes(scheme.properties[key].type)
  );

  const watchedFields = stringFields.reduce((acc, key) => {
    const fieldValue = watch(`${schemeName}.${key}`, "");
    acc[key] = fieldValue;
    return acc;
  }, {});

  const handleEmptyStringFields = (fields) => {
    Object.keys(fields).forEach((key) => {
      if (!fields[key]) {
        clearErrors(`${schemeName}.${key}`);
      }
    });
  };

  const [errorsSet, setErrorsSet] = useState(false);

  useEffect(() => {
    const isAtLeastOneFieldFilled = Object.values(watchedFields).some(
      (value) => typeof value === "string" ? value.trim() !== "" : value === true
    );

    if (!isAtLeastOneFieldFilled && !errorsSet) {
      setErrorsSet(true);
    } else if (isAtLeastOneFieldFilled && errorsSet) {
      setErrorsSet(false);
      handleEmptyStringFields(watchedFields);
    }
  }, [watchedFields, errorsSet]);

  const { t } = useTranslation();
  return (
    <>
      <Mapper
        parent={schemeName}
        relation={"requiredFieldLabel"}
        obj={scheme.properties["requiredFieldLabel"]}
        type={"label"}
        register={methods.register}
        language={language}
        errors={errors}
        control={methods.control}
        setValue={methods.setValue}
        disableAll={disableAll}
        required={false}
        methods={methods}
      />
      <div className="flex flex-wrap gap-y-8 gap-x-4">
        {Object.keys(scheme.properties).map((key) => {
          const property = scheme.properties[key];

          if (["string", "checkbox"].includes(property.type)) {
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
                    required={errorsSet}
                    methods={methods}
                  />
                </div>
              </div>
            );
          }
          return null;
        })}

        <div key={"subsidyLabel"} className={`w-full`}>
          <div className="h-full">
            <Mapper
              parent={schemeName}
              relation={"subsidyLabel"}
              type={"label"}
              obj={scheme.properties["subsidyLabel"]}
              register={methods.register}
              language={language}
              errors={errors}
              control={methods.control}
              reset={methods.reset}
              setValue={methods.setValue}
              disableAll={disableAll}
              required={false}
              methods={methods}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default InsecticideDetails;
