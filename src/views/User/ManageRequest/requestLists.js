import React, { Component } from 'react';
import { 
  Card, CardHeader, CardBody, Col, Row, Button, Form, Input, FormGroup,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';

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
      activeFoodTruckID: '',
      formField: { reviewId: '', truckName: '', reviewedBY: '', rating:'', status:'', comment:'' },
    } 
    //this.submitHandler = this.submitHandler.bind(this);
    //this.handleEditData = this.handleEditData.bind(this);
    //this.handleReviewStatus = this.handleReviewStatus.bind(this);
  }

  componentDidMount() {     
    
    //this.truckLists({});
  }


  /* Review List API */
  reviewLists(filterItem = {}) {
    let strWalkQuery = "";
    if(filterItem.filter_foodTruckId !== undefined && filterItem.filter_foodTruckId !== "" ) 
      strWalkQuery += (strWalkQuery !=="" ) ? "/"+filterItem.filter_foodTruckId : "/"+filterItem.filter_foodTruckId;
    
      this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('food-truck/reviews'+strWalkQuery)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }   
          this.setState({loading:false, dataLists: res.data.data.reviewList});         
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
        "reviewId": formInputField.reviewId,
        "message": formInputField.comment,
        "status": formInputField.status
      };
    
      const rowIndex = this.state.rowIndex;
      if(rowIndex > -1) {
        commonService.putAPIWithAccessToken('food-truck/reviews/status/', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {           
            this.setState( { formProccessing: false} );
            toast.error(res.data.message);
            return;
          } 
          
          this.setState({ modal: false, formProccessing: false});
          toast.success(res.data.message);
          this.reviewLists({filter_foodTruckId: this.state.activeFoodTruckID });
         
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }else
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
      formField: { truckName: '', reviewedBY: '', rating:'', message:'', comment:'', status:'', },
    });
  }

  /* To edit review details/ change status */
  handleEditData(rowIndex){
    const rowData = this.state.dataLists[rowIndex];
    const formField = {
        reviewId: rowData.reviewId,
        truckName: rowData.truckName,
        reviewedBY: rowData.reviewedBY,
        rating: rowData.rating,
        message: rowData.message,
        comment: rowData.replyMessage,
        status: rowData.status,
    }
    this.setState({rowIndex: rowIndex, formField: formField, modal: true });
  }

  handleReviewStatus(status, rowIndex){
    const statusData = this.state.dataLists[rowIndex];
    
    this.setState( { loading: true}, () => {
      const formData = {
        "reviewId": statusData.reviewId,
        "status": status,
        "message": statusData.replyMessage
      };
      commonService.putAPIWithAccessToken('food-truck/reviews/status', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {           
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          } 
          this.setState({ modal: false, loading: false});
          toast.success(res.data.message);
          this.reviewLists();
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
  
  render() {
    const { dataLists, loading, modal, formField, formProccessing } = this.state;
    const processingBtnText = <>Submit <i className="fa fa-spinner"></i></>;
    let loaderElement = '';
    if(loading)        
      loaderElement = <Loader />

    return (
      <div className="user-dashboard">
        {loaderElement}
        <Card>
          <CardHeader className="mainHeading">
            <strong>Food Truck Reviews</strong>
          </CardHeader>
          <CardBody className="food-truck-list-section">
            <Row>
            {dataLists.map((dataInfo, index) => 
              <Col lg="2" key={index} >
                
              </Col>
            )}
            </Row>
            
          </CardBody>
        </Card>

        <Modal isOpen={modal} toggle={this.toggle} className="full-width-modal-section review-modal">
          <ModalHeader toggle={this.toggle} className="pb-0">Reply Message</ModalHeader>
          <Form onSubmit={this.submitHandler} noValidate className="texQueForm">
            <ModalBody>
              <Row>
                <Col md={"12"}>
                  <FormGroup> 
                    <Input type="textarea" placeholder="Put your message here" id="comment" name="comment" value={formField.comment} onChange={this.changeHandler} />
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

    );
  }
}

export default requestLists;
