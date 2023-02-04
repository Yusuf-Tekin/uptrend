import { useMemo, useState } from "react";
import Sidebar from "../../layout/Sidebar";
import { FiPlus } from "react-icons/fi";
import Alert from "../../components/Alert/Alert";
import { AlertTypes } from "../../helper/AlertTypes/AlertTypes";
import { useAppSelector } from "../../store/hooks";
import Team from "./Team";
import { useStateUpdate } from "../../Provider/UpdateStateContext";
import Popup from "../../components/Popup/Popup";
import CreateTeam from "./CreateTeam";
import Tab from "../../components/Tab/Tab";
import { ITeam, TabMenu } from "../../types/types";
import MyTeams from "./MyTeams";
import JoinedTeams from "./JoinedTeams";

function Teams() {
  const [showPopup, setShowPopup] = useState(false);

  const tabMenus: TabMenu[] = [
    {
      id: 1,
      text: "My",
      component: <MyTeams />,
    },
    {
      id: 2,
      text: "Joined",
      component: <JoinedTeams />,
    },
  ];

  const [activeTab, setActiveTab] = useState<TabMenu>(tabMenus[0]);

  return (
    <Sidebar>
      <div className=" 2xl:p-8 xl:p-8 lg:p-8 md:p-5 sm:p-5 p-3">
        <Popup show={showPopup} setShowPopup={setShowPopup}>
          <CreateTeam popupHandle={setShowPopup} />
        </Popup>
        <div className="flex justify-between items-end">
          <Tab
            menus={tabMenus}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className="flex gap-x-3">
            <button
              onClick={() => {
                setShowPopup(true);
              }}
              className="btn btn-primary btn-sm flex gap-x-1 items-center"
            >
              Create Team <FiPlus size={"1.25rem"} />
            </button>
          </div>
        </div>
        <div className="mt-5">{activeTab.component}</div>
      </div>
    </Sidebar>
  );
}

export default Teams;
