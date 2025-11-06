import { useQuery, useQueryClient } from "react-query";
import { TENANT_ID } from "../components/Utils";
import { getUser } from "../services/loginService";
import { FarmerService } from "../services/Farmer";

const allCategoryTypes = [
  "PROFILE_CREATE",
  "DBT_PROFILE_CREATE",
  "PROFILE_UPDATE",
  "SCHEME_APPLY",
  "GRM_APPLY",
];

const useAgentHistory = (searchParams, selectedCard) => {
  const client = useQueryClient();
  const userInfo = getUser();
  const tenantId = TENANT_ID;
  const categoryTypes = (() => {
    switch (selectedCard) {
      case "farmerRegistration":
        return allCategoryTypes.slice(0, 3);
      case "schemesApplied":
        return [allCategoryTypes[3]];
      case "grmRequests":
        return [allCategoryTypes[4]];
      default:
        return allCategoryTypes;
    }
  })();
  const data = {
    AuditSearch: {
      agentId: [userInfo.uuid],
      categoryTypes,
      tenantId,
    },
  };

  const fetchAgentHistoryData = async () => {
    const response = await FarmerService.getHistorydata(data, searchParams);
    return response?.data || [];
  };

  const result = useQuery(
    ["agentHistory", searchParams, selectedCard],
    fetchAgentHistoryData,
    {
      staleTime: Infinity,
    }
  );

  return {
    ...result,
    revalidate: () => client.refetchQueries(["agentHistory"]),
  };
};
export default useAgentHistory;
