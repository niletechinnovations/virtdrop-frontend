import React, { Component } from 'react';
import { Button, Form, Input, Col, Row, FormGroup, Label, FormText} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';
import { FormErrors } from '../../Formerrors/Formerrors';

class intakeForm extends Component {
   constructor(props){
      super(props);
      this.state = {
         formField: { organizationName: '', email: '', firstName: '', lastName:'', mobileNumber:'', phoneNumber:'', address:'', address2:'', city:'', state:'', postalCode:'', country:'', profilePic:'' },
         formErrors: {organization_name: '', email: '', firstName: '', lastName: '', mobileNumber:'', phoneNumber:'', address:'', city:'', state:'', postalCode:'', country:'', error: ''},
         formValid: true,
         organizationId: "",
         invalidImage:'',
         loading: false
      };
      this.submitHandler = this.submitHandler.bind(this);
    }
    componentDidMount() { 
      //this.getProfile();
   }
   
   
   /* Submit Form Handler*/
   submitHandler (event) {
      event.preventDefault();
      event.target.className += " was-validated";
      this.setState( { loading: true}, () => {
        const formInputField = this.state.formField;
        const formData = {
          "email": formInputField.email,
          "profileId": this.state.organizationId,
          "firstName": formInputField.firstName, 
          "lastName": formInputField.lastName, 
          "mobileNumber": formInputField.mobileNumber, 
          "phoneNumber": formInputField.phoneNumber, 
          "organizationName": formInputField.organizationName,
          "address": formInputField.address, 
          "address2": formInputField.address2,
          "city": formInputField.city,
          "state": formInputField.state,
          "postalCode": formInputField.postalCode,
          "country": formInputField.country
        };
        commonService.putAPIWithAccessToken('profile', formData)
          .then( res => {
            if ( undefined === res.data.data || !res.data.status ) {
             
              this.setState( { loading: false} );
              toast.error(res.data.message);
              return;
            }           
            this.setState({ loading: false});
            localStorage.setItem( 'userName', formInputField.firstName+' '+formInputField.lastName);
            //window.location.reload();
            toast.success(res.data.message);
          } )
          .catch( err => {         
            if(err.response !== undefined && err.response.status === 401) {
              localStorage.clear();
              this.props.history.push('/login');
            }
            else
              this.setState( { loading: false } );
              toast.error(err.message);
          } )
      } );
      
    };

    /* Input Field On changes*/
    changeHandler = event => {
      const name = event.target.name;
      const value = event.target.value;
      const formField = this.state.formField
      formField[name] = value;
      this.setState({ formField: formField },
                    () => { this.validateField(name, value) });

      console.log(this.state.formValid);
    };

    /* Validate Form Field */
   validateField(fieldName, value) {
      let fieldValidationErrors = this.state.formErrors;
      fieldValidationErrors.error = '';
   
      switch(fieldName) {         
      case 'organizationName':        
         fieldValidationErrors.organizationName = (value !== '') ? '' : ' is required';
         break;
      case 'firstName':        
         fieldValidationErrors.firstName = (value !== '') ? '' : ' is required';
         break;
      case 'lastName':        
         fieldValidationErrors.lastName = (value !== '') ? '' : ' is required';
         break;               
      case 'email':        
         fieldValidationErrors.email = (value !== '') ? '' : ' is required';
         break;               
      case 'mobileNumber':        
         fieldValidationErrors.mobileNumber = (value !== '') ? '' : ' is required';
         break;               
      case 'phoneNumber':        
         fieldValidationErrors.phoneNumber = (value !== '') ? '' : ' is required';
         break;               
      case 'address':        
         fieldValidationErrors.address = (value !== '') ? '' : ' is required';
         break;               
      case 'city':        
         fieldValidationErrors.city = (value !== '') ? '' : ' is required';
         break;               
      case 'state':        
         fieldValidationErrors.state = (value !== '') ? '' : ' is required';
         break;               
      case 'postalCode':        
         fieldValidationErrors.postalCode = (value !== '') ? '' : ' is required';
         break;               
      case 'country':        
         fieldValidationErrors.country = (value !== '') ? '' : ' is required';
         break;               
      default:
         break;
      }
      this.setState({formErrors: fieldValidationErrors,       
                  }, this.validateForm);
   }
   /* Validate Form */
   validateForm() {
      const formErrors = this.state.formErrors;
      const formField = this.state.formField;
      this.setState({formValid: 
      (formErrors.organizationName === ""  && formErrors.firstName === "" && formErrors.lastName === "" && formErrors.email === "" && formField.organizationName !== "" && formField.firstName !== ""  && formField.lastName !== "" && formField.email !== "" ) 
      ? true : false});
   }
   /* Set Error Class*/
   errorClass(error) {
      return(error.length === 0 ? '' : 'has-error');
   }


