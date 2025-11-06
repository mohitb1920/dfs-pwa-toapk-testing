import { SEED_SCHEME_DETAILS } from "../Constants/schemesConstants";

export const seedSchemeData = (action) => ({
    type: SEED_SCHEME_DETAILS,
    payload : action,
});