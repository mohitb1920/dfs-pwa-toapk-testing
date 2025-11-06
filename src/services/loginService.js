import axios from "axios";
import axiosInstance from "./CreateAxios";
import { Request } from "./Request";
import { urls } from "../Utils/Urls";
import { TENANT_ID } from "../components/Utils";
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const sendOtp = async (details, isSupport = false) => {
  try {
    const response = await Request({
      url: isSupport ? urls.support_OTP_Send : urls.OTP_Send,
      params: { tenantId: TENANT_ID },
      data: details,
      userService: true,
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const validateDBTLinkStatus = async (details) => {
  const response = await Request({
    url: urls.farmer_dbt_link_validation,
    params: { tenantId: TENANT_ID },
    data: details,
    userService: true,
  });
  return response;
};

export const validateOtp = async (data) => {
  try {
    const response = await axiosInstance.post(`user/citizen/_create`, data);
    return response;
  } catch (error) {
    return error;
  }
};

export const authenticateUser = async (requestParams) => {
  const data = new URLSearchParams();
  Object.entries(requestParams).forEach(([key, value]) =>
    data.append(key, value)
  );
  data.append("scope", "read");
  data.append("grant_type", "password");
  const headers = {
    authorization: "Basic ZWdvdi11c2VyLWNsaWVudDo=",
    "Content-Type": "application/x-www-form-urlencoded",
  };
  try {
    const response = await axiosInstance.post(`user/oauth/token`, data, {
      headers,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const logoutUser = async (dispatch) => {
  const access_token = localStorage.getItem("DfsWeb.access-token");
  try {
    await Request({
      url: `/user/_logout`,
      params: {tenantId: 'br'},
      data: {access_token}
    });
  } catch (error) {
  } finally {
    sessionStorage.clear();
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("DfsWeb")) {
        localStorage.removeItem(key);
      }
    });
  }
  dispatch({type: "RESET_PROFILE"});
};

export const getUser = () => {
  const userInfoString = localStorage.getItem("DfsWeb.user-info");
  const userInfo = JSON.parse(userInfoString);
  return userInfo;
}

export const updateUser = async (details) => {
  try {
    const response = await Request({
      url: urls.UserProfileUpdate,
      params: {tenantId: 'br'},
      data: {user: details}
    });
    return response;
  } catch (error) {
    return error;
  }
};
export const changePassword = async (details, forgotPassword = false) => {
  try {
    const response = await Request({
      url: forgotPassword ? urls.resetPassword : urls.ChangePassword,
      params: {tenantId: 'br'},
      data: {...details}
    });
    return response;
  } catch (error) {
    return error.response;
  }
};
