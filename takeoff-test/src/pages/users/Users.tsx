import { AxiosError } from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonPrimary from '../../components/buttons/button-primary/ButtonPrimary';
import Input from '../../components/inputs/input/Input';
import UserCardLarge from '../../components/users/user-card-large/UserCardLarge';
import UserCardSmall from '../../components/users/user-card-small/UserCardSmall';
import { iUser } from '../../redux/users/types/users';
import { UsersActionsType, UsersInitialState, UsersReducer } from '../../redux/users/UsersReducer';
import { NETWORK_ERROR_OCCURED } from '../../templates/templates';
import Axios from '../../utils/Axios';
import { DELETE_USER, GET_USERS } from '../../utils/endpoints';
import './Users.scss';

interface iUsersComponentProps {
  token: string | null;
  resetToken: () => void
}

const Users: React.FC<iUsersComponentProps> = ({ token, resetToken }) => {

  let navigate = useNavigate();
  const tokenLocal = localStorage.getItem('token');

  const [state, dispatch] = useReducer(UsersReducer, UsersInitialState);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [search, setSearch] = useState('');

  /* 
    Getting users from server if state.users is null 
    Also checking if token is exists, otherwise redirecting to /login page
  */
  useEffect(() => {
    if (token === null && tokenLocal === null) {
      return navigate('/login');
    } else if (state.users === null) {
      Axios.get(GET_USERS)
      .then(res => {
        dispatch({ type: UsersActionsType.SET_USERS, payload: res.data });
        setIsNetworkError(false);
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 401) {
          resetToken();
          localStorage.removeItem('token');
          return navigate('/login');
        } else {
          setIsNetworkError(true);
        }
      })
    }
  }, [navigate, resetToken, state.users, token, tokenLocal]);

  /* Handling deleting user */
  useEffect(() => {
    if (state.selectedUserId !== null && state.isDeletingUser) {

      // eslint-disable-next-line no-restricted-globals
      if (confirm(`Are you sure you want to delete user with id: ${state.selectedUserId}?`)) {
        Axios
        .delete(DELETE_USER(state.selectedUserId))
        .then(res => {
          dispatch({ type: UsersActionsType.DELETE_USER, payload: state.selectedUserId as number });
          alert('User was successfuly deleted!')
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 401) {
            resetToken();
            localStorage.removeItem('token');
            return navigate('/login');
          } else {
            setIsNetworkError(true);
          }
        })
      } else {
        dispatch({ type: UsersActionsType.SELECT_USER, payload: null });
      }
    }
  }, [navigate, resetToken, state.isDeletingUser, state.selectedUserId])

  const addUser = () => {
    dispatch({ type: UsersActionsType.SET_IS_ADDING_USER, payload: !state.isAddingUser })
    dispatch({ type: UsersActionsType.SET_IS_EDITING_USER, payload: false })
    dispatch({ type: UsersActionsType.SET_IS_DELETING_USER, payload: false })
    dispatch({ type: UsersActionsType.SELECT_USER, payload: null });
  }

  const editUser = () => {
    dispatch({ type: UsersActionsType.SET_IS_ADDING_USER, payload: false })
    dispatch({ type: UsersActionsType.SET_IS_EDITING_USER, payload: !state.isEditingUser })
    dispatch({ type: UsersActionsType.SET_IS_DELETING_USER, payload: false })
    dispatch({ type: UsersActionsType.SELECT_USER, payload: null })
  }

  const deleteUser = () => {
    dispatch({ type: UsersActionsType.SET_IS_ADDING_USER, payload: false })
    dispatch({ type: UsersActionsType.SET_IS_EDITING_USER, payload: false })
    dispatch({ type: UsersActionsType.SET_IS_DELETING_USER, payload: !state.isDeletingUser })
    dispatch({ type: UsersActionsType.SELECT_USER, payload: null })
  }

  const chooseCardClickAction = (user: iUser) => {
    if (
      (state.isEditingUser || state.isDeletingUser) && 
      (state.selectedUserId === null || state.selectedUserId !== user.id)
    ) {
      dispatch({ type: UsersActionsType.SELECT_USER, payload: user.id })
    } else {
      dispatch({ type: UsersActionsType.SELECT_USER, payload: null })
    }
  }

  return (
    <div className='users__wrapper'>
      {isNetworkError && (
        NETWORK_ERROR_OCCURED
      )}
      {isNetworkError === false && (
        <div className='users__buttons'>
          <span className='buttons__description'>
            First toggle an action and then a card.
          </span>
          <div>
            <Input 
              value={search}
              onChange={setSearch}
              placeholder='Search by name'
              id='search'
              style={{ width: '300px' }}
            />
          </div>
          <div className='buttons__wrapper'>
            <ButtonPrimary
              title='Add user'
              onClick={addUser}
              style={state.isAddingUser ? { background: 'green' } : {}}
            />
            <ButtonPrimary
              title='Edit user'
              onClick={editUser}
              style={state.isEditingUser ? { background: 'green' } : {}}
            />
            <ButtonPrimary
              title='Delete user'
              onClick={deleteUser}
              style={state.isDeletingUser ? { background: 'green' } : {}}
            />
          </div>
        </div>
      )}
      <div className='users__columns'>
        <div className='users__left-column'>
          {isNetworkError === false
          && state.users !== null
          && state.users
          .filter((usr) => usr.name.toLowerCase().indexOf(search.toLowerCase()) !== -1)
          .map(user => {
            return (
              <UserCardSmall
                id={user.id}
                name={user.name}
                email={user.email}
                companyName={user.company.name}
                onClick={() => chooseCardClickAction(user)}
                className={state.selectedUserId === user.id ? 'active' : ''}
              />
            )
          })}
        </div>
        <div className='users__right-column'>
          {isNetworkError === false
          && state.isEditingUser
          && state.users
          && state.selectedUserId
          && (
            <UserCardLarge
              user={state.users.filter(user => user.id === state.selectedUserId)[0]}
              dispatch={dispatch}
              resetToken={resetToken}
              type='edit'
            />
          )}
          {isNetworkError === false
          && state.isAddingUser
          && (
            <UserCardLarge
              dispatch={dispatch}
              resetToken={resetToken}
              type='add'
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Users;