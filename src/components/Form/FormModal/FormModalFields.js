import React from "react";
import Mapper from "../Mapper";
import CustomMainFormModal from "./CustomMainFormModal";
import CustomModalMapping from "../CutomModalMapping";
import AddBananaStrainModal from "../AddBananaStrainModal";
import EnterDBTModal from "../EnterDBTModal";

function FormModalFields(props) {
  const {
    index,
    label,
    methods,
    scheme,
    schemeName,
    schemeId,
    setValue,
    setEditIndex,
    editIndex,
    disableAll,
    language,
  } = props;
  if (
    schemeId === "SCHEME022" &&
    schemeName === "appliedComponentsLandDetails.plantDetails"
  ) {
    return (
      <CustomMainFormModal
        watch={methods.watch}
        handleSubmit={methods.handleSubmit}
        register={methods.register}
        errors={methods.formstate?.errors}
        control={methods.control}
        reset={methods.reset}
        scheme={scheme}
        language={language}
        disable={disableAll}
        setValue={methods.setValue}
        schemeId={schemeId}
        methods={methods}
        schemeName={schemeName}
        index={index}
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
        index={index}
        language={language}
        methods={methods}
        disableAll={disableAll}
        rawErrors={methods.formstate?.errors}
      />
    );

  if (
    (schemeId === "SCHEME031" || (schemeId === "SCHEME033" && methods.getValues().appliedComponentScreenHorti?.farmerPartName?.value.includes("Banana"))) &&
    schemeName === "appliedComponentScreenHorti.bananaDetails"
  )
    return (
      <AddBananaStrainModal
        watch={methods.watch}
        handleSubmit={methods.handleSubmit}
        register={methods.register}
        errors={methods.formstate?.errors}
        control={methods.control}
        reset={methods.reset}
        index={index}
        scheme={scheme}
        schemeName={schemeName}
        language={language}
        disable={disableAll}
        setValue={methods.setValue}
        schemeId={schemeId}
        methods={methods}
      />
    );

  if (schemeId === "SCHEME053" && schemeName === "memberDetails.groupDetails")
    return (
      <EnterDBTModal
        watch={methods.watch}
        handleSubmit={methods.handleSubmit}
        register={methods.register}
        errors={methods.formstate.errors}
        control={methods.control}
        reset={methods.reset}
        scheme={scheme}
        schemeName={schemeName + `[${index}]`}
        language={language}
        disable={disableAll}
        setValue={methods.setValue}
        schemeId={schemeId}
        methods={methods}
      />
    );

  const getWidthClass = (type) => {
    if (["string", "date", "label"].includes(type)) {
      return "w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]";
    }
    return "w-full";
  };

  return (
    <div className="flex flex-wrap gap-y-8 gap-x-4">
      {Object.entries(scheme.properties).map(([fieldKey, fields]) => {
        const { type } = fields;
        const widthClass = getWidthClass(type);

        return (
          <div key={fieldKey} className={`${widthClass}`}>
            <div className="h-full">
              <Mapper
                type={type}
                methods={methods}
                schemeId={schemeId}
                parent={schemeName + `[${index}]`}
                relation={fieldKey}
                obj={fields}
                language={language}
                disableAll={disableAll}
                errors={methods.formState.errors}
                key={fieldKey}
                register={methods.register}
                control={methods.control}
                watch={methods.watch}
                setValue={methods.setValue}
                modalSetValue={methods.setValue}
                reset={methods.reset}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FormModalFields;
