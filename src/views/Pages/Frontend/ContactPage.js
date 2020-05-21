import React from "react";
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, FormFeedback, Input, Button, Label} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import commenService from '../../../core/services/commonService';
import Loader from '../../../views/Loader/Loader';

import "./ContactPage.css";

class ContactPage extends React.Component {
  constructor( props ){
    super( props );

    this.state = {
      formField: { userName:'', email:'', phoneNumber:'', msg_subject:'', message:'' },
      loading: false,
      errors: {}
    };

    this.changeHandler = this.changeHandler.bind(this);
    this.submitContactForm = this.submitContactForm.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }
  
  submitContactForm(e) {
    e.preventDefault();
    e.target.className += " was-validated";
      if (this.validateForm()) {
        const formInputField = this.state.formField;
        const formData = {
          contactPerson: formInputField.userName,
          email: formInputField.email.toLowerCase(),
          phoneNumber: formInputField.phoneNumber,
          subject: formInputField.msg_subject,
          message: formInputField.message,
        };
        this.setState( { loading: true }, () => {
          commenService.postAPI( `common/contact-us`, formData )
            .then( res => {
              if ( undefined === res.data || !res.data.status ) {
                this.setState( { loading: false } );
                toast.error(res.data.message);
                return;
              }
              
              this.props.history.push('/contact-us');
              toast.success(res.data.message);
              this.setState( {
                formField: { userName:'', email:'', phoneNumber:'', msg_subject:'', message:'' },
                loading: false,
                errors: {}
              } )
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

  validateForm() {
    let errors = {};
    let formIsValid = true;
    const formField = this.state.formField;
    if (!formField.userName) {
        formIsValid = false;
        errors["userName"] = "*Please enter name.";
    }
    if (typeof formField.userName !== "undefined") {
        if (!formField.userName.match(/^[a-zA-Z ]*$/)) {
            formIsValid = false;
            errors["userName"] = "*Please enter alphabet characters only.";
        }
    }
    if (!formField.email) {
        formIsValid = false;
        errors["email"] = "*Please enter your email-ID.";
    }
    if (typeof formField.email !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(formField.email)) {
            formIsValid = false;
            errors["email"] = "*Please enter valid email-ID.";
        }
    }
    if (formField.phoneNumber !== "") {
        if (!formField.phoneNumber.match(/^[0-9]{10}$/)) {
            formIsValid = false;
            errors["phoneNumber"] = "*Please enter valid mobile no.";
        }
    }
    if (!formField.msg_subject) {
        formIsValid = false;
        errors["msg_subject"] = "*Please enter your subject.";
    }
    if (!formField.message) {
      formIsValid = false;
      errors["message"] = "*Please enter your query.";
    }
    this.setState({ loading: false, errors: errors });
    return formIsValid;
  }

  changeHandler(e) {  
    const name = e.target.name;
    const value = e.target.value;
    const formField = this.state.formField
    formField[name] = value;
    this.setState({ formField: formField });
  };

  render() {
    const { loading, formField, errors} = this.state;
    let loaderElement = '';
    if(loading)
      loaderElement = <Loader />

    return (
      <>        
        <ToastContainer /> 
        {loaderElement} 
        
        <section className="banner-section">
          <div className="banner-media-content">
              <div className="banner-media">
                <img src="/images/banner4.jpg" alt="Contact Banner" />
              </div>
              <div className="banner-content">
                <h2>The easiest way to find and hire virtual assistants</h2>
              </div>
          </div>
        </section>

        <section className="contactus-page-section">
          <div className="contactus-page-form">
          <Container>
            <Row>
                <Col md="7" lg="7" sm="7">
                  <div className="contact-image">
                    <img src="/images/contact-banner.svg" height="500" alt="" />
                  </div>
                </Col>
                <Col md="5" lg="5" sm="5">
                  <div className="contactus-form">
                    <h2>Send us a Message</h2>
                    <Form onSubmit={this.submitContactForm} id="contactForm" noValidate>
                      <Row>
                        <Col md="12" lg="6">
                          <FormGroup>
                            <Label htmlFor="firstName">First Name * </Label>
                            <Input type="text" name="firstName" id="firstName" invalid={errors['firstName'] !== undefined && errors['firstName'] !== ""} value={formField.firstName} onChange={this.changeHandler} placeholder="First Name" required />
                            <FormFeedback>{errors['firstName']}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md="12" lg="6">
                          <FormGroup>
                            <Label htmlFor="lastName">Last Name </Label>
                            <Input type="text" name="lastName" id="lastName" invalid={errors['lastName'] !== undefined && errors['lastName'] !== ""} value={formField.lastName} onChange={this.changeHandler} placeholder="Last Name" />
                          </FormGroup>
                        </Col>
                        <Col md="12" lg="6">
                          <FormGroup>
                            <Label htmlFor="email">Email Address * </Label>
                            <Input type="email" name="email" id="email" invalid={errors['email'] !== undefined && errors['email'] !== ""} value={formField.email} onChange={this.changeHandler} placeholder="Email *" required />
                            <FormFeedback>{errors['email']}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md="12" lg="6">
                          <FormGroup>
                            <Label htmlFor="phoneNumber">Phone no. </Label>
                            <Input type="number" id="phoneNumber" name="phoneNumber" invalid={errors['phoneNumber'] !== undefined && errors['phoneNumber'] !== ""} value={formField.phoneNumber} onChange={this.changeHandler} placeholder="Phone number" />
                            <FormFeedback>{errors['phoneNumber']}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md="12" lg="12">
                          <FormGroup>
                            <Label htmlFor="interestedOn">interested On *</Label>
                            <Input type="select" id="interestedOn" name="interestedOn" invalid={errors['interestedOn'] !== undefined && errors['interestedOn'] !== ""} value={formField.interestedOn} onChange={this.changeHandler} required>
                              <option value="Business looking to hire">Business looking to hire</option>
                              <option value="Virtual assistant looking for work">Virtual assistant looking for work</option>
                            </Input>
                            <FormFeedback>{errors['interestedOn']}</FormFeedback>
                          </FormGroup>
                        </Col>
                        <Col md="12" lg="12">
                          <FormGroup>
                            <Label htmlFor="message">Message *</Label>
                            <Input type="textarea" id="message" name="message" invalid={errors['message'] !== undefined && errors['message'] !== ""} value={formField.message} onChange={this.changeHandler} placeholder="Your Message *" required />
                            <FormFeedback>{errors['message']}</FormFeedback>
                          </FormGroup>
                        </Col>

                        <Col md="12" lg="6">
                          <FormGroup>
                            <Button className="submit-btn">Send Message</Button>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Col>
              </Row>
          </Container>
          </div>

          <div class="contactus-page-info">
            <Container>
              <div class="heading-title">
              <h2>Get in touch us</h2>
              <p>Lorem Ipsum is composed in a pseudo-Latin language which more or less corresponds to 'proper' Latin. It contains a series of real Latin words. </p>
              </div>
              <div class="row">
                <div class="col-md-3">
                  <div class="contact-info-card">
                    <h2>Office Address</h2>
                    <ul>
                      <li>
                        <div class="contact-text">
                          <i class="fa fa-map-marker" aria-hidden="true"></i>
                          <span>576 Fifth Avenue, Suite 903, New York, NY 10036</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="contact-info-card">
                    <h2>Phone</h2>
                    <ul>
                      <li>
                        <div class="phone-text">
                          <i class="fa fa-phone" aria-hidden="true"></i>
                          <span>+22 140 006 754</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="col-md-3">
                  <div class="contact-info-card">
                    <h2>Email Address</h2>
                    <ul>
                      <li>
                        <div class="email-text ">
                          <i class="fa fa-envelope" aria-hidden="true"></i>
                          <span>support@virtdrop.com</span>
                        </div>
                      </li>
                      
                    </ul>
                  </div>
                </div>

                <div class="col-md-3">
                  <div class="social-info-card">
                    <h2>Follow us</h2>
                    <ul>
                      <li>
                        <a class="facebook" href="https://www.facebook.com/virtdrop/" target="_blank" rel="noopener noreferrer">
                          <i class="fa fa-facebook-square" aria-hidden="true"></i>
                          <span>Facebook</span>
                        </a>
                      </li>
                      <li>
                        <a class="twitter" href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
                          <i class="fa fa-twitter-square" aria-hidden="true"></i>
                          <span>twitter</span>
                        </a>
                      </li>
                      <li>
                        <a class="linkedin" href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                          <i class="fa fa-linkedin-square" aria-hidden="true"></i>
                          <span>linkedin</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Container>
          </div>

          <div class="contactus-page-booking">
            <Container>
              <div class="contactus-booking-content">
                <div class="contactus-booking-text">
                    <h2>Discovery Call with Booking Calendar</h2>
                    <p>Meet Your VIRTDROP assistant today!</p>
                </div>
                <div class="contactus-booking-btn">
                  <a class="get-btn" href="/">Booking Now</a>
                </div>
                </div>
            </Container>
          </div>
          <div class="getstarted-banner-section">
            <Container>
              <div class="getstarted-banner-content">
                <div class="getstarted-media">
                  <img src="/images/banner3.jpg" alt="Get Started" />
                </div>
                <div class="getstarted-content">
                  <h2>Looking for an assistant, marketer, or simply someone to work online?</h2>
                  <p>We have a community of passionate people who love what they do, and are looking for new opportunities</p>
                  <Link class="get-btn" to="/register">Get Started!</Link>
                </div>
              </div>
            </Container>
          </div>
        </section>
            
      </>
    );
  }
}

export default ContactPage;
