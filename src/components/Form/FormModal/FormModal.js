import { useRef, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import ModalFormComposer from "./ModalFormComposer";
import useSpecificSchemeData from "../../../Hooks/useSpecificSchemeData";
import { useNavigate } from "react-router-dom";
export default function FormModal({
  parent,
  relation,
  schemeId,
  label,
  handleCloseModal,
  setValue,
  setEditIndex,
  editIndex,
  formData,
  setFormData,
  defaultValues,
  disableAll,
  watch,
  language,
  options,
  rawErrors,
  required = true,
  register,
  control,
  methods,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  const navigate = useNavigate();
  if (!schemeId) navigate("..");
  let { data: scheme, isLoading, revalidate } = useSpecificSchemeData(schemeId);
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

  return (
    
      <ModalFormComposer
        scheme={scheme[schemeId][0]?.[label]}
        schemeName={`${parent}.${relation}`}
        schemeId={schemeId}
        language="en"
        watch={watch}
        setIsSubmitting={setIsSubmitting}
        setHasErrors={setHasErrors}
        closeModal={handleCloseModal}
        setValue={setValue}
        setEditIndex={setEditIndex}
        editIndex={editIndex}
        formData={formData}
        setFormData={setFormData}
        defaultValues={defaultValues}
        disable={disableAll}
      />
    
  );
}
