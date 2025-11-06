import { PersistantStorage } from "../Utils/LocalStorage";
import { urls } from "../Utils/Urls";
import { Request } from "./Request";

export const FarmerService = {
  call: async (farmerUuid) => {
    const response = await Request({
      url: urls.farmer_search,
      farmerService: true,
      data: {userUuid: farmerUuid},
      method: "POST",
      auth: true,
    });
    
    const returnData = response?.data || {};
    return returnData;
  },

  login: async (farmerUuid,farmerLogin) => {
    const response = await Request({
      url: urls.farmer_search,
      farmerLogin:true,
      data: {userUuid: farmerUuid},
      method: "POST",
      auth: true,
    });

    const returnData = response?.data || {};
    return returnData;
  },

  getFarmerDataByUuid: async (uuid) => {
    const key = `farmer.${uuid}`;
    const inStoreValue = PersistantStorage.get(key);
    if (inStoreValue) {
      return inStoreValue;
    }
    const { Individual } = await FarmerService.call(uuid);
    PersistantStorage.set(key, Individual, 86400);
    return Individual;
  },

  search: (uuid) => {
    return FarmerService.getFarmerDataByUuid(uuid);
  },

  getHistorydata: async (data, params) => {
    try {
      const response = await Request({
        url: urls.agent_history_search,
        data,
        params,
      });
      return response;
    } catch (e) {
      throw new Error(e.response?.data?.message || 'Error fetching agent history');
    }
  },
};
