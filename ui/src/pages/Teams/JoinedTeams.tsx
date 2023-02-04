import React, { useState, useEffect } from "react";
import Alert from "../../components/Alert/Alert";
import { AlertTypes } from "../../helper/AlertTypes/AlertTypes";
import { useAppSelector } from "../../store/hooks";
import Team from "./Team";

const JoinedTeams: React.FC = () => {

  const user = useAppSelector(state => state.user.user);


  const teams = useAppSelector(state => {
    return state.user.teams.filter(team => team.author_id !== user?.id);
  })


  return (
    <>
      {teams && teams?.length > 0 ? (
        <div className="grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-3">
          {teams?.map((team: any) => {
            return team.author_id !== user?.id ? <Team menuType="OTHER" key={team.id} team={team} /> : null 
          })}
        </div>
      ) : (
        <Alert
          type={AlertTypes.ERROR}
          message={"You don't have a joined team yet! 😕"}
        />
      )}
    </>
  );
};

export default JoinedTeams;
