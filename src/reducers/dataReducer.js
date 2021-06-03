import { FETCH_DATA } from "../actions/actionType";

const initState = {
    data : "",
    company : ""
}

export default function dataReducer(state=initState, action){
    switch(action.type){
        case FETCH_DATA:
            return {
                ...state,
                company : action.company,
                data : action.data
            }
        default:
            return state
    }
}