import { useQuery, useQueryClient } from "react-query";
import { DataCountService } from "../services/DataCountService";

export const useAnalyticsData = ({ indexName, field, key }) => {
  const client = useQueryClient();

  const fetchAnalyticsData = async () => {
    const tenantId = "br";
    const response = await DataCountService.call({
      tenantId: tenantId,
      operator: "EQUAL",
      field: field,
      value: true,
      indexName: indexName,
    });
    let assetsData = {};
    if (response.status === 200) {
      assetsData = response["data"];
    }

    return assetsData;
  };

  const result = useQuery([key], fetchAnalyticsData, {
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  return {
    ...result,
    revalidate: () => client.refetchQueries([key]),
  };
};
