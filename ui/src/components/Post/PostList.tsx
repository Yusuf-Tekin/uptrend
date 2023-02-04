import React, { useState, useEffect } from "react";
import { AlertTypes } from "../../helper/AlertTypes/AlertTypes";
import { IPost, ITeam } from "../../types/types";
import Alert from "../Alert/Alert";
import Post from "./Post";

interface IPostList {
  team: ITeam;
}

const PostList: React.FC<IPostList> = ({ team }) => {
  const [posts, setPosts] = useState<IPost[]>(team.posts);

  useEffect(() => {
    setPosts(team.posts);
  }, [team.posts]);

  return (
    <div className="w-full">
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <div key={index}>
            <Post team={team} post={post} />
            {team.posts.length - 1 === index ? null : <hr />}
          </div>
        ))
      ) : (
        <div className="mt-4">
          <Alert type={AlertTypes.WARNING} message={"No post yet!"} />
        </div>
      )}
    </div>
  );
};

export default PostList;
