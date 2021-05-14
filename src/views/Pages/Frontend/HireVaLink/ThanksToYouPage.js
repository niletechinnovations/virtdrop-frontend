import React, { Component } from 'react';
import './ThankYouPage.css';
import ThanksImage from './ThanksImage.svg';

class ThanksToYouPage extends Component {

    constructor(params) {
        super(params)
        this.state = {}
    }

    render() {
        return (
            <>
                <div className="success-msg-body">
                    <div className="success-msg-card">
                        <div className="success-icon-box">
                            <img src={ThanksImage}></img>
                        </div>
                        <div className="success-msg-content">
                            <p>Thank you for submitting your request. Our team will contact you shortly.</p>
                            {/* <a className="btn-ox" href="#">OK</a> */}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default ThanksToYouPage;