  render() {
   const { loading, formField } = this.state;
    let loaderElement = '';
    if(loading)
      loaderElement = <Loader />

    return (
      <div className="user-dashboard">
         <ToastContainer />
         {loaderElement}
        <div className="profile-form">
            <h3>Intake Form</h3>
            <FormErrors formErrors={this.state.formErrors} />
            <Form onSubmit={this.submitHandler} noValidate>
               <Row>
                  <Col md={"6"}>
                     <div className="form-group">
                        <label htmlFor="typeOfVirtualAssistance">Type of Virtual Assistance *</label>
                        <Input type="select" name="typeOfVirtualAssistance" id="typeOfVirtualAssistance" className="form-control" onChange={this.changeHandler} required>
                           <option value="1">Business Support</option>
                           <option value="2">Personal Assistance</option>
                        </Input>
                     </div>
                  </Col>
                  <Col md={"6"}>
                     <FormGroup>
                        <label htmlFor="natureOfBusiness">Nature of Business *</label>
                        <input type="text" name="natureOfBusiness" id="natureOfBusiness" className="form-control" placeholder="Nature of Business" value={formField.natureOfBusiness} onChange={this.changeHandler} required />
                        <FormText color="muted">e.g. E-Commerce, Real Estate, Customer Service etc.</FormText>
                     </FormGroup>
                  </Col>
                  <Col md={"6"}>
                     <div className="form-group">
                        <label htmlFor="typeOfEngagement">Type of Engagement *</label>
                        <Input type="select" name="typeOfEngagement" id="typeOfEngagement" className="form-control" value={formField.typeOfEngagement} required>
                           <option value="1">Project-Based</option>
                           <option value="2">Ongoing Task</option>
                        </Input>
                     </div>
                  </Col>
                  <Col md={"6"}>
                     <FormGroup>
                        <Label htmlFor="engagementDescription">Engagement Description *</Label>
                        <Input type="textarea" name="engagementDescription" className="form-control" value={formField.engagementDescription} onChange={this.changeHandler} required></Input>
                        <FormText color="muted">
                           e.g. Project Based - 2 Weeks, 1 MOnth etc. <br />
                           e.g. Ongoing Task - How many hours/daily <br />
                           <span className="text-danger">Disclaimer: Minimum of of 10 hours a Week</span>
                        </FormText>
                     </FormGroup>
                  </Col>
                  <div className="col-md-6">
                     <div className="form-group">
                        <label htmlFor="numberOfVA">How many VAs do you need?</label>
                        <input type="text" name="numberOfVA" id="numberOfVA" className="form-control" value={formField.numberOfVA} onChange={this.changeHandler} required />
                     </div>
                  </div>
                  <Col md={"6"}>
                     <FormGroup> 
                        <Label htmlFor="skillSet">Skill Sets and Other Requirements</Label>
                        <Input type="text" id="skillSet" className="form-control" name="skillSet" value={formField.skillSet} onChange={this.changeHandler}  />
                     </FormGroup>
                  </Col>              
                  <Col md={"12"}>
                     <div className="form-group pull-right">
                        <Button color="primary" className="btn btn-primary btn-lg" type="submit">Submit</Button>
                     </div>
                  </Col>
               </Row>
            </Form>
         </div>
      </div>
    );
  }
}

export default intakeForm;
