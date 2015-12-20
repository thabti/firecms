import React, { Component, PropTypes } from 'react';
import Helpers from './helpers.js';
export default class Layout extends Component {
  render() {
    return (
      <html>
        <head>
          <title>{this.props.title}</title>
        </head>

        <body>
          {this.props.children}
          <script src="/assets/app-babel.js"></script>
        </body>


      </html>
    );
  }
}
