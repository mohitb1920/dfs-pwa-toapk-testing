function DocumentInfoMapping(targetStructure, data) {
  const documents = [];

  if (data.applicationType === "समूह") {
    if (
      data.applicantDetails?.GroupDoc?.find((doc) => doc.status === "success")
        ?.fileStoreId ||
      data.groupDetailsComponent?.GroupDoc?.find(
        (doc) => doc.status === "success"
      )?.fileStoreId
    )
      documents.push({
        docFileName: "GroupDoc",
        fileStoreId:
          data.applicantDetails?.GroupDoc?.[0]?.fileStoreId ||
          data.groupDetailsComponent.GroupDoc[0].fileStoreId,
      });
  }

  const requiredDocs = [
    "LandDoc",
    "PhotoDoc",
    "LeaseDoc",
    "RecieptDoc",
    "HoneyTrainning",
    "LayoutPlanDoc",
    "EstimateDoc",
    "TrainingDoc",
  ];

  requiredDocs.forEach((docName) => {
    const fileStoreId = data.requiredDocuments?.[docName]?.find(
      (doc) => doc.status === "success"
    )?.fileStoreId;
    if (fileStoreId) {
      documents.push({
        docFileName: docName,
        fileStoreId: fileStoreId,
      });
    }
  });

  targetStructure.dfsSchemeApplication.schemeApplication.documents = documents;
}

export default DocumentInfoMapping;
