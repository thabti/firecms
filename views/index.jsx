import React, { Component, PropTypes } from 'react';
import Layout from './layout'
import FieldsCreator from './components/fieldsCreator';
import {
  Button,
  Glyph
} from 'elemental';
export default class Index extends Component {

  render() {
    let {config, title} = this.props;

    return (
      <Layout title={this.props.title}>
            <Button type="primary" href="/api"> <Glyph icon="terminal" /> API </Button>
      </Layout>
    );
  }
}
