import React from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import Menu, { MenuItem } from "../../components/Menu/Menu";
import UserProfile from "../../components/UserProfile/UserProfile";
import dateDiff from "../../helper/Date/DateDiff";
import { ITeam } from "../../types/types";

interface IMessage {
  team: ITeam;
  selectOpen: boolean;
}

const Message: React.FC<IMessage> = ({ team, selectOpen }) => {
  const backend = process.env.REACT_APP_BACKEND;


  const getFirstMessage = () => {
    return team.messages[0];
  }

  return (
    <div className="relative flex items-center p-3 py-3 border-b border-b-slate-300 hover:bg-stone-300 transition-all cursor-pointer">
      <div className="flex gap-x-2">
        <img src={backend + team.image} className="w-16 h-16 rounded-full" />
        <div className="flex flex-col items-start justify-center transition-all">
          <span className="font-bold text-slate-700">{team.name}</span>
          <span className="text-sm text-slate-700">
            {team.messages.length > 0 ? (
              <span className="text-xs">
                {getFirstMessage().message.substring(0,40)}
                {getFirstMessage().message.length > 40 ? "..." : null}
              </span>
            ) : null}
          </span>
        </div>
        {team.messages.length > 0 ? (
          <span className="absolute right-3 top-2 opacity-40 text-xs">
            {dateDiff(getFirstMessage().created_at)}
          </span>
        ) : null}
      </div>
      
    </div>
  );
};

export default Message;
