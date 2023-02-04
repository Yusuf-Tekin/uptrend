import {
  IComment,
  IMessage,
  INotification,
  IPost,
  ITeam,
  UserInterface,
} from "./../../types/types.d";
import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "./../../../node_modules/@reduxjs/toolkit/src/createAction";

interface UpdateTeam {
  teamId: number;
  team: ITeam;
}

interface UserSliceTypes {
  user: UserInterface | null;
  notifications: INotification[];
  teams: ITeam[];
}

interface AddCommentTypes {
  teamId: number;
  postId: number;
  comment: IComment;
}

interface RemoveCommentTypes {
  teamId: number;
  postId: number;
  commentId: number;
}

interface AddPostTypes {
  post: IPost;
  order?: "FIRST" | "LAST";
  teamId: number;
}

interface RemovePostTypes {
  postId: number;
  teamId: number;
}

interface GetPostTypes {
  teamId: number;
  postId: number;
}

interface RemoveUserTypes {
  teamId: number;
  memberId: number;
}

interface AddMessageTypes {
  message:IMessage
}

export let initialValues: UserSliceTypes = {
  user: null,
  notifications: [],
  teams: [],
};

const UserSlice = createSlice({
  initialState: initialValues,
  name: "UserSlice",
  reducers: {
    setUserProfile: (
      state,
      { payload }: PayloadAction<UserInterface | null>
    ) => {
      state.user = payload;
    },
    setNotifications: (state, { payload }: PayloadAction<INotification[]>) => {
      state.notifications = payload;
    },
    setTeams: (state, { payload }: PayloadAction<ITeam[]>) => {
      state.teams = payload;
      state.teams.forEach(team => team.noReadMessageCount == 0)
    },
    addTeam: (state, { payload }: PayloadAction<ITeam>) => {
      state.teams.push({
        ...payload,
        is_active:1,
        noReadMessageCount:0
      });
    },
    updateTeam: (state, { payload }: PayloadAction<UpdateTeam>) => {
      const { teamId, team } = payload;
      const findTeam = state.teams.findIndex((team) => team.id === teamId);
      if (findTeam != -1) {
        state.teams.splice(findTeam, 1, team);
      }
    },
    removeTeam: (
      state,
      {
        payload,
      }: PayloadAction<{
        teamId: number;
      }>
    ) => {
      const findTeam = state.teams.findIndex(
        (team) => team.id === payload.teamId
      );
      if (findTeam != -1) {
        state.teams.splice(findTeam, 1);
      }
    },
    addPost: (state, { payload }: PayloadAction<AddPostTypes>) => {
      const team = state.teams.find((team) => team.id === payload.teamId);
      if (team) {
        if (!payload.order || payload.order === "FIRST") {
          team.posts.unshift(payload.post);
        } else {
          team.posts.push(payload.post);
        }
      }
    },
    removePost: (state, { payload }: PayloadAction<RemovePostTypes>) => {
      const { teamId, postId } = payload;

      const findTeam = state.teams.find((team) => team.id === teamId);

      if (findTeam) {
        const findPostIndex = findTeam.posts.findIndex(
          (post) => post.id === postId
        );
        if (findPostIndex != -1) {
          findTeam.posts.splice(findPostIndex, 1);
        }
      }
    },
    addComment: (state, { payload }: PayloadAction<AddCommentTypes>) => {
      const { teamId, postId, comment } = payload;

      const findTeam = state.teams.find((team) => team.id === teamId);

      if (findTeam) {
        const findPost = findTeam.posts.find((post) => post.id === postId);

        if (findPost) {
          findPost.comments.unshift(comment);
        }
      }
    },
    removeComment: (state, { payload }: PayloadAction<RemoveCommentTypes>) => {
      const { teamId, postId, commentId } = payload;

      console.log(teamId, postId, commentId);

      const findTeam = state.teams.find((team) => team.id === teamId);

      if (!findTeam) return;

      const findPost = findTeam.posts.find((post) => post.id === postId);

      if (!findPost) return;

      const findCommentIndex = findPost.comments.findIndex(
        (comment) => comment.id === commentId
      );

      if (findCommentIndex === -1) return;

      findPost.comments.splice(findCommentIndex, 1);
    },

    removeMember: (state, { payload }: PayloadAction<RemoveUserTypes>) => {
      const { teamId, memberId } = payload;

      const findTeam = state.teams.find((team) => team.id == teamId);

      if (findTeam) {
        findTeam.users = findTeam.users.filter((user) => user.id !== memberId);
      }
    },

    addMessage: (state,{payload}:PayloadAction<AddMessageTypes>) => {

      const {message} = payload;

      const findTeam = state.teams.find(team => team.id === message.team_id);

      if(findTeam) {
        findTeam.messages.unshift(message);
        findTeam.noReadMessageCount = findTeam.noReadMessageCount+1;
      }

    }
  },
});

export const {
  setUserProfile,
  setNotifications,
  setTeams,
  addPost,
  removePost,
  addComment,
  removeComment,
  addTeam,
  removeTeam,
  updateTeam,
  removeMember,
  addMessage
} = UserSlice.actions;

export default UserSlice.reducer;
