import axiosInstance from "./CreateAxios";

export const Request = async ({
  method = "POST",
  url,
  data = {},
  userService = false,
  params = {},
  farmerLogin = false,
  responseType = "json",
  authHeader = false,
  headers = {},
}) => {
  let access_token;
  if (!userService) {
    if (!farmerLogin) {
      access_token = localStorage.getItem("DfsWeb.access-token");
    } else {
      let tokenData;
      const storedData = localStorage.getItem("farmer.farmerInfo");
      if (storedData) {
        tokenData = JSON.parse(storedData);
      }
      access_token = tokenData.authToken;
    }

    data.RequestInfo = { ...(data.RequestInfo || {}), authToken: access_token };
  }
  if (authHeader) headers = { ...headers, "auth-token": access_token };

  let response;
  try {
    if (method === "POST") {
      response = await axiosInstance.post(url, data, { params, responseType });
    } else if (method === "GET") {
      response = await axiosInstance.get(url, {
        params,
        headers,
        responseType,
      });
    }
  } catch (error) {
    return error.response;
  }

  return response;
};

export const ServiceRequest = async ({
  serviceName,
  method = "POST",
  url,
  data = {},
  headers = {},
  useCache = false,
  params = {},
  auth,
  reqTimestamp,
  userService,
}) => {
  // const preHookName = `${serviceName}Pre`;
  // const postHookName = `${serviceName}Post`;

  let reqParams = params;
  let reqData = data;
  // if (window[preHookName] && typeof window[preHookName] === "function") {
  //   let preHookRes = await window[preHookName]({ params, data });
  //   reqParams = preHookRes.params;
  //   reqData = preHookRes.data;
  // }
  const resData = await Request({
    method,
    url,
    data: reqData,
    params: reqParams,
  });

  // if (window[postHookName] && typeof window[postHookName] === "function") {
  //   return await window[postHookName](resData);
  // }
  return resData;
};
