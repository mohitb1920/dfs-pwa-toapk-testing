import { Box, Button, Typography, IconButton, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
const DivisionWiseInformation = ({ data }) => {
  return (
    <Box
      width="95%"
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: { sm: "center", md: "left" },
        marginTop: "20px",
        marginLeft: "1.5%",
        rowGap: "1rem",
        columnGap: "0rem",

        flexWrap: "wrap",
        backgroundColor: "#F2F1EB",
        borderRadius: "1rem",
      }}
    >
      {data.map((e) => {
        return (
          <Box
            sx={{
              width: "50%",
              display: "flex",
              flexDirection: "column",

              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                width: "98%",
                display: "flex",
                justifyContent: "left",
                alignItems: "left",
                padding: "1rem",
                backgroundColor: "#fff",
                borderColor: "#B2B1B9",
                borderRadius: "1rem",
                flexGrow: "1",
                cursor: "pointer",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "left",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    marginTop: "10px",
                    borderRadius: "4rem",
                    backgroundColor: "#9C9C9C",
                    margin: "0px 20px 0px 10px",
                    minWidth: "3rem",
                    display: "flex",
                    width: "3rem",
                    height: "3rem",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={`${window.contextPath}/assets/${e.image}`}
                    sx={{
                      width: "2rem",
                      height: "2rem",
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: "1rem",
                    }}
                  >
                    {e.title}
                  </Typography>
                </Box>
              </Box>
              <IconButton sx={{ marginLeft: "auto" }}>
                <ExpandMoreIcon />
              </IconButton>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default DivisionWiseInformation;
