import { useQuery, useQueryClient } from "react-query";
import { MdmsService } from "../services/MDMS";
import { PGRService } from "../services/PGR";

const getDetailsRow = ({ id, service, complaintServiceDef }) => ({
  complaintNo: id,
  applicationStatus: service.applicationStatus,
  category: complaintServiceDef?.length === 0 ? 'Other' : complaintServiceDef?.category,
  subCategory: complaintServiceDef?.subCategory,
  subSubCategory:complaintServiceDef?.name,
  description: service.description,
});

const getFarmerDetailsObj = (userDetails, complaintServiceDef) => {
  const {
    userType='',
    dbtId='',
    email='',
    mobileNumber='',
    address='',
    name='',
  } = userDetails || {};

  return {
    name,
    email,
    userType,
    mobileNumber,
    district: address[0]?.district,
    block: address[0]?.block,
    panchayat: address[0]?.panchayat,
    village: address[0]?.village,
    dbtId: dbtId || 'No DBT',
    category: complaintServiceDef?.length === 0 ? 'Other' : complaintServiceDef?.category,
    subCategory: complaintServiceDef?.subCategory,
  };
};

const transformDetails = ({ id, service, workflow, complaintServiceDef, processInstances }) => {
    service.businessService = complaintServiceDef?.workflow;
  return {
    details: getDetailsRow({ id, service, complaintServiceDef }),
    workflow,
    service,
    processInstances,
  };
};

const fetchComplaintDetails = async ({tenantId, id, isSupportUser, complaintData}) => {
  const serviceDefs = await MdmsService.getServiceDefs(tenantId, "PGR");
  if (isSupportUser) {
    complaintData = await PGRService.supportSearch(tenantId, {serviceRequestId: id});
  }
  const response = complaintData?.data || {};
  const { ServiceWrappers, processInstances, techSupportList } = response || {};
  
  if (ServiceWrappers && processInstances && serviceDefs) {
    const { service, workflow } = ServiceWrappers?.[0];
    sessionStorage.setItem("complaintDetails", { service, workflow });
    const complaintServiceDef = serviceDefs.filter((def) => def.serviceCode === service.serviceCode)[0];
    const details = transformDetails({ id, service, workflow, complaintServiceDef, processInstances });
    const userDetails = getFarmerDetailsObj(techSupportList?.[0], complaintServiceDef);
    details.farmerDetails = userDetails;
    return details;
  } else {
    return {};
  }
};

const useSupportComplaintDetails = ({ tenantId, id, isSupportUser, complaintData, openOtpModal}) => {
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery(
    ["supportComplaintDetails", tenantId, id],
    () => fetchComplaintDetails({ tenantId, id, isSupportUser, complaintData }),
    { enabled: !openOtpModal && ( isSupportUser || complaintData !== null ) }
  );
  return { isLoading, error, complaintDetails: data, revalidate: () => queryClient.invalidateQueries(["supportComplaintDetails", tenantId, id]) };
};

export default useSupportComplaintDetails;
