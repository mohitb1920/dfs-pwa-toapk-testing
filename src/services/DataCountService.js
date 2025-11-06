import { PersistantStorage } from "../Utils/LocalStorage";
import { urls } from "../Utils/Urls";
import { Request } from "./Request";

const getReportRequestBody = ({ tenantId, operator, field, value, index }) => {
  const requestBody = { index: index, tenantId: tenantId };

  if (field) {
    requestBody.filters = [
      {
        operator: operator,
        field: field,
        value: [value],
      },
    ];
  }

  return requestBody;
};

export const DataCountService = {
  call: async ({ tenantId, operator, field, value, indexName }) => {
    return Request({
      url: urls.dataUrl,
      data: getReportRequestBody({
        tenantId: tenantId,
        operator: operator,
        field: field,
        value: value,
        index: indexName,
      }),
      useCache: true,
      params: { tenantId },
    });
  },
};
