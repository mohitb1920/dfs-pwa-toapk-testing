import { useId } from "react";
import {
  CustomCheckbox,
  CustomDatePicker,
  CustomFileUploader,
  CustomRadioGroup,
  CustomTextbox,
  CustomLabel,
  CustomTextPreview,
} from "./CustomWidget";
import { CustomSelect } from "./CustomWidgetDropDown";
import { CustomSubForm } from "./CustomWidgetSubForm";

const Mapper = ({
  relation,
  parent,
  schemeId,
  type,
  obj,
  register,
  language,
  errors,
  watch,
  setValue,
  modalSetValue,
  disableAll,
  defaultValue,
  maximum,
  minimum,
  required,
  subLabel,
  isCheckedPossible,
  value,
  methods,
  scheme,
  maxLength,
  linkTitle,
}) => {
  const id = useId();
  const control = methods?.control;
  const reset = methods?.reset;

  switch (type) {
    case "string":
      if (obj?.options) {
        return (
          <CustomSelect
            schemeId={schemeId}
            methods={methods}
            parent={parent}
            relation={relation}
            name={obj.label || obj[`title-${language}`] || obj[`title`]}
            id={id}
            options={obj?.options}
            required={obj?.required ?? required}
            rawErrors={errors || {}}
            language={language}
            label={obj.label || obj[`title-${language}`] || obj[`title`]}
            disable={obj?.enabled || disableAll}
          />
        );
      }
      return (
        <CustomTextbox
          relation={relation}
          parent={parent}
          id={id}
          schemeId={schemeId}
          label={obj?.label || obj?.[`title-${language}`] || obj?.[`title`]}
          control={methods.control}
          rawErrors={errors || {}}
          watch={watch}
          required={obj?.required ?? required}
          placeholder={obj[`label-${language}`] || obj?.placeholder}
          register={register}
          minLength={obj?.minlength}
          maxLength={maxLength || obj?.maxlength}
          number={obj?.number}
          isInt={obj?.isInt}
          email={obj?.email}
          minimum={obj?.minimum || minimum}
          maximum={obj?.maximum || maximum}
          requiredLength={obj?.requiredLength}
          disable={obj?.enabled || disableAll}
          defaultValue={defaultValue}
          value={value}
          setValue={setValue}
          modalSetValue={modalSetValue}
          methods={methods}
        />
      );
    case "radio":
      return (
        <CustomRadioGroup
          relation={relation}
          schemeId={schemeId}
          parent={parent}
          key={id}
          id={id}
          name={obj.label || obj[`title-${language}`] || obj[`title`]}
          control={methods.control}
          language={language}
          label={obj.label || obj[`title-${language}`] || obj[`title`]}
          options={obj?.options}
          placeholder={obj?.placeholder}
          register={register}
          required={obj?.required ?? required}
          disable={obj?.enabled || disableAll}
          methods={methods}
        />
      );
    case "dropdown":
      return (
        <CustomSelect
          relation={relation}
          parent={parent}
          schemeId={schemeId}
          key={id}
          name={obj.label || obj[`title-${language}`] || obj[`title`]}
          control={control}
          id={id}
          options={obj?.options}
          required={obj?.required ?? required}
          rawErrors={errors}
          language={language}
          label={obj.label || obj[`title-${language}`] || obj[`title`]}
          register={register}
          disable={obj?.enabled || disableAll}
          methods={methods}
        />
      );
    case "checkbox":
      return (
        <CustomCheckbox
          key={id}
          parent={parent}
          relation={relation}
          name={obj.label || obj[`title-${language}`] || obj[`title`]}
          control={control}
          methods={methods}
          id={id}
          schemeId={schemeId}
          options={obj?.options}
          isCheckedPossible={isCheckedPossible}
          required={obj?.required ?? required}
          rawErrors={errors}
          language={language}
          label={obj.label || obj[`title-${language}`] || obj[`title`]}
          register={register}
          disable={obj?.enabled || disableAll}
        />
      );
    case "file":
      return (
        <CustomFileUploader
          key={id}
          schemeId={schemeId}
          parent={parent}
          relation={relation}
          name={
            obj?.text?.[`${language}`] ||
            obj.label ||
            obj?.text?.title ||
            obj[`title`]
          }
          fileTypes={obj.fileType}
          methods={methods}
          control={control}
          id={id}
          options={obj?.options}
          required={obj?.required ?? required}
          rawErrors={errors}
          language={language}
          label={obj.label || obj?.text?.[`${language}`] || obj[`title`]}
          register={register}
          disable={obj?.enabled || disableAll}
          textObject={obj?.text}
          dependent={obj?.dependent}
        />
      );
    case "label":
      const selectedOptions = Array.isArray(obj?.options?.[language])
        ? obj.options[language]
        : Array.isArray(obj?.options)
        ? obj.options
        : [];

      return (
        <CustomLabel
          key={id}
          parent={parent}
          relation={relation}
          schemeId={schemeId}
          name={obj?.[`titleName-${language}`] || obj?.[`title`]}
          control={control}
          id={id}
          options={selectedOptions}
          required={obj?.required || required}
          subLabel={subLabel}
          rawErrors={errors}
          language={language}
          label={obj?.label || obj?.[`title-${language}`] || obj?.[`title`]}
          register={register}
          disable={obj?.enabled || disableAll}
          linkTitle={linkTitle}
          methods={methods}
        />
      );
    case "date":
      return (
        <CustomDatePicker
          parent={parent}
          relation={relation}
          key={id}
          id={id}
          label={obj.label || obj[`title-${language}`] || obj[`title`]}
          required={obj?.required ?? required}
          control={control}
          rawErrors={errors}
          disable={obj?.enabled || disableAll}
          methods={methods}
        />
      );
    case "textPreview":
      return (
        <CustomTextPreview
          parent={parent}
          relation={relation}
          key={id}
          id={id}
          label={obj.label || obj[`title-${language}`] || obj[`title`]}
          required={obj?.required ?? required}
          control={control}
          rawErrors={errors}
          disable={obj?.enabled || disableAll}
          methods={methods}
        />
      );
    default:
      return (
        <CustomSubForm
          key={id}
          parent={parent}
          relation={relation}
          schemeId={schemeId}
          name={obj.name || obj[`title-${language}`] || obj[`title`]}
          control={control}
          methods={methods}
          id={id}
          options={obj?.options}
          required={obj?.required ?? required}
          rawErrors={errors}
          language={language}
          label={obj.label || obj[`title-${language}`] || obj[`title`]}
          register={register}
          setValue={setValue}
          disable={obj?.enabled || disableAll}
          errors={errors}
          disableAll={disableAll}
          reset={reset}
          scheme={scheme}
          type={type}
          obj={obj}
          watch={methods.watch}
          minimum={obj?.minimum || minimum}
          maximum={obj?.maximum || maximum}
          maxValue={obj?.maxValue}
          minValue={obj?.minValue}
        />
      );
  }
};

export default Mapper;
