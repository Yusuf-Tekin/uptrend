import { AlertTypes } from "../../helper/AlertTypes/AlertTypes";
import Sidebar from "../../layout/Sidebar";
import { useAppSelector } from "../../store/hooks";
import Alert from "../Alert/Alert";
import { useEffect, useState } from "react";
import { Roles } from "../../helper/Roles/Roles";
import Post from "../Post/Post";
import { useStateUpdate } from "../../Provider/UpdateStateContext";
function Home() {
  const allPost = useAppSelector((state) => state.post.posts);
  const meta = allPost.meta;

  const [posts, setPosts] = useState(allPost.posts);
  const { getPosts } = useStateUpdate();
  const filterPosts = (e: React.FormEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    if (value !== "ALL") {
      setPosts(allPost.posts.filter((post) => post.role === value));
    } else {
      setPosts(allPost.posts);
    }
  };

  useEffect(() => {
    setPosts(allPost.posts);
  }, [allPost]);

  const handlePagination = () => {
    getPosts(meta?.current_page ? meta.current_page + 1 : 1);
  };

  return (
    <Sidebar>
      <div className="py-2">
        <div className="flex justify-start px-3">
          <select defaultValue={"ALL"} onChange={filterPosts} className="input">
            <option value={"ALL"}>ALL</option>
            {Roles.map((role, index) => (
              <option value={role} key={index}>
                {role}
              </option>
            ))}
          </select>
        </div>
        {posts && posts.length > 0 ? (
          <div className="flex flex-col items-center">
            <div className="max-w-[624px] 2xl:min-w-[624px] xl:min-w-[624px] lg:min-w-[624px] w-max">
              {posts.map((post, index) => {
                return <Post key={index} post={post} team={post.team} />;
              })}
            </div>
            {meta && meta?.total > meta.current_page * meta.per_page ? (
              <button
                onClick={handlePagination}
                className="btn btn-primary btn-sm mt-4"
              >
                Daha Fazla
              </button>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <Alert
            type={AlertTypes.WARNING}
            message="No one has opened a team yet! 😞"
          />
        )}
      </div>
    </Sidebar>
  );
}

export default Home;
