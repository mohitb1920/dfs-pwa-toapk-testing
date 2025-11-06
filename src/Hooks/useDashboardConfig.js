import { useQuery } from "react-query";
import { DashboardService } from "../services/DashboardService";

const useDashoardConfig = (moduleCode) => {
  const getDashboardConfig = async () => {
    const response = await DashboardService.getDashboardConfig(moduleCode);
    return response?.data ?? {};
  };
  return useQuery(`DSS_DASHBOARD_CONFIG_${moduleCode}`, getDashboardConfig);
};

export default useDashoardConfig;
