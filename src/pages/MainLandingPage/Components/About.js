import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import ContactsIcon from "@mui/icons-material/Contacts";
import { useNavigate } from "react-router-dom";
import { ImageBox } from "./ImageBox";
import "../Styles/About.css";
import { AboutComponentSkeletonLoader } from "../SkeletonLoader/SkeletonLoaders";
import ContactCard from "./ContactCard";
import { useFileStoreData } from "../../../Hooks/useFileStoreData";

export const About = ({ t, language, isMobile }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const jsonUrl =
    "https://filestoragedfs.blob.core.windows.net/publicresources/json/AssistedMode/contacts.json";

  const { data, isLoading } = useFileStoreData({
    url: jsonUrl,
    key: "contacts",
  });

  const [isExpanded, setIsExpanded] = useState(false);
  if (isLoading) return <AboutComponentSkeletonLoader />;

  return (
    <Container variant="primary">
      <Box className="AboutHeaderBox" id="about-home">
        {data?.CmAgriMinister != null ? (
          <Box className="inner-box-screen2">
            <Grid container columnSpacing={4}>
              {/* Left Text Content */}
              <Grid item xs={12} sm={6}>
                <Box className="grid-about-section">
                  <Typography variant="h1" className="AboutText pb-5">
                    {data?.["about"]?.name?.[language] ?? ""}
                  </Typography>
                  <Typography
                    variant="h5"
                    className="AboutDescription"
                    color="textSecondary"
                  >
                    {data?.["about"]?.description[language]}
                  </Typography>
                  {/* <Tooltip title={about.description2[language]}> */}
                  <Typography
                    variant="h6"
                    color={theme.palette.text.textGrey}
                    className={`AboutDescriptionEllipsis ${
                      isExpanded ? "expanded" : ""
                    }`}
                    style={{ WebkitLineClamp: isExpanded ? null : "4" }}
                  >
                    {data?.["about"]?.description2[language]}
                  </Typography>
                  {/* </Tooltip> */}
                  {isExpanded && (
                    // <Tooltip title={about.description3[language]}>
                    <Typography
                      variant="body1"
                      className="AboutDescriptionEllipsis expanded"
                    >
                      {data?.["about"]?.description3[language]}
                    </Typography>
                    // </Tooltip>
                  )}
                  <Box className="flex justify-center sm:block">
                    <Button
                      variant="primary"
                      className="AboutLearnButton"
                      size="large"
                      onClick={() =>
                        navigate(`${window.contextPath}/about-section`)
                      }
                    >
                      {/* {isExpanded ? t("ReadLess") :  */ t("ReadMore")}
                    </Button>
                  </Box>
                </Box>
              </Grid>

              {/* Right Images */}
              <Grid item xs={12} sm={6}>
                <Box className="grid-about-section">
                  <Box className="AboutImageBox">
                    {data?.CmAgriMinister?.slice(0, 2).map((d) => (
                      <div className="sm:pr-[40px] pb-[10px]">
                        <ImageBox
                          name={d?.name[language]}
                          designation={d?.position[language]}
                          image={d?.imageUrl}
                          contact={d?.phone}
                          height={180}
                          width={180}
                        />
                      </div>
                    ))}
                  </Box>
                  <Box>
                    <Box className="contacts-header pb-4">
                      <Box className="contacts-icon-wrapper">
                        <ContactsIcon className="mr-2 sm:mr-4" />
                        <Typography variant="h6">{t("KeyContacts")}</Typography>
                      </Box>

                      <Button
                        variant="secondary"
                        onClick={() =>
                          navigate(`${window.contextPath}/key-contacts`)
                        }
                      >
                        {t("AllContacts")}
                      </Button>
                    </Box>
                    <ContactCard
                      contactList={data?.["contacts"]}
                      isHomeScreen={true}
                      language={language}
                      t={t}
                      isMobile={isMobile}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box className="no-item-style-help">
            <Typography variant="body1">{t("MANDI_NO_MARKET_DATA")}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};
