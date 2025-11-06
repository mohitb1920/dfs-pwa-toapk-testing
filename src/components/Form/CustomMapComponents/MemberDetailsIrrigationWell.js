import React from "react";
import Mapper from "../Mapper";
import { Box, Typography } from "@mui/material";

function MemberDetailsIrrigationWell({
  scheme,
  schemeName,
  language,
  methods,
  disableAll,
  schemeId,
}) {
  return (
    <>
      <Box
        sx={{
          fontSize: "2rem",
          margin: "20px 0",
          backgroundColor: "green",
          color: "white",
          padding: "1px",
          borderRadius: "2rem",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.3rem",
            margin: "0 auto",
            width: "fit-content",
            fontWeight: 800,
          }}
        >
          {scheme[`title-${language}`]}
        </Typography>
      </Box>

      <Mapper
        parent={schemeName}
        relation={"groupDetails"}
        type={"subGroup"}
        obj={scheme.properties["groupDetails"]}
        register={methods.register}
        language={language}
        control={methods.control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll}
        required={false}
        watch={methods.watch}
        schemeId={schemeId}
      />

      <Mapper
        parent={schemeName}
        relation={"groupDetails2"}
        type={"subGroup"}
        obj={scheme.properties["groupDetails2"]}
        register={methods.register}
        language={language}
        control={methods.control}
        reset={methods.reset}
        setValue={methods.setValue}
        disableAll={disableAll}
        required={false}
        watch={methods.watch}
        schemeId={schemeId}
      />
    </>
  );
}

export default MemberDetailsIrrigationWell;
