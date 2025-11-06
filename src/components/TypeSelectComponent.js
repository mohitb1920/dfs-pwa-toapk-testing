import React from "react";
import { Box, Radio } from "@mui/material";
import "../styles/TypeSelectComponent.css";
import { useTranslation } from "react-i18next";

const TypeSelectComponent = ({ id, text, svgPath, selected, setSelected }) => {
  const { t } = useTranslation();
  const handleClick = () => {
    setSelected(id);
  };

  return (
    <Box className="type-select-card" onClick={handleClick}>
      <Box className="type-select-option-box">
        <div className="type-select-option-text">{t(text)}</div>
        <Radio
          className="type-select-option-button"
          checked={selected === id}
          color="success"
        />
      </Box>
      <Box
        className="type-select-option-img"
        component="img"
        alt={text}
        src={`${window.contextPath}/assets/${svgPath}`}
      />
    </Box>
  );
};

export default TypeSelectComponent;
