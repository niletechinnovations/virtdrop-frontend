import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Row, Col, FormGroup, Label } from 'reactstrap';
//import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';
import { Link } from 'react-router-dom';


class TransactionDetails extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      transactionInfo: {},
      loading: true,
    } 
  }

  componentDidMount() {     
    const { match: { params } } = this.props;
    if(params.transactionId !== undefined && params.transactionId !=="") {
      this.getTransactionInfo(params.transactionId);
    }else 
      this.props.history.push('/user/transactions');
  }

  /* Transaction Details API */
  getTransactionInfo(transactionId) {
      this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('statistics/client-payment-details/'+transactionId)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }   
          this.setState({loading:false, transactionInfo: res.data.data});              
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
 
  render() {
    const { transactionInfo, loading } = this.state;
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
                <h4 className="card-title"><img src="/images/billing.svg" height="30" alt="" /> Transaction Details</h4>
              </div>
            </div>
          </CardHeader>
          <CardBody className="item-list-section">
          <Row>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label><strong>Transaction ID:</strong> {transactionInfo.transactionId}</Label>            
                  </FormGroup> 
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label><strong>Invoice No.:</strong> #{transactionInfo.invoiceNo}</Label>            
                  </FormGroup> 
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label><strong>Amount:</strong> ${transactionInfo.amount}</label>
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup> 
                    <Label><strong>Payment Method:</strong> {transactionInfo.paymentMethod}</Label>            
                  </FormGroup> 
                </Col>
                <Col md="6">
                  <FormGroup>
                    <label><strong>Payment Status:</strong> {transactionInfo.paymentStatus}</label>
                  </FormGroup>
                </Col>
                <Col md={"6"}>
                  <FormGroup>
                    <label><strong>Transaction Date:</strong> {transactionInfo.createdAt}</label>
                  </FormGroup>
                </Col>
                <Col md="12">
                  <FormGroup>
                    <Link className="btn btn-sm btn-info" to="/user/transactions">Go to Trancastions List</Link> OR &nbsp;
                    <Link className="btn btn-sm btn-info" to="/user/billing">Back to Billing List</Link>
                  </FormGroup>
                </Col>
              </Row>
          </CardBody>
        </Card>

      </div>

    );
  }
}

export default TransactionDetails;
