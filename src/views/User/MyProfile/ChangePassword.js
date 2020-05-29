import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Row, Col, Form, Input, FormFeedback } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
//import { FormErrors } from '../../Formerrors/Formerrors';
import Loader from '../../Loader/Loader';

import "./ChangePassword.css";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
        formField: { oldPassword: '', newPassword: '', confirmPassword:'' },
        formErrors: { oldPassword: '', newPassword: '', confirmPassword:'', error: ''},
        formValid: false,
        errors: {},
        loading: false
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);

  }

  /* Submit Form Handler */
  submitHandler (event) {
    event.preventDefault();
    event.target.className += " was-validated";
    if (this.validateForm()) {
      this.setState( { loading: true}, () => {
        const formInputField = this.state.formField;
        const formData = {
          "oldPassword": formInputField.oldPassword,
          "newPassword": formInputField.newPassword, 
        };
        commonService.postAPIWithAccessToken('auth/change-password', formData)
          .then( res => {
            if ( undefined === res.data.data || !res.data.status ) {
              this.setState( { loading: false} );
              if(res.data.message === 'Old password is incorrect!'){
                const formErrors = this.state.formErrors;
                formErrors["oldPassword"] = res.data.message;
                this.setState({ formErrors: formErrors });
              }
              toast.error(res.data.message);
              return;
            }
            localStorage.clear();
            this.props.history.push('/login');
            toast.success(res.data.message);
            
          } )
          .catch( err => {         
            if(err.response !== undefined && err.response.status === 401) {
              localStorage.clear();
              this.props.history.push('/login');
            }else{
              this.setState( { loading: false } );
              toast.error(err.message);
            }
          } )
      } );
    }else{ console.log('Outside validation'); }
  };

  /* Input Field On changes*/
  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    const formField = this.state.formField
    formField[name] = value;
    this.setState({ formField: formField },
                  () => { this.validateField(name, value) });
  };

  /* Validate Form Field */
  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    fieldValidationErrors.error = '';
 
    switch(fieldName) {         
      case 'oldPassword':        
        fieldValidationErrors.oldPassword = (value !== '') ? '' : ' This field is required';
        break;
      case 'newPassword':
        fieldValidationErrors.newPassword = (value !== '') ? '' : ' This field is required';
        if (!value.match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
          fieldValidationErrors.newPassword = "*Please enter secure and strong password.";
        }
        break;               
      case 'confirmPassword':        
        fieldValidationErrors.confirmPassword = (value !== '') ? '' : ' This field is required';
        if (value !== this.state.formField.newPassword) {
          fieldValidationErrors.confirmPassword = "*Passwords and confirm-password do not match.";
        }
        break;               
      default:
        break;
    }
    this.setState({formErrors: fieldValidationErrors,       
    }, this.validateFeildError);
  }

  /* Validate Feilds Error */
  validateFeildError() {
    const formErrors = this.state.formErrors;
    const formField = this.state.formField;
    this.setState({formValid: 
    ( formErrors.oldPassword === "" && formErrors.newPassword === "" && formErrors.confirmPassword === "" && formField.oldPassword !== ""  && formField.newPassword !== "" && formField.confirmPassword !== ""  ) 
    ? true : false});
    return true;
  }

  /* Validate Form */
  validateForm() {
    const formErrors = this.state.formErrors;
    let formValid = true;
    const formField = this.state.formField;
    if (!formField.oldPassword) {
      formValid = false;
      formErrors["oldPassword"] = "*Please enter your old password.";
    }
    if (!formField.newPassword) {
      formValid = false;
      formErrors["newPassword"] = "*Please enter your password.";
    }
    if (!formField.confirmPassword) {
      formValid = false;
      formErrors["confirmPassword"] = "*Please re-enter your password.";
    }
    if (formField.confirmPassword !== formField.newPassword) {
      formValid = false;
      formErrors["confirmPassword"] = "*Passwords and confirm-password do not match.";
    }
    this.setState({
      loading: false,
      formErrors: formErrors
    });
    console.log(formErrors);
    return formValid;
  }
 /* Set Error Class*/
  errorClass(error) {
    return(error.length === 0 ? '' : 'has-error');
  }

    

  render() {
    const { loading, formErrors } = this.state;
    let loaderElement = '';
    if(loading)
      loaderElement = <Loader />

    return (
      <div className="dashboard-section">
        <ToastContainer />
        {loaderElement}
        
        <Card className="vd-card">
            <CardHeader>
              <div className="d-flex align-items-center">
                  <div className="mr-auto">
                  <h4 className="card-title"> Change Password</h4>
                  </div>
              </div>
            </CardHeader>
            <CardBody>
        
            {/* <FormErrors formErrors={this.state.formErrors} /> */}
            <Form className="profile-form" onSubmit={this.submitHandler} noValidate>
              <Row>
                <Col md="6">
                  <div className="form-group">
                      <label htmlFor="oldPassword">Old Password</label>
                      <Input type="password" name="oldPassword" id="oldPassword" placeholder="Old Password" value={this.state.formField.oldPassword} onChange={this.changeHandler} invalid={formErrors['oldPassword'] !== undefined && formErrors['oldPassword'] !== ""} required />
                      <FormFeedback>{formErrors['oldPassword']}</FormFeedback>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <div className="form-group">
                      <label htmlFor="newPassword">New Password</label>
                      <Input type="password" name="newPassword" id="newPassword" placeholder="New Password" value={this.state.formField.newPassword} onChange={this.changeHandler} invalid={formErrors['newPassword'] !== undefined && formErrors['newPassword'] !== ""} required />
                      <FormFeedback>{formErrors['newPassword']}</FormFeedback>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <Input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" value={this.state.formField.confirmPassword} onChange={this.changeHandler} invalid={formErrors['confirmPassword'] !== undefined && formErrors['confirmPassword'] !== ""} required />
                    <FormFeedback>{formErrors['confirmPassword']}</FormFeedback>
                  </div>
                </Col>                
              </Row>
              <Row>  
                <Col md="3">
                  <div className="form-group">
                      <button type="submit"  disabled={!this.state.formValid} className="Submit-form-button btn btn-primary">Change Password</button>
                  </div>
                </Col>
            </Row>
            </Form>
          </CardBody>
        </Card>
      
      </div>
    );
  }
}

export default ChangePassword;
