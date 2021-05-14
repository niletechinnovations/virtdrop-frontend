import React from "react";
import commonService from '../../../core/services/commonService';
import Loader from '../../../views/Loader/Loader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class ProceedToPaymentPage extends React.Component {
  constructor( props ){
    super( props );
    this.state = {
        choosedPlanData: [],
        loading: false,
    };
  }

  componentDidMount() {
    if( localStorage.getItem( 'choosedPlanId' ) ){
        const formData = {
            "planId": localStorage.getItem( 'choosedPlanId' ),
            "planVariationId": localStorage.getItem( 'choosedplanVariationId' )
        }
        this.setState({ choosedPlanData: formData });
        this.buySubscription();
    }else{

    }
  }

  // Buy subscription plan
  buySubscription(){
    if(this.state.choosedPlanData){
      
      this.setState( { loading:true }, () =>{
        commonService.postAPIWithAccessToken('subscription/buy', this.state.choosedPlanData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {           
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          }
          console.log(res.data);
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
    const { loading  } = this.state;
    
    let loaderElement = '';
    if(loading)
      loaderElement = <Loader />

      return (
        <>
        <section className="main-content py-5">
            <div className="container py-5">
                {loaderElement}
                <h3 className="py-5 text-center">Please wait while we transfer you to PayPal.....</h3>
            </div>
        </section>

        </>
      );
  }
}

export default ProceedToPaymentPage;