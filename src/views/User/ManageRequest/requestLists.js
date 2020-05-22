import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
              <CardBody className="food-truck-list-section">
                <div className="Search-filter">
                  <form>
                      <div className="row">
                          <div className="col-md-3">
                              <div className="form-group">
                                  <select className="form-control">
                                      <option>Type of Virtual Assistance</option>
                                      <option value="1">Business Support</option>
                                      <option value="2">Personal Assistance</option>
                                  </select>
                              </div>
                          </div>
                          <div className="col-md-3">
                              <div className="form-group">
                                  <input type="text" name="" className="form-control" placeholder="Nature of business" />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <input type="text" name="" className="form-control" placeholder="From Date" />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <input type="text" name="" className="form-control" placeholder="To Date" />
                              </div>
                          </div>
                          <div className="col-md-2">
                              <div className="form-group">
                                  <button className="search-btn">Search</button>
                              </div>
                          </div>
                      </div>
                  </form>
              </div>
                <div className="card-table">
                  <table className="table table-orders">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Date</th>
                        <th>Type of VA</th>
                        <th>Nature of business </th>
                        <th>Type of engagement</th>
                        <th>No. of VA</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <span className="sno">1</span>
                        </td>
                        <td>02/11/2020</td>
                        <td>Business Support</td>
                        <td>Real Estate</td>
                        <td>Project Based</td>
                        <td>5</td>
                        <td>
                          <div className="dropdown action-dropdown">
                            <button className="btn btn-trigger dropdown-toggle" data-toggle="dropdown" aria-expanded="false" id="dropdownMenuLink">
                              <img src="/images/more.svg" width="20" alt="more" />
                            </button>
                            <div className="dropdown-menu  dropdown-menu-right" aria-labelledby="dropdownMenuLink" >
                              <a className="dropdown-item view-btn" href="#"><i className="fa fa-eye"></i> View</a>
                              <a className="dropdown-item edit-btn" href="#"><i className="fa fa-pencil"></i> Edit</a>
                              <a className="dropdown-item delete-btn" href="#"><i className="fa fa-trash-o"></i> Delete</a>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td><span className="sno">2</span></td>
                        <td>02/11/2020</td>
                        <td>Business Support</td>
                        <td>Real Estate</td>
                        <td>Project Based</td>
                        <td>5</td>
                        <td>
                          <div className="dropdown action-dropdown">
                            <a className="btn btn-trigger dropdown-toggle" data-toggle="dropdown" aria-expanded="false" id="dropdownMenuLink">
                                  <img src="/images/more.svg" width="20" alt="" />
                              </a>
                              <div className="dropdown-menu  dropdown-menu-right" aria-labelledby="dropdownMenuLink" >
                                <a className="dropdown-item view-btn" href="#"><i className="fa fa-eye"></i> View</a>
                                <a className="dropdown-item edit-btn" href="#"><i className="fa fa-pencil"></i> Edit</a>
                                <a className="dropdown-item delete-btn" href="#"><i className="fa fa-trash-o"></i> Delete</a>
                              </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
