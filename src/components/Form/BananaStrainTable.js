import React, { useEffect, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import Mapper from "./Mapper";
import { t } from "i18next";

const BananaStrainTable = ({ strainOptions, parent, relation, schemeId, methods, language, disableAll }) => {

  const { errors, watch, clearErrors } = methods;

  const watchedFields = strainOptions.reduce((acc, option, index) => {
    const fieldValue = watch(`${parent}.${relation}.${index}.${option}`, "");
    acc[option] = fieldValue;
    return acc;
  }, {});

  const handleEmptyStringFields = (fields, index, option) => {
    Object.keys(fields).forEach((key) => {
      if (!fields[key]) {
        clearErrors(`${parent}.${relation}.${index}.${option}`);
      }
    });
  };

  const [errorsSet, setErrorsSet] = useState(false);

  useEffect(() => {
    const isAtLeastOneFieldFilled = Object.values(watchedFields).some(
      (value) => value.trim() !== ""
    );

    if (!isAtLeastOneFieldFilled && !errorsSet) {
      setErrorsSet(true);
    } else if (isAtLeastOneFieldFilled && errorsSet) {
      setErrorsSet(false);
      handleEmptyStringFields(watchedFields);
    }
  }, [watchedFields, errorsSet]);

  return (
    <Table sx={{ border: "1px solid #D7DEDA", borderCollapse: "collapse" }}>
      <TableHead sx={{ backgroundColor: "#1A5C4B" }}>
        <TableRow>
          {/* Reduce the width of the first column */}
          <TableCell align="center" sx={{ color: "#FFFFFF", fontWeight: 600, width: "6%" }}>
            {t("schemes.bananaCols.S_No")}
          </TableCell>
          <TableCell align="left" sx={{ color: "#FFFFFF", fontWeight: 600, width: "47%" }}>
            {t("schemes.bananaCols.strain")}
          </TableCell>
          <TableCell align="left" sx={{ color: "#FFFFFF", fontWeight: 600, width: "47%" }}>
            {t("schemes.bananaCols.appliedAreaFor")}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {strainOptions.map((option, index) => (
          <TableRow key={index}>
            {/* Adjust width for serial number column */}
            <TableCell align="center">
              {index + 1}
            </TableCell>

            {/* Strain column */}
            <TableCell>
              {option} {/* Display strain option as text */}
            </TableCell>

            {/* Area input column */}
            <TableCell align="left" sx={{ paddingBottom: "20px" }}>
              <Mapper
                type="string"
                methods={methods}
                schemeId={schemeId}
                parent={`${parent}.${relation}`}
                relation={`${index}.${option}`}
                obj={{ type: "string", number: "number" }}
                language={language}
                disableAll={disableAll}
                errors={errors}
                register={methods.register}
                control={methods.control}
                watch={methods.watch}
                setValue={methods.setValue}
                modalSetValue={methods.setValue}
                reset={methods.reset}
                required={errorsSet}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BananaStrainTable;