import React, { Component } from 'react';
import { 
  Card, CardHeader, CardBody, Button, 
} from 'reactstrap';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';

//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";


class clientBillingList extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      dataLists: [],
      formProccessing: false,
      loading: false,
      rowIndex: -1,
      filterItem: { filter:'', filterVaType: '', filterNOB:'',  filterFrom:'',  filterTo:''}
    } 
    this.filterItemList = this.filterItemList.bind(this);
    this.payInvoice = this.payInvoice.bind(this);
  }

  componentDidMount() {        
    this.itemLists({});
  }

  /* Request List API */
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
    if(filterItem.filterVaType !== undefined && filterItem.filterVaType !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&vaType="+filterItem.filterVaType: "?vaType="+filterItem.filterVaType;
    
    if(filterItem.filterNOB !== undefined && filterItem.filterNOB !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&natureOfBusiness="+filterItem.filterNOB: "?natureOfBusiness="+filterItem.filterNOB;
    
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('billing'+filterQuery)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }
          this.setState({loading:false, dataLists: res.data.data.rowList});         
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

  payInvoice(invoiceId){
    if(invoiceId){
      const formData = {
        "invoiceId": invoiceId,
      }
      this.setState( { loading:true }, () =>{
        commonService.postAPIWithAccessToken('payment/pay', formData)
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
    }
  }
    
  filterItemList(){
    const filterItem = this.state.filterItem;
    this.itemLists(filterItem);
  }

  changeFilterHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    const filterItem = this.state.filterItem
    filterItem[name] = value;
    this.setState({ filterItem: filterItem });
  };
  setFilterFromDate = date => {
    let filterFormField = this.state.filterItem;
    filterFormField.filterFrom = date;
    this.setState({ filterItem: filterFormField });
  };
  setFilterToDate = date => {
    let filterFormField = this.state.filterItem;
    filterFormField.filterTo = date;
    this.setState({ filterItem: filterFormField });
  };

  resetfilterForm = () => {
    this.setState({
      filterItem: { filterFrom:'',  filterTo:'', filterStatus:''}
    });
    this.itemLists();
  }

  
  getFormatDate(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 101).toString().substring(1);
    var day = (date.getDate() + 100).toString().substring(1);
    return year + "-" + month + "-" + day;
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
                    <h4 className="card-title"><img src="/images/billing.svg" height="30" alt="" /> My Billing</h4>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="item-list-section">
                {/* <div className="Search-filter">
                  <div className="row">
                      <div className="col-md-3">
                        <div className="form-group">
                          <Input type="text" name="filterName" value={filterItem.filterName} onChange={this.changeFilterHandler} placeholder="Filter by name/email" />
                        </div>
                      </div>
                      <div className="col-md-3">
                          <div className="form-group">
                              <Input type="text" name="filterMobile" value={filterItem.filterMobile} onChange={this.changeFilterHandler} placeholder="Filter by mobile no." />
                          </div>
                      </div>
                      <div className="col-md-2">
                          <div className="form-group">
                            <DatePicker className="form-control" selected={ filterItem.filterFrom } placeholderText="From Date" onChange={this.setFilterFromDate} dateFormat="MM/dd/yyyy" />
                          </div>
                      </div>
                      <div className="col-md-2">
                          <div className="form-group">
                            <DatePicker className="form-control" selected={ filterItem.filterTo } onChange={this.setFilterToDate} dateFormat="MM/dd/yyyy" placeholderText="To Date" />
                          </div>
                      </div>
                      <div className="col-md-2">
                          <div className="form-group">
                              <button className="search-btn" onClick={this.filterItemList}>Search</button>
                          </div>
                      </div>
                  </div>
              </div> */}
                <div className="card-table table-responsive">
                  <table className="table table-orders">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Invoice No.</th>
                        <th>Billing Period </th>
                        <th>Billing Hours</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataLists.map((dataInfo, index) => 
                      <tr key={index}>
                        <td>
                          <span className="sno">{index+1}</span>
                        </td>
                        <td>{ dataInfo.invoiceId }</td>
                        <td>{ dataInfo.billingFrom+' - '+dataInfo.billingTo }</td>
                        <td>{ dataInfo.billingHours}</td>
                        <td>${dataInfo.amount}</td>
                        <td>{ (dataInfo.status=== 0 ? 'Unpaid' : 'Paid') }</td>
                        <td>
                        { (dataInfo.invoiceAttachment!=='' ? <a href={dataInfo.invoiceAttachment} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary" title="Download Invoice"><i className="fa fa-file-pdf-o "></i></a>  : '') } &nbsp;
                        { dataInfo.status===0 &&
                        <Button className="btn-edit" color="success" onClick={() => this.payInvoice(dataInfo.invoiceId)}>Pay now</Button>
                        }
                        </td>
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

export default clientBillingList;
