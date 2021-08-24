import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Button, Form, Input, Col, Row, FormGroup, Label} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';

class MyCard extends Component {
   constructor(props){
      super(props);
      this.state = {
         ccField: { ccType:'', ccNumber:'',cardNumber:'', ccExpMonth:'', ccExpYear:'', ccCVV: '' },
         ccFormProccessing: false,
         profileId: "",
         loading: true
      };
      this.submitCreditCard = this.submitCreditCard.bind(this);
   }
   componentDidMount() { 
      if(localStorage.getItem( 'authId' ) !=='' ){
         this.setState({profileId: localStorage.getItem( 'authId' ) });
         this.getCreditCardInfo( localStorage.getItem( 'authId' ) );
      }else
         this.props.history.push('/login');   
   }
   
   getCreditCardInfo(profileId){
      this.setState( { loading: true}, () => {
        commonService.getAPIWithAccessToken('profile/credit-card/'+profileId)
          .then( res => {         
            if ( undefined === res.data.data || !res.data.status ) {
              this.setState( {  loading: false } );
              toast.error(res.data.message);  
              return;
            }
            const cardDetail = res.data.data;
            let formField = this.state.ccField;
            formField.ccType = cardDetail.ccType || "";
            formField.cardNumber = cardDetail.ccNumber || "";
            formField.ccExpMonth = cardDetail.expire_month || "";
            formField.ccExpYear = cardDetail.expire_year || "";
            formField.ccCVV = cardDetail.cvv2 || "";
            this.setState({loading:false, ccField: formField });     
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
  
    changeCCHandler = event => {
      const name = event.target.name;
      const value = event.target.value;
      const ccField = this.state.ccField
      ccField[name] = value;
      this.setState({ ccField: ccField });
    };
  
   submitCreditCard (e) {
      e.preventDefault();
      if(this.state.profileId ==='' ){
        this.setState( {  loading:false, ccFormProccessing: false } );
        toast.error("Invalid Profile ID");
        return false;
      }
      //let history = useHistory();
      const ccInputField = this.state.ccField;
      
      if(ccInputField.ccType ==='' || ccInputField.ccNumber ==='' || ccInputField.ccExpMonth ==='' || ccInputField.ccExpYear ==='' || ccInputField.ccCVV ==='' ){
        this.setState( {  loading:false, ccFormProccessing: false } );
        toast.error("All fields are required!");
        return false;
      }
      
      this.setState( { loading: true, ccFormProccessing: true}, () => {
        const ccFormData = {
          "clientId": this.state.profileId,
          "type": ccInputField.ccType,
          "number": ccInputField.ccNumber,
          "expire_month": ccInputField.ccExpMonth,
          "expire_year": ccInputField.ccExpYear,
          "cvv2": ccInputField.ccCVV
        };
        
        commonService.putAPIWithAccessToken('profile/credit-card', ccFormData).then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading:false, ccFormProccessing: false} );
            toast.error(res.data.message);
            return;
          }
          this.setState({ loading:false, ccFormProccessing: false});
          this.getCreditCardInfo(this.state.profileId); 
          this.props.history.goBack();
          toast.success(res.data.message);
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }else{
            this.setState( {  loading:false, ccFormProccessing: false } );
            toast.error(err.message);
          }
        } ) 
      } );    
   };

  render() {
   const { loading, ccField, ccFormProccessing } = this.state;
    let loaderElement = '';
    if(loading)
      loaderElement = <Loader />

    return (
      <div className="dashboard-section">
         <ToastContainer />
         {loaderElement}
      
         <Card className="vd-card">
            <CardHeader>
               <div className="d-flex align-items-center">
                  <div className="mr-auto">
                  <h4 className="card-title"><img src="/images/payment.svg" height="30" alt="" /> My Card</h4>
                  </div>
                  <button className="btn btn-sm btn-secondary pull-right" onClick={() => this.props.history.goBack()}>Go Back</button>
               </div>
            </CardHeader>
            <CardBody>
            <Form onSubmit={this.submitCreditCard} noValidate>
                  <Row>
                    <Col md={"6"}>
                      <FormGroup> 
                        <Label htmlFor="ccType">Card Type *</Label>            
                        <Input type="select" name="ccType" id="ccType" value={ccField.ccType} onChange={this.changeCCHandler} required>
                          <option value="">Select Card Type</option>
                          <option value="VISA">Visa</option>
                          <option value="mastercard">MasterCard</option>
                          <option value="DISCOVER">Discover</option>
                          <option value="AMEX">Amex</option>
                        </Input>
                      </FormGroup>  
                    </Col>
                    <Col md={"6"}>
                      <FormGroup> 
                        <Label htmlFor="ccNumber">Card Number *</Label>            
                        <Input type="text" name="ccNumber" id="ccNumber" value={ccField.ccNumber} placeholder={ccField.cardNumber} onChange={this.changeCCHandler} required />
                      </FormGroup> 
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <Label htmlFor="ccExpMonth" style={ {display: "block"}}>Expiry Date *</Label>
                        <Input type="select" name="ccExpMonth" id="ccExpMonth" value={ccField.ccExpMonth} onChange={this.changeCCHandler} required  style={ {width:"50%", display: "inline-block"}}>
                          <option value="">Month</option>
                          <option value="01">01</option>
                          <option value="02">02</option>
                          <option value="03">03</option>
                          <option value="04">04</option>
                          <option value="05">05</option>
                          <option value="06">06</option>
                          <option value="07">07</option>
                          <option value="08">08</option>
                          <option value="09">09</option>
                          <option value="10">10</option>
                          <option value="11">11</option>
                          <option value="12">12</option>
                        </Input>
                        {/* <Input type="text" name="ccExpYear" id="ccExpYear" value={ccField.ccExpYear} onChange={this.changeCCHandler} required placeholder="Year" style={ {width:"50%", display: "inline-block"}} /> */}
                        <Input type="select" name="ccExpYear" id="ccExpYear" value={ccField.ccExpYear} onChange={this.changeCCHandler} required  style={ {width:"50%", display: "inline-block"}}>
                          <option value="">Year</option>
                          <option value={(new Date().getFullYear())}>{(new Date().getFullYear())}</option>
                          <option value={(new Date().getFullYear()+1)}>{(new Date().getFullYear()+1)}</option>
                          <option value={(new Date().getFullYear()+2)}>{(new Date().getFullYear()+2)}</option>
                          <option value={(new Date().getFullYear()+3)}>{(new Date().getFullYear()+3)}</option>
                          <option value={(new Date().getFullYear()+4)}>{(new Date().getFullYear()+4)}</option>
                          <option value={(new Date().getFullYear()+5)}>{(new Date().getFullYear()+5)}</option>
                          <option value={(new Date().getFullYear()+6)}>{(new Date().getFullYear()+6)}</option>
                          <option value={(new Date().getFullYear()+7)}>{(new Date().getFullYear()+7)}</option>
                          <option value={(new Date().getFullYear()+8)}>{(new Date().getFullYear()+8)}</option>
                          <option value={(new Date().getFullYear()+9)}>{(new Date().getFullYear()+9)}</option>
                          <option value={(new Date().getFullYear()+10)}>{(new Date().getFullYear()+10)}</option>
                        </Input>  
                        
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup> 
                        <Label htmlFor="ccCVV">CVV *</Label>            
                        <Input type="text" name="ccCVV" id="ccCVV" value={ccField.ccCVV} onChange={this.changeCCHandler} required />
                      </FormGroup>
                    </Col>
                    <Col md="12">
                      <Button color="primary" className="pull-right" type="submit">{ccFormProccessing ? 'Submitting...' : 'Save Card Details' }</Button>
                    </Col>
                  </Row>
               </Form>
            </CardBody>
         </Card>
         
      </div>
    );
  }
}

export default MyCard;
