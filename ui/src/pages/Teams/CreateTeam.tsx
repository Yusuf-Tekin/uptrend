import { Field, Form, Formik, FormikValues } from "formik";
import { useState } from "react";
import Upload from "../../components/Upload/Upload";
import * as Yup from "yup";
import FormError from "../../components/Error/FormError";
import axios from "../../config/axios";
import { useAuth } from "../../Provider/AuthContext";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../store/hooks";
import { addTeam,removeTeam } from "../../store/features/UserSlice";
import { ShowError } from "../../helper/ShowError/ShowError";

interface IProps {
  popupHandle?: Function;
}

const CreateTeam: React.FC<IProps> = ({ popupHandle }) => {
  const createTeamInitialValues = {
    teamName: "",
    about: "",
  };

  const { token } = useAuth();

  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleCreateTeam = (
    values: FormikValues,
    { resetForm }: { resetForm: Function }
  ) => {
    const formData = new FormData();

    setLoading(true);

    if (file) {
      formData.append("image", file);
    }

    formData.append("name", values.teamName);
    formData.append("about", values.about);

    axios(token || undefined)
      .post("/team/create", formData)
      .then((res) => {
        const responseData = res.data;
        const { code } = responseData;

        if (code !== 200) {
          throw new Error();
        } else {
          const { message, data } = responseData;
          toast.success(message);
          dispatch(addTeam(data));
        }

        if (popupHandle) {
          popupHandle(false);
        }

        resetForm();
      })
      .catch((err) => {
        ShowError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createTeamValidationSchema = Yup.object().shape({
    teamName: Yup.string().trim().required("Required field!"),
  });

  return (
    <div className=" justify-center items-center px-3 py-4 2xl:w-1/3 xl:w-1/3 lg:w-1/3 md:w-1/2 sm:w-1/2 mx-2 bg-white rounded-lg flex flex-col">
      <div className="text-center flex flex-col">
        <span className="text-slate-800 font-bold text-xl">
          Create New Team 😀
        </span>
        <span className="text-slate-600 text-sm my-1">
          Create team and start invite members for development new project!
        </span>
      </div>
      <div className="w-full">
        <div className="w-full flex justify-center my-5">
          <Upload setFile={setFile} />
        </div>
        <Formik
          initialValues={createTeamInitialValues}
          onSubmit={handleCreateTeam}
          validationSchema={createTeamValidationSchema}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col gap-y-5">
              <div className="flex flex-col items-start justify-center">
                <div className="flex justify-between items-end w-full my-1">
                  <label
                    className="text-xs font-semibold text-slate-700"
                    htmlFor="teamName"
                  >
                    Team Name
                  </label>
                  {errors.teamName && touched.teamName && (
                    <FormError message={errors.teamName} />
                  )}
                </div>
                <Field
                  className="input w-full"
                  id="teamName"
                  name="teamName"
                  placeholder="Team Name"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="about"
                  className="text-xs font-semibold text-slate-700 my-1"
                >
                  Team About
                </label>
                <Field
                  className="input"
                  id="about"
                  name="about"
                  placeholder="Team About"
                />
              </div>

              <button
                disabled={loading}
                className="btn btn-primary"
                type="submit"
              >
                Create
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateTeam;
