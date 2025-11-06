import {
  Avatar,
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ColorButton } from "../../components/Utils";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { LogoUrls } from "../../constants";
import { useTranslation } from "react-i18next";

export const CustomTextField = styled(TextField)({
  marginBottom: "10px",
  "& label.Mui-focused": {
    color: "#1976d2", //#A0AAB4
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#B2BAC2",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#E0E3E7",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6F7E8C",
    },
    "&.Mui-disabled input": {
      "-webkit-text-fill-color": "rgba(0, 0, 0, 0.6)",
    },
    "&.Mui-disabled textarea": {
      "-webkit-text-fill-color": "rgba(0, 0, 0, 0.6)",
    },
  },
});

const radioButtonStyle = {
  color: "#006633",
  "&.Mui-checked": {
    color: "#006633",
  },
};

function AnnouncementConfigurator(props) {
  const { t } = useTranslation();
  const { onSaveClick, mode, selectedAnnouncement } = props;
  const [announcementData, setAnnouncementData] =
    useState(selectedAnnouncement);
  const [previewLang, setPreviewLang] = useState("en");
  const [mobileError, setMobileError] = useState(false);
  const viewOnly = mode === "view";

  const handleInputChange = (event, fieldGroup, fieldName) => {
    let input = "";
    if (fieldGroup === "status") {
      input = event.target.checked;
    } else if (fieldGroup === "contact" && event.target.value.match(/\D/)) {
      event.preventDefault();
    } else {
      input = event.target.value;
    }
    setAnnouncementData((prevState) => ({
      ...prevState,
      [fieldGroup]: fieldName
        ? { ...prevState[fieldGroup], [fieldName]: input }
        : input,
    }));
  };

  const handleMobileInputBlur = () => {
    const { contact } = announcementData;
    if (contact !== "" && !/^\d{10}$/.test(contact)) {
      setMobileError(true);
    } else {
      setMobileError(false);
    }
  };

  const enableSave = () => {
    const { title, announcement, contact } = announcementData;

    if (!title?.en || !title?.hi) {
      return true;
    } else if (!announcement?.en || !announcement?.hi) {
      return true;
    } else if (contact !== "" && contact?.length !== 10) {
      return true;
    } else {
      return false;
    }
  };

  const saveEnabled = enableSave();
  return (
    <Box className="configurator-body" data-testid="announcement-form">
      <Box className="add-field">
        <Typography className="add-field-label">
          {t("ANC_TITLE")}
          <span className="required-field"> *</span>
        </Typography>
        <Box className="add-field-input">
          <CustomTextField
            label="English"
            id="outlined-title-en"
            size="small"
            fullWidth
            sx={{ mr: "10px" }}
            value={announcementData.title.en}
            disabled={viewOnly}
            onChange={(e) => handleInputChange(e, "title", "en")}
          />
          <CustomTextField
            label="हिन्दी"
            id="outlined-title-hi"
            size="small"
            fullWidth
            value={announcementData.title.hi}
            disabled={viewOnly}
            onChange={(e) => handleInputChange(e, "title", "hi")}
          />
        </Box>
      </Box>
      <Box className="add-field-baseline">
        <Typography className="add-field-label">
          {t("ANC_ANC_HEADER")} <span className="required-field"> *</span>
        </Typography>
        <Box className="add-field-input">
          <CustomTextField
            label="English"
            id="outlined-text-en"
            multiline
            fullWidth
            sx={{ mr: "10px" }}
            value={announcementData.announcement.en}
            disabled={viewOnly}
            onChange={(e) => handleInputChange(e, "announcement", "en")}
            inputProps={{ maxLength: 180 }}
            helperText={`${announcementData.announcement.en.length}/${180}`}
          />
          <CustomTextField
            label="हिन्दी"
            id="outlined-text-hi"
            multiline
            fullWidth
            value={announcementData.announcement.hi}
            disabled={viewOnly}
            onChange={(e) => handleInputChange(e, "announcement", "hi")}
            inputProps={{ maxLength: 280 }}
            helperText={`${announcementData.announcement.hi.length}/${280}`}
          />
        </Box>
      </Box>
      <Box className="add-field-baseline">
        <Typography className="add-field-label">
          {t("COMMON_MOBILE_NUMBER")}:
        </Typography>
        <Box className="add-field-input">
          <CustomTextField
            placeholder="98XXXXXXXX"
            id="outlined-mobile"
            size="small"
            fullWidth
            value={announcementData.contact}
            disabled={viewOnly}
            onChange={(e) => handleInputChange(e, "contact")}
            inputProps={{
              maxLength: 10,
            }}
            onBlur={handleMobileInputBlur}
            helperText={t("COMMON_MOBILE_VALIDATION_ERROR")}
            error={mobileError}
          />
        </Box>
      </Box>
      <Box className="add-field">
        <Typography className="add-field-label">{t("ANC_URL")}:</Typography>
        <Box className="add-field-input">
          <CustomTextField
            placeholder="https://url.in"
            id="outlined-url"
            size="small"
            fullWidth
            value={announcementData.url}
            disabled={viewOnly}
            onChange={(e) => handleInputChange(e, "url")}
            type="url"
          />
        </Box>
      </Box>
      <Box className="add-field">
        <Typography className="add-field-label">
          {t("ANC_ACTIVE_STATE")}:
        </Typography>
        <Box className="add-field-input">
          <Switch
            checked={announcementData.status}
            disabled={viewOnly}
            onChange={(e) => handleInputChange(e, "status")}
            inputProps={{ "aria-label": "controlled" }}
            color="success"
          />
        </Box>
      </Box>
      <Box className="add-field">
        <Typography
          className="add-field-label"
          sx={{ display: "flex", alignItems: "center" }}
        >
          {t("ANC_TYPE")}:
        </Typography>
        <FormControl>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            onChange={(e) => handleInputChange(e, "type")}
          >
            <FormControlLabel
              value="NEW_LAUNCHED"
              control={
                <Radio
                  sx={radioButtonStyle}
                  checked={announcementData.type === "NEW_LAUNCHED"}
                  disabled={viewOnly}
                />
              }
              label={t("ANC_NEW_LAUNCHED")}
            />
            <FormControlLabel
              value="ANNOUNCEMENT"
              control={
                <Radio
                  sx={radioButtonStyle}
                  checked={announcementData.type === "ANNOUNCEMENT"}
                  disabled={viewOnly}
                />
              }
              label={t("ANC_ANC_HEADER")}
            />
            <FormControlLabel
              value="INFORMATION"
              control={
                <Radio
                  sx={radioButtonStyle}
                  checked={announcementData.type === "INFORMATION"}
                  disabled={viewOnly}
                />
              }
              label={t("ANC_INFORMATION")}
            />
          </RadioGroup>
        </FormControl>
      </Box>
      <Box className="preview-action-box">
        <Box className="add-field-label">
          <Typography>{t("COMMON_PREVIEW")}:</Typography>
          <FormControl>
            <RadioGroup
              column
              aria-labelledby="column-radio-buttons-group"
              name="column-radio-buttons-group"
              onChange={(e) => setPreviewLang(e.target.value)}
            >
              <FormControlLabel
                value="en"
                control={
                  <Radio sx={radioButtonStyle} checked={previewLang === "en"} />
                }
                label="English"
                data-testid="preview-lang"
              />
              <FormControlLabel
                value="hi"
                control={
                  <Radio sx={radioButtonStyle} checked={previewLang === "hi"} />
                }
                label="हिन्दी"
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box sx={{ position: "relative" }}>
          <Avatar
            alt="mobile-banner"
            src={LogoUrls[`${announcementData.type}_Logo_Url`]}
            className="preview-logo"
          />
          <Typography className="mobile-banner-text">
            {announcementData.announcement[previewLang]}
          </Typography>
        </Box>
        {!viewOnly && (
          <Box className="announcement-save-container">
            <ColorButton
              bgcolor={saveEnabled ? "#cccccc" : "#006633"}
              hoverbgcolor="#7a1f20"
              onClick={() => onSaveClick(announcementData, mode)}
              disabled={saveEnabled}
            >
              &nbsp;&nbsp;&nbsp;&nbsp;{" "}
              {mode === "create" ? t("COMMON_SAVE") : t("COMMON_UPDATE")}{" "}
              &nbsp;&nbsp;&nbsp;&nbsp;
            </ColorButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}

AnnouncementConfigurator.propTypes = {
  onSaveClick: PropTypes.func,
  mode: PropTypes.string,
  selectedAnnouncement: PropTypes.object,
};

export default AnnouncementConfigurator;
