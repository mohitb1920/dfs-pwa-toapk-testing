import { urls } from "../Utils/Urls";
import { Request } from "./Request";

const getRequestBody = (
  tenantId,
  latitude,
  longitude,
  categoryId,
  searchText,
  limit,
  pageNo
) => ({
  requestBody: {
    Facility: {
      tenantId: tenantId,
      latitude: latitude,
      longitude: longitude,
      categoryId: categoryId,
      searchText: searchText,
    },
  },
  requestParams: {
    tenantId: tenantId,
    limit: limit,
    pageNo: pageNo,
  },
});

const getWeatherRequestBody = (
  tenantId,
  latitude,
  longitude,
  districtLg,
  blockLG,
  date
) => ({
  requestBody: {
    WeatherSearch: {
      latitude: latitude ?? 85.4099217,
      longitude: longitude ?? 25.06982,
      districtLg: districtLg,
      blockLG: blockLG,
      date: date,
    },
  },
  requestParams: {
    tenantId: tenantId,
    pageSize: 5,
    pageNo: 1,
  },
});
const getSearchLocationRequestBody = (tenantId, keyword, date) => ({
  RequestInfo: {
    userInfo: {
      id: 123,
      uuid: "some-uuid",
      roles: [
        {
          code: "CITIZEN",
          tenantId: tenantId,
        },
      ],
      type: "CITIZEN",
    },
  },
  tenantId: tenantId,
  keyword: keyword,
  date: date,
});
export const AssetsService = {
  makeAssetsCall: async (
    tenantId,
    latitude,
    longitude,
    categoryId,
    searchText,
    limit,
    pageNo
  ) => {
    return Request({
      url: urls.assetsData,
      data: getRequestBody(
        tenantId,
        latitude,
        longitude,
        categoryId,
        searchText,
        limit,
        pageNo
      ),
      useCache: true,
      params: { service: "facility" },
    });
  },
  makeWeatherCall: async (
    tenantId,
    latitude,
    longitude,
    districtLg,
    blockLG,
    date
  ) => {
    return Request({
      url: urls.assetsData,
      data: getWeatherRequestBody(
        tenantId,
        latitude,
        longitude,
        districtLg,
        blockLG,
        date
      ),
      useCache: true,
      params: { service: "weather" },
    });
  },
  makeSearchLocationCall: async (tenantId, searchQuery, date) => {
    return Request({
      url: urls.weatherSearch,
      data: getSearchLocationRequestBody(tenantId, searchQuery, date),
      useCache: true,
      params: {},
    });
  },
};
