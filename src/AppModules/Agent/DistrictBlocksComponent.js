import React from "react";
import { useTranslation } from "react-i18next";
import useDistrictBlocks from "../../Hooks/useDistrictBlocks";
import useDistricts from "../../Hooks/useDistricts";
import useBlockPanchayats from "../../Hooks/useBlockPanchayats";
import usePanchayatVillages from "../../Hooks/usePanchayatVillages";

const DistrictBlocksComponent = () => {
  const { data, isLoading, isError } = useBlockPanchayats("br",1704);
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;
  function extractNames(data) {
    return data.map((item) => item.name);
  }
  const namesArray = extractNames(data);
  return <div>dd</div>;
};

export default DistrictBlocksComponent;
