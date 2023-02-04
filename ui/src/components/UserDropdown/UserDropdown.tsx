import axios from "../../config/axios";
import { BiLogOut } from "react-icons/bi";
import { useAuth } from "../../Provider/AuthContext";
import Dropdown from "../Dropdown/Dropdown";
import { MenuItem } from "../Menu/Menu";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Cookies } from "react-cookie";
import UserProfile from "../UserProfile/UserProfile";
import { disconnectSocket } from "../../Provider/SocketIO.service";

interface UserDropdownProps {
  reversed?: boolean;
}

const UserDropdown: React.FC<UserDropdownProps> = ({ reversed }) => {
  const { user, token, setLoggedIn, setToken, setUser } = useAuth();
  const navigate = useNavigate();

  const userDropdown: MenuItem[] = [
    {
      id: 1,
      text: "Logout",
      color: "text-red-500",
      icon: <BiLogOut />,
      handle: () => {
        logout();
      },
    },
  ];

  const cookies = new Cookies();

  const logout = () => {
    axios(token || undefined)
      .get("/auth/logout")
      .then((res) => {
        if (res.data.code !== 200) {
          throw new Error();
        } else {
          const { message } = res.data;
          toast.success(message);
          disconnectSocket();
          cookies.remove("access_token");
          setLoggedIn(false);
          setToken("");
          setUser(null);
          navigate("/");
        }
      })
      .catch((err) => {
        toast.error("Bir şeyler ters gitti.Tekrar deneyin!");
      });
  };

  return (
    <div
      className={`flex justify-center items-center gap-x-3 ${
        reversed ? "flex-row-reverse" : ""
      }`}
    >
      <span className="font-semibold text-black opacity-90">
        {user?.fullname}
      </span>
      <Dropdown items={userDropdown} menuClass={"top-10 right-10"}>
        <UserProfile
          size="w-10 h-10 text-lg"
          fullname={user?.fullname || "User Account"}
        ></UserProfile>
      </Dropdown>
    </div>
  );
};

export default UserDropdown;
