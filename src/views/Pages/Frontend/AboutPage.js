import React from "react";

class AboutPage extends React.Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

  render() {
    return (
    <>
        <section className="banner-section">
            <div className="banner-media-content">
                <div className="banner-media">
                <img src="/images/banner5.jpg" alt="Why Us" />
                </div>
                <div className="banner-content">
                <h1>Lorem Ipsum is composed in a pseudo-Latin language which more or less corresponds to 'proper' Latin.</h1>
                </div>
            </div>
        </section>
        <section className="howitworks-page-section">
            <div className="container">
                <div class="heading-title">
                    <h2>About Us</h2>
                    <p>Lorem Ipsum is composed in a pseudo-Latin language which more or less corresponds to 'proper' Latin. It contains a series of real Latin words. </p>
                </div>
                <div class="howitworks-page-list"></div>
            </div>
        </section>        
            
    </>
    );
  }
}

export default AboutPage;
