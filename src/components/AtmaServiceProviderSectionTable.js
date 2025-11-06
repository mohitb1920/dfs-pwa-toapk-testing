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
} from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function check(value, column) {
  if (column.id === "action") {
    return (
      <Button
        variant="outlined"
        sx={{
          color: "black",
          padding: "5px 14px",
          fontWeight: "400",
          textTransform: "none",
          svg: { color: "red" },
          borderColor: "black",
          borderWidth: "1px",
          borderRadius: "1rem",
        }}
      >
        <PlaceOutlinedIcon sx={{ marginRight: "5px" }} />
        Direction
      </Button>
    );
  } else if (column.format) {
    return <Typography>{column.format(value)}</Typography>;
  } else {
    return <Typography sx={column.styles}>{value}</Typography>;
  }
}
function AtmaServiceProviderSectionTable({ columns, rows }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const navigate = useNavigate();

  function handleRowClick(row) {
    console.log("clicked");
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "0" }}>
      <TableContainer sx={{ minHeight: 1040, maxHeight: 1040 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  backgroundColor: "#C2E8CE",
                },
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.code}
                    onClick={() => handleRowClick(row)}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          sx={{ color: "gray", ...column.styles }}
                        >
                          {check(value, column)}
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
        rowsPerPageOptions={[15, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default AtmaServiceProviderSectionTable;
