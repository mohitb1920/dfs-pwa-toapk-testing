import React, { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { Box, Button, Modal, Fade, Backdrop, Typography } from "@mui/material";
import FormModal from "./FormModal/FormModal";
import { useTranslation } from "react-i18next";
import CustomWidgetSubRow from "./CustomWidgetSubRow";
import useSpecificSchemeData from "../../Hooks/useSpecificSchemeData";
import BananaStrainTable from "./BananaStrainTable";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "1rem",
  boxShadow: 24,
  p: 4,
};

export const CustomSubForm = function (props) {
  const {
    methods,
    relation,
    parent,
    schemeId,
    label,
    name,
    language,
    rawErrors,
    register,
    control,
    setValue,
    disable,
    watch,
    minimum,
    maximum = 2,
  } = props;

  return <CustomWidgetSubRow {...props} />;
};
