import { IPost } from "./../../types/types.d";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url?: any;
  previous_page_url?: any;
}

interface InitialValues {
  posts: {
    meta: IMeta | null;
    posts: IPost[];
  };
}

const initialValues: InitialValues = {
  posts: {
    meta: null,
    posts: [],
  },
};

interface GetPostsType {
  posts: {
    meta: IMeta;
    posts: IPost[];
  };
  isConcat?: boolean;
}

interface RemovePostTyoe {
  postId:number;
}

const postSlice = createSlice({
  initialState: initialValues,
  name: "postSlice",
  reducers: {
    setAllPosts: (state, { payload }: PayloadAction<GetPostsType>) => {
      if (payload.isConcat === true) {
        state.posts.posts = state.posts.posts.concat(payload.posts.posts)
        state.posts.meta = payload.posts.meta;
      } else {
        state.posts.posts = payload.posts.posts;
        state.posts.meta = payload.posts.meta;
      }
    },
    postRemove: (state,{payload}:PayloadAction<RemovePostTyoe>) => {
      const {postId} = payload;
      const findIndex = state.posts.posts.findIndex(post => post.id === postId);
      state.posts.posts.splice(findIndex,1);
    }
  },
});

export const { setAllPosts,postRemove } = postSlice.actions;

export default postSlice.reducer;
