import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../../core/services/commonService';
import { FormErrors } from '../../../Formerrors/Formerrors';
import Loader from '../../../Loader/Loader';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VaTaskData from './VaTaskData';


class VaTaskListing extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,      
      itemList: [],
      clientList:[],
      vaLists: [],
      loading: true,
      formProccessing: false,
      rowIndex: -1,
      formField: { taskId: '', clientId: '', vaAuthId: '', projectId: '', title: '', description:'' },
      formErrors: { clientId: '', projectId: '',  title:'', description: '', error: ''},
      formValid: false,
      filterItem: { filterVaAuth:'', filterProjectId:'', filterTitle: '', filterFrom:'',  filterTo:''}
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
    this.vaListItem({});
    this.clientListItem({});
  }

  /*VA Request List API*/
  itemList(filterItem = {}) {
    let filterQuery = "?pageSize=10000";
    if(filterItem.filterProjectId !== undefined && filterItem.filterProjectId !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&projectId="+filterItem.filterProjectId: "&projectId="+filterItem.filterProjectId;
    if(filterItem.filterTitle !== undefined && filterItem.filterTitle !== "" ) 
     filterQuery += (filterQuery !=="" ) ? "&title="+filterItem.filterTitle: "&title="+filterItem.filterTitle;
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
      commonService.getAPIWithAccessToken('va-task'+filterQuery)
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

  /* Client List API */
  clientListItem(filterItem = {}) {
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('organization?pageSize=1000')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }
          this.setState({loading:false, clientList: res.data.data.profileList}); 
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
  /* VA List API */
  vaListItem(filterItem = {}) {
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('va-assignment/clients-va?pageSize=1000')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }
          this.setState({loading:false, vaLists: res.data.data.requestList}); 
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

  filterItemList(){
    const filterItem = this.state.filterItem;
    this.itemList(filterItem);
  }

  /* Submit Form Handler*/
  submitHandler (event) {
    event.preventDefault();
    event.target.className = " was-validated";
    const formInputField = this.state.formField;
    if( formInputField.clientId==='' || formInputField.vaAuthId==='' || formInputField.title==='' || formInputField.description===''){
      toast.error("Please fill are mandatory fields!");
      return;
    }
      
    this.setState( { formProccessing: true}, () => {
      const formData = {
        "vaAuthId": formInputField.vaAuthId,
        "organizationId": formInputField.clientId,
        "projectId": formInputField.projectId,
        "title": formInputField.title,
        "description": formInputField.description
      };
      const rowIndex = this.state.rowIndex;
      if(rowIndex > -1) {
        formData['vaTaskId'] = formInputField.vaTaskId;
       
        commonService.putAPIWithAccessToken('va-task', formData)
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
        commonService.postAPIWithAccessToken('va-task', formData)
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
      case 'clientId':        
        fieldValidationErrors.clientId = (value !== '') ? '' : ' is required';
        break;
      case 'vaAuthId':        
        fieldValidationErrors.vaAuthId = (value !== '') ? '' : ' is required';
        break;
      case 'title':        
        fieldValidationErrors.title = (value !== '') ? '' : ' is required';
        break;
      case 'description':        
        fieldValidationErrors.description = (value !== '') ? '' : ' is required';
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
      (formErrors.title === "" && formField.title !== "" && formErrors.vaAuthId === "" && formField.vaAuthId !== "") 
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
      formField: { taskId: '', clientId: '', vaAuthId: '', projectId: '', title: '', description:'' },
      formErrors: {clientId: '', vaAuthId: '', projectId: '', title: '', description:'', error: ''}
    });
  }

  handleEditItem(rowIndex){
    const itemInfo = this.state.itemList[rowIndex];
    const formField = {
      clientId: itemInfo.authId,
      vaAuthId: itemInfo.vaAuthId,
      vaTaskId: itemInfo.vaTaskId,
      projectId: itemInfo.projectId,
      title: itemInfo.title,
      description: itemInfo.description,
    };
    const statusBtn = <Button type="button" size="sm" className={`changeStatusBtn `+( itemInfo.status ? 'btn-danger' : 'btn-success' )} onClick={() => 
      this.changeProfileStatus(itemInfo.vaRequestId, itemInfo.status )} >{ ( itemInfo.status ? 'De-Activate Account' : 'Activate Account' )}</Button>
    
    this.setState({rowIndex: rowIndex, formField: formField, modal: true, changeStatusBtn:statusBtn, formValid: true});
  }
  
  /* Delete Record*/
  handleDeleteItem(rowIndex){
    const requestInfo = this.state.itemList[rowIndex];
    let formdata = { "vaTaskId":requestInfo.vaTaskId }

    this.setState( { loading: true}, () => {
      commonService.deleteAPIWithAccessToken( 'va-task',formdata)
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
      filterItem: { filterFrom:'',  filterTo:'', filterProjectId:'', filterTitle:''}
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

    const { itemList, loading, modal, formProccessing, clientList, vaLists, filterItem, formField } = this.state;

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
                <strong>VA Task List</strong> <Button color="primary" className="categoryAdd" type="button" onClick={this.toggle}><i className="fa fa-plus"></i> Add New Task</Button>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md={12}>
                    <Row className="filterRow">                      
                      <Col md={"2"} className="pl-3">
                        <FormGroup> 
                          <Label htmlFor="filter">VA User</Label>            
                          <Input type="select" placeholder="Filter by VA " id="filterVaAuth" name="filter_organization_id" value={filterItem.filter} onChange={this.changeFilterHandler} >
                            <option value="">All</option>
                            {vaLists.map((vaInfo, index) =>
                              <SetVaDropDownItem key={index} vaInfo={vaInfo} />
                            )}
                          </Input>
                        </FormGroup> 
                      </Col>
                      {/* <Col md={"2"}>
                        <FormGroup> 
                          <Label htmlFor="filterProjectId">Project</Label>
                          <Input type="select" name="filterProjectId" id="filterProjectId" value={filterItem.filterProjectId} onChange={this.changeFilterHandler}>
                            <option value="">All</option>
                            <option value="1">Project 1</option>
                            <option value="2">Project 2</option>
                            <option value="3">Project 3</option>
                            <option value="4">Project 4</option>
                          </Input>
                        </FormGroup>
                      </Col> */}
                      <Col md={"5"}>
                        <FormGroup> 
                          <Label htmlFor="filterTitle">Task Name</Label>            
                          <Input type="text" name="filterTitle" id="filterTitle" value={filterItem.filterTitle} onChange={this.changeFilterHandler}>
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
                    <VaTaskData data={itemList} editItemAction={this.handleEditItem} deleteItemAction={this.handleDeleteItem} dataTableLoadingStatus = {this.state.loading} />
                  </Col>
                </Row> 
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={modal} toggle={this.toggle} className="full-width-modal-section store-modal">
          <ModalHeader toggle={this.toggle}>VA Task Info</ModalHeader>
          <Form onSubmit={this.submitHandler} noValidate>
            <ModalBody>
              <FormErrors formErrors={this.state.formErrors} />
              <Row>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="clientId">Client *</Label>            
                    <Input type="select" id="clientId" name="clientId" value={formField.clientId} onChange={this.changeHandler} required >
                      <option value="">Select Client</option>
                      {clientList.map((clientInfo, index) =>
                        <SetClientDropDownItem key={index} clientInfo={clientInfo} />
                      )}
                    </Input>
                  </FormGroup> 
                </Col>
                <Col md={"6"}>
                  <FormGroup>
                    <Label htmlFor="vaAuthId">VirDrop VA *</Label>            
                    <Input type="select" id="vaAuthId" name="vaAuthId" value={formField.vaAuthId} onChange={this.changeHandler} required >
                      <option value="">Select VA</option>
                      {vaLists.map((vaInfo, index) =>
                        <SetVaDropDownItem key={index} vaInfo={vaInfo} />
                      )}
                    </Input>
                  </FormGroup>  
                </Col>
                {/* <Col md={"6"}>
                  <div className="form-group">
                    <label htmlFor="projectId">Project </label>
                    <Input type="select" name="projectId" id="projectId" className="form-control" value={formField.projectId} onChange={this.changeHandler}>
                      <option value="1">Project 1</option>
                      <option value="2">Project 2</option>
                      <option value="3">Project 3</option>
                      <option value="4">Project 4</option>
                    </Input>
                  </div>
                </Col> */}
                <Col md={"12"}>
                  <FormGroup>
                    <label htmlFor="title">Task Name *</label>
                    <input type="text" name="title" id="title" className="form-control" placeholder="Task Name" value={formField.title} onChange={this.changeHandler} required />
                  </FormGroup>
                </Col>
                <Col md={"12"}>
                  <FormGroup>
                    <Label htmlFor="description">Description *</Label>
                    <Input type="textarea" name="description" className="form-control" value={formField.description} onChange={this.changeHandler} required></Input>
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

function SetVaDropDownItem (props) {
  const vaUserInfo = props.vaInfo;
  return (<option value={vaUserInfo.authId} >{vaUserInfo.firstName+' '+vaUserInfo.lastName}</option>)
}

function SetClientDropDownItem (props) {
  const vaClientInfo = props.clientInfo;
  return (<option value={vaClientInfo.authId} >{vaClientInfo.firstName+' '+vaClientInfo.lastName}</option>)
}

export default VaTaskListing;
