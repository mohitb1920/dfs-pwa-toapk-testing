import targetStructure from "./MapFile";
import FarmerInfoMapping from "./FarmerInfoMapping";
import { TENANT_ID } from "../../../components/Utils";
import CropInfoMapping from "./CropInfoMapping";
import LandInfoMapping from "./LandInfoMapping";
import DocumentInfoMapping from "./DocumentInfoMapping";
import MushAppliedMapping from "./MushAppliedMapping";
function MushroomMapping(data, id, mdmsId) {
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
  MushAppliedMapping(targetStructure, data);
  LandInfoMapping(targetStructure, data);
  DocumentInfoMapping(targetStructure, data);

  targetStructure.dfsSchemeApplication.schemeApplication.landDetails =
    data.componentsMushroomHut?.groupDetails?.map((detail) => ({
      khataNo: detail.farmerKhataNumber,
      khasraNo: detail.farmerKhasraNumber,
      areaInAcres: parseFloat(detail?.farmerLandArea)?.toFixed(2),
    })) || [];

  targetStructure.dfsSchemeApplication.additionalFields.fields = [
    { key: "boundary", value: data.farmerData.Individual.address[0].villageLG },
    { key: "mdmsId", value: mdmsId },
  ];

  return targetStructure;
}

export default MushroomMapping;
