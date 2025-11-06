import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { FormProvider, useForm } from "react-hook-form";
import MainForm from "./MainForm";
import Mapper from "./Mapper";
import { Box, Typography } from "@mui/material";
import CustomMapping from "./CustomMapping";
import { useTranslation } from "react-i18next";
const FormComposer = forwardRef(
  (
    {
      scheme,
      schemeName,
      schemeId,
      farmerData,
      language = "en",
      setHasErrors,
      setMoveAhead,
      closeModal,
      disableAll,
      handleApplicationType,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const methods = useForm({
      mode: "onSubmit",
    });
    const { errors } = methods.formState;
    const onSubmit = async (data) => {
      console.error("Submitted ", data);
      localStorage.setItem(schemeId + "formData", JSON.stringify(data));
      if (setMoveAhead) setMoveAhead((prevActiveStep) => prevActiveStep + 1);
      if (closeModal) {
        closeModal();
      }
    };
    const onError = (error) => {
      console.error(error);
      setHasErrors(Object.keys(error).length > 0);
    };
    useImperativeHandle(ref, () => ({
      submit: methods.handleSubmit(onSubmit, onError),
    }));

    const selectedSource = methods.watch("applicationForm.applicationType", "");
    useEffect(() => {
      if (handleApplicationType) {handleApplicationType(selectedSource);
        if(selectedSource && localStorage.getItem(schemeId + "formData") && JSON.parse(localStorage.getItem(schemeId + "formData")).applicationForm?.applicationType!==selectedSource){
          localStorage.setItem(schemeId + "formData",JSON.stringify({}));         
        }
      }
    }, [selectedSource, handleApplicationType,methods,schemeId]);

    useEffect(() => {
      function getIdentifierValue(identifiers, type) {
        const identifier = identifiers.find((id) => id.identifierType === type);
        return identifier ? identifier.identifierId : null;
      }
      const storedData = localStorage.getItem(schemeId + "formData");
      let transformData;
      let totalData;
      if (storedData) {
        totalData = JSON.parse(storedData);
      }
      if (farmerData) {
        transformData = {
          personalInformation: {
            dBTRegistrationNumber: getIdentifierValue(
              farmerData.Individual.identifiers,
              "DBTID"
            ),
            farmerAadhaarNumber: farmerData?.Individual?.identifiers[0]?.identifierId,
            farmerAadhaarName: farmerData.Individual.name.givenName,
            farmerHusband: ["SCHEME015"].includes(schemeId)
              ? totalData?.personalInformation?.farmerHusband || {}
              : undefined,
            farmerRelativeName: farmerData.Individual.fatherHusbandName,
            farmerDOB: farmerData.Individual.dateOfBirth,
            farmerGender: ["SCHEME015"].includes(schemeId)
              ? totalData?.personalInformation?.farmerGender || {}
              : farmerData.Individual.gender,
            farmerMobileNumber: farmerData.Individual.mobileNumber,
            farmerCasteCategory: ["SCHEME015"].includes(schemeId)
              ? totalData?.personalInformation?.farmerCasteCategory || {}
              : farmerData.Individual.individualCast,
            farmerType: farmerData.Individual.individualCategory,
          },
          locationInformation: {
            farmerDistrict: farmerData.Individual.address[0].district,
            farmerBlock: farmerData.Individual.address[0].block,
            farmerGramPanchayat: farmerData.Individual.address[0].panchayat,
            farmerVillage: farmerData.Individual.address[0].village,
          },
          bankInformation: {
            FarmerBank: farmerData.BankDetails.bankName,
            FarmerBankIFSC: farmerData.BankDetails.ifscCode,
            FarmerAccountNumber: farmerData.BankDetails.accountNumber,
            FarmerBranchName: ["SCHEME015"].includes(schemeId)
              ? totalData?.bankInformation?.FarmerBranchName || ""
              : undefined,
          },
        };
      }

      totalData = { ...totalData, ...transformData };
      methods.reset(totalData);
      if(selectedSource)
      methods.setValue("applicationForm.applicationType",selectedSource);
    }, [methods,selectedSource,schemeId,farmerData]);
    const labelFields = Object.entries(scheme.properties).filter(
      ([, fields]) => fields.type === "label" && fields.noteForWeb
    );
    const otherFields = Object.entries(scheme.properties).filter(
      ([, fields]) => fields.type !== "label" || !fields.noteForWeb
    );

    const schemeComponentExceptions = [
      "componentsMushroomHut",
      "appliedComponentsLandDetails",
      "appliedComponentsTea",
      "affectedLandDetail",
    ];

    if (
      scheme.type !== "object" ||
      (schemeId === "SCHEME053" && schemeName === "memberDetails") ||
      schemeComponentExceptions.includes(schemeName) ||
      ((schemeId === "SCHEME031" ||
        schemeId === "SCHEME033" ||
        schemeId === "SCHEME032") &&
        schemeName === "applicantDetails")
    ) {
      return (
        <CustomMapping
          scheme={scheme}
          schemeName={schemeName}
          schemeId={schemeId}
          language={language}
          methods={methods}
          disableAll={disableAll}
          rawErrors={errors}
        />
      );
    }

    return (
      <Box>
        <Box
          sx={{
            fontSize: "2rem",
            margin: "20px 0",
            backgroundColor: "green",
            color: "white",
            padding: "1px",
            borderRadius: "2rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.3rem",
              margin: "0 auto",
              width: "fit-content",
              fontWeight: 800,
            }}
          >
            {t(scheme[`title-${language}`] || scheme[`title`])}
          </Typography>
        </Box>
        <FormProvider {...methods}>
          {labelFields.map(([fieldKey, field]) => {
            if (field.noteForWeb && field.noteForWeb === "sectionNote")
              return (
                <Mapper
                  parent={schemeName}
                  relation={fieldKey}
                  key={fieldKey + "noteForWebsectionNote"}
                  schemeId={schemeId}
                  type={`label`}
                  obj={field}
                  register={methods.register}
                  language={language}
                  errors={errors}
                  control={methods.control}
                  reset={methods.reset}
                  setValue={methods.setValue}
                  disableAll={disableAll}
                  methods={methods}
                />
              );
            return null;
          })}
          <MainForm
            ref={ref}
            style={{ justifyContent: "center" }}
            onSubmit={methods.handleSubmit(onSubmit, onError)}
          >
            {otherFields.map(([fieldKey, fields]) => {
              const { type } = fields;
              return (
                <React.Fragment key={fieldKey}>
                  <Mapper
                    parent={schemeName}
                    relation={fieldKey}
                    schemeId={schemeId}
                    watch={methods.watch}
                    key={fieldKey}
                    type={type}
                    obj={fields}
                    register={methods.register}
                    language={language}
                    errors={errors}
                    control={methods.control}
                    reset={methods.reset}
                    setValue={methods.setValue}
                    disableAll={disableAll}
                    methods={methods}
                  />
                  {labelFields.map(([index, labelField]) => {
                    if (
                      labelField.noteForWeb &&
                      labelField.noteForWeb === fieldKey
                    )
                      return (
                        <Mapper
                          parent={schemeName}
                          relation={fieldKey + "noteForWeb"}
                          key={fieldKey + "noteForWeb" + index}
                          schemeId={schemeId}
                          type={`label`}
                          obj={labelField}
                          register={methods.register}
                          language={language}
                          errors={errors}
                          control={methods.control}
                          reset={methods.reset}
                          setValue={methods.setValue}
                          disableAll={disableAll}
                          methods={methods}
                        />
                      );

                    return null;
                  })}
                </React.Fragment>
              );
            })}
          </MainForm>
        </FormProvider>
      </Box>
    );
  }
);

export default FormComposer;
