import { useState, useRef, useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { getCurrentLanguage, TENANT_ID } from "../../components/Utils";
import useSpecificSchemeData from "../../Hooks/useSpecificSchemeData";
import { useLocalizationStore } from "../../Hooks/Store";
import SchemeMainApplicationType from "./SchemeMainApplicationType";
import SchemeMainForm from "./SchemeMainForm";
import "../../styles/Schemes.css";
import SeedSubsidySeason from "./ExtraPages/SeedSubsidySeason";
import { useTranslation } from "react-i18next";
function SchemeFormField(props) {
  const { mainSchemeId, schemeId, farmerData } = props;
  const stateCode = TENANT_ID;
  const moduleCode = [schemeId];
  let {
    data: schemeData,
    isLoading,
    refetch,
  } = useSpecificSchemeData(schemeId);

  const { i18n } = useTranslation();
  const languagef = getCurrentLanguage();
  const language = i18n.language === "hi_IN" ? "hi" : "en";

  useLocalizationStore({ stateCode, moduleCode, languagef });
  const methods = useForm({
    mode: "all",
  });

  const [hasErrors, setHasErrors] = useState(false);
  const [moveNext, setMoveNext] = useState(false);
  const [reload, setReload] = useState(false);
  const ref = useRef(null);

  const { errors } = methods.formState;
  // console.debug(errors);
  const onSubmit = async (data) => {
    // console.error("Submitted ", data);
    // localStorage.setItem(schemeId + "formData", JSON.stringify(data));
  };
  const onError = (error) => {
    // console.error(error);
    setHasErrors(Object.keys(error).length > 0);
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const validateSpecificFields = async () => {
        const errorFields = flattenErrorPaths(errors);
        await methods.trigger(errorFields);
      };

      validateSpecificFields();
    }
  }, [i18n.language, methods.trigger, errors]);

  useImperativeHandle(ref, () => ({
    submit: methods.handleSubmit(onSubmit, onError),
  }));

  const selectedScheme =
    schemeData && schemeData[schemeId] ? schemeData[schemeId]?.[0] : {};

  useEffect(() => {
    function getIdentifierValue(identifiers, type) {
      const identifier = identifiers.find((id) => id.identifierType === type);
      return identifier ? identifier.identifierId : null;
    }
    const storedData = localStorage.getItem(schemeId + "formData");
    let transformData;
    let totalData;
    // if (storedData) {
    //   totalData = JSON.parse(storedData);
    // }
    if (farmerData) {
      transformData = {
        personalInformation: {
          dBTRegistrationNumber: getIdentifierValue(
            farmerData.Individual.identifiers,
            "DBTID"
          ),
          farmerAadhaarNumber: getIdentifierValue(
            farmerData.Individual.identifiers,
            "AADHAAR"
          ),
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
          farmerType: farmerData.Individual.individualType || "Not Available",
        },
        locationInformation: {
          farmerDistrict: farmerData.Individual.address?.[0]?.district,
          farmerBlock: farmerData.Individual.address?.[0]?.block,
          farmerGramPanchayat: farmerData.Individual.address?.[0]?.panchayat,
          farmerVillage: farmerData.Individual.address[0]?.village,
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
    // console.error(farmerData);
    totalData = { ...totalData, ...transformData };
    methods.reset(totalData);

    methods.setValue("farmerData", farmerData);
    methods.setValue("mainSchemeId", mainSchemeId);
  }, [methods, schemeId, mainSchemeId, farmerData]);
  useEffect(() => {
    if (!isLoading && !!selectedScheme && !selectedScheme.formFields)
      setMoveNext(true);
  }, [selectedScheme, isLoading]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {!reload && schemeId === "SCHEME007" && (
        <Box className="scheme-details-input-box">
          <SeedSubsidySeason
            schemeId={schemeId}
            selectedScheme={selectedScheme}
            handleSeed={setReload}
            methods={methods}
          />
        </Box>
      )}
      {(reload || schemeId !== "SCHEME007") &&
        !isLoading &&
        !moveNext &&
        !!selectedScheme.formFields && (
          <Box className="scheme-details-input-box">
            <SchemeMainApplicationType
              methods={methods}
              fields={selectedScheme?.formFields}
              handleMoveAhead={setMoveNext}
              language={language}
              {...props}
            />
          </Box>
        )}
      {(reload || schemeId !== "SCHEME007") && !isLoading && moveNext && (
        <SchemeMainForm
          mainSchemeId={mainSchemeId}
          methods={methods}
          fields={selectedScheme?.formFields2}
          handleMoveNext={setMoveNext}
          {...props}
        />
      )}
    </>
  );
}

const flattenErrorPaths = (errors, parentKey = "") => {
  return Object.entries(errors).reduce((acc, [key, value]) => {
    const currentPath = parentKey ? `${parentKey}.${key}` : key;
    if (value.type && value.message) {
      acc.push(currentPath);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item && typeof item === "object") {
          acc.push(...flattenErrorPaths(item, `${currentPath}.${index}`));
        }
      });
    } else if (typeof value === "object") {
      acc.push(...flattenErrorPaths(value, currentPath));
    }

    return acc;
  }, []);
};
export default SchemeFormField;
