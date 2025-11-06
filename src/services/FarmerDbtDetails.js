import { urls } from "../Utils/Urls";
import { ServiceRequest } from "./Request";

export const getFarmerData = (dbtId) => {
  const requestData = {
    RequestInfo: {
      apiId: "string",
      ver: "string",
      ts: 0,
      action: "string",
      did: "string",
      key: "string",
      msgId: "string",
      requesterId: "string",
      // authToken: "de9c031e-09f2-4410-9d35-e4e5e9eb639c"
    },
    Farmer: {
      dbtId: dbtId
    }
  };

  return ServiceRequest({
    serviceName: "getFarmerData",
    url: urls.FARMER_DBT_DATA,
    method: "POST",
    data: requestData
  });
};