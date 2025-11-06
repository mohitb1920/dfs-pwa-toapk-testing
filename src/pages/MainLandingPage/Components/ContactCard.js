import { Box, Card, CardContent, Typography } from "@mui/material";
import React from "react";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import { useTheme } from "@mui/system";

function ContactCard({ contactList, isHomeScreen, language, t, isMobile }) {
  const theme = useTheme();

  let component = (
    <>
      {(isHomeScreen ? contactList?.slice(0, 2) : contactList)?.map(
        (contact) => (
          <Card variant="customCard" className="AboutContactCard ">
            <CardContent>
              {contact?.name && (
                <Typography
                  variant={isMobile ? "subtitle1" : "h5"}
                  color="textSecondary"
                  className="!font-medium"
                >
                  {contact.name[language]}
                </Typography>
              )}
              {contact?.position && (
                <Typography variant="body2" color={theme.palette.text.textGrey}>
                  {contact.position[language]}
                </Typography>
              )}
              <Box className="contact-details">
                <div>
                  {contact?.phone && (
                    <div className="PhoneMailContainer">
                      <PhoneRoundedIcon className="IconWrapper" />
                      <Typography
                        variant="body1"
                        className="contact-email-id-text"
                        color={theme.palette.text.textGrey}
                      >
                        {contact.phone}
                      </Typography>
                    </div>
                  )}
                </div>
                <div>
                  {contact?.email && (
                    <div className="PhoneMailContainer">
                      <MailOutlineRoundedIcon className="IconWrapper" />
                      <Typography
                        variant="body1"
                        className="contact-email-id-text"
                        color={theme.palette.text.textGrey}
                      >
                        {contact.email}
                      </Typography>
                    </div>
                  )}
                </div>
              </Box>
            </CardContent>
          </Card>
        )
      )}
    </>
  );

  return component;
}

export default ContactCard;
