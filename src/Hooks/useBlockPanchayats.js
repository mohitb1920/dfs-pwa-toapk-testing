import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";
import { LocationService } from "../services/Location";
const useBlockPanchayats = (tenantId, blockLg) => {
  const queryKey = blockLg ? [`TENANT_${blockLg}_PANCHAYATS`, blockLg] : null;

  return useQuery(
    queryKey,
    () => LocationService.getPanchayats(tenantId, blockLg),
    {
      staleTime: Infinity,
      select: (data) =>
        data?.data?.boundarys
          ?.map((panchayat) => ({
            ...panchayat,
          }))
          .filter(
            (item, i, arr) => i === arr.findIndex((t) => t.name === item.name)
          ),
    }
  );
};
export default useBlockPanchayats;
