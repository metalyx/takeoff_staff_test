import React, { useReducer } from 'react';
import {
  BrowserRouter,
  Routes,
  Route, 
  Navigate
} from 'react-router-dom';
import Logout from './components/logout/Logout';
import Login from './pages/login/Login';
import Users from './pages/users/Users';
import { AuthReducer, AuthInitialState, AuthActionTypes } from './redux/auth/AuthReducer';

const App: React.FC = () => {
  const [state, dispatch] = useReducer(AuthReducer, AuthInitialState);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          <React.Fragment>
            {/* <Logout dispatch={dispatch} /> */}
            <Login token={state.token} dispatch={dispatch} />
          </React.Fragment>
        } />
        <Route path="/users" element={
          <React.Fragment>
            <Logout dispatch={dispatch} />
            <Users token={state.token} resetToken={() => dispatch({ type: AuthActionTypes.SET_TOKEN, payload: null })} />
          </React.Fragment>
        } />
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="*" element={<Navigate to="/users" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
