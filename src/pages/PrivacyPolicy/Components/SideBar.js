import React, { useContext } from "react";
import {
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import NavigateNextSharpIcon from "@mui/icons-material/NavigateNextSharp";
import { ThemeContext } from "../../../theme";

const Sidebar = ({ sections, handleClick, selectedSection, t }) => {
  const handleScrollToSection = (index) => {
    handleClick(index);
  };
  const { ourTheme } = useContext(ThemeContext);
  const theme = useTheme();
  return (
    <Container variant="tertiaryGreen" className="filter-box-style max-sm:!p-3">
      <Typography variant="h5" paddingBottom="24px" className="!font-semibold">
        {t("QuickFilters")}
      </Typography>
      <List sx={{ position: "sticky", top: 0 }}>
        {sections.map((section, index) => (
          <ListItem
            button
            key={section.id}
            selected={index === selectedSection}
            sx={{
              backgroundColor:
                index === selectedSection
                  ? ourTheme === "dark"
                    ? "rgba(133, 188, 49, 1) !important"
                    : "#1A5C4B !important"
                  : "transparent",
              color:
                index === selectedSection
                  ? ourTheme === "light"
                    ? "white"
                    : "black"
                  : theme.palette.text.primary,
              borderRadius: "4px",
              "&:hover": {
                backgroundColor:
                  index === selectedSection
                    ? theme.palette.mode === "dark"
                      ? "#1A5C4B"
                      : "#D1E7DD"
                    : theme.palette.action.hover,
              },
            }}
            onClick={() => handleScrollToSection(index)}
            secondaryAction={
              section.id === selectedSection && (
                <NavigateNextSharpIcon
                  sx={{
                    color: ourTheme === "light" ? "white" : "black",
                  }}
                />
              )
            }
          >
            <ListItemText
              primary={section.name}
              sx={{ fontWeight: "600 !important" }}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Sidebar;
