import {
  SOIL_HEALTH_CARD_DBTID,
  SOIL_HEALTH_CARD_TEST_GRID,
  SOIL_HEALTH_CARDS,
} from "../Constants/schemesConstants";

const nodeState = {
  response: null,
  dbtID: null,
  testGrid: null,
};

const soilHealthReducer = (state = nodeState, action) => {
  switch (action.type) {
    case SOIL_HEALTH_CARDS:
      return {
        ...state,
        response: action.payload,
      };
    case SOIL_HEALTH_CARD_DBTID:
      return {
        ...state,
        dbtID: action.payload,
      };
    case SOIL_HEALTH_CARD_TEST_GRID:
      return {
        ...state,
        testGrid: action.payload,
      };

    default:
      return state;
  }
};

export default soilHealthReducer;
