import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../Loader/Loader';
import commonService from '../../../core/services/commonService';
import "./VerifyOtp.css";
import { Col, Row, Button } from 'reactstrap';
var emailAddress = '';

export default class VerifyOtp extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          otp: "",
          loading: false,
          loggedIn: false
       };
       this.changeHandler = this.changeHandler.bind(this);
       this.resendOtp = this.resendOtp.bind(this);
       this.submitHandler = this.submitHandler.bind(this);
    }

    componentDidMount() {
      window.scrollTo(0, 0);
    }
  
    changeHandler = otp => {
      this.setState({ otp : otp });
    };

    submitHandler = event => {
      event.preventDefault();
      event.target.className += " was-validated";
      const verifyData = {
        otp: this.state.otp,
        email: emailAddress,
        
      };
      this.setState( { loading: true }, () => {
        commonService.postAPI( `auth/verify-otp`, verifyData )
          .then( res => {
           
            if ( undefined === res.data || !res.data.status ) {
              this.setState( { loading: false} );
              toast.error(res.data.message);
              return;
            }
            toast.success(res.data.message);
            const loggedInfo = res.data;
          
            localStorage.setItem( 'accessToken', loggedInfo.data.accessToken);
            //localStorage.setItem( 'refreshToken', loggedInfo.data.refreshToken);
            localStorage.setItem( 'role', loggedInfo.data.role );
            localStorage.setItem( 'authId', loggedInfo.data.authId);
            localStorage.setItem( 'profilePic', loggedInfo.data.profilePic );
            localStorage.setItem( 'userName', loggedInfo.data.firstName+' '+loggedInfo.data.lastName );
            localStorage.setItem( 'userEmail', loggedInfo.data.email );
            //commonService.setIsSubscribe(false);
            if(loggedInfo.data.isRedirectToPayPal){
              this.setState( { loading: true})
              window.location.href = loggedInfo.data.payPalRedirectUrl;
            }else{
              this.setState( { loading: true, loggedIn: true })
            
              if(loggedInfo.data.role.toLowerCase() === 'admin')
                    this.props.history.push('/admin/dashboard');
                else if(loggedInfo.data.role.toLowerCase() === 'organization')
                    this.props.history.push('/user/dashboard');
                else if(loggedInfo.data.role.toLowerCase() === 'advertiser')
                    this.props.history.push('/advertiser/ads');
                else
                    this.props.history.push('/');
            }
            //this.props.history.push('/login');
            
          } )
          .catch( err => {
            
            this.setState( { loading: false } );
            toast.error(err.message);
          } )
      } )

    };

    resendOtp = event => {
      event.preventDefault();
      const verifyData = {
        email: emailAddress        
      };
      this.setState( { loading: true }, () => {
        commonService.postAPI( `auth/resend-otp`, verifyData )
          .then( res => {
           
            console.log(res);
            if ( undefined === res.data || !res.data.status ) {
              this.setState( { loading: false} );
              toast.error(res.data.message);
              return;
            }
            this.setState( { loading: false } );
            toast.success(res.data.message);            
          } )
          .catch( err => {
            
            this.setState( { loading: false } );
            toast.error(err.message);
          } )
      } )
    }
      

render() {
    if ( this.state.loggedIn  ) {
        if(localStorage.getItem("role").toLowerCase() === 'admin')
            return ( <Redirect to={`/admin/dashboard`} noThrow /> )
        else if(localStorage.getItem("role").toLowerCase() === 'organization')
            return ( <Redirect to={`/subscription-plan`} noThrow /> )
        else if(localStorage.getItem("role").toLowerCase() === 'advertiser')
            return ( <Redirect to={`/advertiser/plan`} noThrow /> )
        else
            return ( <Redirect to={`/`} noThrow /> )
        
    }
    let loaderElement = '';
    if(this.state.loading)
      loaderElement = <Loader />
        emailAddress = this.props.email;
        return (
        <div className="Verify-otp-component">
            {loaderElement}
            <form className="grey-textneeds-validation" onSubmit={this.submitHandler} noValidate>
                <Row>
                    <Col md="12">
                        <p>OTP has been sent to your email id. Please enter it below.</p>
                        <OtpInput className="otp-input-field"
                        onChange={this.changeHandler}
                        inputStyle = "otp-input-field"
                        containerStyle = "otp-container-input"
                        numInputs={6}
                        value = {this.state.otp}
                        separator={<span>-</span>}
                        />
                        <p className="mt-3">Didn't get code? <Button type="button" className="btn-sm" onClick={this.resendOtp}>Resend Otp</Button></p>
                    </Col>
                    <Col md="6">
                        <div className="mt-3 mb-5">
                            <Button className="Submit-form-button" type="submit">Verify</Button>
                        </div>
                        <div className="text-foot">
                            <p className="mt-5">Already have an account? <Link to="/login">Log in</Link></p>
                        </div>
                    </Col>
                </Row>
                
            </form>
            
        </div>
        );
    }
}