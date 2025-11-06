import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import {
  addMonths,
  endOfToday,
  format,
  startOfYear,
  subYears,
  toDate,
} from "date-fns";
import { urls } from "../Utils/Urls";
import { PersistantStorage } from "../Utils/LocalStorage";
import { days } from "../constants";
import moment from "moment/moment";

export const TENANT_ID = "br";
const BASE_URL = window.location.origin;

export const getCurrentLanguage = () => {
  return PersistantStorage.get("WebApp.Employee.locale");
};

export const useStyles = makeStyles((theme) => ({
  navBarIcon: {
    borderRadius: "0% !important",
    height: "30px !important",
    width: "30px !important",
  },
  filterIcon: {
    height: "18px !important",
    width: "24px !important",
    borderRadius: "0% !important",
    cursor: "pointer",
  },
}));

export const dispatchNotification = (type, message, dispatch) => {
  dispatch({
    type: "SHOW_NOTIFICATION",
    data: {
      open: true,
      type: type,
      message: message,
      position: { vertical: "bottom", horizontal: "center" },
    },
  });
};

export const extractSchemas = (schema, steps) => {
  const schemas = [];
  if (!schema.properties) {
    return schemas;
  }
  for (const key in schema.properties) {
    const property = schema.properties[key];
    if (property.type === "object" && property.properties) {
      steps.push(property.title);
      schemas.push(property);
    }
  }
  return schemas;
};

export const extractSchemasTest = (schema, steps, applicationType) => {
  const schemas = [];
  if (!schema || !schema.properties) {
    return schemas;
  }
  for (const key in schema.properties) {
    const property = schema.properties[key];
    // if (property.type === "object" && property.properties) {

    if (
      applicationType &&
      applicationType.length > 0 &&
      property.subType &&
      applicationType !== property.subType
    )
      continue;
    if (property.properties) {
      steps.push(key);
      schemas.push(property);
    }
  }
  return schemas;
};

export const mainextractSchemas = (schema, applicationType, steps) => {
  const schemas = [];
  if (!schema || !schema.properties) {
    return schemas;
  }

  const getMapperType = (type) => {
    if (type === "Group" || type === "समूह") return "Group";
    if (type === "Individual" || type === "व्यक्ति") return "Individual";
    return type;
  };

  for (const key in schema.properties) {
    const property = schema.properties[key];
    if (!steps) return property;
    const mappedApplicationType = getMapperType(applicationType);
    const mappedSubType = getMapperType(property.subType);
    if (
      applicationType &&
      applicationType.length > 0 &&
      property.subType &&
      mappedApplicationType !== mappedSubType
    ) {
      continue;
    } else if (property.properties) {
      schemas.push(property);
      steps.push(key);
    }
  }
  return schemas;
};

export const ColorButton = styled(Button)((props) => ({
  fontSize: "15px",
  fontWeight: "700",
  textTransform: "none",
  borderRadius: "25px",
  color: props?.color || "#fff",
  backgroundColor: props.bgcolor,
  "&:hover": {
    backgroundColor: props.hoverbgcolor,
    color: props?.color || "#fff",
  },
}));

export const ConvertTimestampToDate = (
  timestamp,
  dateFormat = "d-MMM-yyyy"
) => {
  return timestamp ? format(toDate(timestamp), dateFormat) : null;
};

export const ConvertTimestampToDateTime = (
  timestamp,
  dateFormat = "d-MMM-yyyy hh:mm a"
) => {
  return timestamp ? format(toDate(timestamp), dateFormat) : null;
};

export const ExtractYear = (timestamp) => {
  const date = new Date(timestamp);
  let year = "--";
  if (date) year = date.getFullYear();
  return year;
};
export const TransformArrayToObj = (traslationList) => {
  return traslationList.reduce(
    (obj, item) => ((obj[item.code] = item.message), obj),
    {}
  );
};

export const fileUrl = (fileStoreId) =>
  `${BASE_URL}${urls.FileFetch}?tenantId=br&fileStoreId=${fileStoreId}`;

export const getUserRoles = () => {
  const userInfoString = localStorage.getItem("DfsWeb.user-info");
  const userInfo = JSON.parse(userInfoString);
  const userRoles = userInfo?.roles?.map((roleData) => roleData?.code);
  return userRoles;
};

export const announcementsAccess = () => {
  const userRoles = getUserRoles();
  const announcementRoles = ["ANNOUNCEMENT_ADMIN"];
  const ANNOUNCEMENT_ACCESS = userRoles?.filter((role) =>
    announcementRoles.includes(role)
  );
  return ANNOUNCEMENT_ACCESS?.length > 0;
};

