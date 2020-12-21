import React from "react";
import { Link } from 'react-router-dom';

class PricingPage extends React.Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

  render() {
    return (
    <>
        <section className="banner-section">
            <div className="banner-media-content">
                <div className="banner-media">
                <img src="/images/banner5.jpg" alt="Pricing Plan" />
                </div>
                <div className="banner-content">
                <h1>From marketing to graphic design, Virtual Assistants can take any task off of your hands.</h1>
                </div>
            </div>
        </section>
        <section className="plan-section">
            <div className="container">
                <div className="heading-title text-center">
                    <h2>Pricing</h2>
                </div>
                <div className="plan-pricing-info">
                    <p className="text-center">Our pricing is as straight forward and stream lined as everything else we offer. Our Virtual Assistants are available at a flat-rate of 
                    <div className="pricing-info"><Link className="text-white" to="/booking">Request a Quote</Link></div></p>
                </div>
            </div>
        </section>        
            
    </>
    );
  }
}

export default PricingPage;
