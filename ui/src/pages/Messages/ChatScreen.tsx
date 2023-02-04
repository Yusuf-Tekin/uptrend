import { Field, Form, Formik, FormikValues } from "formik";
import UserProfile from "../../components/UserProfile/UserProfile";
import { ITeam } from "../../types/types";
import * as Yup from "yup";
import FormError from "../../components/Error/FormError";
import {
  emitMessage,
  onMessage,
  readMessage,
  socket,
} from "../../Provider/SocketIO.service";
import { useAuth } from "../../Provider/AuthContext";
import dateDiff from "../../helper/Date/DateDiff";
import { useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { addMessage } from "../../store/features/UserSlice";
import { RiDeleteBinLine } from "react-icons/ri";
import Menu, { MenuItem } from "../../components/Menu/Menu";
import { MdOutlineReportProblem } from "react-icons/md";
import Alert from "../../components/Alert/Alert";
import { AlertTypes } from "../../helper/AlertTypes/AlertTypes";
interface ChatScreenProp {
  team: ITeam;
}

const ChatScreen: React.FC<ChatScreenProp> = ({ team }) => {
  const backend = process.env.REACT_APP_BACKEND;

  const { user } = useAuth();

  const initialValues = {
    message: "",
  };

  const messageFormValidation = Yup.object().shape({
    message: Yup.string().trim().required("Required Field"),
  });

  const dispatch = useAppDispatch();

  const sendMessage = (
    values: FormikValues,
    { resetForm }: { resetForm: Function }
  ) => {
    if (user) {
      emitMessage("send-message", {
        teamId: team.id,
        message: values.message,
        userId: user.id,
      });
    }
    resetForm();
  };

  const otherUserMessageItems: MenuItem[] = [
    {
      id: 1,
      text: "Report",
      handle: () => {
        alert("Report Message");
      },
      color: "text-red-500",
      icon: <MdOutlineReportProblem size={"1.2em"} />,
    },
  ];

  const authorMessageItems: MenuItem[] = [
    {
      id: 1,
      text: "Delete",
      handle: () => {
        alert("Mesajı Sil");
      },
      color: "text-red-500",
      icon: <RiDeleteBinLine size={"1.2em"} />,
      validation() {
        return true;
      },
    },
  ];

  return (
    <div className="w-full h-full relative">
      <div className="w-full overflow-y-hidden h-full">
        <div className="sticky top-0 py-3 flex justify-start items-center shadow-sm w-full gap-x-2 px-3">
          <img src={backend + team.image} className="w-16 h-16 rounded-full" />
          <span className="text-lg font-semibold">{team.name}</span>
        </div>
        <div className="overflow-y-auto h-full pb-40 bg-stone-200">
          {team.messages.map((msg, index) => {
            return (
              <div
                key={index}
                className="flex justify-start items-center gap-x-1 px-3 py-2 relative"
              >
                <UserProfile
                  size="w-12 h-12 self-start rounded-tr-none"
                  fullname={msg.author?.fullname || "User Message"}
                />
                <div className="flex flex-col flex-1 bg-white rounded-lg rounded-tl-none px-3 py-1 transition-all">
                  <span className="font-semibold text-slate-700 text-opacity-40">
                    {msg.author.username}
                  </span>
                  <span className="flex flex-1 mt-1">{msg.message}</span>
                  <span className="text-xs font-semibold opacity-30">
                    {dateDiff(msg.created_at)}
                  </span>
                </div>
                <div className="absolute right-8">
                  <Menu
                    items={
                      msg.author.id === user?.id
                        ? authorMessageItems
                        : otherUserMessageItems
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute z-10 bottom-0 left-0 w-full flex gap-x-2 items-center bg-stone-200 py-3 px-3">
        {team.is_active === 1 ? (
          <Formik
            onSubmit={sendMessage}
            validationSchema={messageFormValidation}
            initialValues={initialValues}
          >
            {({ errors, touched }) => (
              <Form className="flex items-center w-full gap-x-2">
                <div className="relative flex items-center w-full">
                  <Field
                    name="message"
                    className="input w-full"
                    placeholder="Message"
                  ></Field>
                  <div className="absolute right-2">
                    {errors.message && touched.message ? (
                      <FormError message={errors.message} />
                    ) : null}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary rounded-md">
                  Send
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="flex justify-center items-center w-full">
            <Alert
              message="Team is deactive.No send message! Please contact team leader!"
              type={AlertTypes.ERROR}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
