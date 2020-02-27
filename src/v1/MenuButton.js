import React from 'react';

export default (props) => (
  <div style={{height: props.size, width: props.size}} onClick={props.handleClick}>
    <svg fill='#C8A2C8' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
        <rect x='5' y='5' width='90' height='20' />
        <rect x='5' y='40' width='90' height='20' />
        <rect x='5' y='75' width='90' height='20' />
    </svg>
  </div>
)