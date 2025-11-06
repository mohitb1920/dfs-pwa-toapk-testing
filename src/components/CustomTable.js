import {
  Box,
  Checkbox,
  Container,
  createTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  ThemeProvider,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useMemo } from "react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import * as locales from "@mui/material/locale";
import { useTranslation } from "react-i18next";
import "../styles/CustomTable.css";

const sortUpIcon = () => {
  return <ArrowDropUpIcon sx={{ marginLeft: "1px" }} />;
};

const sortDownIcon = () => {
  return <ArrowDropDownIcon sx={{ marginLeft: "1px" }} />;
};

function EnhancedTableHead(props) {
  const {
    headCells,
    order,
    orderBy,
    onRequestSort,
    t,
    numSelected,
    rowCount,
    onSelectAllClick,
    isSelectable,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const theme = useTheme();

  return (
    <TableHead>
      <TableRow>
        {isSelectable && (
          <TableCell padding="checkbox" className="mandi-table-header-cell">
            <Checkbox
              color="default"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all items",
              }}
              className="table-checkbox"
            />
          </TableCell>
        )}
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
            align={headCell.align}
            className={`mandi-table-header-cell ${
              index < headCells.length - 1 && headCell.id !== "maxPrice"
                ? "table-header-separator"
                : ""
            }`}
            sx={{
              minWidth: headCell?.width,
              ...(headCell?.maxWidth ? { maxWidth: headCell.maxWidth } : {}),
            }}
          >
            {headCell.sort ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "ASC"}
                onClick={createSortHandler(headCell.id)}
                IconComponent={
                  orderBy === headCell.id && order === "ASC"
                    ? sortUpIcon
                    : sortDownIcon
                }
                className={
                  orderBy === headCell.id ? "custom-active-header-label" : ""
                }
                sx={{
                  "&:focus": {
                    color:
                      theme.palette.mode === "light"
                        ? "rgba(247, 213, 8, 1)"
                        : "rgba(255, 255, 255, 1)",
                  },
                }} // changing color on focus for better visibility
              >
                {t(headCell.label)}
              </TableSortLabel>
            ) : (
              <>{t(headCell.label)}</>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function CustomTable(props) {
  const {
    tableData,
    columns,
    valueRenderer,
    handleRowClick,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    page,
    pageSize,
    setPage,
    setPageSize,
    groupColorMap = {},
    isSelectable = false,
    selected = [],
    setSelected,
  } = props;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const themeWithLocale = useMemo(
    () =>
      createTheme(
        theme,
        locales[i18n.language === "hi_IN" ? "hiIN" : i18n.language]
      ),
    [i18n.language, theme]
  );

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = tableData.data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleCheckboxClick = (event, row) => {
    event.stopPropagation();
    const { id } = row;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "ASC";
    setOrder(isAsc ? "DESC" : "ASC");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };
  const isClickable = typeof handleRowClick === "function";

  if (tableData && tableData?.data?.length === 0) {
    return (
      <Container variant="primary">
        <Box className="flex items-center justify-center py-20">
          <Typography variant="primary">{t("MANDI_NO_MARKET_DATA")}</Typography>
        </Box>
      </Container>
    );
  } else if (tableData && tableData?.data?.length > 0) {
    return (
      <Paper className="mandi-price-table-paper">
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              headCells={columns}
              t={t}
              onSelectAllClick={handleSelectAllClick}
              numSelected={selected.length}
              rowCount={tableData.data.length}
              isSelectable={isSelectable}
            />
            <TableBody>
              {tableData?.data?.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={isClickable ? 0 : -1} // Only set tabIndex if handleRowClick is provided
                    key={row.code}
                    {...(isClickable && {
                      onClick: () => handleRowClick(row),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") handleRowClick(row);
                      },
                    })}
                    sx={{
                      backgroundColor: groupColorMap?.[row.groupKey],
                      "&:hover": {
                        backgroundColor: groupColorMap[row.name], // Prevent hover color change
                      },
                      "&:focus-visible": {
                        // Highlight the row when focused
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255, 255, 255, 0.08)"
                            : "rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    {isSelectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="default"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                          onClick={(event) => handleCheckboxClick(event, row)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => {
                      const value = ["district", "cropName"].includes(column.id)
                        ? row["additionalFields"]
                        : row[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          className="mandi-table-body-cells"
                        >
                          {column.id === "slNumber"
                            ? page * pageSize + index + 1
                            : valueRenderer({ value, column, t, row })}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <ThemeProvider theme={themeWithLocale}>
          <TablePagination
            component="div"
            count={tableData?.totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </ThemeProvider>
      </Paper>
    );
  } else {
    return (
      <Box className="flex items-center justify-center my-20">
        <Typography>{t("MANDI_ERROR_LOADING_MARKET_DATA")}</Typography>
      </Box>
    );
  }
}

export default CustomTable;
