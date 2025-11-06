import React, { useState } from "react";
import "./ButtonStyle.css";
import { ButtonColor, ButtonSize, ButtonState } from "./ButtonEnums";
import { Button, Tooltip } from "@mui/material";

const CustomButton = ({
  color = ButtonColor.PRIMARY,
  size = ButtonSize.MEDIUM,
  state = ButtonState.ENABLED,
  showIcon = false,
  onClick,
  children,
  customClass = "",
  sx = {},
  type = "button",
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  const buttonClass = `custom-button ${size} ${color} ${state} ${isPressed ? "pressed" : ""} ${customClass} `;

  return (
    <Tooltip title={children}>
      <Button
        className={buttonClass}
        disabled={state === ButtonState.DISABLED}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onClick={onClick}
        type={type}
        sx={{
          textTransform: "none",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          ...sx,
          // overflow: "hidden",
        }}
      >
        {showIcon && <span className="button-icon"></span>}
        {children}
      </Button>
    </Tooltip>
  );
};

export default CustomButton;
