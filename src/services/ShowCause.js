import { urls } from "../Utils/Urls";
import { Request } from "./Request";

export const ShowCauseService = {
  search: async (tenantId, filters = {}, serviceRequestIds = "") => {
    const response = await Request({
      url: urls.showcause_search,
      useCache: false,
      method: "POST",
      auth: true,
      params: {
        tenantId: tenantId,
        ...filters,
      },
    });

    const returnData = response?.data || {};
    return returnData;
  },
  update: async (details) => {
    try {
      const response = await Request({
        url: urls.showcause_update,
        data: details,
        useCache: true,
        auth: true,
        method: "POST",
        params: {},
      });
      return response;
    } catch (error) {
      return error.response;
    }
  },
  count: (tenantId, params) =>
    Request({
      url: urls.showcause_count,
      useCache: true,
      auth: true,
      method: "POST",
      params: { tenantId, ...params },
    }),
};
