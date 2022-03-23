interface iAuthState {
  token: string | null;
  login: string | null;
  email: string | null;
  userId: number | null;
}

export const AuthInitialState: iAuthState = {
  token: null,
  login: null,
  email: null,
  userId: null,
}

export enum AuthActionTypes {
  SET_TOKEN = 'SET_TOKEN',
  SET_USER_ID = 'SET_USER_ID',
  SET_LOGIN = 'SET_LOGIN',
  SET_EMAIL = 'SET_EMAIL',
}

type ActionStringPayload = {
  type: AuthActionTypes.SET_TOKEN | AuthActionTypes.SET_EMAIL | AuthActionTypes.SET_LOGIN,
  payload: string
}

type ActionNullPayload = {
  type: AuthActionTypes.SET_TOKEN | AuthActionTypes.SET_EMAIL | AuthActionTypes.SET_LOGIN | AuthActionTypes.SET_USER_ID,
  payload: null
}

type ActionNumberPayload = {
  type: AuthActionTypes.SET_USER_ID,
  payload: number
}

export type AuthActions = ActionStringPayload | ActionNullPayload | ActionNumberPayload;

export const AuthReducer = (state: iAuthState, action: AuthActions) => {
  switch (action.type) {
    case AuthActionTypes.SET_TOKEN: 
      return {
        ...state,
        token: action.payload
      }
    case AuthActionTypes.SET_EMAIL:
      return {
        ...state,
        email: action.payload
      }
    case AuthActionTypes.SET_LOGIN:
      return {
        ...state,
        login: action.payload
      }
    case AuthActionTypes.SET_USER_ID:
      return {
        ...state,
        userId: action.payload
      }
    default:
      return state;
  }
}