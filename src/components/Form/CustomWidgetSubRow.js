import React, { useEffect } from "react";
import useSpecificSchemeData from "../../Hooks/useSpecificSchemeData";
import { useRef, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FormModalComponent from "./FormModal/FormModalComponent";
import { useTranslation } from "react-i18next";
import FormModalComponentInputDiesel from "./FormModal/FormModalComponentInputDiesel";

function CustomWidgetSubRow(props) {
  const {
    relation,
    parent,
    schemeId,
    label,
    name,
    disable,
    methods,
    minimum,
    maximum,
    max = Infinity,
    maxValue,
    minValue,
  } = props;

  let { data: scheme, isLoading, revalidate } = useSpecificSchemeData(schemeId);
  const [editIndex, setEditIndex] = useState(null);
  const [min, setMin] = useState(1);
  const schemeName = `${parent}.${relation}`;
  const fieldArray = methods.watch(schemeName) || [];
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (disable) return;
    if (minimum !== undefined && minimum !== null) {
      setMin(minimum);
    } else setMin(1);
  }, [minimum, disable]);

  // useEffect(() => {
  //   if (methods.formState.submitCount > 0) {
  //     validateFieldCount();
  //   }
  // }, [
  //   fieldArray.length,
  //   i18n.language,
  //   methods.formState.isSubmitted,
  //   methods.formState.submitCount,
  //   disable,
  // ]);

  // const validateFieldCount = () => {
  //   console.debug("deep inside", fieldArray.length, min)
  //   if (fieldArray.length < min) {
  //     methods.setError(schemeName, {
  //       type: "min",
  //       message: t("schemeErrors.pleaseEnterValueMin", { min: min }),
  //     });
  //   } else if (fieldArray.length > max) {
  //     methods.setError(schemeName, {
  //       type: "max",
  //       message: `Maximum ${max} ${label || "items"} allowed`,
  //     });
  //   } else {
  //     methods.clearErrors(schemeName);
  //   }
  // };
  const navigate = useNavigate();
  if (!schemeId) navigate("..");
  if (isLoading) {
    return (
      <Box className="flex items-center justify-center h-96">
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (!scheme || !scheme[schemeId]) {
    navigate("..");
  }

  if (
    ["SCHEME008", "SCHEME013"].includes(schemeId) &&
    relation === "memberDetails"
  ) {
    return (
      <FormModalComponentInputDiesel
        {...props}
        label={label}
        scheme={scheme[schemeId][0]?.[name]}
        schemeName={`${parent}.${relation}`}
        schemeId={schemeId}
        watch={methods.watch}
        setValue={methods.setValue}
        setEditIndex={setEditIndex}
        editIndex={editIndex}
        disableAll={disable}
        min={min}
        max={max}
        error={methods.formState?.errors?.[parent]?.[relation]?.message}
      />
    );
  }

  return (
    <FormModalComponent
      {...props}
      label={label}
      scheme={scheme[schemeId][0]?.[name]}
      schemeName={`${parent}.${relation}`}
      schemeId={schemeId}
      watch={methods.watch}
      setValue={methods.setValue}
      setEditIndex={setEditIndex}
      editIndex={editIndex}
      disableAll={disable}
      min={min}
      max={max}
      error={methods.formState?.errors?.[parent]?.[relation]?.message}
    />
  );
}

export default CustomWidgetSubRow;
