import { FarmerService } from "../services/Farmer";
import { Request } from "../services/Request";
import { urls } from "../Utils/Urls";


export const farmerData = async()=>{

  // const farmerDBTResponse= await farmerDBTData(dbtId);
  const storedData=localStorage.getItem("farmer.farmerInfo");
  let tokenData;
  if(storedData)
  tokenData=JSON.parse(storedData);
  const farmerResponse = await FarmerService.login(tokenData?.uuid);
  return farmerResponse;
}
export const farmerDBTData = async (dbtId) => {

    const data = {
      RequestInfo: {
        apiId: 'string',
        ver: 'string',
        ts: 0,
        action: 'string',
        did: 'string',
        key: 'string',
        msgId: 'string',
        requesterId: 'string',
      },
      Farmer: {
        dbtId,
      },
    };
    
    try {
      const response = await Request({
        url: urls.DBTUserInfo,
        data: data,
        useCache: true,
        farmerLogin:true,
      });
      return { data: response.data };
    } catch (error) {
      return { error };
    }
  };

