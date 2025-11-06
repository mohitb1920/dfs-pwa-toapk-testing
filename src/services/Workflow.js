import { PersistantStorage } from "../Utils/LocalStorage";
import { urls } from "../Utils/Urls";
import { ConvertTimestampToDate } from "../components/Utils";
import { Request } from "./Request";

export const getTimeline = (processInstances) => {
  let timeline = processInstances.map((instance, ind) => {
    let checkPoint = {
      performedAction: instance.action,
      status: instance.state.applicationStatus,
      state: instance.state.state,
      assigner: instance?.assigner,
      rating: instance?.rating,
      wfComment: instance?.comment,
      wfDocuments: instance?.documents,
      assignes: instance.assignes,
      caption: instance.assignes
        ? instance.assignes.map((assignee) => ({
            name: assignee.name,
            mobileNumber: assignee.mobileNumber,
          }))
        : null,
      auditDetails: {
        created: ConvertTimestampToDate(
          instance.auditDetails.createdTime
        ),
        lastModified: ConvertTimestampToDate(
          instance.auditDetails.lastModifiedTime
        ),
        createdEpoch: instance.auditDetails.createdTime,
        lastModifiedEpoch: instance.auditDetails.lastModifiedTime,
      },
      timeLineActions: instance.nextActions
        ? instance.nextActions
            .filter((action) => action.roles.includes("EMPLOYEE"))
            .map((action) => action?.action)
        : null,
    };
    return checkPoint;
  });

  return timeline;
};

export const WorkflowService = {
  init: async (stateCode, businessServices) => {
    const key = `${stateCode}.${businessServices}`;
    const inStoreValue = PersistantStorage.get(key);
    if (inStoreValue) {
      return inStoreValue;
    }
    const response = await Request({
      url: urls.WorkFlow,
      useCache: true,
      method: "POST",
      params: { tenantId: stateCode, businessServices },
      auth: true,
    });
    if(response?.status === 200) {
      PersistantStorage.set(key, response?.data, 86400);
    }
    const returnData = response?.data || {};
    return returnData;
  },

  getByBusinessId: async (
    stateCode,
    businessIds,
    params = {},
    history = true
  ) => {
    const response = await Request({
      url: urls.WorkFlowProcessSearch,
      useCache: false,
      method: "POST",
      params: {
        tenantId: stateCode,
        businessIds: businessIds,
        ...params,
        history,
      },
      auth: true,
    });

    const returnData = response?.data || {};
    return returnData;
  },

  getDetailsById: async ({ tenantId, id, moduleCode }) => {
    const workflow = await WorkflowService.getByBusinessId(tenantId, id);
    const businessServiceResponse = (
      await WorkflowService.init(tenantId, moduleCode)
    )?.BusinessServices[0]?.states;
    if (workflow?.ProcessInstances) {
      const processInstances = workflow.ProcessInstances;
      const nextStates = processInstances[0]?.nextActions.map((action) => ({
        action: action?.action,
        nextState: processInstances[0]?.state.uuid,
      }));
      const nextActions = nextStates.map((id) => ({
        action: id.action,
        state: businessServiceResponse?.find(
          (state) => state.uuid === id.nextState
        ),
      }));

      const actionRolePair = nextActions?.map((action) => ({
        action: action?.action,
        roles: action.state?.actions?.map((action) => action.roles).join(","),
      }));

      if (processInstances.length > 0) {
        const timeline = getTimeline(processInstances);
        const nextActions = actionRolePair;

        const details = {
          timeline,
          nextActions,
          processInstances: workflow?.ProcessInstances,
        };
        return details;
      }
    } else {
      throw new Error("error fetching workflow services");
    }
    return {};
  },

  getDetailsByIdV2: async ({ tenantId, id }) => {
    const workflow = await WorkflowService.getByBusinessId(tenantId, id);
    if (workflow?.ProcessInstances) {
      const processInstances = workflow.ProcessInstances;
      return processInstances;
    }
    return [];
  },

  getResolvedByBusinessId: async (
    stateCode,
    params = {},
    history = true
  ) => {
    const response = await Request({
      url: urls.resolvedWorkFlowProcessSearch,
      useCache: false,
      method: "POST",
      params: {
        tenantId: stateCode,
        ...params,
        history,
      },
      auth: true,
    });

    const returnData = response?.data || {};
    return returnData;
  },
};
