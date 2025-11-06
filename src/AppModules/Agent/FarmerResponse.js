import { blockToHindi } from "../../components/Utils";

const initialObject = {
  Individual: {
    individualType: null,
    individualCast: null,
    individualCategory: null,
    id: null,
    individualId: null,
    tenantId: "br",
    clientReferenceId: null,
    userId: null,
    userUuid: null,
    name: {
      givenName: null,
      familyName: null,
      otherNames: null,
    },
    dateOfBirth: null,
    gender: null,
    bloodGroup: null,
    mobileNumber: null,
    altContactNumber: null,
    email: null,
    address: [
      {
        id: null,
        clientReferenceId: null,
        individualId: null,
        tenantId: null,
        doorNo: null,
        latitude: null,
        longitude: null,
        locationAccuracy: null,
        type: null,
        addressLine1: null,
        addressLine2: null,
        landmark: null,
        city: null,
        pincode: null,
        buildingName: null,
        street: null,
        district: null,
        block: null,
        panchayat: null,
        village: null,
        districtLG: null,
        blockLG: null,
        panchayatLG: null,
        villageLG: null,
        locality: null,
        ward: null,
        isDeleted: false,
        auditDetails: null,
      },
    ],
    fatherHusbandName: null,
    relationship: null,
    identifiers: [],
    skills: null,
    photo: null,
    additionalFields: {
      schema: null,
      version: null,
      fields: [
        {
          key: "aadharName",
          value: null,
        },
        {
          key: "districtCode",
          value: null,
        },
        {
          key: "blockCode",
          value: null,
        },
        {
          key: "panchayatCode",
          value: null,
        },
        {
          key: "villageCode",
          value: null,
        },
      ],
    },
    isDeleted: null,
    rowVersion: null,
    auditDetails: null,
    clientAuditDetails: null,
    isSystemUser: null,
    isSystemUserActive: true,
    userDetails: null,
    isDBTUser: false,
  },
  BankDetails: null,
};

function convertDateFormat(dateString) {
  if (!dateString || !dateString.includes("-")) {
    return null;
  }
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

export function createFarmerResponse(
  formData,
  addressCodes,
  profilePicStoreId,
  dataFromDBT,
  farmerResponse,
  userDetails
) {
  if (dataFromDBT) {
    farmerResponse.Individual.photo = profilePicStoreId;
    farmerResponse.Individual.address[0].pincode =
      formData.pincode === "" ? null : formData.pincode;
    
    if (userDetails) {
      farmerResponse.Individual.userUuid = userDetails.uuid;
      farmerResponse.Individual.userId = userDetails.id;
    }

    return farmerResponse;
  }
  initialObject.Individual.name.givenName = formData.farmerName;
  initialObject.Individual.fatherHusbandName = formData.farmerRelativeName;
  initialObject.Individual.dateOfBirth = convertDateFormat(formData.DOB);

  initialObject.Individual.mobileNumber = formData.farmerMobileNumber;

  initialObject.Individual.gender = blockToHindi?.[formData.farmerGender];
  initialObject.Individual.individualType = blockToHindi?.[formData.farmerType];
  initialObject.Individual.individualCast =
    blockToHindi?.[formData.farmerCasteCategory];

  initialObject.Individual.individualCategory =
    blockToHindi?.[formData.farmerCategory];

  initialObject.Individual.address[0].district = formData.district;
  initialObject.Individual.address[0].block = formData.block;
  initialObject.Individual.address[0].panchayat = formData.panchayat;
  initialObject.Individual.address[0].village = formData.village;
  initialObject.Individual.address[0].pincode =
    formData.pincode === "" ? null : formData.pincode;

  initialObject.Individual.tenantId = "br";
  initialObject.Individual.address[0].districtLG = addressCodes.district;
  initialObject.Individual.address[0].blockLG = addressCodes.block;
  initialObject.Individual.address[0].panchayatLG = addressCodes.panchayat;
  initialObject.Individual.address[0].villageLG = addressCodes.village;

  initialObject.Individual.additionalFields.fields[0].value =
    formData.farmerName;
  initialObject.Individual.additionalFields.fields[1].value =
    addressCodes.district;
  initialObject.Individual.additionalFields.fields[2].value =
    addressCodes.block;
  initialObject.Individual.additionalFields.fields[3].value =
    addressCodes.panchayat;
  initialObject.Individual.additionalFields.fields[4].value =
    addressCodes.village;

  initialObject.Individual.photo = profilePicStoreId;

  if (userDetails) {
    initialObject.Individual.userUuid = userDetails.uuid;
    initialObject.Individual.userId = userDetails.id;
  }

  return initialObject;
}
