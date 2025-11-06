import { useQuery, useQueryClient } from "react-query";
import { ShowCauseService } from "../services/ShowCause";

const useShowcauseDetails = ({ tenantId, id, status, uuid, isAgentUser}) => {
  const queryClient = useQueryClient();
  let showcauseDetails = null;
  let showcauseStatuses = ["issuedTo", "issuedBy"];

  const getDetails = async (status) => {
    let response = await ShowCauseService.search(tenantId, {
      serviceRequestId: id,
      [status]: uuid,
    });
    if (response?.showcauseList?.length > 0) {
      return response?.showcauseList[0];
    }
    return {};
  };

  const fetchShowcauseDetails = async () => {
    let statusWithDetails = showcauseStatuses.map(async (status) => ({
      [status]: await getDetails(status),
    }));
    const statusWithDetailsArray = await Promise.all(statusWithDetails);
    showcauseDetails = statusWithDetailsArray.reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});
    return showcauseDetails;
  };

  const { isLoading, error, isError, data } = useQuery(
    ["Showcause_Deatils", tenantId, id, status],
    fetchShowcauseDetails,
    { staleTime: Infinity, enabled: !isAgentUser && false }
  );

  return {
    isLoading,
    error,
    isError,
    data,
    revalidate: () =>
      queryClient.invalidateQueries(["Showcause_Deatils", tenantId, id]),
  };
};

export default useShowcauseDetails;
