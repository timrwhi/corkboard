import React from 'react';
import './Item.css';

const Item = item => (
  <div className="Item" key={JSON.stringify(item)}>
    <div
      className="Item-image"
      style={{
        backgroundImage: `url(${item.og.image || item.images[0]})`,
      }}
    />
    {item.snippet}
  </div>
);

export default Item;
