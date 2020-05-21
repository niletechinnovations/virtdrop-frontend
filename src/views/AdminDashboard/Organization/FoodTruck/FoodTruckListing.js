import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../../core/services/commonService';
import { FormErrors } from '../../../Formerrors/Formerrors';
import Loader from '../../../Loader/Loader';
import Select from 'react-select';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AutoCompletePlaces from '../../../../core/google-map/AutoCompletePlaces';
import FoodTruckData from './FoodTruckData';
import './FoodTruck.css'

import Checkbox from "../../../../core/commonComponent/Checkbox";
const weekArr = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

class FoodTruckList extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,      
      storeList: [],
      organizationList: [],
      categoryList: [],
      featuredImage: '',
      galleryImages:[],
      menuImages: [],
      selectedCategories: [],
      address: '',
      latitude:'',
      longitude:'',
      checkboxes: weekArr.reduce(
        (options, option) => ({
          ...options,
          [option]: false
        }),
        {}
      ),
      loading: true,
      formProccessing: false,
      rowIndex: -1,
      formField: { organizationId: '', truckName: '', contactPerson: '', phoneNumber:'', address: '', description:'', defaultImage: '',category_id:''},
      formErrors: { organizationId: '', truckName: '',  address:'', error: ''},
      formValid: false,
      filterItem: { filter_organization_id: '', filter_cat_id: '', filterTruckName: '', filterRating:'', filter_address:'', filterFrom:'',  filterTo:'', filterStatus:'', custom_search: '' },
    } 
    this.submitHandler = this.submitHandler.bind(this);
    this.handleDeleteTruck = this.handleDeleteTruck.bind(this);
    this.filterTruckList = this.filterTruckList.bind(this);
    this.setLatitudeLongitude = this.setLatitudeLongitude.bind(this);

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
    this.categoryList();
  }
  /*Food Truck List API*/
  foodTruckList(filterItem = {}) {
    let filterQuery = "?pageSize=10000";
    if(filterItem.filter_organization_id !== undefined && filterItem.filter_organization_id !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&organizationAuthId="+filterItem.filter_organization_id: "&organizationAuthId="+filterItem.filter_organization_id;
    if(filterItem.filter_cat_id !== undefined && filterItem.filter_cat_id !== "" ) 
     filterQuery += (filterQuery !=="" ) ? "&categoryId="+filterItem.filter_cat_id: "&categoryId="+filterItem.filter_cat_id;
    if(filterItem.filterTruckName !== undefined && filterItem.filterTruckName !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&truckName="+filterItem.filterTruckName: "&truckName="+filterItem.filterTruckName;
    if(filterItem.filterRating !== undefined && filterItem.filterRating !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&rating="+filterItem.filterRating: "&rating="+filterItem.filterRating;
    if(filterItem.filter_address !== undefined && filterItem.filter_address !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&location="+filterItem.filter_address: "&location="+filterItem.filter_address;
    if(filterItem.custom_search !== undefined && filterItem.custom_search !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&keyword="+filterItem.custom_search: "&keyword="+filterItem.custom_search;
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
      commonService.getAPIWithAccessToken('food-truck'+filterQuery)
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

  /*Category List API*/
  categoryList() {   
    commonService.getAPIWithAccessToken('category')
      .then( res => { 
        if ( undefined === res.data.data || !res.data.status ) {
          this.setState( { loading: false } );
          toast.error(res.data.message);
          return;
        }   
        this.setState({loading:false, categoryList: res.data.data}); 
      } )
      .catch( err => {         
        if(err.response !== undefined && err.response.status === 401) {
          localStorage.clear();
          this.props.history.push('/login');
        }else 
          this.setState( { loading: false } );
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
      const formData = new FormData();
      formData.append('organizationId', formInputField.organizationId);
      formData.append('truckName', formInputField.truckName);
      formData.append('contactPerson', formInputField.contactPerson);
      formData.append('phoneNumber', formInputField.phoneNumber);
      formData.append('description', formInputField.description);
      formData.append('address', this.state.address);
      formData.append('latitude', this.state.latitude);
      formData.append('longitude', this.state.longitude);
      
      formData.append('featuredImage', this.state.featuredImage);
      for(let i =0; i < this.state.menuImages.length; i++){
        formData.append('menuImages', this.state.menuImages[i]);
      }
      for(let i =0; i < this.state.galleryImages.length; i++){
        formData.append('truckImages', this.state.galleryImages[i]);
      }
      for(let j =0; j < this.state.selectedCategories.length; j++){
        formData.append('categoryId', this.state.selectedCategories[j].value );
      }

      Object.keys(this.state.checkboxes)
      .filter(checkbox => this.state.checkboxes[checkbox])
      .forEach(checkbox => {
        formData.append('schedules', checkbox );
      });

      const rowIndex = this.state.rowIndex;
      if(rowIndex > -1) {
        commonService.putAPIWithAccessToken('food-truck', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { formProccessing: false} );
            toast.error(res.data.message);
            return;
          }
          this.setState({ modal: false, formProccessing: false});
          toast.success(res.data.message);
          this.foodTruckList();
         
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }else
            this.setState( { formProccessing: false } );
            toast.error(err.message);
        } )
      }
      else{
        commonService.postAPIWithAccessToken('food-truck', formData)
        .then( res => {
         
          if ( undefined === res.data.data || !res.data.status ) { 
            this.setState( { formProccessing: false} );
            toast.error(res.data.message);
            return;
          } 
          
          this.setState({ modal: false});
          toast.success(res.data.message);
          this.foodTruckList();
         
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }else
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

  handleImageChange = (e) => {
    this.setState({
      featuredImage: e.target.files[0]
    })
  };
  onMenuImageChange = event => {   
    this.setState({
      menuImages: event.target.files,
    });
  };
  onGalleryImageChange = event => {   
    this.setState({
      galleryImages: event.target.files,
    });
  };

  handleCategoryChange = (selectedOptions) => {
    this.setState({ selectedCategories: selectedOptions });
  }
  
  handleAvlChange = e => {
    const { name } = e.target;
    this.setState(prevState => ({
      checkboxes: {
        ...prevState.checkboxes,
        [name]: !prevState.checkboxes[name]
      }
    }));
  };

  /* Validate Form Field */
  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    fieldValidationErrors.error = '';
   
    switch(fieldName) {   
      
      case 'truckName':        
        fieldValidationErrors.truckName = (value !== '') ? '' : ' is required';
        break;
      case 'contactPerson':        
        fieldValidationErrors.contactPerson = (value !== '') ? '' : ' is required';
        break;
      case 'phoneNumber':        
        fieldValidationErrors.phoneNumber = (value !== '') ? '' : ' is required';
        break;
      case 'address':        
        fieldValidationErrors.address = (value !== '') ? '' : ' is required';
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
      (formErrors.truckName === "" && formField.truckName !== "") 
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
      formField: { truckName: '', contactPerson: '', phoneNumber:'', address: '', },
      formErrors: {truckName: '', error: ''}
    });
  }
  
  /* Delete Food Truck*/
  handleDeleteTruck(rowIndex){
    const truckInfo = this.state.storeList[rowIndex];
    let formdata = { "foodTruckId":truckInfo.foodTruckId }

    this.setState( { loading: true}, () => {
      commonService.deleteAPIWithAccessToken( 'food-truck',formdata)
        .then( res => {
          this.setState({loading: false});
          if ( undefined === res.data || !res.data.status ) {            
             toast.error(res.data.message);      
            return;
          }         
          toast.success(res.data.message);
          this.foodTruckList();
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
      filterItem: { filter_organization_id: '', filter_cat_id: '', filterTruckName: '', filterRating:'', filter_address:'', filterFrom:'',  filterTo:'', filterStatus:'', custom_search: '' }
    });
    this.foodTruckList();
  }
  
  getFormatDate(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 101).toString().substring(1);
    var day = (date.getDate() + 100).toString().substring(1);
    return year + "-" + month + "-" + day;
  }

  render() {

    const { storeList, loading, modal, formProccessing, organizationList, categoryList, filterItem } = this.state;

    let categoryItems = []; 
    let counter = 0;
    for(const [i, category] of categoryList.entries()){
      let categoryInfo = {
        label: category.categoryName,
        value: category.categoryId
      }
      categoryItems.push(categoryInfo);
      counter = counter+i;
    }

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
                <strong>Food Truck List</strong> <Button color="primary" className="categoryAdd" type="button" onClick={this.toggle}><i className="fa fa-plus"></i> Add Food Truck</Button>
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
                      <Col md={"1"}>
                        <FormGroup> 
                          <Label htmlFor="filter_cat_id">Cuisine</Label>
                          <Input type="select" placeholder="Cuisine *" id="filter_cat_id" name="filter_cat_id" value={filterItem.filter_cat_id} onChange={this.changeFilterHandler} >
                            <option value="">All</option>
                            {categoryList.map((catInfo, index) =>
                              <SetCatDropDownItem key={index} catInfo={catInfo} />
                            )}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={"2"}>
                        <FormGroup> 
                          <Label htmlFor="filterTruckName">Food Truck Name</Label>
                          <Input type="text" placeholder="Search by Food Truck Name" id="filterTruckName" name="filterTruckName" value={filterItem.filterTruckName} onChange={this.changeFilterHandler} />   
                        </FormGroup>
                      </Col>
                      <Col md={"2"}>
                        <FormGroup> 
                          <Label htmlFor="filter_address">Search by Location</Label>            
                          <Input type="text" placeholder="Search by Address/ Location" id="filter_address" name="filter_address" value={filterItem.filter_address} onChange={this.changeFilterHandler} />
                        </FormGroup>  
                      </Col>
                      <Col md={"1"}>
                        <FormGroup> 
                          <Label>Rating</Label>
                          <Input type="select" name="filterRating" value={filterItem.filterRating} onChange={this.changeFilterHandler}>
                            <option value="">All</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
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
                      <Col md={"1"}>
                        <FormGroup> 
                          <Label>Date From</Label>
                          <DatePicker className="form-control" selected={ filterItem.filterFrom } onChange={this.setFilterFromDate} dateFormat="MM/dd/yyyy" />
                        </FormGroup>  
                      </Col>
                      <Col md={"1"}>
                        <FormGroup> 
                          <Label>Date To</Label>
                          <DatePicker className="form-control" selected={ filterItem.filterTo } onChange={this.setFilterToDate} dateFormat="MM/dd/yyyy" />
                        </FormGroup>  
                      </Col>
                      <Col md={"1"} className="p-0">
                        <FormGroup> 
                          <Label>&nbsp;</Label><br />
                          <Button color="success" type="button" size="sm" onClick={this.filterTruckList} title="Filter Food Truck"><i className="fa fa-search"></i></Button>&nbsp;
                          <Button color="danger" type="reset" size="sm" onClick={this.resetfilterForm} title="Reset Fields"><i className="fa fa-refresh"></i></Button>
                        </FormGroup>             
                      </Col>
                    </Row>
                  </Col>
                  <Col md={12}>
                    <FoodTruckData data={storeList} editStoreAction={this.handleEditStore} deleteStoreAction={this.handleDeleteTruck} dataTableLoadingStatus = {this.state.loading} />
                  </Col>
                </Row> 
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={modal} toggle={this.toggle} className="full-width-modal-section store-modal">
          <ModalHeader toggle={this.toggle}>Add New Food Truck</ModalHeader>
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
                    <Label htmlFor="category_id">Cuisine </Label>            
                    <Select name="category_id" id="category_id" options={categoryItems} onChange={this.handleCategoryChange} isMulti />
                  </FormGroup> 
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="truckName">Truck Name *</Label>            
                    <Input type="text" placeholder="Truck Name *" id="truckName" name="truckName" value={this.state.formField.truckName} onChange={this.changeHandler} required />
                  </FormGroup>  
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="contactPerson">Contact Person</Label>            
                    <Input type="text" placeholder="Contact Person" id="contactPerson" name="contactPerson" value={this.state.formField.contactPerson} onChange={this.changeHandler}  />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="phoneNumber">Phone Number</Label>            
                    <Input type="text" placeholder="Phone Number" id="phoneNumber" name="phoneNumber" value={this.state.formField.phoneNumber} onChange={this.changeHandler}  />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="menu">Menu Images</Label>            
                    <Input type="file" id="menu" name="menu" className="form-control" multiple onChange={this.onMenuImageChange} />
                  </FormGroup>              
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="defaultImage">Default Image *</Label>            
                    <Input type="file" id="defaultImage" name="defaultImage" className="form-control" onChange={this.handleImageChange} required />
                  </FormGroup>              
                </Col>
                <Col md={"6"}>
                  <FormGroup>
                    <Label htmlFor="truckImages">Gallery Images</Label>            
                    <Input type="file" id="truckImages" name="truckImages" className="form-control" multiple onChange={this.onGalleryImageChange} />
                  </FormGroup> 
                </Col>  
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="address">Address *</Label>
                    <AutoCompletePlaces setLatitudeLongitude={this.setLatitudeLongitude} />        
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup>
                    <Label htmlFor="avl">Availability </Label><br/>
                    {weekArr.map((week, index) =>  
                    <FormGroup check inline key={index}>
                      <Label check>
                      <Checkbox
                        label={week}
                        isSelected={ this.state.checkboxes[week]}
                        onCheckboxChange={this.handleAvlChange}
                        key={week}
                      />
                      </Label>
                    </FormGroup>
                    )}
                  </FormGroup>  
                </Col>
                <Col md={"12"}>
                  <FormGroup> 
                    <Label htmlFor="description">Description</Label>
                    <Input type="textarea" placeholder="Food truck details" id="description" name="description" value={this.state.formField.description} onChange={this.changeHandler} />
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
function SetCatDropDownItem (props) {
  const catInfo = props.catInfo;
  return (<option value={catInfo.categoryId} >{catInfo.categoryName}</option>)
}

export default FoodTruckList;
