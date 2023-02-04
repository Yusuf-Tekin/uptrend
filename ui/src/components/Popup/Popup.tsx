import React from "react";
import { IoMdClose } from "react-icons/io";
interface IPopup {
  children?: JSX.Element;
  show: boolean;
  setShowPopup: Function;
}

const Popup: React.FC<IPopup> = ({ children, show, setShowPopup }) => {
  return (
    <div
      className={`absolute top-0 left-0 w-screen h-screen origin-bottom
      bg-opacity-90 bg-slate-900 z-20 ${
        show ? "scale-100 rounded-none" : "scale-0 rounded-t-full"
      } transition-all duration-200`}
    >
      <div className="w-full h-full flex justify-center items-center relative">
        <span className="absolute right-10 top-8 cursor-pointer" onClick={() => setShowPopup(false)}>
          <IoMdClose color="white" size={'2.25em'}  />
        </span>
        {children}
      </div>
    </div>
  );
};

export default Popup;
