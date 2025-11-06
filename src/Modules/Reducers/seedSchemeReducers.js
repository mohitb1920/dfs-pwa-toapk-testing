import { SEED_SCHEME_DETAILS } from "../Constants/schemesConstants";

const nodeState = {
    seed : {}
}

const seedSchemeReducers = ( state = nodeState, action) =>{
    switch(action.type) {
        case SEED_SCHEME_DETAILS : 
            return {
                ...state,
                seed : action.payload,
            }
        
        default:
            return state;
    }
}

export default seedSchemeReducers;