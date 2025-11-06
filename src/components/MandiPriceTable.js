import { Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ReactComponent as MinPriceIcon } from "../assets/MinPriceIcon.svg";
import { ReactComponent as MaxPriceIcon } from "../assets/MaxPriceIcon.svg";
import { useNavigate } from "react-router-dom";
import { capitalize, ConvertTimestampToDate } from "./Utils";
import CustomTable from "./CustomTable";

function check({ value, column, t }) {
  if (column.id === "action") {
    return (
      <Typography sx={{ cursor: "pointer" }}>
        <ArrowForwardIosIcon fontSize="10px" />{" "}
      </Typography>
    );
  } else if (column.id === "district") {
    return (
      <Typography sx={column.styles}>
        {capitalize(value?.district ?? " - ")}
      </Typography>
    );
  } else if (["minPrice", "maxPrice", "modalPrice"].includes(column.id)) {
    return (
      <Typography
        sx={{
          display: "flex",
          gap: "5px",
          alignItems: "center",
          justifyContent: "right",
        }}
      >
        {value?.toFixed(2)}/{t("PRICE_QUINTOL")}
        {column.id === "maxPrice" && <MaxPriceIcon />}
        {column.id === "minPrice" && <MinPriceIcon />}
      </Typography>
    );
  } else if (column.id === "arrivalDate") {
    return <Typography>{ConvertTimestampToDate(value)}</Typography>;
  } else if (column.id === "marketCenter") {
    return <Typography sx={column.styles}>{capitalize(value)}</Typography>;
  } else {
    return <Typography sx={column.styles}>{value}</Typography>;
  }
}

function MandiPriceTable({
  columns,
  marketPriceData,
  page,
  setPage,
  pageSize,
  setPageSize,
  order,
  setOrder,
  orderBy,
  setOrderBy,
}) {
  const navigate = useNavigate();

  function handleRowClick(row) {
    navigate("price-details", { state: { data: row } });
  }

  return (
    <div>
      <CustomTable
        tableData={marketPriceData}
        columns={columns}
        valueRenderer={check}
        handleRowClick={handleRowClick}
        order={order}
        setOrder={setOrder}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </div>
  );
}

export default MandiPriceTable;
