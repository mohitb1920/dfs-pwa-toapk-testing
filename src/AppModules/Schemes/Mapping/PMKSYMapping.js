import React from "react";
import targetStructure from "./MapFile";
import FarmerInfoMapping from "./FarmerInfoMapping";
import { TENANT_ID } from "../../../components/Utils";
import DocumentInfoMapping from "./DocumentInfoMapping";
function PMKSYMapping(data, id, mdmsId) {
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
  
  targetStructure.dfsSchemeApplication.schemeApplication.schemeSpecificAttributes =
    {
      cropCode: data.landDetailsKrishi?.farmerCrop.id,
      cropName: data.landDetailsKrishi?.farmerCrop.value,
      cropUnit: "Ha.",
      applicantType: data.applicationType === "समूह" ? "1" : "0",
      selfDeclaration: true,
      referenceid: data.equipmentDetails.sourceOfInformation.id,
      refrence: data.equipmentDetails.sourceOfInformation.valueEnglish,
      refrenceother:
        data.equipmentDetails.ifOther &&
        data.equipmentDetails.sourceOfInformation.id === 5,
      applyForInc: data.equipmentDetails.devicesToBeInstalled.id,
      applyForIncName: data.equipmentDetails.devicesToBeInstalled.valueEnglish,
      subInc:
        data.equipmentDetails.sprinklerType &&
        data.equipmentDetails.devicesToBeInstalled.id === 5
          ? data.equipmentDetails.sprinklerType.id
          : 0,
      subIncName:
        data.equipmentDetails.sprinklerType &&
        data.equipmentDetails.devicesToBeInstalled.id === 5 &&
        data.equipmentDetails.sprinklerType.valueEnglish,
      subsidySelf:
        data.companyDetails.selfGrant.value === "Yes" ||
        data.companyDetails.selfGrant.value === "हां"
          ? "Y"
          : "N",
      company1: data.companyDetails.returnPolicy1.id,
      company2: data.companyDetails.returnPolicy2.id,
      company3: data.companyDetails.returnPolicy3.id,
      companyName1: data.companyDetails.returnPolicy1.value,
      companyName2: data.companyDetails.returnPolicy2.value,
      companyName3: data.companyDetails.returnPolicy3.value,
      appliedforOI: data.equipmentDetails.individualBorvel ? "Y" : "N",
      oiInstallationCompany:
        data.equipmentDetails.individualBorvel &&
        data.equipmentDetails.individualBorvelWork ===
          "Individual Borewell work to be done by yourself"
          ? "N"
          : "Y",
      farmerCat: data.farmerData?.Individual?.individualCategory,
    };

  targetStructure.dfsSchemeApplication.schemeApplication.landLocation.pinCode =
    data.equipmentDetails.pincode;
  targetStructure.dfsSchemeApplication.schemeApplication.landDetails = [
    {
      areaInAcres: parseFloat(data.landDetailsKrishi?.farmerLandArea)?.toFixed(
        2
      ),
      khasraNo: data.landDetailsKrishi?.farmerKhasraNumber,
      khataNo: data.landDetailsKrishi?.farmerKhataNumber,
    },
  ];

  targetStructure.dfsSchemeApplication.additionalFields.fields = [
    { key: "boundary", value: data.farmerData.Individual.address[0].villageLG },
    { key: "mdmsId", value: mdmsId },
  ];

  return targetStructure;
}

export default PMKSYMapping;
