import { iUser } from "./types/users";

interface iUsersInitialState {
  users: iUser[] | null;
  selectedUserId: number | null;
  isAddingUser: boolean;
  isEditingUser: boolean;
  isDeletingUser: boolean;
}

export const UsersInitialState: iUsersInitialState = {
  users: null,
  selectedUserId: null,
  isAddingUser: false,
  isDeletingUser: false,
  isEditingUser: false,
}

export enum UsersActionsType {
  SET_USERS = 'SET_USERS',
  ADD_USER = 'ADD_USER',
  DELETE_USER = 'DELETE_USER',
  EDIT_USER = 'EDIT_USER',
  SELECT_USER = 'SELECT_USER',
  SET_IS_ADDING_USER = 'SET_IS_ADDING_USER',
  SET_IS_EDITING_USER = 'SET_IS_EDITING_USER',
  SET_IS_DELETING_USER = 'SET_IS_DELETING_USER',
}

type ActionUsersPayload = {
  type: UsersActionsType.SET_USERS,
  payload: iUser[]
}

type ActionUserPayload = {
  type: UsersActionsType.ADD_USER | UsersActionsType.EDIT_USER,
  payload: iUser,
}

type ActionIdPayload = {
  type: UsersActionsType.DELETE_USER | UsersActionsType.SELECT_USER,
  payload: number,
}

type ActionNullPayload = {
  type: UsersActionsType.SELECT_USER,
  payload: null,
}

type ActionBooleanPayload = {
  type: UsersActionsType.SET_IS_ADDING_USER | UsersActionsType.SET_IS_DELETING_USER | UsersActionsType.SET_IS_EDITING_USER,
  payload: boolean,
}


export type UsersActionTypes = ActionUsersPayload | ActionUserPayload | ActionIdPayload | ActionNullPayload | ActionBooleanPayload;

export const UsersReducer = (state: iUsersInitialState, action: UsersActionTypes) => {
  switch (action.type) {
    case UsersActionsType.SET_USERS:
      return {
        ...state,
        users: action.payload
      }
    case UsersActionsType.SELECT_USER:
      return {
        ...state,
        selectedUserId: action.payload,
      }
    case UsersActionsType.EDIT_USER:
      return {
        ...state,
        users: [...state.users!.filter(user => user.id !== action.payload.id), action.payload]
      }
    case UsersActionsType.DELETE_USER:
      return {
        ...state,
        users: [...state.users!.filter(user => user.id !== action.payload)]
      }
    case UsersActionsType.ADD_USER:
      return {
        ...state,
        users: [...state.users!, action.payload]
      }
    case UsersActionsType.SET_IS_ADDING_USER:
      return {
        ...state,
        isAddingUser: action.payload,
      }
    case UsersActionsType.SET_IS_DELETING_USER:
      return {
        ...state,
        isDeletingUser: action.payload,
      }
    case UsersActionsType.SET_IS_EDITING_USER:
      return {
        ...state,
        isEditingUser: action.payload,
      }
    default:
      return state;
  }
}