import React from "react";
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, FormFeedback, Input, Button, Label} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import commenService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';

class VaProfilePage extends React.Component {
  constructor( props ){
    super( props );

    this.state = {
      formField: { firstName:'', lastName:'', email:'', phoneNumber:'', interestedOn:'Business looking to hire', message:'' },
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
    //e.target.className += " was-validated";
      if (this.validateForm()) {
        const formInputField = this.state.formField;
        const formData = {
          contactPerson: formInputField.firstName+' '+formInputField.lastName,
          email: formInputField.email.toLowerCase(),
          phone: formInputField.phoneNumber,
          subject: formInputField.interestedOn,
          message: formInputField.message,
        };
        this.setState( { loading: true }, () => {
          commenService.postAPI( `common/contact-us22`, formData )
            .then( res => {
              if ( undefined === res.data || !res.data.status ) {
                this.setState( { loading: false } );
                toast.error(res.data.message);
                return;
              }
              
              this.props.history.push('/contact-us');
              toast.success(res.data.message);
              this.setState( {
                formField: { firstName:'', lastName:'', email:'', phoneNumber:'', interestedOn:'', message:'' },
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
    if (formField.phoneNumber !== "") {
        if (!formField.phoneNumber.match(/^[0-9]{10}$/)) {
            formIsValid = false;
            errors["phoneNumber"] = "*Please enter valid mobile no.";
        }
    }
    if (!formField.interestedOn) {
        formIsValid = false;
        errors["interestedOn"] = "*Please choose your interest.";
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
        
        <section className="contactus-page-section">
          <div className="contactus-page-form">
          <Container>
            <Row>
              <Col md="7" lg="7" sm="12">
                <h3>VA Profile</h3>
                <Row>
                  <Col md="3" lg="3" sm="12">
                    <img src="/images/avatar.jpg" alt="user" className="profile-pic" />
                  </Col>
                  <Col md="9" lg="9" sm="12">
                    <p className="mb-1"><strong>Name:</strong> Arun Kumar</p>
                    <p className="mb-1"><strong>Email ID:</strong> <a href="mailto:arun.kumar@niletechnologies.com">arun.kumar@niletechnologies.com</a></p>
                    <p className="mb-1"><strong>Phone No.:</strong> <a href="tel:+91-8989899899">+91-8989899899</a></p>
                    <p className="mb-1"><strong>Skype ID:</strong> nile.skype</p>
                  </Col>
                  <Col md="12">
                    <p className="mt-4"><strong>Website/ Portfolio Links:</strong> https://www.niletechnologies.com/</p>
                    <p>
                      <strong>Platforms, Tools, Systems , CRM</strong> :VA Applcation
                    </p>
                    <p>
                      <strong>Skills</strong> : Skill 1, Skill 2, Skill 3
                    </p>
                  </Col>
                  <Col md="4">
                    <Input type="date" name="kickoff_date" />
                  </Col>
                  <Col md="2"><Button type="submit">Start</Button></Col>
                </Row>
              </Col>
            </Row>
          </Container>
          </div>

        </section>
            
      </>
    );
  }
}

export default VaProfilePage;
