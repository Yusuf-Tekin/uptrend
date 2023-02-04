import React from "react";
import { useAuth } from "../../Provider/AuthContext";
import {Navigate} from 'react-router-dom'
const PrivateRoute: React.FC<{
  children?: JSX.Element;
}> = ({ children }) => {
  const { loading,token } = useAuth();

  if(!loading) {
    if(token) {
      return <>{children}</>
    }
    else {
      return <Navigate to={"/auth/signin"} />
    }
  }
  else {
    return <>Yükleniyor...</>
  }


};

export default PrivateRoute;
