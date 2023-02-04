import React from "react";
import { AlertTypes } from "../../helper/AlertTypes/AlertTypes";
import { UserInterface } from "../../types/types";
import Alert from "../Alert/Alert";
import UserProfile from "../UserProfile/UserProfile";
import { IoMdClose } from "react-icons/io";
import { useAuth } from "../../Provider/AuthContext";
import axios from "../../config/axios";
import { ShowError } from "../../helper/ShowError/ShowError";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../store/hooks";
import { removeMember } from "../../store/features/UserSlice";

interface MemberList {
  members: UserInterface[];
  isRemovable?: boolean;
  teamId?: number;
}

const MemberList: React.FC<MemberList> = ({ members, isRemovable, teamId }) => {
  const { user, token } = useAuth();

  const dispatch = useAppDispatch();

  const removeUserRequest = (member: UserInterface) => {
    axios(token || "")
      .delete("/team/remove-member", {
        params: {
          teamId:teamId,
          memberId: member.id,
        },
      })
      .then((res) => {
        const { code, message } = res.data;

        if (code !== 200) {
          throw new Error();
        } else {
          if (teamId) {
            dispatch(
              removeMember({
                teamId,
                memberId: member.id,
              })
            );
          }
          toast.success(message || "Başarılı!");
        }
      })
      .catch((err) => {
        ShowError(err);
      });
  };

  return (
    <div className="px-3 py-2">
      <div>
        <span className="text-slate-800 font-semibold text-lg">
          Team Members
        </span>
        <hr />
      </div>
      {members && members.length > 0 ? (
        <div className="h-full overflow-y-auto">
          {members.map((member) => {
            return (
              <div
                className="flex justify-between items-center my-3 max-w-64 w-64 group/member"
                key={member.id}
              >
                <div className="flex justify-start gap-x-2">
                  <UserProfile
                    size="w-10 h-10 text-lg"
                    fullname={member.fullname}
                  />
                  <div className="flex flex-col items-center justify-start gap-x-3">
                    <span className="font-semibold text-slate-700">
                      {member.fullname}
                    </span>
                    <span className="text-slate-400 text-sm">
                      @{member.username}
                    </span>
                  </div>
                </div>
                {isRemovable && member.id != user?.id ? (
                  <div className="justify-center flex cursor-pointer  rounded-full p-1 py-3">
                    <IoMdClose
                      onClick={() => {
                        removeUserRequest(member);
                      }}
                      size={"1.5em"}
                      color="red"
                      title="Remove Member"
                      className={`opacity-60 group-hover/member:scale-100 p-0.5 rounded-full bg-red-200 hover:bg-red-300 scale-0 transition-all`}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <Alert type={AlertTypes.ERROR} message={"No Member"} />
      )}
    </div>
  );
};

export default MemberList;
