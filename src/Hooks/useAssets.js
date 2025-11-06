import { useQuery, useQueryClient } from "react-query";
import { MdmsService } from "../services/MDMS";
import { AssetsService } from "../services/AssetsService";
import { formatDateData } from "../components/Utils";
import useGeolocation from "./GetLocation";

export const useAssetsData = ({ language }) => {
  const client = useQueryClient();

  const fetchAssetsData = async () => {
    const tenantId = "br";
    //Fetch assets data
    const response = await MdmsService.mdmsCall(
      tenantId,
      `ASSETS-CATEGORY-${language === "en" ? "ENGLISH" : "HINDI"}`,
      "categories"
    );
    let assetsData = [];
    if (response.status === 200) {
      assetsData =
        response["data"]["MdmsRes"][
          `ASSETS-CATEGORY-${language === "en" ? "ENGLISH" : "HINDI"}`
        ]["categories"];
    }

    return assetsData;
  };

  const result = useQuery(["fetchAssetsData", language], fetchAssetsData, {
    staleTime: Infinity,
    retry: 2,
  });

  return {
    ...result,
    revalidate: () => client.refetchQueries(["fetchAssetsData"]),
  };
};

export const useAssetsHomeData = ({ categoryId, pageNo = 1 }) => {
  const limit = 100;
  const location = JSON.parse(localStorage.getItem("DfsWeb.locationData"));
  const client = useQueryClient();
  const fetchAssetsHomeData = async () => {
    const tenantId = "br";
    //Fetch assets data
    const response = await AssetsService.makeAssetsCall(
      tenantId,
      location?.latitude,
      location?.longitude,
      categoryId,
      //   searchText,
      limit,
      pageNo
    );
    let assetsData = [];
    if (response.status === 200) {
      assetsData = response["Facilities"];
    }

    return assetsData;
  };

  const result = useQuery(["fetchAssetsHomeData"], fetchAssetsHomeData, {
    staleTime: Infinity,
    retry: 2,
  });

  return {
    ...result,
    revalidate: () => client.refetchQueries(["fetchAssetsHomeData"]),
  };
};

export const useWeatherHomeData = ({ districtLg = null, blockLG = null }) => {
  const { getLocation } = useGeolocation();
  const location = JSON.parse(localStorage.getItem("DfsWeb.locationData"));
  const preferredLocation = JSON.parse(
    localStorage.getItem("DfsWeb.selectedWeatherLocation")
  );
  if (
    districtLg == null &&
    blockLG == null &&
    preferredLocation != null &&
    preferredLocation != undefined
  ) {
    districtLg = preferredLocation?.districtLg;
    blockLG = preferredLocation?.blockLG;
  }
  const client = useQueryClient();
  const fetchWeatherForecastData = async () => {
    const tenantId = "br";
    //Fetch assets data
    const date = formatDateData(new Date());
    const response = await AssetsService.makeWeatherCall(
      tenantId,
      location?.latitude,
      location?.longitude,
      districtLg,
      blockLG,
      date
    );
    let dateData = [];
    if (response.status === 200) {
      dateData = response["data"];
    }

    return dateData;
  };

  const result = useQuery(
    ["fetchForecastDate", districtLg, blockLG],
    fetchWeatherForecastData,
    {
      staleTime: Infinity,
      retry: 2,
    }
  );

  return {
    ...result,
    revalidate: () =>
      client.refetchQueries(["fetchForecastDate", districtLg, blockLG]),
  };
};

export const useSearchLocationData = ({ searchQuery }) => {
  const { getLocation } = useGeolocation();
  const client = useQueryClient();
  const fetchWeatherForecastData = async () => {
    if (searchQuery?.length <= 2) {
      return [];
    }
    const tenantId = "br";
    //Fetch assets data
    const date = formatDateData(new Date());
    const response = await AssetsService.makeSearchLocationCall(
      tenantId,
      searchQuery,
      date
    );
    let dateData = [];
    if (response.status === 200) {
      dateData = response["data"];
    }

    return dateData;
  };

  const result = useQuery(
    ["fetchSearchLocationData", searchQuery],
    fetchWeatherForecastData,
    {
      staleTime: Infinity,
      retry: 2,
    }
  );

  return {
    ...result,
    revalidate: () =>
      client.refetchQueries(["fetchSearchLocationData", searchQuery]),
  };
};
