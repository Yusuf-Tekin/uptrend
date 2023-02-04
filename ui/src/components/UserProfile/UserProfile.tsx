import React from "react";

interface IUserProfile {
  fullname: string;
  size?:string;
}
const UserProfile: React.FC<IUserProfile> = ({ fullname,size }) => {
  const fullnameSplit = fullname.split(" ");
  const name = fullnameSplit[0][0] + fullnameSplit[1][0];

  return (
    <div className={` text-white font-semibold bg-slate-400 rounded-full flex justify-center items-center  ${size ? size : 'w-10 h-10 text-base'}`}>
        {name.toUpperCase()}
    </div>
  );
};

export default UserProfile;
