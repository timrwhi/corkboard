import React, { useState } from 'react';
import initialItems from './data.json';
import Item from './components/Item';

const fetchContent = url => {
  console.log(url);
  return fetch(`https://dumpster-api.sixfstudios.now.sh?url=${url}`).then(r =>
    r.json()
  );
};

const AddItemForm = ({ handleAddItem }) => {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        const { value } = e.target.foo;
        fetchContent(value).then(handleAddItem);
        e.target.foo.value = '';
      }}
    >
      <input id="foo" />
    </form>
  );
};

const Items = ({ items }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {items.map(Item)}
  </div>
);

const App = () => {
  console.log(initialItems);
  const [items, addItem] = useState(initialItems);
  return (
    <div>
      <AddItemForm handleAddItem={item => addItem([...items, item])} />
      <Items items={items} />
    </div>
  );
};

export default App;
