import { useQuery, useQueryClient } from "react-query";
import { TENANT_ID } from "../components/Utils";
import { getUser } from "../services/loginService";
import { ShowCauseService } from "../services/ShowCause";

const useComplaintsCount = (searchParams) => {
  const client = useQueryClient();
  const { customFilters } = searchParams;
  const userInfo = getUser();
  let complaintStatusWithCount = null;
  let showcauseStatuses = ["issuedTo", "issuedBy"];
  const tenantId = TENANT_ID;

  const getCount = async (value) => {
    let response = await ShowCauseService.count(tenantId, {
      [value]: userInfo?.uuid,
      ...customFilters,
    });
    return response?.data?.count;
  };

  const fetchCount = async () => {
    let statusWithCount = showcauseStatuses.map(async (status) => ({
      [status]: await getCount(status),
    }));

    const statusWithCountArray = await Promise.all(statusWithCount);
    complaintStatusWithCount = statusWithCountArray.reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});
    return complaintStatusWithCount;
  };

  const result = useQuery(["fetchCount", customFilters], fetchCount, {
    staleTime: Infinity, enabled:false
  });

  return { ...result, revalidate: () => client.refetchQueries(["fetchCount"]) };
};
export default useComplaintsCount;
