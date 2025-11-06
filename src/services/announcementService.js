import { Request } from "./Request";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getAnnouncements = async (data) => {
  try {
    const response = await Request({
      method: "POST",
      url: "announcement/v1/_search",
      data,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const createAnnouncement = async (data) => {
  try {
    const response = await Request({
      method: "POST",
      url: "announcement/v1/_create",
      data,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const updateAnnouncement = async (data) => { 
  try {
    const response = await Request({
      method: "POST",
      url: "announcement/v1/_update",
      data,
    });
    return response;
  } catch (error) {
    return error;
  }
};
