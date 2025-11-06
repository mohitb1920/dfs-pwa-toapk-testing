import { SELECTED_SCHEME_DETAILS } from "../Constants/schemesConstants";

export const setSelectedSchemeData = (action) => ({
  type: SELECTED_SCHEME_DETAILS,
  payload: action,
});
