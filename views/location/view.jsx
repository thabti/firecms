import React, { Component, PropTypes } from 'react';
import Layout from '..//layout.jsx';
var Remarkable = require('remarkable');
import {Glyph} from 'elemental';
var md = new Remarkable({linkify: true, html: true});

export default class View extends Component {

  render() {

    let {items} = this.props;
    var listItem = items ? Object.keys(items).map((object, i) => {
      var data = items[object];
      var description = md.render(data.description)

      return (<li key={object}>
        <h2>{data.title}</h2>
        <div dangerouslySetInnerHTML={{__html: description}}></div>
        <a href={`/location/delete/${object}`} className="fire-cms__icon-link"> <Glyph icon="trashcan" /></a>
        <a href={`/location/edit/${object}`}  className="fire-cms__icon-link"> <Glyph icon="pencil" /></a>
        <hr />

      </li>);
    }) : '';

    return (
      <Layout title="view items">
        <h1>Location</h1>
        <ul>
          {listItem}
        </ul>
      </Layout>

    );
  }
}
