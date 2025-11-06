import { GRM_FARMER_DETAILS } from "../Constants/schemesConstants";

const nodeState = {
  grmFarmerDetails: {},
};

const agentGrmReducers = (state = nodeState, action) => {
  switch (action.type) {
    case GRM_FARMER_DETAILS:
      return {
        ...state,
        grmFarmerDetails: action.payload,
      };

    default:
      return state;
  }
};

export default agentGrmReducers;
