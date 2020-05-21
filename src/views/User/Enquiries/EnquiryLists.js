import React, { Component } from 'react';
import { 
  Card, CardBody, CardHeader, Col, Row, Button, Form, Input, FormGroup, Label,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';

import EnquiryData from './EnquiryData';
import Loader from '../../Loader/Loader';


class EnquiryLists extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      enquiryLists: [],
      loading: true,
      rowIndex: -1,
      formField: { enquiryId: '', truckName: '', contactPerson: '', phoneNumber:'', comment:'' },
     
    } 
    this.submitHandler = this.submitHandler.bind(this);
    this.handleEditEnquiry = this.handleEditEnquiry.bind(this);
    this.acceptEnquiry = this.acceptEnquiry.bind(this);
    this.rejectEnquiry = this.rejectEnquiry.bind(this);
  }

  // Fetch the Enquiry List
  componentDidMount() {     
    this.enquiryLists({});   
  }

  /* Enquiry List API */
  enquiryLists() {
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('food-truck/enquiry?pageSize=10000')
        .then( res => {
           
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }   

          this.setState({loading:false, enquiryLists: res.data.data.enquiryList});     
         
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
    event.target.className += " was-validated";
    this.setState( { formProccessing: true}, () => {
      const formInputField = this.state.formField;
      const formData = {
        "enquiryId": formInputField.enquiryId,
        "status": formInputField.status, 
        "comments": formInputField.comment
      };
    
      const rowIndex = this.state.rowIndex;
      if(rowIndex > -1) {
        commonService.putAPIWithAccessToken('food-truck/enquiry/status/', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {           
            this.setState( { formProccessing: false} );
            toast.error(res.data.message);
            return;
          } 
          
          this.setState({ modal: false, formProccessing: false});
          toast.success(res.data.message);
          this.enquiryLists();
         
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
          this.enquiryLists();
         
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
      //formField: { truckName: '', contactPerson: '', contactNo:'', numberofPerson:'', eventDate:'', message:'', comment:'', status: '', },
    });
  }

  /* To edit enquiry details/ change status */
  handleEditEnquiry(rowIndex){
      const rowData = this.state.enquiryLists[rowIndex];
      const formField = {
          enquiryId: rowData.enquiryId,
          truckName: rowData.truckName,
          contactPerson: rowData.contactPerson,
          contactNo: rowData.contactNo,
          numberofPerson: rowData.numberofPerson,
          eventDate: rowData.eventDate,
          message: rowData.message,
          comment: rowData.ownerComments,
          statusLabel: rowData.statusLabel,
          status: rowData.status,
      }
      this.setState({rowIndex: rowIndex, formField: formField, modal: true });
  }

  acceptEnquiry(){
    this.setState( { loading: true}, () => {
      const formInputField = this.state.formField;
      const formData = {
        "enquiryId": formInputField.enquiryId,
        "status": 1, 
        "comments": formInputField.comment
      };
      commonService.putAPIWithAccessToken('food-truck/enquiry/status/', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {           
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          } 
          this.setState({ modal: false, loading: false});
          toast.success(res.data.message);
          this.enquiryLists();        
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

  // Reject enquiry
  rejectEnquiry(){
    this.setState( { loading: true}, () => {
      const formInputField = this.state.formField;
      const formData = {
        "enquiryId": formInputField.enquiryId,
        "status": 2, 
        "comments": formInputField.comment
      };
      commonService.putAPIWithAccessToken('food-truck/enquiry/status/', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {           
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          } 
          this.setState({ modal: false, loading: false});
          toast.success(res.data.message);
          this.enquiryLists();        
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
    const { enquiryLists, loading, modal, formField } = this.state;
        
    let loaderElement = '';
    if(loading)        
      loaderElement = <Loader />

    return (
      <div className="user-dashboard">
        {loaderElement}
        <Card>
          <CardHeader className="mainHeading">
            <strong>Inquiry List</strong>
          </CardHeader>
          <CardBody>
            
            <Row>
              
              <Col md={12}>
                <EnquiryData data={enquiryLists} editEnquiryAction={this.handleEditEnquiry} dataTableLoadingStatus = {this.state.loading} />
              </Col>
            </Row> 
          </CardBody>
        </Card>

        <Modal isOpen={modal} toggle={this.toggle} size="lg" className="full-width-modal-section equiry-modal">
          <ModalHeader toggle={this.toggle}>Inquiry Message</ModalHeader>
          <Form onSubmit={this.submitHandler} noValidate className="texQueForm">
            <ModalBody>
              
              <Row>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="truckName">Truck Name</Label>            
                    <Input type="text" placeholder="Truck Name" id="truckName" name="truckName" value={formField.truckName} disabled />
                  </FormGroup>  
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="contactPerson">Contact Person</Label>            
                    <Input type="text" placeholder="Contact Person" id="contactPerson" value={formField.contactPerson} disabled />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="phoneNumber">Phone Number</Label>            
                    <Input type="text" placeholder="Phone Number" id="phoneNumber" value={formField.contactNo} disabled />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="numberofPerson">No. of Person</Label>            
                    <Input type="text" placeholder="Phone Number" id="numberofPerson" name="numberofPerson" value={formField.numberofPerson} disabled />
                  </FormGroup>
                </Col>
                <Col md={"12"}>
                  <FormGroup> 
                    <Label htmlFor="message">Message</Label>            
                    <Input type="textarea" id="message" name="message" value={formField.message} disabled />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="eventDate">Event Date</Label>            
                    <Input type="text" placeholder="Date of Event" id="eventDate" name="eventDate" value={formField.eventDate} disabled />
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label htmlFor="status">Status</Label>
                    <Input type="text" name="status" id="status" value={formField.statusLabel} disabled  />
                  </FormGroup>
                </Col>
                
                <Col md={"12"}>
                  <FormGroup> 
                    <Label htmlFor="comment">Comment</Label>            
                    <Input type="textarea" placeholder="Put your comments here" id="comment" name="comment" value={formField.comment} onChange={this.changeHandler} />
                  </FormGroup>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
                <Button className="btn-success" type="button" onClick={this.acceptEnquiry} title="Accept Inquiry"> <i className="fa fa-check"></i> Accept</Button>
                <Button className="btn-danger" type="button" onClick={this.rejectEnquiry} title="Reject Inquiry"> <i className="fa fa-times"></i> Reject</Button>
                <Button color="secondary" onClick={this.toggle} title="Close Window">Cancel</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>

  

    );
  }
}

export default EnquiryLists;
