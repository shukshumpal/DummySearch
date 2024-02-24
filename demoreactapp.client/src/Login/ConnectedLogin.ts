import { Login, loginProps } from "./Login";
import { loginCurrentUser } from "../Services/LoginServices";
import { MapDispatchToProps, connect } from "react-redux";

type dispachProps = Pick<loginProps, "loginUser">;
type stateProps = {};
type ownProps = {};

const mapDispatchToProps: MapDispatchToProps<dispachProps, ownProps> = () => {
  return {
    loginUser: loginCurrentUser,
  };
};

// const mapStateToProps = () => {
//   return {};
// };

export const ConnectedLogin = connect<stateProps, loginProps>(
  null,
  mapDispatchToProps
)(Login);
