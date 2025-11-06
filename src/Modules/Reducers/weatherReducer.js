import { SELECTED_WEATHER_LOCATION } from "../Constants/schemesConstants";

const nodeState = {
  location: JSON.parse(localStorage.getItem("DfsWeb.selectedWeatherLocation")),
};

const weatherReducer = (state = nodeState, action) => {
  switch (action.type) {
    case SELECTED_WEATHER_LOCATION:
      return {
        ...state,
        location: action.payload,
      };

    default:
      return state;
  }
};

export default weatherReducer;
