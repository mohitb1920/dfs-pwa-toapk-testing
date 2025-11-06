import React from "react";
import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
} from "@mui/material";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { commonResolvedSubstring } from "../../components/Utils";
import { useTranslation } from "react-i18next";
import { pgrTableColumnHeaders } from "./PGRUtils";
import "../../styles/CustomTable.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#EAECF0",
    color: "#000",
    fontWeight: "600",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme, rowcolor = "#fff" }) => ({
  "&:hover": {
    backgroundColor: theme.palette.background.tertiaryGreen,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function ComplaintsTable(props) {
  const {
    section,
    complaints,
    isLoading,
    searchParams,
    resolved,
    isSaoUser,
    isSupportUser,
  } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleViewClick = (ticketId) => {
    if (isSupportUser) {
      navigate(
        `${window.contextPath}/technical-support/complaintdetails/${ticketId}`
      );
    } else {
      navigate(`${window.contextPath}/grm/complaintdetails/${ticketId}`);
    }
  };

  const getStatus = (applicationStatus) => {
    const pendingStatus = "PENDING";
    if (isSaoUser) {
      return `GRM_T_${applicationStatus}`;
    }
    if (searchParams.applicationStatus.includes(pendingStatus))
      return "GRM_ASSIGNED";
    if (applicationStatus.includes("PENDINGATSAO")) return "GRM_RESOLVED";
    if (applicationStatus.includes(pendingStatus)) return "GRM_REOPENED";
    if (applicationStatus.includes(commonResolvedSubstring))
      return "GRM_RESOLVED";
    if (applicationStatus.includes("REOPENED")) return "GRM_REOPENING";

    return t(applicationStatus);
  };

  const getSla = (sla) => {
    if (sla < 0) {
      return `${t("GRM_DELAYED_BY")} ${Math.abs(sla)} ${t(
        "GRM_DELAYED_BY_SUFFIX"
      )}${Math.abs(sla) === 1 ? "" : t("S")}`;
    }
    return sla;
  };

  if (isLoading) {
    return (
      <Box className="mt-1 mb-40">
        <LinearProgress color="success" />
      </Box>
    );
  } else if (complaints && complaints?.complaints.length === 0) {
    return (
      <Box className="flex items-center justify-center my-20">
        <Typography>{t("GRM_NO_COMPLAINTS")}</Typography>
      </Box>
    );
  } else if (complaints && complaints?.complaints.length > 0) {
    const match = searchParams.applicationStatus.match(/^(PENDING|RESOLVED)/);
    return (
      <TableContainer
        component={Paper}
        sx={{ marginTop: "0.5rem", minHeight: 400 }}
      >
        <Table sx={{ minWidth: 700 }} aria-label="complaints table">
          <TableHead>
            <TableRow>
              {pgrTableColumnHeaders(
                match?.[0] || searchParams.applicationStatus
              )
                .filter(
                  (column) =>
                    column.condition === undefined ||
                    column.condition === section ||
                    (!isSaoUser &&
                      column.condition === "sla" &&
                      !resolved &&
                      section !== "showcause")
                )
                .map((header) => {
                  return (
                    <TableCell
                      key={header.name}
                      align={header.align}
                      style={header?.width ? { minWidth: header.width } : {}}
                      className={`mandi-table-header-cell ${
                        header?.noBorder ? "" : "table-header-separator"
                      }`}
                    >
                      {t(header.name)}
                    </TableCell>
                  );
                })}
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints?.complaints.map((row, index) => (
              <StyledTableRow key={index} rowcolor={"#fff"}>
                <StyledTableCell align="center">
                  {row.serviceRequestId}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {row.complaintSubType}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.createdDate}
                </StyledTableCell>
                {!resolved && !isSaoUser && (
                  <StyledTableCell align="center">
                    {getSla(row.sla)}
                  </StyledTableCell>
                )}
                {/* <StyledTableCell align="center">
                  {row.resolvedOn || "-"}
                </StyledTableCell> */}
                <StyledTableCell align="center">
                  {t(getStatus(row.status))}
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  sx={{ paddingTop: "2px", paddingBottom: "2px" }}
                >
                  {section === "showcause" ? (
                    <Button
                      variant="outlined"
                      className="view-details-button"
                      onClick={() => handleViewClick(row.serviceRequestId)}
                      sx={{ marginRight: "2px" }}
                    >
                      {t("GRM_SHOW_CAUSE")}
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      className="view-details-button"
                      onClick={() => handleViewClick(row.serviceRequestId)}
                    >
                      {t("GRM_VIEW_DETAILS")}
                    </Button>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  } else {
    return (
      <Box className="flex items-center justify-center my-20">
        <Typography>{t("GRM_ERROR_LOADING_COMPLAINTS")}</Typography>
      </Box>
    );
  }
}

ComplaintsTable.propTypes = {
  section: PropTypes.string,
  complaints: PropTypes.object,
  isLoading: PropTypes.bool,
  isSaoUser: PropTypes.bool,
  resolved: PropTypes.bool,
  searchParams: PropTypes.object,
};

export default ComplaintsTable;
