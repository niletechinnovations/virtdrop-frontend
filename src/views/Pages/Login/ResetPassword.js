import React, { Component } from "react";
import { Col, Row, Button, Form, FormGroup, FormFeedback, Label, Input } from 'reactstrap';
import  { Link } from 'react-router-dom';

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
        <section className="banner-section">
          <div className="banner-media-content">
              <div className="banner-media">
                <img src="/images/banner4.jpg" alt="Login banner" />
              </div>
              <div className="banner-content">
                <h1>VirtDrop is the easiest way to find and hire Virtual Assistants.</h1>
              </div>
          </div>
        </section>
        <section className="account-page-section">
          <div className="container">
            <div className="account-content-card">
              <div className="row">
                <div className="col-md-6 col-lg-6 col-sm-6">
                  <ToastContainer /> 
                  <div className="account-form mb-5">
                    <h2>Setup your password</h2>
                    {loaderElement} 
                    <Form onSubmit={this.submitHandler} noValidate>
                      <Row form>
                        <Col md={12}>
                          <FormGroup>
                            <Label for="newPassword">New password *</Label>
                            <Input type="password" name="newPassword" id="newPassword" placeholder="New password *" value={newPassword} onChange={this.changeHandler} invalid={errors['newPassword'] !== undefined && errors['newPassword'] !== ""} required />
                            <FormFeedback>{errors['newPassword']}</FormFeedback>
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
                      <Row form>
                        <Col md={6}>
                          <FormGroup>
                            <Button className="btn-submit">Update Password</Button>
                          </FormGroup>
                        </Col>
                      </Row>
                      
                    </Form>
                  </div>
                </div>
                <div className="col-md-6 col-lg-6 col-sm-6">
                  <div className="login-content-info">
                    <h2>Not yet registered but ready to hire a VirtDrop VA?</h2>
                    <p><b>Get started for FREE!</b></p>
                    <p>Simply fill out the details on our registration page. We’ll only ask you to do it this one time. You’re only a few steps away from being introduced to one of our amazing Virtual Assistants.</p>
                    {/* <Link className="btn-click" to="/register">Register Now</Link> */}
                    <a className="btn-click" href= "https:app.virtdrop.com/common/va-hire-link">Register Now</a>
                    <p><b>Looking to become a Virtual Assistant?</b></p>
                    <p>If you're interested in becoming a Virtual Assistant you can <Link to="/be-a-virdrop-va">apply here.</Link> </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </>
      );
    
    }
}

export default ResetPassword;
