import React from "react";

class AboutPage extends React.Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

  render() {
    return (
      <>
        <div className="main-content ">
            <section className="how-it-section ">
              <div className="container">      
                <div className="heading-title text-center mt-4">
                    <h2>About TexQue</h2>
                </div>
                <div className="products-section">
                <div className="heading-title text-center">    
                    <p className="text-white">TexQue is the premier Food Truck app. We make it easy to find your special food truck or the exact food you want. We offer all types of food listed in every location around the country. TexQue gives you the power to list, find it and eat it all on one simple app. This is the Food Truck app the Pros use and the app the foodies love!</p>
                    <p className="text-white">Our mission is simple: to help you find your favorite food easier or help people find you. And with millions of downloads in the U.S. and many new listings every day, we're just getting started. Find your Food Truck today!</p>
                    </div>
                </div>
                <div className="heading-title text-center pt-5">
                    <h2>How it Works</h2>
                    <p>The Food Truck app that Pros use! The app will be simple and <br />
                    effective for the everyday seller and buyer of delicious meals on wheels.</p>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="howitwork-card">
                        <div className="howitwork-card-media">
                            <img src="/images/step1.svg" height="80" alt="Register Food Truck" />
                        </div>
                            <div className="howitwork-card-content">
                                <h2>Register Food Truck</h2>
                                <p>Place your business and food truck in our database for immediate business opportunities.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="howitwork-card">
                        <div className="howitwork-card-media">
                            <img src="/images/listing.svg" height="80" alt="List Your Menu" />
                        </div>
                            <div className="howitwork-card-content">
                                <h2>List Your Menu</h2>
                                <p>Your food truck will be visible by all foodies in your area and outside.  This will drive more sales! </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="howitwork-card">
                        <div className="howitwork-card-media">
                            <img src="/images/inquiry.svg" height="80" alt="Customer Access" />
                        </div>
                            <div className="howitwork-card-content">
                                <h2>Customer Access</h2>
                                <p>The customer can access your food truck to inquire about daily deals, future locations, catering, etc. </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="howitwork-card">
                        <div className="howitwork-card-media">
                            <img src="/images/Inquiries.svg" height="80" alt="Receive Inquiries" />
                        </div>
                            <div className="howitwork-card-content">
                                <h2>Receive Inquiries</h2>
                                <p>Accept or reject inquiries, notify your customer you are ready to cater.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="howitwork-card">
                        <div className="howitwork-card-media">
                            <img src="/images/menu-control.svg" height="80" alt="Menu Control" />
                        </div>
                            <div className="howitwork-card-content">
                                <h2>Menu Control</h2>
                                <p>Edit menu images, and descriptions.</p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="howitwork-card">
                        <div className="howitwork-card-media">
                            <img src="/images/Availability.svg" height="80" alt="Update Availability" />
                        </div>
                            <div className="howitwork-card-content">
                                <h2>Update Availability</h2>
                                <p>Set your availability according to days and time</p>
                            </div>
                        </div>
                    </div>
                </div>
            
              </div>
            </section>
              
          
        </div>
      </>
    );
  }
}

export default AboutPage;
