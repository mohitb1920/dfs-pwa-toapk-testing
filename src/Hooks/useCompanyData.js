import { useQuery, useQueryClient } from "react-query";
import { SchemeService } from "../services/Schemes";

export default function useCompanyData (schemeId, cropCode) {
  const client = useQueryClient();

  const fetchCompanyData = async () => {
    const company = await SchemeService.company(schemeId, cropCode);
    return trimCompanyData(company);
  };

  const result = useQuery(
    ["fetchCompanyData", schemeId, cropCode],
    fetchCompanyData
  );


  return {
    ...result,
    revalidate: () => client.refetchQueries(["fetchCompanyData"]),
  };
};

const trimCompanyData = (companyData) => {
    const requiredFields = ["Address","CompanyCode","CompanyName","MobileNumber"];
    let result = [];
    companyData?.forEach((obj) => {
        result.push({
            id: obj[requiredFields[1]],
            value: obj[requiredFields[2]],
            address: obj[requiredFields[0]],
            mobileNumber: obj[requiredFields[3]]
        })
    });
    return result;
}
