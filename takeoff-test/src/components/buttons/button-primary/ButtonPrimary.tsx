import React from 'react';
import './ButtonPrimary.scss';

interface iButtonPrimary {
  title: string;
  onClick: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
};

const ButtonPrimary: React.FC<iButtonPrimary> = ({ title, onClick, style, disabled }) => {
  return (
    <button
      className='button-primary__button'
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      {title}
    </button>
  )
}

export default ButtonPrimary;
