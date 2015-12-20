import React, { Component, PropTypes } from 'react';
import Input from './fields/input'
import Textarea from './fields/textarea'
export default class FieldsCreator extends Component {
  render() {
    let{fields} = this.props;

    if(fields && fields.length > 0) {
      let fileds = fields.map((value, key) => {
        switch (value.type) {
          case 'text':
          return (
            <div key={key}>
              <label id={value.name}>Title</label>
              <Input type={value.type}
                className={value.class}
                name={value.name}
                id={value.name}
                placeholder={value.placeholder}   />
            </div>
          )
          case 'textarea':
          return (
            <div key={key}>
              <label htmlFor="name">Description</label>
              <Textarea className={value.class} rows={value.rows} rows={value.cols} name={value.name}/>
            </div>
          )
          case 'submit':
          return(
            <input key={key}
              className={value.class}
              type={value.type} value={value.label}/>
          )
        }
      })

      return (
        <div>{fileds}</div>
      )

    }


  }
}
