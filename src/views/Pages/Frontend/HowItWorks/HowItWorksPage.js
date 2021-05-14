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
            <h1>Our streamlined system means you’re only a few steps away from being introduced to your perfect Virtual Assistant.</h1>
            </div>
        </div>
    </section>
    <section className="howitworks-page-section">
        <Container>
            <div class="heading-title">
				<h2>How It Works</h2>
			 	<p>We understand you’re extremely busy. That's why we've made our booking process as simple as possible. Each step is outlined below.</p>
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
                            <p>Simply click here or the “Hire a Virtual Assistant” link in the top right of this screen and fill in your details. You’ll only ever have to do this once. It’s free to sign up and we only ask for the necessities - no trick questions here!</p>
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
							<h1>Fill Out a Short Questionnaire or Book a Discovery Call.</h1>
							<p>You now have the option of filling out a short questionnaire or booking a 15-minute Discovery Call with one of our team. Both are designed to be time-efficient and either method will give us all the information we need. Once this step is complete you can leave the rest to us!</p>
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
							<h1>Our Team Finds Your Perfect Assistant.</h1>
							<p>Armed with your feedback and key requirements, we examine our catalog of Virtual Assistants to assess those which best meet your needs. During this process, we analyze each Assistant’s key skills and discuss your requirements with them to ensure they can match your expectations.</p>
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
							<h1>We Introduce You to Your Virtual Assistant.</h1>
							<p>Once we’ve found your perfect Virtual Assistant, we’ll arrange an introduction at a time that suits you. This can be done via a video call or email, whichever you prefer.</p>
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
							<h1>You Can Begin Assigning Tasks to Your Virtual Assistant.</h1>
							<p>As soon as the introduction has taken place you can begin to assign work to your new Assistant. Yes, that was our process! Only a few things needed from you and we provide a Virtual PA as soon as feasibly possible. Start to hand responsibilities to your newest team member and quickly notice the additional time you have to focus on other tasks!</p>
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
							<h1>You Manage, We Provide Support.</h1>
							<p>Although you will have a direct working relationship with your Virtual Assistant, we continue our monitoring and training to ensure they are fulfilling their role. We keep track of our team through regular check-ins and daily reports, meaning if an Assistant ever needs to be substituted we will already have an understanding of the perfect candidate.</p>
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
			       <h2>That’s our process! So, what are you waiting for?</h2>
			       <p>We offer a community of passionate Virtual Assistants who love what they do and are eager for new opportunities.</p>
			       <Link class="get-btn" to="/booking">Get Started!</Link>
			    </div>
			</div>
		</Container>
	</section>

    </>
    );
  }
}

export default HowItWorksPage;
