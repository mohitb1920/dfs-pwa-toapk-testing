import { TENANT_ID } from "../components/Utils";
import { urls } from "../Utils/Urls";
import { Request } from "./Request";

export const LocationsService = {
  blocks: async (schemeId,districtCode) => {
    const response = await Request({
      url: urls.locationDetail,
      useCache: false,
      method: "GET",
      auth: true,    
      userService:"true",
      params: {
        boundaryType: "Block",
        mdmsId: schemeId,
        code: districtCode,
        tenantId:TENANT_ID     
      },
    });

    const returnData = response?.data || {};
    return returnData;
  },
  panchayats: async (schemeId,blockCode) => {
    const response = await Request({
      url: urls.locationDetail,
      useCache: false,
      method: "GET",
      auth: true,    
      userService:"true",
      params: {
        boundaryType: "Panchayat",
        mdmsId: schemeId,
        code: blockCode,
        tenantId:TENANT_ID     
      },
    });

    const returnData = response?.data || {};
    return returnData;
  },

  villages: async (schemeId,panchayatCode) => {
    const response = await Request({
      url: urls.locationDetail,
      useCache: false,
      method: "GET",
      auth: true,    
      userService:"true",
      params: {
        boundaryType: "Village",
        mdmsId: schemeId,
        code: panchayatCode,
        tenantId:TENANT_ID     
      },
    });

    const returnData = response?.data || {};
    return returnData;
  },
};
