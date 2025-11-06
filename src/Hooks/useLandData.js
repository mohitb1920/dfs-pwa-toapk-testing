import { useQuery, useQueryClient } from "react-query";
import { SchemeService } from "../services/Schemes";
import { LocationsService } from "../services/Locations";

const useLandData = (
  schemeId,
  schemeName,
  districtCode,
  blockCode,
  panchayatCode,
  villageCode,
  isChecked,
  {
    farmerDistrictObject,
    farmerBlockObject,
    farmerPanchayatObject,
    farmerVillageObject,
  },
  methods
) => {
  const schemes = [
    "SCHEME009",
    "SCHEME010",
    "SCHEME011",
    "SCHEME012",
    "SCHEME016",
    "SCHEME026",
    "SCHEME030",
    "SCHEME036",
    "SCHEME045",
    "SCHEME046",
    "SCHEME050",
    "SCHEME051",
    "SCHEME022",
    "SCHEME016",
    "SCHEME014",
    "SCHEME032",
    "SCHEME031",
    "SCHEME033",
    "SCHEME046",
    "SCHEME048",
    "SCHEME049",
    "SCHEME052",
    "SCHEME057",
    "SCHEME058",
    "SCHEME059",
    "SCHEME060",
    "SCHEME061",
    "SCHEME062",
    "SCHEME063",
    "SCHEME064",
  ];
  let schemeInfo = JSON.parse(localStorage.getItem(schemeId + "formData"));
  let isSchemeValid = schemes.includes(schemeId) && !isChecked;
  if (
    !isChecked &&
    villageCode !== "" &&
    schemeInfo &&
    !schemeInfo.landDetails
  ) {
    isSchemeValid = false;
  }

  const client = useQueryClient();
  const { setValue } = methods;
  const fetchAgriData = async () => {
    const tenantId = "br";
    let districts, blocks, villages, panchayats;

    const cachedDistricts = client.getQueryData(["districts", schemeId]);
    if (!cachedDistricts) {
      districts = await SchemeService.crops(schemeId);
      if (districts) {
        districts = filterOptions(districts, "district");
        client.removeQueries(["blocks", schemeId]);
        client.setQueryData(["districts", schemeId], districts);
      }
    } else {
      districts = cachedDistricts;
    }

    if (districtCode) {
      if (!blockCode) farmerBlockObject.options = [];
      if (!panchayatCode) farmerPanchayatObject.options = [];
      farmerVillageObject.options = [];

      const cachedBlocks = client.getQueryData([
        "blocks",
        schemeId,
        districtCode,
      ]);
      if (!cachedBlocks) {
        farmerBlockObject.options = [];
        farmerPanchayatObject.options = [];
        farmerVillageObject.options = [];
        blocks = await LocationsService.blocks(schemeId, districtCode);
        if (blocks && blocks.boundarys) {
          blocks = filterOptions(blocks.boundarys, "blocks");
          client.removeQueries(["blocks", schemeId]);
          client.setQueryData(["blocks", schemeId, districtCode], blocks);
        }
      } else {
        blocks = cachedBlocks;
      }
    }

    if (districtCode && blockCode) {
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
          client.removeQueries(["panchayats", schemeId]);
          client.setQueryData(["panchayats", schemeId, blockCode], panchayats);
        }
      } else {
        panchayats = cachedPanchayats;
      }
    }

    if (districtCode && blockCode && panchayatCode) {
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
          client.removeQueries(["villages", schemeId]);
          client.setQueryData(["villages", schemeId, panchayatCode], villages);
        }
      } else {
        villages = cachedVillages;
      }
    }
    return { districts, blocks, panchayats, villages };
  };

  const result = useQuery(
    ["fetchLocationData", schemeId, districtCode, blockCode, panchayatCode],
    fetchAgriData,
    {
      enabled: isSchemeValid,
      staleTime: Infinity,
      cacheTime: 10,
    }
  );

  return {
    ...result,
    revalidate: () => {
      client.refetchQueries(["fetchLocationData"]);
    },
  };
};
const filterOptions = (data, relation) => {
  let dropOptions = ["code", , "name"];
  if (data && relation === "district") {
    dropOptions = ["DistCode", , "DistName"];
  }

  let filteredArray = data || [];
  let uniqueIds = {};

  let ans = filteredArray
    .map((obj) => {
      return { id: obj[dropOptions[0]], value: obj[dropOptions[2]] };
    })
    .filter((item) => {
      if (uniqueIds[item.id]) {
        return false;
      }
      uniqueIds[item.id] = true;
      return true;
    });

  return ans || [];
};
export default useLandData;
