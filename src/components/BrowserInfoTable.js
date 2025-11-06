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
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function check(value, column) {
 
  if (column.id === "Action") {
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
        }}
      >
        {value.action ? value.action : "Apply"}
      </Button>
    );
  } else if (column.id === "Details") {
    return (
      <Box sx={{ display: "flex" }}>
        <Typography
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            textWrap: "wrap",
            display: "-webkit-box",
            WebkitLineClamp: "4",
            lineClamp: "4",
            WebkitBoxOrient: "vertical",
          }}
        >
          {value}
        </Typography>
        <Box
          sx={{
            color: "#A5292B",
            marginLeft: "auto",
            paddingLeft: "10px",
            minWidth: "100px",
          }}
        >
          view details
        </Box>
      </Box>
    );
  } else if (column.format) {
    return <Typography>{column.format(value)}</Typography>;
  } else {
    return <Typography sx={column.styles}>{value}</Typography>;
  }
}
function BrowserInfoTable({ data }) {
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
  if (!data || data.length === 0) {
    return <div>Empty</div>; // Render an empty div if data is empty or null
  }
  const columns = Object.keys(data[0]).map((key) => ({
    id: key,
    label: key,
    minWidth: 170, // You can set a default minWidth here or customize it as needed
  }));
  return (
    <Paper
      sx={{
        width: "100%",

        overflow: "hidden",
        borderRadius: "1rem",
      }}
    >
      <TableContainer sx={{ minHeight: 1040, maxHeight: 1040 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  paddingLeft: "20px",
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
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.code}
                    onClick={() => handleRowClick(row)}
                    sx={{ columnGap: "70px" }}
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
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default BrowserInfoTable;
