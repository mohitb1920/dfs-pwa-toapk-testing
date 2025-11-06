import targetStructure from "./MapFile";
import FarmerInfoMapping from "./FarmerInfoMapping";
import { TENANT_ID } from "../../../components/Utils";

function InputInfoMapping(data, id, mdmsId) {
  targetStructure.dfsSchemeApplication.schemeId = id;
  targetStructure.dfsSchemeApplication.mdmsId = mdmsId;
  targetStructure.dfsSchemeApplication.tenantId = TENANT_ID;
  targetStructure.dfsSchemeApplication.rowVersion = 0;
  targetStructure.dfsSchemeApplication.schemeApplication.schemeName =
    data.schemeName;
  const currentDate = new Date();
  targetStructure.dfsSchemeApplication.schemeApplication.appliedDate =
    currentDate.toISOString();
  FarmerInfoMapping(targetStructure, data.farmerData);
  let prestDetails = {};

  if (mdmsId === "SCHEME004") {
    prestDetails = {
      prest1: "Pheromone trap",
      prestQ1: data.insecticideDetails?.prest1,
      prest2: "Life Time Trap",
      prestQ2: data.insecticideDetails?.prest2,
      prest3: "Sticky Trap",
      prestQ3: data.insecticideDetails?.prest3,
      prest4: "Chemical Pesticide",
      prestQ4: data.insecticideDetails?.prest4,
      prest5: "Bio-pesticides",
      prestQ5: data.insecticideDetails?.prest5,
    };
  } else if (mdmsId === "SCHEME005") {
    prestDetails = {
      prest1: "Light Trap",
      prestQ1: data.insecticideDetails?.prest1,
    };
  } else if (mdmsId === "SCHEME006") {
    prestDetails = {
      prest1: "Mango",
      prestQ1: data.insecticideDetails?.prest1,
      prest2: "Litchi",
      prestQ2: data.insecticideDetails?.prest2,
      prest3: "Guava",
      prestQ3: data.insecticideDetails?.prest3,
    };
  } else if (mdmsId === "SCHEME027") {
    prestDetails = {
      prest1: data.insecticideDetails?.insecti1 ? "फफुन्दीनाशी" : null,
      prest2: data.insecticideDetails?.insecti2 ? "कीटनाशी" : null,
      prest3: data.insecticideDetails?.insecti3 ? "खरपतवारनाशी" : null,
    };
  }
  targetStructure.dfsSchemeApplication.schemeApplication.schemeSpecificAttributes =
    {
      farmerCat: data.applicationFormInput?.farmerType,
      totalRakwa: data.applicationFormInput?.farmerLandArea,
      effectedCrop: data.applicationFormInput?.farmerAffectedCrop,
      effectedRakwa: data.applicationFormInput?.farmerAffectedLandArea,
      kharpatwar: data.applicationFormInput?.cropIssues,
      noOfApply: 1,
      ...prestDetails,
    };

  const mappedBillDetails = data.billScreen?.newBillButton?.map((bill) => ({
    billNo: bill.billNumber,
    amount: bill.totalAmount,
    purchaseDate: convertDateFormat(bill.dateOfPurchase),
  }));
  targetStructure.dfsSchemeApplication.schemeApplication.billDetails =
    mappedBillDetails;
  targetStructure.dfsSchemeApplication.schemeApplication.documents = [
    {
      docFileName: "PhotoDoc",
      fileStoreId: data.billScreen?.PhotoDoc?.find(doc => doc.status === "success")?.fileStoreId,
    },
  ];

  targetStructure.dfsSchemeApplication.additionalFields.fields = [
    { key: "boundary", value: data.farmerData.Individual.address[0].villageLG },
    { key: "mdmsId", value: mdmsId },
  ];
  return targetStructure;
}

function convertDateFormat(dateString) {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default InputInfoMapping;
