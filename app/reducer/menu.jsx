export const SaveLeftMenuOpen = "SaveLeftMenuOpen";
export const SaveLeftMenuId = "SaveLeftMenuId";

export function leftMenuOpen(state = false, action) {
    return action.type === SaveLeftMenuOpen ? action.value : state;
}

export function leftMenuId(state = 10, action) {
    return action.type === SaveLeftMenuId ? action.value : state;
}
