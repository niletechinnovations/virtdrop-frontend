import React from "react";
import  { Link } from 'react-router-dom';
import { Col, Row, Button, Form, FormGroup,FormFeedback, Label, Input,InputGroup,InputGroupAddon } from 'reactstrap';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commenService from '../../../core/services/commonService';
import Loader from '../../../views/Loader/Loader';

import "../Login/loginPage.css";


class RegisterPage extends React.Component {
  constructor( props ){
    super( props );

    this.state = {
      firstName: '',
      lastName: "",
      email: '',
      mobileNumber:'',
      phoneNumber:'',
      password: '',
      confirmPassword: '',
      organizationName: '',
      skypeId:'',
      address: '',
      address2:'',
      city: '',
      state: '',
      country:'',
      zipCode:'',
      countryCode:'',
      phoneCode:'',
      loading: false,
      errors: {},
      type: 'password',
      hearAboutUs:''
    };
    this.showHide = this.showHide.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.submituserRegistrationForm = this.submituserRegistrationForm.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }
  
  submituserRegistrationForm(e) {
    e.preventDefault();
    e.target.className += " was-validated";
    if (this.validateForm()) {
        const signupData = {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email.toLowerCase(),
          // mobileNumber: this.state.countryCode+''+this.state.mobileNumber,
          // phoneNumber: this.state.phoneCode+''+this.state.phoneNumber,
          mobileNumber:this.state.mobileNumber,
          phoneNumber:this.state.phoneNumber,
          password: this.state.password,
          skypeId: this.state.skypeId,
          organizationName: this.state.organizationName,
          address: this.state.address,
          address2: this.state.address2,
          city: this.state.city,
          state: this.state.state,
          postalCode: this.state.zipCode,
          role: 'organization',
          country:this.state.country,
          hearAboutUs:this.state.hearAboutUs
        };

        console.log("signupData",signupData);

        this.setState( { loading: true }, () => {
          commenService.postAPI( `auth/sign-up`, signupData )
            .then( res => {
              if ( undefined === res.data || !res.data.status ) {
                this.setState( { loading: false } );
                toast.error(res.data.message);
                return;
              }
              
              this.setState({loading: false,  organizationName: "",firstName: "", lastName: "", mobileNumber:"", phoneNumber: "", password: "", skypeId:'', address: '', address2:'',city:'',state:'', country:'', zipCode:'', hearAboutUs:'', errors:'' });
              this.props.history.push('/thank-you');
              //toast.success(res.data.message);
              //window.scrollTo(0, 0);
            } )
            .catch( err => {
              toast.error(err.message);
              this.setState( { loading: false} );
            } )
        } )
      }else{
        //console.log("Outside validation area.");
      }
  };

  changeHandler(e) {  
    this.setState({ [e.target.name]: e.target.value });
  };
  
  validateForm() {
    let errors = {};
    let formIsValid = true;
    if (!this.state.firstName) {
        formIsValid = false;
        errors["firstName"] = "*Please enter first name.";
    }
    if (typeof this.state.firstName !== "undefined") {
        if (!this.state.firstName.match(/^[a-zA-Z ]*$/)) {
            formIsValid = false;
            errors["firstName"] = "*Please enter alphabet characters only.";
        }
    }
    if (!this.state.lastName) {
      formIsValid = false;
      errors["lastName"] = "*Please enter last name.";
    }
    if (!this.state.email) {
        formIsValid = false;
        errors["email"] = "*Please enter your email-ID.";
    }
    if (typeof this.state.email !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(this.state.email)) {
            formIsValid = false;
            errors["email"] = "*Please enter valid email-ID.";
        }
    }
  
    if (!this.state.mobileNumber) {
      formIsValid = false;
      errors["mobileNumber"] = "*Please enter your mobile no.";
    }
    if (typeof this.state.mobileNumber !== "undefined") {
      if (!this.state.mobileNumber.match(/^[0-9]{9}$/)) {
          formIsValid = false;
          errors["mobileNumber"] = "*Please enter valid mobile no.";
      }
    }
    if (this.state.phoneNumber) {
      if (!this.state.phoneNumber.match(/^[0-9]{9}$/)) {
          formIsValid = false;
          errors["phoneNumber"] = "*Please enter valid phone no.";
      }
    }

