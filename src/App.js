import React, { Component } from 'react';
import uuid from 'uuid';
import { map } from 'lodash';

import Album from './Album';
import Image from './Image';
import Logo from './Logo';
import Menu from './Menu';
// import MenuButton from './MenuButton';

const PRIMARY = '#292c3c';

var database = window.firebase.database();

function getCollection(id, handle) {
  return database.ref(`collections/${id}`).on('value', x => handle(x.val()));
}

function saveToCollection(item, id) {
  return database.ref(`collections/${id}/items/${item.id}`).set(item)
}

function removeFromCollection(item, collection) {
  return database.ref(`collections/${collection}/items/${item.id}`).remove()
}

const style = {
  images: {
    display: 'flex',
    flexFlow: 'row wrap',
    // maxWidth: 1000,
  },
  topContainer: {
    padding: 16,
    width: 'calc(100% - 32px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    maxWidth: 800,
    fontSize: 18,
    padding: '16px 24px',
    backgroundColor: '#f5f5f5',
    borderRadius: 3,
    borderWidth: 0,
    color: '#333',
    zIndex: 3
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: 'calc(100% - 32px)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    height: window.innerWidth < 800 ? 'auto' : 53,
  },
  headerInnerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 1000, padding: '0 16px', width: '100%'
  },
}

class App extends Component {
  state = {
    items: {},
    collectionId: window.location.pathname.slice(1)
  };

  componentDidMount() {
    const id = this.state.collectionId || uuid();
    this.setState({ collectionId: id })
    getCollection(id, (collection = {}) => {
      this.setState({
        items: { ...(collection || {}).items },
        canEdit: true
        // canEdit: !this.state.collectionId || window.localStorage.getItem(collection.creatorToken)
      })
    })
    this.input && this.input.focus();
  }

  saveItem = async (e) => {
    const url = e.target.value;
    if (!url.includes('http')) {
      return;
    }
    
    const r = await fetch(`https://peaceful-lake-56434.herokuapp.com?url=${url}`)
    const data = await r.json()
    this.clearInput();
    const item = { ...data, url, id: uuid() };
    const creatorToken = uuid();
    window.history.pushState(null, null, this.state.collectionId);
    window.localStorage.setItem(creatorToken, true);
    saveToCollection(item, this.state.collectionId);
  };

  removeItem = item => {
    removeFromCollection(item, this.state.collectionId)
  }

  removeImageFromItem = (url, item) => {
    if (item.images.length === 1) {
      return removeFromCollection(item, this.state.collectionId);
    }
    const images = new Set(item.images);
    images.delete(url);
    const updatedItem = {
      ...item,
      images: [...images]
    }
    saveToCollection(updatedItem, this.state.collectionId);
  }

  clearInput = () => {
    this.input.value = '';
  }

  openMenu = () => {
    this.setState({menuOpen: !this.state.menuOpen})
  }

  render() {
    const collectionHasItems = Object.keys(this.state.items).length > 0;
    return (
      <div style={{width: '100%', display: 'flex'}}>
        {this.state.menuOpen &&
          <Menu handleClose={() => this.setState({menuOpen: false})}/>
        }
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          alignSelf: collectionHasItems ? 'flex-start' : 'center',
          background: PRIMARY
        }}>
          <div style={style.headerContainer}>
            {/* <MenuButton size={24} handleClick={this.openMenu}/> */}
            {collectionHasItems &&
              <Logo small/>
            }
          </div>
          {this.state.canEdit &&
            <div style={{
              ...style.topContainer,
              marginTop: collectionHasItems && window.innerWidth < 800 ? 40 : 0,
              alignItems: collectionHasItems ? 'flex-end' : 'center',
              // marginLeft: (window.innerWidth < 800 && '0px') || (collectionHasItems ? '20%' : 0),
              // marginRight: (window.innerWidth < 800 && '0px') || (collectionHasItems ? '20%' : 0),
            }}>
              {!collectionHasItems &&
                <Logo/>
              }
                <input
                  placeholder={`Paste a link to ${collectionHasItems || this.state.collectionId ? 'add to this collection' : "start a collection"}`}
                  style={{
                    ...style.input,
                    width: window.innerWidth > 800 ? '70%' : 'calc(100% - 48px)'
                  }}
                  type="url"
                  autoFocus
                  onKeyUp={this.saveItem}
                  ref={(input) => {this.input = input}}
                />
            </div>
          }
          <div style={{
            ...style.images,
            marginTop: this.state.canEdit ? 0 : window.innerWidth < 800 ? 56 : 85
          }}>
            {map(this.state.items, (item, id) => {
              if (item.images && item.images.length > 1) {
                return <Album key={id} editable={this.state.canEdit} images={item.images} handleRemoveImage={url => this.removeImageFromItem(url, item)}/>
              }
              return <Image key={id} editable={this.state.canEdit} handleRemove={url => this.removeImageFromItem(url, item)} src={item.images && item.images[0]} />
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
