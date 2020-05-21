import React from "react";
import { Container, Row, Col } from 'reactstrap';
import { Link } from "react-router-dom";
import "./WhyUsPage.css";

class WhyUsPage extends React.Component {

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
            <h2>Lorem Ipsum is composed in a pseudo-Latin language which more or less corresponds to 'proper' Latin.</h2>
            </div>
        </div>
    </section>
    <section className="whyus-video-section">
        <Container>
            <div class="heading-title">
				<h2>Why Us</h2>
			 	<p>Lorem Ipsum is composed in a pseudo-Latin language which more or less corresponds to 'proper' Latin. It contains a series of real Latin words. </p>
			</div>
			<div class="whyus-video-card">
				<a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
					<img src="/images/video.jpg" alt="Video" />
				</a>
			</div>    
        </Container>
    </section>

    <section class="whyus-page-section">
		<Container>
			<Row>
				<Col md="6">
					<div class="whyus-page-media">
						<div class="whyus-media1">
							<img src="/images/w4.jpg" alt="" />
						</div>
						<div class="whyus-media2">
							<img src="/images/w5.jpg" alt="" />
						</div>
					</div>
				</Col>
				<Col md="6">
					<div class="whyus-page-content">
						<h1>Why US, VIRTDROP?</h1>
						<p>VIRTDROP is a top virtual assistance company registered in New York with the aim to provide the needed high-quality virtual assistant services to every client.</p>
						<p>We began our operations with a client and a VA. On January 2019, the company began registration, building contracts and documents, and creating policies.</p>
						<p>Our first client came from the E-Commerce platform Amazon. We were able to provide central operations for this Amazon seller initially for just 4 hours. That person eventually added another VA to become responsible for the infographics.</p>
						
				        <p><b>Our Goal is to set the bar in Virtual Assistance world by providing VAs that have the following traits:</b></p>
						<ul>
						<li>ethical and professional</li>
						<li>aligned with the employer’s goals</li>
						<li>honest</li>
						<li>capable of sharing their inputs well</li>
						<li>shares the employer’s sentiments</li>
						<li>good and reliable with genuine sincerity</li>
						<li>dedicated to do everything right</li>
						<li>cares for the business and treats it as their own</li>
						</ul>
						
					</div>
				</Col>
			</Row>
		</Container>
	</section>

	<section class="why-choose-section">
	    <Container>
	    	<div class="heading-title">
				<h2>Why Us</h2>
			 	<p>Lorem Ipsum is composed in a pseudo-Latin language which more or less corresponds to 'proper' Latin. It contains a series of real Latin words. </p>
			</div>
	        <Row>
	        	<Col md="4">
	            	<div class="why-choose-info">
	            		<div class="why-choose-icon">
	            			<img src="/images/timezone.svg" height="50" alt="" />
	            		</div>
	            		<div class="why-choose-content">
	            			<h2>Working in Your Timezone</h2>
	            			<p>Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.</p>
	            		</div>
	                </div>	
	            </Col> 		

	        	<Col md="4">
	            	<div class="why-choose-info">
	            		<div class="why-choose-icon">
	            			<img src="/images/Affordable.svg" height="50" alt="" />
	            		</div>
	            		<div class="why-choose-content">
	            			<h2>Affordable</h2>
	            			<p>Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.</p>
	            		</div>
	                </div>	
	            </Col>	
	        	<Col md="4">
	            	<div class="why-choose-info">
	            		<div class="why-choose-icon">
	            			<img src="/images/professions-and-jobs.svg" height="50" alt="" />
	            		</div>
	            		<div class="why-choose-content">
	            			<h2>Experienced Professionals</h2>
	            			<p>Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.</p>
	            		</div>
	                </div>	
	            </Col>
	        	<Col md="4">
	            	<div class="why-choose-info">
	            		<div class="why-choose-icon">
	            			<img src="/images/Certified.svg" height="50" alt="" />
	            		</div>
	            		<div class="why-choose-content">
	            			<h2>Certified Staff</h2>
	            			<p>Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.</p>
	            		</div>
	                </div>	
	            </Col> 		
	        	<Col md="4">
	            	<div class="why-choose-info">
	            		<div class="why-choose-icon">
	            			<img src="/images/Support.svg" height="50" alt="" />
	            		</div>
	            		<div class="why-choose-content">
	            			<h2>Help & Support</h2>
	            			<p>Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.</p>
	            		</div>
	                </div>	
	            </Col>
	        </Row>
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

export default WhyUsPage;
