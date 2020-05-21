import React, { Component } from "react";
import { Col, Row, Button, Form, FormGroup, FormText, FormFeedback, Label, Input } from 'reactstrap';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commenService from '../../../core/services/commonService';
import Loader from '../../../views/Loader/Loader';

import "./loginPage.css";

class ResetPassword extends Component {
  constructor( props ){
    super( props );

    this.state = {
      newPassword: '',
      confirmPassword: '',
      token: '',
      loading: false,
      errors: {}
    };
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    localStorage.clear();
    this.setState( { token: params.token})

    window.scrollTo(0, 0);
  }

  
  submitHandler = event => {
    event.preventDefault();
    event.target.className += " was-validated";
    if (this.validateForm()) {
      const loginData = {      
        newPassword: this.state.newPassword,
        token: this.state.token
      };
      if(this.state.newPassword === '' && this.state.confirmPassword === '' ) {
          toast.error("Please enter your password and confirm password!");
          return;
      }
      if(this.state.newPassword !== this.state.confirmPassword) {
          toast.error("Password and confirm password does not match!");
          return;
      }
      this.setState( { loading: true }, () => {
        commenService.postAPI( `auth/setup-new-password`, loginData )
          .then( res => {
            if ( undefined === res.data || !res.data.status ) {
              this.setState( { loading: false } );
              toast.error(res.data.message);
              return;
            }
            this.setState( {
              loading: false
            } )
            this.props.history.push('/login');
            toast.success(res.data.message);
          } )
          .catch( err => {          
            toast.error(err.message);
            this.setState( { loading: false} );
          } )
      } )
    }
  };

  validateForm() {
    let errors = {};
    let formIsValid = true;
    if (!this.state.newPassword) {
        formIsValid = false;
        errors["newPassword"] = "*Please enter your new password.";
    }
    if (typeof this.state.newPassword !== "undefined") {
        if (!this.state.newPassword.match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/)) {
            formIsValid = false;
            errors["newPassword"] = "*Please enter secure and strong password.";
        }
    }
    if (!this.state.confirmPassword) {
      formIsValid = false;
      errors["confirmPassword"] = "*Please re-enter your password.";
    }
    if (this.state.confirmPassword !== this.state.newPassword) {
      formIsValid = false;
      errors["confirmPassword"] = "*Passwords and confirm-password do not match.";
    }
    this.setState({
      loading: false,
      errors: errors
    });
    return formIsValid;
  }

  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  
    render() {
      const { newPassword, confirmPassword, loading, errors } = this.state;
      let loaderElement = '';
      if(loading)
        loaderElement = <Loader />
      return (
        <>

        <div className="">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-7 col-lg-7 bg-image">

              </div>
              <div className="col-md-5 col-lg-5 col-sm-12 mx-auto">
                <ToastContainer /> 
                <div className="account-form">
                  <h3 className="login-heading mb-4">Setup your password</h3>
                  {loaderElement} 
                  <Form onSubmit={this.submitHandler} noValidate>
                    <Row form>
                      <Col md={12}>
                        <FormGroup>
                          <Label for="newPassword">New password *</Label>
                          <Input type="password" name="newPassword" id="newPassword" placeholder="New password *" value={newPassword} onChange={this.changeHandler} invalid={errors['newPassword'] !== undefined && errors['newPassword'] !== ""} required />
                          <FormFeedback>{errors['newPassword']}</FormFeedback>
                          <FormText>Be at least 8 characters, Upper and lowercase letter & One number</FormText>
                        </FormGroup>
                      </Col>
                      <Col md={12}>
                        <FormGroup>
                          <Label for="confirmPassword">Confirm password *</Label>
                          <Input type="password" name="confirmPassword" id="confirmPassword" value={confirmPassword} placeholder="Re-enter Password"  onChange={this.changeHandler} invalid={errors['confirmPassword'] !== undefined && errors['confirmPassword'] !== ""}  required />
                          <FormFeedback>{errors['confirmPassword']}</FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Button className="Submit-form-button">Update Password</Button>
                        </FormGroup>
                      </Col>
                    </Row>
                    
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        </>
      );
    
    }
}

export default ResetPassword;
