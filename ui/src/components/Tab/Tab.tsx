import { Link } from "react-router-dom";
import { TabProps } from "../../types/types";
import { useState } from "react";

const Tab: React.FC<TabProps> = ({ menus, activeTab,setActiveTab }) => {

  return (
    <>
      <div className="flex gap-x-2">
        {menus.map((menu) => {
          return (
            <div
              onClick={() => {
                setActiveTab(menu);
              }}
              className={`${
                activeTab.id == menu.id
                  ? "bg-slate-600  bg-opacity-70 text-white"
                  : "bg-slate-100 text-slate-700"
              } font-semibold px-3 py-2 rounded-md cursor-pointer transition-all`}
              key={menu.id}
            >
              {menu.text}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Tab;
