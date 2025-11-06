import { useQuery, useQueryClient } from "react-query";
import { MdmsService } from "../services/MDMS";
import { PGRService } from "../services/PGR";
import { FarmerService } from "../services/Farmer";

const getDetailsRow = ({ id, service, complaintServiceDef }) => ({
  complaintNo: id,
  applicationStatus: service.applicationStatus,
  category: complaintServiceDef?.length === 0 ? 'Other' : complaintServiceDef?.category,
  subCategory: complaintServiceDef?.subCategory,
  subSubCategory:complaintServiceDef?.name,
  description: service.description,
});

const getFarmerDetailsObj = (farmerDetails, uuid) => {
  const {
    fatherHusbandName='',
    dateOfBirth='',
    individualCast='',
    gender='',
    mobileNumber='',
    individualType='',
    address='',
    name='',
    identifiers=''
  } = farmerDetails || {};

  return {
    farmerName: name?.givenName,
    fatherName: fatherHusbandName,
    dob: dateOfBirth,
    caste: individualCast,
    gender,
    mobileNumber,
    farmerType: individualType,
    district: address[0]?.district,
    block: address[0]?.block,
    panchayat: address[0]?.panchayat,
    village: address[0]?.village,
    aadharNumber: identifiers.filter((obj) => obj.identifierType === 'AADHAAR')[0]?.identifierId || 'No Adhar',
    dbtId: identifiers.filter((obj) => obj.identifierType === 'DBTID')[0]?.identifierId || 'No DBT',
    uuid
  };
};

const transformDetails = ({ id, service, workflow, complaintServiceDef}) => {
  service.businessService = complaintServiceDef?.workflow;
  return {
    details: getDetailsRow({ id, service, complaintServiceDef }),
    workflow: workflow,
    service,
  };
};

const fetchComplaintDetails = async (tenantId, id) => {
  const serviceDefs = await MdmsService.getServiceDefs(tenantId, "PGR");
  const { service, workflow } = (await PGRService.search(tenantId, { serviceRequestId: id })).ServiceWrappers[0] || {};
  sessionStorage.setItem("complaintDetails", { service, workflow });
  if (service && workflow && serviceDefs) {
    const farmerResponse = await FarmerService.search(service?.citizen?.uuid);
    let farmerDetails = {};
    if (farmerResponse !== null) {
      farmerDetails = getFarmerDetailsObj(
        farmerResponse,
        service?.citizen?.uuid
      );
    }
    const complaintServiceDef = serviceDefs.filter((def) => def.serviceCode === service.serviceCode)[0];
    const details = transformDetails({ id, service, workflow, complaintServiceDef});
    details.farmerDetails = farmerDetails;
    return details;
  } else {
    return {};
  }
};

const useComplaintDetails = ({ tenantId, id, fetchedData}) => {
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery(["complaintDetails", tenantId, id], () => fetchComplaintDetails(tenantId, id), {enabled: !fetchedData});
  return { isLoading, error, complaintDetails: data, revalidate: () => queryClient.invalidateQueries(["complaintDetails", tenantId, id]) };
};

export default useComplaintDetails;
