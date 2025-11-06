import React, { useMemo } from "react";
import { useQuery, useQueryClient } from "react-query";
import { SchemeService } from "../services/Schemes";

const useCropData = (
  schemeId,
  {
    cropCall = false,
    seasonCall = false,
    farmerCall = false,
    irrigationCall = false,
    landCall = false,
    effectedCall = false,
  } = {},
  { aadharCall = false, name, aadharNo } = {}
) => {
  const schemes = [
    "SCHEME008",
    "SCHEME009",
    "SCHEME010",
    "SCHEME011",
    "SCHEME012",
    "SCHEME013",
    "SCHEME014",
    "SCHEME016",
    "SCHEME022",
    "SCHEME026",
    "SCHEME030",
    "SCHEME031",
    "SCHEME032",
    "SCHEME033",
    "SCHEME036",
    "SCHEME045",
    "SCHEME046",
    "SCHEME048",
    "SCHEME049",
    "SCHEME050",
    "SCHEME051",
    "SCHEME052",
    "SCHEME056",
    "SCHEME057",
    "SCHEME058",
    "SCHEME059",
    "SCHEME060",
    "SCHEME061",
    "SCHEME062",
    "SCHEME063",
    "SCHEME064",
  ];

  
  const isSchemeValid = schemes.includes(schemeId);
  if (schemeId === "SCHEME013") {
    irrigationCall = false;
  } else if (schemeId === "SCHEME008") {
    landCall = false;
  }

  const queryEnabled = useMemo(() => {
    return !!(
      isSchemeValid &&
      ((aadharCall && aadharNo?.length === 12 && name) ||
        cropCall ||
        seasonCall ||
        farmerCall ||
        irrigationCall ||
        landCall ||
        effectedCall)
    );
  }, [
    aadharCall,
    aadharNo,
    name,
    cropCall,
    seasonCall,
    farmerCall,
    irrigationCall,
    landCall,
    effectedCall,
    isSchemeValid,
  ]);

  const client = useQueryClient();
  const fetchAgriData = async () => {
    const tenantId = "br";
    let crops, seasons, farmer, irrigation, aadharAuth, lands, effected;

    if (cropCall) crops = await SchemeService.crops(schemeId);
    if (seasonCall) seasons = await SchemeService.seasons(schemeId);
    if (farmerCall) farmer = await SchemeService.farmerType(schemeId);
    if (irrigationCall) irrigation = await SchemeService.irrigation(schemeId);
    if (landCall) lands = await SchemeService.landType(schemeId);
    if (effectedCall) effected = await SchemeService.effectedType(schemeId);
    if (aadharCall)
      aadharAuth = await SchemeService.aadharAuth(schemeId, name, aadharNo);

    if (seasons) {
      seasons = filterOptions(seasons, "season");
    }

    if (crops) {
      if (
        [
          "SCHEME009",
          "SCHEME011",
          "SCHEME012",
          "SCHEME030",
          "SCHEME031",
          "SCHEME032",
          "SCHEME033",
          "SCHEME036",
          "SCHEME045",
          "SCHEME046",
          "SCHEME048",
          "SCHEME049",
          "SCHEME050",
          "SCHEME052",
          "SCHEME057",
          "SCHEME058",
          "SCHEME059",
          "SCHEME060",
          "SCHEME062",
          "SCHEME063",
          "SCHEME064",
        ].includes(schemeId)
      ) {
        crops = filterCropCode(crops, "cropName");
      } else if (["SCHEME010", "SCHEME016"].includes(schemeId)) {
        crops = filterCropSubsidy(crops, "cropName");
      } else if (["SCHEME014"].includes(schemeId)) {
        crops = filterCropMakahana(crops, "cropName");
      } else if (["SCHEME022"].includes(schemeId)) {
        crops = filterCropShushk(crops, "cropName");
      } else if (["SCHEME026"].includes(schemeId)) {
        crops = filterCropSabji(crops, "cropName");
      } else if (["SCHEME051", "SCHEME056"].includes(schemeId)) {
        crops = filterCropCluster(crops, "cropName");
      } else {
        crops = filterOptions(crops, "cropName");
        crops = filterCrops(seasons, crops);
      }
    }
    if (farmer) {
      farmer = filterOptions(farmer, "farmerTypeDieasel");
    }
    if (lands) {
      lands = filterOptions(lands, "lands");
    }
    if (effected) {
      effected = filterOptions(effected, "effected");
    }

    if (irrigation) {
      irrigation = filterOptions(irrigation, "irrigation");
    }

    return { crops, seasons, farmer, irrigation, aadharAuth, lands, effected };
  };

  const result = useQuery(
    [
      "fetchAgriData",
      schemeId,
      aadharNo,
      name,
      cropCall,
      seasonCall,
      farmerCall,
      irrigationCall,
      aadharCall,
      landCall,
      effectedCall,
    ],
    fetchAgriData,
    {
      enabled: queryEnabled,
      staleTime: aadharCall ? 0 : Infinity,
    }
  );

  return {
    ...result,
    revalidate: () => client.refetchQueries(["fetchAgriData"]),
  };
};

