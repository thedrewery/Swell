/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { Component } from 'react';
import Header from './Header.jsx';
import ContentReqRowComposer from "./ContentReqRowComposer.jsx"

class HeaderEntryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
    }
    this.onChangeUpdateHeader = this.onChangeUpdateHeader.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
  } 

  componentDidUpdate() {
    if (this.props.newRequestHeaders.headersArr.length === 0) {
      const headersDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestHeaders.headersArr));
      this.addHeader(headersDeepCopy);
    }
    this.checkContentTypeHeaderUpdate();

  }

  checkContentTypeHeaderUpdate() {
    let contentType;

    if (this.props.newRequestBody.bodyType === 'GRPC' || this.props.newRequestBody.bodyType === 'none' || this.props.newRequestBody.bodyType === 'raw') {
      contentType = ''
    }

    else if (this.props.newRequestBody.bodyType === 'x-www-form-urlencoded') {
      contentType = 'x-www-form-urlencoded';
    }
    else if (this.props.newRequestBody.bodyType === 'GQL' || this.props.newRequestBody.bodyType === 'GQLvariables') {
      contentType = 'application/json'
    }
    else {
      contentType = this.props.newRequestBody.rawType;
    }

    // Attempt to update header in these conditions:
    const foundHeader = this.props.newRequestHeaders.headersArr.find(header => /content-type$/i.test(header.key.toLowerCase()));

    // 1. if there is no contentTypeHeader, but there should be
    if (!foundHeader && contentType !== '') {
      this.addContentTypeHeader(contentType);
      // this.updateContentTypeHeader(contentType, foundHeader);
    }
    // 2. if there is a contentTypeHeader, but there SHOULDNT be, but the user inputs anyway... just let them
    else if (foundHeader && contentType === '') {
      //keeping this else if lets the user do what they want, it's fine, updateContentTypeHeader and removeContentTypeHeader will fix it later
    }
    // 3. if there is a contentTypeHeader, needs to update
    else if (foundHeader && foundHeader.value !== contentType) {
      this.updateContentTypeHeader(contentType, foundHeader);
    }
  }

  addContentTypeHeader(contentType) {
    const headersDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestHeaders.headersArr.filter(header => header.key.toLowerCase() !== 'content-type')));

    const contentTypeHeader = ({
      id: this.props.newRequestHeaders.headersArr.length,
      active: true,
      key: 'Content-Type',
      value: contentType,
    });
    headersDeepCopy.push(contentTypeHeader)
    this.props.setNewRequestHeaders({
      headersArr: headersDeepCopy,
      count: headersDeepCopy.length,
    });
  }

  updateContentTypeHeader(contentType) {
    const filtered = this.props.newRequestHeaders.headersArr.filter(header => header.key.toLowerCase() !== 'content-type');
    this.props.newRequestHeaders.headersArr.push({
      id: this.props.newRequestHeaders.headersArr.length,
      active: true,
      key: 'Content-Type',
      value: contentType,
    });

    this.props.setNewRequestHeaders({
      headersArr: filtered,
      count: filtered.length,
    });
  }

  addHeader() {
    const headersDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestHeaders.headersArr));
    headersDeepCopy.push({
      id: this.props.newRequestHeaders.headersArr.length,
      active: false,
      key: '',
      value: '',
    });

    this.props.setNewRequestHeaders({
      headersArr: headersDeepCopy,
      override: false,
      count: headersDeepCopy.length,
    });
  }

  onChangeUpdateHeader(id, field, value) {

    const headersDeepCopy = JSON.parse(JSON.stringify(this.props.newRequestHeaders.headersArr));
    // find header to update
    let indexToBeUpdated;
    for (let i = 0; i < headersDeepCopy.length; i += 1) {
      if (headersDeepCopy[i].id === id) {
        indexToBeUpdated = i;
      }
    }
    // update
    headersDeepCopy[indexToBeUpdated][field] = value;

    // also switch checkbox if they are typing
    if (field === 'key' || field === 'value') {
      headersDeepCopy[indexToBeUpdated].active = true;
    }


    this.props.setNewRequestHeaders({
      headersArr: headersDeepCopy,
      count: headersDeepCopy.length,
    });

  }

  toggleShow() {
    this.setState({
      show: !this.state.show
    });
  }

  render() {
    let headerName = 'Headers';
    let addHeaderName = '+ Header'
    // let headerClass = 'composer_submit http'
    if (this.props.newRequestFields.gRPC) {
      headerName = 'Metadata';
      addHeaderName = '+ Metadata';
    }
    

    const headersArr = this.props.newRequestHeaders.headersArr.map((header, index) => (
      <ContentReqRowComposer
        data={header}
        changeHandler={this.onChangeUpdateHeader}
        key={index} //key
      />
    ));

    return (
      <div >
        <div className=' is-flex is-justify-content-space-between is-align-content-center'>
          {headerName}
          <button 
            className="button is-small add-header-or-cookie-button"
            onClick={() => this.addHeader()}> 
            {addHeaderName} 
          </button>
        </div>
        <div>
          {headersArr}
        </div>
      </div>
    );
  }
}

export default HeaderEntryForm;
