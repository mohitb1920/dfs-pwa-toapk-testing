import React, { useState } from "react";
import { Box, IconButton, InputAdornment, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { CustomTextField } from "../Announcements/AnnouncementConfigurator";
import { useTranslation } from "react-i18next";

function PasswordForm(props) {
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    setErrors,
    forgotPassword = false,
    fieldClassName,
    containerClass = "",
  } = props;
  const [view, setView] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const { t } = useTranslation();
  const checkNewPassword = () => {
    if (
      !new RegExp(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*()_+])[a-zA-Z0-9!@#$%^&*()_+]{8,15}$/
      ).test(newPassword)
    ) {
      setErrors({
        ...errors,
        newPassword: {
          message: "COMMON_PASSWORD_VALIDATION_ERROR",
        },
      });
    } else {
      setErrors({ ...errors, newPassword: null });
    }
  };

  const checkpasswordsMatch = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: {
          message: "COMMON_PASSWORDS_MISMATCH",
        },
      });
    } else {
      setErrors({ ...errors, confirmPassword: null });
    }
  };

  const handleNewPasswordInput = (value) => {
    setNewPassword(value);
    if (confirmPassword) checkpasswordsMatch(confirmPassword, value);
  };

  const handleConfirmPasswordInput = (value) => {
    setConfirmPassword(value);
    checkpasswordsMatch(value, newPassword);
  };
  return (
    <Box className={containerClass}>
      {!forgotPassword && (
        <Box className={fieldClassName}>
          <Typography variant="primary" className="add-field-label">
            {t("COMMON_CURRENT_PASSWORD")} *
          </Typography>
          <Box className="add-field-input">
            <CustomTextField
              id="outlined-title-en"
              size="small"
              fullWidth
              type={view.current ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setView({ ...view, current: !view.current })
                      }
                      edge="end"
                    >
                      {view.current ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{
                "data-testid":"current-password"
              }}
            />
          </Box>
        </Box>
      )}
      <Box className={fieldClassName}>
        <Typography variant="primary" className="add-field-label">
          {t("COMMON_NEW_PASSWORD")} *
        </Typography>
        <Box className="add-field-input">
          <CustomTextField
            id="outlined-title-en"
            size="small"
            fullWidth
            type={view.new ? "text" : "password"}
            value={newPassword}
            onChange={(e) => handleNewPasswordInput(e.target.value)}
            onBlur={checkNewPassword}
            error={errors?.newPassword || false}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setView({ ...view, new: !view.new })}
                    edge="end"
                  >
                    {view.new ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText={t(errors?.newPassword?.message)}
            inputProps={{
              "data-testid":"new-password"
            }}
          />
        </Box>
      </Box>
      <Box className={fieldClassName}>
        <Typography variant="primary" className="add-field-label">
          {t("COMMON_CONFIRM_NEW_PASSWORD")} *
        </Typography>
        <Box className="add-field-input">
          <CustomTextField
            id="outlined-title-en"
            size="small"
            fullWidth
            type={view.confirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordInput(e.target.value)}
            error={errors?.confirmPassword || false}
            helperText={t(errors?.confirmPassword?.message)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setView({ ...view, confirm: !view.confirm })}
                    edge="end"
                  >
                    {view.confirm ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputProps={{
              "data-testid":"confirm-password"
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default PasswordForm;
