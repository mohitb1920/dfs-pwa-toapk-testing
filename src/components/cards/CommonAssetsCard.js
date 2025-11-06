import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import React from "react";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

export const CommonAssetsCard = ({ value }) => {
  return (
    <Card
      sx={{
        borderRadius: "16px",
        padding: 2,
        // backgroundColor: "#406f62",
        // color: "#fff",
      }}
    >
      <CardContent
        sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 1 }}>
            {value}
          </Typography>
        </Box>

        <AccountBalanceIcon sx={{ fontSize: 50, marginBottom: 1 }} />
      </CardContent>
    </Card>
  );
};
