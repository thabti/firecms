import React, { Component, PropTypes } from 'react';
export default class Textarea extends Component {
  render() {
    return (
      <textarea {...this.props}/>
    )
  }
}
