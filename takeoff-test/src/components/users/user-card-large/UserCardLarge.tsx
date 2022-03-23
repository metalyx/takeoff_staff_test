import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { iUser, iUserWithoutId } from '../../../redux/users/types/users';
import { UsersActionsType, UsersActionTypes } from '../../../redux/users/UsersReducer';
import Axios from '../../../utils/Axios';
import { POST_USERS, PUT_USER } from '../../../utils/endpoints';
import ButtonPrimary from '../../buttons/button-primary/ButtonPrimary';
import Input from '../../inputs/input/Input';
import './UserCardLarge.scss';

type CardType = 'edit' | 'add';

interface iUserCardLargeEditing {
  dispatch: React.Dispatch<UsersActionTypes>;
  user: iUser;
  resetToken: () => void;
  type: 'edit';
}

interface iUserCardLargeAdding {
  dispatch: React.Dispatch<UsersActionTypes>;
  resetToken: () => void;
  type: 'add';
  user?: iUser;
}

type iUserCardLarge = iUserCardLargeEditing | iUserCardLargeAdding;

const UserCardLarge: React.FC<iUserCardLarge> = ({ dispatch, user, resetToken, type }) => {

  /* 
    If edditing user info - then initial inputs data are user's current data
    If adding new user - then initial inputs data are empty strings
  */
  function getInitialValue<T> (type: CardType, value: T): T | string {
    switch (type) {
      case 'edit':
        return value;
      case 'add':
        return '';
      default:
        throw new Error('Unexpected card type provided.')
    }
  }

  const [name, setName] = useState(getInitialValue(type, user?.name) as string);
  const [username, setUsername] = useState(getInitialValue(type, user?.username) as string);
  const [email, setEmail] = useState(getInitialValue(type, user?.email) as string);
  const [phone, setPhone] = useState(getInitialValue(type, user?.phone) as string);
  const [website, setWebsite] = useState(getInitialValue(type, user?.website) as string);
  const [city, setCity] = useState(getInitialValue(type, user?.address.city) as string);
  const [street, setStreet] = useState(getInitialValue(type, user?.address.street) as string);
  const [zipcode, setZipcode] = useState(getInitialValue(type, user?.address.zipcode) as string);
  const [suite, setSuite] = useState(getInitialValue(type, user?.address.suite) as string);
  const [geoLat, setGeoLat] = useState(getInitialValue(type, user?.address.geo.lat) as string);
  const [geoLng, setGeoLng] = useState(getInitialValue(type, user?.address.geo.lng) as string);
  const [companyName, setCompanyName] = useState(getInitialValue(type, user?.company.name) as string);
  const [companyBs, setCompanyBs] = useState(getInitialValue(type, user?.company.bs) as string);
  const [companyCatchPhrase, setCompanyCatchPhrase] = useState(getInitialValue(type, user?.company.catchPhrase) as string);
  
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Removing token from both state and a local storage
  const logout = () => {
    localStorage.removeItem('token');
    resetToken();
    return <Navigate to='/login' replace />
  }

  // Here we update inputs data if we switching between several cards
  useEffect(() => {
    setName(getInitialValue(type, user?.name) as string);
    setUsername(getInitialValue(type, user?.username) as string);
    setEmail(getInitialValue(type, user?.email) as string);
    setPhone(getInitialValue(type, user?.phone) as string);
    setWebsite(getInitialValue(type, user?.website) as string);
    setCity(getInitialValue(type, user?.address.city) as string);
    setStreet(getInitialValue(type, user?.address.street) as string);
    setZipcode(getInitialValue(type, user?.address.zipcode) as string);
    setSuite(getInitialValue(type, user?.address.suite) as string);
    setGeoLat(getInitialValue(type, user?.address.geo.lat) as string);
    setGeoLng(getInitialValue(type, user?.address.geo.lng) as string);
    setCompanyName(getInitialValue(type, user?.company.name) as string);
    setCompanyBs(getInitialValue(type, user?.company.bs) as string);
    setCompanyCatchPhrase(getInitialValue(type, user?.company.catchPhrase) as string);
  }, [type, user]);

  const saveChanges = () => {

    if (email.trim().length === 0) {
      return;
    }
    setIsPending(true);
    const formData: iUser | iUserWithoutId = {
      name,
      username,
      email,
      phone,
      website,
      address: {
        city,
        street,
        suite,
        geo: {
          lat: geoLat,
          lng: geoLng,
        },
        zipcode,
      },
      company: {
        bs: companyBs,
        catchPhrase: companyCatchPhrase,
        name: companyName,
      },
      id: user?.id,
    }

    if (type === 'edit') {
      dispatch({ type: UsersActionsType.EDIT_USER, payload: formData as iUser });
      Axios.put(PUT_USER(user.id), formData)
      .then(res => {
        setIsNetworkError(false);
        setIsPending(false);
        alert('User was successfully edited!');
        dispatch({ type: UsersActionsType.SELECT_USER, payload: null });
      })
      .catch((err: AxiosError) => {
        console.error(err);
        setIsPending(false);
        /* Token is expired or not logged in */
        if (err.response?.status === 401) {
          logout();
        } else {
          setIsNetworkError(true);
        }
      })
      return;
    }

    if (type === 'add') {
      Axios.post(POST_USERS, formData)
      .then(res => {
        dispatch({ type: UsersActionsType.ADD_USER, payload: res.data });
        setIsPending(false);
        alert('New user was successfully added!');
        dispatch({ type: UsersActionsType.SELECT_USER, payload: null });
      })
      .catch((err: AxiosError) => {
        setIsPending(false);
        console.error(err);
        /* Token is expired or not logged in */
        if (err.response?.status === 401) {
          logout();
        } else {
          setIsNetworkError(true);
        }
      })
      return;
    }
  }

  return (
    <div className='user-card-large__wrapper'>
      {type === 'add' && (
        <h1>Add user</h1>
      )}
      {type === 'edit' && (
        <h1>Edit user</h1>
      )}
      <form className='user-card-large__form' onSubmit={(e) => {e.preventDefault()}}>
        {type === 'edit' && (
          <Input
            label='ID'
            id='id'
            placeholder=''
            value={user.id.toString()}
            onChange={() => {}}
            disabled={true}
          />
        )}
        <Input
          label='Name'
          id='name'
          placeholder=''
          value={name}
          onChange={setName}
        />
        <Input
          label='Username'
          id='username'
          placeholder=''
          value={username}
          onChange={setUsername}
        />
        <Input
          label='Email'
          id='email'
          type='email'
          placeholder=''
          value={email}
          onChange={setEmail}
          required
        />
        <Input
          label='Phone'
          id='phone'
          placeholder=''
          value={phone}
          onChange={setPhone}
        />
        <Input
          label='Website'
          id='website'
          placeholder=''
          value={website}
          onChange={setWebsite}
        />
        <Input
          label='City'
          id='city'
          placeholder=''
          value={city}
          onChange={setCity}
        />
        <Input
          label='Street'
          id='street'
          placeholder=''
          value={street}
          onChange={setStreet}
        />
        <Input
          label='Suite'
          id='suite'
          placeholder=''
          value={suite}
          onChange={setSuite}
        />
        <Input
          label='Zip code'
          id='zipcode'
          placeholder=''
          value={zipcode}
          onChange={setZipcode}
        />
        <Input
          label='Geo latitude'
          id='geoLat'
          placeholder=''
          value={geoLat}
          onChange={setGeoLat}
        />
        <Input
          label='Geo longtitude'
          id='geoLng'
          placeholder=''
          value={geoLng}
          onChange={setGeoLng}
        />
        <Input
          label='Company name'
          id='companyName'
          placeholder=''
          value={companyName}
          onChange={setCompanyName}
        />
        <Input
          label='Company BS'
          id='companyBs'
          placeholder=''
          value={companyBs}
          onChange={setCompanyBs}
        />
        <Input
          label='Company Catch Phrase'
          id='companyCatchPhrase'
          placeholder=''
          value={companyCatchPhrase}
          onChange={setCompanyCatchPhrase}
        />
        {isNetworkError && (
          <span style={{ color: 'red' }}>Network error is occured, check if json-server is up</span>
        )}
        <ButtonPrimary
          title='Save changes'
          onClick={() => saveChanges()}
          style={{ color: 'black', background: 'lavender' }}
          disabled={isPending}
        />
      </form>
    </div>
  )
}

export default UserCardLarge;
