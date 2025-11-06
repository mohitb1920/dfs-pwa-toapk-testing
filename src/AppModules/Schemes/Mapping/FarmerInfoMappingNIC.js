function FarmerInfoMappingNIC(targetStructure, data) {
  targetStructure.dfsSchemeApplication.farmerId =
    data.farmerData?.Individual?.individualId;

  targetStructure.dfsSchemeApplication.schemeApplication.farmerProfile = {
    aadharNo: getIdentifierValue(
      data.farmerData?.Individual?.identifiers,
      "AADHAAR"
    ),
    bankDetails: {
      accountNo: data.farmerData?.BankDetails?.accountNumber,
      bankName: data.farmerData?.BankDetails?.bankName,
      branchName: data.bankInformation?.FarmerBranchName,
      ifscCode: data.farmerData?.BankDetails?.ifscCode,
    },
    casteCategory: data.personalInformation?.farmerCasteCategory?.valueHindi,
    dbtRegistrationNo: getIdentifierValue(
      data.farmerData?.Individual?.identifiers,
      "DBTID"
    ),
    dob: data.farmerData?.Individual?.dateOfBirth,
    farmerType: data.farmerData?.Individual?.individualType,
    fatherOrHusbandName: data.farmerData?.Individual?.fatherHusbandName,
    relation: data.personalInformation?.farmerHusband?.valueHindi,
    gender: data.personalInformation?.farmerGender?.valueHindi,
    mobileNo: data.farmerData?.Individual?.mobileNumber,
    name: data.farmerData?.Individual?.name?.givenName,
    districtCode: data.farmerData?.Individual?.address?.[0]?.districtLG,
    districtCodeC: data.farmerData?.Individual?.address?.[0]?.districtLG,
    districtName: data.farmerData?.Individual?.address?.[0]?.district,
    blockCode: data.farmerData?.Individual?.address?.[0]?.blockLG,
    blockCodeC: data.farmerData?.Individual?.address?.[0]?.blockLG,
    blockName: data.farmerData?.Individual?.address?.[0]?.block,
    panchayatCode: data.landDetails?.farmerGramPanchayat?.id,
    panchayatCodeC: data.landDetails?.farmerGramPanchayat?.id,
    panchayatName: data.landDetails?.farmerGramPanchayat?.value,
    villageCode: data.landDetails?.farmerVillage?.id,
    villageCodeC: data.landDetails?.farmerVillage?.id,
    villageName: data.landDetails?.farmerVillage?.value,
  };
}

function getIdentifierValue(identifiers, type) {
  const identifier = identifiers.find((id) => id.identifierType === type);
  return identifier ? identifier.identifierId : null;
}

export default FarmerInfoMappingNIC;
