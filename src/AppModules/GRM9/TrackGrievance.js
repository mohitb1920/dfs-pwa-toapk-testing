import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomTextField } from "../../pages/Announcements/AnnouncementConfigurator";
import { useNavigate } from "react-router-dom";

function TrackGrievance() {
  const { t } = useTranslation();
  const [ticketId, setTicketId] = useState("");
  const [contact, setContact] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const handleInputChange = (event) => {
    if (event.target.value.match(/\D/)) {
      event.preventDefault();
    } else {
      setContact(event.target.value);
      if (errors.hasOwnProperty("contact")) {
        const newErrors = { ...errors };
        delete newErrors["contact"];
        setErrors(newErrors);
      }
    }
  };

  const handleTicketInput = (event) => {
    setTicketId(event.target.value);
    if (errors.hasOwnProperty("ticketId")) {
      const newErrors = { ...errors };
      delete newErrors["ticketId"];
      setErrors(newErrors);
    }
  }

  const handleSearch = () => {
    const validationErrors = {};
    if(ticketId.length !== 21) {
      validationErrors.ticketId = "TICKET_VALIDATION_ERROR";
    }
    if(contact.length !== 10) {
      validationErrors.contact = "COMMON_MOBILE_VALIDATION_ERROR";
    }
    if(Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    sessionStorage.setItem("tech-support-search-contact", contact);
    navigate(`${window.contextPath}/technical-support/complaintdetails/${ticketId}`);
  };

  return (
    <Box className="track-issue-container">
      <Typography className="track-details-header1">
        {t("TRACK_STATUS")}
      </Typography>
      <Typography className="track-details-header2">
        {t("PROVIDE_DETAILS")}
      </Typography>
      <Box className="track-issue-details-box">
        <Box className="flex gap-2 flex-wrap">
          <Box className="support-input-item-flex">
            <Typography className="support-input-field-label">
              {t("TICKET_ID")}*
            </Typography>
            <CustomTextField
              placeholder={t("ENTER_TICKET_NUMBER")}
              id="outlined-ticket-id"
              size="small"
              fullWidth
              onChange={(e) => handleTicketInput(e)}
              inputProps={{
                maxLength: 21,
              }}
              value={ticketId}
              helperText={
                errors.ticketId && t("TICKET_VALIDATION_ERROR")
              }
              error={errors.ticketId}
            />
          </Box>
          <Box className="support-input-item-flex">
            <Typography className="support-input-field-label">
              {t("COMMON_MOBILE_NUMBER")}*
            </Typography>
            <CustomTextField
              placeholder={t("COMMON_ENTER_MOBILE_NUMBER")}
              id="outlined-mobile"
              size="small"
              fullWidth
              onChange={(e) => handleInputChange(e)}
              value={contact}
              inputProps={{
                maxLength: 10,
              }}
              helperText={errors.contact && t("COMMON_MOBILE_VALIDATION_ERROR")}
              error={errors.contact}
            />
          </Box>
        </Box>
        <Box className="flex justify-center mt-5">
          <Button
            variant="contained"
            className="track-action-button"
            onClick={handleSearch}
          >
            {t("TECH_COMMON_SUBMIT")}
          </Button>
        </Box>
      </Box>
      
    </Box>
  );
}

export default TrackGrievance;
