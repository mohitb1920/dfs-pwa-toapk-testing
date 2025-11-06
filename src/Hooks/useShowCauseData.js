import { useQuery, useQueryClient } from "react-query";
import { PGRService } from "../services/PGR";
import { TENANT_ID } from "../components/Utils";
import { ShowCauseService } from "../services/ShowCause";
import { MdmsService } from "../services/MDMS";
import { combineResponses } from "./useInboxData";

const useShowCauseData = (searchParams, enabled) => {
  const client = useQueryClient();

  const fetchShowCauseData = async () => {
    const tenantId = TENANT_ID;
    const {
      limit,
      offset,
      sortOrder,
      filters,
      applicationStatus,
      search,
      customFilters,
    } = searchParams;
    let showcauseFilters = {
      [applicationStatus]: filters?.wfQuery.assignee,
      sortOrder,
      limit,
      offset,
      ...customFilters,
    };
    let showcauseResponse = null;
    let combinedRes = [];
    let showCauses = null;
    let complaintDetailsResponse = null;
    let serviceIds = [];
    
    if(search?.serviceRequestId) {
      showcauseFilters = {...showcauseFilters, serviceRequestId: search.serviceRequestId};
    } 

    showcauseResponse = await ShowCauseService.search(tenantId, showcauseFilters);
    if (showcauseResponse?.showcauseList.length > 0) {
      showcauseResponse.showcauseList.forEach((service) =>serviceIds.push(service.serviceRequestId));
      const serviceIdParams = serviceIds.join();
      complaintDetailsResponse = await PGRService.search(tenantId, {}, serviceIdParams);
      const serviceDefs = await MdmsService.getServiceDefs(tenantId, "PGR");
      combinedRes = combineResponses({
        complaintDetailsResponse,
        workflowInstances: showcauseResponse,
        serviceDefs,
        type: "showcause",
      });
    }
    return {complaints:combinedRes, totalCount: showCauses?.totalCount};
  };

  const result = useQuery(["fetchShowCauseData", 
  ...Object.keys(searchParams).map(i =>
      typeof searchParams[i] === "object" ? Object.keys(searchParams[i]).map(e => searchParams[i][e]) : searchParams[i]
     )],
     fetchShowCauseData,
  { staleTime: Infinity, enabled}
  );
  return { ...result, revalidate: () => client.refetchQueries(["fetchShowCauseData"]) };
};

export default useShowCauseData;
