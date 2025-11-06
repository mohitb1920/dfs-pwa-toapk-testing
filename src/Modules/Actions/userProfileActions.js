import { USER_PROFILE } from "../Constants/schemesConstants";

export const userProfileData = (action) => ({
  type: USER_PROFILE,
  payload: action,
});
