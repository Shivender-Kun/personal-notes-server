export interface IAdmin {
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUser {
  email?: string;
  password?: string;
  coverPicture?: string;
  profilePicture?: string;
  username: string;
  // themeRef?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILabel {
  name: string;
  userRef?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INote {
  title?: string;
  content?: string;
  labels?: ILabel[];
  userRef?: string;
  isArchived?: boolean;
  isPinned?: boolean;
  isDeleted?: boolean;
  bgColor?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITheme {
  name: string;
  appBackgroundColor?: string;
  appTextColor?: string;
  menuBackgroundColor?: string;
  menuTextColor?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
}
