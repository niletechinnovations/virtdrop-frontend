import React from "react";

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
        <section className="howitworks-page-section">
            <div className="container">
                <div class="heading-title pb-3">
                    <h2 className="pt-5">Pricing</h2>
                    <p className="pb-5">Our pricing is as straight forward and stream lined as everything else we offer. Our Virtual Assistants are available at a flat-rate of <strong>$12 per hour</strong>.</p>
                </div>
                <div class="howitworks-page-list"></div>
            </div>
        </section>        
            
    </>
    );
  }
}

export default PricingPage;
