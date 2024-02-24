import { createStore } from "redux";
import { userReducer } from "../Reducers/RootReducer";


export const store = createStore(userReducer);