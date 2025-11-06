import { SELECTED_SCHEME_DETAILS } from "../Constants/schemesConstants";

const nodeState = {
  selectedScheme: {},
  applicationFormData: {},
};

const schemesReducers = (state = nodeState, action) => {
  switch (action.type) {
    case SELECTED_SCHEME_DETAILS:
      return {
        ...state,
        selectedScheme: action.payload,
      };

    default:
      return state;
  }
};

export default schemesReducers;
