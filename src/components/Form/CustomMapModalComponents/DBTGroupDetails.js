import {Button, Typography } from "@mui/material";
import React, {
  forwardRef,
  useEffect,
  useState,
} from "react";
import Mapper from "../Mapper";
import { farmerDBTData } from "../../../Hooks/farmerData";

const DBTGroupDetails = forwardRef(
  ({ scheme, schemeName, language, methods, disableAll, schemeId }, ref) => {
    const dbt = methods.watch("DBTID", "");
    const [dbtData, setDbtData] = useState(null);
    const [dbtError, setDbtError] = useState(null);
    useEffect(() => {
      const fetchDbtData = async () => {
        const result = await farmerDBTData(dbt);
        if (result.data) {
          setDbtData(result.data);
          setDbtError(null);

          methods.setValue(
            "farmerAadhaarName",
            result.data?.Individual?.name?.givenName
          );
          methods.setValue(
            "farmerRelativeName",
            result.data?.Individual?.fatherHusbandName
          );
          methods.setValue(
            "farmerDistrict",
            result.data?.Individual?.address?.[0]?.district
          );
          methods.setValue(
            "farmerMobileNumber",
            result.data?.Individual?.mobileNumber
          );
        } else {
          setDbtError(result.error);
        }
      };

      if (
        schemeId === "SCHEME054" &&
        dbt &&
        dbt.length === 13 &&
        methods.watch("farmerAadhaarName", "").length === 0
      ) {
        fetchDbtData();
      } else if (methods.watch("farmerAadhaarName", "").length !== 0) {
        methods.setValue("farmerAadhaarName", "");
        methods.setValue("farmerRelativeName", "");
        methods.setValue("farmerDistrict", "");
        methods.setValue("farmerMobileNumber", "");
      }
    }, [dbt, schemeId, methods]);

    const handleClick = () => {
      if (ref.current?.submit) {
        ref.current.submit();
      }
    };
    return (
      <>
        <Typography
          sx={{
            fontSize: "1.3rem",
            margin: "0 auto 20px auto",
            width: "fit-content",
            fontWeight: 800,
          }}
        >
          Add DBT
        </Typography>

        {Object.entries(scheme.properties).map(([fieldKey, fields]) => {
         const { type } = fields;
          if (type === "string") {
            return (
              <Mapper
                key={fieldKey}
                relation={fieldKey}
                schemeId={schemeId}
                obj={fields}
                type={"string"}
                register={methods.register}
                watch={methods.watch}
                language={language}
                control={methods.control}
                reset={methods.reset}
                setValue={methods.setValue}
                disableAll={disableAll}
              />
            );
          }
          return null;
        })}
        <Button
          variant="outlined"
          sx={{
            backgroundColor: "#A5292B",
            color: "white",
            width: "100%",
            margin: "20px auto",
            borderColor: "#A5292B",
            borderRadius: "0.5rem",
            "&:hover": {
              backgroundColor: "white",
              color: "#A5292B",
              borderColor: "#A5292B",
            },
          }}
          onClick={handleClick}
        >
          Submit
        </Button>
      </>
    );
  }
);

export default DBTGroupDetails;
