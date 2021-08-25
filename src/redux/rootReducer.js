import { combineReducers } from "redux";
import enquiry from "./reducers/enquiry" //import reducers which you have made.
const rootReducer = combineReducers({enquiry})//set that reducers in an object.
export default rootReducer;