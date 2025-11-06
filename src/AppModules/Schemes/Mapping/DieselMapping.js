import targetStructure from "./MapFile";
import FarmerInfoMapping from "./FarmerInfoMapping";
import { TENANT_ID } from "../../../components/Utils";
import LandInfoMapping from "./LandInfoMapping";
import DocumentInfoMapping from "./DocumentInfoMapping";
function DieselMapping(data, id, mdmsId) {
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
      cropName: data.landAndSubsidyDetails?.season?.value,
      cropType: data.landAndSubsidyDetails2?.cropName?.value,
      landType: data.landAndSubsidyDetails?.farmerTypeDieasel?.value,
      seasonId: data.landAndSubsidyDetails?.season?.id,
      blockName: data.dieselPurchaseDetails?.blockName,
      noOfApply: data.landAndSubsidyDetails2?.numberOfIrrigation,
      receiptDate: convertDateFormat(data.dieselPurchaseDetails?.recieptDate),
      receiptNumber: data.dieselPurchaseDetails?.recieptNumber,
      dieselPurchased: data.dieselPurchaseDetails?.dieselPurchased,
      nameOfPetrolPump: data.dieselPurchaseDetails?.petrolPumpName,
      dieselPurchasedPrice: data.dieselPurchaseDetails?.priceOfDiesel,
      totalAgricultureLand: data.affectedLandDetail?.totalLand,
      totalCultivationLand: data.affectedLandDetail?.totalArea,
      totalEstimatedAmount: data.dieselPurchaseDetails?.totalEstimatePrice,
      selfDeclaration: data.requiredDocuments.accept,
    };
  targetStructure.dfsSchemeApplication.schemeApplication.landLocation = {
    sectionApply: true,
  };
  targetStructure.dfsSchemeApplication.schemeApplication.landDetails = [
    ...(data.affectedLandDetail?.groupDetails?.map((detail) => ({
      khataNo: detail.khataNumber,
      khasraNo: detail.khesraNumber,
      areaInAcres: (parseFloat(detail?.farmerLandArea) / 100)?.toFixed(2),
      thana: detail.thanaNumber,
      typeOfLand: detail.typeofLand,
      neighbourFarmer1: detail.neighbourFarmer1,
      neighbourFarmer2: detail.neighbourFarmer2,
    })) || []),
    ...(data.affectedLandDetail?.groupDetails2?.map((detail) => ({
      khataNo: detail.khataNumber,
      khasraNo: detail.khesraNumber,
      areaInAcres: (parseFloat(detail?.farmerLandArea) / 100)?.toFixed(2),
      thana: detail.thanaNumber,
      typeOfLand: detail.typeofLand,
      neighbourFarmer1: detail.neighbourFarmer1,
      neighbourFarmer2: detail.neighbourFarmer2,
    })) || []),
  ];

  targetStructure.dfsSchemeApplication.schemeApplication.memberDetails =
    data.familyDetails?.memberDetails.map((member) => ({
      memberLandDetails: {
        blockLG: 0,
      },
      memberFarmerProfile: {
        dob: convertDateFormat(member.memberDOB),
        name: member.memberNameKrishi,
        aadharNo: "XXXXXXXX" + member.memberAadhaarNumber?.slice(-4),
        relation:
          member.memberRelation.valueHindi || member.memberRelation.value,
        vitalStatus:
          member.memberStatus.valueHindi || member.memberStatus.value,
      },
    }));
  DocumentInfoMapping(targetStructure, data);

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

export default DieselMapping;
