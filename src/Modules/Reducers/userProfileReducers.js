import { USER_PROFILE, } from "../Constants/schemesConstants";

const nodeState = JSON.parse(localStorage.getItem("DfsWeb.user-info"));

const profileReducer = (state = nodeState, action) => {
  switch (action.type) {
    case USER_PROFILE:
      return {
        ...state,
        name: action.payload,
      };

    case "RESET_PROFILE":
      return null;

    default:
      return state;
  }
};

export default profileReducer;
