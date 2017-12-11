import React from 'react';

import Image from './Image';

const pagerStyle = {
  position: 'absolute',
  top: 0,
  fontSize: 80,
  padding: '0 24px',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#333',
  cursor: 'pointer',
  textShadow: '0 0 6px #f5f5f5',
  zIndex: 1
}

const style = {
  container: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  count: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: '#8f95a9',
    zIndex: 1,
    background: '#292c3c',
    padding: '4px 8px'
  },
  goLeft: {
    ...pagerStyle,
    left: 0
  },
  goRight: {
    ...pagerStyle,
    right: 0,
  }
}

export default class Album extends React.Component {
  state = {
    index: 0
  };

  decrementIndex = () => {
    const currentIndex = this.state.index;
    const images = this.props.images || [];
    const index = currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1;
    this.setState({ index });
  }

  incrementIndex = () => {
    const index = this.state.index + 1 === this.props.images.length ? 0 : this.state.index + 1;
    this.setState({ index });
  }

  handleRemove = url => {
    this.props.handleRemoveImage(url);
    if (this.state.index > 0) {
      this.decrementIndex()
    }
  }

  render() {
    console.log(this.props.images[this.state.index])
    return (
      <div style={style.container}>
        <div style={style.goLeft} onClick={this.decrementIndex}>&lsaquo;</div>
        <div style={style.count}>{this.state.index + 1} / {this.props.images.length}</div>
        <Image editable={this.props.editable} src={this.props.images[this.state.index]} handleRemove={this.handleRemove} />
        <div style={style.goRight} onClick={this.incrementIndex}>&rsaquo;</div>
      </div>
    )
  }
}