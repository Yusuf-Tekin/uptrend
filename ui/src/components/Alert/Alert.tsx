import React from "react";
import { AlertTypes } from "../../helper/AlertTypes/AlertTypes";

interface AlertProps {
  type?: AlertTypes;
  message: string;
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  return (
    <div className="flex justify-center">
      <div
        className={`px-4 py-2 ${
          type === AlertTypes.WARNING
            ? "bg-yellow-600"
            : type === AlertTypes.SUCCESS
            ? "bg-green-600"
            : type === AlertTypes.ERROR
            ? "bg-red-500"
            : "bg-slate-400"
        } rounded-md opacity-70 text-white hover:opacity-100 transition-all font-semibold`}
      >
        {message}
      </div>
    </div>
  );
};

export default Alert;
