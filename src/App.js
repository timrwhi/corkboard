import React, { Component } from 'react';
import uuid from 'uuid';
import { values } from 'lodash';

var database = window.firebase.database();

function getCollection(id) {
  return database.ref(`/collections/${id}`).once('value').then(x => x.val());
}

function saveToCollection(url, id) {
  return database.ref(`collections/${id}`).push(url)
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
    flex: 1,
    display: 'flex',
    minWidth: 300,
    margin: 1
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
      getCollection(id).then(x => this.setState({
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
      this.setState({
        error: null,
        urls: [url, ...this.state.urls]
      });
      this.input.value = '';
      let id = window.location.pathname.slice(1);
      if (!id) {
        id = uuid();
        window.history.pushState(null, null, id);
      }
      saveToCollection(url, id);
    }
    image.onerror = () => this.setState({ error: 'That\'s not an image :(' })
    image.src = url;
  };

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
            <img
              src={url}
              style={{ width: '100%', alignSelf: 'center' }}
              onClick={() => window.location = url}
            />
          </div>
        ))}
        </div>
      </div>
    );
  }
}

export default App;
