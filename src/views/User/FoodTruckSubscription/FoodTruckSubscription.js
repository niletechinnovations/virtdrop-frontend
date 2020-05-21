import React from "react";
import { Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../../views/Loader/Loader';
import "./FoodTruckSubscription.css";
import "../../../containers/CommonLayout/planSwitcher.css";

const getPlanType = (planType) => {
    if(planType === 1)
      return 'Month';
    else if(planType === 2)
      return 'Quater';
    if(planType === 3)
      return 'Half Year';
    if(planType === 4)
      return 'Year';
}

class FoodTruckSubscription extends React.Component {
  constructor( props ){
    super( props );
    this.state = {
        planList: [],
        activePlanType: 1,
        loading: false,
    };
  }

  componentDidMount() {
    this.planList();
  }

  /*Plan List API*/
  planList() {
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('subscription?planType=1')
        .then( res => {
           
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }
          this.setState({loading:false, planList: res.data.data});
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          } else {
            this.setState( { loading: false } );
            toast.error(err.message);
          }
        } )
    } )
  }

  // Buy subscription plan
  choosePlan(planId, index){
    if(planId!==''){
      let choosedPlanInfo = this.state.planList[index];
      let planVariationId = '';
      if(this.state.activePlanType===1)
        planVariationId = choosedPlanInfo.planVariation[0].id;
      else
        planVariationId = choosedPlanInfo.planVariation[1].id;
      
      const formData = {
        "planId": planId,
        "planVariationId": planVariationId
      }

      console.log(formData);
      
      this.setState( { loading:true }, () =>{
        commonService.postAPIWithAccessToken('subscription/buy', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {           
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          }
          //console.log(res.data);
          if (typeof window !== 'undefined') {
            window.location.href = res.data.data.redirectUrl;
          }
        })
        .catch( err => {
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }else{
            this.setState( { loading: false } );
            toast.error(err.message);
          }
        })
      } );
    }
  }

  //Cancel subscription
  cancelSubscription(subscriberId){
    if(subscriberId!==''){
      if (window.confirm('Are you sure you want to cancel this subscription?')) {
        const formData = {
          "subscriberId": subscriberId
        }
        this.setState( { loading:true }, () =>{
          commonService.postAPIWithAccessToken('subscription/cancel', formData)
          .then( res => {
            if ( undefined === res.data.data || !res.data.status ) {           
              this.setState( { loading: false} );
              toast.error(res.data.message);
              return;
            }
            toast.success(res.data.message);
            this.planList();
          })
          .catch( err => {
            if(err.response !== undefined && err.response.status === 401) {
              localStorage.clear();
              this.props.history.push('/login');
            }else{
              this.setState( { loading: false } );
              toast.error(err.message);
            }
          })
        } );
      }
    }
  }

  changePlanType = () => {
    if(this.state.activePlanType===1)
      this.setState( { activePlanType: 4 } );
    else
      this.setState( { activePlanType: 1 } );
  }


  render() {
    const { loading, planList, activePlanType  } = this.state;
    
    let loaderElement = '';
    if(loading)
      loaderElement = <Loader />

      return (
        <>
        <section className="pricing py-3 px-2">
            <div className="container">
                {loaderElement}
                <h2 className="pageHeading">
                  Business Plan
                  <Link to="/advertiser/plan" className="addListing btn-success btn-sm pull-right"> Advertisement Plan</Link>
                </h2>
                <hr className="divider" />

                <div className="pricing-section">
                  <label className={ ( activePlanType===1 ? 'toggler toggler--is-active' : 'toggler' ) } id="filt-monthly">Monthly</label>
                  <div className="toggle">
                    <input type="checkbox" id="switcher" className="check" onClick={ () =>  this.changePlanType() } />
                    <b className="b switch"></b>
                  </div>
                  <label className={ ( activePlanType===4 ? 'toggler toggler--is-active' : 'toggler' ) } id="filt-yearly">Yearly</label>
                </div>

                <Row>
                    { planList.map( (planInfo, index) =>
                    
                        <Col lg={6} className="mb-4" key={index}>
                            <div className={'card mb-5 mb-lg-0 '+(planInfo.isPlanActive ? 'active' :'' ) }>
                              <div className="card-body">
                                <h5 className="card-title text-muted text-uppercase text-center">{planInfo.planName}</h5>
                                { (activePlanType===1) ? 
                                  <h6 className="card-price monthly text-center">${planInfo.planVariation[0].amount}<span className="period">/{getPlanType(Number(planInfo.planVariation[0].duration))}</span></h6>
                                  :
                                  <h6 className="card-price yearly text-center">${planInfo.planVariation[1].amount}<span className="period">/{getPlanType(Number(planInfo.planVariation[1].duration))}</span></h6>
                                }
                                <hr />
                                <div className="plan-description">
                                  Up to {planInfo.advertisementAccess} Listings<br />
                                  {planInfo.description}
                                </div>
                                <button className="btn btn-block btn-primary text-uppercase" onClick={ () =>  ( planInfo.isPlanActive ? '' : this.choosePlan(planInfo.planId, index) ) } disabled={ (planInfo.isPlanActive ? 'disabled' : '' ) }>{ (planInfo.isPlanActive ? 'Current Plan' : 'Buy Now' ) }</button>
                                { ( planInfo.isPlanActive ? <p className="text-center mb-0"><button className="btn-sm btn-danger mt-3" onClick={ () =>  this.cancelSubscription(planInfo.subscriberId) }>Cancel Subscription</button></p> : '' ) }
                              </div>
                            </div>
                        </Col>
                    )}
                    
                </Row>
            </div>
        </section>

        </>
      );
  }
}

export default FoodTruckSubscription;