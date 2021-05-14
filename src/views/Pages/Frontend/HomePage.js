import React from "react";
import { Link } from 'react-router-dom';
import commonService from '../../../core/services/commonService';
import {  Input, Button, Form, Modal, ModalHeader, ModalBody} from 'reactstrap';
import Loader from '../../../views/Loader/Loader';
import { ToastContainer, toast } from 'react-toastify';

import HomeSlider from "../../Sliders/HomeSlider";
import "./HomePage.css";
import "../../../containers/CommonLayout/planSwitcher.css";
import video from '../../../assets/video/VIRTDROP_v2.mp4';
import ebookFile from '../../../assets/ebook/e-Book_VirtDROP.pdf';

class HomePage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            modal: false,
            videoModal: false,
            loading: false,
            newsletterEmail: '',
            newsletterName: '',
            newsletterPhone: ''
        }
        this.changeHandler = this.changeHandler.bind(this);
        this.submitNewsletterForm = this.submitNewsletterForm.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        if ( localStorage.getItem( 'newsletterSubscribed' ) ) 
            this.setState({ modal: false });
        else
            this.setState({ modal: !this.state.modal });
    }
    
    submitNewsletterForm(e) {
        e.preventDefault();
        if (this.state.newsletterEmail!==''  && this.state.newsletterName!=='') {
            const formData = { 
                contactPerson: this.state.newsletterName,
                phone: this.state.newsletterPhone,
                email: this.state.newsletterEmail.toLowerCase() 
            };
            this.setState( { loading: true }, () => {
              commonService.postAPI( `common/newsletter`, formData ).then( res => {
                localStorage.setItem( 'newsletterSubscribed', true );
                if ( undefined === res.data || !res.data.status ) {
                    this.setState( { loading: false } );
                    toast.error(res.data.message);
                    return;
                  }
                  toast.success(res.data.message);
                  this.setState( { newsletterEmail: '', modal: false, loading: false, errors: {} } );
                  var strWindowFeatures = "location=yes,height=650,width=520,scrollbars=yes,status=yes";
                  setTimeout(() => {
                        window.open(ebookFile,"_blank",strWindowFeatures);
                  }, 200);
                } )
                .catch( err => {
                  toast.error(err.message);
                  this.setState( { loading: false} );
                } )
            } )
        }else{
            toast.error("Name and Email should not be empty!"); return;
        }
    };

    changeHandler = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    toggle = () => {
        this.setState({ modal: !this.state.modal, newsletterEmail:'', newsletterName:'', newsletterPhone:'' });
    }
    videoToggle = () => {
        this.setState({ videoModal: !this.state.videoModal });
    }
    
    render() {
        const { loading, modal, videoModal, newsletterEmail, newsletterName, newsletterPhone } = this.state;
        let loaderElement = '';
        if(loading)
          loaderElement = <Loader />
    
        return (
        <>
        <ToastContainer /> 
        {loaderElement} 
        
        <section className="main-slider-section">
		    <div className="container">
                {/* Homepage slider using owl-carousel */}
                <HomeSlider />
            </div>
        </section>
        
        <section className="about-section">
            <div className="container">
                <div className="row flex-column-reverse flex-lg-row">
                    <div className="col-md-8 col-lg-6 col-sm-12">
                        <div className="about-content-info">
                            <h1>Searching for an excellent Virtual Assistant?</h1>
                            <p>At VirtDrop, we connect busy individuals with the very best Virtual Assistants at a competitive price. Our in-house team matches you to the perfect remote employee, depending on your specific tasks and requirements.</p>
                            <p>All it takes is a short Q+A to understand how an assistant can best meet your needs, and we’ll do the rest. With our system, you save time on admin and in-house costs from your first moment of contact, with these savings continually growing over time.</p>
                            <p><b>Vetted Virtual Assistants</b></p>
                            <p>We offer a pool of vetted, expert Digital Assistants, each one personally assessed by our team to ensure they possess the necessary skills to complete your tasks. We guarantee all Virtual Assistants have access to a reliable internet connection, meaning you’ll never be left without a safe pair of hands.</p>
                            <p><b>Supported by the VirtDrop Team</b></p>
                            <p>Our in-house team oversee and continually train our Virtual Assistant pool, ensuring your tasks can be carried out to the highest level of proficiency.</p>
                        </div>
                    </div>
                    <div className="col-md-4 col-lg-6 col-sm-12">
                        <div className="about-media">
                            <img src="/images/gl-media.png" alt="about-us" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="service-section">
		<div className="container">
			<div className="heading-title">
			 <h2>Our Virtual Assistant Services</h2>
			 <p>Our Digital Assistants offer support for a wide range of tasks. Whether you need a hand with business administration or help with personal task management, we’ll have the perfect PA for you.</p>
			</div>
			<div className="service-list">
				<div className="row">
					<div className="col-md-5 col-lg-5 col-sm-12">
						<div className="service-media">
							<img src="/images/ser-1.png" alt="Business Assistance" />
						</div>
					</div>
					<div className="col-md-7 col-lg-7 col-sm-12">
						<div className="service-content-info">
							<h1>Business Assistance</h1>
							<p>Few business owners or high-level employees feel they have adequate time to achieve their daily tasks. Inboxes overflow, appointments can be incorrectly scheduled, and you’re often unable to give key details the necessary attention they deserve.</p>
							<p><b>Our Virtual Assistants can take on your time-consuming tasks, leaving you to focus on the things you love.</b></p>
							<p>Do you want more time to focus on high-level tasks? Maybe you’d like to improve your work-life balance? Whether you have a specific task in mind or aim to just free up some time, we can introduce you to a Virtual Assistant to quickly begin streamlining your tasks. If you find yourself regularly undertaking any of the following, consider putting your time to better use by hiring a Virtual Assistant:</p>
							<ul>
								<li>Administrative/data entry tasks</li>
								<li>E-commerce related tasks</li>
								<li>Social media management</li>
								<li>Customer support</li>
								<li>Graphic designing</li>
								<li>Bookkeeping</li>
                                <li>And more!</li>
							</ul>
							{/* <a className="learn-btn" href="/services">Learn More</a> */}
                             <Link className="learn-btn" to={{ pathname: "https://www.virtdrop.com/our-services/" }} target="_blank">Learn More</Link>
						</div>
					</div>
				</div>
			</div>
			<div className="service-list">
				<div className="row flex-column-reverse flex-lg-row">
					<div className="col-md-7 col-lg-7 col-sm-12">
						<div className="service-content-info">
							<h1>Personal Assistance</h1>
							<p>Providing much needed administrative support, Personal Assistants are key to ensuring any business runs smoothly. Working closely with executive staff and senior management, they provide a safe pair of hands for a wide variety of tasks. Do you often find yourself swamped with smaller chores that stop you from focusing on the bigger picture? A Virtual Personal Assistant can take these tasks off of your desk, allowing you time to complete more important activities.</p>
							<p><b>VirtDrop Virtual Assistants take on Personal Assistant duties, offering you a safe pair of hands.</b></p>
							<p>Personal Assistant tasks vary widely depending on the role. However, if you find yourself undertaking any of the below, consider a Virtual PA to take these tasks off of your to-do list:</p>
							<ul>
								<li>Management of diaries, including organizing appointments and meetings.</li>
								<li>Controlling access to company executives or management</li>
								<li>The first point of contact in phone calls and dealing with correspondence</li>
								<li>Management of filing systems and databases</li>
								<li>Filing and collating expenses</li>
							</ul>
							{/* <a className="learn-btn" href="/">Learn More</a> */}
						</div>
					</div>

					<div className="col-md-5 col-lg-5 col-sm-12">
						<div className="service-media">
							<img src="/images/ser-2.png" alt="Personal Assistance" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

    <section className="whyus-section">
		<div className="container">
			<div className="row">
				<div className="col-md-5 col-lg-5 col-sm-12">
					<div className="whyus-media">
						<div className="whyus-media-1">
							<img src="images/w1.jpg" alt="" />
						</div>
						<div className="whyus-media-2">
							<img src="images/w2.jpg" alt="" />
						</div>
						<div className="whyus-media-3">
							<img src="images/w3.jpg" alt="" />
						</div>
					</div>
				</div>
				<div className="col-md-7 col-lg-7 col-sm-12">
					<div className="whyus-content-info">
						<h1>Why VirtDrop?</h1>
						<p>VirtDrop was born out of the real-world frustrations you’ve probably encountered yourself. All too often we’d find ourselves focusing on too many time-consuming smaller tasks, inhibiting us from tackling bigger challenges and achieving larger goals. Looking for ways to streamline our business, we found Virtual Assistants allowed us to free up time and meet crucial objectives, whilst saving on the costs and admin in-house employees would incur.</p>
						<p>Having seen the benefit of Virtual Assistants first-hand, we’ve made it our mission to introduce this time-saving, business-boosting process to as large an audience as possible.</p>
						<p>VirtDrop caters to a diverse array of clients, all looking to maximize their business activities whilst minimizing their expenses. Many of our clients are based in New York and operate in sales, marketing, and real estate industries.</p>
						<p>VirtDrop is a leading Virtual Assistant company registered in New York. Our goal is to help businesses become more efficient and productive, enabling them to more easily achieve their goals.</p>
						{/* <a className="learn-btn" href="/how-it-works">Learn More</a> */}
                        <Link className="learn-btn" to={{ pathname: "https://www.virtdrop.com/how-it-works/" }} target="_blank">Learn More</Link>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section className="Video-section">
		<div className="container">
			<div className="Video-card">
        		<a href="#!" onClick={this.videoToggle}>
					<img src="images/video.jpg" alt="video" />
				</a>
			</div>
		</div>
	</section>
    <section className="become-virdrop-section">
        <div className="container">
            <h5 className="text-center text-white mb-4">We actively support a community of passionate Digital Assistants who love what they do. Want to join the team?</h5>
            <p className="text-center">
                <Link to="/be-a-virdrop-va" className="get-btn">BECOME A VIRTUAL ASSISTANT</Link>
            </p>
        </div>
    </section>
    <section className="plan-section">
        <div className="container">
            <div className="heading-title text-center">
                <h2>Pricing</h2>
            </div>
            <div className="plan-pricing-info">
                <p className="text-center">Our pricing is as straight forward and stream lined as everything else we offer. Our Virtual Assistants are available at a flat-rate of 
                <span className="pricing-info">
                    {/* <Link className="text-white" to="/booking">Request a Quote</Link> */}
                    <Link  className="text-white" to={{ pathname: "https://www.virtdrop.com/pricing/" }} target="_blank">Request a Quote</Link>
                </span></p>
            </div>
            
        </div>      
    </section>

        <Modal isOpen={modal} toggle={this.toggle}  className="modal-dialog modal-dialog-centered newsletter-modal">
          <ModalHeader toggle={this.toggle}>Grab your Virtdrop eBook !!</ModalHeader>
          <Form onSubmit={this.submitNewsletterForm} noValidate>
            <ModalBody>
                <div className="subscribeNews-info">
                    <div className="subscribeNews-text">
                        <p>To get your Virtdrop eBook enter your name and email below.</p>
                    </div>
                    <div className="subscribeNews-group">
                        <Input className="subscribe-control" type="text" name="newsletterName" placeholder="Enter your name" value={ newsletterName} onChange={this.changeHandler} required />
                    </div>    
                    <div className="subscribeNews-group">
                        <Input type="email" placeholder="Enter your email address" className="subscribe-control" name="newsletterEmail" value={ newsletterEmail} onChange={this.changeHandler} required />
                    </div>    
                    <div className="subscribeNews-group">
                        <Input type="tel" placeholder="Enter your phone number (optional)" className="subscribe-control" name="newsletterPhone" value={ newsletterPhone} onChange={this.changeHandler} />
                        <Button className="submit_button" type="submit">Submit</Button>
                    </div>
                    <p className="subscribe-text-info">Looking for work? <Link to="/be-a-virdrop-va">Apply here to become a Virtual Assistant</Link></p>
                </div>
            </ModalBody>
          </Form>
        </Modal>

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

export default HomePage;