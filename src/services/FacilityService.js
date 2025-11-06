import { urls } from "../Utils/Urls";
import { Request } from "./Request";

export const Facility = {
  search: async (payload, params) => {
    const response = await Request({
      url: urls.facility_search,
      data: payload,
      params,
    });

    return response;
  },

  delete: async (payload) => {
    const response = await Request({
      url: urls.facility_delete,
      data: payload,
    });

    return response;
  },
};
