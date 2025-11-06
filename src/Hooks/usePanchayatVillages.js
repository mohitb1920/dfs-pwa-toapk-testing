import { useQuery } from "react-query";
import { LocationService } from "../services/Location";

const usePanchayatVillages = (tenantId, panchayatLg) => {
  const queryKey = panchayatLg
    ? [`TENANT_${panchayatLg}_VILLAGES`, panchayatLg]
    : null;

  return useQuery(
    queryKey,
    () => LocationService.getVillages(tenantId, panchayatLg),
    {
      staleTime:Infinity,
      select: (data) =>
        data.data?.boundarys
          ?.map((village) => ({
            ...village,
          }))
          .filter(
            (item, i, arr) => i === arr.findIndex((t) => t.name === item.name)
          ),
    }
  );
};
export default usePanchayatVillages;

// {
//   "code": "216863",
//   "name": "Tejwaliya",
//   "label": "Village",
//   "latitude": null,
//   "longitude": null,
//   "area": null,
//   "pincode": null,
//   "boundaryNum": null,
//   "censusCode": "216863",
//   "children": null,
//   "ddrKey": "Tejwaliya"
// }