    // if (!this.state.countryCode) {
    //   formIsValid = false;
    //   errors["countryCode"] = "*Required";
    // }
    // if(this.state.phoneNumber){
    //   if (!this.state.phoneCode) {
    //     formIsValid = false;
    //     errors["phoneCode"] = "*Required";
    //   }
    // }
    if (!this.state.password) {
        formIsValid = false;
        errors["password"] = "*Please enter your password.";
    }
    if (!this.state.organizationName) {
      formIsValid = false;
      errors["organizationName"] = "*Please enter your company name.";
    }
    
    
    this.setState({
      loading: false,
      errors: errors
    });
    //console.error(errors);
    return formIsValid;
  }

  showHide(e){
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      type: this.state.type === 'input' ? 'password' : 'input'
    })  
  }

  render() {
    const { loading, firstName, lastName, email, password,mobileNumber,countryCode, country, phoneNumber,phoneCode,organizationName,skypeId,address,address2,city,state,zipCode, hearAboutUs, errors} = this.state;
    
    let loaderElement = '';
    if(loading)
      loaderElement = <Loader />

      return (
        <>

        <section className="banner-section">
          <div className="banner-media-content">
              <div className="banner-media">
                <img src="/images/banner4.jpg" alt="Register Banner" />
              </div>
              <div className="banner-content">
                <h1>VirtDrop is the easiest way to find and hire Virtual Assistants.</h1>
              </div>
          </div>
        </section>
        <section className="account-page-section">
          <div className="container">
            <div className="register-content-card">
              <div className="row">
                <div className="col-md-5 col-lg-5 col-sm-5">
                  <ToastContainer /> 
                  {loaderElement} 
                  <div className="account-form">
                    <h2>Register as a Business</h2>
                    
                    <Form onSubmit={this.submituserRegistrationForm} noValidate>
                      <Row form>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="firstName">First Name *</Label>
                            <Input type="text" name="firstName" id="firstName" invalid={errors['firstName'] !== undefined && errors['firstName'] !== ""} value={firstName} onChange={this.changeHandler} placeholder="First Name" required />
                            <FormFeedback>{errors['firstName']}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="lastName">Last Name *</Label>
                            <Input type="text" name="lastName" id="lastName" value={lastName} invalid={errors['lastName'] !== undefined && errors['lastName'] !== ""} onChange={this.changeHandler} placeholder="Last Name" required />
                            <FormFeedback>{errors['lastName']}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md={12}>
                          <FormGroup>
                            <Label for="email">Email Address *</Label>
                            <Input type="email" name="email" id="email" placeholder="Email Address" invalid={errors['email'] !== undefined && errors['email'] !== ""} value={email} onChange={this.changeHandler} required />
                            <FormFeedback>{errors['email']}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md={12}>
                          <FormGroup>
                            <Label for="password">Password *</Label>
                            <Input type={this.state.type} name="password" invalid={errors['password'] !== undefined && errors['password'] !== ""} id="password" value={password} onChange={this.changeHandler} placeholder="Enter Password" required />
                            <span className="password__show" onClick={this.showHide}><i className={this.state.type === 'input' ? 'fa fa-eye' : 'fa fa-eye-slash'}></i></span>
                            <FormFeedback>{errors['password']}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="mobileNumber">Mobile Number *</Label>
                            <InputGroup>
                              {/* <InputGroupAddon addonType="prepend">
                              <Input type="text" className="phone-code" name="countryCode" placeholder="+2" value={countryCode} onChange={this.changeHandler} required invalid={errors['countryCode'] !== undefined && errors['countryCode'] !== ""} />
                              </InputGroupAddon> */}
                              <Input type="number" name="mobileNumber" min={1} step="1" id="mobileNumber" invalid={errors['mobileNumber'] !== undefined && errors['mobileNumber'] !== ""} placeholder="Mobile no." value={mobileNumber} onChange={this.changeHandler} required />
                              <FormFeedback>{errors['mobileNumber']}</FormFeedback>
                            </InputGroup>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label for="phoneNumber">Business Phone</Label>
                            <InputGroup>
                              {/* <InputGroupAddon addonType="prepend">
                                <Input type="text" name="phoneCode" className="phone-code" placeholder="+2" value={phoneCode} onChange={this.changeHandler} />
                              </InputGroupAddon> */}
                              <Input type="number" name="phoneNumber" min={1} step="1" id="phoneNumber" invalid={errors['phoneNumber'] !== undefined && errors['phoneNumber'] !== ""} placeholder="Phone no." value={phoneNumber} onChange={this.changeHandler} />
                            </InputGroup>
                          </FormGroup>
                        </Col>
                        <Col md={12}>  
                          <FormGroup>
                            <Label for="skypeId">Skype ID</Label>
                            <Input type="text" name="skypeId" id="skypeId" placeholder="Skype ID" value={skypeId} onChange={this.changeHandler} />
                          </FormGroup>
                        </Col>
                        <Col md={12}>  
                          <FormGroup>
                            <Label for="address">Street Address *</Label>
                            <Input type="text" name="address" id="address" placeholder="Street Address Line 1" value={address} onChange={this.changeHandler} required />
                            <FormFeedback>{errors['address']}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md={12}>  
                          <FormGroup>
                            <Label for="address2">Street Address Line 2</Label>
                            <Input type="text" name="address2" id="address2" placeholder="Street Address Line 2" value={address2} onChange={this.changeHandler} />
                          </FormGroup>
                        </Col>
                        <Col md={4}>  
                          <FormGroup>
                            <Label for="city">City *</Label>
                            <Input type="text" name="city" id="city" placeholder="City" value={city} onChange={this.changeHandler} required />
                          </FormGroup>
                        </Col>
                        <Col md={4}>  
                          <FormGroup>
                            <Label for="state">State/Province *</Label>
                            <Input type="text" name="state" id="state" placeholder="State/Province" value={state} onChange={this.changeHandler} required />
                          </FormGroup>
                        </Col>
                        <Col md={4}>  
                          <FormGroup>
                            <Label for="country">Country *</Label>
                            <Input type="text" name="country" id="country" placeholder="Country" value={country} onChange={this.changeHandler} required />
                          </FormGroup>
                        </Col>
                        <Col md={4}>  
                          <FormGroup>
                            <Label for="address2">Postal/Zip Code *</Label>
                            <Input type="text" name="zipCode" id="zipCode" placeholder="Postal/Zip Code" value={zipCode} onChange={this.changeHandler} required />
                          </FormGroup>
                        </Col>
                        <Col md={12}>
                          <FormGroup>
                            <Label for="organizationName">Company Name *</Label>
                            <Input type="text" name="organizationName" id="organizationName" value={organizationName} invalid={errors['organizationName'] !== undefined && errors['organizationName'] !== ""} onChange={this.changeHandler} placeholder="Organization / Business name" required/>
                            <FormFeedback>{errors['organizationName']}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md={12}>
                          <FormGroup>
                            <Label for="hearAboutUs">How did you hear about us (optional)*</Label>
                            <Input type="text" name="hearAboutUs" id="hearAboutUs" value={hearAboutUs} placeholder="How did you hear about us ?"
                              onChange={this.changeHandler} />
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <Button type="submit" className="btn-submit">Sign Up</Button>
                        </Col>
                      </Row>
                      <FormGroup>
                        <div className="footer-text pt-3">
                          Already have an account? <Link className="sign-up-link" to="/login">Sign In</Link>
                        </div>
                      </FormGroup>
                      
                    </Form>
                    
                  </div>
                </div>
                <div className="col-md-7 col-lg-7 col-sm-7">
                  <div className="login-content-info">
                    <h2>Ready to hire a VirtDrop VA?</h2>
                    <p><b>Get started for FREE!</b></p>
                    <p>Simply fill out the details on the left. We’ll only ask you to do it this one time. You’re only a few steps away from being introduced to one of our amazing Virtual Assistants.</p>
                    <p>If you already have an account:</p>
                    <Link className="btn-click" to="/login">Sign In</Link>
                    <p><b>Looking to become a Virtual Assistant?</b></p>
                    <p>If you're interested in becoming a Virtual Assistant you can <Link to="/be-a-virdrop-va">apply here.</Link></p>
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

export default RegisterPage;
