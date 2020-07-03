import React from "react";
import { Link } from 'react-router-dom';
//import commonService from '../../../core/services/commonService';
import {  Col, Row, Input, Button, Form, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

import HomeSlider from "../../Sliders/HomeSlider";
import "./HomePage.css";
import "../../../containers/CommonLayout/planSwitcher.css";

class HomePage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            planList: [],
            activePlanType: 1,
            modal: false,
            loading: true,
        } 
      }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.planList();
        this.setState({ modal: !this.state.modal  });
    }
    
        
    /*Plan List API*/
    planList() {
        this.setState( { loading: true}, () => {
            let data = [{"planId":"5e4d26519c854d33686c7d2e","planName":"Basic","isTrail":true,"description":"Unlimited Inquiries\nUnlimited Ratings\n24 Hour Service","planType":1,"planVariation":[{"id":"5e886e813c70762d1be26a0b","amount":9.99,"duration":"1","isActive":false},{"id":"5e886e813c70762d1be26a0a","amount":99.99,"duration":"4","isActive":false}],"advertisementAccess":20,"status":true,"isPlanActive":false,"subscriberId":""},{"planId":"5e4d26c69c854d33686c7d2f","planName":"Silver","isTrail":true,"description":"Unlimited Inquiries\nUnlimited Ratings\n24 Hour Service","planType":1,"planVariation":[{"id":"5e833838f496086caeb581fc","amount":19.99,"duration":"1","isActive":false},{"id":"5e833838f496086caeb581fb","amount":199.99,"duration":"4","isActive":false}],"advertisementAccess":50,"status":true,"isPlanActive":false,"subscriberId":""},{"planId":"5e5f6a01cf274e080880edc7","planName":"Gold","isTrail":true,"description":"Unlimited Inquiries\nUnlimited Ratings\n24 Hour Service","planType":1,"planVariation":[{"id":"5e833844f496086caeb581fe","amount":29.99,"duration":"1","isActive":false},{"id":"5e833844f496086caeb581fd","amount":299.99,"duration":"4","isActive":false}],"advertisementAccess":100,"status":true,"isPlanActive":false,"subscriberId":""},{"planId":"5e7e375ac463de186344d4f8","planName":"Platinum","isTrail":true,"description":"Unlimited Inquiries\nUnlimited Ratings\n24 Hour Service","planType":1,"numberofDisplay":0,"planVariation":[{"id":"5e83384ef496086caeb58200","amount":39.99,"duration":"1","isActive":false},{"id":"5e83384ef496086caeb581ff","amount":399.99,"duration":"4","isActive":false}],"advertisementAccess":200,"status":true,"isPlanActive":false,"subscriberId":""}]
            this.setState({loading:false, planList: data});
        } )
    }

    changePlanType = () => {
        if(this.state.activePlanType===1)
            this.setState( { activePlanType: 4 } );
        else
            this.setState( { activePlanType: 1 } );
    }

    choosePlan(planId, index){
        if(planId!=='' && index!==''){
          let choosedPlanInfo = this.state.planList[index];
          let planVariationId = '';
          if(this.state.activePlanType===1)
            planVariationId = choosedPlanInfo.planVariation[0].id;
          else
            planVariationId = choosedPlanInfo.planVariation[1].id;
            
            localStorage.setItem( 'choosedPlanId', planId );
            localStorage.setItem( 'choosedplanVariationId', planVariationId );
            this.props.history.push('/register');
        }else{
            alert('Please choose a plan!');
            return false;
        }
    }    

    toggle = () => {
        this.setState({
          modal: !this.state.modal
        });
      }

    render() {
        //planList, activePlanType
        const { modal } = this.state;

        return (
        <>
        <section className="main-slider-section">
		    <div className="container">
                {/* Homepage slider using owl-carousel */}
                <HomeSlider />
            </div>
        </section>
        
        <section className="about-section">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 col-lg-6 col-sm-8">
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
                    <div className="col-md-4 col-lg-6 col-sm-4">
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
					<div className="col-md-5 col-lg-5 col-sm-5">
						<div className="service-media">
							<img src="/images/ser-1.png" alt="Business Assistance" />
						</div>
					</div>
					<div className="col-md-7 col-lg-7 col-sm-7">
						<div className="service-content-info">
							<h1>Business Assistance</h1>
							<p>Few business owners or high-level employees feel they have adequate time to achieve their daily tasks. Inboxes overflow, appointments can be incorrectly scheduled, and you’re often unable to give key details the necessary attention they deserve.</p>
							<p><b>Our Virtual Assistants can take on your time-consuming tasks, leaving you to focus on the things you love.</b></p>
							<p>Do you want more time to focus on high-level tasks? Maybe you’d like to improve your work-life balance? Whether you have a specific task in mind or aim to just free up some time, we can introduce you to a Virtual Assistant to quickly begin streamlining your tasks. If you find yourself regularly undertaking any of the following, consider putting your time to better use by hiring a Virtual Assistant:</p>
							<ul>
								<li>Research and Data Entry</li>
								<li>Content Creation</li>
								<li>Social Media Management</li>
								<li>Photo and Video Editing</li>
								<li>E-Commerce Assistance</li>
								<li>Web Design</li>
							</ul>
							<a className="learn-btn" href="/why-us">Learn More</a>
						</div>
					</div>
				</div>
			</div>
			<div className="service-list">
				<div className="row">
					<div className="col-md-7 col-lg-7 col-sm-7">
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
							<a className="learn-btn" href="/">Learn More</a>
						</div>
					</div>

					<div className="col-md-5 col-lg-5 col-sm-5">
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
				<div className="col-md-5 col-lg-5 col-sm-5">
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
				<div className="col-md-7 col-lg-7 col-sm-7">
					<div className="whyus-content-info">
						<h1>Why VirtDrop?</h1>
						<p>VirtDrop was born out of the real-world frustrations you’ve probably encountered yourself. All too often we’d find ourselves focusing on too many time-consuming smaller tasks, inhibiting us from tackling bigger challenges and achieving larger goals. Looking for ways to streamline our business, we found Virtual Assistants allowed us to free up time and meet crucial objectives, whilst saving on the costs and admin in-house employees would incur.</p>
						<p>Having seen the benefit of Virtual Assistants first-hand, we’ve made it our mission to introduce this time-saving, business-boosting process to as large an audience as possible.</p>
						<p>VirtDrop caters to a diverse array of clients, all looking to maximize their business activities whilst minimizing their expenses. Many of our clients are based in New York and operate in sales, marketing, and real estate industries.</p>
						<p>VirtDrop is a leading Virtual Assistant company registered in New York. Our goal is to help businesses become more efficient and productive, enabling them to more easily achieve their goals.</p>
						<a className="learn-btn" href="/why-us">Learn More</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section className="Video-section">
		<div className="container">
			<div className="Video-card">
				<a href="/">
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
                <div className="pricing-info"><span className="pricing-value">$12</span> <span className="pricing-per-value">per hour.</span></div></p>
            </div>
            {/* 
            <div className="pricing-section">
                <label className={ ( activePlanType===1 ? 'toggler toggler--is-active' : 'toggler' ) } id="filt-monthly">Monthly</label>
                <div className="toggle">
                <input type="checkbox" id="switcher" className="check" onClick={ () =>  this.changePlanType() } />
                <b className="b switch"></b>
                </div>
                <label className={ ( activePlanType===4 ? 'toggler toggler--is-active' : 'toggler' ) } id="filt-yearly">Yearly</label>
            </div>
            
            <div className="plan-content-intro">
                <div className="row">
                { planList.map( (planInfo, index) =>

                    <div className="col-md-4 col-lg-3"  key={index}>
                        <div className={ ( index===1 ? 'pricing-card current-plan' : 'pricing-card' ) }>
                            { ( index===1 ? <div className="best-strip">Best Value</div> : '' ) }
                            <div className="pricing-head">
                                <h2>{planInfo.planName}</h2>
                            </div>                              
                            <div className="pricing-body">
                                <ul>
                                <li>Up to {planInfo.advertisementAccess} Hours</li>
                                {
                                    planInfo.description.split("\n").map(function(item, idx) {
                                        return (
                                            <li key={idx}>
                                                {item}
                                            </li>
                                        )
                                    })
                                }
                                </ul>
                            </div>
                            
                            <div className="pricing-foot">
                                { (activePlanType===1) ? 
                                    <div className="price-info">
                                        <div className="price-value">${planInfo.planVariation[0].amount}</div>
                                        <span className="price-per">/ Month</span>
                                    </div>
                                    :
                                    <div className="price-info">
                                        <div className="price-value">${planInfo.planVariation[1].amount}</div>
                                        <span className="price-per">/ Year</span>
                                    </div>
                                }
                                <button onClick={ ()=> this.choosePlan(planInfo.planId, index)  } className="btn-conversion">Subscribe Now</button>
                            </div>
                        </div>
                    </div>
                )}

                </div>
            </div>  
        
             */}
        </div>      
    </section>

        <Modal isOpen={modal} toggle={this.toggle}  className="full-width-modal-section subscribeNewsletter-modal">
          <ModalHeader toggle={this.toggle}>Subscribe Newsletter</ModalHeader>
          <Form onSubmit={this.subscribeNewsletter} noValidate>
            <ModalBody>
                <div className="subscribeNews-info">
                    <div className="subscribeNews-text">
                        <p>Sign up for news, deals, and time-saving ideas regarding Virtual Assistants. We know your inbox is already overflowing so we won’t send you spam!</p>
                    </div>
                    <div className="subscribeNews-group">
                        <input placeholder="Enter your email address" className="subscribe-control"  name="email_address"  type="text" />
                        <button className="submit_button" type="submit">Subscribe</button>
                    </div>
                    <p className="subscribe-text-info">Looking for work? <a href="/be-a-virdrop-va">Apply here to become a Virtual Assistant</a></p>
                </div>
            </ModalBody>
          </Form>
        </Modal>
      
        </>
    );
  }
}

export default HomePage;