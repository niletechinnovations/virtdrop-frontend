import React from "react";
import Loader from '../../../../views/Loader/Loader';
import { InlineWidget } from "react-calendly";

import "./BookingPage.css";

class CalendlyBookingPage extends React.Component {
  constructor( props ){
    super( props );

    this.state = {
      loading: false,
      errors: {}
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }
  

  render() {
    const { loading } = this.state;
    let loaderElement = '';
    if(loading)
      loaderElement = <Loader />
      
    return (
      <>        
        {loaderElement} 
        
        <section className="banner-section">
          <div className="banner-media-content">
            <div className="banner-media">
              <img src="/images/banner4.jpg" alt="Booking Banner" />
            </div>
            <div className="banner-content">
              <h1>Would you like further information? Book a Discovery Call with one of our team.</h1>
            </div>
          </div>
        </section>

        <InlineWidget url="https://calendly.com/virtdrop/15min" styles={{ height: '1000px'}} />

      </>
    );
  }
}

export default CalendlyBookingPage;
