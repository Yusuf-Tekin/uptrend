import axios from "../config/axios";
import React, { createContext, useEffect, useContext, useMemo } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "../store/hooks";
import { setError } from "../store/features/TeamSlice";
import { useAuth } from "./AuthContext";
import { ShowError } from "../helper/ShowError/ShowError";
import { setNotifications, setTeams, setUserProfile } from "../store/features/UserSlice";
import { setAllPosts } from "../store/features/PostSlice";

interface UpdateStateContextProps {
  children?: React.ReactNode;
}

interface IUpdateStateCtx {
  getTeams: Function;
  getMyProfile: Function;
  getPosts: Function;

}

const UpdateStateContext = createContext<IUpdateStateCtx>({
  getTeams: () => {},
  getMyProfile: () => {},
  getPosts: () => {},

});

export const UpdateStateProvider: React.FC<UpdateStateContextProps> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const { loggedIn,setUser,token } = useAuth();

  const getTeams = () => {
    axios(token || undefined)
      .get("/team/my")
      .then((res) => {
        const { code } = res.data;
        if (code === 200) {
          // dispatch(setTeams(res.data.data.result));
        } else {
          throw new Error();
        }
      })
      .catch((err) => {
        toast.error("Fail! Please try again.");
        dispatch(
          setError({
            message: "Fail! Please try again!",
          })
        );
      });
  };

  const getMyProfile = () => {
    axios(token || undefined)
      .get("/user/profile")
      .then((res) => {
        const { code } = res.data;
        if (code === 200) {
          const user = res.data.data;
          setUser(user); // Context Api
          
          const {teams,notifications} = user;

          dispatch(setUserProfile(user));
          dispatch(setNotifications(notifications));
          dispatch(setTeams(teams));
        }
        else {
          throw new Error();
        }
      })
      .catch(err => {
        ShowError(err)
      })
  }

  const getPosts =(page?:number) => {
    axios(token || "").get('/post/get-all',{
      params: {
        page
      }
    }).then(res => {

      const {code,data} = res.data;

      if(code !== 200) {
        throw new Error();
      }
      else {
        dispatch(setAllPosts({
          posts:{
            meta:data.meta,
            posts:data.data
          },
          isConcat:page  && page > 1 ? true : false
        }))
      }

    }).catch(err => {
      ShowError(err);
    })
  }

  useMemo(() => {
    if(loggedIn) {
        getMyProfile();
        getTeams();
        getPosts();
    }
  },[loggedIn])

  const values = {
    getTeams,
    getMyProfile,
    getPosts
  };

  return (
    <UpdateStateContext.Provider value={values}>
      {children}
    </UpdateStateContext.Provider>
  );
};

export const useStateUpdate = () => useContext(UpdateStateContext);
