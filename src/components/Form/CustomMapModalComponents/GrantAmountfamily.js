import React, { forwardRef, useEffect, useState } from "react";
import MainFormModal from "../FormModal/MainFormModal";
import { urls } from "../../../Utils/Urls";
import { useWatch } from "react-hook-form";
import Mapper from "../Mapper";
import { Box, Button, FormHelperText } from "@mui/material";
import { Request } from "../../../services/Request";

const GrantAmountfamily = forwardRef(
  (
    {
      scheme,
      schemeId,
      schemeName,
      index,
      rawErrors,
      language,
      methods,
      disable,
    },
    ref
  ) => {
    const { control, setValue } = methods;
    const [isLoading, setIsLoading] = useState();

    const groupDetailsWatch = useWatch({
      control,
      name: "farmerType&LandDetails.groupDetails",
    });

    const effected = groupDetailsWatch?.[index]?.["damageArea"];
    const cropArea = groupDetailsWatch?.[index]?.["farmerLandArea"];
    const loss = groupDetailsWatch?.[index]?.["lossReason"];
    const land = groupDetailsWatch?.[index]?.["landType"];
    const crops = groupDetailsWatch?.[index]?.["cropsName"];
    const errors = rawErrors;

    const totalLandWatch = useWatch({
      control,
      name: "farmerType&LandDetails.totalLand",
    });

    const totalAreaWatch = useWatch({
      control,
      name: "farmerType&LandDetails.groupDetails",
      defaultValue: 0,
    });

    // useEffect(() => {
    //   if (!disable) {
    //     if (parseFloat(effected) > parseFloat(cropArea)) {
    //       console.debug("glh");
    //       methods.setError(`farmerType&LandDetails.damageArea`, {
    //         type: "manual",
    //         message: "Value should not exceed total area under the crop.",
    //       });
    //     } else {
    //       methods.clearErrors(`farmerType&LandDetails.damageArea`);
    //     }
    //   }
    // }, [effected, cropArea, methods, disable]);

    useEffect(() => {
      if (!disable) {
        const totalCropArea = totalAreaWatch?.reduce((sum, landDetail) => {
          const area = parseFloat(landDetail["farmerLandArea"]);
          return sum + (isNaN(area) ? 0 : area);
        }, 0);

        setValue("farmerType&LandDetails.totalCropArea", totalCropArea);

        if (totalCropArea > parseFloat(totalLandWatch || "0")) {
          methods.setError("farmerType&LandDetails.totalCropArea", {
            type: "manual",
            message: "schemeErrors.maxValueError",
          });
        } else {
          methods.clearErrors("farmerType&LandDetails.totalCropArea");
        }
      }
    }, [totalLandWatch, setValue, methods, totalAreaWatch, disable]);

    useEffect(() => {
      const fetchSubsidyAmount = async () => {
        if (
          schemeId === "SCHEME013" &&
          effected &&
          loss?.id &&
          land?.id &&
          crops?.id
        ) {
          setIsLoading(true);
          methods.setValue(
            `${schemeName}[${index}].estimatedGrant`,
            "Loading..."
          );
          try {
            const response = await Request({
              url: urls.SchemeAgriInfo,
              useCache: false,
              method: "POST",
              auth: true,
              farmerService: "true",
              params: {
                mdmsId: "SCHEME013",
                apiName: "subsidy",
                landType: land.id,
                cropCode: crops.id,
                effectedLand: effected,
                effectedType: loss.id,
              },
            });

            if (response.data && response.data.length > 0) {
              const subsidyAmount = response.data[0].SubsidyAmount;
              if (
                !errors?.["cropsName"] &&
                !errors?.["damageArea"] &&
                !errors?.["landType"] &&
                !errors?.["lossReason"]
              ) {
                methods.setValue(
                  `${schemeName}[${index}].estimatedGrant`,
                  subsidyAmount
                );
                methods.clearErrors(`${schemeName}[${index}].estimatedGrant`);
              } // Set the estimatedGrant field
              else methods.setValue("estimatedGrant", "N/A");
            }
          } catch (error) {
            console.error(`${schemeName}[${index}].estimatedGrant`, error);
          } finally {
            setIsLoading(false);
          }
        }
      };

      fetchSubsidyAmount();
    }, [effected, loss?.id, land?.id, crops?.id, methods]);

    const getWidthStyles = (type) => {
      return ["string", "date", "label"].includes(type)
        ? "w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]"
        : "w-full";
    };

    return (
      <>
        <Box className="flex flex-wrap gap-y-8 gap-x-4">
          {Object.entries(scheme.properties).map(([fieldKey, fields]) => {
            const { type } = fields;
            const widthStyles = getWidthStyles(type);
            return (
              <Box key={fieldKey} className={widthStyles}>
                <Box sx={{ height: "100%" }}>
                  <Mapper
                    methods={methods}
                    parent={schemeName + `[${index}]`}
                    relation={fieldKey}
                    schemeId={schemeId}
                    type={type}
                    obj={fields}
                    register={methods.register}
                    language={language}
                    errors={errors}
                    control={methods.control}
                    watch={methods.watch}
                    setValue={methods.setValue}
                    modalSetValue={methods.setValue}
                    reset={methods.reset}
                    disableAll={disable}
                  />
                  {/* {fieldKey === "damageArea" && methods.formState.errors?.["farmerType&LandDetails"]?.damageArea && (
                  <FormHelperText error>
                    {methods.formState.errors?.["farmerType&LandDetails"]?.damageArea?.message}
                  </FormHelperText>
                )} */}
                </Box>
              </Box>
            );
          })}
        </Box>
      </>
    );
  }
);

export default GrantAmountfamily;
