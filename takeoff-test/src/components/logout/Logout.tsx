import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthActions, AuthActionTypes } from '../../redux/auth/AuthReducer';
import ButtonPrimary from '../buttons/button-primary/ButtonPrimary';
import './Logout.scss';

interface iLogout {
  dispatch: React.Dispatch<AuthActions>
}

const Logout: React.FC<iLogout> = ({ dispatch }) => {

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: AuthActionTypes.SET_TOKEN, payload: null });
    return <Navigate to='/login' replace />
  }

  return (
    <div className='logout__wrapper'>
      <ButtonPrimary style={{ color: 'black' }} title='Logout' onClick={() => logout()}/>
    </div>
  )
}

export default Logout;
