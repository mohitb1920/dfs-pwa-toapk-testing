import { SELECTED_WEATHER_LOCATION } from "../Constants/schemesConstants";

export const weatherLocationData = (action) => ({
  type: SELECTED_WEATHER_LOCATION,
  payload: action,
});
