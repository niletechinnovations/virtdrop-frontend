import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, Input, FormGroup, Label} from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';

import Loader from '../../Loader/Loader';
import { FormErrors } from '../../Formerrors/Formerrors';

import './ChangePassword.css'

class ChangePassword extends Component {
  constructor(props){
    super(props);
    this.state = {
      formField: {old_password: '', new_password: '', confirm_password: ''},
      formErrors: {old_password: '', new_password: '', confirm_password: '', error: ''},
      formValid: false,
      loading: false,
    };
    this.submitHandler = this.submitHandler.bind(this);
  }

  /* Submit Form Handler*/
  submitHandler (event) {
    event.preventDefault();
    event.target.className += " was-validated";
    this.setState( { loading: true}, () => {
      const formInputField = this.state.formField;
      const formData = {
        "oldPassword": formInputField.old_password,
        "newPassword": formInputField.new_password
      };
      
      commonService.postAPIWithAccessToken('auth/change-password', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
           
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          }           
          this.setState({ loading: false, formField: {old_password: '', new_password: '', confirm_password: ''},
      formErrors: {old_password: '', new_password: '', confirm_password: '', error: ''}, formValid: false});
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
  };
  
  /* Validate Form Field */
  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    fieldValidationErrors.error = '';
   
    switch(fieldName) {         
      case 'old_password':        
        fieldValidationErrors.old_password = (value !== '') ? '' : ' is required';
        break;
      case 'new_password':        
        fieldValidationErrors.new_password = (value !== '') ? '' : ' is required';
        break;
      case 'confirm_password':        
        fieldValidationErrors.confirm_password = (value !== '') ? '' : ' is required';
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
    if(formField.new_password !== formField.confirm_password) {
      formErrors.error = "New password and confirm password deos not match!";
      this.setState({formValid: false, formErrors: formErrors});
      return 
    }
    this.setState({formValid: 
        (formErrors.confirm_password === ""  && formErrors.new_password === "" && formErrors.old_password === "" && formField.old_password !== "" && formField.new_password !== "" && formField.confirm_password !== "" ) 
      ? true : false});
  }
  /* Set Error Class*/
  errorClass(error) {
    return(error.length === 0 ? '' : 'has-error');
  }

  render() {

    const { loading, formField, formValid } = this.state;
    let loaderElement = '';
    if(loading)
      loaderElement = <Loader />

    return (
      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col lg={5}>
            <Card>
              <CardHeader className="mainHeading">
                <strong>Change Password</strong>
              </CardHeader>
              <CardBody>
                
                {loaderElement}
                <Form onSubmit={this.submitHandler} noValidate>                  
                  <FormErrors formErrors={this.state.formErrors} />
                  <FormGroup> 
                    <Label htmlFor="old_password">Old Password</Label>            
                    <Input value={formField.old_password} name="old_password" onChange={this.changeHandler} type="password" id="old_password" label="Old Password*" required />
                  </FormGroup>
                  <FormGroup> 
                    <Label htmlFor="new_password">New Password</Label>            
                    <Input value={formField.new_password} name="new_password" onChange={this.changeHandler} type="password" id="new_password" label="New Password*" required />
                  </FormGroup>
                  <FormGroup> 
                    <Label htmlFor="confirm_password">Confirm Password</Label>            
                    <Input value={formField.confirm_password} name="confirm_password" onChange={this.changeHandler} type="password" id="confirm_password" label="Confirm Password*" required />
                  </FormGroup>
                  
                
                  <Button color="primary"  disabled={!formValid} type="submit">Update</Button>
                  
                </Form>
                  
              </CardBody>
            </Card>
          </Col>
        </Row>        
      </div>

    )
  }
}

export default ChangePassword;
