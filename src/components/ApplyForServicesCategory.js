import {
  Box,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

function ApplyForServicesCategory({ category, onCategory }) {
  function handleATMA() {
    onCategory("atma");
  }

  function handleDivision() {
    onCategory("division");
  }

  const activeStyle = {
    borderTop: "5px solid #254336",
    borderTopLeftRadius: "5rem",
    borderTopRightRadius: "5rem",
    margin: "0 10px",
  };

  return (
    <Box sx={{ width: "98%", margin: "0 0 0 2%", backgroundColor: "#fff" }}>
      <List
        sx={{
          display: "flex",
          fontWeight: "400",

          cursor: "pointer",
          textAlign: "center",
          padding: "0px",
        }}
      >
        <ListItem
          sx={{
            padding: "0px",
            textAlign: "center",
            justifyContent: "center",
          }}
          onClick={handleATMA}
        >
          <Box>
            <Typography
              sx={{
                color: category === "atma" ? "#40A578" : "#686D76",
                fontSize: "0.9rem",
                fontWeight: "500",
                padding: "10px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                textWrap: "wrap",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                lineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
            >
              ATMA Service Provider Centers
            </Typography>
            <Box
              sx={{
                ...(category === "atma" && activeStyle),
              }}
            ></Box>
          </Box>
        </ListItem>
        <ListItem
          sx={{
            padding: "0px",
            textAlign: "center",
            justifyContent: "center",
          }}
          onClick={handleDivision}
        >
          <Box>
            <Typography
              sx={{
                color: category === "division" ? "#40A578" : "#686D76",
                fontSize: "0.9rem",
                fontWeight: "500",

                padding: "10px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                textWrap: "wrap",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                lineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
            >
              Division-wise Information
            </Typography>
            <Box
              sx={{
                ...(category === "division" && activeStyle),
              }}
            ></Box>
          </Box>
        </ListItem>
      </List>
    </Box>
  );
}

export default ApplyForServicesCategory;
