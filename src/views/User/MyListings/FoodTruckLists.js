import React, { Component } from 'react';
import { 
  Card, CardBody, CardHeader, Col, Row, Button, Form, Input, FormGroup, Label,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

import Select from 'react-select';

import  { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';

//import FoodTruckData from './FoodTruckData';
import Loader from '../../Loader/Loader';
import { FormErrors } from '../../Formerrors/Formerrors';
import AutoCompletePlaces from '../../../core/google-map/AutoCompletePlaces';

import "./MyList.css";
import "./FoodTruckLists.css";

import Checkbox from "../../../core/commonComponent/Checkbox";
const weekArr = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

class FoodTruckLists extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      truckLists: [],
      categoryList: [],
      loading: true,
      formProccessing: false,
      rowIndex: -1,
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
      formField: { truckName: '', contactPerson: '', phoneNumber:'', address: '',description:'', defaultImage: '',category_id:'',openTime:'', closeTime:''},
      formErrors: { truckName: '', contactPerson: '', phoneNumber:'', error: ''},
      formValid: false,
    } 
    this.submitHandler = this.submitHandler.bind(this);
    this.handleDeleteFoodTruck = this.handleDeleteFoodTruck.bind(this);
    this.setLatitudeLongitude = this.setLatitudeLongitude.bind(this);

  }

  componentDidMount() {    
    this.checkSubscription(); 
    this.truckLists({});   
    this.categoryList();
  }

  //Check subscription
  checkSubscription(){
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('profile/business-subscription')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }
          if(res.data.data.isActive)
            return
          else{
            this.props.history.push('/user/subscription');
            toast.error('You need to buy a subscription plan.');
          }
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

  truckLists() {
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('food-truck?pageSize=10000')
        .then( res => {
           
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }   

          this.setState({loading:false, truckLists: res.data.data.truckList});     
         
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            //this.props.history.push('/login');
          }
          else {
            this.setState( { loading: false } );
            toast.error(err.message);
          }
        } )
    } )
  }

  /* Submit Form Handler*/
  submitHandler (event) {
    event.preventDefault();
    //event.target.className += " was-validated";
    this.setState( { formProccessing: true}, () => {
      const formInputField = this.state.formField;
      if(this.state.address===''){
        this.setState( { formProccessing: false} );
        toast.error('Address field should not be empty!');
        return;
      }else{
        const formData = new FormData();
        formData.append('truckName', formInputField.truckName);
        formData.append('contactPerson', formInputField.contactPerson);
        formData.append('phoneNumber', formInputField.phoneNumber);
        formData.append('description', formInputField.description);
        formData.append('timing', formInputField.openTime+'-'+formInputField.closeTime);
        formData.append('address', this.state.address);
        formData.append('latitude', this.state.latitude);
        formData.append('longitude', this.state.longitude);
        formData.append('featuredImage', this.state.featuredImage);
        for(let i =0; i < this.state.galleryImages.length; i++){
          formData.append('truckImages', this.state.galleryImages[i]);
        }
        for(let i =0; i < this.state.menuImages.length; i++){
          formData.append('menuImages', this.state.menuImages[i]);
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
          commonService.postAPIWithAccessToken('food-truck/', formData)
          .then( res => {
            if ( undefined === res.data.data || !res.data.status ) {           
              this.setState( { formProccessing: false} );
              toast.error(res.data.message);
              return;
            } 
            
            this.setState({ modal: false, formProccessing: false});
            toast.success(res.data.message);
            this.truckLists();
          
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
            this.truckLists();
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
  handleImageChange = (e) => {
    this.setState({
      featuredImage: e.target.files[0]
    })
  };
  onGalleryImageChange = event => {   
    this.setState({
      galleryImages: event.target.files,
    });
  };
  onMenuImageChange = event => {   
    this.setState({
      menuImages: event.target.files,
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
      (formErrors.truckName === "" && formField.truckName !== "" ) 
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
      formField: { truckName: '', contactPerson: '', phoneNumber:'', address: '',openTime:'', closeTime:'' },
      formErrors: {truckName: '', error: ''}
    });
  }
  
  /* Delete Food Truck*/
  handleDeleteFoodTruck(rowIndex){
    const foodTruckItem = this.state.truckLists[rowIndex];
    
    this.setState( { loading: true}, () => {
      commonService.deleteAPIWithAccessToken( `food-truck/`, {foodTruckId: foodTruckItem.foodTruckId})
        .then( res => {
          
          this.setState({loading: false});
          if ( undefined === res.data || !res.data.status ) {            
             toast.error(res.data.message);      
            return;
          }         
          
          toast.success(res.data.message);
          this.truckLists({});
        } )
        .catch( err => {       
            
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }
          else{
            this.setState( { loading: false } );
            toast.error(err.message);
          }
      } )
    })
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
        }
        else 
          this.setState( { loading: false } );
      } )
  }

  // Set address, latitude and longitude
  setLatitudeLongitude(address, latLng){
    this.setState({ latitude:latLng.lat, longitude:latLng.lng, address: address })
  }
  

  render() {
    const {  loading, modal, formProccessing, truckLists, categoryList } = this.state;
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


    const processingBtnText = <>Submit <i className="fa fa-spinner"></i></>;
    let loaderElement = '';
    if(loading)        
      loaderElement = <Loader />

    return (
      <div className="user-dashboard">
        {loaderElement}
        <Card>
          <CardHeader className="mainHeading">
            <strong>Food Truck list</strong>
            <Button size="sm" color="secondary" className="addListing pull-right" type="button" onClick={this.toggle}  title="Add New Food Truck"><i className="fa fa-plus"></i> Add Food Truck</Button>
          </CardHeader>
          <CardBody>
          <div className="row">
          {truckLists.map((truckInfo, index) => 
            <div key={index} className="col-lg-4 SecondRow">
              <div className="item">
                  <div className="products-item-card">
                    <div className="products-item-image">
                        <div className="icon-big text-center icon-warning">
                          { (truckInfo.featuredImage!=='' ? <img src={truckInfo.featuredImage} alt={truckInfo.truckName} className="img-fluid item-img" /> : <img src="/images/1.png" alt="TruckBanner" /> ) }
                        </div>
                     </div>
                    <div className="food-truck-item-content">
                        <h2><Link to={`/user/my-listings/${truckInfo.foodTruckId}`}>{truckInfo.truckName}</Link></h2>
                        <div className="products-rate"><i className="fa fa-star-o"></i> {truckInfo.rating}</div>
                        <div className="location">{truckInfo.address}</div>
                        <div className="row">
                          <div className="col-lg-6 dateShow">
                            <h6>Created on</h6>
                            <p>{(new Date(truckInfo.createdAt)).toLocaleDateString("en-US")}</p>
                          </div> 
                          <div className="col-lg-6 statusShow">
                            <h6>Status</h6>
                            <p>{truckInfo.status ? "Active" : "Inactive"}</p>
                          </div> 

                          <div className="col-lg-12 actionShow">
                            <Link to={`/user/my-listings/${truckInfo.foodTruckId}`} className="btn btn-info btn-sm" title="Edit Food Truck Info"><i className="fa fa-pencil"></i></Link>
                            &nbsp;
                            <Button color="danger" size="sm" disabled={this.state.buttonProcessing} onClick={() => {
                            if (window.confirm('Are you sure you want to delete this food truck?')) this.handleDeleteFoodTruck(index) }} title="Delete Food Truck"><i className="fa fa-trash"></i></Button>                              
                          </div>  
                        </div>
                      </div>
                  </div>
               </div>
            </div>
          )}  
          
          </div>
            
            {/*<Row>
              <Col md={12}>
                <FoodTruckData data={truckLists} editStoreAction={this.handleEditStore} deleteFoodTruckAction={this.handleDeleteFoodTruck} dataTableLoadingStatus = {this.state.loading} />
              </Col>
            </Row> */}
          </CardBody>
        </Card>

        <Modal isOpen={modal} toggle={this.toggle} size="lg" className="full-width-modal-section employee-modal">
          <ModalHeader toggle={this.toggle} className="pb-0">Food Truck</ModalHeader>
          <Form onSubmit={this.submitHandler} noValidate className="texQueForm">
            <ModalBody>
              <FormErrors formErrors={this.state.formErrors} />
              <Row>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="truckName">Truck Name *</Label>            
                    <Input type="text" placeholder="Truck Name *" id="truckName" name="truckName" value={this.state.formField.truckName} onChange={this.changeHandler} required />
                  </FormGroup>  
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="contactPerson">Contact Person *</Label>            
                    <Input type="text" placeholder="Contact Person" id="contactPerson" name="contactPerson" value={this.state.formField.contactPerson} onChange={this.changeHandler} required />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="phoneNumber">Phone Number *</Label>            
                    <Input type="text" placeholder="Phone Number" id="phoneNumber" name="phoneNumber" value={this.state.formField.phoneNumber} onChange={this.changeHandler} required />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup>
                    <Label htmlFor="category_id">Cuisine</Label>            
                    <Select name="category_id" id="category_id" options={categoryItems} onChange={this.handleCategoryChange} isMulti />
                  </FormGroup> 
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="defaultImage">Food Truck Image *</Label>            
                    <Input type="file" id="defaultImage" name="defaultImage" className="form-control"  onChange={this.handleImageChange} />
                  </FormGroup>              
                </Col>
                <Col md={"6"}>
                  <FormGroup>
                    <Label htmlFor="truckImages">Food Truck Gallery Images</Label>            
                    <Input type="file" id="truckImages" name="truckImages" className="form-control" multiple onChange={this.onGalleryImageChange} />
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
                        {/* <Input type="checkbox" value={week} onChange={this.handleAvlChange} /> {week} */}
                      </Label>
                    </FormGroup>
                    )}
                  </FormGroup>  
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="openTime">Opening Hours</Label><br/>
                    <input type="time" id="openTime" className="form-control input-hour" name="openTime" value={this.state.formField.openTime} onChange={this.changeHandler} />
                    <input type="time" id="closeTime" className="form-control input-hour" name="closeTime" value={this.state.formField.closeTime} onChange={this.changeHandler} />
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

  

    );
  }
}

export default FoodTruckLists;
