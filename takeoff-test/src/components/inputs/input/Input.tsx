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

const Input: React.FC<iInput> = ({ label, placeholder, name, id, type, disabled = false, value, onChange, style, required = false }) => {
  const [redBorder, setRedBorder] = useState(false);

  return (
    <div className='input__wrapper'>
      <label htmlFor={id}>{label}</label>
      <input
        required={required}
        style={redBorder ? {...style, borderColor: '#D91313', borderWidth: '3px'} : {...style}}
        placeholder={placeholder}
        name={name ?? id}
        id={id}
        type={type ?? 'text'}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => {
          if (required && value.trim().length === 0) {
            setRedBorder(true);
          } else {
            setRedBorder(false);
          }
          if (type === 'email') {
            validateEmail(value) === null ? setRedBorder(true) : setRedBorder(false)
          }
        }}
      />
    </div>

  )
};

export default Input;
