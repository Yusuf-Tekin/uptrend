import React,{useEffect} from "react";
import { LayoutInterface } from "../types/global";
import { NavLink, useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineTeam } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { BiMessageRoundedDetail } from "react-icons/bi";
import Logo from "../components/Logo/Logo";
import { GrNotification } from "react-icons/gr";
import Dropdown from "../components/Dropdown/Dropdown";
import { useAppSelector } from "../store/hooks";
import UserDropdown from "../components/UserDropdown/UserDropdown";
import Notifications from "../components/Notification/Notifications";

interface Menu {
  id: number;
  text: string;
  url: string;
  icon: JSX.Element;
  badgeMessage?: string;
}

const Sidebar: React.FC<LayoutInterface> = ({ children, navbarHide=false }) => {
  const iconsSize = "1.5em";

  const teams = useAppSelector((state) => state.user.teams);

  const noReadMessage = useAppSelector((state) => state.user.teams[0]?.noReadMessageCount)


  const menus: Menu[] = [
    {
      id: 1,
      text: "Home",
      url: "/home",
      icon: <AiOutlineHome size={iconsSize} />,
    },
    {
      id: 2,
      text: "My Account",
      url: "/my-account",
      icon: <FiSettings size={iconsSize} />,
    },
    {
      id: 3,
      text: "Teams",
      url: "/teams",
      icon: <AiOutlineTeam size={iconsSize} />,
      badgeMessage: String(teams?.length),
    },
    {
      id: 4,
      text: "Messages",
      url: "/messages",
      icon: <BiMessageRoundedDetail size={iconsSize} />,
      badgeMessage: noReadMessage ? String(noReadMessage) : undefined
    },
  ];

  return (
    <div className="w-full grid grid-cols-12 h-screen">
      <div className="hidden 2xl:flex xl:flex md:flex lg:flex flex-col col-start-1 2xl:col-end-3 xl:col-end-3 lg:col-end-4 md:col-end-5 bg-slate-800 text-white ">
        <div className="flex justify-center py-5 sticky top-0">
          <Logo color="text-slate-200" />
        </div>
        <div className="sticky top-20">
          {menus.map((menu) => {
            return (
              <NavLink
                style={({ isActive }) =>
                  isActive ? { backgroundColor: "#334155" } : undefined
                }
                to={menu.url}
                key={menu.id}
                className="mx-3 my-1 p-3 rounded-md flex items-center justify-start hover:bg-slate-700 font-semibold transition-all"
              >
                <span className="ml-4 mr-3 opacity-50">{menu.icon}</span>
                <div className="flex justify-between items-center w-full">
                  <span className="text-slate-200">{menu.text}</span>
                  {menu.badgeMessage ? (
                    <div className="text-xs w-5 h-5 flex justify-center items-center rounded-full bg-blue-400 font-semibold">
                      {menu.badgeMessage}
                    </div>
                  ) : null}
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
      <div className="overflow-y-auto 2xl:col-start-3 xl:col-start-3 lg:col-start-4 md:col-start-5 col-start-1 col-end-13 h-screen">
        <div className="flex flex-col justify-center">
          {navbarHide === false ? (
            <div className="p-3 bg-zinc-300 flex justify-between items-center z-20 bg-opacity-80">
              <Notifications />
              <UserDropdown />
            </div>
          ) : null}
          <div className="h-screen">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
