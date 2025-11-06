import { Axios } from "axios";
import { urls } from "../Utils/Urls";
import axiosInstance from "./CreateAxios";
export const UploadServices = {
  Filestorage: async (module, filedata, tenantId, onProgress= () => {}) => {
    const formData = new FormData();
    const filesArray = Array.from(filedata);
    filesArray?.forEach((fileData, index) =>
      fileData ? formData.append("file", fileData, fileData.name) : null
    );
    formData.append("tenantId", tenantId);
    formData.append("module", module);
    const headers = {
      "auth-token": localStorage.getItem("DfsWeb.access-token"),
    };

    try {
      const response = await axiosInstance.post(urls.FileStore, formData, {
        params: { tenantId },
        headers,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            onProgress(progress);
          }
        },
      });
      return response;
    } catch (error) {
      onProgress(0)
      throw error;
    }
  },

  Filefetch: async (filesArray, tenantId) => {
    let tenantInfo = window?.globalConfigs?.getConfig("ENABLE_SINGLEINSTANCE")
      ? `?tenantId=${tenantId}`
      : "";
    const config = {
      method: "get",
      url: `${urls.FileFetch}${tenantInfo}`,
      params: {
        tenantId: tenantId,
        fileStoreIds: filesArray?.join(","),
      },
    };
    const res = await Axios(config);
    return res;
  },
};
