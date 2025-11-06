import targetStructure from "./MapFile";
import FarmerInfoMapping from "./FarmerInfoMapping";
import { convertFromAcre, TENANT_ID } from "../../../components/Utils";
import CropInfoMapping from "./CropInfoMapping";
import LandInfoMapping from "./LandInfoMapping";
import DocumentInfoMapping from "./DocumentInfoMapping";
function HortiMapping(data, id, mdmsId) {
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
  CropInfoMapping(targetStructure, data);
  LandInfoMapping(targetStructure, data);
  DocumentInfoMapping(targetStructure, data);

  if (mdmsId === "SCHEME014") {
    targetStructure.dfsSchemeApplication.schemeApplication.schemeSpecificAttributes =
      {
        cropCode: data.componentsAndLandDescription?.component.id,
        cropName: data.componentsAndLandDescription?.component?.value,
        cropUnit: data.componentsAndLandDescription?.component?.cropUnits,
        selfDeclaration: data.requiredDocuments.accept,
        appliedAreaQuantity: data.componentsAndLandDescription?.totalArea,
        userIP: data.ipAddress,
        farmerCat: data.componentsAndLandDescription?.farmerType?.valueHindi,
        waterPump: data.componentsAndLandDescription?.irrigationPump.valueHindi,
        irrigationSource:
          data.componentsAndLandDescription?.irrigationSource.valueHindi,
      };

    targetStructure.dfsSchemeApplication.schemeApplication.landDetails =
      data.componentsAndLandDescription?.groupDetails?.map((detail) => ({
        khataNo: detail.farmerKhataNumber,
        khasraNo: detail.farmerKhasraNumber,
        areaInAcres: parseFloat(detail?.farmerLandArea)?.toFixed(2),
      })) || [];
  }
  if (mdmsId === "SCHEME064") {
    targetStructure.dfsSchemeApplication.schemeApplication.schemeSpecificAttributes =
      {
        cropCode: data.appliedComponentScreenHorti?.farmerPartName?.id,
        cropName: data.appliedComponentScreenHorti?.farmerPartName?.value,
        cropUnit: data.appliedComponentScreenHorti?.farmerPartName?.cropUnits,
        selfDeclaration: data.requiredDocuments.accept,
        // appliedAreaQuantity: data.componentsAndLandDescription?.totalArea,
        userIP: data.ipAddress,
        farmerCat: data.appliedComponentScreenHorti?.farmerLandType?.valueHindi,
        waterPump: data.appliedComponentScreenHorti?.irrigationPump.valueHindi,
        irrigationSource:
          data.appliedComponentScreenHorti?.irrigationSource.valueHindi,
      }
  }
    targetStructure.dfsSchemeApplication.additionalFields.fields = [
      {
        key: "boundary",
        value: data.farmerData.Individual.address[0].villageLG,
      },
      { key: "mdmsId", value: mdmsId },
    ];

  if (mdmsId === "SCHEME031" || mdmsId === "SCHEME033") {
    if (data.appliedComponentScreenHorti?.farmerPartName?.id === "507") {
      targetStructure.dfsSchemeApplication.schemeApplication.schemeSpecificAttributes.appliedAreaDropDown =
        data.appliedComponentScreenHorti?.totalAppliedArea;

      targetStructure.dfsSchemeApplication.schemeApplication.varietyDemand =
        data.appliedComponentScreenHorti?.bananaDetails?.map((object) => {
          const fruitPlant = object?.["fruitPlant"];
          const appliedArea = object?.["appliedAreaBanana"];

          return {
            appliedArea: appliedArea,
            varietyCode: fruitPlant?.index,
            varietyName: fruitPlant?.value,
          };
        }) || [];
    }
  }
  if (["SCHEME060", "SCHEME062"].includes(mdmsId)) {
    const attributes =
      targetStructure.dfsSchemeApplication.schemeApplication
        .schemeSpecificAttributes;
    const supplierData = data?.appliedComponentScreenHorti?.supplierName;
    const subComponent = data?.appliedComponentScreenHorti?.farmerSubPartName;
    const component = data?.appliedComponentScreenHorti?.farmerPartName;
    if (supplierData?.id) {
      attributes.companyBased = "Y";
      attributes.companyName = supplierData?.value;
      attributes.companyId = supplierData?.id;
    }
    if (subComponent?.id) {
      attributes.cropCode = subComponent?.id;
      attributes.cropName = subComponent?.value;
    }
    attributes.appliedAreaDropDown = convertFromAcre(
      data.appliedComponentScreenHorti?.appliedHortiArea,
      component?.cropUnits
    );
  }

  return targetStructure;
}

export default HortiMapping;
