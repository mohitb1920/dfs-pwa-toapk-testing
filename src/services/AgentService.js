import { urls } from "../Utils/Urls";
import { Request } from "./Request";

export const validateFarmerOtp = async (details) => {
  try {
    const response = await Request({
      url: urls.Agent_Farmer_Search,
      data: { ...details },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const downloadFarmerPassbook = async (payload) => {
  try {
    const response = await Request({
      url: urls.Agent_Farmer_Search,
      data: { ...payload, RequestInfo: { msgId: "20170310130900|en_IN" } },
      responseType: "blob",
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const farmerPassbookSearch = async (details) => {
  try {
    const response = await Request({
      url: urls.Agent_Farmer_Search,
      data: { ...details },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
