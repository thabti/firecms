import React, { Component, PropTypes } from 'react';
import Helpers from './helpers.js';
export default class View extends Component {
  render() {
    let {items} = this.props;
  var listItem =  Object.keys(items).map((object, i) => {
              var data = items[object];
              return <li key={object}>
                  <span>title</span> <p>{data.title}</p>
                    <span>description</span> <div dangerouslySetInnerHTML={{__html: data.description}}></div>
              </li>;
              });

    return (
      <ul>
        {listItem}
      </ul>
    );
  }
}
