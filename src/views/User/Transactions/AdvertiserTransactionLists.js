import React, { Component } from 'react';
import { 
  Card, CardBody, Col, Row, Form, Input, FormGroup, Label, Button,
  Modal, ModalHeader, ModalBody, CardHeader, Nav, NavItem
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';

import ReviewData from './TransactionData';
import Loader from '../../Loader/Loader';


class AdvertiserTransactionLists extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      dataLists: [],
      currentPalnData:'',
      formProccessing: false,
      loading: true,
      rowIndex: -1,
      formField: { transactionProfileId: '', amount:'', planName: '', planTypeLabel:'', planDuration:'', status:'', startDate:'', endDate:'', createdAt:'' },
    } 
    this.handleEditData = this.handleEditData.bind(this);
  }

  componentDidMount() {     
    const { match : { params } } = this.props;
    let foodtruckId = '';
    if(params.foodtruckId!== undefined){
      foodtruckId = params.foodtruckId;
    }
    this.itemLists({filter_foodTruckId: foodtruckId});

    this.getCurrentPlan();
  }

  /*get current subscription API*/
  getCurrentPlan() {
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('profile/advertisement-subscription')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }
          const planData = res.data.data;
          this.setState({loading:false, currentPalnData: planData});
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }
        } )
    } )
 }
 

  /* Transaction List API */
  itemLists(filterItem = {}) {
    let strWalkQuery = "?pageSize=10000";
    
      this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('statistics/advertiser-payment-history/'+strWalkQuery)
        .then( res => {        
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }   
          this.setState({loading:false, dataLists: res.data.data.listItem});              
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

  
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      rowIndex: -1,
      formField: {  transactionProfileId: '', planDuration: '', planTypeLabel:'', amount:'', status:'', startDate:'', endDate:'', createdAt:'' },
    });
  }

  /* To edit review details/ change status */
  handleEditData(rowIndex){
      const rowData = this.state.dataLists[rowIndex];
      const formField = {
          subscriberId: rowData.subscriberId,
          transactionProfileId: rowData.transactionProfileId,
          planDuration: rowData.planDuration,
          amount: '$'+rowData.amount,
          planName: rowData.planName,
          planTypeLabel: rowData.planTypeLabel,
          startDate: (new Date(rowData.startDate)).toLocaleDateString("en-US"),
          endDate: (new Date(rowData.endDate)).toLocaleDateString("en-US"),
          createdAt: (new Date(rowData.createdAt)).toLocaleDateString("en-US"),
          status: rowData.statusLabel,
      }
      this.setState({rowIndex: rowIndex, formField: formField, modal: true });
  }

  //Cancel subscription
  cancelSubscription(subscriberId){
    if(subscriberId!==''){
      if (window.confirm('Are you sure you want to cancel this subscription?')) {
        const formData = {
          "subscriberId": subscriberId
        }
        this.setState( { loading:true }, () =>{
          commonService.postAPIWithAccessToken('subscription/cancel', formData)
          .then( res => {
            if ( undefined === res.data.data || !res.data.status ) {           
              this.setState( { loading: false} );
              toast.error(res.data.message);
              return;
            }
            toast.success(res.data.message);
            this.itemLists();
            this.getCurrentPlan();
          })
          .catch( err => {
            if(err.response !== undefined && err.response.status === 401) {
              localStorage.clear();
              this.props.history.push('/login');
            }else{
              this.setState( { loading: false } );
              toast.error(err.message);
            }
          })
        } );
      }
    }
  }

  
  render() {
    const { dataLists, loading, modal, formField, currentPalnData } = this.state;
        console.log(currentPalnData);
    let loaderElement = '';
    if(loading)        
      loaderElement = <Loader />

    return (
      <div className="user-dashboard">
        {loaderElement}
        { ( localStorage.getItem( 'isOrganization' )=== "true" && localStorage.getItem( 'isAdvertiser' )=== "true" ) && <> 
        <Nav tabs>
          <NavItem>
            <Link className="nav-link" to="/user/transactions">Food Truck Subscription</Link>
          </NavItem>
          <NavItem>
            <Link className="nav-link active" to="/advertiser/transactions">Advertisement Subscription</Link>
          </NavItem>
        </Nav>
        </>
        }
        
        <Card className="mb-3">
          <CardHeader className="mainHeading">
            <h5 className="m-0 p-0">Subscription Info</h5>
          </CardHeader>
          <CardBody className="transaction-details">
            { ( currentPalnData!=='' && currentPalnData.isActive ) &&
            <Row className="pl-2">
              <Col md="4"> Subscription Type: <strong>{currentPalnData.planInfo.planDuration}</strong></Col>
              <Col md="4"> Subscription Id: <strong>{currentPalnData.planInfo.transactionProfileId}</strong></Col>
              <Col md="4"> Subscription Amount: <strong>
                { (currentPalnData.planInfo.isTrail ? ' Free Trial ' : '$'+currentPalnData.planInfo.amount )  }
                </strong>
              </Col>
              <Col md="4"> Payment Method: <strong>PayPal</strong></Col>
              <Col md="4"> Start Date: <strong>{(new Date(currentPalnData.planInfo.startDate)).toLocaleDateString("en-US")}</strong></Col>
              <Col md="4"> Expiry Date: <strong>{(new Date(currentPalnData.planInfo.expiryDate)).toLocaleDateString("en-US")}</strong></Col>
              <Col md="12" className="mt-4">
                <Button color="danger" onClick={ () =>  this.cancelSubscription(currentPalnData.planInfo.subscriberId) }>Cancel Subscription</Button> &nbsp; 
                <Link to="/advertiser-plan" className="btn btn-warning">Upgrade Subscription</Link>
              </Col>
            </Row>
            }
            
            { ( currentPalnData==='' && currentPalnData.isActive==='false' ) &&
              <div className="text-center pt-3">
                <h4>You don't have purchased any subscription plan yet.</h4>
                <Link to="/subscription-plan" className="btn btn-primary">Choose a subscription plan now</Link>
              </div>
            }
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <Row>
              <Col md={12}>
                <ReviewData data={dataLists} editDataAction={this.handleEditData} dataTableLoadingStatus = {this.state.loading} />
              </Col>
            </Row> 
          </CardBody>
        </Card>

        <Modal isOpen={modal} toggle={this.toggle} size="lg" className="full-width-modal-section equiry-modal">
          <ModalHeader toggle={this.toggle}>Transaction Details</ModalHeader>
          <Form noValidate className="texQueForm">
            <ModalBody>
              
              <Row>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="subscriberId">Subscription Id</Label>            
                    <Input type="text" placeholder="Subscriber Id" id="subscriberId" name="subscriberId" value={formField.transactionProfileId} disabled />
                  </FormGroup>  
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="planTypeLabel">Plan Type</Label>            
                    <Input type="text" placeholder="Transaction Type" id="planTypeLabel" value={formField.planTypeLabel} disabled />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="amount">Amount</Label>            
                    <Input type="text" id="amount" name="amount" value={formField.amount} disabled />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="planDuration">Duration</Label>            
                    <Input type="text" placeholder="Transaction ProfileId" id="planDuration" value={formField.planDuration} disabled />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="startDate">Start Date</Label>            
                    <Input type="text" id="startDate" name="startDate" value={formField.startDate} disabled />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="endDate">End Date</Label>            
                    <Input type="text" id="endDate" name="endDate" value={formField.endDate} disabled />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="createdAt">Created On</Label>            
                    <Input type="text" id="createdAt" name="createdAt" value={formField.createdAt} disabled />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="status">Status</Label>            
                    <Input type="text" name="status" id="status" value={ formField.status } disabled />
                  </FormGroup>
                </Col>
                
              </Row>
            </ModalBody>
          </Form>
        </Modal>
      </div>

    );
  }
}

export default AdvertiserTransactionLists;
