import React from "react";
import { Link } from "react-router-dom";
import { INotification } from "../../types/types";


interface IProps {
    notification:INotification;
}

const Notification: React.FC<IProps> = ({notification}) => {

  return (
    <>
      <hr />
      <Link
        to={notification.redirect_url}
        className={`py-2 m-1 px-3 rounded-md flex flex-col hover:bg-gray-100 transition-all ${
          notification.is_read === 0 ? "bg-blue-100" : null
        }`}
      >
        <span className="font-semibold text-slate-700">
          {notification.title}
        </span>
        <span className="text-slate-500 text-xs">{notification.content}</span>
        <div className="tex-slate-400 text-xs my-3 text-right">
          {notification.created_at}
        </div>
      </Link>
    </>
  );
};

export default Notification;
