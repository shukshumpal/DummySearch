import { userCredentials } from "../Login/Login";

export const loginCurrentUser = (userDetails: userCredentials) => {
  console.log(userDetails);
  alert("userLoggedIn");
};
