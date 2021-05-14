import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ThankYouPage extends Component {
    
    render() {

        return (
            <>
              <div className="container">
                <div className="row">
                  <div className="col-md-12 mb-5">
                    <div className="card text-center py-4 my-5">
                      <h3 className="login-heading mb-4">Thank You For Signing Up</h3>
                      <h6>You're now a member of VIRTDROP. We have sent an activation mail to your email-id.</h6>
                      <h6>Kindly check your spam/junk folder if you didn't receieve in your inbox.</h6>
                      <p className="mt-2">&nbsp;</p>
                      <p><Link className="btn btn-info" to="/">Back to Home</Link> &nbsp; OR &nbsp; <Link className="btn btn-primary" to="/login">Login Now</Link></p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
    }
    
}  
export default ThankYouPage;
