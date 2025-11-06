export const personalInfoMockData = {
  type: "object",
  title: "Personal Information",
  required: ["farmerName", "farmerDOB", "farmerGender"],
  properties: {
    farmerName: {
      type: "string",
      title: "Farmer Name",
      default: "Shiva",
    },
    farmerDOB: {
      type: "string",
      format: "date",
      title: "Date of Birth",
      default: "1996-11-20",
    },
    farmerGender: {
      title: "Gender",
      enum: ["Male", "Female", "Other"],
      default: "Male",
    },
    farmerMaritalStatus: {
      title: "Marital Status",
      enum: ["Married", "Unmarried"],
      default: "Unmarried",
    },
  },
};

export const mockAnnouncements = [
  {
    id: "297e7a25-7fd9-4663-b3fc-bf48b2bff11b",
    titleCode: "TITLE-ANC-000050",
    announcementCode: "ANNOUNCEMENT-ANC-000050",
    templateUrl:
      "https://filestoragedfs.blob.core.windows.net/publicresources/images/information.png",
    category: "INFORMATION",
    localeModule: "dfs-announcements",
    url: "",
    contactNo: "",
    state: "ACTIVE",
    auditDetails: {
      createdTime: 1710999482605,
    },
    createdByUser: "Announcemnet Dev Admin",
  },
];

export const mockHiLocalization = [
  {
    code: "ANNOUNCEMENT-ANC-000030",
    message: "छत पर बागवानी योजना, छत पर बागवानी योजना, छत पर बागवानी योजना",
    module: "dfs-announcements",
    locale: "hi_IN",
  },
];
export const mockEnLocalization = [
  {
    code: "ANNOUNCEMENT-ANC-000030",
    message: "छत पर बागवानी योजना, छत पर बागवानी योजना, छत पर बागवानी योजना",
    module: "dfs-announcements",
    locale: "en_IN",
  },
];

export const localStorageMock = (function () {
  let store = {};

  return {
    getItem(key) {
      return store[key];
    },

    setItem(key, value) {
      store[key] = value;
    },
  };
})();

export const complaintsMock = {
  complaints: [
    {
      serviceRequestId: "PGR-2024-06",
      complaintSubType:
        "FertilizerPesticideInsecticideSupplyLicensePricesRelated",
      locality: "SUN01",
      status: "PENDINGATL1",
      taskOwner: "Agriculture Coordinator 01",
      sla: 14,
      tenantId: "br",
      district: "Amritsar",
      createdDate: "16-May-2024",
    },
    {
      serviceRequestId: "PGR-2024-05",
      complaintSubType: "PesticidesRelated",
      locality: "SUN01",
      status: "PENDINGATL1",
      taskOwner: "Agriculture Coordinator 01",
      sla: 12,
      tenantId: "br",
      district: "Amritsar",
      createdDate: "14-May-2024",
    },
  ],
  totalCount: 2,
};

export const mockPgrData = {
  service: { businessService: "GRM1", applicationStatus: "PENDING"},
  details: {
    description: "mock complaint",
    category: "Agriculture",
    subCategory: "Mock Dealers Related",
    subSubCategory: "Pesticides related",
  },
  farmerDetails: {
    farmerName: "Jane Doe",
    fatherName: "mock father",
    dbtId: "XXX3657647XXX",
  },
  workflow: {},
};

export const mockWorkflowData = {
  timeline: [
    {
      performedAction: "APPLY",
      wfDocuments: [
        {
          documentType: "image/png",
          fileStoreId: "f98b42bf-c7a2-4d36-b859-394c5634b7a6",
        },
        {
          documentType: "application/pdf",
          fileStoreId: "f98b42bf-c7a2-4d36-b859-394c5634b7a6",
        },
        {
          documentType: "audio/mpeg3",
          fileStoreId: "f98b42bf-c7a2-4d36-b859-394c5634b7a6",
        },
      ],
      auditDetails: {createdEpoch: 1723399465390}
    },
  ],
  nextActions: [{ action: "RESOLVE" }],
};

export const mockShowcauseDetails = {
  comments: [
    {
      commentedBy: "4bc5aa94-6233-4a80-a7cb-26c15360f74e",
      comments: "Mock Comment",
    },
    {
      commentedBy: "b4b6ace7-df04-4545-9683-cfe900834a9e",
      comments: "Mock Comment",
    },
  ],
  documents: [
    {
      uploadedBy: "4bc5aa94-6233-4a80-a7cb-26c15360f74e",
      documentType: "image/png",
      fileStoreId: "ac-232-abdhd",
    },
    {
      uploadedBy: "b4b6ace7-df04-4545-9683-cfe900834a9e",
      documentType: "image/png",
      fileStoreId: "ac-232-abdhd",
    },
  ],
  issuedBy: "b4b6ace7-df04-4545-9683-cfe900834a9e",
  issuedTo: "4bc5aa94-6233-4a80-a7cb-26c15360f74e",
  serviceRequestId: "PGR-2024-07-29-000626",
  status: "ISSUED",
  tenantId: "br",
  showcauseContent: {
    issueDate: "29-07-2024",
    recipientBlock: null,
    recipientDesignation: "District Agriculture Officer",
    recipientDistrict: null,
    recipientName: "Rajan Balan",
    recipientPanchayat: null,
    responseDueDate: "05-08-2024",
    senderContactInfo: "jda-tir-bih@nic.in",
    senderDesignation: "HQ Officers",
    senderName: "Ram Prakash Sahni",
    serviceRequestId: "PGR-2024-07-29-000626",
    showcauseId: "850d6ede-8563-4e06-a473-a34c60cdde6e",
    turnaroundTime: "7",
  },
};

export const mockTechSupportMDMSResponse = {
  ServiceDefs: [
    {
      serviceCode: "App Crashes",
      category: "App Functionality Issues",
      subCategory: "App Crashes",
      workflow: "GRM9",
      slaHours: 336,
      active: true,
      department: "Agriculture",
    },
    {
      serviceCode: "Navigation Difficulties",
      category: "User Interface (UI) Issues",
      subCategory: "Navigation Difficulties",
      workflow: "GRM9",
      slaHours: 336,
      active: true,
      department: "Agriculture",
    },
  ],
}
