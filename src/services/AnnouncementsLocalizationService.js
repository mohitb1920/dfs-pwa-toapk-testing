import { urls } from "../Utils/Urls";
import { Request } from "./Request";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const getLocalizationMessages = async (data) => {
  const queryParams = new URLSearchParams(data).toString();
  try {
    const response = await Request({
      method: "POST",
      url: `${urls.localization}?${queryParams}`,
      data,
    });
    return response;
  } catch (error) {
    return error;
  }
};
