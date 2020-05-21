import React, { Component } from 'react';
import { Card, CardBody, Col, Row, Button, Form, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';

import Loader from '../../Loader/Loader';
import UsersData from './SubscribedAdvertiserListData';

class SubscribedAdvertiserList extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      userList: [],
      rowIndex: -1,
      changeStatusBtn:'',
      formField: {profileId:'', userName: '', transactionProfileId: '', amount: '', planName: '', planDuration: '', startDate:'', endDate:'', status:'' },
    }

    this.handleEditUser = this.handleEditUser.bind(this);
  }
  componentDidMount() { 
    this.userList();
  }

  /*User List API*/
  userList() {
    
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken(`statistics/advertiser-list`)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( {  loading: false } );
            toast.error(res.data.message);    
            return;
          }
          this.setState({loading:false, userList: res.data.data.listItem});
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

  /* Edit User*/
  handleEditUser(rowIndex){
    const userInfo = this.state.userList[rowIndex];
    const formField = {
      profileId:userInfo.profileId,
      userName: userInfo.userName, 
      transactionProfileId: userInfo.transactionProfileId, 
      amount: userInfo.amount, 
      planName: userInfo.planName, 
      planDuration: userInfo.planDuration,
      startDate: userInfo.startDate,
      endDate: userInfo.endDate,
      status: userInfo.statusLabel
    };

    const statusBtn = <Button type="button" size="sm" className={`changeStatusBtn `+( userInfo.status ? 'btn-danger' : 'btn-success' )} onClick={() => 
      this.changeProfileStatus(userInfo.profileId, userInfo.status )} >{ ( userInfo.status ? 'De-Activate Account' : 'Activate Account' )}</Button>
    
    this.setState({rowIndex: rowIndex, formField: formField, modal: true, changeStatusBtn:statusBtn, formValid: true});
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      rowIndex: -1,
      changeStatusBtn: '',
      formField: {profileId:'', userName: '', transactionProfileId: '', amount: '', planName: '', planDuration: '', startDate:'', endDate:'', status:'' },
    });
  }

  render() {

    const { userList, loading, modal } = this.state;     
    let loaderElement = '';
    if(loading) 
      loaderElement = <Loader />

      //const processingBtnText = <>Submit <i className="fa fa-spinner"></i></>;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <ToastContainer />
                {loaderElement}
                <UsersData data={userList} editUserAction={this.handleEditUser} deleteUserAction={this.handleDeleteUser} dataTableLoadingStatus = {this.state.loading} />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal isOpen={modal} toggle={this.toggle} className="full-width-modal-section organization-modal">
          <ModalHeader toggle={this.toggle}>Subscribed Advertiser Info</ModalHeader>
          <Form noValidate>
            <ModalBody>
              <Row>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="userName">Advertiser Name</Label>            
                    <Input type="text" id="userName" name="userName" value={this.state.formField.userName} disabled />
                  </FormGroup>
                </Col>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="transactionProfileId">Subscription ID</Label>            
                    <Input type="text" id="transactionProfileId" name="transactionProfileId" value={this.state.formField.transactionProfileId} disabled />
                  </FormGroup>
                </Col>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="planName">Plan Name</Label>            
                    <Input type="text" id="planName" name="planName" value={this.state.formField.planName} disabled/>
                  </FormGroup>
                </Col>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="planDuration">Plan Duration</Label>            
                    <Input type="text" id="planDuration" name="planDuration" value={this.state.formField.planDuration} disabled />
                  </FormGroup>
                </Col>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="amount">Amount</Label>            
                    <Input type="text" id="amount" name="amount" value={`$`+this.state.formField.amount} disabled/>
                  </FormGroup>
                </Col>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="status">Status</Label>            
                    <Input type="text" id="status" name="status" value={this.state.formField.status} disabled />
                  </FormGroup>
                </Col>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="startDate">Start Date</Label>            
                    <Input type="text" id="startDate" name="startDate" value={(new Date(this.state.formField.startDate)).toLocaleDateString("en-US") } disabled/>
                  </FormGroup>
                </Col>
                <Col md={"6"}>  
                  <FormGroup> 
                    <Label htmlFor="endDate">End Date</Label>            
                    <Input type="text" id="endDate" name="endDate" value={(new Date(this.state.formField.endDate)).toLocaleDateString("en-US") } disabled />
                  </FormGroup>
                </Col>
              </Row>           
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggle}>Close</Button>
            </ModalFooter>
          </Form>
        </Modal>

      </div>

    )
  }
}

export default SubscribedAdvertiserList;
