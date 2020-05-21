import React from "react";
import { Row} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';

import Loader from '../../../views/Loader/Loader';
import "../../../containers/CommonLayout/planSwitcher.css";

class SubscriptionPlan extends React.Component {
  constructor(props){
    super(props);
    this.state = {  
      loading: true,
      paymentProcess: false,      
      planId: "",
      planList: [],
      activePlanType: 1,
    }    
    this.choosePlan = this.choosePlan.bind(this);  
  }

  componentDidMount() {    
    this.subscriptionPlanList(); 
  }
 
  subscriptionPlanList() {
    let getPlanListURL = '';
    if ( localStorage.getItem( 'accessToken' ) ) 
      getPlanListURL = commonService.getAPIWithAccessToken('subscription?planType=1')
    else
      getPlanListURL = commonService.getAPI('subscription?planType=1')

    this.setState( { loading: true}, () => {
      getPlanListURL
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( {  loading: false } );
            toast.error(res.data.message);             
            return;
          } 
          const subscriptionPlanData = res.data.data;
          this.setState( { loading: false,  planList: subscriptionPlanData} );
        } )
        .catch( err => {         
          this.setState( { loading: false } );
          toast.error(err.message);    
        } )
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
      
      if ( localStorage.getItem( 'accessToken' ) ) {
        const formData = {
          "planId": planId,
          "planVariationId": planVariationId
        }

        this.setState( { loading:true }, () =>{
          commonService.postAPIWithAccessToken('subscription/buy', formData)
          .then( res => {
            if ( undefined === res.data.data || !res.data.status ) {           
              this.setState( { loading: false} );
              toast.error(res.data.message);
              return;
            }
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

      }else{
        localStorage.setItem( 'choosedPlanId', planId );
        localStorage.setItem( 'choosedplanVariationId', planVariationId );
        this.props.history.push('/register');
      }
    }else{
        alert('Please choose a plan!');
        return false;
    }
  }

  render() {
    const { planList, activePlanType, loading } = this.state;
    let loaderElement = '';
    if(loading)
        loaderElement = <Loader />
    
       return (
        <section className="plan-section">
            {loaderElement}
            <ToastContainer /> 
            
            <div className="container p-4">
                <div className="heading-title text-center">
                    <h2>Subscription Plans</h2>
                    <p className="text-center">Choose the plan that suits your business best.</p>
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
                    <Row>
                    { planList.map( (planInfo, index) =>

                        <div className="col-md-3"  key={index}>
                            <div className={ ( index===1 ? 'plan-intro-card current-plan' : 'plan-intro-card' ) }>
                                { ( index===1 ? <div className="ribbon">Best Value</div> : '' ) }
                                <h2>{planInfo.planName}</h2>
                                
                                { (activePlanType===1) ? 
                                    <div className="price-info">
                                        <div className="price-value">${planInfo.planVariation[0].amount}</div>
                                        <span className="price-per">/ per month</span>
                                    </div>
                                :
                                <div className="price-info">
                                        <div className="price-value">${planInfo.planVariation[1].amount}</div>
                                        <span className="price-per">/ per year</span>
                                    </div>
                                }                              
                                <div className="plan-point-list">
                                    <h4>Includes:</h4>
                                    <ul>
                                    <li><strong>30 Days Free Trial</strong></li>
                                    <li>Up to {planInfo.advertisementAccess} Listings</li>
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
                                <button onClick={ ()=> this.choosePlan(planInfo.planId, index)  } className="btn btn-conversion" disabled={ (planInfo.isPlanActive ? 'disabled' : '' ) }>{ (planInfo.isPlanActive ? 'Active Plan' : 'Subscribe Now' ) }</button>
                            </div>
                        </div>
                    )}

                    </Row>
                </div>  
            </div>      
        </section>
        );
    }
}

export default SubscriptionPlan;