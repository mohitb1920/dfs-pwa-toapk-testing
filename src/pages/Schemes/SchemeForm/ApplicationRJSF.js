import { Typography } from "@mui/material";
import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Form } from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";
import { CustomDatePicker, CustomSelect, CustomTextbox } from "./CustomWidgets";

function ApplicationForm(props) {
  const {
    jsonSchema,
    formRef,
    setApplicationFormData,
    formData,
    liveValidate,
  } = props;
  const [expanded, setExpanded] = useState(true);

  //UI Schema Generation
  const generateUiSchema = (jsonSchema) => {
    const uiSchema = {};
    uiSchema["ui:classNames"] = "form-container";
    uiSchema["ui:title"] = "";
    for (const key in jsonSchema.properties) {
      uiSchema[key] = {
        "ui:title": jsonSchema.properties[key].title,
        "ui:classNames": "form-input-field",
      };
    }
    return uiSchema;
  };

  //Custom Error Messages
  const transformErrors = (errors) => {
    console.debug(errors);
    const pattern = /must have required property '([^']+)'/;
    return errors.map((error) => {
      const match = error.message.match(pattern);
      if (match) {
        const requiredField = match[1];
        console.debug(requiredField);
        error.message = `${requiredField} is required`;
      } else {
        console.log("No match found");
      }
      return error;
    });
  };

  const widgets = {
    TextWidget: CustomTextbox,
    DateWidget: CustomDatePicker,
    SelectWidget: CustomSelect,
  };

  return (
    <div className="application-form-container">
      <div className="scheme-category space-between">
        <Typography className="scheme-category-text">
          {jsonSchema.title}
        </Typography>
        {/* {expanded ? (
          <KeyboardArrowDownIcon
            onClick={() => setExpanded(false)}
            className="arrow-button"
          />
        ) : (
          <KeyboardArrowRightIcon
            onClick={() => setExpanded(true)}
            className="arrow-button"
          />
        )} */}
      </div>
      {expanded && (
        <div>
          <Form
            ref={formRef}
            formData={formData}
            schema={jsonSchema}
            widgets={widgets}
            uiSchema={generateUiSchema(jsonSchema)}
            onChange={(e) => setApplicationFormData(e)}
            validator={validator}
            children={<></>}
            liveValidate={liveValidate}
            showErrorList={false}
            transformErrors={transformErrors}
          />
        </div>
      )}
    </div>
  );
}

export default ApplicationForm;
