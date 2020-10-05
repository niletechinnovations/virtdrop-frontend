import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import  { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../../core/services/commonService';
import { FormErrors } from '../../../Formerrors/Formerrors';
import Loader from '../../../Loader/Loader';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VaRequestData from './VaRequestData';
import './VaRequest.css'


class VaRequestListing extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,      
      itemList: [],
      organizationList: [],
      loading: true,
      formProccessing: false,
      rowIndex: -1,
      formField: { organizationId: '', vaRequestId:'', vaType: '', natureOfBusiness: '', engagementType:'', engagementDescription: '', numberOfVA:'', skillSet:'', totalWeekHours:'', weekHours:'' },
      formErrors: { organizationId: '', vaType: '',  natureOfBusiness:'', engagementType:'', engagementDescription: '', error: ''},
      formValid: false,
      filterItem: { filter_organization_id: '', filterVaType: '', filterEngagementType: '', filterRating:'', filter_address:'', filterFrom:'',  filterTo:'', filterStatus:'', custom_search: '' },
    } 
    this.submitHandler = this.submitHandler.bind(this);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.filterItemList = this.filterItemList.bind(this);
    this.handleEditItem = this.handleEditItem.bind(this);
  }
  
  componentDidMount() { 
    const { match: { params } } = this.props;
    let organizationId = "";
    if(params.organizationId !== undefined) {
      organizationId = params.organizationId;
      let filterItem = this.state.filterItem;
      filterItem.filter_organization_id = params.organizationId;
      this.setState({filterItem: filterItem});
    }
    this.itemList({filter_organization_id: organizationId});
    this.organizationList();
  }

  /*VA Request List API*/
  itemList(filterItem = {}) {
    let filterQuery = "?pageSize=10000";
    if(filterItem.filter_organization_id !== undefined && filterItem.filter_organization_id !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&organizationAuthId="+filterItem.filter_organization_id: "&organizationAuthId="+filterItem.filter_organization_id;
    if(filterItem.filterVaType !== undefined && filterItem.filterVaType !== "" ) 
     filterQuery += (filterQuery !=="" ) ? "&vaType="+filterItem.filterVaType: "&vaType="+filterItem.filterVaType;
    if(filterItem.filterEngagementType !== undefined && filterItem.filterEngagementType !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&engagementType="+filterItem.filterEngagementType: "&engagementType="+filterItem.filterEngagementType;
    if(filterItem.filterFrom !== undefined && filterItem.filterFrom !== "" ){
      let newFromDate = this.getFormatDate( filterItem.filterFrom );
      filterQuery += (filterQuery !=="" ) ? "&start_date="+newFromDate : "?start_date="+newFromDate;
    }
    if(filterItem.filterTo !== undefined && filterItem.filterTo !== "" ){
      let newToDate = this.getFormatDate( filterItem.filterTo );
      filterQuery += (filterQuery !=="" ) ? "&end_date="+newToDate: "?end_date="+newToDate;
    }
    if(filterItem.filterStatus !== undefined && filterItem.filterStatus !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&status="+filterItem.filterStatus: "?status="+filterItem.filterStatus;
    
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('va-request'+filterQuery)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }
          this.setState({loading:false, itemList: res.data.data.requestList});
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

  /*Organization List API*/
  organizationList() {
    commonService.getAPIWithAccessToken('organization?pageSize=10000')
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
        }else 
          this.setState( { loading: false } );
      } )
  }

  filterItemList(){
    const filterItem = this.state.filterItem;
    this.itemList(filterItem);
  }

  /* Submit Form Handler*/
  submitHandler (event) {
    event.preventDefault();
    event.target.className += " was-validated";
    this.setState( { formProccessing: true}, () => {
      const formInputField = this.state.formField;
      const formData = {
        "organizationId": formInputField.organizationId,
        "vaType": formInputField.vaType,
        "natureOfBusiness": formInputField.natureOfBusiness,
        "engagementType": formInputField.engagementType,
        "engagementDescription": formInputField.engagementDescription,
        "numberOfVA": formInputField.numberOfVA,
        "skillSet": formInputField.skillSet,
        "totalWeekHours": formInputField.totalWeekHours,
        "weekHours": formInputField.weekHours
      };
      const rowIndex = this.state.rowIndex;
      if(rowIndex > -1) {
        formData['vaRequestId'] = formInputField.vaRequestId;
       
        commonService.putAPIWithAccessToken('va-request', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { formProccessing: false} );
            toast.error(res.data.message);
            return;
          }
          this.setState({ modal: false, formProccessing: false});
          toast.success(res.data.message);
          this.itemList(); 
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
      }else{
        commonService.postAPIWithAccessToken('va-request', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) { 
            this.setState( { formProccessing: false} );
            toast.error(res.data.message);
            return;
          }           
          this.setState({ modal: false});
          toast.success(res.data.message);
          this.itemList();
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

  changeFilterHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    const filterItem = this.state.filterItem
    filterItem[name] = value;
    this.setState({ filterItem: filterItem });
  };

  /* Validate Form Field */
  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    fieldValidationErrors.error = '';
   
    switch(fieldName) {      
      case 'organizationId':        
        fieldValidationErrors.organizationId = (value !== '') ? '' : ' is required';
        break;
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
      (formErrors.vaType === "" && formField.vaType !== "") 
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
      formValid: false,
      formField: { organizationId: '', vaRequestId:'', vaType: '', natureOfBusiness: '', engagementType:'', engagementDescription: '', numberOfVA:'', skillSet:'', totalWeekHours:'', weekHours:'' },
      formErrors: {organizationId: '', vaType: '', natureOfBusiness: '', engagementType:'', error: ''}
    });
  }

  handleEditItem(rowIndex){
    const itemInfo = this.state.itemList[rowIndex];
    const formField = {
      vaRequestId: itemInfo.vaRequestId, 
      organizationId: itemInfo.organizationId,
      vaType: itemInfo.vaType, 
      natureOfBusiness: itemInfo.natureOfBusiness, 
      engagementType: itemInfo.engagementType,
      engagementDescription: itemInfo.engagementDescription,
      skillSet: itemInfo.skillSet,
      numberOfVA: itemInfo.numberOfVA,
      totalWeekHours: itemInfo.totalWeekHours,
      weekHours: itemInfo.weekHours,
      status: itemInfo.status,
    };
    const statusBtn = <Button type="button" size="sm" className={`changeStatusBtn `+( itemInfo.status ? 'btn-danger' : 'btn-success' )} onClick={() => 
      this.changeProfileStatus(itemInfo.vaRequestId, itemInfo.status )} >{ ( itemInfo.status ? 'De-Activate Account' : 'Activate Account' )}</Button>
    
    this.setState({rowIndex: rowIndex, formField: formField, modal: true, changeStatusBtn:statusBtn, formValid: true});
  }
  
  /* Delete Record*/
  handleDeleteItem(rowIndex){
    const requestInfo = this.state.itemList[rowIndex];
    let formdata = { "vaRequestId":requestInfo.vaRequestId }

    this.setState( { loading: true}, () => {
      commonService.deleteAPIWithAccessToken( 'va-request',formdata)
        .then( res => {
          this.setState({loading: false});
          if ( undefined === res.data || !res.data.status ) {            
             toast.error(res.data.message);      
            return;
          }         
          toast.success(res.data.message);
          this.itemList();
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

  // Set address, latitude and longitude
  setLatitudeLongitude(address, latLng){
    this.setState({ latitude:latLng.lat, longitude:latLng.lng, address: address })
  }
  
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

  resetfilterForm = () => {
    this.setState({
      filterItem: { filter_organization_id: '', filterVaType: '', filterEngagementType:'', filterFrom:'',  filterTo:'', filterStatus:'' }
    });
    this.itemList();
  }
  
  getFormatDate(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 101).toString().substring(1);
    var day = (date.getDate() + 100).toString().substring(1);
    return year + "-" + month + "-" + day;
  }

  render() {

    const role = localStorage.getItem( 'role' );
    if(role === "recruitmentTeam"){
       return ( <Redirect to={`/admin/va-application`} noThrow /> )
    } else {

      const { itemList, loading, modal, formProccessing, organizationList, filterItem } = this.state;

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
                  <strong>VA Request List</strong> <Button color="primary" className="categoryAdd" type="button" onClick={this.toggle}><i className="fa fa-plus"></i> Add VA Request</Button>
                </CardHeader>
                <CardBody>
                  
                  <Row>
                    <Col md={12}>
                      <Row className="filterRow">                      
                        <Col md={"2"} className="pl-3">
                          <FormGroup> 
                            <Label htmlFor="filter_organization_id">Organization</Label>            
                            <Input type="select" placeholder="Organization *" id="filter_organization_id" name="filter_organization_id" value={filterItem.filter_organization_id} onChange={this.changeFilterHandler} >
                              <option value="">All</option>
                              {organizationList.map((organizationInfo, index) =>
                                <SetOrganizationDropDownItem key={index} organizationInfo={organizationInfo} />
                              )}
                            </Input>
                          </FormGroup> 
                        </Col>
                        <Col md={"2"}>
                          <FormGroup> 
                            <Label htmlFor="filterVaType">Type of VA</Label>
                            <Input type="select" name="filterVaType" id="filterVaType" value={filterItem.filterVaType} onChange={this.changeFilterHandler}>
                              <option value="">All</option>
                              <option value="1">Business Support</option>
                              <option value="2">Personal Assistance</option>
                            </Input>
                          </FormGroup>
                        </Col>
                        <Col md={"2"}>
                          <FormGroup> 
                            <Label htmlFor="filterEngagementType">Type of engagement</Label>            
                            <Input type="select" name="filterEngagementType" id="filterEngagementType" value={filterItem.filterEngagementType} onChange={this.changeFilterHandler}>
                              <option value="">All</option>
                              <option value="1">Project-Based</option>
                              <option value="2">Ongoing Task</option>
                            </Input>
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
                            <Button color="success" type="button" size="sm" onClick={this.filterItemList} title="Filter VA Request"><i className="fa fa-search"></i></Button>&nbsp;
                            <Button color="danger" type="reset" size="sm" onClick={this.resetfilterForm} title="Reset Fields"><i className="fa fa-refresh"></i></Button>
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={12}>
                      <VaRequestData data={itemList} editItemAction={this.handleEditItem} deleteItemAction={this.handleDeleteItem} dataTableLoadingStatus = {this.state.loading} />
                    </Col>
                  </Row> 
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Modal isOpen={modal} toggle={this.toggle} className="full-width-modal-section store-modal">
            <ModalHeader toggle={this.toggle}>Add New VA Request</ModalHeader>
            <Form onSubmit={this.submitHandler} noValidate>
              <ModalBody>
                <FormErrors formErrors={this.state.formErrors} />
                <Row>
                  <Col md={"6"}>
                    <FormGroup> 
                      <Label htmlFor="organizationId">Organization</Label>            
                      <Input type="select" placeholder="Organization *" id="organizationId" name="organizationId" value={this.state.formField.organizationId} onChange={this.changeHandler} required >
                        <option value="">Select Organization</option>
                        {organizationList.map((organizationInfo, index) =>
                          <SetOrganizationDropDownItem key={index} organizationInfo={organizationInfo} />
                        )}
                      </Input>
                    </FormGroup>  
                  </Col>
                  <Col md={"6"}>
                    <FormGroup>
                      <label htmlFor="vaType">Type of Virtual Assistance *</label>
                      <Input type="select" name="vaType" id="vaType" className="form-control" value={this.state.formField.vaType} onChange={this.changeHandler} required>
                        <option value="1">Business Support</option>
                        <option value="2">Personal Assistance</option>
                      </Input>      
                    </FormGroup> 
                  </Col>
                  <Col md={"6"}>
                    <FormGroup> 
                      <Label htmlFor="natureOfBusiness">Nature of Business *</Label>            
                      <Input type="text" placeholder="Nature of Business" id="natureOfBusiness" name="natureOfBusiness" value={this.state.formField.natureOfBusiness} onChange={this.changeHandler}  />
                    </FormGroup>
                  </Col>
                  <Col md={"6"}>
                    <FormGroup> 
                      <label htmlFor="engagementType">Type of Engagement *</label>
                      <Input type="select" name="engagementType" id="engagementType" value={this.state.formField.engagementType} onChange={this.changeHandler} required>
                        <option value="1">Project-Based</option>
                        <option value="2">Ongoing Task</option>
                      </Input>
                    </FormGroup>  
                  </Col>
                  <Col md={"12"}>
                    <FormGroup> 
                      <Label htmlFor="engagementDescription">Engagement Description </Label>   
                      <Input type="textarea" name="engagementDescription" id="engagementDescription" value={this.state.formField.engagementDescription} onChange={this.changeHandler} required />
                    </FormGroup>
                  </Col>
                  <Col md={"6"}>
                    <FormGroup> 
                      <Label htmlFor="numberOfVA">How many VAs do you need?</Label>            
                      <Input type="number" id="numberOfVA" name="numberOfVA" value={this.state.formField.numberOfVA} onChange={this.changeHandler} />
                    </FormGroup>              
                  </Col>
                  <Col md={"6"}>
                    <FormGroup> 
                      <Label htmlFor="skillSet">Skill Sets and Other Requirements</Label>            
                      <Input type="text" id="skillSet" name="skillSet" value={this.state.formField.skillSet} onChange={this.changeHandler} />
                    </FormGroup>              
                  </Col>
                  <Col md={"6"}>
                    <FormGroup> 
                      <Label htmlFor="totalWeekHours">How many hours need a day from monday-friday?</Label>            
                      <Input type="number" id="totalWeekHours" name="totalWeekHours" value={this.state.formField.totalWeekHours} onChange={this.changeHandler} />
                    </FormGroup>              
                  </Col>
                  <Col md={"6"}>
                    <FormGroup> 
                      <Label htmlFor="weekHours">What Hours?</Label>            
                      <Input type="text" id="weekHours" name="weekHours" placeholder="2pm -6pm" value={this.state.formField.weekHours} onChange={this.changeHandler} />
                    </FormGroup>              
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit">{formProccessing ? processingBtnText : 'Submit' }</Button>
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
              </ModalFooter>
            </Form>
          </Modal>
        </div>

      )
    }
  }
}

function SetOrganizationDropDownItem (props) {
  const organizationInfo = props.organizationInfo;
  return (<option value={organizationInfo.authId} >{organizationInfo.organizationName}</option>)
}

export default VaRequestListing;
