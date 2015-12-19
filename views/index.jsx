import React, { Component, PropTypes } from 'react';
import Layout from './layout'
export default class Index extends Component {

  render() {
    return (
      <Layout title={this.props.title}>
        <div>Hello sabeur thabti</div>

        <form method="post" action="/save">
          <div className="form-group">
            <label htmlFor="name">Title</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="title"
              placeholder="Enter title" />
            <label htmlFor="name">Description</label>

            <textarea    className="form-control" rows="4" cols="50"   name="description">
            </textarea>

          </div>
          <input
            className="btn btn-default"
            type="submit" />
        </form>

        <div>
        </div>
      </Layout>
    );
  }
}
