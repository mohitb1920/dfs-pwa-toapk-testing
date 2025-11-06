import { MdmsService } from "../services/MDMS";
import { useQuery, useQueryClient } from "react-query";

const useSpecificSchemeData = (schemeId) => {
  const client = useQueryClient();
  const fetchSchemesData = async () => {
    const tenantId = "br";
    // Making both API calls in parallel
    const [schemesDefsv2, schemesDefs] = await Promise.all([
      MdmsService.getSchemesDefs(tenantId, "Schemes", schemeId),
      MdmsService.getSpecificSchemeDefs({
        tenantId,
        moduleCode: "Schemes",
        schemeId,
        useOldMdms: true,
      }),
    ]);

    // Extract the scheme data
    let mergedData = { ...schemesDefs };

    const v1SchemeData = schemesDefs?.["scheme-dynamic-form-jsons"]?.[schemeId]?.[0];
    const v2SchemeData = schemesDefsv2?.["schemes-list-updated"]?.["schemes-description"]?.[0];

    const fieldsToReplace = [
      "schemeName",
      "departmentName",
      "subDepartmentName",
      "shortDescription",
      "typeOfBenefit",
      "eligibilityCriteria",
      "documentRequirements",
      "documents",
    ];

    if (v1SchemeData && v2SchemeData) {
      fieldsToReplace.forEach((key) => {
        if (
          schemesDefsv2["schemes-list-updated"]["schemes-description"][0][key]
        ) {
          mergedData["scheme-dynamic-form-jsons"][schemeId][0][key] =
            schemesDefsv2["schemes-list-updated"]["schemes-description"][0][
              key
            ]; // Overwrite with new data
        }
      });
    } else if (!v1SchemeData && v2SchemeData) {
      mergedData["scheme-dynamic-form-jsons"] = {
        [schemeId]: [
          fieldsToReplace.reduce(
            (acc, key) => {
              if (v2SchemeData[key]) acc[key] = v2SchemeData[key];
              return acc;
            },
            { id: schemeId }
          ),
        ],
      };
    }

    return {
      _payload: mergedData["scheme-dynamic-form-jsons"],
      isV1Used: !!v1SchemeData,
    };
  };

  const result = useQuery(
    ["fetchSchemeSpecificData", schemeId],
    fetchSchemesData,
    {
      staleTime: Infinity,
    }
  );
  const data = result.data?._payload ?? null; // Extracting the payload from the result
  const isV1Used = result.data?.isV1Used ?? false; // Check if we are getting form schema from mdms v1

  return {
    ...result,
    data,
    isV1Used,
    revalidate: () => client.refetchQueries(["fetchSchemeSpecificData"]),
  };
};

export default useSpecificSchemeData;
