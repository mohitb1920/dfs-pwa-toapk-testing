import targetStructure from "./MapFile";
import { TENANT_ID } from "../../../components/Utils";
import FarmerInfoMappingNIC from "./FarmerInfoMappingNIC";

function BKYYMapping(data, id, mdmsId) {
  targetStructure.dfsSchemeApplication.schemeId = id;
  targetStructure.dfsSchemeApplication.mdmsId = mdmsId;
  targetStructure.dfsSchemeApplication.tenantId = TENANT_ID;
  targetStructure.dfsSchemeApplication.rowVersion = 0;

  targetStructure.dfsSchemeApplication.schemeApplication.schemeName =
    data.schemeName;
  targetStructure.dfsSchemeApplication.schemeApplication.appliedDate =
    new Date().toISOString();

  FarmerInfoMappingNIC(targetStructure, data);

  targetStructure.dfsSchemeApplication.schemeApplication.schemeSpecificAttributes =
    {
      implId: data.lastFiveImplement?.implimentName?.id,
      malgujariReceiptNo: data.lastFiveImplement?.malgujariReceiptNo,
      sourceFund: data.lastFiveImplement?.sourceFund?.valueHindi,
      implementId1: data.lastFiveImplement?.implementId1?.id,
      implementId2: data.lastFiveImplement?.implementId2?.id,
      implementId3: data.lastFiveImplement?.implementId3?.id,
      implementId4: data.lastFiveImplement?.implementId4?.id,
      implementId5: data.lastFiveImplement?.implementId5?.id,
      receivingYear1: data.lastFiveImplement?.receivingYear1?.value,
      receivingYear2: data.lastFiveImplement?.receivingYear2?.value,
      receivingYear3: data.lastFiveImplement?.receivingYear3?.value,
      receivingYear4: data.lastFiveImplement?.receivingYear4?.value,
      receivingYear5: data.lastFiveImplement?.receivingYear5?.value,
    };

  targetStructure.dfsSchemeApplication.schemeApplication.landDetails =
    data.generalInformation?.landDescription?.map((detail) => ({
      khataNo: detail.farmerKhataNumber,
      khasraNo: detail.farmerKhasraNumber,
      areaInAcres: parseFloat(detail?.farmerLandArea)?.toFixed(2),
    })) || [];
    
    targetStructure.dfsSchemeApplication.schemeApplication.documents = [
      {
        docFileName: "CategoryDoc",
        fileStoreId: getFileStoreId(data.requiredDocuments, "CategoryDoc"),
      },
      {
        docFileName: "LPCDoc",
        fileStoreId: getFileStoreId(data.requiredDocuments, "LPCDoc"),
      },
      {
        docFileName: "EmptyDoc",
      },
    ];
    

  targetStructure.dfsSchemeApplication.additionalFields.fields = [
    { key: "boundary", value: data.farmerData.Individual.address[0].villageLG },
    { key: "mdmsId", value: mdmsId },
  ];

  return targetStructure;
}

const getFileStoreId = (documents, key) => {
  const docArray = documents?.[key];
  if (!docArray?.length) return null; // Return null if no documents exist
  return docArray.find(doc => doc.status === "success")?.fileStoreId || null; // Find success or return null
};

export default BKYYMapping;
