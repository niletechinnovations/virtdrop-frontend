import React, { Component } from 'react';
import { 
  Card, CardHeader, CardBody, Col, Row, Button, Form, Input, FormGroup,
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';

import ReviewData from './ReviewData';
import Loader from '../../Loader/Loader';


class ReviewLists extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      truckLists: [],
      dataLists: [],
      formProccessing: false,
      loading: true,
      rowIndex: -1,
      activeFoodTruckID: '',
      formField: { reviewId: '', truckName: '', reviewedBY: '', rating:'', status:'', comment:'' },
    } 
    this.submitHandler = this.submitHandler.bind(this);
    this.handleEditData = this.handleEditData.bind(this);
    this.loadFoodTruckReviews = this.loadFoodTruckReviews.bind(this);
    this.handleReviewStatus = this.handleReviewStatus.bind(this);
  }

  componentDidMount() {     
    const { match : { params } } = this.props;
    let foodtruckId = '';
    if(params.foodtruckId!== undefined){
      foodtruckId = params.foodtruckId;
      this.reviewLists({filter_foodTruckId: foodtruckId});
    }
    
    this.truckLists({});
  }

  truckLists() {
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('food-truck?pageSize=500')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }
          let truckData = res.data.data.truckList;
          this.setState({loading:false, truckLists: truckData, activeFoodTruckID: truckData[0].foodTruckId });     
          this.reviewLists({filter_foodTruckId: truckData[0].foodTruckId});
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

  loadFoodTruckReviews(foodTruckId){
    this.setState({activeFoodTruckID: foodTruckId});
    this.reviewLists({filter_foodTruckId: foodTruckId});
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
    const { truckLists, dataLists,activeFoodTruckID, loading, modal, formField, formProccessing } = this.state;
    console.log(activeFoodTruckID);    
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
            {truckLists.map((truckInfo, index) => 
              <Col lg="2" key={index} >
                <div className={ (truckInfo.foodTruckId === activeFoodTruckID ? 'truck-list-box active' : 'truck-list-box' ) } onClick={() => 
          this.loadFoodTruckReviews(truckInfo.foodTruckId)} >
                  { (truckInfo.featuredImage!=='' ? <img src={truckInfo.featuredImage} alt={truckInfo.truckName} className="img-fluid img-thumnail" /> : <img src="/images/1.png" alt="TruckBanner" /> ) }
                  <figcaption className="figure-caption text-center mt-1">{truckInfo.truckName}</figcaption>
                </div>
              </Col>
            )}
            </Row>
            <Row>
              <Col md={12}>
                
                <ReviewData data={dataLists} editDataAction={this.handleEditData} changeReviewAction={this.handleReviewStatus} />
              </Col>
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

export default ReviewLists;
