import {
  SOIL_HEALTH_CARD_DBTID,
  SOIL_HEALTH_CARD_TEST_GRID,
  SOIL_HEALTH_CARDS,
} from "../Constants/schemesConstants";

export const soilHealthCardData = (action) => ({
  type: SOIL_HEALTH_CARDS,
  payload: action,
});
export const soilHealthCardDbtId = (action) => ({
  type: SOIL_HEALTH_CARD_DBTID,
  payload: action,
});
export const soilHealthCardTestGrid = (action) => ({
  type: SOIL_HEALTH_CARD_TEST_GRID,
  payload: action,
});
