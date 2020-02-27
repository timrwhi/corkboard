import React from 'react';

const style = {
  imageContainer: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    minWidth: 330,
    minHeight: 247,
    width: '100%',
    margin: 1
  },
  removeImage: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    top: 5,
    left: 5,
    height: 50,
    width: 50,
    cursor: 'pointer',
    borderRadius: 4,
    background: '#333',
    fontSize: '35px',
    color: 'white',
    zIndex: 3,
  },
}

export default class Image extends React.Component {
  render() {
    return (
      <div style={style.imageContainer}>
        {this.props.editable &&
          <div style={style.removeImage} onClick={() => this.props.handleRemove(this.props.src)}>&times;</div>
        }
        <img
          alt=''
          src={this.props.src}
          style={{
            width: '100%',
            height: '100%'
          }}
          onClick={() => window.location = this.props.src}
        />
      </div>
    )
  }
}