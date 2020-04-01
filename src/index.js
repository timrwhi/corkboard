import ReactDOM from 'react-dom';
import React, {useState, useEffect, useReducer} from 'react';
import {Button, Card, Input, Logo, SlideInOut} from './ui';
import {
  saveCollection,
  fetchMetadata,
  fetchCollection,
  updateCollection,
} from './services';
import {hri} from 'human-readable-ids';

const initialState = {
  items: {},
  display: 'card',
};

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const {item} = action.payload;
      const id = Date.now();
      return {
        ...state,
        items: {
          ...state.items,
          [id]: item,
        },
      };
    }

    case 'received': {
      const {items, display} = action.payload;
      return {
        ...state,
        items,
        display,
      };
    }

    case 'remove': {
      const {id} = action.payload;
      delete state.items[id];
      return {
        ...state,
      };
    }

    default:
      return state;
  }
}

function receivedPayload(payload) {
  const {items = {}, display = 'list'} = payload;
  return {
    type: 'received',
    payload: {items, display},
  };
}

function addItem(metadata) {
  return {
    type: 'add',
    payload: {item: metadata},
  };
}

function removeItem(id) {
  return {
    type: 'remove',
    payload: {id},
  };
}

function isValidUrl(url) {
  if (!url) return false;
  if (!url.startsWith('http')) return false;
  return true;
}

const App = () => {
  const collectionId = window.location.pathname.substring(1);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [query, setQuery] = useState('');

  const {items} = state;
  const itemValues = Object.entries(items).map(([k, v]) => ({...v, id: k}));

  useEffect(() => {
    if (!collectionId) return;
    fetchCollection(collectionId).then(payload => {
      dispatch(receivedPayload(payload));
    });
  }, [collectionId]);

  useEffect(() => {
    if (!isValidUrl(query)) return;
    fetchMetadata(query).then(metadata => {
      dispatch(addItem(metadata));
      const id = collectionId || hri.random();
      window.history.pushState(null, null, id);
      saveCollection(id, reducer(state, addItem(metadata)));
    });
  }, [query]);

  return (
    <>
      <header style={{padding: 16}}>
        <Logo />
        <Input onSubmit={value => setQuery(value)} />
      </header>
      <div
        style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}
      >
        {itemValues.map(item => (
          <Card
            {...item}
            onDelete={() => {
              dispatch(removeItem(item.id));
              saveCollection(collectionId, reducer(state, removeItem(item.id)));
            }}
          />
        ))}
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
