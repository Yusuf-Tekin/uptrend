import { PayloadAction } from "./../../../node_modules/@reduxjs/toolkit/src/createAction";
import { createSlice } from "@reduxjs/toolkit";

export interface TeamError {
  message: string;
  content?: string;
}

export interface TeamSlice {
  teams: Array<any> | null;
  loading: boolean;
  error: TeamError | null;
}

const initialState: TeamSlice = {
  teams: null,
  loading: false,
  error: null,
};

export const teamSlice = createSlice({
  initialState: initialState,
  name: "TeamSlice",
  reducers: {
    setTeams: (state, { payload }: PayloadAction<Array<any>>) => {
      state.teams = payload;
    },
    addTeam: (state, { payload }: PayloadAction) => {
      if (payload != null) {
        state.teams?.push(payload);
      }
    },
    deleteTeam: (state, { payload }: PayloadAction<number>) => {
      if (payload != null) {
        const newTeams = state.teams?.filter(team => team.id !== payload);
        state.teams = newTeams ? newTeams : [];
      }
    },
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.loading = payload;
    },
    setError: (state, { payload }: PayloadAction<TeamError | null>) => {
      state.error = payload;
    },
  },
});

export const { setError, setLoading, setTeams,addTeam,deleteTeam } = teamSlice.actions;

export default teamSlice.reducer;
