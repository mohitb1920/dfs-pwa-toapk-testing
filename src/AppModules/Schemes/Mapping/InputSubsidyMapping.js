import targetStructure from "./MapFile";
import FarmerInfoMapping from "./FarmerInfoMapping";
import { TENANT_ID } from "../../../components/Utils";
import DocumentInfoMapping from "./DocumentInfoMapping";

function InputSubsidyMapping(data, id, mdmsId) {
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
  DocumentInfoMapping(targetStructure, data);

  const totalSubsidy = data["farmerType&LandDetails"]?.groupDetails?.reduce(
    (sum, item) => sum + (parseFloat(item.estimatedGrant) || 0),
    0
  );

  const effectedRakwa = data["farmerType&LandDetails"]?.groupDetails?.reduce(
    (sum, item) => sum + (parseFloat(item.damageArea) || 0),
    0
  );

  targetStructure.dfsSchemeApplication.schemeApplication.schemeSpecificAttributes =
    {
      userIMEI: data.ipAddress,
      totalLand: data["farmerType&LandDetails"]?.totalLand,
      schemeType: data["farmerType&LandDetails"]?.lossReason?.id,
      farmerCat: data["farmerType&LandDetails"]?.farmerType?.id,
      totalSubsidy: totalSubsidy.toString(),
      effectedRakwa: effectedRakwa.toString(),
    };

  targetStructure.dfsSchemeApplication.schemeApplication.memberDetails =
    data.familyDetails?.memberDetails?.map((member) => ({
      memberFarmerProfile: {
        dob: convertDateFormat(member.memberDOB),
        name: member.memberNameKrishi,
        aadharNo: maskAadhaar(member.memberAadhaarNumber),
        relation: member.memberRelation?.valueHindi,
        vitalStatus: member.memberStatus?.valueHindi,
      },
    })) || [];

  targetStructure.dfsSchemeApplication.schemeApplication.landDetails =
    data["farmerType&LandDetails"]?.groupDetails?.map((groupDetail) => ({
      khataNo: groupDetail.farmerKhataNumber,
      thanaNo: groupDetail.thanaNumber,
      cropType: groupDetail.cropsName?.id,
      khasraNo: groupDetail.farmerKhasraNumber,
      farmerCat: groupDetail.farmerType?.id,
      typeOfLand: groupDetail.landType?.id,
      affectedType: groupDetail.lossReason?.id,
      anudanAmount: groupDetail.estimatedGrant,
      farmingRakwa: groupDetail.farmerLandArea,
      affectedrakwa: groupDetail.damageArea,
      neighbourFarmer1: groupDetail.nextFarmerName1,
      neighbourFarmer2: groupDetail.nextFarmerName2,
    })) || [];
    
  targetStructure.dfsSchemeApplication.additionalFields.fields = [
    { key: "boundary", value: data.farmerData.Individual.address[0].villageLG },
    { key: "mdmsId", value: mdmsId },
  ];
  return targetStructure;
}

function maskAadhaar(aadhaarNumber) {
  return "XXXXXXXX" + aadhaarNumber.toString().slice(-4);
}

function convertDateFormat(dateString) {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default InputSubsidyMapping;
