import React from "react";
import { Link } from 'react-router-dom';
import { 
    Container, Row, Col, Form, FormGroup, FormFeedback, Input, Button, Label,
    Modal, ModalHeader, ModalBody
} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import commenService from '../../../../core/services/commonService';
import Loader from '../../../../views/Loader/Loader';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./BookingPage.css";

class BookingPage extends React.Component {
  constructor( props ){
    super( props );

    this.state = {
      formField: { firstName:'', lastName:'', email:'', phoneNumber:'', companyName:'', websiteLInk:'' },
      startDate: new Date(),
      scheduledTime: '',
      modal: false,      
      loading: false,
      errors: {}
    };

    this.changeHandler = this.changeHandler.bind(this);
    this.submitScheduleForm = this.submitScheduleForm.bind(this);
    this.setTimeSlot = this.setTimeSlot.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }
  
  submitScheduleForm(e) {
    e.preventDefault();
    //e.target.className += " was-validated";
      if (this.validateForm()) {
        const formInputField = this.state.formField;
        const formData = {
          firstName: formInputField.firstName,
          lastName: formInputField.lastName,
          email: formInputField.email.toLowerCase(),
          phoneNumber: formInputField.phoneNumber,
          companyName: formInputField.companyName,
          websiteLInk: formInputField.websiteLInk,
          scheduledDate: this.state.startDate,
          scheduledTime: this.state.scheduledTime
        };
        this.setState( { loading: true }, () => {
          commenService.postAPI( `booking`, formData ).then( res => {
            if ( undefined === res.data || !res.data.status ) {
              this.setState( { loading: false } );
              toast.error(res.data.message);
              return;
            }
            
            toast.success(res.data.message);
            this.setState( {
              formField: { firstName:'', lastName:'', email:'', phoneNumber:'', companyName:'', websiteLInk:'' },
              loading: false,
              modal: false,
              errors: {}
            } )
          } )
          .catch( err => {
            toast.error(err.message);
            this.setState( { loading: false} );
          } )
        } )
      }else{
        console.log("Outside validation area.");
      }
  };

