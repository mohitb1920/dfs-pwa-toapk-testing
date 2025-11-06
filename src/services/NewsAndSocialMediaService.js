import { urls } from "../Utils/Urls";
import { Request } from "./Request";

const getRequestBody = () => ({
  requestBody: {},
  requestParams: { page: 1, pageSize: 5, tenantId: "br" },
});
const getAnnouncementRequestBody = ({ tenantId, state }) => ({
  requestBody: {
    AnnouncementSearch: {
      tenantId: tenantId,
      state: state,
    },
  },
  requestParams: {},
});
export const NewsAndSocialMediaService = {
  makeTwitterCall: async () => {
    return Request({
      url: urls.assetsData,
      data: getRequestBody(),
      useCache: true,
      params: { service: "twitter" },
    });
  },
  makeAnnouncementCall: async ({ tenantId }) => {
    return Request({
      url: urls.assetsData,
      data: getAnnouncementRequestBody({ tenantId: tenantId, state: "ACTIVE" }),
      useCache: true,
      params: { service: "announcement" },
    });
  },
};
