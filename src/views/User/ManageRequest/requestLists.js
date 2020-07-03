import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, CardHeader, CardBody, Col, Row, Button, Form, Input, FormGroup, FormText, Label,
  Modal, ModalHeader, ModalBody, ModalFooter, 
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import './requestLists.css';

class requestLists extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      dataLists: [],
      formProccessing: false,
      loading: false,
      rowIndex: -1,
      formField: { vaRequestId: '', vaType: '', natureOfBusiness: '', engagementType:'', engagementDescription:'', numberOfVA:'', skillSet:'' },
      filterItem: { filter:'', filterVaType: '', filterNOB:'',  filterFrom:'',  filterTo:''}
    } 
    this.filterItemList = this.filterItemList.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleEditData = this.handleEditData.bind(this);
    this.handleDeleteData = this.handleDeleteData.bind(this);
  }

  componentDidMount() {        
    this.itemLists({});
  }

  /* Request List API */
  itemLists(filterItem = {}) {
    let filterQuery = "?pageSize=10000";
   if(filterItem.filterFrom !== undefined && filterItem.filterFrom !== "" ){
      let newFromDate = this.getFormatDate( filterItem.filterFrom );
      filterQuery += (filterQuery !=="" ) ? "&start_date="+newFromDate : "?start_date="+newFromDate;
    }
    if(filterItem.filterTo !== undefined && filterItem.filterTo !== "" ){
      let newToDate = this.getFormatDate( filterItem.filterTo );
      filterQuery += (filterQuery !=="" ) ? "&end_date="+newToDate: "?end_date="+newToDate;
    }
    if(filterItem.filterVaType !== undefined && filterItem.filterVaType !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&vaType="+filterItem.filterVaType: "?vaType="+filterItem.filterVaType;
    
    if(filterItem.filterNOB !== undefined && filterItem.filterNOB !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&natureOfBusiness="+filterItem.filterNOB: "?natureOfBusiness="+filterItem.filterNOB;
    
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('va-request'+filterQuery)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }
          this.setState({loading:false, dataLists: res.data.data.requestList});         
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
        "vaType": formInputField.vaType,
        "natureOfBusiness": formInputField.natureOfBusiness,
        "engagementType": formInputField.engagementType,
        "engagementDescription": formInputField.engagementDescription,
        "numberOfVA": formInputField.numberOfVA,
        "skillSet": formInputField.skillSet
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
          this.itemLists();        
          toast.success(res.data.message);
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
              this.setState( { loading: false} );
              toast.error(res.data.message);
              return;
            }
            this.setState({ loading: false, modal: false, formProccessing: false });
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
      }
    } );  
  };
  
  /* Input Field On changes*/
  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    const formField = this.state.formField
    formField[name] = value;
    this.setState({ formField: formField });
  };
  
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      rowIndex: -1,
      formField: { vaRequestId: '', vaType: '', natureOfBusiness: '', engagementType:'', engagementDescription:'', numberOfVA:'', skillSet:'' },
    });
  }

  filterItemList(){
    const filterItem = this.state.filterItem;
    this.itemLists(filterItem);
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
      filterItem: { filterFrom:'',  filterTo:'', filterStatus:''}
    });
    this.itemLists();
  }

  /* To edit review details/ change status */
  handleEditData(rowIndex){
    const rowData = this.state.dataLists[rowIndex];
    //console.log(rowData); return;
    const formField = {
        vaRequestId: rowData.vaRequestId,
        vaType: rowData.vaType,
        natureOfBusiness: rowData.natureOfBusiness,
        engagementType: rowData.engagementType,
        engagementDescription: rowData.engagementDescription,
        numberOfVA: rowData.numberOfVA,
        skillSet: rowData.skillSet,
    }
    this.setState({rowIndex: rowIndex, formField: formField, modal: true });
  }

  handleDeleteData(rowIndex){
    const rowInfo = this.state.dataLists[rowIndex];
    const delFormData = {
      "vaRequestId": rowInfo.vaRequestId,
    };
    this.setState( { loading: true}, () => {
      commonService.deleteAPIWithAccessToken( `va-request`, delFormData)
        .then( res => {
          if ( undefined === res.data || !res.data.status ) {            
            this.setState( { loading: false} );
            toast.error(res.data.message);      
            return;
          }         
          this.setState({ loading: false});
          this.itemLists();        
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

  getFormatDate(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 101).toString().substring(1);
    var day = (date.getDate() + 100).toString().substring(1);
    return year + "-" + month + "-" + day;
  }
  
  render() {
    const { dataLists, loading, modal, formField, formProccessing, filterItem } = this.state;
    const processingBtnText = <>Submit <i className="fa fa-spinner"></i></>;
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
                    <h4 className="card-title"><img src="/images/timezone.svg" height="30" alt="" /> Manage Request</h4>
                  </div>
                  <div className="add-option-info">
                    <Link className="btn-add" to="/user/intake-form">Add New Request</Link>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="item-list-section">
                <div className="Search-filter">
                  <div className="row">
                      <div className="col-md-3">
                        <div className="form-group">
                          <Input type="select" name="filterVaType" value={filterItem.filterVaType} onChange={this.changeFilterHandler}>
                            <option value="">Type of Virtual Assistance</option>
                            <option value="1">Business Support</option>
                            <option value="2">Personal Assistance</option>
                          </Input>
                          </div>
                      </div>
                      <div className="col-md-3">
                          <div className="form-group">
                              <Input type="text" name="filterNOB" value={filterItem.filterNOB} onChange={this.changeFilterHandler} placeholder="Nature of business" />
                          </div>
                      </div>
                      <div className="col-md-2">
                          <div className="form-group">
                            <DatePicker className="form-control" selected={ filterItem.filterFrom } placeholderText="From Date" onChange={this.setFilterFromDate} dateFormat="MM/dd/yyyy" />
                          </div>
                      </div>
                      <div className="col-md-2">
                          <div className="form-group">
                            <DatePicker className="form-control" selected={ filterItem.filterTo } onChange={this.setFilterToDate} dateFormat="MM/dd/yyyy" placeholderText="To Date" />
                          </div>
                      </div>
                      <div className="col-md-2">
                          <div className="form-group">
                              <button className="search-btn" onClick={this.filterItemList}>Search</button>
                          </div>
                      </div>
                  </div>
              </div>
                <div className="card-table">
                  <table className="table table-orders">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Type of VA</th>
                        <th>Nature of business </th>
                        <th>Type of engagement</th>
                        <th>No. of VA</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataLists.map((dataInfo, index) => 
                      <tr key={index}>
                        <td>
                          <span className="sno">{index+1}</span>
                        </td>
                        <td>{ ( dataInfo.vaType===1 ? 'Business Support' : 'Personal Assistance' ) }</td>
                        <td>{dataInfo.natureOfBusiness}</td>
                        <td>{ ( dataInfo.engagementType===1 ? 'Project-Based' : 'Ongoing Task' ) }</td>
                        <td>{dataInfo.numberOfVA}</td>
                        <td>{(new Date(dataInfo.createdAt)).toLocaleDateString("en-US")}</td>
                        <td>
                        <UncontrolledDropdown>
                          <DropdownToggle color="default" className="btn-trigger">
                            <img src="/images/more.svg" width="20" alt="more" />
                          </DropdownToggle>
                          <DropdownMenu className="action-dropdown">
                            <DropdownItem onClick={() => { this.handleEditData(index) }} className="edit-btn"><i className="fa fa-pencil"></i> Edit</DropdownItem>
                            <DropdownItem onClick={() => {
                            if (window.confirm('Are you sure you want to delete this record?')) this.handleDeleteData(index) }} className="delete-btn"><i className="fa fa-trash-o"></i> Delete</DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>  
                          
                        </td>
                      </tr>
                     
                      )}

                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>

        <Modal isOpen={modal} size="lg" toggle={this.toggle} className="full-width-modal-section">
          <ModalHeader toggle={this.toggle} className="pb-0">VA Request Info</ModalHeader>
          <Form onSubmit={this.submitHandler} noValidate className="profile-form">
            <ModalBody>
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
              </Row>
             </ModalBody>
            <ModalFooter>
                <Button color="primary" type="submit">{formProccessing ? processingBtnText : 'Save Changes' }</Button>
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default requestLists;
