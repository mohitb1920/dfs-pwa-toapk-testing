import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import screenReaderData from "./screenReaderData.json";
import React, { useEffect, useState } from "react";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import { useTranslation } from "react-i18next";
import "./styles/ScreenReader.css";
import UrlDialog from "../../components/dialog/UrlDialog";
import useUrlDialog from "../../Hooks/useUrlDialog";

function ScreenReaderPage({ isMobile }) {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(
    i18n.language == "en_IN" ? "en" : "hi"
  );
  useEffect(() => {
    setLanguage(i18n.language == "en_IN" ? "en" : "hi");
  }, [i18n.language]);
  const { open, externalUrl, handleLinkClick, handleClose } = useUrlDialog();
  const handleMenuClick = (link) => (e) => {
    handleLinkClick(link, e);
  };
  const theme = useTheme();
  return (
    <Container variant="primary">
      <Box className="assets-page">
        <Box className=" !pb-10">
          <Box className="breadcrumbs-container" sx={{ pb: 1.5 }}>
            <BasicBreadcrumbs />
          </Box>
          <Box className="header-screen-reader">
            <Typography
              className="scheme-header-name"
              variant={isMobile ? "h5" : "h1"}
            >
              {t("Screenreaderaccess")}
            </Typography>
          </Box>
          <Box className="text-box-screen-reader flex flex-col">
            <Typography variant={isMobile ? "h7" : "body1"}>
              {screenReaderData["screen-reader-data"].DataText[language]}
            </Typography>
            <br />
            <Typography variant={isMobile ? "h7" : "body1"}>
              {screenReaderData["screen-reader-data"].p2[language]}
            </Typography>
          </Box>
          <Box className="overflow-scroll">
            <Table
              className="rounded-lg"
              sx={{ border: "1px solid #D7DEDA", borderCollapse: "collapse" }}
            >
              <TableHead
                sx={{
                  backgroundColor: theme.palette.background.primaryGreen,
                  color: theme.palette.text.white,
                }}
              >
                <TableRow>
                  <TableCell
                    className="w-[30%] !font-semibold border-r "
                    sx={{
                      color: theme.palette.text.white,
                    }}
                  >
                    {t("ScreenReader")}
                  </TableCell>
                  <TableCell
                    className="w-[40%] !font-semibold border-r"
                    sx={{
                      color: theme.palette.text.white,
                    }}
                  >
                    {t("Website")}
                  </TableCell>
                  <TableCell
                    className="w-[30%] !font-semibold border-r"
                    sx={{
                      color: theme.palette.text.white,
                    }}
                  >
                    {t("FreeCommercial")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {screenReaderData["screen-reader-data"].WebsiteData.map(
                  (data, index) => (
                    <TableRow key={index}>
                      <TableCell>{data.name[language]}</TableCell>
                      <TableCell>
                        <a
                          onClick={(e) => handleLinkClick(data.url, e)}
                          rel={data.url}
                          className="cursor-pointer underline"
                        >
                          {data.url}
                        </a>
                      </TableCell>
                      <TableCell align="left" sx={{ paddingBottom: "20px" }}>
                        {data.type[language]}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Box>
        </Box>
        <UrlDialog
          open={open}
          externalUrl={externalUrl}
          handleClose={handleClose}
          t={t}
        />
      </Box>
    </Container>
  );
}

export default ScreenReaderPage;
