import React from 'react';

const style = {
  fontSize: '1.3em',
  padding: '13px 0 13px 24px',
  width: `calc(100% - 26px)`,
  border: '1px solid',
  borderRadius: 4,
  maxWidth: 600,
};

const Input = ({onSubmit}) => (
  <form style={{width: 400}} onSubmit={e => {
    e.preventDefault();
    onSubmit(e.target.elements[0].value)
  }}>
    <input placeholder='Paste a link...' style={style} />
  </form>
);

export default Input;
