import { Request } from "../../../services/Request";
import { urls } from "../../../Utils/Urls";

async function applyScheme(data) {
  
  try {
    const response= Request({        
        url:urls.SchemeApply,
        data :data,
        userService :true,
      })   
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
}

export default applyScheme;