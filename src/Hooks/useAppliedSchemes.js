// useAppliedSchemes.js
import { useQuery } from "react-query";
import { getAppliedSchemes } from "../services/CitizenServices";

export function useAppliedSchemes(options = {}) {
  return useQuery(
    "appliedSchemes",
    async () => {
      const response = await getAppliedSchemes();
      return response.data;
    },
    {
      staleTime: 60000, // data is fresh for 60 seconds
      cacheTime: 300000, // keep cache for 5 minutes
      refetchOnWindowFocus: false, // avoid refetching on window focus
      ...options,
    }
  );
}
