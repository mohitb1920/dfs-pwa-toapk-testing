import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
  IconButton,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useState } from "react";
import AtmaServiceProviderSectionTable from "./AtmaServiceProviderSectionTable";
const filters = [
  {
    id: "districtAscending",
    value: "districtAscending",
    label: "District(A-->Z)",
  },
  {
    id: "districtDescending",
    value: "districtDescending",
    label: "District(Z-->A)",
  },
  {
    id: "commodityAscending",
    value: "commodityAscending",
    label: "Commodity(A-->Z)",
  },
  {
    id: "commodityDescending",
    value: "commodityDescending",
    label: "Commodity(Z-->A)",
  },
  { id: "marketAscending", value: "marketAscending", label: "Market(A-->Z)" },
  { id: "marketDescending", value: "marketDescending", label: "Market(Z-->A)" },
];

const label = "DFS_WEB_ATMA_SERVICE_PROVIDER_CENTER";

function AtmaServiceProviderSection({ data, columns }) {
  const [sort, setSort] = useState("");
  const handleSort = (event) => {
    setSort(event.target.value);
  };
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",

          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
          borderWidth: "1px",
          borderColor: "#DFDFDE",
          borderRadius: "1rem",
          margin: "20px 0px 0px 2%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            width: "100%",
            padding: "20px",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            variant="h6"
          >
            {label}
          </Typography>
          <FormControl
            sx={{
              width: "150px",
              legend: { fontSize: "1.7rem" },
            }}
          >
            <InputLabel
              id="demo-simple-select-sort-label"
              sx={{
                fontSize: "1.5rem",
                color: "black",
              }}
            >
              <Typography
                sx={{ fontSize: "1.5rem", svg: { fontSize: "2rem" } }}
              >
                <FilterAltOutlinedIcon color="success" /> Filter
              </Typography>
            </InputLabel>
            <Select
              labelId="demo-simple-select-sort-label"
              id="demo-simple-sort"
              IconComponent={""}
              value={sort}
              label="Filter &nbsp;"
              onChange={handleSort}
              sx={{
                borderRadius: "18px",
                width: "150px",
                padding: "6px",
                zIndex: "1",

                color: "white",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "#DFDFDE",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#DFDFDE",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#DFDFDE",
                },
              }}
            >
              {filters.map((filter) => {
                return (
                  <MenuItem id={filter.id} value={filter.value}>
                    {filter.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>

        <AtmaServiceProviderSectionTable columns={columns} rows={data} />
      </Box>
    </Box>
  );
}

export default AtmaServiceProviderSection;
