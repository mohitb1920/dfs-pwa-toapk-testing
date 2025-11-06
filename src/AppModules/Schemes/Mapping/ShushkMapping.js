import targetStructure from "./MapFile";
import FarmerInfoMapping from "./FarmerInfoMapping";
import { TENANT_ID } from "../../../components/Utils";
import CropInfoMapping from "./CropInfoMapping";
import LandInfoMapping from "./LandInfoMapping";
import DocumentInfoMapping from "./DocumentInfoMapping";
function ShushkMapping(data, id, mdmsId) {
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
  LandInfoMapping(targetStructure, data);
  DocumentInfoMapping(targetStructure, data);

  targetStructure.dfsSchemeApplication.schemeApplication.landDetails =
    data.appliedComponentsLandDetails?.subGroupDetails?.map((detail) => ({
      khataNo: detail.farmerKhataNumber,
      khasraNo: detail.farmerKhasraNumber,
      areaInAcres: parseFloat(detail?.farmerLandArea)?.toFixed(2),
    })) || [];

  targetStructure.dfsSchemeApplication.schemeApplication.cdpCropDemand =
    data.appliedComponentsLandDetails?.plantDetails?.map((plant) => ({
      cropCode: plant.fruitPlant.id,
      cropName: plant.fruitPlant.value,
      appliedArea: plant.plantsRakwa,
      appliedPlant: plant.appliedPlants,
    })) || [];

  targetStructure.dfsSchemeApplication.schemeApplication.schemeSpecificAttributes =
    {
      componentCode: data.appliedComponentsLandDetails?.component?.id,
      componentName: data.appliedComponentsLandDetails?.component?.value,
      selfDeclaration: data.requiredDocuments.accept,
      appliedAreaQuantity: data.appliedComponentsLandDetails?.totalArea,
    };

  targetStructure.dfsSchemeApplication.additionalFields.fields = [
    { key: "boundary", value: data.farmerData.Individual.address[0].villageLG },
    { key: "mdmsId", value: mdmsId },
  ];

  return targetStructure;
}

export default ShushkMapping;
