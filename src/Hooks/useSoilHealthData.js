import { useQuery, useQueryClient } from "react-query";
import useGeolocation from "./GetLocation";
import { MdmsService } from "../services/MDMS";
import { SoilHealthService } from "../services/SoilHealthService";

export const useSoilHealthLabsData = ({ language }) => {
  const { getLocation } = useGeolocation();
  const client = useQueryClient();
  const fetchSoilHealthLabsData = async () => {
    const tenantId = "br";
    const response = await MdmsService.mdmsCall(
      tenantId,
      `soil-card-${language}`,
      "SoilTestLabs"
    );
    let responseData = [];
    if (response.status === 200) {
      responseData =
        response["data"]?.["MdmsRes"]?.[`soil-card-${language}`]?.[
          "SoilTestLabs"
        ] ?? [];
    }

    return responseData;
  };

  const result = useQuery(
    ["fetchSoilHealthLabsData", language],
    fetchSoilHealthLabsData,
    {
      staleTime: Infinity,
      retry: 2,
    }
  );

  return {
    ...result,
    revalidate: () =>
      client.refetchQueries(["fetchSoilHealthLabsData", language]),
  };
};
export const useCropListData = () => {
  const client = useQueryClient();
  const fetchCropListData = async () => {
    const tenantId = "br";
    const response = await SoilHealthService.makeCropListCall();
    let responseData = [];
    if (response.status === 200) {
      responseData = response?.["data"]?.["Crops"] ?? [];
    }

    return responseData;
  };

  const result = useQuery(["fetchCropListData"], fetchCropListData, {
    staleTime: Infinity,
    retry: 2,
  });

  return {
    ...result,
    revalidate: () => client.refetchQueries(["fetchCropListData"]),
  };
};

export const useYieldListData = () => {
  const client = useQueryClient();
  const fetchYieldListData = async () => {
    const tenantId = "br";
    const response = await MdmsService.mdmsCall(
      tenantId,
      "soil-card",
      "CropQuantities"
    );
    let responseData = [];
    if (response.status === 200) {
      responseData =
        response["data"]?.["MdmsRes"]?.["soil-card"]?.[`CropQuantities`] ?? [];
    }

    return responseData;
  };

  const result = useQuery(["fetchYieldListData"], fetchYieldListData, {
    staleTime: Infinity,
    retry: 2,
  });

  return {
    ...result,
    revalidate: () => client.refetchQueries(["fetchYieldListData"]),
  };
};

export const useFertilizerListData = ({ fertilizer }) => {
  const client = useQueryClient();
  const fetchFertilizerListData = async () => {
    const tenantId = "br";
    const response = await SoilHealthService.makeFertilizerListCall({
      fertilizer,
    });
    let responseData = [];
    if (response.status === 200) {
      responseData = response?.["data"]?.["Fertilizers"] ?? [];
    }

    return responseData;
  };

  const result = useQuery(
    ["fetchFertilizerListData", fertilizer],
    fetchFertilizerListData,
    {
      staleTime: Infinity,
      retry: 2,
    }
  );

  return {
    ...result,
    revalidate: () =>
      client.refetchQueries(["fetchFertilizerListData", fertilizer]),
  };
};
export const useSoilCardDetailsData = ({
  dbtId,
  categoryType,
  tokenId,
  testGrid,
}) => {
  const client = useQueryClient();
  const fetchSoilHealthCardDetailsListData = async () => {
    const tenantId = "br";
    const response = await SoilHealthService.makeSoilHealthDetailCall({
      dbtId: dbtId,
      categoryType: categoryType,
      tenantId: tenantId,
      tokenId: tokenId,
      testGrid: testGrid,
    });
    let responseData = {};
    if (response.status === 200) {
      responseData =
        response?.["data"]?.["proxyResponse"]?.["SoilTestDetails"] ?? {};
    }

    return responseData;
  };

  const result = useQuery(
    ["fetchSoilHealthCardDetailsListData", testGrid],
    fetchSoilHealthCardDetailsListData,
    {
      staleTime: Infinity,
      retry: 2,
    }
  );

  return {
    ...result,
    revalidate: () =>
      client.refetchQueries(["fetchSoilHealthCardDetailsListData", testGrid]),
  };
};
export const useReportGenerateData = ({
  dbtId,
  categoryType,
  tokenId,
  testGrid,
}) => {
  const client = useQueryClient();
  const fetchSoilHealthCardDetailsListData = async () => {
    const tenantId = "br";
    const response = await SoilHealthService.makeSoilHealthDetailCall({
      dbtId: dbtId,
      categoryType: categoryType,
      tenantId: tenantId,
      tokenId: tokenId,
      testGrid: testGrid,
    });
    let responseData = {};
    if (response.status === 200) {
      responseData =
        response?.["data"]?.["proxyResponse"]?.["SoilTestDetails"] ?? {};
    }

    return responseData;
  };

  const result = useQuery(
    ["fetchSoilHealthCardDetailsListData", testGrid],
    fetchSoilHealthCardDetailsListData,
    {
      staleTime: Infinity,
      retry: 2,
    }
  );

  return {
    ...result,
    revalidate: () =>
      client.refetchQueries(["fetchSoilHealthCardDetailsListData", testGrid]),
  };
};
