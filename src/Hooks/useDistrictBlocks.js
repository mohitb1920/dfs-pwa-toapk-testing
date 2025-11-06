import { useQuery } from "react-query";
import { LocationService } from "../services/Location";

const useDistrictBlocks = (tenantId, districtLg) => {
  const queryKey = districtLg
    ? [`TENANT_${districtLg}_BLOCKS`, districtLg]
    : null;

  return useQuery(
    queryKey,
    () => LocationService.getBlocks(tenantId, districtLg),
    {
      staleTime: Infinity,
      select: (data) => {
        const blocks = data?.data?.boundarys
          ?.map((block) => block)
          .filter(
            (item, i, arr) => arr.findIndex((t) => t.name === item.name) === i
          );

        return blocks;
      },
    }
  );
};
export default useDistrictBlocks;
