import {
  Box,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function ServiceProviderCategory({ category, onCategory }) {
  function handleATMA() {
    onCategory("atma");
  }

  function handleDivision() {
    onCategory("division");
  }
  return (
    <Box sx={{ width: "70%", maxWidth: "42rem", margin: "0 2%" }}>
      <List
        sx={{
          display: "flex",
          fontWeight: "400",
          cursor: "pointer",
        }}
      >
        <ListItem
          sx={
            category === "atma"
              ? {
                  backgroundColor: "#FEF7FF",
                  borderBottom: "3px solid green",
                }
              : { borderBottom: "3px solid #E8E8E8" }
          }
          onClick={handleATMA}
        >
          ATMA Service Provider Centers
        </ListItem>
        <ListItem
          sx={
            category === "division"
              ? {
                  backgroundColor: "#FEF7FF",
                  borderBottom: "3px solid green",
                }
              : { borderBottom: "3px solid #E8E8E8" }
          }
          onClick={handleDivision}
        >
          Division-wise Information
        </ListItem>
      </List>
    </Box>
  );
}

export default ServiceProviderCategory;
