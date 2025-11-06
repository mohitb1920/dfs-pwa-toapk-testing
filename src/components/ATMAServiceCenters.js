import {
  Box,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const ATMAServiceCenters = ({ data }) => {
  return (
    <Box width="98%" sx={{ marginLeft: "2%", marginBottom: "20px" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(366px, 1fr))",
          width: { lg: "98%", md: "90%" },
          marginTop: "20px",
          rowGap: "1rem",
          flexWrap: "wrap",
          backgroundColor: "#F2F1EB",
          borderRadius: "1rem",
        }}
      >
        {data.map((e, index) => {
          return (
            <Box
              width="97%"
              height="fit-content"
              sx={{
                display: "flex",
                flexDirection: "column",
                maxWidth: "28rem",
                justifyContent: "left",
                textAlign: "center",
                alignItems: "center",

                backgroundColor: "#fff",
                borderColor: "#B2B1B9",
                borderRadius: "1rem",

                flexGrow: "1",
                cursor: "pointer",
              }}
              onClick={() => console.log(index)}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "left",
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    width: "95%",
                    height: "8rem",
                    backgroundColor: "#F3F3F3",

                    margin: "1rem auto",
                    borderRadius: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={`${window.contextPath}/assets/rudra.jpg`}
                    sx={{
                      width: "100%",
                      height: "8rem",
                      borderRadius: "1rem",
                      maxWidth: "none",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "left",
                    textAlign: "left",
                    width: "90%",
                    marginLeft: "1rem",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: "500",
                      fontSize: "1.3rem",
                      textAlign: "left",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      textWrap: "wrap",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      lineClamp: "2",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {e.group}
                  </Typography>
                  <Typography>
                    <b>CEO:</b> &nbsp; {e.ceo}
                  </Typography>
                  <Typography>
                    <b>Activities:</b> &nbsp; {e.activities}
                  </Typography>
                  <Typography>
                    <b>Email:</b> &nbsp; {e.emailId}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", width: "100%" }}>
                <Button
                  variant="outlined"
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    borderRadius: "2rem",
                    borderColor: "#111111",
                    color: "#111111",
                    textTransform: "none",
                    margin: "10px",
                    fontSize: "1.3rem",
                    "&:hover": {
                      backgroundColor: "#111111",
                      color: "white",
                      borderColor: "#111111",
                    },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "black",

                      borderRadius: "4rem",
                      padding: "0 0.4rem",
                      "&:hover": {
                        backgroundColor: "white",
                      },
                    }}
                  >
                    <CallOutlinedIcon
                      sx={{
                        color: "white",
                        "&:hover": {
                          color: "#111111",
                        },
                      }}
                    />
                  </Box>

                  <Typography sx={{ fontSize: "2rem" }}>Call</Typography>
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    borderRadius: "2rem",
                    borderColor: "#111111",
                    color: "#111111",
                    textTransform: "none",
                    margin: "10px",
                    fontSize: "1.3rem",
                    "&:hover": {
                      backgroundColor: "#111111",
                      color: "white",
                      borderColor: "#111111",
                    },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "black",

                      borderRadius: "4rem",
                      padding: "0 0.4rem",
                      "&:hover": {
                        backgroundColor: "white",
                      },
                    }}
                  >
                    <LocationOnOutlinedIcon
                      sx={{
                        color: "white",
                        "&:hover": {
                          color: "#111111",
                        },
                      }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: "2rem" }}>Map</Typography>
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ATMAServiceCenters;
