function LandInfoMapping(targetStructure, data) {
  targetStructure.dfsSchemeApplication.schemeApplication.landLocation = {
    pinCode: data.landDetails.farmerPinCode,
    isLandLocationSame: data.landDetails.sameAddress ? "true" : "false",
    landDistrictCode: data.landDetails.farmerDistrict?.id,
    landDistrictName: data.landDetails.farmerDistrict?.value,
    landBlockCode: data.landDetails.farmerBlock?.id,
    landBlockName: data.landDetails.farmerBlock?.value,
    landPanchayatCode: data.landDetails.farmerGramPanchayat?.id,
    landPanchayatName: data.landDetails.farmerGramPanchayat?.value,
    landVillageCode: data.landDetails.farmerVillage?.id,
    landVillageName: data.landDetails.farmerVillage?.value,
    sectionApply: true,
  };

  targetStructure.dfsSchemeApplication.schemeApplication.landDetails =
    data.appliedComponentScreenHorti?.groupDetails?.map((detail) => ({
      khataNo: detail.farmerKhataNumber,
      khasraNo: detail.farmerKhasraNumber,
      areaInAcres: parseFloat(detail?.farmerLandArea)?.toFixed(2),
    })) || [];
}

export default LandInfoMapping;
