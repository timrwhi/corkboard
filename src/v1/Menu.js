import React from 'react'

export default class Menu extends React.Component {
  render() {
    return (
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
      >
        <div onClick={this.props.handleClose}>&times;</div>
      </div>
    )
  }
}