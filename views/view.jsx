import React, { Component, PropTypes } from 'react';
import Helpers from './helpers.js';
var Remarkable = require('remarkable');
var md = new Remarkable({linkify: true, html: true});

export default class View extends Component {

  render() {

    let {items} = this.props;
    var listItem = items ? Object.keys(items).map((object, i) => {
      var data = items[object];
      var  description = md.render(data.description)

      return <li key={object}>
        <p>{data.title}</p>
        <div dangerouslySetInnerHTML={{__html: description}}></div>
      </li>;
    }) : '';

    return (
      <ul>
        {listItem}
      </ul>
    );
  }
}
