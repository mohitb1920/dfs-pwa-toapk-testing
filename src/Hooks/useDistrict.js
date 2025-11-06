import { useQuery } from "react-query";
import { LocationService } from "../services/Location";

const useDistrict = (tenantId) => {
  const queryKey = [`TENANT_DISTRICTS`];

  return useQuery(queryKey, () => LocationService.getDistricts(tenantId), {
    staleTime: Infinity,
    select: (data) => {
      const blocks = data?.data?.boundarys
        ?.map((block) => block)
        .filter(
          (item, i, arr) => arr.findIndex((t) => t.name === item.name) === i
        );

      return blocks;
    },
  });
};
export default useDistrict;
