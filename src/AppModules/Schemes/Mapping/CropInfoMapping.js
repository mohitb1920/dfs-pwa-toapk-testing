function CropInfoMapping(targetStructure, data) {
  targetStructure.dfsSchemeApplication.schemeApplication.schemeSpecificAttributes =
    {
      cropCode: data.appliedComponentScreenHorti?.farmerPartName.id,
      cropName: data.appliedComponentScreenHorti?.farmerPartName?.value,
      cropUnit: data.appliedComponentScreenHorti?.farmerPartName?.cropUnits,
      applicantType: data.applicationType === "समूह" ? "1" : "0",
      selfDeclaration: data.requiredDocuments.accept,
      appliedAreaDropDown: data.appliedComponentScreenHorti?.appliedHortiArea,
      appliedAreaQuantity: data.appliedComponentScreenHorti?.totalArea,
      userIP: data.ipAddress,

      ngoGroupName:
        data.applicationType === "समूह"
          ? data.applicantDetails?.companyName
          : null,
      ngoGroupRegNo:
        data.applicationType === "समूह"
          ? data.applicantDetails?.registrationNumber
          : null,
      applicantFrom:
        data.applicationType === "समूह"
          ? data.applicantDetails?.groupName?.value
          : null,
      ngoGroupRegDate:
        data.applicationType === "समूह"
          ? convertDateFormat(data.applicantDetails?.dateRegistration)
          : null,
      farmerCat: data.appliedComponentScreenHorti?.farmerLandType?.valueHindi,
    };
}

function convertDateFormat(dateString) {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default CropInfoMapping;
