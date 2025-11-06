import React, { useEffect } from "react";
import Mapper from "../Mapper";
import { useWatch } from "react-hook-form";
import { SchemeService } from "../../../services/Schemes";
import { dispatchNotification } from "../../Utils";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

function DieselDetailsScreen({
  scheme,
  schemeName,
  schemeId,
  language,
  methods,
  disableAll,
}) {
  const { errors, watch, clearErrors, trigger, control } = methods;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const cropWatch = useWatch({
    control,
    name: "landAndSubsidyDetails2.cropName",
  });
  const noOfIrrigation = useWatch({
    control,
    name: "landAndSubsidyDetails2.numberOfIrrigation",
  });

  const totalArea = useWatch({
    control,
    name: "affectedLandDetail.totalArea",
  });

  useEffect(() => {
    if (disableAll) return;
    const fetchSubsidyAmount = async () => {
      if (
        cropWatch?.id &&
        noOfIrrigation &&
        totalArea &&
        noOfIrrigation !== 0 &&
        totalArea !== 0 &&
        noOfIrrigation !== "" &&
        totalArea !== "" &&
        !!!methods.formState.errors.affectedLandDetail?.totalArea &&
        !!!methods.formState.errors.landAndSubsidyDetails2?.numberOfIrrigation
      ) {
        let isValid = await methods.trigger(
          "landAndSubsidyDetails2.numberOfIrrigation"
        );
        isValid = isValid && methods.trigger("affectedLandDetail.totalArea");

        if (!isValid) {
          methods.setValue("dieselPurchaseDetails.totalEstimatePrice", "");
          return;
        }
        try {
          const response = await SchemeService.subsidyAmount(
            schemeId,
            totalArea,
            noOfIrrigation
          );
          if (response?.[0].SubsidyAmount) {
            methods.setValue(
              "dieselPurchaseDetails.totalEstimatePrice",
              response?.[0].SubsidyAmount
            );
            methods.clearErrors("dieselPurchaseDetails.totalEstimatePrice");
          } else
            throw new Error(
              response?.Errors?.[0]?.code || "SOMETHING_WENT_WRONG"
            );
        } catch (error) {
          let errorMessage;

          if (error.message && error.message !== "SOMETHING_WENT_WRONG") {
            errorMessage = t(error.message, { defaultValue: null });
            if (errorMessage === null || errorMessage === error.message) {
              errorMessage = t("SOMETHING_WENT_WRONG");
            }
          } else {
            errorMessage = t("SOMETHING_WENT_WRONG");
          }

          dispatchNotification("error", [errorMessage], dispatch);
        }
      } else {
        methods.setValue("dieselPurchaseDetails.totalEstimatePrice", "");
      }
    };

    fetchSubsidyAmount();
  }, [
    cropWatch?.id,
    noOfIrrigation,
    totalArea,
    schemeId,
    methods.formState.errors.affectedLandDetail?.totalArea,
    methods.formState.errors.landAndSubsidyDetails2?.numberOfIrrigation,
  ]);

  return (
    <div className="flex flex-wrap gap-y-8 gap-x-4">
      {Object.entries(scheme.properties).map(([fieldKey, fields]) => {
        const { type } = fields;

        if (type != "label")
          return (
            <div
              key={fieldKey}
              className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}
            >
              <div className="h-full">
                <Mapper
                  parent={schemeName}
                  relation={fieldKey}
                  schemeId={schemeId}
                  key={fieldKey}
                  type={type}
                  obj={fields}
                  register={methods.register}
                  language={language}
                  control={methods.control}
                  reset={methods.reset}
                  setValue={methods.setValue}
                  disableAll={disableAll || fieldKey === "totalEstimatePrice"}
                  methods={methods}
                />
              </div>
            </div>
          );
        return (
          <div key={fieldKey} className={`w-full`}>
            <div className="h-full">
              <Mapper
                parent={schemeName}
                relation={fieldKey}
                schemeId={schemeId}
                key={fieldKey}
                type={type}
                obj={fields}
                register={methods.register}
                language={language}
                control={methods.control}
                reset={methods.reset}
                setValue={methods.setValue}
                disableAll={disableAll}
                methods={methods}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DieselDetailsScreen;
