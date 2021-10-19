import React, { Component } from 'react';
import { 
  Card, CardBody, Col, Row, Form, Input, FormGroup, Label,
  Modal, ModalHeader, ModalBody
} from 'reactstrap';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../../core/services/commonService';

import TransactionData from './VaTransactionData';
import Loader from '../../../Loader/Loader';


class VaTransactionLists extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      dataLists: [],
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
  }

  /* Transaction List API */
  itemLists(filterItem = {}) {
    let strWalkQuery = "?pageSize=10000";
      this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('statistics/va-payment-history/'+strWalkQuery)
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
          }
          else {
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

  
  render() {
    const { dataLists, loading, modal, formField  } = this.state;
        
    let loaderElement = '';
    if(loading)        
      loaderElement = <Loader />

    return (
      <div className="user-dashboard">
        {loaderElement}
        <Card>
          <CardBody>
            
            <Row>
              
              <Col md={12}>
                <TransactionData data={dataLists} editDataAction={this.handleEditData} dataTableLoadingStatus = {this.state.loading} />
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

export default VaTransactionLists;
