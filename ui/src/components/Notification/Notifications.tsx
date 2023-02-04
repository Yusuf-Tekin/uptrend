import React, { useEffect, useState } from "react";
import { GrNotification } from "react-icons/gr";
import { useAuth } from "../../Provider/AuthContext";
import { INotification } from "../../types/types";
import Notification from "./Notification";

const Notifications: React.FC = () => {
  const [show, setShow] = useState(false);

  const [notifications, setNotifications] = useState<INotification[] | null>(
    null
  );

  const [readCount, setReadCount] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setNotifications(user.notifications)
    }
  }, [user]);

  useEffect(() => {
    if (notifications) {
      setReadCount(notifications?.filter((notifi) => notifi.is_read === 0).length);
    }
  }, [notifications,show]);

  useEffect(() => {
    if(show === true && notifications) {
      notifications.forEach(notifi => {
        notifi.is_read = 1;
      })
    }
  },[show])

  return (
    <div className="ml-2 relative z-20">
      <div className="relative" onClick={() => setShow((prev) => !prev)}>
        <GrNotification
          size={"1.3em"}
          className=" cursor-pointer opacity-70 hover:opacity-100 transition-all"
        />
        {readCount > 0 ? (
          <div className="w-3 h-3 absolute -right-1 -top-1 rounded-full bg-blue-500"></div>
        ) : null}
      </div>
      <div
        className={`absolute -right-80 top-5 origin-top-left w-80 max-h-96 overflow-y-auto pt-4 bg-white rounded-md ${
          show ? "scale-100" : "scale-0"
        } transition-all shadow-sm`}
      >
        <div className="flex justify-between w-full mb-3 px-3 ">
          <span className="text-slate-800 font-bold text-base">
            Notifications
          </span>
        </div>
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <Notification key={notification.id} notification={notification} />
          ))
        ) : (
          <p className="my-3 mx-3 bg-slate-300 p-3 rounded-md text-slate-700 text-base font-semibold">
            No notification yet!
          </p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
