import React from "react";
import { Container, Row, Col } from 'reactstrap';
import { Link } from "react-router-dom";
import "./HowItWorksPage.css";

class HowItWorksPage extends React.Component {

  componentDidMount() {
    window.scrollTo(0, 0);
  }
  
  render() {
    return (
    <>
    <section className="banner-section">
        <div className="banner-media-content">
            <div className="banner-media">
            <img src="/images/banner1.jpg" alt="How it works" />
            </div>
            <div className="banner-content">
            <h2>Lorem Ipsum is composed in a pseudo-Latin language which more or less corresponds to 'proper' Latin.</h2>
            </div>
        </div>
    </section>
    <section className="howitworks-page-section">
        <Container>
            <div class="heading-title">
				<h2>How It Works</h2>
			 	<p>Lorem Ipsum is composed in a pseudo-Latin language which more or less corresponds to 'proper' Latin. It contains a series of real Latin words. </p>
			</div>
		    <div class="howitworks-page-list">
                <Row>
                    <Col md="3">
                        <div class="howitworks-page-icon">
                            <img src="/images/st-1.svg" alt="" />
                        </div>
                    </Col>
                    <Col md="9">
                        <div class="howitworks-page-content">
                            <h1>Create your VirtDrop account.</h1>
                            <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.</p>
                        </div>
                    </Col>
                </Row>
            </div>    
            <div class="howitworks-page-list">
				<Row>
                    <Col md="3">
						<div class="howitworks-page-icon">
							<img src="images/st-2.svg" alt="" />
						</div>
                    </Col>
                    <Col md="9">
                    	<div class="howitworks-page-content">
							<h1>Fill out short questionnaire or Book a Discovery Call.</h1>
							<p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.</p>
						</div>
                    </Col>
				</Row>
			</div>
			<div class="howitworks-page-list">
                <Row>
                    <Col md="3">
						<div class="howitworks-page-icon">
							<img src="images/st-3.svg" alt="" />
						</div>
                    </Col>
                    <Col md="9">
                    	<div class="howitworks-page-content">
							<h1>Our team find your perfect assistant.</h1>
							<p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.</p>
						</div>
                    </Col>
				</Row>
			</div>
			<div class="howitworks-page-list">
                <Row>
                    <Col md="3">
						<div class="howitworks-page-icon">
							<img src="images/st-4.svg" alt="" />
						</div>
                    </Col>
                    <Col md="9">
                    	<div class="howitworks-page-content">
							<h1>We will introduce to your virtual assistant.</h1>
							<p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.</p>
						</div>
                    </Col>
				</Row>
			</div>
			<div class="howitworks-page-list">
				<Row>
                    <Col md="3">
                        <div class="howitworks-page-icon">
							<img src="images/st-5.svg" alt="" />
						</div>
                    </Col>
                    <Col md="9">
						<div class="howitworks-page-content">
							<h1>You can start assigning work to your virtual assistant.</h1>
							<p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.</p>
						</div>
                    </Col>
				</Row>
			</div>
			<div class="howitworks-page-list">
                <Row>
                    <Col md="3">
						<div class="howitworks-page-icon">
							<img src="images/st-6.svg" alt="" />
						</div>
                    </Col>
                    <Col md="9">
						<div class="howitworks-page-content">
							<h1>You manage, we provide support.</h1>
							<p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.</p>
						</div>
					</Col>
				</Row>
			</div>    
		</Container>
	</section>

	<section class="getstarted-banner-section">
		<Container>
			<div class="getstarted-banner-content">
		    	<div class="getstarted-media">
	    			<img src="/images/banner3.jpg" alt="" />
	    		</div>
		    	<div class="getstarted-content">
			       <h2>Looking for an assistant, marketer, or simply someone to work online?</h2>
			       <p>We have a community of passionate people who love what they do, and are looking for new opportunities</p>
			       <Link class="get-btn" to="/register">Get Started!</Link>
			    </div>
			</div>
		</Container>
	</section>

    </>
    );
  }
}

export default HowItWorksPage;
