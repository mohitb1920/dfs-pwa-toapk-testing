import React, { useRef, useState, useImperativeHandle, useEffect } from "react";
import { useForm } from "react-hook-form";
import Mapper from "../Mapper";
import MainFormModal from "./MainFormModal";
import CustomMainFormModal from "./CustomMainFormModal";
import CustomModalMapping from "../CutomModalMapping";
import { Button } from "@mui/material";
import AddBananaStrainModal from "../AddBananaStrainModal";
import EnterDBTModal from "../EnterDBTModal";

const ModalFormComposer = ({
  scheme,
  schemeName,
  schemeId,
  language,
  setHasErrors,
  setMoveAhead,
  setValue,
  closeModal,
  setEditIndex,
  editIndex,
  formData,
  setFormData,
  defaultValues,
  watch,
  disable,
}) => {
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: defaultValues,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { errors } = methods.formState;
  const formRef = useRef();

  const handleClick = () => {
    if (formRef.current && formRef.current.submit) {
      formRef.current.submit();
    }
  };

  useEffect(() => {
    methods.reset(defaultValues);
  }, [defaultValues, methods]);

  useEffect(() => {
    const district = watch("landDetails.farmerDistrict");
    const selectedPart = watch("appliedComponentScreenHorti.farmerPartName");

    methods.setValue("landDetails.farmerDistrict", district);
    methods.setValue(
      "appliedComponentScreenHorti.farmerPartName",
      selectedPart
    );
  }, [methods, watch]);

  const onSubmit = (data) => {
    if (isLoading) return;
    if (setMoveAhead) setMoveAhead((prevActiveStep) => prevActiveStep + 1);

    if (closeModal) {
      if (editIndex !== null) {
        const updatedFormData = [...formData];
        updatedFormData[editIndex] = data;
        setFormData(updatedFormData);
        setEditIndex(null);
        if (setValue) {
          setValue(schemeName, updatedFormData);
        }
      } else {
        setFormData([...formData, data]);
        if (setValue) {
          setValue(schemeName, [...formData, data]);
        }
      }
      closeModal();
    }
  };
  const onError = (error) => {
    setHasErrors(Object.keys(error).length > 0);
  };
  useImperativeHandle(formRef, () => ({
    submit: methods.handleSubmit(onSubmit, onError),
  }));
  useEffect(() => {
    const district = watch("landDetails.farmerDistrict");
    const selectedPart = watch("appliedComponentScreenHorti.farmerPartName");

    methods.setValue("landDetails.farmerDistrict", district);
    methods.setValue(
      "appliedComponentScreenHorti.farmerPartName",
      selectedPart
    );
  }, [methods, watch]);

  if (
    schemeId === "SCHEME022" &&
    schemeName === "appliedComponentsLandDetails.plantDetails"
  ) {
    return (
      <CustomMainFormModal
        ref={formRef}
        watch={methods.watch}
        handleSubmit={methods.handleSubmit}
        register={methods.register}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        scheme={scheme}
        language={language}
        disable={disable}
        setValue={methods.setValue}
        formData={formData}
        schemeId={schemeId}
        methods={methods}
        masterWatch={watch}
        handleClick={handleClick}
      />
    );
  }
  if (
    schemeId === "SCHEME013" ||
    (schemeId === "SCHEME008" &&
      schemeName === "familyDetails.memberDetails") ||
    (schemeId === "SCHEME054" && schemeName === "memberDetails.groupDetails")
  )
    return (
      <CustomModalMapping
        schemeId={schemeId}
        scheme={scheme}
        schemeName={schemeName}
        language={language}
        ref={formRef}
        methods={methods}
        disableAll={disable}
        rawErrors={errors}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    );

  if (
    (schemeId === "SCHEME033" || schemeId === "SCHEME031") &&
    schemeName === "appliedComponentScreenHorti.bananaDetails"
  )
    return (
      <AddBananaStrainModal
        ref={formRef}
        watch={methods.watch}
        handleSubmit={methods.handleSubmit}
        register={methods.register}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        scheme={scheme}
        language={language}
        disable={disable}
        setValue={methods.setValue}
        formData={formData}
        schemeId={schemeId}
        methods={methods}
        handleClick={handleClick}
      />
    );

  if (schemeId === "SCHEME053" && schemeName === "memberDetails.groupDetails")
    return (
      <EnterDBTModal
        ref={formRef}
        watch={methods.watch}
        handleSubmit={methods.handleSubmit}
        register={methods.register}
        errors={errors}
        control={methods.control}
        reset={methods.reset}
        scheme={scheme}
        language={language}
        disable={disable}
        setValue={methods.setValue}
        formData={formData}
        schemeId={schemeId}
        methods={methods}
        handleClick={handleClick}
      />
    );

  return (
    <>
      <MainFormModal
        ref={formRef}
        style={{ justifyContent: "center" }}
        onSubmit={methods.handleSubmit(onSubmit, onError)}
      >
        {Object.entries(scheme.properties).map(([fieldKey, fields]) => {
          const { type } = fields;
          return (
            <Mapper
              relation={fieldKey}
              key={fieldKey}
              schemeId={schemeId}
              type={type}
              obj={fields}
              register={methods.register}
              language={language}
              errors={errors}
              control={methods.control}
              watch={methods.watch}
              setValue={setValue}
              modalSetValue={methods.setValue}
              reset={methods.reset}
              disableAll={disable}
            />
          );
        })}
      </MainFormModal>
      {!disable && ( // Changed condition to true for demonstration
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
      )}
    </>
  );
};

export default ModalFormComposer;
