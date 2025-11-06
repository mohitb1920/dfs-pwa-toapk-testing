// useSpecificApplicationStatus.js
import { useMutation, useQueryClient } from "react-query";
import { getApplicationStatus } from "../services/CitizenServices";

export function useSpecificApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation(
    async (applicationId) => {
      const response = await getApplicationStatus(applicationId);
      return response.data.dfsSchemeApplication;
    },
    {
      onSuccess: (updatedApplication) => {
        // Update the cached list for 'appliedSchemes'
        queryClient.setQueryData("appliedSchemes", (oldData) => {
          if (!oldData) return oldData;
          return oldData.map((item) =>
            item.dfsSchemeApplicationId ===
            updatedApplication.dfsSchemeApplicationId
              ? updatedApplication
              : item
          );
        });
      },
      onError: (error) => {
        console.error("Error updating application status:", error);
      },
    }
  );
}
