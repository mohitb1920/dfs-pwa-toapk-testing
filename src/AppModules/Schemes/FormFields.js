import React from "react";
import Mapper from "../../components/Form/Mapper";
import { Box, Typography } from "@mui/material";
import CustomMapping from "../../components/Form/CustomMapping";
import { getCurrentLanguage } from "../../components/Utils";
function FormFields(props) {
  const { methods, scheme, schemeName, schemeId, disableAll } = props;
  const languagef = getCurrentLanguage();
  const language = languagef === "hi_IN" ? "hi" : "en";
  const labelFields = Object.entries(scheme?.properties).filter(
    ([, fields]) => fields.type === "label" && fields.noteForWeb
  );
  const otherFields = Object.entries(scheme?.properties).filter(
    ([, fields]) => fields.type !== "label" || !fields.noteForWeb
  );

  const schemeComponentExceptions = [
    "componentsMushroomHut",
    "appliedComponentsLandDetails",
    "appliedComponentsTea",
    "affectedLandDetail",
    "landAndSubsidyDetails2",
    "componentsAndLandDescription",
  ];

  if (
    scheme.type !== "object" ||
    schemeComponentExceptions.includes(schemeName) ||
    (schemeId === "SCHEME053" && schemeName === "memberDetails") ||
    (["SCHEME012"].includes(schemeId) &&
      schemeName === "groupDetailsComponent") ||
    (["SCHEME008"].includes(schemeId) && schemeName === "requiredDocuments") ||
    ([
      "SCHEME030",
      "SCHEME031",
      "SCHEME032",
      "SCHEME033",
      "SCHEME036",
      "SCHEME045",
      "SCHEME046",
      "SCHEME048",
      "SCHEME049",
      "SCHEME050",
      "SCHEME051",
      "SCHEME052",
      "SCHEME056",
      "SCHEME057",
      "SCHEME058",
      "SCHEME059",
      "SCHEME060",
      "SCHEME062",
      "SCHEME063",
    ].includes(schemeId) &&
      schemeName === "applicantDetails")
  ) {
    return (
      <Box className="w-full">
        <CustomMapping
          scheme={scheme}
          schemeName={schemeName}
          schemeId={schemeId}
          language={language}
          methods={methods}
          disableAll={disableAll}
          rawErrors={methods.formState.errors}
        />
      </Box>
    );
  }
  return (
    <Box className="w-full">
      <Box className="flex flex-col gap-8">
        {labelFields.map(([fieldKey, field]) => {
          if (field.noteForWeb && field.noteForWeb === "sectionNote")
            return (
              <Mapper
                type={`label`}
                methods={methods}
                schemeId={schemeId}
                key={fieldKey + "noteForWebsectionNote"}
                parent={schemeName}
                relation={fieldKey}
                obj={field}
                language={language}
                disableAll={disableAll}
                errors={methods.formState.errors}
              />
            );
          return null;
        })}
        <ResponsiveBox
          otherFields={otherFields}
          labelFields={labelFields}
          {...props}
        />
      </Box>
    </Box>
  );
}

export default FormFields;

const ResponsiveBox = ({
  otherFields,
  labelFields,
  methods,
  schemeId,
  schemeName,
  language,
  disableAll,
}) => {
  const getWidthClass = (type) => {
    if (["string", "date", "textPreview"].includes(type)) {
      return "w-full md:w-[calc(50%-12px)] lg:w-[calc(33.3333%-16px)]";
    }
    return "w-full";
  };
  return (
    <div className="flex flex-wrap gap-y-8 gap-x-6">
      {otherFields.map(([fieldKey, fields]) => {
        const { type } = fields;
        const widthClass = getWidthClass(type);

        return (
          <div key={fieldKey} className={`${widthClass}`}>
            <div className="h-full">
              <Mapper
                type={type}
                methods={methods}
                schemeId={schemeId}
                parent={schemeName}
                relation={fieldKey}
                obj={fields}
                language={language}
                disableAll={disableAll}
                errors={methods.formState.errors}
              />
              {labelFields.map(([index, labelField]) => {
                if (labelField.noteForWeb && labelField.noteForWeb === fieldKey)
                  return (
                    <Mapper
                      type={`label`}
                      methods={methods}
                      key={fieldKey + "noteForWeb" + index}
                      schemeId={schemeId}
                      parent={schemeName}
                      relation={fieldKey + "noteForWeb"}
                      obj={labelField}
                      language={language}
                      disableAll={disableAll}
                      errors={methods.formState.errors}
                    />
                  );
                return null;
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
