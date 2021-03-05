import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Input, Col, Row, FormGroup, Label, FormText, Card, CardHeader, CardBody} from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';
import { FormErrors } from '../../Formerrors/Formerrors';

class intakeForm extends Component {
   constructor(props){
      super(props);
      this.state = {
         formField: { vaType: 1, natureOfBusiness: '', engagementType: 1, engagementDescription:'', numberOfVA:'', skillSet:'', totalWeekHours:'', weekHours:'' },
         formErrors: {vaType: '', natureOfBusiness: '', engagementType: '', engagementDescription: '', numberOfVA:'', skillSet:'', error: ''},
         formValid: true,
         requestId: "",
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
          "vaType": formInputField.vaType,
          "natureOfBusiness": formInputField.natureOfBusiness, 
          "engagementType": formInputField.engagementType, 
          "engagementDescription": formInputField.engagementDescription, 
          "numberOfVA": formInputField.numberOfVA, 
          "skillSet": formInputField.skillSet,
          "totalWeekHours": formInputField.totalWeekHours,
          "weekHours": formInputField.weekHours
        };
        commonService.postAPIWithAccessToken('va-request', formData)
          .then( res => {
            if ( undefined === res.data.data || !res.data.status ) {
              this.setState( { loading: false} );
              toast.error(res.data.message);
              return;
            }
            this.setState({ loading: false});
            this.props.history.push('/user/manage-request');
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
      
    };

    /* Input Field On changes*/
    changeHandler = event => {
      const name = event.target.name;
      const value = event.target.value;
      const formField = this.state.formField
      formField[name] = value;
      this.setState({ formField: formField },
                    () => { this.validateField(name, value)});
      //console.log(this.state.formValid);
    };

    /* Validate Form Field */
   validateField(fieldName, value) {
      let fieldValidationErrors = this.state.formErrors;
      fieldValidationErrors.error = '';
   
      switch(fieldName) {         
      case 'vaType':
         fieldValidationErrors.vaType = (value !== '') ? '' : ' is required';
         break;
      case 'natureOfBusiness':
         fieldValidationErrors.natureOfBusiness = (value !== '') ? '' : ' is required';
         break;
      case 'engagementType':
         fieldValidationErrors.engagementType = (value !== '') ? '' : ' is required';
         break;               
      case 'engagementDescription':        
         fieldValidationErrors.engagementDescription = (value !== '') ? '' : ' is required';
         break;               
      case 'numberOfVA':
         fieldValidationErrors.numberOfVA = (value !== '') ? '' : ' is required';
         break;               
      case 'skillSet':      
         fieldValidationErrors.skillSet = (value !== '') ? '' : ' is required';
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
      <div className="dashboard-section">
         {loaderElement}
               
         <Card className="vd-card">
            <CardHeader>
               <div className="d-flex align-items-center">
               <div className="mr-auto">
                  <h4 className="card-title"><img src="/images/timezone.svg" height="30" alt="" /> Add New VA Request</h4>
               </div>
               <div className="add-option-info">
                  <Link className="btn-add" to="/user/manage-request">Back to Manage Request</Link>
               </div>
               </div>
            </CardHeader>
            <CardBody>
               <FormErrors formErrors={this.state.formErrors} />
               <Form className="profile-form" onSubmit={this.submitHandler} noValidate>
                  <Row>
                     <Col md={"6"}>
                        <div className="form-group">
                           <label htmlFor="vaType">Type of Virtual Assistance *</label>
                           <Input type="select" name="vaType" id="vaType" className="form-control" value={formField.vaType} onChange={this.changeHandler} required>
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
                           <label htmlFor="engagementType">Type of Engagement *</label>
                           <Input type="select" name="engagementType" id="engagementType" className="form-control" value={formField.engagementType} onChange={this.changeHandler} required>
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
                              e.g. Project Based - 2 Weeks, 1 Month etc. <br />
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
                     <Col md={"6"}>
                        <FormGroup> 
                           <Label htmlFor="totalWeekHours">How many hours you need a day from monday to friday?</Label>
                           <Input type="number" id="totalWeekHours" className="form-control" name="totalWeekHours" value={formField.totalWeekHours} onChange={this.changeHandler}  />
                        </FormGroup>
                     </Col>
                     <Col md={"6"}>
                        <FormGroup> 
                           <Label htmlFor="skillSet">What Hours?</Label>
                           <Input type="text" id="weekHours" className="form-control" name="weekHours" placeholder="2pm -6pm" value={formField.weekHours} onChange={this.changeHandler}  />
                        </FormGroup>
                     </Col>        
                     <Col md={"12"}>
                        <div className="form-group pull-right">
                           <Button color="primary" className="btn btn-primary btn-lg" type="submit">Submit</Button>
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

export default intakeForm;
