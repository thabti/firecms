import React, { Component, PropTypes } from 'react';
export default class Input extends Component {
  render() {
    return (
      <input {...this.props}/>
    )
  }
}
