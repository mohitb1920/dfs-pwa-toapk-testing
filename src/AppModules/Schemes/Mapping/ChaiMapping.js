import targetStructure from "./MapFile";
import FarmerInfoMapping from "./FarmerInfoMapping";
import { TENANT_ID } from "../../../components/Utils";
import LandInfoMapping from "./LandInfoMapping";
import DocumentInfoMapping from "./DocumentInfoMapping";
function ChaiMapping(data, id, mdmsId) {
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
  targetStructure.dfsSchemeApplication.schemeApplication.schemeSpecificAttributes =
    {
      cropCode: data.appliedComponentsTea?.component?.id,
      cropName: data.appliedComponentsTea?.component?.value,
      cropUnit: data.appliedComponentsTea?.component?.cropUnits,
      applicantType: data.applicationType === "समूह" ? "1" : "0",
      selfDeclaration: data.requiredDocuments.accept,
      appliedAreaQuantity: data.appliedComponentsTea?.totalArea,
      farmerCat: data.appliedComponentsTea?.farmerType.valueHindi,
      userIP: data.ipAddress,

      ngoGroupName:
        data.applicationType === "समूह"
          ? data.groupDetailsComponent?.companyName
          : null,
      ngoGroupRegNo:
        data.applicationType === "समूह"
          ? data.groupDetailsComponent?.companyRegistrationNumber
          : null,
      applicantFrom:
        data.applicationType === "समूह"
          ? data.groupDetailsComponent?.groupName?.value
          : null,
      ngoGroupRegDate:
        data.applicationType === "समूह"
          ? convertDateFormat(
              data.groupDetailsComponent?.companyRegistrationDate
            )
          : null,
    };
  LandInfoMapping(targetStructure, data);
  DocumentInfoMapping(targetStructure, data);

  targetStructure.dfsSchemeApplication.schemeApplication.landDetails =
    data.appliedComponentsTea?.groupDetails?.map((detail) => ({
      khataNo: detail.farmerKhataNumber,
      khasraNo: detail.farmerKhasraNumber,
      areaInAcres: parseFloat(detail?.farmerLandArea)?.toFixed(2),
    })) || [];

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

export default ChaiMapping;
