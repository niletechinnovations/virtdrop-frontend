import React, { Component } from "react";
import  { Link } from 'react-router-dom';
import { Container, Row, Col, Card, CardTitle, CardText } from 'reactstrap';

import commenService from '../../../core/services/commonService';
import Loader from '../../../views/Loader/Loader';


class VerifyEmailPage extends Component {
  constructor( props ){
    super( props );

    this.state = {
      token: '',
      loading: false,
      resError: ''
    };
    
  }
  componentDidMount() {
    const { match: { params } } = this.props;
    this.setState( { loading: true, resError:true }, () => {
      commenService.getAPI( `auth/verify-email/`+ params.token )
        .then( res => {
         
          console.log(res);
          if ( undefined === res.data || !res.data.status ) {
            this.setState( { loading: false,resError:true, resMessage:res.data.message } );
            return;
          }
  
          const loggedInfo = res.data;
          console.log(loggedInfo);
          
          this.setState( {
            loading: false,
            resError:false,
            resMessage: res.data.message,
          } )
          
        } )
        .catch( err => {
          this.setState( { loading: false, resError:true, resMessage:err.message } );
        } )
    } )

    window.scrollTo(0, 0);
    
  }


  render() {
    const { loading,resError,resMessage} = this.state;
      
      let loaderElement = '';
      if(loading)
        loaderElement = <Loader />
      return (
        <>
        <section className="banner-section">
          <div className="banner-media-content">
              <div className="banner-media">
                <img src="/images/banner4.jpg" alt="Login banner" />
              </div>
              <div className="banner-content">
                <h2>The easiest way to find and hire virtual assistants</h2>
              </div>
          </div>
        </section>
        
        <section className="account-page-section">
          <Container>
            <Row>
              <Col md="7" lg="7" sm="12" className="mx-auto">
                <div className="text-center my-5">
                  {loaderElement}
                  <Card body className= { resError ? 'border-danger' : 'border-success'  } >
                    <CardTitle className="h2"><i className={ resError ? 'text-danger fa fa-window-close-o' : 'text-success fa fa-check-square-o'  }></i></CardTitle>
                      <CardText className="h5">{resMessage}</CardText>
                      <p className="my-3">
                        <Link to="/" className="btn btn-secondary">Retun to home</Link> &nbsp; <strong>OR</strong> &nbsp;
                        <Link to="/login" className="btn btn-primary">Sign In</Link>
                      </p>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
        </>
      );
  }
}

export default VerifyEmailPage;
