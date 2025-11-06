function FarmerInfoMapping(targetStructure, farmerData) {
  targetStructure.dfsSchemeApplication.farmerId =
    farmerData.Individual.individualId;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.aadharNo =
    getIdentifierValue(farmerData?.Individual?.identifiers, "AADHAAR");
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.bankDetails =
    {
      accountNo: farmerData.BankDetails.accountNumber,
      bankName: farmerData.BankDetails.bankName,
      ifscCode: farmerData.BankDetails.ifscCode,
    };
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.blockCode =
    farmerData.Individual.address?.[0]?.blockLG;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.blockCodeC =
    farmerData.Individual.address?.[0]?.blockLG;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.blockName =
    farmerData.Individual.address?.[0]?.block;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.casteCategory =
    farmerData.Individual.individualCast;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.dbtRegistrationNo =
    getIdentifierValue(farmerData?.Individual?.identifiers, "DBTID");
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.districtCode =
    farmerData.Individual.address?.[0]?.districtLG;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.districtCodeC =
    farmerData.Individual.address?.[0]?.districtLG;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.districtName =
    farmerData.Individual.address?.[0]?.district;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.dob =
    farmerData.Individual.dateOfBirth;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.farmerType =
    farmerData.Individual.individualType;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.fatherOrHusbandName =
    farmerData.Individual.fatherHusbandName;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.gender =
    farmerData.Individual.gender;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.mobileNo =
    farmerData.Individual.mobileNumber;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.name =
    farmerData.Individual.name.givenName;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.panchayatCode =
    farmerData.Individual.address?.[0]?.panchayatLG;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.panchayatCodeC =
    farmerData.Individual.address?.[0]?.panchayatLG;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.panchayatName =
    farmerData.Individual.address?.[0]?.panchayat;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.villageCode =
    farmerData.Individual.address?.[0]?.villageLG;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.villageCodeC =
    farmerData.Individual.address?.[0]?.villageLG;
  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile.villageName =
    farmerData.Individual.address?.[0]?.village;
  targetStructure.dfsSchemeApplication.schemeApplication.schemeSpecificAttributes.farmerCat =
    farmerData.Individual.individualCategory; //Not being Applied
}

function getIdentifierValue(identifiers, type) {
  const identifier = identifiers.find((id) => id.identifierType === type);
  return identifier ? identifier.identifierId : null;
}
export default FarmerInfoMapping;
