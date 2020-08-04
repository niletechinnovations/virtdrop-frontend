import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import { FormErrors } from '../../Formerrors/Formerrors';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Loader from '../../Loader/Loader';
import OrganizationData from './OrganizationData';
import './Organization.css'

class Organization extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,      
      organizationList: [],
      loading: true,
      rowIndex: -1,
      changeStatusBtn:'',
      formProccessing: false,
      formField: {organization_name: '', email: '', first_name: '', last_name: '', mobileNumber:'', phoneNumber: '', address: '', address2:'', city:'', state:'', country:'', postalCode:'' },
      formErrors: {organization_name: '', email: '', first_name: '', last_name: '', error: ''},
      formValid: false,
      filterItem: { filter_organization_id: '', filterOrgName: '', filterLocation: '', filterFrom:'',  filterTo:'', filterStatus:'', custom_search: ''},
    } 
    this.handleEditOrganization = this.handleEditOrganization.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleDeleteOrganization = this.handleDeleteOrganization.bind(this);
    this.filterOragnizationList = this.filterOragnizationList.bind(this);
  }
  // Fetch the organization List
  componentDidMount() { 
    this.organizationList();
  }
  /*organization List API*/
  organizationList(filterItem = {}) {
    let organizationQuery = "?pageSize=10000";
    console.log(filterItem);
    if(filterItem.filterOrgName !== undefined && filterItem.filterOrgName !== "" ) 
      organizationQuery += (organizationQuery !=="" ) ? "&organizationName="+filterItem.filterOrgName: "?organizationName="+filterItem.filterOrgName;
    if(filterItem.filterLocation !== undefined && filterItem.filterLocation !== "" ) 
      organizationQuery += (organizationQuery !=="" ) ? "&location="+filterItem.filterLocation: "?location="+filterItem.filterLocation;
    if(filterItem.custom_search !== undefined && filterItem.custom_search !== "" ) 
      organizationQuery += (organizationQuery !=="" ) ? "&emailOrName="+filterItem.custom_search: "?emailOrName="+filterItem.custom_search;
    if(filterItem.filterFrom !== undefined && filterItem.filterFrom !== "" ){
      let newFromDate = this.getFormatDate( filterItem.filterFrom );
      organizationQuery += (organizationQuery !=="" ) ? "&start_date="+newFromDate : "?start_date="+newFromDate;
    }
    if(filterItem.filterTo !== undefined && filterItem.filterTo !== "" ){
      let newToDate = this.getFormatDate( filterItem.filterTo );
      organizationQuery += (organizationQuery !=="" ) ? "&end_date="+newToDate: "?end_date="+newToDate;
    }
    if(filterItem.filterStatus !== undefined && filterItem.filterStatus !== "" ) 
      organizationQuery += (organizationQuery !=="" ) ? "&status="+filterItem.filterStatus: "?status="+filterItem.filterStatus;
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('organization'+organizationQuery)
        .then( res => {
           
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }   

          this.setState({loading:false, organizationList: res.data.data.profileList});     
         
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }else {
            this.setState( { loading: false } );
            toast.error(err.message);
          }
        } )
    } )
  }
  /* Submit Form Handler*/
  submitHandler (event) {
    event.preventDefault();
    event.target.className += " was-validated";
    this.setState( { formProccessing: true}, () => {
      const formInputField = this.state.formField;
      const formData = {
        "email": formInputField.email,
        "firstName": formInputField.first_name, 
        "lastName": formInputField.last_name, 
        "mobileNumber": formInputField.mobileNumber, 
        "phoneNumber": formInputField.phoneNumber, 
        "organizationName": formInputField.organization_name,
        "address": formInputField.address,
        "address2": formInputField.address2,
        "city": formInputField.city,
        "state": formInputField.state,
        "country": formInputField.country,
        "postalCode": formInputField.postalCode
      };
      
      if(this.state.address)
        formData['address'] = this.state.address;
      
      if(this.state.address2)
        formData['address2'] = this.state.address2;
      
      if(this.state.country)
        formData['country'] = this.state.country;
      
      const rowIndex = this.state.rowIndex;
      if(rowIndex > -1) {
       const organizationInfo = this.state.organizationList[rowIndex];
       formData['profileId'] = organizationInfo.profileId;
        commonService.putAPIWithAccessToken('organization', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {           
            this.setState( { formProccessing: false} );
            toast.error(res.data.message);
            return;
          } 
          this.setState({ modal: false, formProccessing: false});
          toast.success(res.data.message);
          this.organizationList();
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }else{
            this.setState( { formProccessing: false } );
            toast.error(err.message);
          }
        } )
      }
      else{
        commonService.postAPIWithAccessToken('organization', formData)
        .then( res => {           
          if ( undefined === res.data.data || !res.data.status ) { 
            this.setState( { formProccessing: false} );
            toast.error(res.data.message);
            return;
          } 
          this.setState({ modal: false});
          toast.success(res.data.message);
          this.organizationList();        
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }else{
            this.setState( { formProccessing: false } );
            toast.error(err.message);
          }
        } )
      }
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
      case 'organization_name':        
        fieldValidationErrors.organization_name = (value !== '') ? '' : ' is required';
        break; 
      case 'email':        
        fieldValidationErrors.email = (value !== '') ? '' : ' is required';
        break; 
      case 'first_name':        
        fieldValidationErrors.contact_person = (value !== '') ? '' : ' is required';
        break; 
      case 'last_name':
        fieldValidationErrors.contact_person = (value !== '') ? '' : ' is required';
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
      (formErrors.organization_name === ""  && formErrors.email === "" && formErrors.first_name === "" && formField.organization_name !== "" && formField.first_name !== "" && formField.email !== "") 
      ? true : false});
  }
  /* Set Error Class*/
  errorClass(error) {
    return(error.length === 0 ? '' : 'has-error');
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      rowIndex: -1,
      changeStatusBtn: '',
      formValid: false,
      formField: {organization_name: '', email: '', first_name: '', last_name: '', mobileNumber:'', phoneNumber: '', address: '', address2:'', city:'', state:'', country:'', postalCode:'' },
      formErrors: {organization_name: '', email: '', first_name: '', last_name: '', error: ''}
    });
  }
  /* Edit organization*/
  handleEditOrganization(rowIndex){
      const organizationInfo = this.state.organizationList[rowIndex];
      const formField = {
        organization_name: organizationInfo.organizationName,
        email: organizationInfo.email, 
        first_name: organizationInfo.firstName, 
        last_name: organizationInfo.lastName, 
        phoneNumber: organizationInfo.phoneNumber,
        mobileNumber: organizationInfo.mobileNumber,
        address: organizationInfo.address,
        address2: organizationInfo.address2,
        city: organizationInfo.city,
        state: organizationInfo.state,
        country: organizationInfo.country,
        postalCode: organizationInfo.postalCode
      };
      const statusBtn = <Button type="button" size="sm" className={`changeStatusBtn `+( organizationInfo.status ? 'btn-danger' : 'btn-success' )} onClick={() => 
        this.changeProfileStatus(organizationInfo.profileId, organizationInfo.status )} >{ ( organizationInfo.status ? 'De-Activate Account' : 'Activate Account' )}</Button>
      
      this.setState({rowIndex: rowIndex, formField: formField, modal: true, changeStatusBtn:statusBtn, formValid: true});
  }

  /* Change Profile status*/
  changeProfileStatus(profileId,status){
    this.setState( { loading: true}, () => {
      const formData = {
        "profileId": profileId,
        "status": (status ? false : true ),
      };
      commonService.putAPIWithAccessToken('organization/status', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {           
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          } 
          this.setState({ modal: false, loading: false});
          toast.success(res.data.message);
          this.organizationList();        
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
  }

  /* Delete organization*/
  handleDeleteOrganization(rowIndex){

    const orgInfo = this.state.organizationList[rowIndex];
    //console.log(orgInfo);return;
    let formdata = { "profileId":orgInfo.profileId }

    this.setState( { loading: true}, () => {
      commonService.deleteAPIWithAccessToken( 'organization',formdata)
        .then( res => {
          this.setState({loading: false});
          if ( undefined === res.data || !res.data.status ) {            
             toast.error(res.data.message);      
            return;
          }         
          toast.success(res.data.message);
          this.organizationList();
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
    })
    
  }
  filterOragnizationList(){
    const filterItem = this.state.filterItem;
    this.organizationList(filterItem);
  }
  
  changeFilterHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    const filterItem = this.state.filterItem
    filterItem[name] = value;
    this.setState({ filterItem: filterItem });
  };
  

  setFilterFromDate = date => {
    let filterFormField = this.state.filterItem;
    filterFormField.filterFrom = date;
    this.setState({ filterItem: filterFormField });
  };
  setFilterToDate = date => {
    let filterFormField = this.state.filterItem;
    filterFormField.filterTo = date;
    this.setState({ filterItem: filterFormField });
  };

  resetfilterOragnization = () => {
    this.setState({
      filterItem: { filter_organization_id: '', filterOrgName: '', filterMobile: '', filterFrom:'',  filterTo:'', filterStatus:'', custom_search: ''}
    });
    this.organizationList();
  }
  
  getFormatDate(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 101).toString().substring(1);
    var day = (date.getDate() + 100).toString().substring(1);
    return year + "-" + month + "-" + day;
  }

  render() {
    
    const { organizationList, loading, modal, formProccessing, changeStatusBtn, filterItem } = this.state;     
    let loaderElement = '';
    if(loading)        
      loaderElement = <Loader />
    const processingBtnText = <>Submit <i className="fa fa-spinner"></i></>;
    
    return (
      <div className="animated fadeIn">
        <Row>
          
          {loaderElement}
          <Col lg={12}>
            <Card>
              <CardHeader className="mainHeading">
                <strong>VA Clients List</strong>
                {/* <Button color="primary" className="categoryAdd" type="button" onClick={this.toggle}><i className="fa fa-plus"></i> Add New</Button> */}
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md={12}>
                    <Row className="filterRow">                      
                      <Col md={"2"} className="pl-3">
                        <FormGroup>
                          <Label htmlFor="filterOrgName">Organization</Label>
                          <Input id="filterOrgName" name="filterOrgName" placeholder="Organization Name" value={this.state.filterItem.filterOrgName}  onChange={this.changeFilterHandler} />
                        </FormGroup>  
                      </Col>
                      <Col md={"2"}>
                        <FormGroup> 
                          <Label htmlFor="custom_search">Email ID / Name</Label>
                          <Input type="text" placeholder="Search By Email ID / Name" id="custom_search" name="custom_search" value={this.state.filterItem.custom_search} onChange={this.changeFilterHandler} />
                        </FormGroup>  
                      </Col>
                      <Col md={"2"}>
                        <FormGroup> 
                          <Label htmlFor="filterMobile">Mobile no.</Label>
                          <Input type="text" placeholder="Search By Mobile no." name="filterMobile" value={this.state.filterItem.filterMobile} onChange={this.changeFilterHandler} />
                        </FormGroup>  
                      </Col>
                      <Col md={"1"}>
                        <FormGroup> 
                          <Label>Status</Label>
                          <Input type="select" name="filterStatus" value={filterItem.filterStatus} onChange={this.changeFilterHandler}>
                            <option value="">All</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </Input>
                        </FormGroup>  
                      </Col>
                      <Col md={"2"}>
                        <FormGroup> 
                          <Label>Date From</Label>
                          <DatePicker className="form-control" selected={ filterItem.filterFrom } onChange={this.setFilterFromDate} dateFormat="MM/dd/yyyy" />
                        </FormGroup>  
                      </Col>
                      <Col md={"2"}>
                        <FormGroup> 
                          <Label>Date To</Label>
                          <DatePicker className="form-control" selected={ filterItem.filterTo } onChange={this.setFilterToDate} dateFormat="MM/dd/yyyy" />
                        </FormGroup>  
                      </Col>
                      <Col md={"1"} className="p-0">
                        <FormGroup> 
                          <Label>&nbsp;</Label><br />
                          <Button color="success" type="button" size="sm" onClick={this.filterOragnizationList}><i className="fa fa-search"></i></Button>&nbsp;
                          <Button color="danger" type="reset" size="sm" onClick={this.resetfilterOragnization}><i className="fa fa-refresh"></i></Button>
                        </FormGroup>             
                      </Col>
                    </Row>  
                  </Col>
                  <Col lg={12}>
                    <OrganizationData data={organizationList} editOrganizationAction={this.handleEditOrganization} deleteOrganizationAction={this.handleDeleteOrganization} dataTableLoadingStatus = {this.state.loading} />
                  </Col>  
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={modal} toggle={this.toggle} className="full-width-modal-section organization-modal">
          <ModalHeader toggle={this.toggle}>Member Info</ModalHeader>
          <Form onSubmit={this.submitHandler} noValidate>
            <ModalBody>
              <FormErrors formErrors={this.state.formErrors} />
              <Row>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="first_name">First Name</Label>            
                    <Input type="text" placeholder="First Person *" id="first_name" name="first_name" value={this.state.formField.first_name} onChange={this.changeHandler} required />
                  </FormGroup>
                </Col>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="last_name">Last Name</Label>            
                    <Input type="text" placeholder="Last Person *" id="last_name" name="last_name" value={this.state.formField.last_name} onChange={this.changeHandler} />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="organization_name">Organization Name</Label>            
                    <Input type="text" placeholder="Organization Name *" id="organization_name" name="organization_name" value={this.state.formField.organization_name} onChange={this.changeHandler} required />
                  </FormGroup>
                </Col>  
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="email">Email</Label>            
                    <Input type="text" placeholder="Email *" id="email" name="email" value={this.state.formField.email} onChange={this.changeHandler} required />
                  </FormGroup>
                </Col>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="mobileNumber">Mobile Number</Label>            
                    <Input type="text" placeholder="Personal Contact Number " id="mobileNumber" name="mobileNumber" value={this.state.formField.mobileNumber} onChange={this.changeHandler}  />
                  </FormGroup>
                </Col>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="phoneNumber">Business Phone</Label>            
                    <Input type="text" placeholder="Business Contact Number" id="phoneNumber" name="phoneNumber" value={this.state.formField.phoneNumber} onChange={this.changeHandler}  />
                  </FormGroup>
                </Col>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="address">Street Address </Label>            
                    <Input type="text" placeholder="Street Address Line 1" id="address" name="address" value={this.state.formField.address} onChange={this.changeHandler}  />
                  </FormGroup>
                </Col>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="address2">Street Address Line 2 </Label>            
                    <Input type="text" placeholder="Street Address Line 2" id="address2" name="address2" value={this.state.formField.address2} onChange={this.changeHandler} />
                  </FormGroup>
                </Col>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="city">City </Label>            
                    <Input type="text" placeholder="City" id="city" name="city" value={this.state.formField.city} onChange={this.changeHandler}  />
                  </FormGroup>
                </Col>
                <Col md={"6"}>  
                  <FormGroup>
                    <Label htmlFor="state">State</Label>            
                    <Input type="text" placeholder="State" id="state" name="state" value={this.state.formField.state} onChange={this.changeHandler} />
                  </FormGroup>
                </Col>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="postalCode">Postal Code </Label>            
                    <Input type="text" placeholder="Postal Code" id="postalCode" name="postalCode" value={this.state.formField.postalCode} onChange={this.changeHandler}  />
                  </FormGroup>
                </Col>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="country">Country </Label>            
                    <Input type="text" placeholder="Country" id="country" name="country" value={this.state.formField.country} onChange={this.changeHandler} />
                  </FormGroup>
                </Col>
              </Row>           
            </ModalBody>
            <ModalFooter>
              {changeStatusBtn}
              <Button color="primary" disabled={!this.state.formValid || formProccessing} type="submit">{formProccessing ? processingBtnText : 'Save Changes' }</Button>
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>

    )
  }
}

export default Organization;
