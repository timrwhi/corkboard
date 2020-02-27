import React from 'react';

const style = {
  fontSize: '1.3em',
  padding: '16px 0 16px 24px',
  width: '100%',
  border: '1px solid',
  borderRadius: 4,
  maxWidth: 600,
};

const Input = ({ onChange }) => (
  <input placeholder="Paste a link..." style={style} onChange={onChange} />
);

export default Input;
