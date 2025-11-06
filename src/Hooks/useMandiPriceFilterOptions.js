import { useQuery, useQueryClient } from "react-query";
import { MandiService } from "../services/MandiService";
import { capitalize } from "../components/Utils";

const useMandiPriceFilterOptions = (searchParams) => {
  const client = useQueryClient();

  const requestData = (SearchCriteria, additionalData = {}) => {
    return {
      requestBody: {
        SearchCriteria,
        ...additionalData,
      },
      requestParams: {
        tenantId: "br",
      },
    };
  };

  const fetchFiltersData = async () => {
    let combinedRes = {
      districtOptions: [],
      marketOptions: [],
      commodityOptions: [],
    };

    const [districtResponse, commodityResponse] = await Promise.all([
      MandiService.search(
        requestData(searchParams, { GroupbyCriteria: "DISTRICT" })
      ),
      MandiService.search(
        requestData(searchParams, { GroupbyCriteria: "COMMODITY" })
      ),
    ]);

    if (districtResponse?.Data?.length > 0) {
      const districts = districtResponse.Data.map((item) => ({
        ...item,
        name: capitalize(item.name),
      }));
      combinedRes = { ...combinedRes, districtOptions: districts };
    }
    if (commodityResponse?.Data?.length > 0) {
      combinedRes = {
        ...combinedRes,
        commodityOptions: commodityResponse.Data,
      };
    }
    return combinedRes;
  };

  const result = useQuery(
    [
      "fetchMandiPriceFilterOptions",
      ...Object.keys(searchParams).map((i) => searchParams[i]),
    ],
    fetchFiltersData,
    { staleTime: Infinity }
  );
  return {
    ...result,
    revalidate: () => client.refetchQueries(["fetchMandiPriceFilterOptions"]),
  };
};

export default useMandiPriceFilterOptions;
