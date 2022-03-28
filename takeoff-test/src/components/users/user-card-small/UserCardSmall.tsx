import React from 'react';
import './UserCardSmall.scss';

interface iUserCardSmall {
  onClick: () => void;
  id: number;
  name: string;
  email: string;
  companyName: string;
  style?: React.CSSProperties;
  className?: string;
}

const UserCardSmall: React.FC<iUserCardSmall> = ({
  onClick,
  name,
  email,
  companyName,
  style,
  id,
  className
}) => {
  return (
    <div className={`user-card-small__wrapper ${className}`} onClick={onClick} style={style}>
      <ul>
        <li>ID: <span>{id}</span></li>
        <li>Name: <span>{name}</span></li>
        <li>Email: <span>{email}</span></li>
        <li>Company: <span>{companyName}</span></li>
      </ul>
    </div>
  )
}

export default UserCardSmall;
