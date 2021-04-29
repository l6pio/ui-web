export const SaveReportJob = "SaveReportJob";
export const SaveURLListOrder = "SaveURLListOrder";

export function reportJob(state = {}, action) {
    return action.type === SaveReportJob ? action.value : state;
}

export function urlListOrder(state = {orderBy: "count", order: "-"}, action) {
    return action.type === SaveURLListOrder ? action.value : state;
}
