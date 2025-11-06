import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Typography, Box } from "@mui/material";
import { CssTextField } from "../CustomWidget";
import { farmerDBTData } from "../../../Hooks/farmerData";
import { useTranslation } from "react-i18next";

function FarmerNameonDBT(props) {
  const {
    relation,
    parent,
    disable,
    label,
    language,
    options,
    rawErrors,
    required = true,
    register,
    control,
    watch,
    methods,
    schemeId,
    minLength,
    maxLength,
    requiredLength,
    number,
    isInt,
    email,
    minimum,
    maximum,
    placeholder,
    defaultValue,
  } = props;

  const [dbtData, setDbtData] = useState(null);
  const [dbtError, setDbtError] = useState(null);
  const dbt = watch(`${parent}.DBTId`, "");
  useEffect(() => {
    methods.setValue(`${parent}.farmerName`, "");
    setDbtError(null);
    const fetchDbtData = async () => {
      const result = await farmerDBTData(dbt);
      if (result.data) {
        setDbtData(result.data);
        setDbtError(null);
      } else {
        setDbtError(result.error.response?.data?.Errors?.[0]);
      }
    };

    if (schemeId === "SCHEME001" && dbt && dbt.length === 13) {
      fetchDbtData();
    } else {
      methods.setValue(`${parent}.farmerName`, "");
    }
  }, [dbt, schemeId]);
  const { t } = useTranslation();
  useEffect(() => {
    if (dbtData) {
      const name = dbtData?.Individual?.name?.givenName || "";
      methods.setValue(`${parent}.farmerName`, name);
      methods.clearErrors(`${parent}.farmerName`);
    }
  }, [dbtData, methods, parent, relation]);
  return (
    <Controller
      name={parent ? `${parent}.${relation}` : relation}
      control={control}
      defaultValue=""
      rules={{ required: required && `${t("schemeErrors.fieldIsRequired")}` }}
      render={({ field, fieldState: { error } }) => {
        return (
          <Box>
            <Typography
              className={error ? "required-field input-label" : "input-label"}
            >
              {t(label)}
              {required && <span className="required-field">&nbsp;*</span>}
            </Typography>
            <CssTextField
              {...field}
              variant="outlined"
              error={!!error}
              disabled={disable}
              placeholder={placeholder}
              helperText={
                error ? error.message : dbtError ? dbtError?.code : null
              }
              sx={{ width: "100%", height: "40px" }}
            />
          </Box>
        );
      }}
    />
  );
}

export default FarmerNameonDBT;
