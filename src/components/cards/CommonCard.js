import React, { useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import "./cards.css";

export const CommonCard = ({
  image,
  value,
  description,
  buttonText,
  icon = false,
  headerColor = "#fff",
  isEnabled = true,
  onClick,
  align = "center",
  paddingBlock = "8px",
  contentHeight = "none",
  justifyContent = "space-between",
}) => {
  const textRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:640px)");

  return (
    <Card
      variant="opacityCard"
      className="common-card"
      sx={{
        paddingBlock: paddingBlock,
      }}
    >
      {image != null && (
        <CardMedia style={{ justifyContent: "center", alignSelf: "center" }}>
          <Box
            component="img"
            src={`${window.contextPath}/assets/${image}`}
            alt={value}
            sx={{ borderRadius: "12px" }}
          />
        </CardMedia>
      )}
      <CardContent
        className="card-content"
        sx={{
          alignItems: align,
          height: contentHeight,
          justifyContent: justifyContent,
        }}
      >
        {icon && <AccountBalanceIcon className="account-balance-icon" />}

        <Tooltip title={value} placement="bottom" arrow>
          <Typography
            variant={isMobile ? "subtitle2" : "h5"}
            className="card-value !font-bold !mb-2 sm:!mb-4"
            sx={{ color: headerColor }}
          >
            {value}
          </Typography>
        </Tooltip>
        <Tooltip title={description} placement="bottom" arrow>
          <Typography
            variant={"body2"}
            ref={textRef}
            className="ellipsis-text"
            sx={{ textAlign: align }}
          >
            {description}
          </Typography>
        </Tooltip>
      </CardContent>
      {buttonText && (
        <CardActions className="card-actions">
          <Button
            disabled={!isEnabled}
            variant="primary"
            // state={isEnabled ? ButtonState.ENABLED : ButtonState.DISABLED}
            size="medium"
            onClick={onClick}
          >
            {buttonText}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};