const filterCrops = (seasons, crops) => {
  if (!seasons || !crops) return crops;
  const validSeasonIDs = seasons.map((season) => season.SeasonID);
  const filteredCrops = crops.filter((crop) =>
    validSeasonIDs.includes(crop.SeasonID)
  );
  return filteredCrops;
};

const filterOptions = (data, relation) => {
  let dropOptions = [];

  if (relation === "season") {
    dropOptions = ["SeasonID", "STATUS", "SeasonName"];
  } else if (relation === "cropName") {
    dropOptions = ["CropID", "CropCode", "CropName", "SeasonID", "CropUnit"];
  } else if (relation === "farmerTypeDieasel") {
    dropOptions = ["FarmerID", , "FarmerType"];
  } else if (relation === "lands") {
    dropOptions = ["LandAID", "LandAType"];
  } else if (relation === "effected") {
    dropOptions = ["ID", "STATUS", "Name"];
  } else if (relation === "irrigation") {
    dropOptions = ["SeasonID", "Active", "CropID", "NoofApply"];
  }

  let filteredArray = data || [];

  if (
    relation === "season" ||
    relation === "effected" ||
    relation === "irrigation"
  ) {
    filteredArray = data?.filter((obj) => obj[dropOptions[1]] === "Y");
  }

  const ans = filteredArray?.map((obj) => {
    if (relation === "cropName") {
      return {
        [dropOptions[0]]: obj[dropOptions[0]],
        [dropOptions[2]]: obj[dropOptions[2]],
        [dropOptions[3]]: obj[dropOptions[3]],
      };
    } else if (relation === "lands") {
      return { id: obj[dropOptions[0]], value: obj[dropOptions[1]] };
    } else if (relation === "effected") {
      return { id: obj[dropOptions[0]], value: obj[dropOptions[2]] };
    } else if (relation === "irrigation") {
      return {
        season: obj[dropOptions[0]],
        crop: obj[dropOptions[2]],
        max: obj[dropOptions[3]],
      };
    }
    return {
      [dropOptions[0]]: obj[dropOptions[0]],
      [dropOptions[2]]: obj[dropOptions[2]],
    };
  });

  return ans || [];
};

const filterCropSubsidy = (data, relation) => {
  let dropOptions = [
    "CropCode",
    ,
    "CropName",
    "DistCode",
    "UnitCost",
    "SubsidyPercent",
    "SubsidyAmount",
    "CropUnit",
    "MinArea",
    "MaxArea",
  ];

  let result = [];

  data?.forEach((obj) => {
    const id = obj[dropOptions[0]];

    result.push({
      id,
      value: obj[dropOptions[2]],
      district: obj[dropOptions[3]],
      unitCost: obj[dropOptions[4]],
      subsidy: obj[dropOptions[5]],
      amount: obj[dropOptions[6]],
      cropUnit: obj[dropOptions[7]],
      min: obj[dropOptions[8]] || obj["MinArea_Acre"],
      max: obj[dropOptions[9]] || obj["MaxArea_Acre"],
    });
  });

  return result;
};

