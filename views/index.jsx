import React, { Component, PropTypes } from 'react';
import Layout from './layout'
export default class Index extends Component {

  render() {
    return (
      <Layout title={this.props.title}>
        <div>Hello sabeur thabti</div>

        <form method="POST" action="/save">
          <div className="form-group">
            <label htmlFor="name">Title</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="title"
              placeholder="Enter title" />
            <label htmlFor="name">Description</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="description"
              placeholder="Enter Description" />
          </div>
          <input
            className="btn btn-default"
            type="submit" />
        </form>

        <div>
          <p>saved Data</p>
          {this.props.dataSaved}

        </div>
      </Layout>
    );
  }
}
