import React, { useState } from "react";
export interface DropdownItem {
  id: number;
  text: string;
  handle: Function;
  color?: string;
  icon?: JSX.Element;
}

interface IProps {
  items: DropdownItem[];
  children:JSX.Element,
  menuClass?:string
}

const Dropdown: React.FC<IProps> = ({ items,children,menuClass }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative z-10">
      <div className="cursor-pointer" onClick={() => {setShow((prev) => !prev)}}>
        {children}
      </div>
      <div
        className={`w-auto h-auto absolute top-3 right-3 bg-slate-50 shadow-md rounded-md origin-top-right cursor-pointer ${
          show ? "scale-100" : "scale-0"
        } transition-all ${menuClass}`}
      >
        {items.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => item.handle()}
              className={`relative m-2 px-3 py-1 text-sm font-semibold rounded-md hover:bg-gray-200 transition-all ${item.color} flex items-center justify-start `}
            >
              <span className="absolute left-1 top-1.5">{item.icon}</span>
              <span className="pl-4">{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dropdown;
