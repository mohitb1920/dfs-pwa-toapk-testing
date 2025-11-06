function BeeAppliedMapping(targetStructure, data) {
  targetStructure.dfsSchemeApplication.schemeApplication.schemeSpecificAttributes =
    {
      cropCode: data.appliedComponents?.farmerPartName.id,
      cropName: data.appliedComponents?.farmerPartName?.value,
      cropUnit: data.appliedComponents?.farmerPartName?.cropUnits,
      applicantType: data.applicationType === "समूह" ? "1" : "0",
      selfDeclaration: data.requiredDocuments?.accept,
      honeyBeeTrainingFrom: data.appliedComponents?.trainingProvider?.value,
      appliedForExtractor: data.appliedComponents?.HoneyExtractor?.valueHindi,
      appliedAreaQuantity: data.appliedComponents?.componentCount,
      appliedForFoodGradeContainer:
        data.appliedComponents?.FoodGradeContainer?.valueHindi,
      conpanyBased: true,
      userIP: data.ipAddress,
      //   userMAC: "02:00:00:00:00:00",
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
      farmerCat: data.farmerData?.Individual?.individualCategory,
    };
}

function convertDateFormat(dateString) {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default BeeAppliedMapping;
