import React from 'react';
import './ButtonPrimary.scss';

interface iButtonPrimary {
  title: string;
  onClick: () => void;
  style?: React.CSSProperties;
  disabled?: boolean;
  className?: string;
};

const ButtonPrimary: React.FC<iButtonPrimary> = ({ title, onClick, style, disabled, className }) => {
  return (
    <button
      className={`button-primary__button ${className}`}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      {title}
    </button>
  )
}

export default ButtonPrimary;
