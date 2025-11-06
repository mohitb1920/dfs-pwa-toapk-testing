import { blockToHindi } from "../../components/Utils";

function convertDateFormat(dateString) {
  if (!dateString?.includes("-")) return null;
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

export function editFarmerResponse(
  formData,
  addressCodes,
  profilePicStoreId,
  farmerResponse,
  profileData
) {
  const individualDetails = profileData?.Individual;
  const dbtIndividualDetails = farmerResponse?.Individual;

  const dbtIdentifiers = farmerResponse?.Individual?.identifiers || individualDetails?.identifiers;
  const preparedIdentifiers =
    dbtIdentifiers?.map((identifier) => {
      return { ...identifier, isDeleted: false };
    }) || [];

  const dbtAddress = farmerResponse?.Individual?.address?.[0];
  const address = profileData?.Individual?.address?.[0];
  const preparedAddress = [
    {
      ...address,
      district: dbtAddress?.district || formData?.district,
      block: dbtAddress?.block || formData?.block,
      panchayat: dbtAddress?.panchayat || formData?.panchayat,
      village: dbtAddress?.village || formData?.village,
      districtLG: dbtAddress?.districtLG || addressCodes?.district,
      blockLG: dbtAddress?.blockLG || addressCodes?.block,
      panchayatLG: dbtAddress?.panchayatLG || addressCodes?.panchayat,
      villageLG: dbtAddress?.villageLG || addressCodes?.village,
      pincode: dbtAddress?.pincode || formData?.pincode,
      auditDetails: {
        ...address?.auditDetails,
        lastModifiedBy: profileData?.Individual?.userUuid,
        lastModifiedTime: Date.now(),
      },
    },
  ];

  const preparedIndividual = {
    ...individualDetails,
    individualType:
      dbtIndividualDetails?.individualType ||
      blockToHindi?.[formData?.farmerType],
    individualCast:
      dbtIndividualDetails?.individualCast ||
      blockToHindi?.[formData?.farmerCasteCategory],
    individualCategory:
      dbtIndividualDetails?.individualCategory ||
      blockToHindi?.[formData?.farmerCategory],
    name: dbtIndividualDetails?.name || {
      ...individualDetails?.name,
      givenName: formData?.farmerName,
    },
    dateOfBirth:
      dbtIndividualDetails?.dateOfBirth || convertDateFormat(formData?.DOB),
    gender:
      dbtIndividualDetails?.gender || blockToHindi?.[formData?.farmerGender],
    mobileNumber: dbtIndividualDetails?.mobileNumber || formData?.farmerMobileNumber,
    address: preparedAddress,
    fatherHusbandName:
      dbtIndividualDetails?.fatherHusbandName || formData?.farmerRelativeName,
    photo: profilePicStoreId || individualDetails?.photo,
    identifiers: preparedIdentifiers,
    additionalFields: dbtIndividualDetails?.additionalFields || {
      ...individualDetails?.additionalFields,
      fields: [
        {
          key: "aadharName",
          value: dbtIndividualDetails?.name?.givenName || formData?.farmerName,
        },
        {
          key: "districtCode",
          value: preparedAddress?.[0]?.districtLG ||addressCodes?.district,
        },
        {
          key: "blockCode",
          value: preparedAddress?.[0]?.blockLG || addressCodes?.block,
        },
        {
          key: "panchayatCode",
          value: preparedAddress?.[0]?.panchayatLG ||  addressCodes?.panchayat,
        },
        {
          key: "villageCode",
          value: preparedAddress?.[0]?.villageLG || addressCodes?.village,
        },
      ],
    },
    auditDetails: {
      ...individualDetails?.auditDetails,
      lastModifiedBy: profileData?.Individual?.userUuid,
      lastModifiedTime: Date.now(),
    },
  };

  let preparedBankDetails = profileData?.BankDetails ?? null;

  if (preparedBankDetails) {
    if (farmerResponse) {
      preparedBankDetails = {
        ...preparedBankDetails,
        bankName: farmerResponse.BankDetails.bankName,
        accountNumber: farmerResponse.BankDetails.accountNumber,
        ifscCode: farmerResponse.BankDetails.ifscCode,
        bankBranchAddress: farmerResponse.BankDetails.bankBranchAddress,
        auditDetails: {
          ...preparedBankDetails.auditDetails,
          lastModifiedBy: profileData?.Individual?.userUuid,
          lastModifiedTime: Date.now(),
        },
      };
    }
  } else if (farmerResponse?.BankDetails) {
    preparedBankDetails = {
      ...farmerResponse?.BankDetails,
      clientReferenceId: preparedIndividual?.clientReferenceId,
      farmerId: preparedIndividual?.individualId,
    };
  }

  return {
    Individual: preparedIndividual,
    BankDetails: preparedBankDetails,
  };
}
