import React,{useState} from "react";
import Alert from "../../components/Alert/Alert";
import { AlertTypes } from "../../helper/AlertTypes/AlertTypes";
import { useAppSelector } from "../../store/hooks";
import { ITeam } from "../../types/types";
import Team from "./Team";


interface ListTypes {
  list(teams:ITeam[]):ITeam[]
}

class ListOfAll implements ListTypes {
  list(teams:ITeam[]): ITeam[] {
    return teams;
  }
}

class ListOfActives implements ListTypes {
  list(teams:ITeam[]): ITeam[] {
    return teams.filter(team => team.is_active === 1);
  }
}

class ListOfNotActives implements ListTypes {
  list(teams:ITeam[]): ITeam[] {
    return teams.filter(team => team.is_active === 0);
  }
}



const MyTeams: React.FC = () => {
  const teams = useAppSelector((state) => {
    return state.user.teams.filter(
      (team) => team.author_id === state.user.user?.id
    );
  });


  const [filteredTeams,setFilteredTeams] = useState<ListTypes>(new ListOfAll())

  const updateListType = (e:React.FormEvent<HTMLSelectElement>) => {
    const {value} = e.currentTarget;
    if(value === "ALL" || value === "ACTIVE" || value === "NOT_ACTIVE") {
      value === "ACTIVE" ? setFilteredTeams(new ListOfActives()) : value === "NOT_ACTIVE" ? setFilteredTeams(new ListOfNotActives) : setFilteredTeams(new ListOfAll());
    }

  };

  return (
    <>
      <div className="my-3 py-2">
        <select onChange={updateListType} className="input">
          <option value="ALL">All Teams</option>
          <option value="ACTIVE">Active Teams</option>
          <option value="NOT_ACTIVE">Not Active Teams</option>
        </select>
      </div>
      {!filteredTeams || filteredTeams.list(teams).length === 0 ? (
        <Alert
          type={AlertTypes.ERROR}
          message={"Not Found Team! 😕"}
        />
      ) : (
        <div className="grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-3">
          {filteredTeams.list(teams).map((team: any) => {
            return <Team key={team.id} team={team} />;
          })}
        </div>
      )}
    </>
  );
};

export default MyTeams;
