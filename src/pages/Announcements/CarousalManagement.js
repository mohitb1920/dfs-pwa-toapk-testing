import React, { useEffect, useMemo, useState } from "react";
import "../../styles/CarousalManagement.css";
import {
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import * as locales from "@mui/material/locale";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CustomModal from "../../components/CustomModal";
import AnnouncementConfigurator from "./AnnouncementConfigurator";
import {
  ColorButton,
  ConvertTimestampToDate,
  TENANT_ID,
  TransformArrayToObj,
  getCurrentLanguage,
} from "../../components/Utils";
import {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from "../../services/announcementService";
import { useDispatch } from "react-redux";
import { LogoUrls, SOMETHING_WENT_WRONG } from "../../constants";
import { getLocalizationMessages } from "../../services/AnnouncementsLocalizationService";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { useLocalizationStore } from "../../Hooks/Store";

const colorPill = (status) => {
  return (
    <Box
      sx={status === "ACTIVE" ? { color: "#fff", background: "#669933" } : {}}
      className="status-pill"
    >
      {status}
    </Box>
  );
};

function CarousalManagement() {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [mode, setMode] = useState("create");
  const [selectedRow, setSelectedRow] = useState({});
  const [fetchDataTrigger, setFetchDataTrigger] = useState(0);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState({
    title: { en: "", hi: "" },
    announcement: { en: "", hi: "" },
    contact: "",
    url: "",
    status: false,
    type: "INFORMATION",
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const stateCode = TENANT_ID;
  const moduleCode = "ANC";
  const language = getCurrentLanguage();
  const { isLoading, data } = useLocalizationStore({
    stateCode,
    moduleCode,
    language,
  });

  const theme = useTheme();
  const themeWithLocale = useMemo(
    () => createTheme(theme, locales[language === "hi_IN" ? "hiIN" : language]),
    [language, theme]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const dispatchNotification = (type, message) => {
    dispatch({
      type: "SHOW_NOTIFICATION",
      data: {
        open: true,
        type,
        message,
      },
    });
  };

  const handleModalClose = () => {
    setSelectedAnnouncement({
      title: { en: "", hi: "" },
      announcement: { en: "", hi: "" },
      contact: "",
      url: "",
      status: false,
      type: "INFORMATION",
    });
    setModalOpen(false);
  };

  const createNewAnnouncement = async (payload) => {
    const response = await createAnnouncement(payload);
    if (response.status === 201 || response.status === 200) {
      setFetchDataTrigger((prevCounter) => prevCounter + 1);
      handleModalClose();
      dispatchNotification("success", ["ANC_ANC_ADDED_SUCCESSFULLY"]);
    } else {
      dispatchNotification("error", [SOMETHING_WENT_WRONG]);
    }
  };

  const updateAnnouncementData = async (updatedData) => {
    const payload = {
      Announcement: {
        ...selectedRow,
        ...updatedData,
      },
    };
    const response = await updateAnnouncement(payload);
    if (response.status === 201 || response.status === 200) {
      setFetchDataTrigger((prevCounter) => prevCounter + 1);
      handleModalClose();
      dispatchNotification("success", ["ANC_ANC_UPDATE_SUCCESSFUL"]);
    } else {
      dispatchNotification("error", [SOMETHING_WENT_WRONG]);
    }
  };

  const onSaveClick = (newAnnouncement, action) => {
    const { type, contact, status, url, title, announcement } = newAnnouncement;
    const announcementTexts = Object.keys(title).map((locale) => ({
      title: title[locale],
      announcement: announcement[locale],
      locale: `${locale}_IN`,
    }));
    const payload = {
      Announcement: {
        localeModule: "dfs-announcements",
        tenantId: "br",
        category: type,
        contactNo: contact,
        state: status ? "ACTIVE" : "INACTIVE",
        url: url,
        templateUrl: LogoUrls[`${type}_Logo_Url`],
        announcementTexts,
      },
    };
    if (action === "create") {
      createNewAnnouncement(payload);
    } else if (action === "edit") {
      updateAnnouncementData(payload.Announcement);
    }
  };

  const handleViewEditClick = (row, type) => {
    setSelectedRow(row);
    setSelectedAnnouncement({
      title: {
        en: t(row.titleCode, { lng: "en_IN" }),
        hi: t(row.titleCode, { lng: "hi_IN" }),
      },
      announcement: {
        en: t(row.announcementCode, { lng: "en_IN" }),
        hi: t(row.announcementCode, { lng: "hi_IN" }),
      },
      contact: row.contactNo,
      url: row.url,
      status: row.state === "ACTIVE",
      type: row.category,
    });
    setMode(type);
    setModalOpen(true);
  };

  const getAnnouncementsList = async () => {
    setLoading(true);
    const payload = {
      AnnouncementSearch: {
        tenantId: "br",
        categories: ["NEW_LAUNCHED", "ANNOUNCEMENT", "INFORMATION"],
        isUserNameRequired: true,
      },
    };
    const response = await getAnnouncements(payload);
    if (response?.status === 200) {
      setAnnouncements(response?.data?.Announcements);
    } else {
      dispatchNotification("error", [SOMETHING_WENT_WRONG]);
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const updateResources = (locale, data) => {
    let locales = TransformArrayToObj(data?.messages);
    i18next.addResources(locale, "translation", locales);
  };

  const getLocalizationData = async () => {
    const en_payload = {
      locale: "en_IN",
      module: "dfs-announcements",
      tenantId: "br",
    };
    const hi_payload = {
      locale: "hi_IN",
      module: "dfs-announcements",
      tenantId: "br",
    };
    const [en_response, hi_response] = await Promise.all([
      getLocalizationMessages(en_payload),
      getLocalizationMessages(hi_payload),
    ]);
    if (en_response?.status === 200) {
      updateResources("en_IN", en_response?.data);
    }
    if (hi_response?.status === 200) {
      updateResources("hi_IN", hi_response?.data);
    }
  };

  useEffect(() => {
    getLocalizationData();
    getAnnouncementsList();
  }, [fetchDataTrigger]);

  const renderAnnouncement = () => {
    return announcements.length === 0 ? (
      <Box className="no-data-container">{t("ANC_NO_ANNOUNCEMENTS")}</Box>
    ) : (
      <>
        <TableHead>
          <TableRow>
            <TableCell size="small" className="anc-table-cell">
              {t("ANC_SL_NO")}
            </TableCell>
            <TableCell className="anc-table-cell">{t("ANC_TITLE")}</TableCell>
            <TableCell className="anc-table-cell">
              {t("ANC_PUBLISHED_BY")}
            </TableCell>
            <TableCell className="anc-table-cell">
              {t("ANC_PUBLISHED_ON")}
            </TableCell>
            <TableCell align="center" className="anc-table-cell">
              {t("ANC_STATUS")}
            </TableCell>
            <TableCell align="center" className="anc-table-cell">
              {t("ANC_ACTIONS")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {announcements
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (
              <TableRow
                key={row.name}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell size="small">{index + 1}</TableCell>
                <TableCell>
                  {
                    row.announcementTexts.find(
                      (item) => item.locale === language
                    ).title
                  }
                </TableCell>
                <TableCell>{row.createdByUser}</TableCell>
                <TableCell>
                  {ConvertTimestampToDate(row?.auditDetails?.createdTime)}
                </TableCell>
                <TableCell>{colorPill(row.state)}</TableCell>
                <TableCell align="center">
                  <IconButton
                    sx={{ mr: "10px" }}
                    size="small"
                    color="success"
                    aria-label="View"
                    onClick={() => handleViewEditClick(row, "view")}
                  >
                    <VisibilityOutlinedIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    aria-label="Edit"
                    onClick={() => handleViewEditClick(row, "edit")}
                  >
                    <EditOutlinedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </>
    );
  };

  return (
    <Box>
      <Box className="carousal-page-header">
        {t("ANC_LST_OF_ANNOUNCEMENTS")}
      </Box>
      <Box className="carousal-page-content">
        <Box className="pagination-container">
          <ThemeProvider theme={themeWithLocale}>
            <TablePagination
              component="div"
              count={announcements?.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 20, 50]}
            />
          </ThemeProvider>
        </Box>
        <Box sx={{ minHeight: "35vh" }}>
          <TableContainer component={Paper} sx={{ maxHeight: "50vh" }}>
            <Table
              sx={{ minWidth: 650, background: "#F5F7FA" }}
              aria-label="simple table"
              size="small"
            >
              {loading ? (
                <LinearProgress color="success" />
              ) : (
                renderAnnouncement()
              )}
            </Table>
          </TableContainer>
        </Box>
        <Box className="instruction-text">**{t("ANC_DESCLAIMER")}</Box>
        <Box className="anc-footer-container">
          <ColorButton
            variant="contained"
            bgcolor="#A5292B"
            hoverbgColor="#7a1f20"
            onClick={() => {
              setModalOpen(true);
              setMode("create");
            }}
          >
            {t("ANC_ADD_ANNOUNCEMENT")}
          </ColorButton>
        </Box>
      </Box>
      <CustomModal
        handleModalClose={handleModalClose}
        open={modalOpen}
        dialogHeader={t('ANC_ANC_HEADER')}
        maxWidth="lg"
      >
        <AnnouncementConfigurator
          onSaveClick={onSaveClick}
          mode={mode}
          selectedAnnouncement={selectedAnnouncement}
        />
      </CustomModal>
    </Box>
  );
}

export default CarousalManagement;
