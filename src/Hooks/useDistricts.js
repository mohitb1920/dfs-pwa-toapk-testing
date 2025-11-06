import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";
import { LocationService } from "../services/Location";

const useDistricts = (tenantId,mdmsId) => {
  const queryKey = [`TENANT_DISTRICTS`];
 

  return useQuery(queryKey, () => LocationService.getCropMapping(tenantId,mdmsId), {
    staleTime: Infinity,
    select: (data) => {
      const districts = data?.data
        ?.map((district) => ({
          ...district,
        }))
        .filter(
          (item, i, arr) => i === arr.findIndex((t) => t.DistCode === item.DistCode)
        );

      return districts;
    },
  });
};
export default useDistricts;

