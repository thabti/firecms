import React, { Component, PropTypes } from 'react';
import Layout from './layout'
import FieldsCreator from './components/fieldsCreator';
import { Button, Alert, Form, FormField, FormInput, Checkbox, Col, DemoBox, Row} from 'elemental';
export default class Index extends Component {

  render() {
    let {config, title} = this.props;

    return (
      <Layout title={this.props.title}>
        <div className="fire-cms__main fire-cms__main--left">
            <Form method="post" action="/save" id="form1">
              <FormField label="Title" htmlFor="title">
                <FormInput autofocus={true} type="text" placeholder="Enter title" name="title" />
              </FormField>

              <FormField label="Description" htmlFor="description">
                  <FormInput placeholder="Textarea" multiline name="description" />
            	</FormField>

          	<Button type="primary"  submit={true} form="form1" >Submit</Button>
          </Form>
        </div>
      </Layout>
    );
  }
}
