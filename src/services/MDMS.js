import { PersistantStorage } from "../Utils/LocalStorage";
import { urls } from "../Utils/Urls";
import { Request } from "./Request";

const GetServiceDefs = (MdmsRes, moduleCode) =>
  MdmsRes[`RAINMAKER-${moduleCode}`].ServiceDefs.filter((def) => def.active);

const transformResponse = (type, MdmsRes, moduleCode) => {
  switch (type) {
    case "serviceDefs":
      return GetServiceDefs(MdmsRes, moduleCode);
    default:
      return MdmsRes;
  }
};

const getModuleServiceDefsCriteria = (tenantId, moduleCode) => ({
  type: "serviceDefs",
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: `RAINMAKER-${moduleCode}`,
        masterDetails: [
          {
            name: "ServiceDefs",
          },
        ],
      },
    ],
  },
});

const getMdmsRequestBody = (tenantId, moduleName, masterName, filter) => ({
  MdmsCriteria: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: moduleName,
        masterDetails: [
          {
            name: masterName,
            ...(filter !== null && { filter: filter }),
          },
        ],
      },
    ],
  },
});

const getTechSupportCriteria = (tenantId, moduleCode) => ({
  type: "SupportCategories",
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: `RAINMAKER-${moduleCode}`,
        masterDetails: [
          {
            name: "ServiceDefs",
            filter: "[?(@.workflow=='GRM9')]",
          },
        ],
      },
    ],
  },
});

const getModuleSchemesDefsCriteria = (tenantId, moduleCode, schemeId) => ({
  type: "schemesDefs",
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: "schemes-list-updated",
        masterDetails: [
          {
            name: "schemes-description",
            filter: schemeId ? `[?(@['id'] == '${schemeId}')]` : undefined,
          },
        ],
      },
    ],
  },
});

const getSpecificSchemesDefsCriteria = (tenantId, moduleCode, schemeId) => ({
  type: "schemesDefs",
  details: {
    tenantId: tenantId,
    moduleDetails: [
      {
        moduleName: "scheme-dynamic-form-jsons",
        masterDetails: [
          {
            name: schemeId,
          },
        ],
      },
    ],
  },
});

const getCriteria = (tenantId, moduleDetails) => {
  return {
    MdmsCriteria: {
      tenantId,
      ...moduleDetails,
    },
  };
};

const initRequestBody = {
  type: "ReleaseInfo",
  details: {
    moduleDetails: [
      {
        moduleName: "common-masters",
        masterDetails: [{ name: "ReleaseInfo" }],
      },
      {
        moduleName: "seed-sub-schemes-en",
        masterDetails: [{ name: "SeedSubSchemes" }],
      },
    ],
  },
};

export const MdmsService = {
  call: async ({ tenantId, details, useOldMdms }) => {
    return Request({
      url: useOldMdms ? urls.egov_mdms : urls.MDMS,
      data: getCriteria(tenantId, details),
      useCache: true,
      params: { tenantId },
    });
  },
  mdmsCall: async (tenantId, moduleName, masterName, filter) => {
    return Request({
      url: urls.MDMS,
      data: getMdmsRequestBody(tenantId, moduleName, masterName, filter),
      useCache: true,
      params: { tenantId },
    });
  },

  schemecall: async (tenantId, details) => {
    return Request({
      url: urls.SchemesDetailInfo,
      data: getCriteria(tenantId, details),
      useCache: true,
      params: { tenantId },
    });
  },

  getDataByCriteria: async (
    tenantId,
    mdmsDetails,
    moduleCode,
    useOldMdms = false
  ) => {
    const key = `MDMS.${tenantId}.${moduleCode}.${
      mdmsDetails.type
    }.${JSON.stringify(mdmsDetails.details)}`;
    const inStoreValue = PersistantStorage.get(key);
    if (inStoreValue) {
      return inStoreValue;
    }
    let response, responseValue;
    if (mdmsDetails.details === "allDetails") {
      response = await MdmsService.schemecall(tenantId);
      responseValue = response.data;
    } else {
      response = await MdmsService.call({
        tenantId,
        details: mdmsDetails.details,
        useOldMdms,
      });
      const { MdmsRes } = response.data;
      responseValue = transformResponse(
        mdmsDetails.type,
        MdmsRes,
        moduleCode.toUpperCase()
      );
    }
    if (response.status == 200)
      // const cacheSetting = getCacheSetting(mdmsDetails.details.moduleDetails[0].moduleName);
      PersistantStorage.set(key, responseValue, 86400);
    return responseValue;
  },

  getInitData: (tenantId) => {
    return MdmsService.getDataByCriteria(tenantId, initRequestBody, "mdmsInit");
  },

  getServiceDefs: (tenantId, moduleCode) => {
    return MdmsService.getDataByCriteria(
      tenantId,
      getModuleServiceDefsCriteria(tenantId, moduleCode),
      moduleCode
    );
  },
  getTechSupportDropdownOptions: (tenantId, moduleCode) => {
    return MdmsService.getDataByCriteria(
      tenantId,
      getTechSupportCriteria(tenantId, moduleCode),
      moduleCode
    );
  },
  getSchemesDefs: (tenantId, moduleCode, schemeId) => {
    return MdmsService.getDataByCriteria(
      tenantId,
      getModuleSchemesDefsCriteria(tenantId, moduleCode, schemeId),
      moduleCode
    );
  },
  getSchemesDetails: (tenantId, moduleCode) => {
    return MdmsService.getDataByCriteria(
      tenantId,
      { type: "schemeDetails", details: "allDetails" },
      moduleCode
    );
  },

  getSpecificSchemeDefs: ({
    tenantId,
    moduleCode,
    schemeId,
    useOldMdms = true,
  }) => {
    return MdmsService.getDataByCriteria(
      tenantId,
      getSpecificSchemesDefsCriteria(tenantId, moduleCode, schemeId),
      moduleCode,
      useOldMdms
    );
  },
};
