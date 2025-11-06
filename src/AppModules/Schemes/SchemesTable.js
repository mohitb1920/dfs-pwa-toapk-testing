import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  Button,
  Box,
} from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CustomTablePaginationActions from "./CustomTablePaginationActions";
import { useTranslation } from "react-i18next";
import { getCurrentLanguage } from "../../components/Utils";

let languageDa;
function check(id, value, column) {
  if (column.id === "schemeName") {
    return (
      <Box
        sx={{
          display: "flex",
          columnGap: "10px",
          paddingRight: "10px",
          minWidth: "350px",
          maxWidth: "350px",
          minHeight: "80px",
        }}
      >
        <Box
          component="img"
          sx={{
            height: 52,
            width: 50,
            maxHeight: { xs: 42, md: 63 },
            maxWidth: { xs: 40, md: 65 },
            margin: "auto 0",
          }}
          alt="The house from the offer."
          src={`assets/SchemeLogos/${id}.svg`}
        />
        <Typography
          sx={{
            fontSize: "1rem",
            margin: "auto 0",
            fontWeight: 600,
            fontFamily: "LEXEND",
          }}
        >
          {value[`title-${languageDa}`]}
        </Typography>
      </Box>
    );
  }
  if (column.id === "redirect") {
    return (
      <Button
        variant="outlined"
        sx={{
          color: "#A5292B",
          padding: "5px 14px",
          fontWeight: "400",
          textTransform: "none",
          borderColor: "#A5292B",
          borderWidth: "1px",
          borderRadius: "1rem",
          "&:hover": {
            backgroundColor: "#A5292B",
            color: "#FFFFFF",
            fontWeight: 600,
            cursor: "default",
            borderColor: "#A5292B",
            borderWidth: "2px",
            cursor: "pointer",
          },
        }}
      >
        {value.redirect ? "Re-direct" : "Apply"}
      </Button>
    );
  } else if (column.id === "shortDescription") {
    return (
      <Box sx={{ display: "flex" }}>
        <Typography
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            textWrap: "wrap",
            display: "-webkit-box",
            WebkitLineClamp: "3",
            lineClamp: "3",
            WebkitBoxOrient: "vertical",
            fontSize: "0.8rem",
          }}
        >
          {value[`${languageDa}`]}
        </Typography>
        <Box
          sx={{
            color: "#A5292B",
            marginLeft: "auto",
            paddingLeft: "20px",
            minWidth: "100px",
          }}
        >
          view details
        </Box>
      </Box>
    );
  } else if (column.id === "isApplyEnabled") {
    if (value)
      return (
        <Typography sx={{ justifyContent: "space-between" }}>
          <FiberManualRecordIcon sx={{ fontSize: "small", color: "#006633" }} />
          &nbsp;&nbsp;Open
        </Typography>
      );
    return (
      <Typography
        sx={{
          color: "gray",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <FiberManualRecordIcon sx={{ fontSize: "small" }} />
        &nbsp;Closed
      </Typography>
    );
  } else if (column.format) {
    return <Typography>{column.format(value["title-en"])}</Typography>;
  } else {
    return <Typography sx={column.styles}>{value["title-en"]}</Typography>;
  }
}

function SchemesTable({ data, language }) {
  const languagef = getCurrentLanguage();
  languageDa = languagef === "hi_IN" ? "hi" : "en";
  const { t } = useTranslation();
  const [page, setPage] = useState(() => {
    const savedPage = localStorage.getItem("schemesTablePage");
    return savedPage !== null ? parseInt(savedPage, 10) : 0;
  });

  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const savedRowsPerPage = localStorage.getItem("schemesTableRowsPerPage");
    return savedRowsPerPage !== null ? parseInt(savedRowsPerPage, 10) : 5;
  });

  const previousDataLength = usePrevious(data.length);
  useEffect(() => {
    localStorage.setItem("schemesTablePage", page);
  }, [page]);

  useEffect(() => {
    if (
      previousDataLength !== undefined &&
      previousDataLength !== data.length
    ) {
      setPage(0);
    }
  }, [data.length, previousDataLength]);
  const navigate = useNavigate();
  const redirectingSchemeIds = [
    "SCHEME034",
    "SCHEME035",
    "SCHEME037",
    "SCHEME039",
    "SCHEME043",
    "SCHEME045",
    "SCHEME047",
  ];

  function handleRowClick(row) {
    const schemeId = row.id;
    // if (redirectingSchemeIds.includes(row.id)) {
    //   window.open(row.url, "_blank");
    //   return;
    // }
    localStorage.setItem("farmer." + schemeId + ".mainId", row.mainId);
    const active = row.isApplyEnabled;
    navigate("details", {
      state: { maindId:row.mainId,schemeId, active, url: row.url, redirect: row.redirect },
    });
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    localStorage.setItem("schemesTablePage", newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    localStorage.setItem("schemesTableRowsPerPage", newRowsPerPage);
    localStorage.setItem("schemesTablePage", 0);
  };
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "240px",
          backgroundColor: "#EEEEEE",
          padding: "10px",
          borderColor: "#B4B4B8",
          borderRadius: ".2rem",
          borderWidth: "3px",
        }}
      >
        No Schemes
      </Box>
    );
  }
  const columns = [
    {
      id: "schemeName",
      label: "Scheme",
      minWidth: 300,
      maxWidth: 300,
    },
    {
      id: "shortDescription",
      label: "Details",
      minWidth: 300,
    },
    {
      id: "isApplyEnabled",
      label: "Status",
      minWidth: 80,
      textAlign: "center",
    },
    {
      id: "redirect",
      label: "Action",
      minWidth: 170,
      textAlign: "center",
    },
  ];
  return (
    <Paper
      sx={{
        width: "100%",

        overflow: "hidden",
        borderRadius: "1rem",
      }}
    >
      <TableContainer sx={{ minHeight: 560, maxHeight: 580 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  paddingLeft: "10px",
                  backgroundColor: "#C2E8CE",
                },
              }}
            >
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                    textAlign: column.textAlign,
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                      onClick={() => handleRowClick(row)}
                      sx={{ columnGap: "70px" }}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            sx={{
                              color: "black",
                              padding: "10px",
                              minWidth: column.minWidth,
                              textAlign: column.textAlign,
                            }}
                          >
                            {check(row.id, value, column)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15, 20]}
        component="div"
        count={data?.length || 10}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={CustomTablePaginationActions}
        sx={{
          ".MuiTablePagination-toolbar": {
            backgroundColor: "#EEEDEB",
            color: "rgb(41, 39, 39)",
          },
        }}
        labelRowsPerPage={`Schemes on Page ${page + 1}`}
      />
    </Paper>
  );
}

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export default SchemesTable;
