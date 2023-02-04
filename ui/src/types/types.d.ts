export interface UserInterface {
  id: number;
  fullname: string;
  username: string;
  email: string;
  profile_image: string;
  is_block: number;
  is_verify: number;
  created_at: Date;
  updated_at: Date;
  user_role: string;
  team_role: string;
  notifications: INotification[];
  teams:ITeam[];
}

export interface INotification {
  id: number;
  title: string;
  content: string;
  is_read: number;
  created_at: string;
  user_id: number;
  redirect_url: string;
}

export interface TabMenu {
  id: number;
  text: string;
  component: JSX.Element;
}

export interface TabProps {
  menus: TabMenu[];
  activeTab: TabMenu; // default 0
  setActiveTab:Function
}

export interface IPost {
  id: number;
  author_id: number;
  team_id: number;
  post_text: string;
  role: string;
  is_comments: number;
  created_at: Date;
  comments: IComment[],
  likes:ILike[],
  team:ITeam
}

export interface ITeam {
  id: number;
  name: string;
  image: string;
  about?: any;
  author_id: number;
  is_active: number;
  created_at: Date;
  updated_at: Date;
  users: UserInterface[]
  posts: IPost[];
  messages:IMessage[];
  noReadMessageCount:number;
}


export interface IComment {
  id:number;
  comment:string;
  user_id:number;
  post_id:number;
  created_at:string;
  author:UserInterface
}

export interface ILike {
  id:number;
  user_id:number;
  post_id:number;
  created_at:string;
}


export interface IMessage {
  id:number;
  message:string;
  author_id:number;
  team_id:number;
  author:UserInterface;
  team:ITeam,
  created_at:string;
  read:boolean
}