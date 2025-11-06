import React, { forwardRef } from "react";
import { Grid, Box } from "@mui/material";

const MainFormModal = forwardRef(({ children, ...props }, ref) => {
  return (
    <form ref={ref} {...props} noValidate>
      <Box sx={{ minHeight: "300px" }}>
        {React.Children.map(children, (child, index) => (
          <Grid item xs={7} sm={10} key={index}>
            <Box sx={{ minWidth: 100, width: "100%", margin: "10px 0" }}>
              {child}
            </Box>
          </Grid>
        ))}
      </Box>
    </form>
  );
});
export default MainFormModal;
