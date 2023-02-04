import { Field, Form, Formik, FormikValues, useFormikContext } from "formik";
import { Roles } from "../../helper/Roles/Roles";
import FormError from "../Error/FormError";
import { useState, useEffect } from "react";
import * as Yup from "yup";
import UseAnimations from "react-useanimations";
import checkbox from "react-useanimations/lib/checkBox";
import axios from "../../config/axios";
import { useAuth } from "../../Provider/AuthContext";
import { ShowError } from "../../helper/ShowError/ShowError";
import { useAppDispatch } from "../../store/hooks";
import { addPost } from "../../store/features/UserSlice";
import { toast } from "react-toastify";

interface ICreatePost {
  teamId: number;
  popupHandle: Function;
}

const CreatePost: React.FC<ICreatePost> = ({
  teamId,
  popupHandle,
}) => {
  const [noComments, setNoComments] = useState<boolean>(false);

  const [pending, setPending] = useState<boolean>(false);

  const { user, token } = useAuth();

  const dispatch = useAppDispatch();

  const initialValues = {
    postText: "",
    role: "",
  };

  const onCreatePost = (
    values: FormikValues,
    { resetForm }: { resetForm: Function }
  ) => {
    setPending(true);
    const { postText, role } = values;

    const newPostText = postText.replace(/\n/g, " <br/> ");

    axios(token || "")
      .post("/post/create", {
        postText: newPostText,
        role,
        teamId,
        isComments: !noComments,
      })
      .then((res) => {
        const { code,message, data } = res.data;
        if (code !== 200) {
          throw new Error();
        } else {
          toast.success(message);
          dispatch(addPost({
            teamId,
            post:data.createPost
          }));
          popupHandle(false);
          resetForm();
        }
      })
      .catch((err) => {
        ShowError(err);
      })
      .finally(() => {
        setPending(false);
      });
  };

  const formValidation = Yup.object().shape({
    postText: Yup.string().trim().required("Required field!"),
    role: Yup.string().required("Required field!"),
  });

  return (
    <div className="justify-center items-center px-3 py-4 2xl:w-1/3 xl:w-1/3 lg:w-1/3 md:w-1/2 sm:w-1/2 mx-2 bg-white rounded-lg flex flex-col">
      <div className="text-center flex flex-col">
        <span className="text-slate-800 font-bold text-xl">
          Create New Invite Post 😀
        </span>
        <span className="text-slate-600 text-sm my-1">
          Start recruiting new members to your team.
        </span>
      </div>
      <div className="w-full">
        <Formik
          initialValues={initialValues}
          validationSchema={formValidation}
          onSubmit={onCreatePost}
        >
          {({ errors, touched }) => (
            <Form className="flex flex-col gap-y-5">
              <div className="flex flex-col items-start justify-center">
                <div className="flex justify-between items-end w-full my-1">
                  <label
                    className="text-xs font-semibold text-slate-700"
                    htmlFor="postText"
                  >
                    Post Content
                  </label>
                  {errors.postText && touched.postText && (
                    <FormError message={errors.postText} />
                  )}
                </div>
                <Field
                  as="textarea"
                  className="input w-full resize-none"
                  rows="10"
                  id="postText"
                  name="postText"
                  placeholder="Post Content"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex justify-between items-end w-full my-1">
                  <label
                    className="text-xs font-semibold text-slate-700"
                    htmlFor="role"
                  >
                    Team Role
                  </label>
                  {errors.role && touched.role && (
                    <FormError message={errors.role} />
                  )}
                </div>
                <Field
                  as="select"
                  className="input cursor-pointer"
                  id="role"
                  name="role"
                  placeholder="Team Role"
                >
                  <option>SELECT</option>
                  {Roles.map((role, index) => (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  ))}
                </Field>

                <div className="flex gap-x-1 mt-5 mb-2 items-center">
                  <UseAnimations
                    reverse={noComments}
                    onClick={() => setNoComments((prev) => !prev)}
                    size={24}
                    animation={checkbox}
                  ></UseAnimations>
                  <label
                    htmlFor="isComments"
                    className="text-[14px] font-semibold text-slate-700"
                  >
                    No Comments
                  </label>
                </div>
              </div>

              <button
                disabled={pending}
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

export default CreatePost;
