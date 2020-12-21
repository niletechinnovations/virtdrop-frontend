import React from "react";
import { Container, Row, Col, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from "react-router-dom";
import video from '../../../../assets/video/VIRTDROP_v2.mp4';
import "./ServicesPage.css";

class ServicesPage extends React.Component {
  constructor(props){
	super(props);
	this.state = {
		videoModal: false,
		loading: false,
	}
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  
  videoToggle = () => {
	this.setState({ videoModal: !this.state.videoModal });
  }

  render() {
	const { videoModal } = this.state;

	return (
      <>
    <section className="banner-section">
        <div className="banner-media-content">
            <div className="banner-media">
            <img src="/images/banner5.jpg" alt="Why Us" />
            </div>
            <div className="banner-content">
            <h1>From marketing to graphic design, Virtual Assistants can take any task off of your hands.</h1>
            </div>
        </div>
    </section>
    <section className="whyus-video-section">
        <Container>
            <div class="heading-title">
				<h2>Services</h2>
			 	<p>VirtDrop offers a huge range of services. Whatever your needs, we have capable Virtual Assistants available to lighten the load.</p>
			</div>  
        </Container>
    </section>
	<section className="Video-section mb-5">
		<div className="container">
			<div className="whyus-video-card">
        		<a href="#!" onClick={this.videoToggle}>
					<img src="images/video.jpg" alt="video" />
				</a>
			</div>
		</div>
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
						<h1>Virtual Assistant Services We Offer.</h1>
						<p>As a leading Virtual Assistant service, VirtDrop provides access to high-quality Digital Assistants and Virtual PAs in just a few simple steps.</p>
						<p>Many people consider employing a VA, but they aren’t always certain if their tasks can be completed by somebody else.</p>
						<p>VirtDrop offers Digital Assistants who are capable of handling a huge range of tasks; from administration tasks that help keep your business in check, to personal assistant responsibilities that ensure a better work-life balance.</p>
						
				        <p><b>Some of the jobs VirtDrop Virtual Assistants can complete include:</b></p>
						<ul>
							<li>Administrative/data entry tasks</li>
							<li>E-commerce related tasks</li>
							<li>Social media management</li>
							<li>Customer support</li>
							<li>Graphic designing</li>
							<li>Bookkeeping</li>
							<li>And more!</li>
						</ul>
					</div>
				</Col>
			</Row>
		</Container>
	</section>

	<section class="why-choose-section">
	    <Container>
	    	<div class="heading-title">
				<h2>Why VirtDrop?</h2>
			 	<p>At VirtDrop, we have first-hand experience of the power of Virtual Assistants. Our company was created from the real-life need of requiring an extra pair of hands, fast. We work to the following high-standards to ensure further efficiency.</p>
			</div>
	        <Row>
	        	<Col md="4">
	            	<div class="why-choose-info">
	            		<div class="why-choose-icon">
	            			<img src="/images/timezone.svg" height="50" alt="" />
	            		</div>
	            		<div class="why-choose-content">
	            			<h2>Working in Your Timezone</h2>
	            			<p>Our team is based in New York meaning we’re always available during core office hours.</p>
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
	            			<p>As well as being competitively priced, our services allow you to save on ordinarily expensive admin costs.</p>
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
	            			<p>Whether it be our in-house team or Virtual Assistants, all of our staff are experienced in their fields and constantly learning.</p>
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
	            			<p>We thoroughly vet and interview our VAs to ensure only the most capable Assistants take care of your tasks.</p>
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
	            			<p>We offer help and support to all of our clients and Assistants alike, ensuring all tasks are handled efficiently.</p>
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
			       <h2>Do you have questions about the Virtual Assistant services we offer?</h2>
			       <p>Maybe you’re not sure if we can handle your task? Register today and we’ll contact to let you know how we can help.</p>
			       <Link class="get-btn" to="/booking">Get Started!</Link>
			    </div>
			</div>
		</Container>
	</section>

	<Modal isOpen={videoModal} toggle={this.videoToggle}  size="lg" className="modal-dialog modal-dialog-centered newsletter-modal">
		<ModalHeader toggle={this.videoToggle}>VirtDrop Video</ModalHeader>
		<ModalBody>
			<video width="100%" height="100%" controls >
				<source src={video} type="video/mp4"/>
			</video>
		</ModalBody>
	</Modal>

    </>
    );
  }
}

export default ServicesPage;
