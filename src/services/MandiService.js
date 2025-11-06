import { urls } from "../Utils/Urls";
import { Request } from "./Request";

export const MandiService = {
  search: async (payload) => {
    const response = await Request({
      url: urls.agent_mandi_search,
      useCache: false,
      method: "POST",
      auth: true,
      data: payload,
      params: {
        service: "agriMarket",
      },
    });

    const returnData = response?.data || {};
    return returnData;
  },
};
