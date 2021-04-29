import {combineReducers} from "redux";
import {leftMenuId, leftMenuOpen} from "./menu";
import {reportJob, urlListOrder} from "./report";

const reducers = combineReducers({
    leftMenuOpen, leftMenuId, reportJob, urlListOrder
});

export default reducers;
