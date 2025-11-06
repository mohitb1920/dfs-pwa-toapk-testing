import React from "react";
import { MdmsService } from "../services/MDMS";
import { useQuery, useQueryClient } from "react-query";

const useSchemesData = () => {
  const client = useQueryClient();
  const fetchSchemesData = async () => {
    const tenantId = "br";

    //all 52
    const schemesDefs = await MdmsService.getSchemesDefs(tenantId, "Schemes");
    //ID and schemeLevel
    const schemeDetails = await MdmsService.getSchemesDetails(
      tenantId,
      "Schemes"
    );
    return combineResponses(schemesDefs, schemeDetails);
  };

  const result = useQuery(
    ["fetchSchemesData", "filterSpace"],
    fetchSchemesData,
    {
      staleTime: Infinity,
      retry: 2,
    }
  );

  return {
    ...result,
    revalidate: () =>
      client.refetchQueries(["fetchSchemesData", "filterSpace"]),
  };
};

const combineResponses = (schemes, schemeInfo) => {
  const array1 = schemes["schemes-list-updated"]["schemes-description"];
  const array2 = schemeInfo;

  const array1Map = array1.reduce((acc, obj) => {
    acc[obj.id] = obj;
    return acc;
  }, {});

  const combinedArray = array2
    .map((obj2) => {
      const matchedObj = array1Map[obj2.mdmsId];
      if (matchedObj) {
        return {
          ...matchedObj,
          schemeLevel: obj2.schemeLevel,
          mainId: obj2.id,
          isDeleted: obj2.isDeleted,
          startDate: obj2.startDate,
          endDate: obj2.endDate,
          modifyDate: obj2.auditDetails?.createdTime,
        };
      }
      return null;
    })
    .filter((obj) => obj !== null);

  return combinedArray;
};

export default useSchemesData;
