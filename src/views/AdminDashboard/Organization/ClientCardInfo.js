import React, { Component } from 'react';
import  { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, Row, FormGroup, Label } from 'reactstrap';
//import {Link} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';

import Loader from '../../Loader/Loader';

class ClientCardInfo extends Component {
  constructor( props ){
    super( props );

    this.state = {
      ccField: { ccType:'', ccNumber:'', cardNumber:'', ccExpMonth:'', ccExpYear:'', ccCVV:'' },
      ccFormProccessing: false,
      loading: false,
      profileId: ""
    };

  }
  componentDidMount() {
    const { match: { params } } = this.props;
    if(params.profileId !== undefined && params.profileId !=="") {
      this.setState({profileId: params.profileId});
      this.getCreditCardInfo(params.profileId);
    }else 
      this.props.history.push('/admin/va-application');
    console.log(params);
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


  render() {

    const { loading, ccField } = this.state; 
    let loaderElement ='';
      
    if(loading)
        loaderElement = <Loader />

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader>
                <strong><i className="fa fa-credit-card pr-1"></i>Credit Card Info</strong>
                <button className="btn btn-sm btn-secondary pull-right" onClick={() => this.props.history.goBack()}>Go Back</button>

              </CardHeader>
              <CardBody className="profileInfo">
                {loaderElement}
                <ToastContainer />
                  <Row>
                    <Col md={"6"}>
                      <FormGroup> 
                        <Label htmlFor="ccType"><strong>{ccField.ccType} </strong> &nbsp; {ccField.cardNumber}</Label> &nbsp;
                        <Link className="btn-view lg-font" to={`/admin/organization/manage-card/${this.state.profileId}`} title="Edit Card"><i className="fa fa-pencil"></i> </Link>           
                      </FormGroup>  
                    </Col>
                  </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default ClientCardInfo;
