import {applyMiddleware, compose, createStore} from "redux";
import reducers from "../reducer/root";
import thunkMiddleware from "redux-thunk";

const loadState = () => {
    try {
        const serializedState = localStorage.getItem("l6p");
        if (!serializedState) return undefined;
        else return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

const saveState = (state) => {
    localStorage.setItem("l6p", JSON.stringify(state));
};

const persistedStore = loadState();
const store = createStore(reducers, persistedStore,
    compose(
        applyMiddleware(
            thunkMiddleware
        )
    )
);

store.subscribe(() => {
    saveState(store.getState());
});

export default store;