export const dashboardAccess = () => {
  const userRoles = getUserRoles();
  const dashboardRoles = ["STADMIN"];
  const dashboardAccessRoles = userRoles?.filter((role) =>
    dashboardRoles.includes(role)
  );
  return dashboardAccessRoles?.length > 0;
};

export const dataReviewAdmin = () => {
  const userRoles = getUserRoles();
  const dataReviewRoles = ["DATA_REVIEW_ADMIN"];
  const dataReviewAccessRoles = userRoles?.filter((role) =>
    dataReviewRoles.includes(role)
  );
  return dataReviewAccessRoles?.length > 0;
};

export const pgrRoles = [
  "AC",
  "BAO",
  "DAO",
  "JD",
  "ADH",
  "BHO",
  "SAO",
  "TIRO",
  "KCC",
];
export const assistedModeRoles = ["ASSISTEDMODE_AGENT"];

export const grmAccess = () => {
  const userRoles = getUserRoles();
  const PGR_ACCESS = userRoles?.filter((role) => pgrRoles.includes(role));
  return PGR_ACCESS?.length > 0;
};

export const kccUser = () => {
  const userRoles = getUserRoles();
  const kccRoles = ["KCC"];
  const KCC_ACCESS = userRoles?.filter((role) => kccRoles.includes(role));
  return KCC_ACCESS?.length > 0;
};

export const citizenAccess = () => {
  return localStorage.getItem("DfsWeb.isCitizenUser") === "true";
}

export const agentAccess = () => {
  const userRoles = getUserRoles();
  const ASSISTED_MODE = userRoles?.filter((role) =>
    assistedModeRoles.includes(role)
  );
  return ASSISTED_MODE?.length > 0;
};

const removeOtherModules = (modules, titlesToRemove) =>
  modules.filter(
    (obj) => !titlesToRemove.includes(obj.title) && obj.path !== null
  );

const OtherModuleTitles = [
  "DFSWEB_SCHEMES",
  "DFSWEB_HELP",
  "DFSWEB_GRM9",
  "DFSWEB_ASSETS",
  "DFSWEB_MANDIPRICE",
  "DFSWEB_FAQs",
];

