import React, { useEffect, useState } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  Box,
  Button,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { seedSchemeData } from "../../../Modules/Actions/seedSchemeActions";
import { Request } from "../../../services/Request";
import { urls } from "../../../Utils/Urls";
import { dispatchNotification } from "../../../components/Utils";
import { useTranslation } from "react-i18next";
import { StyledDropdown } from "../../../components/Form/CustomWidgetDropDown";
import CustomTable from "../../../components/CustomTable";
import { SOMETHING_WENT_WRONG } from "../../../constants";

function SeedSubsidySeason({ selectedScheme, schemeId, handleSeed, methods }) {
  const dispatch = useDispatch();

  const [seedSchemes, setSeedSchemes] = useState([]);
  const [drop, setDrop] = useState("");

  useEffect(() => {
    const dbt = methods.getValues()?.personalInformation?.dBTRegistrationNumber;
    // console.debug(dbt);
    const fetchData = async () => {
      // console.debug(drop);
      if (!dbt || dbt.length < 13 || drop === "") return;
      try {
        const response = await call(urls.SchemeAgriInfo, {
          apiName: "farmerDetail",
          mdmsId: schemeId,
          seasonId: drop,
          regId: dbt,
        });
        if (response && response.data) {
          setSeedSchemes(response.data);
        } else {
          dispatchNotification(
            "error",
            [response?.response?.data?.error],
            dispatch
          );
        }
      } catch (error) {
        dispatchNotification("error", ["Service Error"], dispatch);
      }
    };

    fetchData();
  }, [dispatch, drop, methods, schemeId]);

  return (
    <Box>
      <CustomSelect drop={drop} handleDrop={setDrop} schemeId={schemeId} />
      {drop && drop > 0 && (
        <SchemesTable
          data={seedSchemes}
          selectedScheme={selectedScheme}
          handleSeed={handleSeed}
          methods={methods}
        />
      )}
    </Box>
  );
}

const call = async (url, params) => {
  const response = await Request({
    url: url,
    method: "POST",
    params: params,
  });
  return response;
};

const CustomSelect = (props) => {
  const { required = true, schemeId, disable, drop, handleDrop } = props;
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";
  const handleChange = (event) => {
    handleDrop(event.target.value);
  };

  const fetchData = async () => {
    const url = urls.SchemeAgriInfo;
    const response = await call(url, {
      apiName: "season",
      mdmsId: schemeId,
    });
    if (response && response.data && response.status === 200) {
      setData(response.data);
    } else {
      const error = response?.data?.Errors?.[0]?.code ?? SOMETHING_WENT_WRONG;
      dispatchNotification(
        "error",
        [error],
        dispatch
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, schemeId]);

  return (
    <FormControl
      variant="outlined"
      className="flex flex-col gap-2"
      fullWidth
      sx={{ margin: "20px 0px" }}
    >
      <Typography className={"input-label"} color={theme.palette.text.primary}>
        {t("schemes.selectSeasonSeed")}
        {required && <span className="required-field">&nbsp;*</span>}
      </Typography>
      <Select
        label={"Kharif"}
        input={<StyledDropdown disabled={disable} darkTheme={isDarkTheme} />}
        onChange={handleChange}
        value={drop}
        disabled={disable}
      >
        {data.map((season, index) => (
          <MenuItem key={season.Code} value={season.Code}>
            {season.Name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

function check({ value, column }) {
  if (column.id === "Apply") {
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
        {"Apply"}
      </Button>
    );
  } else if (column.format) {
    return <Typography>{column.format(value)}</Typography>;
  } else {
    return <Typography sx={column.styles}>{value}</Typography>;
  }
}

function SchemesTable({ data, selectedScheme, handleSeed, methods }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  function handleRowClick(row) {
    if (!row) return;
    methods.setValue("cropCode", row.Code);
    methods.setValue("schemeName", "Seed subsidy scheme");
    methods.setValue("schemeSubName", row.SubSchemeName);
    dispatch(
      seedSchemeData({
        rate: parseFloat(row.Rate),
        grantPercent: parseFloat(row.SubPercentage),
        limit: parseFloat(row.Limit),
        grantPerKg: parseFloat(row.SubKg),
      })
    );
    handleSeed(true);
  }

  if (!data || data.length === 0 || data[0]?.Code === null) {
    return <Box className="no-schemes">{t("schemes.alreadyAppliedSeed")}</Box>;
  }

  const tableData = {
    data: data.slice(page * rowsPerPage, (page + 1) * rowsPerPage),
    totalCount: data.length,
  };

  const columns = [
    {
      id: "Code",
      label: "Code",
      align: "left",
      width: 100,
    },
    {
      id: "SchemeName",
      label: "Scheme",
      align: "left",
      width: 170,
    },
    {
      id: "SubSchemeName",
      label: "SubScheme",
      align: "left",
      width: 200,
    },
    {
      id: "CropName",
      label: "Crop",
      align: "left",
      width: 100,
    },
    {
      id: "VarietyName",
      label: "Verity",
      align: "left",
      width: 100,
    },
    {
      id: "SeedType",
      label: "Seed type",
      align: "left",
      width: 100,
    },
    {
      id: "Rate",
      label: "Rate",
      align: "left",
      width: 80,
    },
    {
      id: "SubPercentage",
      label: "SubPercentage",
      align: "left",
      width: 80,
    },
    {
      id: "SubKg",
      label: "SubKg",
      align: "left",
      width: 100,
    },
    {
      id: "Limit",
      label: "Limit",
      align: "left",
      width: 100,
    },
    {
      id: "Apply",
      label: "Apply",
      align: "left",
      width: 100,
    },
  ];
  return (
    <CustomTable
      tableData={tableData}
      columns={columns}
      valueRenderer={check}
      handleRowClick={handleRowClick}
      page={page}
      setPage={setPage}
      pageSize={rowsPerPage}
      setPageSize={setRowsPerPage}
    />
  );
}
export default SeedSubsidySeason;
