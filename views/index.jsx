import React, { Component, PropTypes } from 'react';
import Layout from './layout'
import FieldsCreator from './components/fieldsCreator';
export default class Index extends Component {

  render() {
    let{config, title} = this.props;

    return (
      <Layout title={this.props.title}>
        <form method="post" action="/save">
              <FieldsCreator fields={config.fields}/>
        </form>
        <div>
        </div>
      </Layout>
    );
  }
}
