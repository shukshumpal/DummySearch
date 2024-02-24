import { ReactElement } from "react";
import { ErrorMessage, Formik, FormikValues } from "formik";
import * as Yup from "yup";

export interface loginProps {
  loginUser: (userDetails: userCredentials) => any;
}
export interface userCredentials {
  email: string;
  password: string;
}
export const Login: React.FC<loginProps> = (
  props: loginProps
): ReactElement => {
  let credentials: userCredentials = { email: "", password: "" };

  const getCharacterValidationError = (str: string) => {
    return `Your password must have at least 1 ${str} character`;
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("plz enter correct email")
      .required("Email is required"),
    password: Yup.string()
      .required("plz enter a password")
      .min(8, "The password must have atleast 8 characters")
      .max(15, "The password must have atmost 15 characters")
      .matches(/[0-9]/, getCharacterValidationError("digit"))
      .matches(/[a-z]/, getCharacterValidationError("lowercase"))
      .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
  });

  type setSubmitFlag = (setSubmit: boolean) => void;

  const submitUserCredentials = (
    values: FormikValues,
    formikSetSumitHelper: setSubmitFlag
  ): void | Promise<any> => {
    let userDetails: userCredentials = {
      email: values.email,
      password: values.password,
    };
    props.loginUser(userDetails);
    formikSetSumitHelper(false);
  };

  const renderError = (message: string) => (
    <p className="help is-danger">{message}</p>
  );

  // const handleEmailBlur = (
  //   e: React.FocusEvent<HTMLInputElement, Element>,
  //   formikProps: FormikHandlers
  // ) => {
  //   e.preventDefault;
  //   formikProps.handleBlur(e);
  // };

  return (
    <Formik
      initialValues={credentials}
      validationSchema={validationSchema}
      onSubmit={(values: FormikValues, { setSubmitting }) => {
        submitUserCredentials(values, setSubmitting);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        /* and other goodies */
      }) => (
        <form onSubmit={handleSubmit}>
          <h2>Email : </h2>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
          />
          <br />
          <ErrorMessage name="email" render={renderError} />
          <br />
          <h2>Password : </h2>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            onBlur={(e) => {
              handleBlur(e);
            }}
            value={values.password}
          />
          <br />
          <ErrorMessage name="password" render={renderError} />
          <br />

          <button
            type="submit"
            disabled={
              isSubmitting ||
              (touched.email && errors.email != "") ||
              (touched.password && errors.password != "")
            }
          >
            Submit
          </button>
        </form>
      )}
    </Formik>
  );
};
