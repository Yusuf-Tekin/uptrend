import axios from "axios";
import { Formik, FormikValues, Form, Field } from "formik";
import * as Yup from "yup";
import { useAuth } from "../../Provider/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Cookies } from "react-cookie";
import { ShowError } from "../../helper/ShowError/ShowError";
import { initiateSocketConnection } from "../../Provider/SocketIO.service";
function Signin() {
  const cookies = new Cookies();

  const { setLoading, setLoggedIn, setToken,setUser } = useAuth();
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
  };

  const handleLogin = async (values: FormikValues) => {
    setLoading(true);
    axios
      .post("http://localhost:5000/api/v1/auth/signin", {
        ...values,
      })
      .then(async (res) => {
        const { code } = res.data;
        if (code === 200) {
          const { token,user,message } = res.data.data;
          initiateSocketConnection();
          setToken(token);
          cookies.set("access_token", token, {
            path: "/",
            maxAge: 86400,
          });
          setUser(user);
          toast.success(message || "Session started!");
          setLoggedIn(true);
          navigate("/home");
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        setToken("");
        setLoggedIn(false);
        ShowError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const LoginSchema = Yup.object().shape({
    username: Yup.string().trim().required("Field is required"),
    password: Yup.string()
      .trim()
      .required("Field is required")
      .min(6, "Field can minimum 6 chr."),
  });

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleLogin}
        validationSchema={LoginSchema}
      >
        {({ errors, touched }) => (
          <Form className="flex flex-col gap-y-4">
            <label htmlFor="username">Username</label>
            <Field id="username" name="username" placeholder="Username" />
            {errors.username && touched.username && errors.username}

            <label htmlFor="email">Password</label>
            <Field
              id="password"
              name="password"
              placeholder="Password"
              type="password"
            />
            {errors.password && touched.password && errors.password}

            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default Signin;
