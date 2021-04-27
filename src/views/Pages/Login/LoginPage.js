import React, { Component } from "react";
import  { Redirect, Link } from 'react-router-dom';
import { Col, Row, Button, Form, FormGroup, Label, Input, FormFeedback, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commenService from '../../../core/services/commonService';
import Loader from '../../../views/Loader/Loader';

import "./loginPage.css";

class LoginPage extends Component {
  constructor( props ){
    super( props );

    this.state = {
      email: '',
      password: '',
      modal: false,
      loggedIn: false,
      loading: false,
      errors: {},
      type: 'password'
    };
    this.showHide = this.showHide.bind(this);
    
  }
  
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  
  submitHandler = event => {
    event.preventDefault();
    event.target.className += " was-validated";
    const formErrors = this.state.errors;
    const loginData = {
      email: this.state.email.toLowerCase(),
      password: this.state.password
    };
    if(this.state.email === '' && this.state.password === '' ) {
      formErrors["email"] = 'Please enter your email id.';
      formErrors["password"] = 'Please enter your password.';
      this.setState({   errors: formErrors });
      toast.error("Please enter your email and password!");
      return;
    }
    this.setState( { loading: true }, () => {
      // console.log("Login Page", loginData)
      commenService.postAPI( `auth/sign-in`, loginData )
        .then( res => {
          // console.log("RES",res)
          if ( undefined === res.data || !res.data.status ) {
            this.setState( { loading: false } );
            if(res.data.errors){
              if(res.data.errors.email){
                formErrors["email"] = res.data.errors.email;
                this.setState({   errors: formErrors });
                toast.error('Error: '+res.data.errors.email);
              }
              else if(res.data.errors.password){
                formErrors["password"] = res.data.errors.password;
                this.setState({   errors: formErrors });
                toast.error('Error: '+res.data.errors.password);
              }else{
                toast.error(res.data.message);
              }
            }else{
              if(res.data.message === 'Invalid password!'){
                formErrors["password"] = res.data.message;
                this.setState({ formErrors: formErrors });
                toast.error(res.data.message);
              }else if(res.data.message === 'Email address not registered with us!'){
                formErrors["email"] = res.data.message;
                this.setState({ formErrors: formErrors });
                toast.error(res.data.message);
              }else{
                toast.error(res.data.message);
              }
            }
            return;
          }
  
          const loggedInfo = res.data;
          
          localStorage.setItem( 'accessToken', loggedInfo.data.accessToken );
          //localStorage.setItem( 'refreshToken', loggedInfo.data.refreshToken );
          localStorage.setItem( 'role', loggedInfo.data.role );
          localStorage.setItem( 'authId', loggedInfo.data.authId );
          localStorage.setItem( 'userName', loggedInfo.data.firstName+' '+loggedInfo.data.lastName );
          localStorage.setItem( 'userEmail', loggedInfo.data.email );
          localStorage.setItem( 'profilePic', loggedInfo.data.profilePic );
          localStorage.setItem( 'isActivePlan', loggedInfo.data.isActivePlan );
          localStorage.setItem( 'isOrganization', loggedInfo.data.isOrganization );
          
          this.setState( { loading: false, loggedIn: true } )
          
          toast.success(res.data.message);
          const userRole = loggedInfo.data.role;
          if(userRole.toLowerCase() === 'admin' ){
            this.props.history.push('/admin/dashboard');
          }else if( userRole === "recruitmentAdmin" ){
            this.props.history.push('/admin/va-request');
          }else if( userRole === "recruitmentTeam" ){
            this.props.history.push('/admin/va-application');
          }else if( userRole === "marketingTeam" ){
            this.props.history.push('/admin/scheduled-booking');
          }else if( loggedInfo.data.role.toLowerCase() === 'va_member' ){
            this.props.history.push('/user/va-dashboard');
          }else if(loggedInfo.data.role.toLowerCase() === 'organization'){
            this.props.history.push('/user/dashboard');
          }else if( userRole === "accountingAdmin" ){
            this.props.history.push('/admin/organization');
          }else if( userRole === "teamLead" ){
            this.props.history.push('/admin/va-task');
          }else
            this.props.history.push('/');
        } )
        .catch( err => {
          toast.error(err.message);
          this.setState( { loading: false} );
        } )
    } )
  };

  changeHandler = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  /*Handle Forgot Password Field*/
  changeForgotPasswordHandler = event => {

    this.setState({ [event.target.name]: event.target.value });
  }
  /*Forgot Password */
  submitForgotPasswordHandler = event => {
    event.preventDefault();
    event.target.className += " was-validated";
    const forgotData = {
      email: this.state.forgotPasswordEmail
    };
    this.setState( { loading: true }, () => {
      commenService.postAPI( `auth/forgot-password`, forgotData )
        .then( res => {
         
          console.log(res);
          if ( undefined === res.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          } 
  
          this.setState( {
            loading: false,
            modal: false
          } )
          toast.success(res.data.message);          
        } )
        .catch( err => {          
          toast.error(err.message);
          this.setState( { loading: false} );
        } )
    } )
  }
  /*Hide Modal*/
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      forgotPasswordEmail: ""
    });
  }

  showHide(e){
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === 'input' ? 'password' : 'input'
    })  
  }

  render() {
    const { email, password, loggedIn, loading, forgotPasswordEmail, errors} = this.state;
    
    if ( loggedIn || localStorage.getItem( 'accessToken' ) ) {
      const role = localStorage.getItem( 'role' );
      if( role.toLowerCase() === "admin" )
			  return ( <Redirect to={`/admin/dashboard`} noThrow /> )
       else if(role === "recruitmentAdmin")
        return ( <Redirect to={`/admin/va-request`} noThrow /> )
       else if(role === "recruitmentTeam")
        return ( <Redirect to={`/admin/va-application`} noThrow /> )
      else if(role === "marketingTeam")
        return ( <Redirect to={`/admin/scheduled-booking`} noThrow /> )
      else if(localStorage.getItem( 'role' ).toLowerCase() === "organization")
        return ( <Redirect to={`/user/dashboard`} noThrow /> )
      else
        return ( <Redirect to={`/`} noThrow /> )

		} else {
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
                <div className="col-md-5 col-lg-5 col-sm-5">
                  <ToastContainer /> 
                  <div className="account-form">
                    <h2>Login</h2>
                    {loaderElement} 
                    <Form onSubmit={this.submitHandler} id="submit-whitepaper" noValidate>
                      <Row form>
                        <Col md={12}>
                          <FormGroup>
                            <Label for="email">Email Address: </Label>
                            <Input type="email" name="email" id="email" placeholder="Enter Email Address *" value={email} onChange={this.changeHandler} invalid={errors['email'] !== undefined && errors['email'] !== ""} required />
                            <FormFeedback>{errors['email']}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md={12}>
                          <FormGroup>
                            <Label for="password">Password:</Label>
                            <Input type={this.state.type} name="password" id="password" value={password} placeholder="Enter Password"  onChange={this.changeHandler} invalid={errors['password'] !== undefined && errors['password'] !== ""} required />
                            <span className="password__show" onClick={this.showHide}><i className={this.state.type === 'input' ? 'fa fa-eye' : 'fa fa-eye-slash'}></i></span>
                            <FormFeedback>{errors['password']}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup check>
                            <Label check className="keep-me-login">
                              <Input type="checkbox" name="keepme" /> Keep me signed in
                            </Label>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <p className="forgot-text text-right"><a href="#!" className="footer-text" onClick={this.toggle}>Forgot Password?</a></p>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6} sm={12}>
                          <FormGroup>
                            <Button className="btn-submit">Sign In</Button>
                          </FormGroup>
                        </Col>
                      </Row>
                      
                    </Form>
                  </div>
                </div>
                <div className="col-md-7 col-lg-7 col-sm-7">
                  <div className="login-content-info">
                    <h2>Not yet registered but ready to hire a VirtDrop VA?</h2>
                    <p><b>Get started for FREE!</b></p>
                    <p>Simply fill out the details on our registration page. We’ll only ask you to do it this one time. You’re only a few steps away from being introduced to one of our amazing Virtual Assistants.</p>
                    <Link className="btn-click" to="/register">Register Now</Link>
                    <p><b>Looking to become a Virtual Assistant?</b></p>
                    <p>If you're interested in becoming a Virtual Assistant you can <Link to="/be-a-virdrop-va">apply here.</Link> </p>
                  </div>
                </div>      
              </div>
            </div>
          </div>
        </section>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className="forgot-password-modal">
          <ModalHeader toggle={this.toggle}>Reset your password</ModalHeader>
          <Form className="default-form needs-validation" onSubmit={this.submitForgotPasswordHandler} noValidate>
            <ModalBody>
              <p>Enter your user account's verified email address and we will send you a password reset link.</p>
              <Row form>
                <Col md={12}>
                  <FormGroup>
                    <Label for="forgotEmail">Email</Label>
                    <Input type="email" name="forgotPasswordEmail" id="forgotEmail" placeholder="Enter your email address *" value={forgotPasswordEmail} onChange={this.changeForgotPasswordHandler} required />
                  </FormGroup>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button className="primary-button" color="primary">Send recovery email</Button>{' '}
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>.
          </Form>  
        </Modal>
        </>
      );
    }
  }
}

export default LoginPage;
