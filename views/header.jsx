import React, { Component, PropTypes } from 'react';
import {Glyph} from 'elemental';

export default class Header extends Component {
  render() {
    return (
      <div className="fire-cms__header">
        <h1 className="fire-cms__logo"><Glyph icon="database" className="fire-cms__logo--icon" /> FIRECMS</h1>

        <ul className="fire-cms__nav">

          <li className="fire-cms__nav--item"><Glyph icon="home" /> <a href="/" className="">Home</a></li>
          <li className="fire-cms__nav--item"><Glyph icon="pencil"/> <a href="/new" className="">New</a></li>
          <li className="fire-cms__nav--item"><Glyph icon="list-unordered"/> <a href="/view" className="">posts</a></li>
          <li className="fire-cms__nav--item"><Glyph icon="person"/> <a href="/account" className="">Account</a></li>
        </ul>
      </div>
    );
  }
}
