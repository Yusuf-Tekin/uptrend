import React, { useEffect, useState } from "react";
import { MdOutlineReportProblem } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import {
  BgColors,
  getColorCode,
  getRole,
  TextColors,
} from "../../helper/Enum/Colors";
import { useAuth } from "../../Provider/AuthContext";
import { ILike, IComment, IPost, ITeam } from "../../types/types";
import Badge from "../Badge/Badge";
import Menu, { MenuItem } from "../Menu/Menu";
import axios from "../../config/axios";
import { ShowError } from "../../helper/ShowError/ShowError";
import Collapse from "../Collapse/Collapse";
import { Field, Form, Formik, FormikValues } from "formik";
import * as Yup from "yup";
import Alert from "../Alert/Alert";
import { AlertTypes } from "../../helper/AlertTypes/AlertTypes";
import UserProfile from "../UserProfile/UserProfile";
import dateDiff from "../../helper/Date/DateDiff";
import parse from "html-react-parser";
import { FiMessageCircle } from "react-icons/fi";
import UseAnimations from "react-useanimations";
import heart from "react-useanimations/lib/heart";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  addComment,
  removeComment,
  removePost,
} from "../../store/features/UserSlice";
import Comment from "./Comment";
import { postRemove } from "../../store/features/PostSlice";

interface PostProps {
  post: IPost;
  team: ITeam;
}