export const getRoleBasedModules = () => {
  let userModules = [
    { title: "DFSWEB_HOME", path: `${window.contextPath}/home` },
    { title: "DFSWEB_About", path: null, key: "#about-home" },
    {
      title: "DFSWEB_ASSETS",
      path: `${window.contextPath}/assets-section`,
    },
    {
      title: "DFSWEB_SCHEMES",
      isMenu: true,
      menuItems: [
        { title: "DFSWEB_SCHEMES", path: `${window.contextPath}/schemes` },
      ],
    },
    {
      title: "DFSWEB_MANDIPRICE",
      path: `${window.contextPath}/mandi`,
    },
    { title: "DFSWEB_FAQs", path: `${window.contextPath}/faq` },
    {
      title: "DFSWEB_HELP",
      path: `${window.contextPath}/help`,
    },
    // {
    //   title: "DFSWEB_GRM9",
    //   path: `${window.contextPath}/technical-support/report-track-issue`,
    // },
    //
  ];

  if (announcementsAccess()) {
    userModules = removeOtherModules(userModules, OtherModuleTitles);
    userModules.push({
      title: "DFSWEB_CAROUSEL",
      description: "DFSWEB_ANC_DESC",
      path: `${window.contextPath}/carousel-management`,
      icon: "CarouselIcon",
      card: true,
    });
  }

  if (dashboardAccess()) {
    userModules = removeOtherModules(userModules, OtherModuleTitles);
    userModules.push({
      title: "DFSWEB_DASHBOARD",
      description: "DFSWEB_DASHBOARD_DESC",
      path: `${window.contextPath}/dashboards/farmersDashboard`,
      icon: "GRMIcon",
      card: true,
      isMenu: true,
      menuItems: [
        {
          title: "farmersDashboard",
          path: `${window.contextPath}/dashboards/farmersDashboard`,
        },
        {
          title: "schemesApplications",
          path: `${window.contextPath}/dashboards/schemesApplications`,
        },
        {
          title: "grmDashboard",
          path: `${window.contextPath}/dashboards/grievanceManagement-web`,
        },
      ],
    });
  }

  if (dataReviewAdmin()) {
    userModules = removeOtherModules(userModules, OtherModuleTitles);
    userModules.push({
      title: "DFSWEB_DATA_REVIEW",
      description: "DFSWEB_DATA_REVIEW_DESC",
      path: `${window.contextPath}/data-cleanup`,
      icon: "GRMIcon",
      card: true,
    });
  }

  if (grmAccess()) {
    const isKccUser = kccUser();
    const modulesToRemove = isKccUser
      ? ["DFSWEB_SCHEMES", "DFSWEB_FAQs"]
      : OtherModuleTitles;
    userModules = removeOtherModules(userModules, modulesToRemove);
    userModules.push({
      title: "DFSWEB_GRM",
      description: "DFSWEB_GRM_DESCR",
      path: `${window.contextPath}/grm/inbox`,
      icon: "GRMIcon",
      card: true,
    });
  }

  if(citizenAccess()) {
    userModules = removeOtherModules(userModules, ["DFSWEB_About","DFSWEB_FAQs"])
  }

  if (agentAccess()) {
    userModules = userModules.filter((obj) => obj.path !== null);
    userModules = userModules.filter(
      (obj) => obj.title !== "DFSWEB_GRM9" && obj.title !== "DFSWEB_FAQs"
    );
    const newItem = {
      title: "FARMER_PASSBOOK",
      path: `${window.contextPath}/agent-access`,
    };
    const soilItem = {
      title: "Soil_health",
      path: `${window.contextPath}/farmer-details`,
    };
    userModules = userModules.map((module) => {
      if (module.title === "DFSWEB_SCHEMES") {
        return {
          ...module,
          menuItems: [...module.menuItems, newItem], // Add the new item
        };
      }
      return module;
    });
    let agriAdvisory = {
      title: "agriAdvisory",
      isMenu: true,
      menuItems: [
        {
          title: "Soil_health",
          path: `${window.contextPath}/farmer-details`,
        },
      ],
    };
    // Find the index of DFSWEB_SCHEMES
    let index = userModules.findIndex(
      (item) => item.title === "DFSWEB_SCHEMES"
    );

    // Insert the new item after DFSWEB_SCHEMES
    if (index !== -1) {
      userModules.splice(index + 1, 0, agriAdvisory);
    }
    userModules.push(
      ...[
        {
          title: "DFSWEB_DFS_REGISTRATION",
          description: "Fill Farmer Registration Form here",
          path: `${window.contextPath}/registration`,
        },
        {
          title: "DFSWEB_GRM",
          description: "DFSWEB_GRM_DESCR",
          path: `${window.contextPath}/grm-create`,
          icon: "GRMIcon",
        },
        {
          title: "DFSWEB_TRACK",
          description: "DFSWEB_GRM_DESCR",
          path: `${window.contextPath}/track`,
        },
        {
          title: "DFSWEB_HISTORY",
          description: "",
          path: `${window.contextPath}/history`,
        },
      ]
    );
  }

  return userModules;
};
export const getRoleBasedFooterLinks = () => {
  const userModules = [
    {
      header: "ImportantLinks",
      list: [
        {
          title: "DFSWEB_ASSETS",
          description: "",
          path: `${window.contextPath}/assets-section`,
          image: "Assets",
        },
        {
          title: "DFSWEB_SCHEMES",
          description: "",
          path: `${window.contextPath}/schemes`,
          image: "Schemes",
        },
        {
          title: "DFSWEB_MANDIPRICE",
          description: "",
          path: `${window.contextPath}/mandi`,
          image: "MandiPrice",
        },
        {
          title: "DFSWEB_HELP",
          description: "",
          path: `${window.contextPath}/help`,
          image: "Help",
        },
      ],
    },
    {
      header: "OtherImportantLinks",
      list: [
        {
          title: "DBTPortal",
          description: "",
          link: `https://dbtagriculture.bihar.gov.in/`,
          image: "Help",
        },
        {
          title: "BiharSeedCertificationAgency",
          description: "",
          link: `https://bssca.co.in/`,
          image: "Help",
        },
        {
          title: "BAVAS",
          description: "",
          link: `https://bavas.bihar.gov.in/`,
          image: "Help",
        },
        {
          title: "DirectorateofHorticulture",
          description: "",
          link: `https://bavas.bihar.gov.in/`,
          image: "Help",
        },
        {
          title: "KisanCallCentrePortal",
          description: "",
          link: `https://www.manage.gov.in/kcc/kcc.asp#:~:text=1800%2D180%2D1551)`,
          image: "Help",
        },
      ],
    },
    {
      header: "ContactInformation",
      list: [
        {
          title: "BiharKrishiSupport",
          description: "",
          contact: "support.biharkrishi@bihar.gov.in",
          image: "Help",
          icon: "EmailIcon",
        },
        {
          title: "KisanCallCentre",
          description: "",
          contact: "1800-180-1551",
          icon: "PhoneIcon",
        },
      ],
    },
  ];

  if (agentAccess()) {
    userModules[0]["list"].push(
      ...[
        {
          title: "DFSWEB_DFS_REGISTRATION",
          description: "Fill Farmer Registration Form here",
          path: `${window.contextPath}/registration`,
        },
        {
          title: "DFSWEB_GRM",
          description: "DFSWEB_GRM_DESCR",
          path: `${window.contextPath}/grm-create`,
          icon: "GRMIcon",
        },
        {
          title: "DFSWEB_TRACK",
          description: "DFSWEB_GRM_DESCR",
          path: `${window.contextPath}/track`,
        },
        {
          title: "DFSWEB_HISTORY",
          description: "",
          path: `${window.contextPath}/history`,
        },
      ]
    );
  }
  if (announcementsAccess()) {
    userModules[0]["list"] = userModules[0]["list"].filter(
      (obj) =>
        obj.title !== "DFSWEB_SCHEMES" &&
        obj.title !== "DFSWEB_HELP" &&
        obj.title !== "DFSWEB_GRM9" &&
        obj.title !== "DFSWEB_MANDIPRICE" &&
        obj.title !== "DFSWEB_ASSETS" &&
        obj.title !== "DFSWEB_FAQs"
    );

    userModules[0]["list"].push({
      title: "DFSWEB_CAROUSEL",
      description: "DFSWEB_ANC_DESC",
      path: `${window.contextPath}/carousel-management`,
      icon: "CarouselIcon",
      card: true,
    });
  }
  if (grmAccess()) {
    const isKccUser = kccUser();
    const excludedTitles = isKccUser
      ? ["DFSWEB_SCHEMES"]
      : [
          "DFSWEB_SCHEMES",
          "DFSWEB_HELP",
          "DFSWEB_MANDIPRICE",
          "DFSWEB_GRM9",
          "DFSWEB_ASSETS",
        ];
    userModules[0].list = userModules[0].list.filter(
      (obj) => !excludedTitles.includes(obj.title)
    );
    userModules[0]["list"].push({
      title: "DFSWEB_GRM",
      description: "DFSWEB_GRM_DESCR",
      path: `${window.contextPath}/grm/inbox`,
      icon: "GRMIcon",
      card: true,
    });
  }
  userModules[0]["list"].push({
    title: "Privacy_policy",
    description: "",
    path: `${window.contextPath}/privacypolicy`,
    image: "privacypolicy",
  });

  return userModules;
};

