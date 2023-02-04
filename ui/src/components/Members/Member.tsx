import React,{useEffect,useState} from "react";
import { MdModeEditOutline, MdOutlineReportProblem } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { getColorCode, getRole, TextColors } from "../../helper/Enum/Colors";
import { useAuth } from "../../Provider/AuthContext";
import { ITeam, UserInterface } from "../../types/types";
import Badge from "../Badge/Badge";
import Menu, { MenuItem } from "../Menu/Menu";
import UserProfile from "../UserProfile/UserProfile";

interface IProps {
  member: UserInterface;
}

const Members: React.FC<IProps> = ({ member }) => {
  const { user } = useAuth();

  const {id} = useParams();

  const [team,setTeam] = useState<ITeam | undefined>(undefined);


  useEffect(() => {
    if(id != undefined && user) {
      setTeam(user.teams.find(team => team.id == parseInt(id)))
    }
  },[id])

  const iconSize = "1.3em";
  
  const menus: MenuItem[] = [
    {
      id: 1,
      handle: () => {},
      text: "Edit",
      icon: <MdModeEditOutline size={iconSize} />,
    },
    {
      id: 2,
      handle: () => {},
      text: "Remove",
      color: "text-red-500",
      icon: <RiDeleteBinLine size={iconSize} />,
      validation() {
        return user?.id != member.id;
      },
    },
    {
      id: 3,
      handle: () => {},
      text: "Report",
      color: "text-red-500",
      icon: <MdOutlineReportProblem size={iconSize} />,
    },
  ];


  return (
    <div className="p-5 rounded-md my-1 group/member bg-white flex relative justify-center shadow-sm hover:shadow-md transition-all">
      {team?.author_id == user?.id ? (
        <span className="absolute group-hover/member:block hidden right-3 top-3">
          <Menu items={menus} />
        </span>
      ) : null}
      <div className="p-3 flex flex-col items-center">
        <UserProfile size="w-20 h-20 text-3xl" fullname={member.fullname} />
        <span className="font-semibold text-slate-800 text-lg mt-3">
          {member.fullname}
        </span>
        <span className="text-slate-800 opacity-60 text-sm">
          @{member.username}
        </span>
        <div className="mt-3">
          <Badge
            text={
              getRole(member.team_role)
            }
            bgColor={getColorCode(member.team_role) || "text-slate-400"}
            textColor={TextColors["LIGHT"]}
          />
        </div>
      </div>
    </div>
  );
};

export default Members;
