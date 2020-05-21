import React, { Component } from 'react';
import { Button, Row, Col } from 'reactstrap';
//import MUIDataTable from "mui-datatables";

import "./ReviewData.css";


class ReviewData extends Component {
  
  constructor(props){
    super(props);   
    this.state = {
      buttonProcessing: false,
      rowIndex: '',
      dataTableItem: []
    };
    
  }
  componentDidMount() {   
  }
  /* Edit Enquiry Info */
  editDataItem(rowIndex){    
    this.props.editDataAction(rowIndex);
  }
  
  //Change review status
  changeReviewStatus(status, reviewId){
    this.props.changeReviewAction(status, reviewId);
  }

  render() {
    
    return (
      <>  
      
        <div className="row d-flex justify-content-center">
          <div className="col-lg-9">
              <div className="card">
                  <div className="comment-widgets">
       				      { ( this.props.data.length > 0 ? <div className="mainHeading card-header SubHeading"><strong>({this.props.data.length}) Reviews </strong></div> : '' ) }
                      
                     {this.props.data.map((reviewInfo, index) => 
      
                      <div key={index} className="d-flex flex-row comment-row">
                          <div className="userProfile">
                            <img src={ ( reviewInfo.profilePic!=='' ? reviewInfo.profilePic : "/images/profile_image_dummy.svg" )} alt={reviewInfo.reviewedBY} width="100%"/>
                          </div>
                          <div className="comment-text w-100">
                              <h6 className="font-medium">{reviewInfo.reviewedBY}</h6> 
                              <div className="products-rate-1"><i className="fa fa-star-o"></i> {reviewInfo.rating}</div>
                              <p className="description">{reviewInfo.message}</p>
                              <div className="row">
                                <div className="col-lg-9">
                                  <div className="statusContainer">
                                    <p><span>Truck Name:</span> {reviewInfo.truckName}</p>
                                    <p className="statusPending"><span>Date:</span> { (new Date(reviewInfo.createdAt)).toLocaleDateString("en-US") }</p>
                                    <p className="statusPending"><span>Status:</span> {reviewInfo.statusLabel}</p>
                                  </div>
                                </div>
                                <div className="col-lg-3">
                                  <div className="comment-footer float-right">
                                    <Button type="Button" size="sm" color="danger" onClick={() => 
          this.editDataItem(index)}><i className="fa fa-edit"></i>  Reply</Button>
                                  </div>
                                </div>
                                    { ( reviewInfo.replyMessage!=='' ? <Col lg="12"><h6>Replied:</h6><p className="description">{reviewInfo.replyMessage}</p></Col> : '' )}
                              </div>
                              <Row>
                                <Col md="12">
                                { ( reviewInfo.status===2 ? <> <Button color="success" size="sm" onClick={ () => this.changeReviewStatus(1, index) } title="Click to Approve Review">Approve</Button> <Button color="danger" size="sm" onClick={ () => this.changeReviewStatus(3, index) } title="Click to Reject Review">Reject</Button> </> : '' ) }
                                </Col>
                              </Row>
                          </div>
                      </div>

                      )}
                      
                </div>
              </div>
          </div>
      </div>
      </>
    );
  }
}

export default ReviewData;