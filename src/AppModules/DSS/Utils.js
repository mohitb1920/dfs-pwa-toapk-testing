const ExcelJS = require("exceljs");

export const farmerRequestParams = {
  fields: [
    "createdTime",
    "farmerName",
    "dbtId",
    "district",
    "block",
    "panchayat",
    "village",
    "gender",
    "individualType",
    "individualCategory",
    "individualCast",
    "dateOfBirth",
  ],
  index: "individual-index-v1",
};

export const farmersReportColumns = [
  { header: "Date Registered", key: "createdTime", width: 20 },
  { header: "Farmer Name", key: "farmerName", width: 24 },
  { header: "DBT ID", key: "dbtId", width: 16 },
  { header: "Date Of Birth", key: "dateOfBirth", width: 16 },
  { header: "Gender", key: "gender", width: 9 },
  { header: "Caste", key: "individualCast", width: 9 },
  { header: "District", key: "district", width: 16 },
  { header: "Block", key: "block", width: 16 },
  { header: "Panchayat", key: "panchayat", width: 16 },
  { header: "Village", key: "village", width: 16 },
  { header: "Farmer Type", key: "individualType", width: 16 },
  { header: "Farmer Category", key: "individualCategory", width: 24 },
];

export const schemesRequestParams = {
  fields: [
    "createdTime",
    "dbtRegistrationNo",
    "schemeName",
    "status",
    "districtName",
    "blockName",
    "panchayatName",
    "villageName",
    "dfsSchemeApplicationId",
    "department",
    "gender",
    "casteCategory",
    "dob",
    "farmerType",
    "remark",
  ],
  index: "scindex-v1",
};

export const schemesReportColumns = [
  { header: "Date Applied", key: "createdTime", width: 17 },
  { header: "DBT ID", key: "dbtRegistrationNo", width: 16 },
  { header: "Date Of Birth", key: "dob", width: 16 },
  { header: "Gender", key: "gender", width: 9 },
  { header: "Caste", key: "casteCategory", width: 9 },
  { header: "Scheme Name", key: "schemeName", width: 24 },
  { header: "Status", key: "status", width: 16 },
  { header: "District", key: "districtName", width: 12 },
  { header: "Block", key: "blockName", width: 12 },
  { header: "Panchayat", key: "panchayatName", width: 12 },
  { header: "Village", key: "villageName", width: 12 },
  { header: "Farmer Category", key: "farmerType", width: 16 },
  { header: "Application Id", key: "dfsSchemeApplicationId", width: 24 },
  { header: "Department", key: "department", width: 20 },
  { header: "Scheme Remarks", key: "remark", width: 24 },
];

export const Download = {
  CustomExcel: (fileHeaders, data, fileName) => {
    const file = fileName.substring(0, 50);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Sheet 1");
    sheet.properties.defaultColWidth = 15;

    sheet.columns = data.columns;
    sheet.addRows(data.dataJson);

    fileHeaders.forEach((rowData, rowIndex) => {
      sheet.insertRow(rowIndex + 1, rowData);
    });

    sheet.getRow(1).font = { size: 12, bold: true };
    sheet.getRow(4).font = { size: 12, bold: true };

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${file}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  },
};

export const localizationKeys = {
  "DBT Linked": "COMMON_MASTERS_DBT_1",
  "DBT not Linked": "COMMON_MASTERS_DBT_0",
  "Request In Process": "DSS_REQUEST_IN_PROCESS",
  "Pending Grievances": "DSS_GRM_PENDING",
  "Resolved Grievances": "DSS_GRM_RESOLVED",
  "Verification Pending": "DSS_GRM_VERIFICATION_PENDING",
  Verified: "DSS_GRM_VERIFIED",
  Failed: "DSS_FAILED",
  "Submitted Successfully": "DSS_SUBMITTED_SUCCESSFULLY",
  Approved: "DSS_APPROVED",
  Rejected: "DSS_REJECTED",
};
export const cardProps = {
  COMMON_MASTERS_DBT_1: { color: "#1A5C4B", icon: `chain-link-icon.svg` },
  COMMON_MASTERS_DBT_0: { color: "#85BC31", icon: `chain-unlink-icon.svg` },
  DSS_GRM_PENDING: { color: "rgba(106, 124, 111, 1)", icon: `Pending.svg` },
  DSS_GRM_TOTAL: {
    color: "rgba(26, 92, 75, 1)",
    icon: `Approved.svg`,
  },
  DSS_GRM_RESOLVED: {
    color: "rgba(133, 188, 49, 1)",
    icon: `Submitted.svg`,
  },
  DSS_GRM_VERIFICATION_PENDING: {
    color: "rgba(226, 41, 42, 1)",
    icon: `verification_pending.svg`,
  },
  DSS_GRM_VERIFIED: {
    color: "rgba(247, 213, 8, 1)",
    icon: `Resolved.svg`,
  },
  DSS_REQUEST_IN_PROCESS: { color: "#F7D508", icon: "request-in-process.svg" },
  DSS_FAILED: { color: "#E2292A", icon: "failed-icon.svg" },
  DSS_SUBMITTED_SUCCESSFULLY: { color: "#85BC31", icon: `Submitted.svg` },
  DSS_APPROVED: { color: "#1A5C4B", icon: `Approved.svg` },
  DSS_REJECTED: { color: "#948005", icon: `Rejected.svg` },
};

export const barColors = {
  farmerRegistrations: ["#1A5C4B", "#85BC31"],
  applicationsPerScheme: [
    "#F7D508",
    "#E2292A",
    "#85BC31",
    "#1A5C4B",
    "#948005",
  ],
};

export const chipLabels = ["District", "Block", "Panchayat"];
