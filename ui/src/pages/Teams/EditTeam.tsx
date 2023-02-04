import React, { useState, useMemo, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import Alert from "../../components/Alert/Alert";
import { AlertTypes } from "../../helper/AlertTypes/AlertTypes";
import Sidebar from "../../layout/Sidebar";
import { ITeam, UserInterface } from "../../types/types";
import axios from "../../config/axios";
import { useAuth } from "../../Provider/AuthContext";
import { ShowError } from "../../helper/ShowError/ShowError";
import { Field, Form, Formik, FormikValues } from "formik";
import loading2 from "react-useanimations/lib/loading2";
import checkbox from "react-useanimations/lib/checkBox";
import UseAnimations from "react-useanimations";
import Upload from "../../components/Upload/Upload";
import MemberList from "../../components/Members/MemberList";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateTeam } from "../../store/features/UserSlice";
const EditTeam: React.FC = () => {
  const { teamId } = useParams();

  const [team, setTeam] = useState<ITeam | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useAuth();

  const [isActiveTeam, setActiveTeam] = useState(false);

  const [file, setFile] = useState<string | null>(null);

  const [requestPending, setRequestPending] = useState(false);

  const [members,setMembers] = useState<UserInterface[]>([]);


  const allTeams = useAppSelector((state) => state.user.teams)

  useEffect(() => {
    if(team) {
      const finded = allTeams.find(t => t.id === team.id);
      if(finded) {
        setMembers(finded.users);
      }
    }
  },[team,allTeams])

  const dispatch = useAppDispatch();

  const initialValues = {
    teamName: team?.name,
    teamAbout: team?.about,
    isActive: team?.is_active,
  };

  useEffect(() => {
    if (team) {
      setActiveTeam(team.is_active === 1 ? true : false);
    }
  }, [team]);

  const getTeam = () => {
    setLoading(true);
    axios(token || "")
      .get("/team/edit-team", {
        params: {
          teamId: teamId,
        },
      })
      .then((res) => {
        const { code, data } = res.data;

        if (code !== 200) {
          throw new Error();
        } else {
          
          setTeam(data);
        }
      })
      .catch((err) => {
        ShowError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useMemo(() => {
    getTeam();
  }, []);

  const onEditTeamComplete = (values: FormikValues) => {

    setRequestPending(true);

    const formData = new FormData();
    if (!team) return;

    if (file) {
      formData.append("image", file);
    }
    formData.append("teamId", team.id + "");

    formData.append("teamName", values.teamName);

    formData.append("teamAbout", values.teamAbout);
    formData.append("isActive", String(isActiveTeam));




    axios(token || "")
      .put("/team/update", formData)
      .then((res) => {
        const { code, message,data } = res.data;

        if (code !== 200) {
          throw new Error();
        } else {
          if (team) {
            dispatch(
              updateTeam({
                teamId: team.id,
                team: data,
              })
            );
          }
          toast.success(message);
        }
      })
      .catch((err) => {
        ShowError(err);
      })
      .finally(() => {
        setRequestPending(false);
      });
  };

  if (!loading) {
    return (
      <Sidebar>
        {!team ? (
          <Alert type={AlertTypes.ERROR} message={"Takım bulunamadı!"} />
        ) : (
          <div className="flex justify-center items-start py-5">
            <div className="max-w-[1250px] w-full flex justify-center items-start">
              <div className="sticky top-24 h-auto px-3 py-4 2xl:w-1/3 xl:w-1/3 lg:w-1/3 md:w-1/2 sm:w-1/2 mx-2 bg-white rounded-lg flex flex-col">
                <h2 className="text-lg font-semibold text-slate-700">
                  Edit Team
                </h2>
                <div className="flex justify-center my-1 py-3">
                  <Upload defaultFile={team.image} setFile={setFile} />
                </div>
                <Formik
                  initialValues={initialValues}
                  onSubmit={onEditTeamComplete}
                  className="w-full"
                >
                  <Form>
                    <div className="flex flex-col">
                      <label
                        htmlFor="teamName"
                        className="text-slate-700 font-semibold text-sm"
                      >
                        Team Name
                      </label>
                      <Field
                        name="teamName"
                        id="teamName"
                        placeholder="Team Name"
                        className="input"
                      />
                    </div>
                    <div className="flex flex-col mt-3">
                      <label
                        htmlFor="teamAbout"
                        className="text-slate-700 font-semibold text-sm"
                      >
                        Team About
                      </label>
                      <Field
                        as="textarea"
                        name="teamAbout"
                        id="teamAbout"
                        placeholder="Team About"
                        rows={8}
                        className="input resize-none"
                      />
                    </div>
                    <div className="flex items-center justify-start py-3">
                      <UseAnimations
                        onClick={() => {
                          setActiveTeam((prev) => !prev);
                        }}
                        reverse={team.is_active === 1 ? true : false}
                        animation={checkbox}
                        size={32}
                      />
                      <span className="font-semibold text-sm text-slate-700">
                        Team Active
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <button
                        disabled={requestPending}
                        className="btn btn-primary btn-sm"
                      >
                        Save
                      </button>
                    </div>
                  </Form>
                </Formik>
              </div>
              <div className="flex h-auto px-3 2xl:w-1/3 xl:w-1/3 lg:w-1/3 md:w-1/2 sm:w-1/2">
                <MemberList teamId={team.id} isRemovable={true} members={members} />
              </div>
            </div>
          </div>
        )}
      </Sidebar>
    );
  } else {
    return (
      <Sidebar>
        <div className="flex justify-center items-center">
          <UseAnimations size={56} animation={loading2} />
        </div>
      </Sidebar>
    );
  }
};

export default EditTeam;
