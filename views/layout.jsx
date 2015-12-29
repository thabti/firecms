import React, { Component, PropTypes } from 'react';
import Helpers from './helpers.js';
import Header from './header.jsx';
export default class Layout extends Component {
  render() {
    return (
      <html>
        <head>
          <title>{this.props.title}</title>
          <link href="/assets/main.css" rel="stylesheet"/>
        </head>

        <body className="fire-cms">
          <Header />
          {this.props.children}
          <script src="/assets/main.js"></script>
        </body>


      </html>
    );
  }
}
