import { useQuery, useQueryClient } from "react-query";
import { MdmsService } from "../services/MDMS";

const getFilter = ({ name, panchayatLG, blockLG, districtLG }) => {
  if (["AgriCoordinator", "KisanSalahkar"].includes(name)) {
    return `[?(@['panchayatCode'] == '${panchayatLG}')]`;
  }
  if (["JaivikFPO"].includes(name)) {
    return `[?(@['blockCode'] == '${blockLG}')]`;
  }
  if (
    [
      "BavasAgriCoordinator",
      "AssistantDirectorPP",
      "EthanolIndustries",
      "foodProcessing",
    ].includes(name)
  ) {
    return `[?(@['districtCode'] == '${districtLG}')]`;
  }
  return null;
};
export const useHelpData = ({
  selectedData,
  name,
  selectedDistrict,
  selectedBlock,
  selectedPanchayat,
  enabled,
}) => {
  const client = useQueryClient();

  const fetchHelpData = async () => {
    const tenantId = "br";

    const filter = getFilter({
      name,
      districtLG: selectedDistrict?.id,
      blockLG: selectedBlock?.id,
      panchayatLG: selectedPanchayat?.id,
    });

    // Fetch help data
    const response = await MdmsService.mdmsCall(
      tenantId,
      "RAINMAKER-PGR",
      name,
      filter
    );

    let helpData = [];
    if (response.status === 200) {
      helpData =
        response?.["data"]?.["MdmsRes"]?.["RAINMAKER-PGR"]?.[name] ?? [];
    }

    return helpData;
  };
  const { filters } = selectedData;
  const requiredFilters = {};
  if (filters?.includes("district") && selectedDistrict) {
    requiredFilters.district = selectedDistrict;
  }
  if (filters?.includes("block") && selectedBlock) {
    requiredFilters.block = selectedBlock;
  }
  if (filters?.includes("panchayat") && selectedPanchayat) {
    requiredFilters.panchayat = selectedPanchayat;
  }
  const allFiltersPresent =
    filters?.every((filter) => requiredFilters[filter]) ?? true;
  const result = useQuery(
    [
      "fetchHelpData",
      name,
      selectedDistrict?.id,
      selectedBlock?.id,
      selectedPanchayat?.id,
    ],
    fetchHelpData,
    {
      staleTime: Infinity,
      retry: 2,
      enabled: !!allFiltersPresent,
    }
  );

  return {
    ...result,
    revalidate: () => client.refetchQueries(["fetchHelpData"]),
  };
};
