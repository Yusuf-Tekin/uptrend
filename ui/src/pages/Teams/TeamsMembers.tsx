import axios from "../../config/axios";
import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Alert from "../../components/Alert/Alert";
import Members from "../../components/Members/Member";
import { AlertTypes } from "../../helper/AlertTypes/AlertTypes";
import Sidebar from "../../layout/Sidebar";
import { UserInterface } from "../../types/types";
import { useAuth } from "../../Provider/AuthContext";
import { ShowError } from "../../helper/ShowError/ShowError";
function TeamsMembers() {
  const { id } = useParams();

  const [members, setMembers] = useState<UserInterface[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<UserInterface[]>([]);
  const [filterText, setFilterText] = useState("");

  const { token } = useAuth();

  useMemo(() => {
    setMembers([]);
    axios(token || undefined)
      .get("/team/get-members", {
        params: {
          teamId: id,
        },
      })
      .then((res) => {
        const { code, data } = res.data;
        if (code !== 200) {
          throw new Error();
        } else {
          setMembers(data);
        }
      })
      .catch((err) => {
        ShowError(err);
      });
  }, [id]);

  useEffect(() => {
    if (filterText.length > 1) {
      setFilteredMembers(
        members.filter((member) => member.username.startsWith(filterText))
      );
    } else {
      setFilteredMembers([]);
    }
  }, [filterText]);

  return (
    <Sidebar>
      <div className="p-5">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl text-slate-800 mb-5">Members</h2>
          <input
            className="input"
            placeholder="Filter"
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
            }}
          />
        </div>
        <div className="mt-3">
          {filterText.length > 1 && filteredMembers.length > 0 ? (
            <div className="w-full grid grid-cols-1 2xl:grid-cols-6 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3  gap-3">
              {filteredMembers.map((member) => {
                return <Members member={member} key={member["id"]} />;
              })}
            </div>
          ) : members?.length > 0 ? (
            <div className="w-full grid grid-cols-1 2xl:grid-cols-6 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3  gap-3">
              {members.map((member) => {
                return <Members member={member} key={member["id"]} />;
              })}
            </div>
          ) : (
            <Alert type={AlertTypes.WARNING} message={"No member the team!"} />
          )}
        </div>
      </div>
    </Sidebar>
  );
}

export default TeamsMembers;
