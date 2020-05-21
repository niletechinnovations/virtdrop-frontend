import React, { Component } from 'react';
import { Button, Form, Input, Col, Row, FormGroup, Label} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';
import { FormErrors } from '../../Formerrors/Formerrors';

import "./MyProfile.css";

class MyProfile extends Component {
   constructor(props){
      super(props);
      this.state = {
         formField: { organizationName: '', email: '', firstName: '', lastName:'', mobileNumber:'', phoneNumber:'', address:'', address2:'', city:'', state:'', postalCode:'', country:'', profilePic:'' },
         formErrors: {organization_name: '', email: '', firstName: '', lastName: '', mobileNumber:'', phoneNumber:'', address:'', city:'', state:'', postalCode:'', country:'', error: ''},
         formValid: true,
         organizationId: "",
         invalidImage:'',
         loading: true
      };
      this.submitHandler = this.submitHandler.bind(this);
    }
    componentDidMount() { 
      this.getProfile();
    }
    /*get profile API*/
    getProfile() {   
  
      this.setState( { loading: true}, () => {
        commonService.getAPIWithAccessToken('profile')
          .then( res => {
  
            if ( undefined === res.data.data || !res.data.status ) {
              this.setState( { loading: false } );
              toast.error(res.data.message);
              return;
            }
            console.log(res.data); 
           
            const organizationInfo = res.data.data;
            const formField = {
               organizationName: organizationInfo.organizationName, 
              email: organizationInfo.email, 
              firstName: organizationInfo.firstName, 
              lastName: organizationInfo.lastName,
              phoneNumber: organizationInfo.phoneNumber, 
              mobileNumber: organizationInfo.mobileNumber, 
              address: organizationInfo.address, 
              address2: organizationInfo.address2, 
              profilePic: organizationInfo.profilePic,
              city: organizationInfo.city, 
              state: organizationInfo.state, 
              country: organizationInfo.country, 
              postalCode: organizationInfo.postalCode
            };

            if(organizationInfo.profilePic!=='')
              localStorage.setItem( 'profilePic', organizationInfo.profilePic );

            this.setState({loading:false, organizationDocuments:organizationInfo.documents, formField: formField, formValid: true, organizationId: organizationInfo.organizationId});
          } )
          .catch( err => {         
            if(err.response !== undefined && err.response.status === 401) {
              localStorage.clear();
              this.props.history.push('/login');
            }else
              this.setState( { loading: false } );
              toast.error(err.message);
          } )
      } )
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

   //To set profile image
   onProfilePicChange = (e) => {  
      if( e.target.files.length>0){
         const imageFile = e.target.files[0];
         if (!imageFile) {
            this.setState({ invalidImage: 'Please select image.' });
            return false;
         }
         
         if (!imageFile.name.match(/\.(jpg|jpeg|png|gif)$/)) {
            this.setState({ invalidImage: 'Please select valid image.' });
            return false;
         }
         this.setState( { loading: true}, () => {
            const formData = new FormData();
            formData.append('profileImage', imageFile );   
            formData.append('profileId', this.state.organizationId);
        
            commonService.putAPIWithAccessToken('profile/picture', formData)
            .then( res => {
               if ( undefined === res.data.data || !res.data.status ) {
                  this.setState( { loading: false} );
                  toast.error(res.data.message);
                  return;
               }
               this.setState({ loading: false});
               toast.success(res.data.message);
               this.getProfile();
            } )
            .catch( err => {         
               if(err.response !== undefined && err.response.status === 401) {
                  localStorage.clear();
                  this.props.history.push('/login');
               }else
               this.setState( { loading: false } );
               toast.error(err.message);
            } )
         } );   
      }
   }

  render() {
   const { loading, invalidImage } = this.state;
    let loaderElement = '';
    if(loading)
      loaderElement = <Loader />

    return (
      <div className="user-dashboard">
         <ToastContainer />
         {loaderElement}
        <div className="profile-form">
            <h3>My Profile</h3>
            <FormErrors formErrors={this.state.formErrors} />
            <Form onSubmit={this.submitHandler} noValidate>
               <div className="row">
                  <div className="col-md-6">
                     <div className="form-group">
                        <label htmlFor="firstName">First Name *</label>
                        <input type="text" name="firstName" id="firstName" className="form-control" placeholder="First Name" value={this.state.formField.firstName} onChange={this.changeHandler} required />
                     </div>
                     <div className="form-group">
                        <label htmlFor="lastName">Last Name *</label>
                        <input type="text" name="lastName" id="lastName" className="form-control" placeholder="Last Name" value={this.state.formField.lastName} onChange={this.changeHandler} required />
                     </div>
                  </div>
                  <div className="col-md-6">
                     <Row>
                        <Col md="4">
                           <img src={ ( this.state.formField.profilePic!=='' ? this.state.formField.profilePic : '/images/profile_image_dummy.svg' ) } height="100" className="img-fluid img-thumbnail" alt="Profile" />
                        </Col>
                        <Col md="6">
                           <FormGroup>
                              <label htmlFor="profilePic">Profile Picture</label>
                              <input type="file" id="profilePic" className="form-control" onChange={this.onProfilePicChange}  />
                              <small>The picture you upload here will be used as your Profile image on the Mobile app which the customer can view</small>
                              {invalidImage && <p className="text-danger">{invalidImage}</p>}
                           </FormGroup>
                        </Col>
                     </Row>
                  </div>
                  <div className="col-md-6">
                     <div className="form-group">
                        <label htmlFor="email">Email address *</label>
                        <input type="text" name="email" id="email" className="form-control" placeholder="Email address" value={this.state.formField.email} disabled required />
                     </div>
                  </div>
                  <Col md={"6"}>
                     <FormGroup>
                        <Label htmlFor="organizationName">Organization Name *</Label>
                        <input type="text" name="organizationName" className="form-control" placeholder="Organization Name" value={this.state.formField.organizationName} onChange={this.changeHandler} />
                     </FormGroup>
                  </Col>
                  <div className="col-md-6">
                     <div className="form-group">
                        <label htmlFor="mobileNumber">Mobile no. *</label>
                        <input type="text" name="mobileNumber" id="mobileNumber" className="form-control" placeholder="Mobile number" value={this.state.formField.mobileNumber} onChange={this.changeHandler} />
                     </div>
                  </div>
                  <div className="col-md-6">
                     <div className="form-group">
                        <label htmlFor="phoneNumber">Phone no. *</label>
                        <input type="text" name="phoneNumber" id="phoneNumber" className="form-control" placeholder="Phone No." value={this.state.formField.phoneNumber} onChange={this.changeHandler} />
                     </div>
                  </div>
                  <Col md={"6"}>
                     <FormGroup> 
                        <Label htmlFor="address">Address 1 *</Label>
                        <Input type="text" placeholder="Address" id="address" className="form-control" name="address" value={this.state.formField.address} onChange={this.changeHandler}  />
                     </FormGroup>
                  </Col>              
                  <Col md={"6"}>
                     <FormGroup> 
                        <Label htmlFor="address2">Address 2</Label>
                        <Input type="text" placeholder="Address 2" id="address2" className="form-control" name="address2" value={this.state.formField.address2} onChange={this.changeHandler}  />
                     </FormGroup>
                  </Col>              
                  <Col md={"6"}>
                     <FormGroup> 
                        <Label htmlFor="city">City *</Label>
                        <Input type="text" placeholder="City" id="city" className="form-control" name="city" value={this.state.formField.city} onChange={this.changeHandler}  />
                     </FormGroup>
                  </Col>              
                  <Col md={"6"}>
                     <FormGroup> 
                        <Label htmlFor="state">State *</Label>
                        <Input type="text" placeholder="State" id="state" className="form-control" name="state" value={this.state.formField.state} onChange={this.changeHandler}  />
                     </FormGroup>
                  </Col>              
                  <Col md={"6"}>
                     <FormGroup> 
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input type="text" placeholder="Postal Code" id="postalCode" className="form-control" name="postalCode" value={this.state.formField.postalCode} onChange={this.changeHandler}  />
                     </FormGroup>
                  </Col>              
                  <Col md={"6"}>
                     <FormGroup> 
                        <Label htmlFor="country">Country *</Label>
                        <Input type="text" placeholder="Country" id="country" className="form-control" name="country" value={this.state.formField.country} onChange={this.changeHandler}  />
                     </FormGroup>
                  </Col>              
                  <Col md={"12"}>
                     <div className="form-group pull-right">
                        <Button color="primary" className="btn btn-primary btn-lg" type="submit">Update Profile</Button>
                     </div>
                  </Col>
               </div>
            </Form>
         </div>
      </div>
    );
  }
}

export default MyProfile;
