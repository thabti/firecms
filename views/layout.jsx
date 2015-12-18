import React, { Component, PropTypes } from 'react';
import Helpers from './helpers.js';
export default class Layout extends Component {
  render() {
    return (
      <html>
        <head>
          <title>{this.props.title}</title>
          <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet"></link>
        </head>

        <body>
          {this.props.children}
          <script src="/static/bundle.js"></script>
        </body>


      </html>
    );
  }
}
