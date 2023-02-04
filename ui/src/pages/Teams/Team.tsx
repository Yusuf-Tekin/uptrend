import React, { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { BiGroup, BiPlus } from "react-icons/bi";
import { MdModeEditOutline } from "react-icons/md";
import Menu from "../../components/Menu/Menu";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import { useAuth } from "../../Provider/AuthContext";
import { ShowError } from "../../helper/ShowError/ShowError";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../store/hooks";
import { IoMdExit } from "react-icons/io";
import { SiApostrophe } from "react-icons/si";
import { ITeam } from "../../types/types";
import { removeTeam } from "../../store/features/UserSlice";
import Popup from "../../components/Popup/Popup";
import CreateTeam from "./CreateTeam";
import CreatePost from "../../components/Post/CreatePost";
import Badge from "../../components/Badge/Badge";
import { BgColors, TextColors } from "../../helper/Enum/Colors";
interface IProps {
  team: ITeam;
  menuType?: "MY" | "OTHER";
}

const Team: React.FC<IProps> = ({ team, menuType }) => {
  const navigate = useNavigate();
  const iconSize = "1.25em";

  const { token } = useAuth();

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showCreatePostPopup, setShowCreatePostPopup] = useState(false);

  const dispatch = useAppDispatch();

  const myMenuItems = [
    {
      id: 0,
      text: "New",
      handle: () => {
        setShowCreatePostPopup(true);
      },
      icon: <BiPlus size={iconSize} />,
    },
    {
      id: 1,
      text: "Edit",
      handle: () => {
        navigate(`/teams/edit/${team.id}`);
      },
      icon: <MdModeEditOutline size={iconSize} />,
    },
    {
      id: 2,
      text: "Posts",
      handle: () => {
        navigate(`/teams/posts/${team.id}`);
      },
      icon: <SiApostrophe size={iconSize} />,
    },
    {
      id: 3,
      text: "Members",
      handle: () => {
        navigate(`/teams/members/${team.id}`);
      },
      icon: <BiGroup size={iconSize} />,
    },
    {
      id: 4,
      text: "Delete",
      handle: () => {
        deleteTeamWithApi(team.id);
      },
      color: "text-red-500",
      icon: <RiDeleteBinLine size={iconSize} />,
    },
  ];

  const otherTeamMenus = [
    {
      id: 0,
      text: "Members",
      handle: () => {
        navigate(`/teams/members/${team.id}`);
      },
      icon: <BiGroup size={iconSize} />,
    },
    {
      id: 1,
      text: "Posts",
      handle: () => {
        navigate(`/teams/posts/${team.id}`);
      },
      icon: <SiApostrophe size={iconSize} />,
    },
    {
      id: 1,
      text: "Leave",
      handle: () => {
        alert("Leave");
      },
      color: "text-red-500",

      icon: <IoMdExit size={iconSize} />,
    },
  ];

  const deleteTeamWithApi = (teamId: number) => {
    setDeleteLoading(true);
    axios(token || undefined)
      .delete("/team/delete", {
        params: {
          teamId,
        },
      })
      .then((res) => {
        const { code, message } = res.data;
        if (code !== 200) {
          throw new Error();
        } else {
          toast.success(message);
          dispatch(
            removeTeam({
              teamId,
            })
          );
        }
      })
      .catch((err) => {
        ShowError(err);
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  return (
    <div className="px-3 pt-4 pb-2 bg-white rounded-2xl shadow-md shadow-slate-200 flex flex-col hover:shadow-lg transition-all">
      <Popup show={showCreatePostPopup} setShowPopup={setShowCreatePostPopup}>
        <CreatePost popupHandle={setShowCreatePostPopup} teamId={team.id} />
      </Popup>

      {deleteLoading ? (
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
      ) : team.is_active !== 1 ? <div className="relative">
        <span className="absolute left-0 top-0">
        <Badge text="Not Active" bgColor={BgColors.ERROR} textColor={TextColors.LIGHT} customClass="animate-pulse" />
      </span>
      </div>
       : <></> 
    }
      <div className="relative">
        <div className="absolute right-3 top-0 border-2 border-gray-200 rounded-md p-0.5 hover:bg-gray-200 transition-all cursor-pointer">
          <Menu
            disabledMenu={deleteLoading}
            items={menuType === "OTHER" ? otherTeamMenus : myMenuItems}
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-3">
        <img
          alt=""
          className="w-28 outline-none rounded-full object-cover"
          src={`http://localhost:5000${team.image}`}
          draggable={false}
        />
        <h3 className="font-bold text-slate-700 opacity-80 font-sans">
          {team.name}
        </h3>
      </div>
      <div className="mt-6 p-3 bg-slate-100 rounded-2xl flex justify-between px-7 items-center">
        <div className="flex flex-col text-left">
          <span className="font-semibold text-slate-500 text-sm">Members</span>
          <span className="font-bold text-slate-700 opacity-70 text-base">
            {team.users?.length}
          </span>
        </div>
        <div className="flex flex-col text-left">
          <span className="font-semibold text-slate-500 text-sm">Created</span>
          <span className="font-bold text-slate-700 opacity-70 text-base">
            {new Date(team.created_at).toLocaleDateString("en-EN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Team;
