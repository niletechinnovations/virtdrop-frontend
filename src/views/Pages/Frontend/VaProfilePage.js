import React from "react";
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, FormFeedback, Input, Button, Label} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import commenService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';
import "./VaProfilePage.css";

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
        <div className="profile-page-section">
          <div className="profile-info-card">
            <Container>
              <div className="profile-info-bg"></div>
              <div className="profile-info-content">
                <div className="profile-item-info">
                  <div className="profile-media">
                    <img src="/images/avatar.jpg" alt="user" className="profile-pic" />
                  </div>
                  <div className="profile-content">
                    <h2> Arun Kumar</h2>
                  </div>
                </div>
              </div>
            </Container>
          </div>
          
          <Container>
            <Row>
              <Col md="4" lg="4" sm="4">
                <div className="profile-card card-sticky">
                  <div className="profile-card-header">
                    <div className="d-flex align-items-center">
                      <div className="mr-auto">
                        <h4 className="card-title">Personal Information</h4>
                      </div>
                    </div>
                  </div>
                  <div className="profile-card-body">
                    <div className="profile-personal-info">
                      <div className="profile-personal-icon"><i class="fa fa-envelope" aria-hidden="true"></i></div>
                      <div className="profile-personal-text">
                        <h2>Email ID:</h2>
                        <p><a href="mailto:arun.kumar@niletechnologies.com">arun.kumar@niletechnologies.com</a></p>
                      </div>
                    </div>

                    <div className="profile-personal-info">
                      <div className="profile-personal-icon"><i className="fa fa-phone" aria-hidden="true"></i></div>
                      <div className="profile-personal-text">
                        <h2>Phone No.:</h2>
                        <p><a href="tel:+91-8989899899">+91-8989899899</a></p>
                      </div>
                    </div>

                    <div className="profile-personal-info">
                      <div className="profile-personal-icon"><i className="fa fa-skype" aria-hidden="true"></i></div>
                      <div className="profile-personal-text">
                        <h2>Skype ID:</h2>
                        <p>nile.skype</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md="8" lg="8" sm="8">
                <div className="profile-card">
                  <div className="profile-card-header">
                    <div className="d-flex align-items-center">
                      <div className="mr-auto">
                        <h4 className="card-title">VA Profile</h4>
                      </div>
                    </div>
                  </div>
                  <div className="profile-card-body">
                    <ul className="user-info">
                      <li>
                          <label>Website/ Portfolio Links:</label>
                          <p>https://www.niletechnologies.com/</p>
                      </li>
                      <li>
                          <label>Platforms, Tools, Systems , CRM :</label>
                          <p>VA Applcation</p>
                      </li>

                      <li>
                          <label>Skills:</label>
                          <p>Skill 1, Skill 2, Skill 3</p>
                      </li>

                      
                    </ul> 
                    <Row>
                      <Col md="3" lg="3" sm="3">
                        <div className="view-attachment-card">
                          <div className="view-attachment-icon">
                            <i class="fa fa-file-audio-o" aria-hidden="true"></i>
                          </div>
                          <div className="view-attachment-text">
                            <h2>Audio clip editor</h2>
                          </div>
                        </div>    
                      </Col>
                      <Col md="3" lg="3" sm="3">
                        <div className="view-attachment-card">
                          <div className="view-attachment-icon">
                            <i class="fa fa-file-word-o" aria-hidden="true"></i>
                          </div>
                          <div className="view-attachment-text">
                            <h2>Resume</h2>
                          </div>
                        </div>    
                      </Col>
                      <Col md="3" lg="3" sm="3">
                        <div className="view-attachment-card">
                          <div className="view-attachment-icon">
                            <i class="fa fa-file-pdf-o" aria-hidden="true"></i>
                          </div>
                          <div className="view-attachment-text">
                            <h2>Intent Letter</h2>
                          </div>
                        </div>    
                      </Col>
                      <Col md="3" lg="3" sm="3">
                        <div className="view-attachment-card">
                          <div className="view-attachment-icon">
                            <i class="fa fa-picture-o" aria-hidden="true"></i>
                          </div>
                          <div className="view-attachment-text">
                            <h2>Internet Connection Speed</h2>
                          </div>
                        </div>    
                      </Col>
                    </Row>


                  </div>
                </div>

                <div className="kickoff-date-card">
                  <h2>Enter Your Kickoff Date</h2>
                  <div className="date-form-group">
                    <input name="kickoff_date" type="date" class="form-control" /> 
                    <Button type="submit" className="btn-start">Start</Button>
                  </div>
                </div>
              </Col>
            </Row>

            

          </Container>
        </div>
        
            
      </>
    );
  }
}

export default VaProfilePage;
