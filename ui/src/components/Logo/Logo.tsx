import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  color?:string;
}

const Logo:React.FC<LogoProps> = ({color}) => {
  return (
    <Link to="/">
      <h2 className={`font-semibold text-4xl ${color ? color : 'text-slate-500'}`}>
        <span className="text-blue-500">U</span>p
        <span className="text-blue-500">T</span>rend
      </h2>
    </Link>
  );
}

export default Logo;
