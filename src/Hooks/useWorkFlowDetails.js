import { useQuery, useQueryClient } from "react-query";
import { WorkflowService } from "../services/Workflow";

const useWorkflowDetails = ({ tenantId, id, moduleCode, status, enabled }) => {
  const queryClient = useQueryClient();

  const { isLoading, error, isError, data } = useQuery(
    ["workFlowDetails", tenantId, id, moduleCode, status],
    () => WorkflowService.getDetailsById({ tenantId, id, moduleCode }),
    { staleTime: Infinity, enabled: enabled }
  );

  return {
    isLoading,
    error,
    isError,
    data,
    revalidate: () =>
      queryClient.invalidateQueries([
        "workFlowDetails",
        tenantId,
        id,
        moduleCode,
        status,
      ]),
  };
};

export default useWorkflowDetails;