const filterCropCode = (data, relation) => {
  let dropOptions = [
    "CropCode",
    ,
    "CropName",
    "DistCode",
    "Min",
    "Max",
    "CropUnit",
  ];

  let result = [];

  data?.forEach((obj) => {
    const id = obj[dropOptions[0]];

    result.push({
      id,
      value: obj[dropOptions[2]],
      district: obj[dropOptions[3]],
      min: obj[dropOptions[4]] || obj[`MinArea`],
      max: obj[dropOptions[5]] || obj[`MaxArea`],
      cropUnit: obj[dropOptions[6]],
    });
  });

  return result;
};

const filterCropMakahana = (data, relation) => {
  let dropOptions = [
    "CropCode",
    ,
    "CropName",
    "DistCode",
    "MinArea",
    "MaxArea",
    "CropUnit",
  ];

  let result = [];

  data?.forEach((obj) => {
    const id = obj[dropOptions[0]];

    result.push({
      id,
      value: obj[dropOptions[2]],
      district: obj[dropOptions[3]],
      min: obj[dropOptions[4]] || obj[`MinArea`],
      max: obj[dropOptions[5]] || obj[`MaxArea`],
      cropUnit: obj[dropOptions[6]],
    });
  });

  return result;
};

const filterCropShushk = (data, relation) => {
  let dropOptions = [
    "CropCode",
    ,
    "CropName",
    "DistCode",
    "MinPlant",
    "MaxPlant",
    "CropUnit",
    "ComponentCode",
    "ComponentName",
    "RequiredPlantPerAcre",
  ];

  let result = [];

  data?.forEach((obj) => {
    const id = obj[dropOptions[0]];

    result.push({
      id,
      value: obj[dropOptions[2]],
      district: obj[dropOptions[3]],
      min: obj[dropOptions[4]] || obj[`MinArea`],
      max: obj[dropOptions[5]] || obj[`MaxArea`],
      cropUnit: obj[dropOptions[6]],
      componentCode: obj[dropOptions[7]],
      componentName: obj[dropOptions[8]],
      requiredAcre: obj[dropOptions[9]],
    });
  });

  return result;
};

const filterCropCluster = (data, relation) => {
  let dropOptions = [
    "ComponentCode",
    "ComponentName",
    "DistCode",
    "DistName",
    "BlockCode",
    "BlockName",
    "PanchayatCode",
    "PanchayatName",
    "VillageCode",
    "VillageName",
  ];

  let result = [];

  data?.forEach((obj) => {
    const id = obj[dropOptions[0]];

    result.push({
      id,
      value: obj[dropOptions[1]],
      districtId: obj[dropOptions[2]],
      districtName: obj[dropOptions[3]],
      blockId: obj[dropOptions[4]],
      blockName: obj[dropOptions[5]],
      panchayatId: obj[dropOptions[6]],
      panchayatName: obj[dropOptions[7]],
      villageId: obj[dropOptions[8]],
      villageName: obj[dropOptions[9]],
    });
  });

  return result;
};

const filterCropSabji = (data, relation) => {
  let dropOptions = [
    "CropCode",
    "CropName",
    "CropUnit",
    "DistCode",
    "ComponentCode",
    "ComponentName",
  ];

  let result = [];

  data?.forEach((obj) => {
    const id = obj[dropOptions[0]];

    result.push({
      id,
      value: obj[dropOptions[1]],
      cropUnit: obj[dropOptions[2]],
      district: obj[dropOptions[3]],
      componentCode: obj[dropOptions[4]],
      componentName: obj[dropOptions[5]],
    });
  });

  return result;
};

export default useCropData;
