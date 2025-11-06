import { useQuery, useQueryClient } from "react-query";
import { MandiService } from "../services/MandiService";

const useMandiPriceInboxData = (searchParams, enabled) => {
  const client = useQueryClient();

  const fetchInboxData = async () => {
    const { pageNo = 1, pageSize = 10 } = searchParams;
    const requestData = {
      requestBody: {
        SearchCriteria: {
          pageNo,
          pageSize,
          ...searchParams,
        },
      },
      requestParams: {
        tenantId: "br",
      },
    };
    const response = await MandiService.search(requestData);
    return {
      data: response?.Data ?? [],
      totalCount: response?.totalCounts ?? 0,
    };
  };

  const result = useQuery(
    [
      "fetchMandiPriceInboxData",
      ...Object.keys(searchParams).map((i) => searchParams[i]),
    ],
    fetchInboxData,
    { staleTime: Infinity, enabled}
  );
  return {
    ...result,
    revalidate: () => client.refetchQueries(["fetchMandiPriceInboxData"]),
  };
};

export default useMandiPriceInboxData;
