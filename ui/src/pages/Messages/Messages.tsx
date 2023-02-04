import UserProfile from "../../components/UserProfile/UserProfile";
import Sidebar from "../../layout/Sidebar";
import { useAuth } from "../../Provider/AuthContext";
import Message from "./Message";
import { useState, useEffect } from "react";
import ChatScreen from "./ChatScreen";
import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";
import { IMessage, ITeam } from "../../types/types";
import { socket } from "../../Provider/SocketIO.service";
function Messages() {
  const { teamId } = useParams();
  const [team, setTeam] = useState<ITeam | null>(null);
  const teams = useAppSelector((state) => state.user.teams);

  useEffect(() => {
    if (teamId) {
      const findTeam = teams.find((team) => team.id === parseInt(teamId));

      socket?.emit('join-chat-room',{
        teamId:teamId
      })

      if (findTeam) {
        setTeam(findTeam);
      }
    }
  }, [teams, teamId]);

  const [isOpenSelect, setSelectIsOpen] = useState(false);

  return (
    <Sidebar navbarHide={true}>
      <div className="bg-white h-full w-full">
        <div className="w-full flex h-full">
          <div className="w-[512px] 2xl:block xl:block lg:block hidden z-10 overflow-y-auto">
            <div className="sticky top-0 z-10 px-4 shadow-sm py-3 bg-stone-100 ">
              <div className="flex justify-start py-5">
                <p className="font-bold text-slate-800 text-3xl">Messages</p>
              </div>
              <div>
                <input
                  className="input w-full shadow-sm"
                  placeholder="Search Message"
                />
              </div>
              {/* <div className="flex justify-start my-3 items-center gap-x-3">
                <input
                  type={"checkbox"}
                  className="w-5 h-5"
                  onChange={() => {
                    setSelectIsOpen((prev) => !prev);
                  }}
                />
                <span className="text-lg">Select Message</span>
              </div> */}
            </div>
            <div className="">
              {teams.map((team, index) => {
                return (
                  <Link to={`/messages/${team.id}`} key={index}>
                    <Message selectOpen={isOpenSelect} team={team} />
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="w-full max-w-[1500px]">
            {team ? <ChatScreen team={team} /> : null}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}

export default Messages;
