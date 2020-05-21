import React, { Component } from 'react';
import { Card, CardBody, Col, Row, Button, Form, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { FormErrors } from '../../Formerrors/Formerrors';
import Loader from '../../Loader/Loader';
import UsersData from './UsersData';
import './Users.css'

class Users extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      userList: [],
      rowIndex: -1,
      changeStatusBtn:'',
      formProccessing: false,
      formField: {profileId:'', email: '', first_name: '', last_name: '', phoneNumber: '', address: '', profilePic:'' },
      formErrors: { email: '', first_name: '', last_name: '', error: ''},
      formValid: false,
      profileImage:'',
      filterItem: { filterPhone:'', filterLocation: '', custom_search: '', filterFrom:'',  filterTo:'', filterStatus:''}
    }
    this.handleEditUser = this.handleEditUser.bind(this);
    this.filterUserList = this.filterUserList.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleDeleteUser = this.handleDeleteUser.bind(this);
    this.onProfileImgChange = this.onProfileImgChange.bind(this);
  }
  componentDidMount() { 
    this.userList({});
  }

  /*User List API*/
  userList(filterItem = {}) {
    let filterQuery = "?pageSize=20000";
    if(filterItem.custom_search !== undefined && filterItem.custom_search !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&emailOrName="+filterItem.custom_search: "&emailOrName="+filterItem.custom_search;
    if(filterItem.filterPhone !== undefined && filterItem.filterPhone !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&phoneNumber="+filterItem.filterPhone: "&phoneNumber="+filterItem.phoneNumber;
    if(filterItem.filterLocation !== undefined && filterItem.filterLocation !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&location="+filterItem.filterLocation: "&location="+filterItem.filterLocation;
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
        commonService.getAPIWithAccessToken('profile/list'+filterQuery)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( {  loading: false } );
            toast.error(res.data.message);    
            return;
          }
          this.setState({loading:false, userList: res.data.data.profileList});
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

   /* Input Field On changes*/
   changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    const formField = this.state.formField
    formField[name] = value;
    this.setState({ formField: formField });
  };

  /* Edit User*/
  handleEditUser(rowIndex){
    const userInfo = this.state.userList[rowIndex];
    const formField = {
      profileId:userInfo.profileId,
      email: userInfo.email, 
      first_name: userInfo.firstName, 
      last_name: userInfo.lastName, 
      phoneNumber: userInfo.phoneNumber, 
      address: userInfo.address,
      profilePic: userInfo.profilePic
    };
    const statusBtn = <Button type="button" size="sm" className={`changeStatusBtn `+( userInfo.status ? 'btn-danger' : 'btn-success' )} onClick={() => 
      this.changeProfileStatus(userInfo.profileId, userInfo.status )} >{ ( userInfo.status ? 'De-Activate Account' : 'Activate Account' )}</Button>
    
    this.setState({rowIndex: rowIndex, formField: formField, modal: true, changeStatusBtn:statusBtn, formValid: true});
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
        "phoneNumber": formInputField.phoneNumber,
        "address": formInputField.address
      };
      
      const rowIndex = this.state.rowIndex;
      if(rowIndex > -1) {
       const userInfo = this.state.userList[rowIndex];
       formData['profileId'] = userInfo.profileId;
       commonService.putAPIWithAccessToken('profile', formData)
       .then( res => {
         if ( undefined === res.data.data || !res.data.status ) {
           this.setState( { formProccessing: false} );
           toast.error(res.data.message);
           return;
         }
         this.setState({ modal: false, formProccessing: false});
         toast.success(res.data.message);
         this.userList();
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

  //Set profile picture on change
  onProfileImgChange = (event) => {
    this.setState({
      profileImage: event.target.files[0],
    });
    if(event.target.files.length > 0){
      this.setState( { loading: true}, () => {  
        const formData = new FormData();
        formData.append('profileImage', this.state.profileImage );
        formData.append('profileId', this.state.formField.profileId);
      
        commonService.putAPIWithAccessToken('profile/picture', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          }
          this.setState({ loading: false});
          this.userList();
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
      } ) 
    }  
  }

  /* Change Profile status*/
  changeProfileStatus(profileId,status){
    this.setState( { loading: true}, () => {
      const formData = {
        "profileId": profileId,
        "status": (status ? false : true ),
      };
      commonService.putAPIWithAccessToken('profile/status', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {           
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          } 
          this.setState({ modal: false, loading: false});
          toast.success(res.data.message);
          this.userList();        
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
  }

  handleDeleteUser(rowIndex){
    const rowInfo = this.state.userList[rowIndex];
    const delFormData = {
      "profileId": rowInfo.profileId,
    };
    this.setState( { loading: true}, () => {
      commonService.deleteAPIWithAccessToken( `profile`, delFormData)
        .then( res => {
          if ( undefined === res.data || !res.data.status ) {            
            this.setState( { loading: false} );
            toast.error(res.data.message);      
            return;
          }         
          this.setState({ loading: false});
          this.userList();
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
    })
  }  

 
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      rowIndex: -1,
      changeStatusBtn: '',
      formValid: false,
      formField: { profileId:'', email: '', first_name: '', last_name: '', phoneNumber: '', address: '', profilePic: '' },
      formErrors: { email: '', first_name: '', last_name: '', error: ''}
    });
  }

  filterUserList(){
    const filterItem = this.state.filterItem;
    this.userList(filterItem);
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

  resetfilterForm = () => {
    this.setState({
      filterItem: { filterPhone:'', filterLocation: '', custom_search: '', filterFrom:'',  filterTo:'', filterStatus:''}
    });
    this.userList();
  }
  
  getFormatDate(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 101).toString().substring(1);
    var day = (date.getDate() + 100).toString().substring(1);
    return year + "-" + month + "-" + day;
  }

  render() {

    const { userList, loading, modal, changeStatusBtn, formProccessing, filterItem } = this.state;     
    let loaderElement = '';
    if(loading) 
      loaderElement = <Loader />

      const processingBtnText = <>Submit <i className="fa fa-spinner"></i></>;

    return (
      <div className="animated fadeIn user-dashboard">
        <ToastContainer />
        {loaderElement}
        
        <Card>
          <CardBody>
            <Row>
              <Col md={12}>
                <Row className="filterRow">                      
                  <Col md={"2"} className="pl-3">
                    <FormGroup> 
                      <Label>Email ID / Name</Label>
                      <Input type="text" placeholder="Search By Email ID / Name" id="custom_search" name="custom_search" value={filterItem.custom_search} onChange={this.changeFilterHandler} />
                    </FormGroup>  
                  </Col>
                  <Col md={"2"}>
                    <FormGroup>
                      <Label htmlFor="filterPhone">Phone no.</Label>
                      <Input id="filterPhone" name="filterPhone" placeholder="Phone no." value={filterItem.filterPhone}  onChange={this.changeFilterHandler} />
                    </FormGroup>  
                  </Col>
                  <Col md={"2"}>
                    <FormGroup>
                      <Label htmlFor="filterLocation">Location</Label>
                      <Input id="filterLocation" name="filterLocation" placeholder="Location" value={filterItem.filterLocation}  onChange={this.changeFilterHandler} />
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
                      <Button color="success" type="button" size="sm" onClick={this.filterUserList}><i className="fa fa-search"></i></Button>&nbsp;
                      <Button color="danger" type="reset" size="sm" onClick={this.resetfilterForm}><i className="fa fa-refresh"></i></Button>
                    </FormGroup>             
                  </Col>
                </Row>
              </Col>
              <Col md={12}>
                <UsersData data={userList} editUserAction={this.handleEditUser} deleteUserAction={this.handleDeleteUser} dataTableLoadingStatus = {this.state.loading} />
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Modal isOpen={modal} toggle={this.toggle} className="full-width-modal-section organization-modal">
          <ModalHeader toggle={this.toggle}>User Info</ModalHeader>
          <Form onSubmit={this.submitHandler} noValidate>
            <ModalBody>
              <FormErrors formErrors={this.state.formErrors} />
              <Row>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="first_name">First Name</Label>            
                    <Input type="text" placeholder="First Name *" id="first_name" name="first_name" value={this.state.formField.first_name} onChange={this.changeHandler} required />
                  </FormGroup>
                </Col>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="last_name">Last Name</Label>            
                    <Input type="text" placeholder="Last Name *" id="last_name" name="last_name" value={this.state.formField.last_name} onChange={this.changeHandler} />
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
                <Col md={"6"}>
                { this.state.formField.profilePic ? <img src={this.state.formField.profilePic} alt={this.state.formField.first_name} width="100" /> : '' }
                </Col>
              </Row>           
            </ModalBody>
            <ModalFooter>
              {changeStatusBtn}
              <Button color="primary" disabled={!this.state.formValid || formProccessing} type="submit">{formProccessing ? processingBtnText : 'Submit' }</Button>
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Form>
        </Modal>
       
      </div>

    )
  }
}

export default Users;
