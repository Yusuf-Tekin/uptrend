import React, { useEffect, useState } from "react";
import { RxDotsHorizontal } from "react-icons/rx";

export interface MenuItem {
  id: number;
  text: string;
  handle: Function;
  color?: string;
  icon?: JSX.Element;
  validation?: () => boolean;
}

interface IProps {
  items: MenuItem[];
  disabledMenu?: boolean;
}

const Menu: React.FC<IProps> = ({ items, disabledMenu }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (disabledMenu) {
      setShow(false);
    }
  }, [disabledMenu]);

  return (
    <div className="relative z-10">
      <RxDotsHorizontal
        className="cursor-pointer"
        onClick={() => {
          setShow((prev) => !prev);
        }}
      />
      <div
        className={`w-auto h-auto absolute top-3 right-3 bg-slate-50 shadow-md rounded-md origin-top-right cursor-pointer ${
          show ? "scale-100" : "scale-0"
        } transition-all`}
      >
        {items.map((item) =>
          item.validation != undefined && item.validation() !== true ? null : (
            <div
              key={item.id}
              onClick={() => item.handle()}
              className={`relative m-1 px-3 py-1 text-sm font-semibold rounded-sm hover:bg-gray-200 transition-all ${item.color} flex items-center justify-start `}
            >
              <span className="absolute left-1 top-1.5">{item.icon}</span>
              <span className="pl-4">{item.text}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Menu;
