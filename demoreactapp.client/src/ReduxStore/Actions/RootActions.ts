import { User } from "../StoreModels/StoreModels"

export interface userAction{
    type:string;
    payload:User;
}


export const updateLoggedInUser=(userPayload:User):userAction=>{
    return {
        type:'UPDATE_LOGGEDIN_USER',
        payload:userPayload
    }
}