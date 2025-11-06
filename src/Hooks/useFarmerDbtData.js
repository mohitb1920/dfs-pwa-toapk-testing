import { useQuery } from "react-query";
import { getFarmerData } from "../services/FarmerDbtDetails";
import { farmerDBTData } from "./farmerData";

const useFarmerDbtData = (dbtId) => {
  const queryKey = ["farmerData", dbtId];
  return useQuery(queryKey, () => farmerDBTData(dbtId), {
    staleTime: Infinity,
    enabled: !!dbtId,
    select: (data) => {
      return data?.Farmer;
    },
  });
};

export default useFarmerDbtData;
