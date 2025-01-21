export interface User {
  tg_id: number,
  lastname?: string,
  firstname?: string,
  avatar?: string,
  type?: string,
  role?: string,
  rating?: number,
  mafia_rating?: number,
  maniac_rating?: number,
  commissar_rating?: number,
  doctor_rating?: number,
  sheriff_rating?: number
}
export interface Game {
  id?: number,
  creator_id: number,
  stage: number,
  live_user?: number,
  timer?: string,
  roles?: string[],
  status?: string,
  created?: Date,
  updatedAt?: Date,
  round?: number
}

export interface GameUser {
  gameId?: number,
  id?: number,
  name?: string,
  avatar?: string,
  role: string,
  type?: string,
  status?: string,
  lawyer_immuniter?: boolean,
  bordel?: number,
  drags?: boolean,
  user_id: number
  created?: Date,
  updatedAt?: Date,
  card?: string,
  wearon?: boolean
}

export interface gameFinance {
  id?: number,
  gameId: number,
  count?: number,
  standart_count?: number,
  standart_price?: number,
  discount_count?: number,
  discount_price?: number,
  free?: number,
  total?: number,
  admin_coast?: number,
  created?: Date,
  updatedAt?: Date
}

export type Options = {
  param: string,
  value?: number | boolean
}

export interface UserActions {
  [key: string]: string;
}
export interface CardsCount {
  [key: string]: number;
}

export interface ITelegramUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
}

export interface IWebApp {
  initData: string;
  initDataUnsafe: {
    query_id: string;
    user: ITelegramUser;
    auth_date: string;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: string;
  themeParams: {
    link_color: string;
    button_color: string;
    button_text_color: string;
    secondary_bg_color: string;
    hint_color: string;
    bg_color: string;
    text_color: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  isClosingConfirmationEnabled: boolean;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isProgressVisible: boolean;
    isActive: boolean;
  };
  HapticFeedback: any;
}

export interface nominationUser {
  gameUserId: number,
  gameId: number,
  selected: boolean,
  votes: number,
  game_round: number
}

export interface Move {
  id?: number,
  action: string,
  artor_name: string,
  artor_role: string,
  artor_id: number,
  game_id: number,
  opponent_name: string,
  opponent_id: number,
  opponent_role: string,
  round: number,
  game_stage: number,
  killed_by_opponent?: boolean
}

export interface Messages {
  id?: number,
  game_id?: number,
  gameTime: string,
  game_round?: number,
  message: string
}