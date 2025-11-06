import React, { useEffect, useState } from "react";
import Mapper from "../Mapper";
import { Box, Typography } from "@mui/material";
import { useWatch } from "react-hook-form";

function GrantDetails({ scheme, schemeName, language, methods, disableAll }) {
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

  const receivedGrantOnProposedLandValue = useWatch({
    control,
    name: "grantDetails.receivedGrantOnProposedLand",
  });

  const pastGrantsValue = useWatch({
    control,
    name: "grantDetails.pastGrants",
  });

  useEffect(() => {
    if (disableAll) return;
    if (receivedGrantOnProposedLandValue?.index === 1) {
      methods.setValue("grantDetails.grantRelatedBank", {
        id: undefined,
        value: "",
        index: "",
      });
    }
  }, [receivedGrantOnProposedLandValue, disableAll]);

  useEffect(() => {
    if (disableAll) return;
    if (pastGrantsValue?.index === 1) {
      methods.setValue("grantDetails.giveDetails", "");
    }
  }, [pastGrantsValue, disableAll]);

  function calculateDisableAll(key, disableAll) {
    if (disableAll === true) return disableAll;
    if (
      key === "grantRelatedBank" &&
      receivedGrantOnProposedLandValue?.index === 1
    )
      return true;
    if (key === "giveDetails" && pastGrantsValue?.index === 1) return true;
    return disableAll;
  }

  function prepareObject(key, property) {
    if (
      (key === "grantRelatedBank" &&
        receivedGrantOnProposedLandValue?.index === 1) ||
      (key === "giveDetails" && pastGrantsValue?.index === 1)
    )
      property.required = false;
    else property.required = true;
    return property;
  }

  return (
    <div className="flex flex-wrap gap-y-8 gap-x-4">
      {Object.keys(scheme.properties).map((key) => {
        let property = scheme.properties[key];
        if (property.type === "string") {
          return (
            <div
              key={key}
              className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}
            >
              <div className="h-full">
                <Mapper
                  key={key}
                  parent={schemeName}
                  relation={key}
                  obj={prepareObject(key, property)}
                  type={"string"}
                  register={methods.register}
                  language={language}
                  errors={errors}
                  control={methods.control}
                  reset={methods.reset}
                  setValue={methods.setValue}
                  disableAll={calculateDisableAll(key, disableAll)}
                  methods={methods}
                />
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default GrantDetails;
