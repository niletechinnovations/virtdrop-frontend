import React from "react";
import { Col, Row } from 'reactstrap';
import queryString from 'query-string';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';

class billingPaymentStatus extends React.Component {
  constructor( props ){
    super( props );
    this.state = {
      paymentStatus: '',
      paymentData: '',
      loading: false,
    };
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    
    if(params.status !== undefined && params.status !=="") {
        const role = localStorage.getItem( 'role' );
        if(params.status==='success'){
            const value=queryString.parse(this.props.location.search);
            var paymentId = value.paymentId;
            var payerId = { payer_id: value.PayerID };

            const token=value.token;
            this.setState({paymentStatus: params.status, token: token, paymentId: paymentId, payerId: payerId });
            this.getPaymentDetail(token, paymentId, payerId);

            if( role.toLowerCase() === "admin" )
              this.props.history.push('/admin/transactions')
            
            return
        }else{
          var cancelMessage = '';
          if(params.status==='cancel')
            cancelMessage = 'You have cancelled your transaction';
          else
            cancelMessage = 'Your transaction has been '+params.status;
    
          if( role.toLowerCase() === "admin" )
            this.props.history.push('/admin/billing');
          else  
            this.props.history.push('/user/billing');
          
          toast.error(cancelMessage);  
          return;
        }
        
    }else 
        this.props.history.push('/user/billing');
  }

  getPaymentDetail(token, paymentId, payerId){
    if(paymentId!==''){
      const formData = {
        "token": token,
        "paymentId": paymentId,
        "payerId": payerId
      }
      this.setState( { loading:true }, () =>{
        commonService.postAPIWithAccessToken('payment/verify', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {           
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          }
          this.setState( { loading: false, paymentData:res.data.data } );
         
          //this.props.history.push('/user/transactions');
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

  render() {
    const { loading, paymentData } = this.state;
    
    let loaderElement = '';
    if(loading)
      loaderElement = <Loader />

      return (
        <>
        <section className="pricing py-3 px-2">
          <div className="container">
            {loaderElement}
            <h4>Transaction Details</h4>
            <hr className="divider" />
            <Row className="transaction-details">
              <Col lg={2}>Transaction ID:</Col>
              <Col lg={10}>
                  {paymentData.transactionId}
              </Col>
              <Col lg={2}>Payer ID:</Col>
              <Col lg={10}>
                  { (paymentData.payerId )}
              </Col>
              <Col lg={2}>Invoice ID:</Col>
              <Col lg={10}>
                  { (paymentData.invoiceId )}
              </Col>
              <Col lg={2}>Amount:</Col>
              <Col lg={10}>
                  ${paymentData.amount}
              </Col>
              <Col lg={2}>Status:</Col>
              <Col lg={10}>
                  { (paymentData.isPaid ? 'Approved' : 'Pending' )}
              </Col>
              <Col lg={2}>Created On:</Col>
              <Col lg={10}>
                  { (new Date(paymentData.createdAt)).toLocaleDateString("en-US")}
              </Col>
            </Row>
          </div>
        </section>

        </>
      );
  }
}

export default billingPaymentStatus;