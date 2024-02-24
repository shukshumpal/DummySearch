import { userAction } from "../Actions/RootActions";
import { User } from "../StoreModels/StoreModels";


const initialState:User={
    userName:'',
    userEmail:'',
    gender:''
}

export const userReducer=(state:User = initialState, action:userAction)=>{
    let userState:User={...state};
    switch(action.type) {
        case 'UPDATE_LOGGEDIN_USER':
          userState.userName=action.payload.userName;
          userState.userEmail=action.payload.userEmail;
          userState.gender=action.payload.gender;
          return userState;
        default:
          return state;
      }

}

