import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonPrimary from '../../components/buttons/button-primary/ButtonPrimary';
import Input from '../../components/inputs/input/Input';
import Loader from '../../components/loader/Loader';
import { AuthActions, AuthActionTypes } from '../../redux/auth/AuthReducer';
import { POST_LOGIN } from '../../utils/endpoints';
import { validateEmail } from '../../utils/validateEmail';
import './Login.scss';

interface iLogin {
  token: string | null;
  dispatch: React.Dispatch<AuthActions>
}

const Login: React.FC<iLogin> = ({ token, dispatch }) => {

  let navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isErrorAuth, setIsErrorAuth] = useState(false);
  const [isErrorNetwork, setIsErrorNetwork] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showLoginPass, setShowLoginPass] = useState(false);

  useEffect(() => {
    if (email.trim().length === 0 || password.trim().length === 0) {
      setIsValid(false);
    } else if (validateEmail(email) === null) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  }, [email, password]);

  useEffect(() => {
    if (token !== null || localStorage.getItem('token') !== null) {
      return navigate('/users');
    }
  }, [navigate, token])

  const logIn = () => {
    setIsPending(true);
    axios.post(POST_LOGIN, {
      email,
      password
    })
    .then(res => {
      dispatch({ type: AuthActionTypes.SET_TOKEN, payload: res.data.access_token });
      localStorage.setItem('token', res.data.access_token);
      setIsPending(false);
    })
    .catch((err: AxiosError) => {
      setIsPending(false);
      if (err.response?.status === 401) {
        setIsErrorNetwork(false);
        setIsErrorAuth(true);
      } else {
        setIsErrorAuth(false);
        setIsErrorNetwork(true);
      }
    });
  }

  return (
    <div className='login-page__wrapper'>
      <h1>Login</h1>
      {showLoginPass && (
        <div>
          <span>Email: user@mail.com</span>
          <span>Password: 12345</span>
        </div>
      )}
      <form className='login-page__form' onSubmit={(e) => {e.preventDefault()}}>
        <Input
          label='Email'
          type='email'
          onChange={setEmail}
          value={email}
          id='email'
          disabled={false}
          placeholder='E-mail'
        />
        <Input
          label='Password'
          type='password'
          onChange={setPassword}
          value={password}
          id='password'
          disabled={false}
          placeholder='Password'
        />
        {isErrorAuth && (
          <span style={{ color: 'red', display: 'block' }}>Invalid Email or password.</span>
        )}
        {isErrorNetwork && (
          <span style={{ color: 'red', display: 'block' }}>Network error occured. Please, check if json-server is started.</span>
        )}
        {isPending === false && (
          <div style={{ display: 'flex' }}>
            <ButtonPrimary 
              title='Submit'
              onClick={() => logIn()}
              disabled={isValid === false}
              style={isValid ? { backgroundColor: '#2997FF' } : { backgroundColor: '#A9A9A9' }}
            />
            <ButtonPrimary
              title={`Show me email and password!`}
              onClick={() => setShowLoginPass(!showLoginPass)}
              disabled={isPending}
              style={{ backgroundColor: '#2997FF' }}
            />
          </div>
        )}
        {isPending && (
          <div style={{ width: '50px', height: '30px'}}>
            <Loader />
          </div>
        )}
      </form>
    </div>
  )
}

export default Login;