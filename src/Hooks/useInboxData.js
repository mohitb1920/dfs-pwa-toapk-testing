import { useQuery, useQueryClient } from "react-query";
import { WorkflowService } from "../services/Workflow";
import { PGRService } from "../services/PGR";
import { MdmsService } from "../services/MDMS";
import { ConvertTimestampToDate, commonResolvedSubstring } from "../components/Utils";

const useInboxData = (searchParams, enabled, isSaoUser, userStatusFilters, userParams) => {
  const client = useQueryClient();

  const fetchInboxData = async () => {
    const tenantId = 'br';
    let serviceIds = [];
    const { limit, offset, applicationStatus, sortOrder} = searchParams;
    const { assignee } = searchParams.filters.wfQuery;
    let appFilters = { ...searchParams.search, sortOrder, sortBy: 'serviceRequestId'};
    let wfFilters = {
      assignee,
      limit,
      offset,
      sortOrder,
      ...searchParams.customFilters,
    };
    let complaintDetailsResponse = null;
    let combinedRes = [];
    let workflowInstances = null;
    let serviceIdParams = '';
    const isKccuser = userParams?.wfParams?.isKccUser ?? false;

    const isKcc = applicationStatus.includes("KCC");
      const isResolved = ["KCC", "VERIFICATION", commonResolvedSubstring].some(
        (status) => applicationStatus.includes(status)
      );

      if (isKccuser) {
        const businessServiceResponse = (
          await WorkflowService.init(tenantId, "GRM1,GRM2")
        )?.BusinessServices;

        const status = isResolved ? userStatusFilters.resolved : userStatusFilters.pending;
        wfFilters.status = businessServiceResponse
          ?.map(
            (service, index) =>
              service?.states?.find(
                (item) => item.state === status
              )?.uuid
          )
          .filter(Boolean) // Removes undefined/null values
          .join(",");

        delete wfFilters.assignee;
      }

    if( appFilters?.serviceRequestId ) {
      complaintDetailsResponse = await PGRService.search(tenantId, appFilters);
      if (complaintDetailsResponse?.ServiceWrappers.length > 0) {
        const { ServiceWrappers } = complaintDetailsResponse;
        const workFlowResponse = await WorkflowService.getByBusinessId(tenantId, appFilters?.serviceRequestId, wfFilters, true);
        const instances = workFlowResponse?.ProcessInstances ?? [];
        if(instances.length > 1) {
          workflowInstances = {ProcessInstances: [instances[0]]}
        } else {
          workflowInstances = workFlowResponse;
        }
        const ticketStatus = ServiceWrappers[0].service.applicationStatus
        const pendingTicket = ticketStatus.includes("PENDING");
        const isDifferentAssigner = ServiceWrappers[0].workflow.assignes?.[0] !== assignee;
        if (
          applicationStatus === userStatusFilters.pending &&
          ((!isKccuser && (!pendingTicket || isDifferentAssigner)) ||
            (isKccuser && ticketStatus !== "PENDINGATL1"))
        ) {
          workflowInstances = {};
        } else if (
          applicationStatus === userStatusFilters.resolved &&
          pendingTicket &&
          !isDifferentAssigner
        ) {
          workflowInstances = {};
        }
      }
    } else {
      if (isResolved) {
        delete wfFilters.assignee;
        delete wfFilters.slaDaysLeft;
        const filterType = isKcc ? "resByKcc" : "resolved";
        const filters = { ...wfFilters, ...userParams.wfParams[filterType] };
        workflowInstances = await WorkflowService.getResolvedByBusinessId(
          tenantId,
          filters
        );
      } else {
        workflowInstances = await WorkflowService.getResolvedByBusinessId(
          tenantId,
          wfFilters,
          false
        );
      }
      if (workflowInstances?.ProcessInstances.length) {
        workflowInstances.ProcessInstances.forEach((instance) => serviceIds.push(instance.businessId));
        serviceIdParams = serviceIds.join();
        complaintDetailsResponse = await PGRService.search(tenantId , appFilters, serviceIdParams);
      }
    }
    if (workflowInstances?.ProcessInstances?.length) {
      const serviceDefs = await MdmsService.getServiceDefs(tenantId, "PGR");
      combinedRes = combineResponses({
        complaintDetailsResponse,
        workflowInstances,
        serviceDefs,
        type: "assigned",
      }).map((data) => ({
        ...data,
        sla: Math.round(data.sla / (24 * 60 * 60 * 1000)),
      }));
    }
    return {complaints:combinedRes, totalCount: workflowInstances?.totalCount};
  };

  const result = useQuery(["fetchInboxData", 
  ...Object.keys(searchParams).map(i =>
      typeof searchParams[i] === "object" ? Object.keys(searchParams[i]).map(e => searchParams[i][e]) : searchParams[i]
     )],
  fetchInboxData,
  { staleTime: Infinity, enabled}
  );
  return { ...result, revalidate: () => client.refetchQueries(["fetchInboxData"]) };
};

const mapComplaintBybusinessId = (complaints) => {
  return complaints.reduce((object, item) => {
    return { ...object, [item.service["serviceRequestId"]]: item?.service };
  }, {});
};

const mapNameByServiceCode = (serviceDefs) => {
  return serviceDefs.reduce((object, item) => {
    return { ...object, [item["serviceCode"]]: item };
  }, {});
}

export default useInboxData;

export const combineResponses = ({complaintDetailsResponse, workflowInstances, serviceDefs, type}) => {
  let complaintMap = mapComplaintBybusinessId(complaintDetailsResponse.ServiceWrappers);
  const serviceDefsMap = mapNameByServiceCode(serviceDefs);
  const isAssigned =  type === "assigned";
  const ProcessInstances = isAssigned
    ? workflowInstances.ProcessInstances
    : workflowInstances?.showcauseList;

  return ProcessInstances.map((workflow) => {
    const serviceRequestId = isAssigned ? workflow.businessId : workflow.serviceRequestId;
    const complaint = complaintMap[serviceRequestId];
    const serviceDef = serviceDefsMap[complaint?.serviceCode];
    return {
      serviceRequestId,
      complaintSubType: serviceDef?.name || complaint?.serviceCode,
      status: isAssigned ? complaint?.applicationStatus : workflow?.status,
      sla: isAssigned
        ? workflow?.stateSla
        : workflow?.showcauseContent?.responseDueDate,
      createdDate: ConvertTimestampToDate(workflow?.auditDetails?.createdTime),
      resolvedOn: ConvertTimestampToDate(
        complaint?.auditDetails?.lastModifiedTime
      ),
    };
  });
};
