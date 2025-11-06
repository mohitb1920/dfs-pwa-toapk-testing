import {
  Box,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useTranslation } from "react-i18next";

function CategoryProvider({ active, onSetActive, data }) {
  function handleChange(e) {
    if(e)
    onSetActive(e);
  }
  const { t } = useTranslation();
  const activeStyle = {
    borderTop: "5px solid #254336",
    borderTopLeftRadius: "5rem",
    borderTopRightRadius: "5rem",
    margin: "0 10px",
  };

  return (
    <Box sx={{ width: "96%", margin: "0 0 0 3%", backgroundColor: "#fff",boxShadow:"0px 0px 2px 0px #00000040", border:"1px solid #eaecf0",borderRadius:"0.375rem" }}>
      <List
        sx={{
          display: "flex",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          fontWeight: "400",
          cursor: "pointer",
          textAlign: "center",
          padding: "0px",
        }}
      >
        {data.map((item, index) => (
          <ListItem key={index}
            sx={{
              padding: "0px",
              textAlign: "center",
              justifyContent: "center",
            }}
            onClick={() => handleChange(item.id)}
          >
            <Box>
              <Typography
                sx={{
                  color: active === item.id ? "#006633" : "#49454F",
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
                {t(item.label) || t(item.message)}
              </Typography>
              <Box
                sx={{
                  ...(active === item.id && activeStyle),
                }}
              ></Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default CategoryProvider ;
