import MainFormModal from "./FormModal/MainFormModal";
import { Button } from "@mui/material";
import Mapper from "./Mapper";
import { forwardRef, useEffect, useState } from "react";
import { farmerDBTData } from "../../Hooks/farmerData";

const EnterDBTModal = forwardRef(
  (
    {
      scheme,
      language,
      handleSubmit,
      register,
      errors,
      control,
      reset,
      formData,
      handleClick,
      children,
      methods,
    },
    ref
  ) => {
    const schemeId = "SCHEME053";
    const { watch, setValue } = methods;

    const [dbtData, setDbtData] = useState(null);
    const [dbtError, setDbtError] = useState(null);
    const dbt = watch("DBTID", "");
    useEffect(() => {
      const fetchDbtData = async () => {
        const result = await farmerDBTData(dbt);
        if (result.data) {
          setDbtData(result.data);
          setDbtError(null);
        } else {
          setDbtError(result.error);
        }
      };

      if (schemeId === "SCHEME053" && dbt && dbt.length === 13) {
        fetchDbtData();
      }
    }, [dbt, schemeId]);

    useEffect(() => {
      if (dbtData) {
        setValue(
          "farmerAadhaarName",
          dbtData?.Individual?.name?.givenName || ""
        );
        setValue(
          "farmerRelativeName",
          dbtData?.Individual?.fatherHusbandName || ""
        );
        setValue(
          "farmerDistrict",
          dbtData?.Individual?.address?.[0]?.district || ""
        );
        setValue("farmerMobileNumber", dbtData?.Individual?.mobileNumber || "");
      }
    }, [dbtData, setValue]);

    return (
      <>
        <MainFormModal
          ref={ref}
          style={{ justifyContent: "center" }}
          onSubmit={handleSubmit(
            (data) => {},
            (submissionErrors) => {}
          )}
        >
          {Object.entries(scheme.properties).map(([key, property]) => {
            return (
              <Mapper
              methods={methods}
                relation={key}
                type={property.type}
                obj={property}
                register={register}
                language={language}
                errors={errors}
                control={control}
                reset={reset}
                disableAll={false}
              />
            );
          })}
        </MainFormModal>
        <Button
          variant="outlined"
          component="label"
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

export default EnterDBTModal;
