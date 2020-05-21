import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, Input, FormGroup, FormFeedback, Label, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';
import SubscriptionData from './SubscriptionData';
import './Subscription.css'

class AdvertiserSubscription extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      planList: [],
      loading: true,
      formProccessing: false,
      rowIndex: -1,
      changeStatusBtn:'',
      formField: { plan_name: '', monthlyAmount: '', yearlyAmount: '', plan_type:'', advertisementAccess: '', description: '', isTrail: false, trail_days: 0},
      formErrors: { plan_name: '', monthlyAmount: '', yearlyAmount: '', plan_type:'', advertisementAccess: '', description: '', error: ''},
      formValid: true,     
    } 
    this.handleEditSubscription = this.handleEditSubscription.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  // Fetch the Plan List
  componentDidMount() {
    this.planList();
  }

  /*Plan List API*/
  planList(filterItem = {}) {
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('subscription?planType=1')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }
          this.setState({loading:false, planList: res.data.data});     
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
    } )
  }
  
  /* Submit Form Handler*/
  submitHandler (event) {
    event.preventDefault();
    event.target.className += " was-validated";
    if(this.validateForm() === false)
      return false;
    this.setState( { formProccessing: true}, () => {
      const formInputField = this.state.formField;
      
      const formData = {
        "planType": 1,
        "planName": formInputField.plan_name, 
        "planVariation": [{amount: Number(formInputField.monthlyAmount) , duration:1}, {amount: Number(formInputField.yearlyAmount), duration:4 } ],
        "advertisementAccess": Number(formInputField.advertisementAccess), 
        "description": formInputField.description
      };
      const rowIndex = this.state.rowIndex;
      if(rowIndex > -1) {
        const planInfo = this.state.planList[rowIndex];
        commonService.putAPIWithAccessToken('subscription/'+planInfo.planId, formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {          
            this.setState( { formProccessing: false} );
            toast.error(res.data.message);
            return;
          } 
          this.setState({ modal: false, formProccessing: false});
          toast.success(res.data.message);
          this.planList();         
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
        commonService.postAPIWithAccessToken('subscription', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) { 
            this.setState( { formProccessing: false} );
            toast.error(res.data.message);
            return;
          } 
          this.setState({ modal: false});
          toast.success(res.data.message);
          this.planList();
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
    const formField = this.state.formField; 
    formField[name] = value;
    const isValid = event.target.validity.valid;
    const validationMessage = event.target.validationMessage;    
    this.setState({ formField: formField },
                  () => { this.validateField(name, value, isValid, validationMessage) });
  };
  
  /* Validate Form Field */
  validateField(fieldName, value, isValid, errorMessage) {
    let fieldValidationErrors = this.state.formErrors;
    fieldValidationErrors.error = '';
   
    if(!isValid)
        fieldValidationErrors[fieldName] = errorMessage;
    else
        fieldValidationErrors[fieldName] = '';
    this.setState({formErrors: fieldValidationErrors,       
                  }, this.validateForm);
  }
  /* Validate Form */
  validateForm() {
    const formErrors = this.state.formErrors;
    const formField = this.state.formField;
    return (formErrors.plan_name === "" && formField.plan_name !== "" && formErrors.monthlyAmount === "" && formField.monthlyAmount !== ""
        && formErrors.advertisementAccess === "" && formField.advertisementAccess !== ""
        && formErrors.description === "" && formField.description !== ""
        && formErrors.yearlyAmount === "" && formField.yearlyAmount !== ""
        ) 
      ? true : false;
  }
  /* Set Error Class*/
  errorClass(error) {
    return(error.length === 0 ? '' : 'has-error');
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      rowIndex: -1,
      formValid: true,
      changeStatusBtn: '',
      formField: { plan_name: '', monthlyAmount: '', yearlyAmount: '', duration: '', plan_type:'', advertisementAccess: '', description: '', isTrail: false, trail_days: 0},
      formErrors: { plan_name: '', monthlyAmount: '', yearlyAmount: '', duration: '', plan_type:'', advertisementAccess: '', description: '', error: ''},
    });
  }
  /* Edit Subscription*/
  handleEditSubscription(rowIndex){
      const planInfo = this.state.planList[rowIndex];
      let pmon = planInfo.planVariation[0];
      let pyear = planInfo.planVariation[1];
      
      const formField = {
        planId: planInfo.planId, 
        plan_name: planInfo.planName, 
        monthlyAmount: ( pmon!==undefined ? pmon.amount : '' ), 
        yearlyAmount: ( pyear!==undefined ? pyear.amount : '' ), 
        advertisementAccess: planInfo.advertisementAccess, 
        description: planInfo.description };
      const statusBtn = <Button type="button" size="sm" className={`changeStatusBtn `+( planInfo.status ? 'btn-danger' : 'btn-success' )} onClick={() => 
        this.changeSubscriptionStatus(planInfo.planId, planInfo.status )} >{ ( planInfo.status ? 'Change to Inactive' : 'Change to Active' )}</Button>
        
      this.setState({rowIndex: rowIndex, formField: formField, modal: true, changeStatusBtn:statusBtn, formValid: true});
  }
  /* Change Subscription status*/
  changeSubscriptionStatus(planId,status){
    console.log(planId,status);
   
    this.setState( { loading: true}, () => {
      const formData = {
        "status": (status ? false : true ),
      };
      commonService.putAPIWithAccessToken('subscription/update-status/'+planId, formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {           
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          } 
          this.setState({ modal: false, loading: false});
          toast.success(res.data.message);
          this.planList();        
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
  
  render() {

    const { planList, loading, modal, formProccessing, formErrors, changeStatusBtn } = this.state;     
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
                <strong>Food Truck Subscription Plan List</strong> <Button color="button" className="categoryAdd btn-primary" type="button" onClick={this.toggle}><i className="fa fa-plus"></i> Add New</Button>
              </CardHeader>
              <CardBody>                
                <Row>                 
                  <Col md={12}>
                    <SubscriptionData data={planList} editSubscriptionAction={this.handleEditSubscription} deleteSubscriptionAction={this.handleDeleteSubscription} dataTableLoadingStatus = {this.state.loading} />
                  </Col>
                </Row> 
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={modal} toggle={this.toggle} className="full-width-modal-section store-modal">
          <ModalHeader toggle={this.toggle}>Plan Info</ModalHeader>
          <Form onSubmit={this.submitHandler} noValidate>
            <ModalBody>              
              <Row>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="plan_name">Plan Name *</Label>            
                    <Input type="text" placeholder="Plan Name" id="plan_name" name="plan_name" value={this.state.formField.plan_name} onChange={this.changeHandler} required />
                    <FormFeedback>{formErrors.plan_name}</FormFeedback>
                  </FormGroup>  
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="advertisementAccess">Number of Listing *</Label>            
                    <Input type="text" placeholder="Number of Listing" pattern="[0-9]*" id="advertisementAccess" name="advertisementAccess" value={this.state.formField.advertisementAccess} onChange={this.changeHandler} required />
                    <FormFeedback>{formErrors.advertisementAccess}</FormFeedback>
                  </FormGroup>  
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="monthlyAmount">Monthly Amount ($) *</Label>            
                    <Input type="text" placeholder="Monthly Amount *" id="monthlyAmount" name="monthlyAmount" value={this.state.formField.monthlyAmount} onChange={this.changeHandler} required />
                    <FormFeedback>{formErrors.monthlyAmount}</FormFeedback>
                  </FormGroup>  
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="yearlyAmount">Yearly Amount ($) *</Label>            
                    <Input type="text" placeholder="Yearly Amount *" id="yearlyAmount" name="yearlyAmount" value={this.state.formField.yearlyAmount} onChange={this.changeHandler} required />
                    <FormFeedback>{formErrors.yearlyAmount}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col md={"12"}>
                  <FormGroup> 
                    <Label htmlFor="description">Plan Description *</Label>            
                    <Input type="textarea" placeholder="Plan Description" name="description" value={this.state.formField.description} onChange={this.changeHandler} required />
                    <FormFeedback>{formErrors.description}</FormFeedback>
                  </FormGroup>  
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


export default AdvertiserSubscription;
