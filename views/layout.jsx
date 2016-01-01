import React, { Component, PropTypes } from 'react';
import Helpers from './helpers.js';
import Header from './header.jsx';
import Footer from './footer.jsx';
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
          <div className="fire-cms__main fire-cms__main--left">
            {this.props.children}
          </div>
          <script src="/assets/main.js"></script>
            <Footer />
        </body>
      </html>
    );
  }
}
