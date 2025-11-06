import { useQuery, useQueryClient } from "react-query";
import { LocationsService } from "../services/Locations";

const useNICLandData = (
  schemeId,
  schemeName,
  blockCode,
  panchayatCode,
  villageCode,  
  {
    farmerPanchayatObject,
    farmerVillageObject,
  },
  methods
) => {
  const schemes = ["SCHEME015"];
  let isSchemeValid = schemes.includes(schemeId);
  
  const client = useQueryClient();
  const { setValue } = methods;
  const fetchAgriData = async () => {
    const tenantId = "br";
    let districts, blocks, villages, panchayats;

    if ( blockCode) {
      if (!panchayatCode) farmerPanchayatObject.options = [];
      farmerVillageObject.options = [];
      const cachedPanchayats = client.getQueryData([
        "panchayats",
        schemeId,
        blockCode,
      ]);
      if (!cachedPanchayats) {        
        farmerPanchayatObject.options = [];
        farmerVillageObject.options = [];
        panchayats = await LocationsService.panchayats(schemeId, blockCode);
        if (panchayats && panchayats.boundarys) {
          panchayats = filterOptions(panchayats.boundarys, "panchayats");
          client.removeQueries(["panchayats",schemeId]);
          client.setQueryData(["panchayats", schemeId, blockCode], panchayats);
        }
      } else {
        panchayats = cachedPanchayats;
      }
    }

    if (blockCode && panchayatCode) {
      farmerVillageObject.options = [];
      const cachedVillages = client.getQueryData([
        "villages",
        schemeId,
        panchayatCode,
      ]);
      if (!cachedVillages) {        
        farmerVillageObject.options = [];
        villages = await LocationsService.villages(schemeId, panchayatCode);
        if (villages && villages.boundarys) {
          villages = filterOptions(villages.boundarys, "villages");
          client.removeQueries(["villages",schemeId]);
          client.setQueryData(["villages", schemeId, panchayatCode], villages);
        }
      } else {
        villages = cachedVillages;
      }
    }
    return { districts, blocks, panchayats, villages };
  };

  const result = useQuery(
    ["fetchNICLocationData", schemeId, blockCode, panchayatCode],
    fetchAgriData,
    {
      enabled: isSchemeValid,
      staleTime: Infinity,
    }
  );

  return {
    ...result,
    revalidate: () => {
      client.refetchQueries(["fetchNICLocationData"]);

    },
  };
};
const filterOptions = (data, relation) => {
  let dropOptions = ["code", , "name"];
  if (data && relation === "district") {
    dropOptions = ["DistCode", , "DistName"];
  }

  let filteredArray = data || [];
  let ans = filteredArray?.map((obj) => {
    return { id: obj[dropOptions[0]], value: obj[dropOptions[2]] };
  });

  return ans || [];
};

export default useNICLandData;
