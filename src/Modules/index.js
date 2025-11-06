import { combineReducers } from "redux";
import schemesDetails from "./Reducers/schemesReducers";
import mobileNumberState from "./Reducers/mobileNumberState";
import notificationAlert from "./Reducers/notificationState";
import seedScheme from "./Reducers/seedSchemeReducers";
import agentGrmDetails from "./Reducers/agentGrmReducers";
import weatherLocation from "./Reducers/weatherReducer";
import soilHealthReducer from "./Reducers/soilHealthReducers";
import profileData from "./Reducers/userProfileReducers";

export default combineReducers({
  schemesDetails,
  mobileNumberState,
  notificationAlert,
  seedScheme,
  agentGrmDetails,
  weatherLocation,
  soilHealthReducer,
  profileData,
});
