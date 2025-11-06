import React, { useEffect } from "react";
import Mapper from "../Mapper";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function SeedForm({
  scheme,
  schemeName,
  schemeId,
  language,
  methods,
  disableAll,
}) {
  const { register, control, errors, setValue, reset, watch } = methods;
  const seed = useSelector((state) => state.seedScheme.seed);
  const navigate = useNavigate();
  const { t } = useTranslation();
  if (!seed || !seed.rate) navigate("..", { state: { schemeId } });

  const rate = seed.rate;
  const grantPercent = seed.grantPercent;
  const limit = seed.limit;
  const subKg = seed.grantPerKg;

  const quantity = methods.watch("seedForm.quantity", "");

  useEffect(() => {
    setValue("seedForm.rate", rate);
    setValue("seedForm.percentageContribution", grantPercent);
    let amount = parseFloat(rate) * quantity;
    if (quantity <= limit) setValue("seedForm.amount", amount);
    else setValue("seedForm.amount", 0);
    let amountContribution;

    if (subKg && subKg != 0) {
      amountContribution = parseFloat(subKg) * quantity;
    } else {
      amountContribution = (parseFloat(grantPercent) * amount) / 100;
    }

    if (quantity > limit) {
      amountContribution = 0;
      amount = 0;
    }
    setValue("seedForm.amountContribution", amountContribution);
    setValue(
      "seedForm.approveAmount",
      parseFloat(amount - amountContribution).toFixed(2)
    );
  }, [quantity, rate, grantPercent]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", rowGap: "0.6rem" }}>
      <div className="flex flex-wrap gap-y-8 gap-x-4">
        <div className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}>
          <div className="h-full">
            <Mapper
              parent={schemeName}
              relation={"quantity"}
              type={"string"}
              obj={scheme.properties["quantity"]}
              register={methods.register}
              language={language}
              errors={errors}
              control={methods.control}
              reset={methods.reset}
              setValue={methods.setValue}
              disableAll={disableAll}
              maximum={limit}
              methods={methods}
            />
          </div>
        </div>
        <div className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}>
          <div className="h-full">
            <Mapper
              parent={schemeName}
              relation={"rate"}
              obj={scheme.properties["rate"]}
              type={"string"}
              register={methods.register}
              language={language}
              errors={errors}
              control={methods.control}
              reset={methods.reset}
              setValue={methods.setValue}
              disableAll={disableAll}
              defaultValue={seed.rate}
              methods={methods}
            />
          </div>
        </div>
        <div className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}>
          <div className="h-full">
            <Mapper
              parent={schemeName}
              relation={"amount"}
              obj={scheme.properties["amount"]}
              type={"string"}
              register={methods.register}
              language={language}
              errors={errors}
              control={methods.control}
              reset={methods.reset}
              setValue={methods.setValue}
              disableAll={disableAll}
              methods={methods}
            />
          </div>
        </div>
        <div className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}>
          <div className="h-full">
            <Mapper
              parent={schemeName}
              relation={"percentageContribution"}
              obj={scheme.properties["percentageContribution"]}
              type={"string"}
              register={methods.register}
              language={language}
              errors={errors}
              control={methods.control}
              reset={methods.reset}
              setValue={methods.setValue}
              disableAll={disableAll}
              defaultValue={seed.grantPercent}
              methods={methods}
            />
          </div>
        </div>
        <div className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}>
          <div className="h-full">
            <Mapper
              parent={schemeName}
              relation={"amountContribution"}
              type={"string"}
              obj={scheme.properties["amountContribution"]}
              register={methods.register}
              language={language}
              errors={errors}
              control={methods.control}
              reset={methods.reset}
              setValue={methods.setValue}
              disableAll={disableAll}
              methods={methods}
            />
          </div>
        </div>
        <div className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}>
          <div className="h-full">
            <Mapper
              parent={schemeName}
              relation={"approveAmount"}
              type={"string"}
              obj={scheme.properties["approveAmount"]}
              register={methods.register}
              language={language}
              errors={errors}
              control={methods.control}
              reset={methods.reset}
              setValue={methods.setValue}
              disableAll={disableAll}
              methods={methods}
            />
          </div>
        </div>
        <div className={`w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]`}>
          <div className="h-full">
            <Mapper
              parent={schemeName}
              relation={"homeDelivery"}
              obj={scheme.properties["homeDelivery"]}
              type={"string"}
              register={methods.register}
              language={language}
              errors={errors}
              control={methods.control}
              reset={methods.reset}
              setValue={methods.setValue}
              disableAll={disableAll}
              methods={methods}
            />
          </div>
        </div>
      </div>
    </Box>
  );
}

export default SeedForm;
