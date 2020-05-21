import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../../core/services/commonService';
import { FormErrors } from '../../../Formerrors/Formerrors';

import Loader from '../../../Loader/Loader';
import FoodTruckData from './FoodTruckData';
import './FoodTruck.css'

class OrgFoodTruckList extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,      
      storeList: [],
      organizationList: [],
      loading: true,
      formProccessing: false,
      rowIndex: -1,
      formField: { organizationId: '', store_name: '', phoneNumber: '', address: '', city: '', state: '', country: '', postalCode: ''},
      formErrors: { store_name: '', error: ''},
      formValid: false,
      filterItem: { filter_organization_id: '', country: '', state: '', custom_search: ''},
    } 
    this.handleEditStore = this.handleEditStore.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleDeleteStore = this.handleDeleteStore.bind(this);
    this.filterTruckList = this.filterTruckList.bind(this);
    
  }
  // Fetch the Employee List
  componentDidMount() { 
    const { match: { params } } = this.props;
    let organizationId = "";
    if(params.organizationId !== undefined) {
      organizationId = params.organizationId;
      let filterItem = this.state.filterItem;
      filterItem.filter_organization_id = params.organizationId;
      this.setState({filterItem: filterItem});
    }
    this.foodTruckList({filter_organization_id: organizationId});
    this.organizationList();
    
  }
  /*Food Truck List API*/
  foodTruckList(filterItem = {}) {
    let stroreWalkQuery = "";
    if(filterItem.filter_organization_id !== undefined && filterItem.filter_organization_id !== "" ) 
      stroreWalkQuery += (stroreWalkQuery !=="" ) ? "&organizationId="+filterItem.filter_organization_id: "?organizationId="+filterItem.filter_organization_id;
    if(filterItem.country !== undefined && filterItem.country !== "" ) 
      stroreWalkQuery += (stroreWalkQuery !=="" ) ? "&country="+filterItem.country: "?country="+filterItem.country;
    if(filterItem.state !== undefined && filterItem.state !== "" ) 
      stroreWalkQuery += (stroreWalkQuery !=="" ) ? "&state="+filterItem.state: "?state="+filterItem.state;
    if(filterItem.custom_search !== undefined && filterItem.custom_search !== "" ) 
      stroreWalkQuery += (stroreWalkQuery !=="" ) ? "&keyword="+filterItem.custom_search: "?keyword="+filterItem.custom_search;
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('food-truck?pageSize=10000'+stroreWalkQuery)
        .then( res => {
          
           
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }   

          this.setState({loading:false, storeList: res.data.data.truckList});     
         
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }
          else {
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
        }
        else 
          this.setState( { loading: false } );
      } )
    
  }
  filterTruckList(){
    const filterItem = this.state.filterItem;
    this.foodTruckList(filterItem);
  }
  /* Submit Form Handler*/
  submitHandler (event) {
    event.preventDefault();
    event.target.className += " was-validated";
    this.setState( { formProccessing: true}, () => {
      const formInputField = this.state.formField;
      const formData = {       
        "storeName": formInputField.store_name, 
        "phoneNumber": formInputField.phoneNumber, 
        "address": formInputField.address, 
        "city": formInputField.city, 
        "state": formInputField.state, 
        "country": formInputField.country, 
        "postalCode": formInputField.postalCode,
        "organizationId": formInputField.organizationId         
      };
      const rowIndex = this.state.rowIndex;
      if(rowIndex > -1) {
        const storeInfo = this.state.storeList[rowIndex];

        commonService.putAPIWithAccessToken('store/'+storeInfo.storeId, formData)
        .then( res => {
          
           
          if ( undefined === res.data.data || !res.data.status ) {
           
            this.setState( { formProccessing: false} );
            toast.error(res.data.message);
            return;
          } 
          
          this.setState({ modal: false, formProccessing: false});
          toast.success(res.data.message);
          this.storeList();
         
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }
          else
            this.setState( { formProccessing: false } );
            toast.error(err.message);
        } )
      }
      else{
        commonService.postAPIWithAccessToken('store', formData)
        .then( res => {
         
          if ( undefined === res.data.data || !res.data.status ) { 
            this.setState( { formProccessing: false} );
            toast.error(res.data.message);
            return;
          } 
          
          this.setState({ modal: false});
          toast.success(res.data.message);
          this.storeList();
         
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }
          else
            this.setState( { formProccessing: false } );
            toast.error(err.message);
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
      
      case 'store_name':        
        fieldValidationErrors.store_name = (value !== '') ? '' : ' is required';
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
      (formErrors.store_name === "" && formField.store_name !== "") 
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
      formField: { store_name: '', phoneNumber: '', address: '', city: '', state: '', country: '', postalCode: '' },
      formErrors: {store_name: '', error: ''}
    });
  }
  /* Edit Employee*/
  handleEditStore(rowIndex){
      const storeInfo = this.state.storeList[rowIndex];
      const formField = {
        organizationId: storeInfo.organizationId, 
        store_name: storeInfo.storeName, 
        phoneNumber: storeInfo.phoneNumber, 
        address: storeInfo.address, 
        city: storeInfo.city, 
        state: storeInfo.state, 
        country: storeInfo.country, 
        postalCode: storeInfo.postalCode };
      this.setState({rowIndex: rowIndex, formField: formField, modal: true, formValid: true});
  }
  /* Delete Employee*/
  handleDeleteStore(rowIndex){
   
    
   
    
  }
  
  render() {

    const { storeList, loading, modal, formProccessing, organizationList } = this.state;     
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
                <strong>Food Truck List</strong> <Button color="primary" className="categoryAdd" type="button" onClick={this.toggle}><i className="fa fa-plus"></i> Add New</Button>
              </CardHeader>
              <CardBody>
                
                <Row>
                  <Col md={12}>
                    <Row>
                      <Col md={"3"}>
                        <FormGroup> 
                          <Label htmlFor="filter_organization_id">Organization</Label>            
                          <Input type="select" placeholder="Organization *" id="filter_organization_id" name="filter_organization_id" value={this.state.filterItem.filter_organization_id} onChange={this.changeFilterHandler} >
                            <option value="">Select Organization</option>
                            {organizationList.map((organizationInfo, index) =>
                              <SetOrganizationDropDownItem key={index} organizationInfo={organizationInfo} />
                            )}
                          </Input>
                        </FormGroup>  
                      </Col>
                      <Col md={"2"}>
                        <FormGroup> 
                          <Label htmlFor="filterFoodTruckName">Food Truck Name</Label>
                          <Input type="text" placeholder="Search by Food Truck Name" id="filterFoodTruckName" name="filterFoodTruckName" value={this.state.formField.filterFoodTruckName} onChange={this.changeFilterHandler} />   
                        </FormGroup>  
                      </Col>
                      <Col md={"2"}>
                        <FormGroup> 
                          <Label htmlFor="filterFoodTruckOwner">Food Truck Name</Label>
                          <Input type="text" placeholder="Search by Owner Name" id="filterFoodTruckOwner" name="filterFoodTruckOwner" value={this.state.formField.filterFoodTruckOwner} onChange={this.changeFilterHandler} />   
                        </FormGroup>  
                      </Col>
                      <Col md={"3"}>
                        <FormGroup> 
                          <Label htmlFor="filter_organization_id">Search by Location</Label>            
                          <Input type="text" placeholder="Search by Address/ Location" id="custom_search" name="custom_search" value={this.state.formField.custom_search} onChange={this.changeFilterHandler} />
                        </FormGroup>  
                      </Col>
                      <Col md={"2"}>
                        <FormGroup className="filter-button-section"> 
                          <Label htmlFor="filter_organization_id">&nbsp;</Label>
                          <Button color="success" type="button" onClick={this.filterTruckList}>Search</Button> 
                        </FormGroup>             
                      </Col>
                    </Row>  
                  </Col>
                  <Col md={12}>
                    <FoodTruckData data={storeList} editStoreAction={this.handleEditStore} deleteStoreAction={this.handleDeleteStore} dataTableLoadingStatus = {this.state.loading} />
                  </Col>
                </Row> 
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={modal} toggle={this.toggle} className="full-width-modal-section store-modal">
          <ModalHeader toggle={this.toggle}>Store</ModalHeader>
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
                    <Label htmlFor="store_name">Store Name</Label>            
                    <Input type="text" placeholder="Store Name *" id="store_name" name="store_name" value={this.state.formField.store_name} onChange={this.changeHandler} required />
                  </FormGroup>  
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="phoneNumber">Contact Number</Label>            
                    <Input type="text" placeholder="Contact Number " id="phoneNumber" name="phoneNumber" value={this.state.formField.phoneNumber} onChange={this.changeHandler}  />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="address">Address</Label>            
                    <Input type="text" placeholder="Address" id="address" name="address" value={this.state.formField.address} onChange={this.changeHandler}  />
                  </FormGroup>
                </Col>
                
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" disabled={!this.state.formValid || formProccessing} type="submit">{formProccessing ? processingBtnText : 'Submit' }</Button>
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>

    )
  }
}

function SetOrganizationDropDownItem (props) {
  const organizationInfo = props.organizationInfo;
  return (<option value={organizationInfo.authId} >{organizationInfo.organizationName}</option>)
}

export default OrgFoodTruckList;
