import React from "react";
import Logo from "../components/Logo/Logo";
import { LayoutInterface } from "../types/global";
import { Link } from "react-router-dom";
import { useAuth } from "../Provider/AuthContext";
import UserDropdown from "../components/UserDropdown/UserDropdown";

const Navbar: React.FC<LayoutInterface> = ({ children }) => {
  const auth = useAuth();

  return (
    <div className="w-full h-full">
      <div className="fixed z-50 top-0 w-full h-16 border-b border-b-gray-300 flex justify-between items-center 2xl:px-8 xl:px-8 lg:px-6 md:px-4 px-2">
        <Logo />
        {!auth.loggedIn ? (
          <div className="flex gap-x-2">
            <Link to="/auth/signin" className="btn btn-sm btn-ghost">
              Signin
            </Link>
            <Link to="/auth/signup" className="btn btn-sm btn-primary">
              Signup
            </Link>
          </div>
        ) : (
          <UserDropdown />
        )}
      </div>
      <div className="w-full h-auto pt-16">{children}</div>
    </div>
  );
};

export default Navbar;
