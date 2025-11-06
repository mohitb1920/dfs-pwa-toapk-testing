import { useQuery } from "react-query";
import { DashboardService } from "../services/DashboardService";

const getRequest = (type, code, requestDate, filters, moduleLevel = "") => {
  let newFilter = { ...{ ...filters } };
  let updatedFilter = Object.keys(newFilter)
    .filter((ele) => {
      const value = newFilter[ele];
      return typeof value === "boolean" ? true : value.length > 0;
    })
    .reduce((acc, curr) => {
      acc[curr] = newFilter[curr];
      return acc;
    }, {});
  return {
    aggregationRequestDto: {
      visualizationType: type.toUpperCase(),
      visualizationCode: code,
      queryType: "",
      filters: updatedFilter,
      moduleLevel: moduleLevel,
      aggregationFactors: null,
      requestDate,
    },
  };
};
const defaultSelect = (data) => {
  if (data?.responseData) {
    if (data?.responseData?.data) {
      data.responseData.data =
        data?.responseData?.data?.filter((col) => col) || [];
      data.responseData.data?.forEach((row) => {
        if (row?.plots) {
          row.plots = row?.plots.filter((col) => col) || [];
        }
      });
    }
  }
  return data;
};

const getChartData = async (args) => {
  const { key, type, tenantId, requestDate, filters } = args;
  const response = await DashboardService.getCharts({
    ...getRequest(type, key, requestDate, filters),
    headers: {
      tenantId,
    },
  });
  return response?.data ?? {};
};

const useGetChart = (args) => {
  return useQuery([args], () => getChartData(args), {
    select: defaultSelect,
  });
};

export default useGetChart;
