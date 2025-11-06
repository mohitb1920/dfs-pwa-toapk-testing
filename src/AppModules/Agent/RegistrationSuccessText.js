import React from "react";
import { Grid, Typography } from "@mui/material";

export default function RegistrationSuccessText({ t, isUpdated }) {
  const message = `farmerRegistration.${
    isUpdated === true
      ? "REGISTRATION_UPDATE_SUCCESSFUL"
      : "REGISTRATION_CREATE_SUCCESSFUL"
  }`;

  return (
    <>
      {" "}
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"

        style={{ height: "59px" }}
      >
        <Grid item>
          <Typography
            style={{
              fontFamily: "Inter",
              fontSize: "14px",
              fontWeight: "600",
              lineHeight: "20px",
              textAlign: "center",
              marginBottom: "5px",
            }}
          >
            {t("farmerRegistration.CONGRATULATIONS")}
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            style={{
              fontFamily: "Inter",
              fontSize: "14px",
              fontWeight: "400",
              lineHeight: "14px",
              textAlign: "center",
            }}
          >
            {t(message)}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
