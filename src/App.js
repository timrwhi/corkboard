import React, { Component } from 'react';
import uuid from 'uuid';
import { values, noop } from 'lodash';

var database = window.firebase.database();

function getCollection(id, handle) {
  return database.ref(`/collections/${id}`).on('value', x => handle(x.val()));
}

function saveToCollection(url, id) {
  return database.ref(`collections/${id}/${url.id}`).set(url)
}

function removeFromCollection(item, collection) {
  return database.ref(`collections/${collection}/${item.id}`).remove()
}

const style = {
  button: {
    lineHeight: 0,
    fontSize: 14,
    fontWeight: 600,
    borderWidth: 0,
    padding: 25,
    margin: 0,
    textTransform: 'uppercase',
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
    borderLeft: '1px solid #ccc',
    height: 51,
    cursor: 'pointer'
  },
  imageContainer: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    minWidth: 300,
    margin: 1
  },
  removeImage: {
    position: 'absolute',
    top: 5,
    left: 5,
    height: 60,
    width: 60,
    borderRadius: 4,
    background: '#333',
    fontSize: '35px',
    textAlign: 'center',
    color: 'white',
    lineHeight: '55px'
  },
  images: {
    display: 'flex',
    flexFlow: 'row wrap'
  },
  topContainer: {
    padding: '0 10%',
    background: '#ddd',
    display: 'flex',
    flexDirection: 'column',
  },
  inputContainer: {
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    fontSize: 18,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25,
    borderRadius: 3,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 0,
  }
}

class App extends Component {
  state = {
    urls: []
  };

  componentDidMount() {
    const id = window.location.pathname.slice(1);
    if (id) {
      getCollection(id, x => this.setState({
        urls: values(x)
      }))
    }
    this.input.focus();
  }

  saveItem = e => {
    const url = e.target.value;
    if (!url.includes('http')) {
      return;
    }
    const image = new Image();
    image.onload = () => {
      const item = { url, id: uuid() };
      this.setState({ error: null });
      this.input.value = '';
      let id = window.location.pathname.slice(1);
      if (!id) {
        id = uuid();
        window.history.pushState(null, null, id);
      }
      saveToCollection(item, id);
    }
    image.onerror = () => this.setState({ error: 'That\'s not an image :(' })
    image.src = url;
  };

  removeItem = item => {
    removeFromCollection(item, window.location.pathname.slice(1))
  }

  render() {
    return (
      <div>
        <div style={style.topContainer}>
          <div style={style.inputContainer}>
            <input
              placeholder={`Paste a link to ${window.location.pathname.slice(1) ? 'add to this collection' : "start a collection"}`}
              style={style.input}
              type="text"
              onKeyUp={this.saveItem}
              ref={(input) => {this.input = input}}
            />
          </div>
          {this.state.error &&
          <div>{this.state.error}</div>
          }
        </div>
        <div style={style.images}>
        {this.state.urls.map((url, index) => (
          <div key={index} style={style.imageContainer}>
            <div style={style.removeImage} onClick={() => this.removeItem(url)}>&times;</div>
            <img
              src={url.url}
              style={{ width: '100%', alignSelf: 'center' }}
              onClick={() => window.location = url.url}
            />
          </div>
        ))}
        </div>
      </div>
    );
  }
}

export default App;
