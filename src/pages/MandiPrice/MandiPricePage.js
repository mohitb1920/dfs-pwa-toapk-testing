import {
  Box,
  Drawer,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import MandiPriceTable from "../../components/MandiPriceTable";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import { useTranslation } from "react-i18next";
import useMandiPriceInboxData from "../../Hooks/useMandiPriceTableData";
import MandiFiltersRenderer from "./MandiFiltersRenderer";

const columns = [
  {
    id: "district",
    label: "COMMON_DISTRICT",
    align: "left",
    sort: true,
  },
  {
    id: "marketCenter",
    label: "MANDI_MARKET",
    align: "left",
    sort: true,
  },
  {
    id: "arrivalDate",
    label: "COMMON_DATE",
    align: "left",
    width: "150px",
    sort: true,
  },
  {
    id: "commodity",
    label: "MANDI_COMMODITY",
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
    sort: true,
  },
  {
    id: "variety",
    label: "MANDI_VARIETY",
    align: "left",
    format: (value) => value.toLocaleString("en-US"),
    sort: true,
  },
  {
    id: "modalPrice",
    label: "MANDI_PRICE",
    align: "left",
    sort: true,
  },
  {
    id: "minPrice",
    label: "MANDI_MIN_PRICE",
    align: "left",
    sort: true,
  },
  {
    id: "maxPrice",
    label: "MANDI_MAX_PRICE",
    align: "left",
    sort: true,
  },
  {
    id: "action",
    label: "",
    align: "left",
    sort: false,
  },
];

function MandiPricePage({ isMobile }) {
  const [searchParams, setSearchParams] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("ASC");
  const [orderBy, setOrderBy] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const { t, i18n } = useTranslation();

  const { isLoading, data: marketPriceData } = useMandiPriceInboxData(
    {
      ...searchParams,
      locale: i18n.language,
      pageNo: page + 1,
      pageSize,
      ...(orderBy ? { sortBy: `${orderBy} ${order}` } : {}),
    },
    true
  );

  return (
    <Box className="mandi-price-container">
      <Box className="breadcrumbs-container">
        <BasicBreadcrumbs />
      </Box>
      <Box className="flex justify-between sm:block">
        <Typography
          variant={isMobile ? "h5" : "h2"}
          className="mandi-price-main-header"
        >
          {t("MANDI_PRICE_HEADER")}
        </Typography>
        {isMobile && (
          <img
            src={`${window.contextPath}/assets/filters-icon.svg`}
            alt="filters"
            className="ml-2 image-filter-invert"
            onClick={(event) => setAnchorEl(event.currentTarget)}
          />
        )}
      </Box>
      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          className="custom-mobile-drawer"
        >
          <Typography variant="h5" className="mobile-filters-header-text">
            {t("Filters")}
          </Typography>
          <MandiFiltersRenderer
            setSearchParams={setSearchParams}
            setOrder={setOrder}
            setOrderBy={setOrderBy}
            setAnchorEl={setAnchorEl}
          />
        </Drawer>
      ) : (
        <MandiFiltersRenderer
          setSearchParams={setSearchParams}
          setOrder={setOrder}
          setOrderBy={setOrderBy}
          setAnchorEl={setAnchorEl}
        />
      )}
      <Box className="mandi-price-content-box">
        {!isMobile && (
          <Typography variant="h4" className="mandi-price-table-header">
            {t("MANDI_MARKET_PRICE")}
          </Typography>
        )}
        {isLoading ? (
          <Box>
            <Skeleton variant="rectangular" animation="wave" height={408} />
          </Box>
        ) : (
          <MandiPriceTable
            columns={columns}
            marketPriceData={marketPriceData}
            setPage={setPage}
            setPageSize={setPageSize}
            pageSize={pageSize}
            page={page}
            order={order}
            setOrder={setOrder}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
          />
        )}
      </Box>
    </Box>
  );
}

export default MandiPricePage;
