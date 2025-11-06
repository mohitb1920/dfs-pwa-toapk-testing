import { urls } from "../Utils/Urls";
import { Request } from "./Request";

export const getFarmerprofile = async (auth_token, userUuid) => {
  try {
    const requestObject = {
      url: urls.farmer_profile,
      data: {
        RequestInfo: {
          authToken: auth_token || localStorage.getItem("DfsWeb.access-token"),
        },
        userUuid:
          userUuid ||
          (localStorage.getItem("DfsWeb.user-info") &&
            JSON.parse(localStorage.getItem("DfsWeb.user-info")).uuid),
      },
      params: {
        tenantId: "br",
      },
    };
    const response = await Request(requestObject);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getAppliedSchemes = async () => {
  try {
    const response = await Request({
      url: urls.farmer_applied_schemes,
      data: {
        RequestInfo: {
          authToken: localStorage.getItem("DfsWeb.access-token"),
        },
      },
      params: {
        farmerId: localStorage.getItem("DfsWeb.farmerId"),
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getApplicationStatus = async (applicationId) => {
  try {
    const response = await Request({
      url: urls.farmer_application_status,
      data: {
        RequestInfo: {
          authToken: localStorage.getItem("DfsWeb.access-token"),
        },
      },
      params: {
        dfsSchemeApplicationId: applicationId,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
