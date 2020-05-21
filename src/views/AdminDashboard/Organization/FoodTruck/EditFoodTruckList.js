import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {
   Card, CardBody, CardHeader, Col, Row, Button, Form, Input, FormGroup, Label, Media
} from 'reactstrap';
import Select from 'react-select';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../../core/services/commonService';
import { FormErrors } from '../../../Formerrors/Formerrors';
import AutoCompletePlaces from '../../../../core/google-map/AutoCompletePlaces';

import Loader from '../../../Loader/Loader';
import './FoodTruck.css'
import "../../../../containers/CommonLayout/planSwitcher.css";
import Checkbox from "../../../../core/commonComponent/Checkbox";
const weekArr = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

class EditFoodTruckList extends Component {
  constructor(props) {
    super( props );

    this.state = {
      data: '',      
      loading: false,
      formProccessing: false,
      foodTruckId: "",
      organizationList: [],
      categoryList: [],
      featuredImage: '',
      galleryImages:[],
      menuImages: [],
      selectedCategories: [],
      foodTruckDetail: {},
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
      schedules: [],
      isOpenToday: false,
      changeStatusBtn: '',
      formField: { organizationId:'', truckName: '', contactPerson: '', phoneNumber:'', address: '',description:'', defaultImage: '',category_id:'', openTime:'', closeTime:'' },
      formErrors: { truckName: '', contactPerson: '', phoneNumber:'', address:'', error: ''},
      formValid: false,
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.deleteTruckImage = this.deleteTruckImage.bind(this);
    this.setLatitudeLongitude = this.setLatitudeLongitude.bind(this);
  }

  componentDidMount() {     
    const { match: { params } } = this.props;    
    if(params.foodTruckId !== undefined && params.foodTruckId !=="") {
      this.setState({foodTruckId: params.foodTruckId});
      this.getFoodTruckDetail(params.foodTruckId);
    }
    else 
        this.props.history.push('/admin/organization/truck-listing');
    
    this.organizationList();
    this.categoryList();
  }

  getFoodTruckDetail(foodTruckId) {
    this.setState( { loading: true}, () => {
        commonService.getAPIWithAccessToken('food-truck/'+foodTruckId)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
           
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          } 
          const foodTruckDetail = res.data.data;
          const timing = foodTruckDetail.timing.split('-');
          let formField = this.state.formField;
          formField.truckName = foodTruckDetail.truckName;
          formField.organizationId = foodTruckDetail.authId;
          formField.contactPerson = foodTruckDetail.contactPerson;
          formField.phoneNumber = foodTruckDetail.phoneNumber;
          formField.address = foodTruckDetail.address;
          formField.description = foodTruckDetail.description;
          formField.openTime = timing[0];
          formField.closeTime = timing[1];
          formField.category_id = foodTruckDetail.categories.length > 0 ? foodTruckDetail.categories : "";

          let selectedOption = [];
          let c = 0;
          if(foodTruckDetail.categories !== undefined && foodTruckDetail.categories.length > 0){
            for(const [k, cat] of foodTruckDetail.categories.entries()){
              let catInfo = {
                label: cat.categoryName,
                value: cat.categoryId
              }
              selectedOption.push(catInfo);
              c = c+k;
            }
            this.setState({ selectedCategories: selectedOption });
          }

          const listItems = foodTruckDetail.schedules;
          let checkboxes = this.state.checkboxes;
          let availabilityItem = {}
          Object.keys(checkboxes).forEach((key, value) => { 
            if(listItems.indexOf(key) > -1 )
              availabilityItem[key] = true;
            else
              availabilityItem[key] = false;
          });
          this.setState({ schedules: listItems, checkboxes: availabilityItem });

          const statusBtn = <Button type="button" size="sm" className={ ( foodTruckDetail.status ? 'btn-danger' : 'btn-success' )} onClick={() => 
            this.changeFoodTruckStatus(foodTruckDetail.foodTruckId, foodTruckDetail.status )} >{ ( foodTruckDetail.status ? 'Un-Approve Listing' : 'Approve Listing' )}</Button>
          
          this.setState({ loading: false, foodTruckDetail: foodTruckDetail, address: foodTruckDetail.address, latitude: foodTruckDetail.latitude,  longitude: foodTruckDetail.longitude, isOpenToday:foodTruckDetail.isOpen, changeStatusBtn:statusBtn, formValid: true, formField: formField});
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
 
  /* Change Food Truck status*/
  changeFoodTruckStatus(foodTruckId,status){
    this.setState( { loading: true}, () => {
      const formData = {
        "foodTruckId": foodTruckId,
        "status": (status ? false : true ),
      };
      commonService.putAPIWithAccessToken('food-truck/status', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {           
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          } 
          this.props.history.push('/admin/organization/truck-listing');
          toast.success(res.data.message);   
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

  /* Submit Form Handler*/
  submitHandler (event) {
    event.preventDefault();
    event.target.className += " was-validated";
    this.setState( { formProccessing: true}, () => {
      const formInputField = this.state.formField;
      const formData = new FormData();
      formData.append('organizationId', formInputField.organizationId);
      formData.append('foodTruckId', this.state.foodTruckId);
      formData.append('truckName', formInputField.truckName);
      formData.append('contactPerson', formInputField.contactPerson);
      formData.append('phoneNumber', formInputField.phoneNumber);
      formData.append('description', formInputField.description);
      formData.append('timing', formInputField.openTime+'-'+formInputField.closeTime);
      formData.append('address', this.state.address);
      formData.append('latitude', this.state.latitude);
      formData.append('longitude', this.state.longitude);

      if(this.state.featuredImage !== "")
        formData.append('featuredImage', this.state.featuredImage);
      
      for(let i =0; i < this.state.galleryImages.length; i++){
        formData.append('truckImages', this.state.galleryImages[i]);
      }
      
      for(let j =0; j < this.state.menuImages.length; j++){
        formData.append('menuImages', this.state.menuImages[j]);
      }

      for(let j =0; j < this.state.selectedCategories.length; j++){
        formData.append('categoryId', this.state.selectedCategories[j].value );
      }
      
      Object.keys(this.state.checkboxes)
      .filter(checkbox => this.state.checkboxes[checkbox])
      .forEach(checkbox => {
        formData.append('schedules', checkbox );
      });
      
      commonService.putAPIWithAccessToken('food-truck', formData)
      .then( res => {
        if ( undefined === res.data.data || !res.data.status ) { 
          this.setState( { formProccessing: false} );
          toast.error(res.data.message);
          return;
        } 
        this.props.history.push('/admin/organization/truck-listing');
        toast.success(res.data.message);
      } )
      .catch( err => { 
        if(err.response !== undefined && err.response.status === 401) {
          localStorage.clear();
          this.props.history.push('/login');
        }else
          this.setState( { formProccessing: false } );
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

  handleAvlChange = e => {
    const { name } = e.target;
    
    this.setState(prevState => ({
      checkboxes: {
        ...prevState.checkboxes,
        [name]: !prevState.checkboxes[name]
      }
    }));
  };

  handleCategoryChange = (selectedOptions) => {
    this.setState({ selectedCategories: selectedOptions });
  }

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
      formField: { truckName: '', contactPerson: '', phoneNumber:'', address: '', openTime:'', closeTime:'' },
      formErrors: {truckName: '', error: ''}
    });
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
          toast.error(err.response);
        }else 
          this.setState( { loading: false } );
      } )
  }
  
  deleteTruckImage(rowIndex,imageType){
    let formdata = {
      "foodTruckId":this.state.foodTruckId,
      deleteIndex:rowIndex,
      deleteType:imageType
    }

    this.setState( { loading: true}, () => {
      commonService.deleteAPIWithAccessToken( 'food-truck/images',formdata)
        .then( res => {
          this.setState({loading: false});
          if ( undefined === res.data || !res.data.status ) {            
             toast.error(res.data.message);      
            return;
          }         
          toast.success(res.data.message);
          this.props.history.push(`/admin/organization/truck-listing/`);
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
    let formField = this.state.formField;
    formField.address = address;
    this.setState({ latitude:latLng.lat, longitude:latLng.lng, address: address, formField: formField })
  }

  openToday = () => {
    if(this.state.foodTruckId!==''){

    var isOpen = false;
    if(!this.state.isOpenToday){ 
      isOpen = true;
    }

    const formData = { "foodTruckId": this.state.foodTruckId, "isOpen" : isOpen }
      this.setState( { loading:true }, () =>{
        commonService.putAPIWithAccessToken('food-truck/open', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {           
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          }
          toast.success(res.data.message);
          this.getFoodTruckDetail(this.state.foodTruckId);
        })
      } );
    }
  }

  render() {
    const { loading, formProccessing, organizationList, categoryList, foodTruckDetail,selectedCategories, changeStatusBtn, isOpenToday } = this.state;
    const processingBtnText = <>Submit <i className="fa fa-spinner"></i></>;
    let loaderElement = '';
    let defaultImagePreview = '';  
    let truckImages = (foodTruckDetail.images !== undefined && foodTruckDetail.images.length > 0 ) ? foodTruckDetail.images: [];
    if(foodTruckDetail.featuredImage !== "")
      defaultImagePreview = <div className="previewDefaultImage"><img alt="default" width="100" className="img-fluid img-thumbnail" src={foodTruckDetail.featuredImage} /></div>
    
    let menuImages = (foodTruckDetail.menu !== undefined && foodTruckDetail.menu.length > 0 ) ? foodTruckDetail.menu: [];
    
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

    
    
    if(loading)        
      loaderElement = <Loader />
    return (
      <div className="user-dashboard">
        {loaderElement}
        <Card>
          <CardHeader>
            <Row>
            <Col md="3" className="mainHeading">
              <strong className="mr-5">Food Truck</strong>
            </Col>
            <Col md="3">
              <Link to={`/admin/reviews/`+ this.state.foodTruckId} className="btn btn-sm btn btn-outline-info">Reviews: {foodTruckDetail.totalReviews}</Link>
            </Col>
            <Col md="4">
            <div className="pricing-section pb-0">
              <label className={ ( !isOpenToday ? 'my-0 toggler toggler--is-active' : 'my-0 toggler' ) } id="filt-monthly">Closed</label>
              <div className="toggle my-0">
                <input type="checkbox" id="switcher" className="check" onClick={ () =>  this.openToday() } checked={ ( isOpenToday ? 'checked' : '' ) } onChange={this.changeHandler} />
                <b className="b switch"></b>
              </div>
              <label className={ ( isOpenToday ? 'my-0 toggler toggler--is-active' : 'my-0 toggler' ) }  id="filt-yearly">Open Today</label>
            </div>
            </Col>
            <Col md="2">
              <Link to="/admin/organization/truck-listing" className="btn btn-sm btn-secondary backButtonRight pull-right"><i className="fa fa-arrow-left"></i> Back</Link>
            </Col>
            </Row>
          </CardHeader>
          <CardBody>
            
            <Form onSubmit={this.submitHandler} noValidate className="texQueForm">
            
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
                    <Label htmlFor="truckName">Truck Name *</Label>            
                    <Input type="text" placeholder="Truck Name *" id="truckName" name="truckName" value={this.state.formField.truckName} onChange={this.changeHandler} required />
                  </FormGroup>  
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="contactPerson">Contact Person *</Label>            
                    <Input type="text" placeholder="Contact Person" id="contactPerson" name="contactPerson" value={this.state.formField.contactPerson} onChange={this.changeHandler}  />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="phoneNumber">Phone Number *</Label>            
                    <Input type="text" placeholder="Phone Number" id="phoneNumber" name="phoneNumber" value={this.state.formField.phoneNumber} onChange={this.changeHandler}  />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup>
                    <Label htmlFor="category_id">Cuisine *</Label>            
                    <Select name="category_id" id="category_id" options={categoryItems} value={selectedCategories} onChange={this.handleCategoryChange} isMulti />
                  </FormGroup>  
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="address">Address *</Label>            
                    <AutoCompletePlaces setLatitudeLongitude={this.setLatitudeLongitude} truckAdress={ this.state.formField.address } />     
                  </FormGroup>
                </Col>
                <Col md={"12"}>
                  <FormGroup> 
                    <Label htmlFor="description">Description</Label>
                    <Input type="textarea" placeholder="Food truck details" id="description" name="description" value={this.state.formField.description} onChange={this.changeHandler} />
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
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="openTime">Opening Hours</Label><br/>
                    <input type="time" id="openTime" className="form-control input-hour" name="openTime" value={this.state.formField.openTime} onChange={this.changeHandler} />
                    <input type="time" id="closeTime" className="form-control input-hour" name="closeTime" value={this.state.formField.closeTime} onChange={this.changeHandler} />
                  </FormGroup>
                </Col>
                
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="defaultImage">Banner Image</Label>            
                    <Input type="file" id="defaultImage" name="defaultImage" className="form-control"  onChange={this.handleImageChange} />
                    <small>Banner Image will be shown as a Food truck profile image.</small>
                  </FormGroup>              
                </Col>
                <Col md={"6"}>{defaultImagePreview}</Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="truckImages">Gallery Images</Label>            
                    <Input type="file" id="truckImages" name="truckImages" className="form-control" multiple onChange={this.onGalleryImageChange} />
                    <small>Gallery images will be shown to user inside gallery option while scrolling on Food Truck Details page.</small>
                  </FormGroup> 
                </Col>  
                <Col md={"6"}>
                  <div className="previewTruckImageArea row">
                      {truckImages.map((truckImgInfo, index) =>
                        <Media className="previewTruckImage col-md-2" key={index}>
                          <img className="img-fluid img-thumbnail" width="80" alt="Truck" src={truckImgInfo} /> <i className="fa fa-times text-danger" onClick={() => {if(window.confirm('Are you sure, you want to delete this image?')){ this.deleteTruckImage(index,'image') };}}></i>
                        </Media>
                      )}
                  </div>             
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="menu">Menu Images</Label>            
                    <Input type="file" id="menu" name="menu" className="form-control" multiple onChange={this.onMenuImageChange} />
                  </FormGroup> 
                </Col>
                <Col md={"6"}>
                  <div className="previewMenuImageArea row">
                      {menuImages.map((imagesInfo, index) =>
                        <Media className="previewMenuImage col-md-2" key={index}>
                          <img className="img-fluid img-thumbnail" width="80" alt="menu" src={imagesInfo} /> <i className="fa fa-times text-danger" onClick={() => {if(window.confirm('Are you sure, you want to delete this image?')){ this.deleteTruckImage(index,'menu') };}}></i>
                        </Media>
                      )}
                  </div>             
                </Col>
              </Row>

              <Button color="primary" disabled={!this.state.formValid || formProccessing} type="submit">{formProccessing ? processingBtnText : 'Update Details' }</Button>
              &nbsp; 
              {changeStatusBtn}
              &nbsp;
              <Link className="btn btn-secondary" to='/admin/organization/truck-listing'>Cancel</Link>
            
            </Form> 
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default EditFoodTruckList;

function SetOrganizationDropDownItem (props) {
  const organizationInfo = props.organizationInfo;
  return (<option value={organizationInfo.authId} >{organizationInfo.organizationName}</option>)
}