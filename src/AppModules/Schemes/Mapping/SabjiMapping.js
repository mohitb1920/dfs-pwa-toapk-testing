import targetStructure from "./MapFile";
import FarmerInfoMapping from "./FarmerInfoMapping";
import { TENANT_ID } from "../../../components/Utils";
import CropInfoMapping from "./CropInfoMapping";
import LandInfoMapping from "./LandInfoMapping";
import DocumentInfoMapping from "./DocumentInfoMapping";
function SabjiMapping(data, id, mdmsId) {
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
    data.appliedComponentsSabji2?.groupDetails?.map((detail) => ({
      khataNo: detail.farmerKhataNumber,
      khasraNo: detail.farmerKhasraNumber,
      areaInAcres: parseFloat(detail?.farmerLandArea)?.toFixed(2),
    })) || [];

  targetStructure.dfsSchemeApplication.schemeApplication.schemeSpecificAttributes =
    {
      componentCode: data.appliedComponentsSabji?.farmerPartName?.id,
      componentName: data.appliedComponentsSabji?.farmerPartName?.value,
      cropCode: data.appliedComponentsSabji?.subComponent?.id,
      cropName: data.appliedComponentsSabji?.subComponent?.value,
      farmerCat: data.appliedComponentsSabji2?.farmerLandType?.valueHindi,
      unit: data.appliedComponentsSabji?.farmerPartName?.id === "1" ? "No." : "Acre",
      appliedSeedQtyUnit: data.appliedComponentsSabji?.seedQuantity?.unitHindi,
      appliedSeedQty: data.appliedComponentsSabji?.seedQuantity?.value,
      appliedArea: data.appliedComponentsSabji?.areaApplied?.value,
      appliedNo: data.appliedComponentsSabji?.noOfBeechra,
      selfDeclaration: data.requiredDocuments.accept,
    };

  targetStructure.dfsSchemeApplication.additionalFields.fields = [
    { key: "boundary", value: data.farmerData.Individual.address[0].villageLG },
    { key: "mdmsId", value: mdmsId },
  ];

  return targetStructure;
}

export default SabjiMapping;
