import React, { Component } from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';
//import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';


class TransactionLists extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      dataLists: [],
      currentPalnData:'',
      formProccessing: false,
      loading: true,
      rowIndex: -1,
    } 
  }

  componentDidMount() {     
    this.itemLists({});
  }

  /* Transaction List API */
  itemLists(filterItem = {}) {
    let filterQuery = "?pageSize=10000";
    if(filterItem.filterFrom !== undefined && filterItem.filterFrom !== "" ){
       let newFromDate = this.getFormatDate( filterItem.filterFrom );
       filterQuery += (filterQuery !=="" ) ? "&start_date="+newFromDate : "?start_date="+newFromDate;
     }
     if(filterItem.filterTo !== undefined && filterItem.filterTo !== "" ){
       let newToDate = this.getFormatDate( filterItem.filterTo );
       filterQuery += (filterQuery !=="" ) ? "&end_date="+newToDate: "?end_date="+newToDate;
     }
    
      this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('statistics/client-payment-history/'+filterQuery)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }   
          this.setState({loading:false, dataLists: res.data.data.listItem});              
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }else {
            this.setState( { loading: false } );
            toast.error(err.message);
          }
        } )
    } )
  }
 
  render() {
    const { dataLists, loading } = this.state;
    let loaderElement = '';
    if(loading)        
      loaderElement = <Loader />

    return (
      
      <div className="dashboard-section">
      {loaderElement}
              
        <Card className="vd-card">
          <CardHeader>
            <div className="d-flex align-items-center">
              <div className="mr-auto">
                <h4 className="card-title"><img src="/images/billing.svg" height="30" alt="" /> My Transactions</h4>
              </div>
            </div>
          </CardHeader>
          <CardBody className="item-list-section">
            <div className="card-table table-responsive">
              <table className="table table-orders">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Transaction ID </th>
                    <th>Invoice No.</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Created on</th>
                  </tr>
                </thead>
                <tbody>
                  {dataLists.map((dataInfo, index) => 
                  <tr key={index}>
                    <td>
                      <span className="sno">{index+1}</span>
                    </td>
                    <td>{ dataInfo.transactionId }</td>
                    <td>#{ dataInfo.invoiceNo }</td>
                    <td>${dataInfo.amount}</td>
                    <td>{ (dataInfo.isPaid ? 'Paid' : 'Unpaid') }</td>
                    <td>{ (new Date(dataInfo.createdAt)).toLocaleDateString("en-US") }</td>
                  </tr>
                  
                  )}

                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

      </div>

    );
  }
}

export default TransactionLists;
