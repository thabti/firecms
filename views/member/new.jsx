import React, { Component, PropTypes } from 'react';
import Layout from '..//layout'
import {
  Button,
  Alert,
  Form,
  FormField,
  FormInput,
  Checkbox,
  Col,
  DemoBox,
  Row,
  FormSelect
} from 'elemental';
export default class Index extends Component {

  render() {
    let {config, title, data, id, edit} = this.props;

    var action = edit ? `/member/edit/${id}` : '/member/save';
    var editDescription = edit ? data.description : '';
    var editTitle = edit ? data.title : '';

    return (
      <Layout title={this.props.title}>
        <Form method="post" action={action} id="form1">
          <FormField label="Title" htmlFor="title">
            <FormInput autofocus={true} type="text" placeholder="Enter title" name="title" defaultValue={editTitle} />
          </FormField>

          <FormField label="Description" htmlFor="description">
            <FormInput placeholder="Textarea" multiline name="description" defaultValue={editDescription} />
          </FormField>
          <FormSelect name="locations" options={[{"label": "mum", "value": "hello"}]} firstOption="Select" onChange={()=> return false;}/>
          <Button type="primary"  submit={true} form="form1" >Submit</Button>
        </Form>
      </Layout>
    );
  }
}
