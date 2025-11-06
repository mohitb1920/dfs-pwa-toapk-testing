function MushAppliedMapping(targetStructure, data) {
  targetStructure.dfsSchemeApplication.schemeApplication.schemeSpecificAttributes =
    {
      cropCode: data.componentsMushroomHut?.component?.id,
      cropName: data.componentsMushroomHut?.component?.value,
      cropUnit: data.componentsMushroomHut?.component?.cropUnits,
      applicantType: data.applicationType === "समूह" ? "1" : "0",
      selfDeclaration: data.requiredDocuments.accept,
      appliedAreaQuantity: data.componentsMushroomHut?.totalArea,
      componentPreviousSubsidy:
        data.grantDetails?.receivedGrantOnProposedLand?.valueHindi,
      bankFinInstitute: data.grantDetails?.grantRelatedBank?.value,
      otherSubsidySourceAmount: data.grantDetails?.otherSourcesGrant,
      estimatedCost: data.grantDetails?.proposedExpenditure,
      previousSubsidy: data.grantDetails?.pastGrants?.valueHindi,
      previousSubsidyDetails: data.grantDetails?.giveDetails,
      conpanyBased: true,
      ngoGroupName:
        data.applicationType === "समूह"
          ? data.applicantDetails?.companyName
          : null,
      ngoGroupRegNo:
        data.applicationType === "समूह"
          ? data.applicantDetails?.registrationNumber
          : null,
      ngoGroupRegDate:
        data.applicationType === "समूह"
          ? convertDateFormat(data.applicantDetails?.dateRegistration)
          : null,
    };
}

function convertDateFormat(dateString) {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default MushAppliedMapping;
