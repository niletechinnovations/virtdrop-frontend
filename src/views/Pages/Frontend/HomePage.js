import React from "react";
import { Link } from 'react-router-dom';
//import commonService from '../../../core/services/commonService';

import HomeSlider from "../../Sliders/HomeSlider";
import "./HomePage.css";
import "../../../containers/CommonLayout/planSwitcher.css";

class HomePage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            planList: [],
            activePlanType: 1,
            loading: true,
        } 
      }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.planList();
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

    render() {
        const { planList, activePlanType } = this.state;

        return (
        <>
        <section className="main-slider-section">
		    <div className="container">
                <div className="main-slider-media">

                    {/* Homepage slider using owl-carousel */}
                    
                    <HomeSlider />

                    <div className="main-slider-content">
                        <h2>Have your work and life balanced with our <span>virtual assistants</span></h2>
                        <Link className="explore-btn" to="/">Explore How It Works</Link>
                    </div>
                </div>
            </div>
        </section>
        
        <section className="about-section">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 col-lg-6 col-sm-8">
                        <div className="about-content-info">
                            <h1>What does Virtdrop do?</h1>
                            <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.</p>
                            <p>Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator. The passage is attributed to an unknown typesetter in the 15th century.</p>
                            <p><b>Marketing Solutions for Advertisers</b></p>
                            <p>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying.</p>
                            <p><b>Bring all your Channels Together</b></p>
                            <p>Lorem Ipsum is composed in a pseudo-Latin language which more or less corresponds to 'proper' Latin. It contains a series of real Latin words.</p>
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
			 <h2>Our Services</h2>
			 <p>Lorem Ipsum is composed in a pseudo-Latin language which more or less corresponds to 'proper' Latin. It contains a series of real Latin words. </p>
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
							<p>Oftentimes, you see your appointments in a mess, numerous travels that needs to get booked, your inbox overflowing, and an endless list of things you need to do. We have virtual assistants that have numerous skills that can handle all of your needs that may be personal or related to work so you can immediately relieve your stress.</p>
							<p><b>Allow us to work on your list of things to-do so you can go on and do the things you love.</b></p>
							<p>You can start by allowing your VA to streamline every information gets into your inbox, manage your extremely busy schedule, and set up the needed meetings. These people can also provide reminders whenever you need to plan a getaway for the weekend, track any packages, coordinate with a phone company, or have to make an important call on the phone.</p>
							<ul>
								<li>Research and Data Entry</li>
								<li>Content Creation</li>
								<li>Social Media Management</li>
								<li>Photo and Video Editing</li>
								<li>E-Commerce Assistance</li>
								<li>Web Design</li>
							</ul>
							<a className="learn-btn" href="/">Learn More</a>
						</div>
					</div>
				</div>
			</div>
			<div className="service-list">
				<div className="row">
					<div className="col-md-7 col-lg-7 col-sm-7">
						<div className="service-content-info">
							<h1>Personal Assistance</h1>
							<p>Personal assistants are people who work at the very heart of any business as they provide the needed administrative support. These people work closely with any executive staff or senior manager to provide the needed administrative assistance which is often on a one-to-one basis. The careers of personal assistance may vary but these people often play an important role in providing help to any manager so they can use their time wisely.</p>
							<p><b>Responsibilities of a Personal Assistant</b></p>
							<p>The tasks of personal assistants may vary from one company to another. However, here are some of the main responsibilities of a PA:</p>
							<ul>
								<li>Management of diaries and organization of appointments and meetings.</li>
								<li>Control in the access to the executive or manager</li>
								<li>First point of contact in phone calls and dealing with correspondence</li>
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
						<h1>Why US, VIRTDROP?</h1>
						<p>VIRTDROP is a top virtual assistance company registered in New York with the aim to provide the needed high-quality virtual assistant services to every client.</p>
						<p>We began our operations with a client and a VA. On January 2019, the company began registration, building contracts and documents, and creating policies.</p>
						<p>Our first client came from the E-Commerce platform Amazon. We were able to provide central operations for this Amazon seller initially for just 4 hours. That person eventually added another VA to become responsible for the infographics.</p>
						<p>VIRTDROP eventually catered to a diverse array of clients who are starting out in their business to minimize their expenses. Most of the company’s clients are based in New York City and are often in the business of sales, marketing, and real estate.</p>
						<p>VIRTDROP is a top virtual assistance company registered in New York. Our goal is to help business become more efficient and productive to that they can reach their goals..</p>
						
						<a className="learn-btn" href="/">Learn More</a>
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
            <h5 className="text-center text-white mb-4">We have a community of passionate people who love what they do, and are looking for new opportunities</h5>
            <p className="text-center">
                <Link to="/be-a-virdrop-va" className="get-btn">BE A VIRTDROP VA</Link>
            </p>
        </div>
    </section>
    <section className="plan-section">
        <div className="container">
            <div className="heading-title text-center">
                <h2>Plans & Pricing</h2>
                <p className="text-center">Lorem Ipsum is composed in a pseudo-Latin language which more or less corresponds to 'proper' Latin. It contains a series of real Latin words.</p>
            </div>

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
        </div>      
    </section>

      
        </>
    );
  }
}

export default HomePage;