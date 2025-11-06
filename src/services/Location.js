import { urls } from "../Utils/Urls";
import { ServiceRequest } from "./Request";

export const LocationService = {
  //   getCropMapping: (tenantId, mdmsId) => {
  //     return ServiceRequest({
  //       serviceName: "getCropMapping",
  //       url: urls.location.crops,
  //       params: { tenantId: tenantId, mdmsId: mdmsId },
  //       useCache: true,
  //       method: "POST",
  //     });
  //   },
  getDistricts: (tenantId) => {
    return ServiceRequest({
      serviceName: "getDistricts",
      url: urls.location.district,
      params: { tenantId: tenantId },
      useCache: true,
      method: "GET",
    });
  },
  getBlocks: (tenantId, distrcitLgCode) => {
    return ServiceRequest({
      serviceName: "getBlocks",
      url: urls.location.blocks,
      params: { tenantId, code: distrcitLgCode },
      useCache: true,
      method: "GET",
    });
  },
  getPanchayats: (tenantId, blockLgCode) => {
    return ServiceRequest({
      serviceName: "getPanchayats",
      url: urls.location.panchayats,
      params: { tenantId, code: blockLgCode },
      useCache: true,
      method: "GET",
    });
  },
  getVillages: (tenantId, panchayatLgCode) => {
    return ServiceRequest({
      serviceName: "getVillages",
      url: urls.location.villages,
      params: { tenantId, code: panchayatLgCode },
      useCache: true,
      method: "GET",
    });
  },
};