  validateForm() {
    let errors = {};
    let formIsValid = true;
    const formField = this.state.formField;
    if (!formField.firstName) {
        formIsValid = false;
        errors["firstName"] = "*Please enter first name.";
    }
    if (typeof formField.firstName !== "undefined") {
        if (!formField.firstName.match(/^[a-zA-Z ]*$/)) {
            formIsValid = false;
            errors["firstName"] = "*Please enter alphabet characters only.";
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
    if (!formField.phoneNumber) {
      formIsValid = false;
      errors["phoneNumber"] = "*Please enter phone number.";
    }
    if (formField.phoneNumber !== "") {
      if (!formField.phoneNumber.match(/^[0-9]{10}$/)) {
        formIsValid = false;
        errors["phoneNumber"] = "*Please enter valid phone no.";
      }
    }
    if (!formField.companyName) {
      formIsValid = false;
      errors["companyName"] = "*Please enter company name.";
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

  setStartDate = date => {
    let startDate = this.state.startDate;
    startDate = date;
    this.setState({ startDate: startDate });
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      formValid: false,
    });
  }
  setTimeSlot(timeSlot){
    this.setState({
      scheduledTime: timeSlot,
      modal: !this.state.modal,
      formValid: false,
    });
  }


  render() {
    const { loading, modal, formField, errors} = this.state;
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
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
              <img src="/images/banner4.jpg" alt="Booking Banner" />
            </div>
            <div className="banner-content">
              <h1>Would you like further information? Book a Discovery Call with one of our team.</h1>
            </div>
          </div>
        </section>

        <section className="contactus-page-section">
          <div className="contactus-page-form">            
            <Container>
              <div className="calendar-heading">
                  <h2>Book a FREE 15-minute consultation with our team.</h2>
                  <p>Schedule a call to discuss your reasons for hiring a Virtual Assistant, learn all the services VAs can assist with,  and the different ways you can hire a Digital Assistant through VirtDrop.</p>
              </div>
              <div className="calendar-content">
                <h2>Schedule a Call</h2>
                <Row>
                    <Col md="8" lg="8" sm="8">
                        <DatePicker selected={ this.state.startDate } monthsShown={2} minDate={new Date()} onChange={this.setStartDate} dateFormat="MM/dd/yyyy" inline />
                    </Col>
                    <Col md="4" lg="4" sm="4">
                      <div className="time-slots">
                        <div className="slots">
                            <div className="slot" onClick={() =>this.setTimeSlot("10:00 AM")}>10:00 AM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("10:15 AM")}>10:15 AM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("10:30 AM")}>10:30 AM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("10:45 AM")}>10:45 AM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("11:00 AM")}>11:00 AM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("11:15 AM")}>11:15 AM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("11:30 AM")}>11:30 AM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("11:45 AM")}>11:45 AM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("12:00 PM")}>12:00 PM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("12:15 PM")}>12:15 PM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("12:30 PM")}>12:30 PM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("12:45 PM")}>12:45 PM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("2:00 PM")}>2:00 PM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("2:15 PM")}>2:15 PM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("2:30 PM")}>2:30 PM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("2:45 PM")}>2:45 PM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("3:00 PM")}>3:00 PM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("3:15 PM")}>3:15 PM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("3:30 PM")}>3:30 PM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("3:45 PM")}>3:45 PM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("4:00 PM")}>4:00 PM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("4:15 PM")}>4:15 PM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("4:30 PM")}>4:30 PM</div>
                            <div className="slot" onClick={() =>this.setTimeSlot("4:45 PM")}>4:45 PM</div>
                        </div>
                      </div>
                    </Col>
                </Row>
              </div>
            </Container>
          </div>
          <div className="getstarted-banner-section">
            <Container>
              <div className="getstarted-banner-content">
                <div className="getstarted-media">
                  <img src="/images/banner3.jpg" alt="Get Started" />
                </div>
                <div className="getstarted-content">
                  <h2>Searching for the best Virtual Assistants capable of handling a wide range of tasks?</h2>
                  <p>Look no further than VirtDrop! Use the booking calendar above to find out how we can help or register using the link below.</p>
                  <Link className="get-btn" to="/register">Get Started!</Link>
                </div>
              </div>
            </Container>
          </div>
        </section>

        <Modal isOpen={modal} toggle={this.toggle} className="schedule-modal">
          <ModalHeader toggle={this.toggle} className="pb-0">VirtDrop: Schedule a Call</ModalHeader>
          <Form onSubmit={this.submitScheduleForm} noValidate>
            <ModalBody>
                <Row>
                    <Col md="12" className="text-center schedule-text">
                        <h4 className="pb-0">You have selected</h4>
                        <h5 className="pb-0">{(new Date(this.state.startDate)).toLocaleDateString("en-US",options)} @ {this.state.scheduledTime}</h5>
                        <h6>is for 15 minutes</h6>
                    </Col>
                </Row>
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
                    <Label htmlFor="phoneNumber">Phone no. *</Label>
                    <Input type="number" id="phoneNumber" name="phoneNumber" invalid={errors['phoneNumber'] !== undefined && errors['phoneNumber'] !== ""} value={formField.phoneNumber} onChange={this.changeHandler} placeholder="Phone number" required />
                    <FormFeedback>{errors['phoneNumber']}</FormFeedback>
                    </FormGroup>
                </Col>
                <Col md="12" lg="6">
                    <FormGroup>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input type="text" id="companyName" name="companyName" invalid={errors['companyName'] !== undefined && errors['companyName'] !== ""} value={formField.companyName} onChange={this.changeHandler} placeholder="Company name" required />
                    <FormFeedback>{errors['companyName']}</FormFeedback>
                    </FormGroup>
                </Col>
                <Col md="12" lg="6">
                    <FormGroup>
                    <Label htmlFor="websiteLInk">Website (if any)</Label>
                    <Input type="text" id="websiteLInk" name="websiteLInk" invalid={errors['websiteLInk'] !== undefined && errors['websiteLInk'] !== ""} value={formField.websiteLInk} onChange={this.changeHandler} placeholder="Website URL" />
                    <FormFeedback>{errors['websiteLInk']}</FormFeedback>
                    </FormGroup>
                </Col>
                <Col md="12" lg="12">
                  <Button className="btn-blue" type="submit">Book 15 min call</Button>
                  <Button className="btn-cancel" onClick={this.toggle}>Cancel</Button>
                </Col>
                </Row>
            </ModalBody>
          </Form>
        </Modal>
      
      </>
    );
  }
}

export default BookingPage;
