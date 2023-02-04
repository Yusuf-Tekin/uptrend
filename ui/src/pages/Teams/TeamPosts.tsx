import { useMemo, useState } from "react";
import axios from "../../config/axios";
import { useParams } from "react-router-dom";
import Alert from "../../components/Alert/Alert";
import MemberList from "../../components/Members/MemberList";
import PostList from "../../components/Post/PostList";
import { AlertTypes } from "../../helper/AlertTypes/AlertTypes";
import Sidebar from "../../layout/Sidebar";
import { useAuth } from "../../Provider/AuthContext";
import { ShowError } from "../../helper/ShowError/ShowError";
import { ITeam } from "../../types/types";
import { BiPlus } from "react-icons/bi";
import Popup from "../../components/Popup/Popup";
import CreatePost from "../../components/Post/CreatePost";
import { useAppSelector } from "../../store/hooks";

function TeamPosts() {
  const { teamId } = useParams();
  const { user, token } = useAuth();

  const team = useAppSelector(state => state.user.teams.find(team => team.id === parseInt(teamId || "-1")));


  // const getTeamPosts = () => {
  //   axios(token || "")
  //     .get("/post/team-posts", {
  //       params: {
  //         teamId,
  //       },
  //     })
  //     .then((res) => {
  //       const { code, data } = res.data;
  //       if (code != 200) {
  //         throw new Error();
  //       } else {
  //         setTeam(data);
  //       }
  //     })
  //     .catch((err) => {
  //       ShowError(err);
  //     });
  // };

  // useMemo(() => {
  //   getTeamPosts();
  // }, [teamId]);

  const [createPostPopup, setCreatePostPopup] = useState(false);

  return (
    <Sidebar>
      <div className="flex justify-end p-5">
        {team?.author_id === user?.id ? (
          <>
            <Popup show={createPostPopup} setShowPopup={setCreatePostPopup}>
              {
                team ? <CreatePost popupHandle={setCreatePostPopup} teamId={team?.id} /> : <></>
              }
            </Popup>
            <button
              onClick={() => setCreatePostPopup(true)}
              className="btn btn-primary flex items-center justify-center gap-x-1"
            >
              New Post <BiPlus />
            </button>
          </>
        ) : null}
      </div>
      <div className="grid grid-cols-12 rounded-lg relative">
        <div className="col-start-1 col-end-13 2xl:col-end-10 xl:col-end-10 lg:col-end-8 md:col-end-8 sticky top-1 rounded-md my-3">
          {team ? (
            <PostList team={team} />
          ) : (
            <Alert
              type={AlertTypes.WARNING}
              message={"No shared post in the team yet!"}
            />
          )}
        </div>
        <div className="col-end-13 2xl:col-start-10 xl:col-start-10 lg:col-start-8 md:col-start-8 2xl:block xl:block lg:block md:block hidden">
          <div className="my-3 sticky">
            <MemberList members={team?.users || []} />
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

export default TeamPosts;
