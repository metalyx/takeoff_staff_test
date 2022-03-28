import React, { useState } from 'react';
import { validateEmail } from '../../../utils/validateEmail';
import './Input.scss';

interface iInput {
  label?: string;
  placeholder: string;
  name?: string;
  id: string;
  type?: string;
  disabled?: boolean;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  style?: React.CSSProperties;
  required?: boolean;
}

const Input: React.FC<iInput> = ({
  label,
  placeholder,
  name,
  id,
  type,
  disabled = false,
  value,
  onChange,
  style,
  required = false
}) => {
  const [redBorder, setRedBorder] = useState(false);

  const inputOnBlur = () => {
    if (type === 'email') {
      validateEmail(value) === null ? setRedBorder(true) : setRedBorder(false)
      console.log(validateEmail(value))
      return;
    }
    if (required && value.trim().length === 0) {
      setRedBorder(true);
      return;
    } else {
      setRedBorder(false);
      return;
    }

  }

  return (
    <div className='input__wrapper'>
      <label htmlFor={id}>{label}</label>
      <input
        required={required}
        style={style}
        placeholder={placeholder}
        name={name ?? id}
        id={id}
        type={type ?? 'text'}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={inputOnBlur}
        className={`${redBorder ? 'red-border' : ''}`}
      />
    </div>
  )
};

export default Input;
