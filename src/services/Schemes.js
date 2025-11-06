//Scheme Servic file
import { urls } from "../Utils/Urls";
import { Request } from "./Request";

export const SchemeService = {
  crops: async (schemeId) => {
    const response = await Request({
      url: urls.SchemeAgriInfo,
      useCache: false,
      method: "POST",
      auth: true,
      params: {
        apiName: "crop",
        mdmsId: schemeId,
      },
    });

    const returnData = response?.data || {};
    return returnData;
  },
  seasons: async (schemeId) => {
    const response = await Request({
      url: urls.SchemeAgriInfo,
      useCache: false,
      method: "POST",
      auth: true,
      params: {
        apiName: "season",
        mdmsId: schemeId,
      },
    });

    const returnData = response?.data || {};
    return returnData;
  },

  farmerType: async (schemeId) => {
    const response = await Request({
      url: urls.SchemeAgriInfo,
      useCache: false,
      method: "POST",
      auth: true,
      params: {
        apiName: "farmerType",
        mdmsId: schemeId,
      },
    });

    const returnData = response?.data || {};
    return returnData;
  },

  irrigation: async (schemeId) => {
    const response = await Request({
      url: urls.SchemeAgriInfo,
      useCache: false,
      method: "POST",
      auth: true,
      params: {
        apiName: "irrigation",
        mdmsId: schemeId,
      },
    });

    const returnData = response?.data || {};
    return returnData;
  },

  landType: async (schemeId) => {
    const response = await Request({
      url: urls.SchemeAgriInfo,
      useCache: false,
      method: "POST",
      auth: true,
      params: {
        apiName: "landType",
        mdmsId: schemeId,
      },
    });

    const returnData = response?.data || {};
    return returnData;
  },

  effectedType: async (schemeId) => {
    const response = await Request({
      url: urls.SchemeAgriInfo,
      useCache: false,
      method: "POST",
      auth: true,
      params: {
        apiName: "effectedType",
        mdmsId: schemeId,
      },
    });

    const returnData = response?.data || {};
    return returnData;
  },

  aadharAuth: async (schemeId, name, aadharNo) => {
    const response = await Request({
      url: urls.SchemeAgriInfo,
      useCache: false,
      method: "POST",
      auth: true,
      params: {
        apiName: "aadhaarAuth",
        mdmsId: schemeId,
        aadharNo: aadharNo,
        name: name,
      },
    });

    const returnData = response?.data || {};
    return returnData;
  },

  aadharOTP: async (schemeId, aadharNo, otp) => {
    const response = await Request({
      url: urls.SchemeAgriInfo,
      useCache: false,
      method: "POST",
      auth: true,
      params: {
        apiName: "otp",
        mdmsId: schemeId,
        aadharNo: aadharNo,
        otp: otp,
      },
    });

    const returnData = response?.data || {};
    return returnData;
  },

  subsidyAmount: async (schemeId, irrLand, irrNumber) => {
    const response = await Request({
      url: urls.SchemeAgriInfo,
      useCache: false,
      method: "POST",
      auth: true,
      params: {
        apiName: "subsidy",
        mdmsId: schemeId,
        irrLand: parseFloat(irrLand).toFixed(2),
        noOfIrrigation: irrNumber,
      },
    });

    const returnData = response?.data || {};
    return returnData;
  },

  subsidySabji: async (schemeId, componentCode, subComponentCode) => {
    const response = await Request({
      url: urls.SchemeAgriInfo,
      useCache: false,
      method: "POST",
      auth: true,
      params: {
        apiName: "subsidy",
        mdmsId: schemeId,
        componentCode: componentCode,
        subComponentCode: subComponentCode,
      },
    });

    const returnData = response?.data || {};
    return returnData;
  },

  otpFarmerSchemeGet: async (data) => {
    const response = await Request({
      url: urls.Agent_OTP_Send,
      useCache: false,
      method: "POST",
      auth: true,
      data: data,
    });

    const returnData = response?.data || {};
    return returnData;
  },

  otpFarmerVerify: async (data) => {
    const response = await Request({
      url: urls.Agent_Farmer_Search,
      useCache: false,
      method: "POST",
      auth: true,
      data: data,
    });

    const returnData = response?.data || {};
    return returnData;
  },

  schemeSubmit: async (data) => {
    const response = await Request({
      url: urls.Agent_Farmer_Scheme_Submit,
      useCache: false,
      method: "POST",
      auth: true,
      data: data,
    });

    const returnData = response?.data || {};
    return returnData;
  },

  schemeReceipt: async (data, applicationId) => {
    const response = await Request({
      url: urls.Scheme_Recipt_Download,
      useCache: false,
      method: "POST",
      responseType: "blob",
      data: data,
      auth: true,
      params: {
        dfsSchemeApplicationId: applicationId,
      },
    });

    const returnData = response;
    return returnData;
  },

  company: async (schemeId, cropCode) => {
    const response = await Request({
      url: urls.SchemeAgriInfo,
      useCache: false,
      method: "POST",
      auth: true,
      params: {
        apiName: "company",
        mdmsId: schemeId,
        cropCode: cropCode,
      },
    });

    const returnData = response?.data || {};
    return returnData;
  },
};
