import { urls } from "../Utils/Urls";
import axiosInstance from "./CreateAxios";
import { Request } from "./Request";
import { getUser } from "./loginService";

export const PGRService = {
  search: async (tenantId, filters = {}, serviceRequestIds = "") => {
    const response = await Request({
      url: urls.pgr_search,
      useCache: false,
      method: "POST",
      auth: true,
      params: {
        tenantId: tenantId,
        serviceRequestIds: serviceRequestIds,
        ...filters,
      },
    });

    const returnData = response?.data || {};
    return returnData;
  },
  supportSearch: async (tenantId, filters = {}, employee = true) => {
    try {
      const response = await Request({
        url: employee
          ? urls.tech_support_search_employee
          : urls.tech_support_search_citizen,
        useCache: false,
        method: "POST",
        auth: true,
        params: {
          tenantId: tenantId,
          ...filters,
          source: "web",
          history: true,
        },
      });
      return response;
    } catch (error) {
      return error.response;
    }
  },
  update: async (details, employee, isAgentUser) => {
    try {
      const response = await Request({
        url: isAgentUser
          ? urls.create_agent_farmer_grievance
          : employee
          ? urls.pgr_update
          : urls.tech_support_pgr_update,
        data: details,
        useCache: true,
        auth: true,
        method: "POST",
        params: { tenantId: "br" },
      });
      return response;
    } catch (error) {
      return error.response;
    }
  },
  downloadPdf: async (data, serviceRequestId) => {
    try {
      const access_token = localStorage.getItem("DfsWeb.access-token");
      const userInfo = getUser();
      data.RequestInfo = {
        msgId: "20170310130900|en_IN",
        userInfo,
        authToken: access_token,
      };
      const response = await axiosInstance.post(
        `${urls.complaint_pdf_download}`,
        data,
        {
          params: { serviceRequestId },
          responseType: "blob",
        }
      );
      return response;
    } catch (error) {
      return error.response;
    }
  },
  createSupportGrievance: async (data) => {
    try {
      const response = await axiosInstance.post(
        `${urls.create_support_grievance}`,
        data
      );
      return response;
    } catch (error) {
      return error.response;
    }
  },
  createAgentGrievance: async (data) => {
    try {
      const response = await Request({
        url: urls.create_agent_farmer_grievance,
        data,
      });
      return response;
    } catch (error) {
      return error.response;
    }
  },
};