const Post: React.FC<PostProps> = ({ post, team }) => {
  const backend = process.env.REACT_APP_BACKEND;
  const iconSize = "1.25em";

  const { user, token } = useAuth();
  const [like, setLike] = useState(false);
  const [likePending, setLikePending] = useState(false);

  const dispatch = useAppDispatch();


  const [likes, setLikes] = useState(post.likes);


  const comments = useAppSelector<IComment[] | undefined>(state => state.user.teams.find(t => t.id === team.id)?.posts.find(p => p.id === post.id)?.comments);

  useEffect(() => {
    if (likes && user) {

      const isExist = likes.findIndex((like) => like.user_id === user.id) != -1;
      if(isExist) {
        setLike(true)
      }
      else {
        setLike(false)
      }
    }
  }, [likes, user]);

  const [openCommentCollapse, setOpenCommentCollapse] = useState(false);

  const postMenu: MenuItem[] = [
    {
      id: 1,
      text: "Report",
      color: "text-red-500",
      handle: () => {
        alert("Reported");
      },
      icon: <MdOutlineReportProblem size={iconSize} />,
    },
    {
      id: 2,
      text: "Remove",
      handle: () => {
        removePostRequest();
      },
      color: "text-red-500",
      icon: <RiDeleteBinLine size={iconSize} />,
      validation() {
        return post.author_id == user?.id;
      },
    },
  ];

  const removePostRequest = () => {
    axios(token || "")
      .delete("/post/delete", {
        params: {
          postId: post.id,
        },
      })
      .then((res) => {
        const { code } = res.data;

        if (code !== 200) {
          throw new Error();
        } else {
          const { message } = res.data;
          toast.success(message);

          dispatch(postRemove({
            postId:post.id
          }))

          dispatch(
            removePost({
              teamId: team.id,
              postId: post.id,
            })
          );
        }
      })
      .catch((err) => {
        ShowError(err);
      });
  };

  const postLike = () => {
    setLikePending(true);
    axios(token || "")
      .post("/post/post-like", {
        postId: post.id,
      })
      .then((res) => {
        const { code, data } = res.data;

        if (code !== 200) {
          throw new Error();
        } else {
          setLike(true);
        }
      })
      .catch((err) => {
        setLike(false);
        ShowError(err);
      })
      .finally(() => {
        setLikePending(false);
      });
  };

  const postUnlike = () => {
    setLikePending(true);
    axios(token || "")
      .post("/post/post-unlike", {
        postId: post.id,
      })
      .then((res) => {
        const { code, data } = res.data;

        if (code !== 200) {
          throw new Error();
        } else {
          setLike(false);
        }
      })
      .catch((err) => {
        setLike(true);
        ShowError(err);
      })
      .finally(() => {
        setLikePending(false);
      });
  };

  const postAuthor = team.users.find((user) => user.id === team.author_id);

  // Comments
  const commentValidationSchema = Yup.object().shape({
    comment: Yup.string().trim().required("Required field!"),
  });

  const [commentPending, setCommentPending] = useState(false);

  const commentInitialValues = {
    comment: "",
  };

  const shareComment = (
    values: FormikValues,
    { resetForm }: { resetForm: Function }
  ) => {
    setCommentPending(true);

    axios(token || "")
      .post("/post/add-comment", {
        postId: post.id,
        comment: values.comment,
      })
      .then((res) => {
        const { code, data } = res.data;

        if (code !== 200) {
          throw new Error();
        } else {
          dispatch(
            addComment({
              teamId: team.id,
              postId: post.id,
              comment: data.comment,
            })
          );

          resetForm();
        }
      })
      .catch((err) => {
        ShowError(err);
      })
      .finally(() => {
        setCommentPending(false);
      });
  };

  return (
    <div className="w-full rounded-md p-4 h-auto border-b border-slate-300">
      <div className="flex justify-between items-center">
        <div className="flex gap-x-2">
          <img src={backend + team.image} className="w-12 h-12 rounded-full" />
          <div className="flex flex-col">
            <span className="text-base font-semibold text-slate-800">
              {team.name}
            </span>
            <span className="text-sm text-slate-500">
              @{postAuthor?.username}
            </span>
          </div>
        </div>
        <div>
          <Menu items={postMenu} />
        </div>
      </div>
      <div className="py-2 min-h-[72px]">
        <div className="text-lg break-words text-left">
          {post.post_text.split(" ").map((text, index) => (
            <span
              key={index}
              className={
                text.startsWith("#")
                  ? "text-blue-300 text-sm"
                  : "text-slate-700"
              }
            >
              {parse(String(text).concat(" "))}
            </span>
          ))}
        </div>
      </div>
      <div className="my-4 flex justify-between items-center">
        <Badge
          customClass="text-lg"
          bgColor={getColorCode(post.role)}
          text={getRole(post.role)}
          textColor={TextColors.LIGHT}
        />
      </div>

      <div className="my-4 flex gap-x-5 items-center w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-x-2 items-center relative">
            <div className="relative">
              <UseAnimations
                className="cursor-pointer opacity-70"
                fillColor="red"
                disabled={likePending}
                strokeColor={like ? "red" : "black"}
                speed={3}
                reverse={like}
                animation={heart}
                title={`${likes?.length} person liked`}
                size={32}
                onClick={like ? postUnlike : postLike}
              />
            </div>
            {post.is_comments ? (
              <div className="relative">
                <div className="w-auto opacity-60 flex gap-x-2">
                  <FiMessageCircle
                    onClick={() => {
                      setOpenCommentCollapse((prev) => !prev);
                    }}
                    className="cursor-pointer"
                    title="Comments"
                    size={"1.5em"}
                  />
                </div>
              </div>
            ) : null}
          </div>

          <span className="text-slate-800 font-semibold opacity-60 text-sm">
            {dateDiff(String(post.created_at))}
          </span>
        </div>
      </div>
      <Collapse isOpen={openCommentCollapse}>
        <div className="flex flex-col">
          <Formik
            initialValues={commentInitialValues}
            onSubmit={shareComment}
            validationSchema={commentValidationSchema}
          >
            {({ errors }) => (
              <Form className="flex items-center w-full gap-x-2  opacity-50">
                <div className="flex items-start justify-center w-full flex-col relative">
                  <Field
                    className="input w-full"
                    name="comment"
                    id="comment"
                    placeholder={`Add Comment ${user?.username}`}
                  />
                  {errors.comment ? (
                    <span className="absolute right-3">
                      <Badge
                        bgColor={BgColors.ERROR}
                        text={errors.comment || ""}
                        customClass="px-2 py-1"
                        textColor={TextColors.LIGHT}
                      />
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                <button
                  disabled={
                    errors.comment || commentPending == true ? true : false
                  }
                  type="submit"
                  className="btn btn-xs btn-primary text-sm"
                >
                  Post
                </button>
              </Form>
            )}
          </Formik>
          <div className="py-3">
            {comments && comments?.length > 0 ? (
              comments.map((comment, index) => {
                return (
                  <Comment
                    teamId={team.id}
                    postId={post.id}
                    comment={comment}
                    key={index}
                  />
                );
              })
            ) : (
              <Alert type={AlertTypes.WARNING} message="No Comment!" />
            )}
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default Post;