export const commonResolvedSubstring = "RESOLVE";

export const menuList = [
  {
    name: "Home",
    path: "/home",
    icon: "Home",
    position: "left",
    image: "Dashboard",
  },
  {
    name: "Schemes",
    path: "/schemes",
    icon: "Home",
    position: "center",
    image: "Schemes",
  },
  {
    name: "Advisory",
    path: "/advisory",
    icon: "Home",
    position: "right",
    image: "cardbg",
  },
  {
    name: "Marketplace",
    path: "/marketplace",
    icon: "Home",
    position: "left",
    image: "cardbg",
  },
  {
    name: "Grievance",
    path: "/grievance",
    icon: "Home",
    position: "center",
    image: "cardbg",
  },
  {
    name: "Insurance",
    path: "/insurance",
    icon: "Home",
    position: "right",
    image: "cardbg",
  },
  {
    name: "Credit",
    path: "/credit",
    icon: "Home",
    position: "center",
    image: "credit",
  },
  {
    name: "Admin",
    path: "/admin",
    icon: "Home",
  },
];

export const homePageImages = [
  "Banner1.jpg",
  "Banner2.jpg",
  "Banner3.jpg",
  "Banner4.jpg",
  "Banner5.jpg",
];

export const blockToHindi = {
  MALE: "पुरुष",
  FEMALE: "स्त्री",
  OTHER: "अन्य",
  GENERAL: "सामान्य",
  OBC: "अति पिछड़ा वर्ग",
  SC: "अनुसूचित जाति",
  ST: "अनुसूचित जनजाति",
  MINORITY: "अल्पसंख्यक",
  BACKWARD: "पिछड़ा वर्ग",
  NOT_AVAILABLE: "उपल्ब्ध नहीं है",
  OWN: "रैयत",
  RENTED: "गैर-रैयत",
  MIXED: "रैयत + गैर-रैयत",
  LARGE: "बृहत किसान (2 हेक्टेअर से ज्यादा)",
  MEDIUM: "लघु किसान (1-2 हेक्टेअर)",
  SMALL: "सीमांत किसान (1 हेक्टेअर से कम)",
};

