import React, { Component } from 'react';
import uuid from 'uuid';
import { values } from 'lodash';

import Logo from './Logo';
import MenuButton from './MenuButton';

const PRIMARY = '#292c3c';

var database = window.firebase.database();

function getCollection(id, handle) {
  return database.ref(`/collections/${id}`).on('value', x => handle(x.val()));
}

function saveToCollection(item, id) {
  return database.ref(`collections/${id}/${item.id}`).set(item)
}

function removeFromCollection(item, collection) {
  return database.ref(`collections/${collection}/${item.id}`).remove()
}

const style = {
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
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    width: 'calc(100% - 48px)',
    maxWidth: 600,
    fontSize: 18,
    padding: '16px 24px',
    borderRadius: 3,
    borderWidth: 0,
    color: '#333',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: 'calc(100% - 32px)',
    display: 'flex',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerInnerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 1000, padding: '0 16px', width: '100%'
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

  saveItem = async (e) => {
    const url = e.target.value;
    if (!url.includes('http')) {
      return;
    }
    
    const r = await fetch(`https://peaceful-lake-56434.herokuapp.com?url=${url}`)
    const { images } = await r.json()
    console.log(images)
    // this.setState({
    //   urls: [...images.map(url => ({
    //     url,
    //     id: uuid()
    //   })), ...this.state.urls]
    // })
    this.clearInput();
    // const image = new Image();
    // image.onload = () => {
      const item = { url, id: uuid() };
    //   this.setState({ error: null });
    //   this.input.value = '';
      let id = window.location.pathname.slice(1);
      if (!id) {
        id = uuid();
        window.history.pushState(null, null, id);
      }
      saveToCollection(item, id);
    // }
    // image.onerror = () => this.setState({ error: 'That\'s not an image :(' })
    // image.src = url;
  };

  removeItem = item => {
    removeFromCollection(item, window.location.pathname.slice(1))
  }

  clearInput = () => {
    this.input.value = '';
  }

  openMenu = () => {
    this.setState({menuOpen: !this.state.menuOpen})
  }

  render() {
    console.log(this.state.urls)
    return (
      <div style={{width: '100%', display: 'flex'}}>
        {this.state.menuOpen &&
          <div
            style={{
              background: 'red',
              width: '90%',
              maxWidth: 400,
              zIndex: 9,
              position: 'fixed',
              height: '100%',
              transition: ''
            }}
          >test</div>
        }
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignSelf: this.state.urls.length ? 'flex-start' : 'center',
          background: PRIMARY
        }}>
          <div style={style.headerContainer}>
            <MenuButton size={24} handleClick={this.openMenu}/>
            {this.state.urls.length > 0 &&
              <Logo small/>
            }
          </div>
          <div style={{
            ...style.topContainer,
            marginTop: this.state.urls.length ? 48 : 0
          }}>
            {this.state.urls.length === 0 &&
              <Logo/>
            }
            <input
              placeholder={`Paste a link to ${this.state.urls.length || window.location.pathname.slice(1) ? 'add to this collection' : "start a collection"}`}
              style={style.input}
              type="url"
              onKeyUp={this.saveItem}
              ref={(input) => {this.input = input}}
            />
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
      </div>
    );
  }
}

export default App;
