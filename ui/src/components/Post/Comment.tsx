import axios from "../../config/axios";
import React from "react";
import { MdOutlineReportProblem } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import dateDiff from "../../helper/Date/DateDiff";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { IComment } from "../../types/types";
import Menu, { MenuItem } from "../Menu/Menu";
import UserProfile from "../UserProfile/UserProfile";
import { removeComment } from "../../store/features/UserSlice";
import { useAuth } from "../../Provider/AuthContext";
import { ShowError } from "../../helper/ShowError/ShowError";

interface CommentProps {
  comment: IComment;
  postId: number;
  teamId: number;
}

const Comment: React.FC<CommentProps> = ({ comment, postId, teamId }) => {
  const user = useAppSelector((state) => state.user.user);

  const { token } = useAuth();

  const iconSize = "1.25em";
  const dispatch = useAppDispatch();

  const commentAuthorMenuItems: MenuItem[] = [
    {
      id: 2,
      text: "Remove",
      color: "text-red-500",
      icon: <RiDeleteBinLine size={iconSize} />,
      handle: () => {
        removeCommentRequest(comment.id);
      },
    },
  ];

  const otherUserMenuItems: MenuItem[] = [
    {
      id: 1,
      handle: () => {},
      color: "text-red-500",
      text: "Report",
      icon: <MdOutlineReportProblem size={iconSize} />,
    },
  ];

  const removeCommentRequest = (commentId: number) => {
    axios(token || "")
      .delete("/post/delete-comment", {
        params: {
          postId,
          commentId,
        },
      })
      .then((res) => {
        const { code } = res.data;
        if (code !== 200) {
          throw new Error();
        } else {
          dispatch(
            removeComment({
              commentId,
              postId,
              teamId,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
        ShowError(err);
      });
  };

  return (
    <div className="w-full my-5 py-0 flex justfiy-start items-start gap-x-2 group/comment relative">
      <span className="absolute right-2 top-1 hidden group-hover/comment:block transition-all">
        <Menu
          items={
            comment.user_id == user?.id
              ? commentAuthorMenuItems
              : otherUserMenuItems
          }
        />
      </span>
      <div className="flex">
        <UserProfile
          fullname={comment.author.fullname}
          size="text-base w-10 h-10"
        />
      </div>
      <div className="flex flex-col">
        <div className="">
          <span className="font-semibold text-sm">
            {comment.author.username}
          </span>
          <span className="text-sm ml-2 break-all">{comment.comment}</span>
        </div>
        <span className="text-gray-400 text-xs">
          {dateDiff(comment.created_at)}
        </span>
      </div>
    </div>
  );
};

export default Comment;
