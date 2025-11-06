import { urls } from "../Utils/Urls";
import { Request } from "./Request";

export const DashboardService = {
  getDashboardConfig: (moduleCode) =>
    Request({
      url: urls.dss.dashboardConfig + `/${moduleCode}`,
      userService: false,
      method: "GET",
      authHeader: true,
    }),
  getCharts: (data) =>
    Request({
      url: urls.dss.getCharts,
      userService: false,
      method: "POST",
      data,
    }),
  getExportData: ({ data, schemesRequest }) =>
    Request({
      serviceName: "dashboard-reports",
      url:
        urls.dss.dashboardReport +
        `/${schemesRequest ? "scheme-registration" : "farmer"}`,
      userService: false,
      method: "POST",
      data,
    }),
};
