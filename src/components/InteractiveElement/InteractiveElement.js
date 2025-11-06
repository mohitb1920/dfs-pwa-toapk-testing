import { ButtonBase } from "@mui/material";
import "./InteractiveElement.css";

const InteractiveElement = ({ children, onClick, className = "", sx = {} }) => {
  return (
    <ButtonBase
      className={`interactive-element ${className}`}
      onClick={onClick}
      sx={{...sx}}
    >
      {children}
    </ButtonBase>
  );
};

export default InteractiveElement;

// This component is used to create interactive elements that can be clicked and tab targetable
// To use it, wrap the element you want to make interactive in the InteractiveElement component and move 
// onClick function to the InteractiveElement component

// will not work properly with elements having margin