import { getUserRoles } from "../../components/Utils";

export const L1_USER_ROLES = ["AC", "BHO", "TIRO"];
export const L2_USER_ROLES = ["BAO", "ADH"];
export const L3_USER_ROLES = ["DAO"];
export const L4_USER_ROLES = ["JD"];
export const SAO_USER_ROLES = ["SAO"];
export const KCC_USER_ROLES = ["KCC"];

const L1_KCC_STATUS = { pending: "PENDINGATL1", resolved: "RESOLVEDATL1" };

const roleMappings = [
  {
    roles: L1_USER_ROLES,
    status: L1_KCC_STATUS,
  },
  {
    roles: L2_USER_ROLES,
    status: { pending: "PENDINGATL2", resolved: "RESOLVEDATL2" },
  },
  {
    roles: L3_USER_ROLES,
    status: { pending: "PENDINGATL3", resolved: "RESOLVEDATL3" },
  },
  {
    roles: L4_USER_ROLES,
    status: { pending: "PENDINGATL4", resolved: "RESOLVEDATJD" },
  },
  {
    roles: SAO_USER_ROLES,
    status: {
      pending: "CLOSEDAFTERRESOLUTION",
      resolved: "CLOSEDAFTERVERIFICATION",
    },
  },
  {
    roles: KCC_USER_ROLES,
    status: L1_KCC_STATUS,
  },
];

export const getUserStatusFilters = () => {
  const userRoles = getUserRoles();

  for (const mapping of roleMappings) {
    if (userRoles && userRoles.some((item) => mapping.roles.includes(item))) {
      return mapping.status;
    }
  }

  return {}; // Return an empty object or appropriate default value if no roles match
};

export const getUserShowcauseFilters = () => {
  const userRoles = getUserRoles();
  const L1userRole = userRoles.filter((role) => L1_USER_ROLES.includes(role));
  const JDuserRole = userRoles.filter((role) => L4_USER_ROLES.includes(role));
  if (L1userRole.length === 1 && JDuserRole.length === 0) {
    return { issuedTo: "GRM_ISSUED_TO_ME" };
  }
  if (JDuserRole.length === 1 && L1userRole.length === 0) {
    return { issuedBy: "GRM_ISSUED_BY_ME" };
  }
  return { issuedTo: "GRM_ISSUED_TO_ME", issuedBy: "GRM_ISSUED_BY_ME" };
};

export const userSpecificParameters = (userInfo) => {
  const userRoles = getUserRoles();
  const L1userRole = userRoles.some((role) => L1_USER_ROLES.includes(role));
  const KCCUserRole = userRoles.some((role) => KCC_USER_ROLES.includes(role));
  const isSaoUser = localStorage.getItem("DfsWeb.isSaoUser") === "true";

  const baseParams = {
    pending: { assignee: userInfo?.uuid, history: false },
    resolved: { assigner: userInfo?.uuid, action: "RESOLVE" },
  };
  if (L1userRole) {
    return {
      additionalFilters: [
        {
          key: "RESOLVE",
          value: "GRM_RESOLVED_BY_ME",
        },
        { key: "KCC", value: "GRM_RESOLVED_BY_KCC", status: "RES-KCC" },
      ],
      wfParams: {
        ...baseParams,
        resByKcc: {
          assignee: userInfo?.uuid,
          action: "RESOLVE-KCC",
          resolvedByOther: true,
        },
      },
    };
  }
  if (KCCUserRole) {
    return {
      additionalFilters: [
        {
          key: "RESOLVE",
          value: "GRM_RESOLVED_BY_ME",
        },
        {
          key: "KCC",
          value: "GRM_RESOLVED_BY_OTHERS",
          status: "RES-KCC",
        },
      ],
      wfParams: {
        pending: { history: false },
        resolved: { action: "RESOLVE-KCC" },
        resByKcc: { action: "RESOLVE" },
        isKccUser: true,
      },
    };
  }
  if (isSaoUser) {
    return {
      additionalFilters: [{ key: "VERIFICATION", value: "GRM_VERIFIED" }],
      wfParams: {
        ...baseParams,
        resolved: { assigner: userInfo?.uuid, action: "VERIFY" },
      },
    };
  }

  return {
    additionalFilters: [{ key: "RESOLVE", value: "GRM_RESOLVED" }],
    wfParams: baseParams,
  };
};

export const pgrTableColumnHeaders = (status) => [
  {
    name: "GRM_TICKET_NUMBER",
    align: "center",
  },
  {
    name: "GRM_GRIEVANCE_SUBJECT",
    align: "left",
  },
  {
    name: `GRM_TICKET_RAISED_DATE_${status}`,
    align: "center",
    condition: "assigned",
  },
  {
    name: "GRM_TICKET_ISSUED_DATE",
    align: "center",
    condition: "showcause",
  },
  {
    name: "GRM_SLA_DAYS",
    align: "center",
    condition: "sla",
  },
  {
    name: "GRM_DUE_DATE",
    align: "center",
    condition: "showcause",
  },
  // {
  //   name: "Resolution Date",
  //   align: "center",
  // },
  {
    name: "GRM_CURRENT_STATUS",
    align: "center",
  },
  {
    name: "GRM_ACTIONS",
    align: "center",
    width: "160px",
    noBorder: true,
  },
];
