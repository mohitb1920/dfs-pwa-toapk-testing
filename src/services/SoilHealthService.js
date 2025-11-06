import { TENANT_ID } from "../components/Utils";
import { urls } from "../Utils/Urls";
import { Request } from "./Request";

const getFertilizerRequestBody = ({ fertilizer }) => ({
  fertilizer: fertilizer,
});

const getSoilHealthRequestBody = ({
  dbtId,
  categoryType,
  tenantId,
  tokenId,
  testGrid,
  DownloadCardCriteria,
}) => ({
  entitySearchRequest: {
    dbtId: dbtId,
    categoryType: categoryType,
    tenantId: tenantId,
    otp: "",
    tokenId: tokenId,
    payload: {
      ...(DownloadCardCriteria && {
        DownloadCardCriteria: DownloadCardCriteria,
      }),
      ...(!DownloadCardCriteria && {
        dbtId: dbtId,
      }),
      ...(!DownloadCardCriteria && {
        testGrid: testGrid,
      }),
    },
  },
});
const getYieldListRequestBody = ({
  dbtId,
  categoryType,
  tokenId,
  testGrid,
  cropName,
}) => ({
  entitySearchRequest: {
    dbtId: dbtId,
    categoryType: categoryType,
    tenantId: TENANT_ID,
    otp: "",
    tokenId: tokenId,
    payload: {
      TargetYieldRequest: {
        cropName: cropName,
        testGrid: testGrid,
      },
    },
  },
});

export const SoilHealthService = {
  makeCropListCall: async () => {
    return Request({
      url: urls.cropListData,
      useCache: true,
    });
  },
  makeFertilizerListCall: async ({ fertilizer }) => {
    return Request({
      url: urls.fertilizerListData,
      data: getFertilizerRequestBody({ fertilizer }),
      useCache: true,
    });
  },
  makeYieldListCall: async ({
    dbtId,
    categoryType,
    tokenId,
    testGrid,
    cropName,
  }) => {
    return Request({
      url: urls.Agent_Farmer_Search,
      data: getYieldListRequestBody({
        dbtId: dbtId,
        categoryType: categoryType,
        tokenId: tokenId,
        testGrid: testGrid,
        cropName: cropName,
      }),
      useCache: true,
    });
  },
  makeSoilHealthDetailCall: async ({
    dbtId,
    categoryType,
    tenantId,
    tokenId,
    testGrid,
    DownloadCardCriteria,
  }) => {
    return Request({
      url: urls.Agent_Farmer_Search,
      data: getSoilHealthRequestBody({
        dbtId: dbtId,
        categoryType: categoryType,
        tenantId: tenantId,
        tokenId: tokenId,
        testGrid: testGrid,
        DownloadCardCriteria: DownloadCardCriteria,
      }),
      useCache: true,
    });
  },
};
