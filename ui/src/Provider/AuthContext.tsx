import axios from "../config/axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { UserInterface } from "../types/types";
import { Cookies } from "react-cookie";
import {
  disconnectSocket,
  initiateSocketConnection,
  socket,
} from "./SocketIO.service";
import { addMessage } from "../store/features/UserSlice";
import { useAppDispatch } from "../store/hooks";
interface IAuth {
  loggedIn: boolean;
  loading: boolean;
  token: string | null;
  user: UserInterface | null;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>;
}

interface AuthContextProps {
  children?: React.ReactNode;
}

const AuthContext = createContext<IAuth>({
  loggedIn: false,
  loading: false,
  token: null,
  user: null,
  setToken: () => {},
  setLoading: () => {},
  setLoggedIn: () => {},
  setUser: () => {},
});

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const cookies = new Cookies();

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>(cookies.get("access_token"));
  const [user, setUser] = useState<UserInterface | null>(null);

  const dispatch = useAppDispatch();

  const isAuth = () => {
    setLoading(true);
    axios(token)
      .get("/auth/check")
      .then((res) => {
        setLoggedIn(true);
        initiateSocketConnection();
      })
      .catch((err) => {
        setLoggedIn(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (socket) {
      socket?.on("new-message", (data) => {
        data.message.read = false;
        dispatch(addMessage(data));
      });
    }
    return () => {
      if (socket) {
        socket.off("new-message");
      }
    };
  });

  useEffect(() => {
    isAuth();
  }, []);

  const values = {
    loggedIn,
    setLoggedIn,
    loading,
    setLoading,
    setToken,
    token,
    user,
    setUser,
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        Yükleniyor..
      </div>
    );
  }
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
