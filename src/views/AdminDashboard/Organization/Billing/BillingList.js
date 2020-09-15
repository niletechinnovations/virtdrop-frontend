import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../../core/services/commonService';
import { FormErrors } from '../../../Formerrors/Formerrors';
import Loader from '../../../Loader/Loader';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import BillingData from './BillingData';


class BillingList extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      invoiceModal: false,
      itemList: [],
      clientList:[],
      loading: true,
      formProccessing: false,
      rowIndex: -1,
      formField: { invoiceId: '', clientName: '', notes: '', billingHours:'', billingDate:'', status:'' },
      formErrors: { vaAuthId: '', projectId: '',  title:'', error: ''},
      formValid: false,
      filterItem: { filterVaAuth:'', filterClientId:'', filterProjectId:'', filterTitle: '', filterFrom:'',  filterTo:''},
      invoiceField: { invoiceClientId:'', billingFromDate:'', billingToDate:'', billingDescription:''},
    } 
    this.submitHandler = this.submitHandler.bind(this);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.filterItemList = this.filterItemList.bind(this);
    this.handleEditItem = this.handleEditItem.bind(this);
    this.payInvoiceAdmin = this.payInvoiceAdmin.bind(this);
    this.submitInvoiceHandler = this.submitInvoiceHandler.bind(this);
    
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
    if(filterItem.filterVaAuth !== undefined && filterItem.filterVaAuth !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&vaAuthId="+filterItem.filterVaAuth: "&vaAuthId="+filterItem.filterVaAuth;
    if(filterItem.filterClientId !== undefined && filterItem.filterClientId !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&clientId="+filterItem.filterClientId: "&clientId="+filterItem.filterClientId;
    if(filterItem.filterTitle !== undefined && filterItem.filterTitle !== "" ) 
     filterQuery += (filterQuery !=="" ) ? "&invoiceId="+filterItem.filterTitle: "&invoiceId="+filterItem.filterTitle;
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
      commonService.getAPIWithAccessToken('billing'+filterQuery)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }
          this.setState({loading:false, itemList: res.data.data.rowList});
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
        "invoiceId": formInputField.invoiceId,
        "notes": formInputField.notes,
        "status": formInputField.status
      };
      
      this.setState( { loading: true}, () => { 
        commonService.putAPIWithAccessToken('billing', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { formProccessing: false} );
            toast.error(res.data.message);
            return;
          }
          this.setState({ modal: false, loading:false, formProccessing: false});
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
      })
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

  changeInvoiceHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    const invoiceField = this.state.invoiceField
    invoiceField[name] = value;
    this.setState({ invoiceField: invoiceField });
  };

  /* Validate Form Field */
  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    fieldValidationErrors.error = '';
   
    switch(fieldName) {      
      case 'vaAuthId':        
        fieldValidationErrors.vaAuthId = (value !== '') ? '' : ' is required';
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
      (formErrors.title === "" && formField.vaAuthId !== "") 
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
      formField: { invoiceId: '', clientName: '', billingPeriod: '', notes: '', status:'', billingHours:'', billingDate:''},
      formErrors: {vaAuthId: '', status: '', notes: '', error: ''}
    });
  }

  invoiceToggle = () => {
    this.setState({
      invoiceModal: !this.state.invoiceModal,
      invoiceField: { invoiceClientId:'', billingFromDate:'', billingToDate:'', billingDescription:''},
    });
  }

  handleEditItem(rowIndex){
    const itemInfo = this.state.itemList[rowIndex];
    const formField = {
      authId: itemInfo.authId,
      invoiceId: itemInfo.invoiceId,
      clientName: itemInfo.clientName,
      amount: itemInfo.amount,
      billingPeriod: itemInfo.billingTo+' - '+itemInfo.billingTo,
      notes: itemInfo.notes,
      billingHours: itemInfo.billingHours,
      billingDate: itemInfo.billingDate,
      status: itemInfo.status
    };
    const statusBtn = <Button type="button" size="sm" className={`changeStatusBtn `+( itemInfo.status ? 'btn-danger' : 'btn-success' )} onClick={() => 
      this.changeProfileStatus(itemInfo.vaRequestId, itemInfo.status )} >{ ( itemInfo.status ? 'De-Activate Account' : 'Activate Account' )}</Button>
    
    this.setState({rowIndex: rowIndex, formField: formField, modal: true, changeStatusBtn:statusBtn, formValid: true});
  }
  
  /* Delete Record*/
  handleDeleteItem(rowIndex){
    const requestInfo = this.state.itemList[rowIndex];
    let formdata = { "invoiceId":requestInfo.invoiceId }

    this.setState( { loading: true}, () => {
      commonService.deleteAPIWithAccessToken( 'billing',formdata)
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

  submitInvoiceHandler (event) {
    event.preventDefault();
    this.setState( { loading: true, invoiceFormProccessing: true}, () => {
      const invoiveInputField = this.state.invoiceField;
      const formData = {
        "clientId": invoiveInputField.invoiceClientId,
        "billingFrom": this.getFormatDate(invoiveInputField.billingFromDate),
        "billingTo": this.getFormatDate(invoiveInputField.billingToDate),
        "billingDescription": invoiveInputField.billingDescription,
      };
      
      commonService.postAPIWithAccessToken('billing', formData).then( res => {
        if ( undefined === res.data.data || !res.data.status ) {
          this.setState( { loading:false, formProccessing: false} );
          toast.error(res.data.message);
          return;
        }
        this.setState({ invoiceModal: false,  loading:false, formProccessing: false});
        toast.success(res.data.message);
        this.itemList(); 
      } )
      .catch( err => {         
        if(err.response !== undefined && err.response.status === 401) {
          localStorage.clear();
          this.props.history.push('/login');
        }else{
          this.setState( {  loading:false, formProccessing: false } );
          toast.error(err.message);
        }
      } ) 
    } );    
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

  setBillingFromDate = date => {
    let invoiceField = this.state.invoiceField;
    invoiceField.billingFromDate = date;
    this.setState({ invoiceField: invoiceField });
  };
  setBillingToDate = date => {
    let invoiceField = this.state.invoiceField;
    invoiceField.billingToDate = date;
    this.setState({ invoiceField: invoiceField });
  };

  resetfilterForm = () => {
    this.setState({
      filterItem: { filterVaAuth:'',filterClientId:'', filterFrom:'',  filterTo:'', filterProjectId:'', filterTitle:''}
    });
    this.itemList();
  }
  
  getFormatDate(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 101).toString().substring(1);
    var day = (date.getDate() + 100).toString().substring(1);
    return year + "-" + month + "-" + day;
  }

   /* Pay Invoice Item*/
   payInvoiceAdmin(rowIndex){
    const requestInfo = this.state.itemList[rowIndex];
    
    if(requestInfo.invoiceId!==''){
      const formData = {
        "invoiceId": requestInfo.invoiceId,
      }
      this.setState( { loading: true}, () => {
        commonService.postAPIWithAccessToken('payment/pay', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {           
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          }
          if (typeof window !== 'undefined') {
            window.location.href = res.data.data.redirectUrl;
          }
        })
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
    }else{
      this.setState( { loading: false } );
      toast.error("Invalid Invoice ID.");
    }
  }

  render() {

    const { itemList, loading, modal, invoiceModal, formProccessing, clientList, filterItem, formField, invoiceField } = this.state;

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
                <strong>Billing</strong> <Button color="primary" className="categoryAdd" type="button" onClick={this.invoiceToggle}><i className="fa fa-plus"></i> Create New Invoice</Button>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md={12}>
                    <Row className="filterRow">                      
                      <Col md={"2"} className="pl-3">
                        <FormGroup> 
                          <Label htmlFor="filterTitle">Invoice no.</Label>            
                          <Input type="text" name="filterTitle" id="filterTitle" value={filterItem.filterTitle} onChange={this.changeFilterHandler}>
                          </Input>
                        </FormGroup>  
                      </Col>
                      <Col md={"2"}>
                        <FormGroup> 
                          <Label htmlFor="filterClientId">Client</Label>            
                          <Input type="select" placeholder="Filter by Client" id="filterClientId" name="filterClientId" value={filterItem.filterClientId} onChange={this.changeFilterHandler} >
                            <option value="">All</option>
                            {clientList.map((clientInfo, index) =>
                              <SetClientDropDownItem key={index} clientInfo={clientInfo} />
                            )}
                          </Input>
                        </FormGroup> 
                      </Col>
                      <Col md={"2"}>
                        <FormGroup> 
                          <Label>Payment Status</Label>
                          <Input type="select" name="paymentStatus" value={filterItem.filterStatus} onChange={this.changeFilterHandler}>
                            <option value="">All</option>
                            <option value="0">Unpaid</option>
                            <option value="2">Paid</option>
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
                    <BillingData data={itemList} editItemAction={this.handleEditItem} deleteItemAction={this.handleDeleteItem} payInvoiceAction={this.payInvoiceAdmin} dataTableLoadingStatus = {this.state.loading} />
                  </Col>
                </Row> 
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={modal} toggle={this.toggle} className="full-width-modal-section store-modal">
          <ModalHeader toggle={this.toggle}>Invoice Info</ModalHeader>
          <Form onSubmit={this.submitHandler} noValidate>
            <ModalBody>
              <FormErrors formErrors={this.state.formErrors} />
              <Row>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label><strong>Client:</strong> {formField.clientName}</Label>            
                  </FormGroup> 
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label><strong>Billing Period:</strong> {formField.billingPeriod}</Label>            
                  </FormGroup> 
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label><strong>Billing Hours:</strong> {formField.billingHours}</label>
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label><strong>Amount:</strong> ${formField.amount}</label>
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <label><strong>Billing Date:</strong> {(new Date(formField.billingDate)).toLocaleDateString("en-US")}</label>
                  </FormGroup>
                </Col>
                
                <Col md={"6"}>
                  <FormGroup>
                    <label>Notes:</label>
                    <input type="text" name="notes" id="notes" className="form-control" placeholder="Invoice notes" value={formField.notes} onChange={this.changeHandler} />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup> 
                    <Label>Status</Label>
                    <Input type="select" name="status" value={formField.status} onChange={this.changeHandler}>
                      <option value="">Select Status</option>
                      <option value="0">Unpaid</option>
                      <option value="1">Paid</option>
                    </Input>
                  </FormGroup>
                </Col>  
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">{formProccessing ? processingBtnText : 'Update' }</Button>
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Form>
        </Modal>

        <Modal isOpen={invoiceModal} toggle={this.invoiceToggle} className="full-width-modal-section store-modal">
          <ModalHeader toggle={this.invoiceToggle}>Create New Invoice</ModalHeader>
          <Form onSubmit={this.submitInvoiceHandler} noValidate>
            <ModalBody>
              <Row>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="invoiceClientId">Client *</Label>            
                    <Input type="select" id="invoiceClientId" name="invoiceClientId" value={invoiceField.invoiceClientId} onChange={this.changeInvoiceHandler} >
                      <option value="">Select Client</option>
                      {clientList.map((clientInfo, index) =>
                        <SetClientDropDownItem key={index} clientInfo={clientInfo} />
                      )}
                    </Input>
                  </FormGroup> 
                </Col>
                <Col md={"6"}>
                  <FormGroup>
                    <label htmlFor="billingDescription">Notes </label>
                    <input type="text" name="billingDescription" id="billingDescription" className="form-control" placeholder="Invoice Notes" value={formField.billingDescription} onChange={this.changeInvoiceHandler} />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup className="vd-datepicker"> 
                    <Label>Billing From *</Label>
                    <DatePicker className="form-control" selected={ invoiceField.billingFromDate } onChange={this.setBillingFromDate} dateFormat="MM/dd/yyyy" />
                  </FormGroup>  
                </Col>
                <Col md={"6"}>
                  <FormGroup className="vd-datepicker"> 
                    <Label>Billing To *</Label>
                    <DatePicker className="form-control" selected={ invoiceField.billingToDate } onChange={this.setBillingToDate} dateFormat="MM/dd/yyyy" />
                  </FormGroup>  
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">Generate Invoice</Button>
              <Button color="secondary" type="button" onClick={this.invoiceToggle}>Cancel</Button>
            </ModalFooter>
          </Form>
        </Modal>

      </div>

    )
  }
}

function SetClientDropDownItem (props) {
  const vaClientInfo = props.clientInfo;
  return (<option value={vaClientInfo.authId} >{vaClientInfo.firstName+' '+vaClientInfo.lastName}</option>)
}

export default BillingList;