export const blockToEnglish = {
  "पुरुष": "MALE",
  "स्त्री": "FEMALE",
  "अन्य": "OTHER",
  "सामान्य": "GENERAL",
  "अति पिछड़ा वर्ग": "OBC",
  "अनुसूचित जाति": "SC",
  "अनुसूचित जनजाति": "ST",
  "अल्पसंख्यक": "MINORITY",
  "पिछड़ा वर्ग": "BACKWARD",
  "उपल्ब्ध नहीं है": "NOT_AVAILABLE",
  "रैयत": "OWN",
  "गैर-रैयत": "RENTED",
  "रैयत + गैर-रैयत": "MIXED",
  "बृहत किसान (2 हेक्टेअर से ज्यादा)": "LARGE",
  "लघु किसान (1-2 हेक्टेअर)": "MEDIUM",
  "सीमांत किसान (1 हेक्टेअर से कम)": "SMALL",
}

export const formatDateData = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
export const formatDateWeather = (dateString, isForecast, t) => {
  const date = new Date(dateString);
  const dayName = days[date.getDay()];
  const day = moment(dateString).format("DD");
  const month = moment(dateString).format("MM");
  const year = moment(dateString).format("YYYY");
  const formattedDate = `${t(dayName)}, ${day}/${month}`;
  return !isForecast ? `${formattedDate}/${year} ` : formattedDate;
};
export function convertDateFormat(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
export function capitalizeFirstLetter(string) {
  return string?.charAt(0)?.toUpperCase() + string?.slice(1)?.toLowerCase();
}

export function capitalize(s) {
  if (!s) {
    return s;
  }
  return s
    .toString()
    .split(" ")
    .map((word) => {
      if (word) {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      }
      return "";
    })
    .join(" ");
}

export const farmerDetailHeaders = {
  dbtId: "DBT_NUMBER",
  farmerName: "COMMON_FARMER_NAME",
  fatherName: "COMMON_FATHER_NAME",
  gender: "COMMON_GENDER",
  dob: "COMMON_DOB",
  farmerType: "COMMON_FARMER_TYPE",
  mobileNumber: "COMMON_MOBILE_NUMBER",
  district: "COMMON_DISTRICT",
  block: "COMMON_BLOCK",
  panchayat: "COMMON_PANCHAYAT",
  village: "COMMON_VILLAGE",
};

export const maskDigits = (str) => {
  return str?.replace(/\d(?=\d{4})/g, "X");
};

export const toQueryString = (params) => {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
};

export const exportPdf = (response, fileName) => {
  const url = window.URL.createObjectURL(response?.data);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${fileName}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const getFromToEpochTimes = (fromDate, toDate) => {
  const date1 = new Date(fromDate);
  const date2 = new Date(toDate);
  const fromEpochTime = date1.getTime();
  const toEpochTime = date2.setHours(23, 59, 59, 999);
  return { fromEpochTime, toEpochTime };
};

export const getDefaultFinacialYear = () => {
  const currDate = new Date().getMonth();
  if (currDate < 3) {
    return {
      startDate: subYears(addMonths(startOfYear(new Date()), 3), 1),
      endDate: endOfToday(new Date()),
    };
  } else {
    return {
      startDate: addMonths(startOfYear(new Date()), 3),
      endDate: endOfToday(new Date()),
    };
  }
};

export const getDuration = (startDate, endDate) => {
  let noOfDays =
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
    (1000 * 3600 * 24);
  if (noOfDays > 90) {
    return "month";
  }
  if (noOfDays <= 90 && noOfDays > 14) {
    return "week";
  }
  if (noOfDays <= 14) {
    return "day";
  }
};

export const getFileNameFromURL = (url) => {
  const urlParts = url.split("/");
  return urlParts[urlParts.length - 1];
};
//Check for hectare 
export const convertToAcre = (value, unit) => {
  const num = parseFloat(value);
  if (unit.toLowerCase() === "hectare") {
    return Number((num * 2.47105).toFixed(2));
  } else if (unit.toLowerCase() === "sqm.") {
    return Number((num * 0.000247105).toFixed(2));
  } else {
    return Number(num);
  }
}

export const convertFromAcre = (value, unit) => {
  const num = parseFloat(value);
  if (unit.toLowerCase() === "hectare") {
    return Number((num * 0.404686).toFixed(2));
  } else if (unit.toLowerCase() === "sqm.") {
    return Number((num * 4046.86).toFixed(2));
  } else {
    return Number(num);
  }
}