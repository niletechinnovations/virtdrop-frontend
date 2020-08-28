import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, CardHeader, CardBody, 
} from 'reactstrap';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';

//import DatePicker from "react-datepicker";
//import "react-datepicker/dist/react-datepicker.css";


class VaLists extends Component {
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
      commonService.getAPIWithAccessToken('va-assignment/clients-va'+filterQuery)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }
          this.setState({loading:false, dataLists: res.data.data.requestList});         
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
                    <h4 className="card-title"><img src="/images/user.svg" height="30" alt="" /> Your Virdrop VA</h4>
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
                        <th>Name</th>
                        <th>Email </th>
                        <th>Mobile no.</th>
                        <th>Skype ID</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataLists.map((dataInfo, index) => 
                      <tr key={index}>
                        <td>
                          <span className="sno">{index+1}</span>
                        </td>
                        <td>{ dataInfo.firstName+' '+dataInfo.lastName }</td>
                        <td>{dataInfo.email}</td>
                        <td>{ dataInfo.mobileNumber }</td>
                        <td>{dataInfo.skypeID}</td>
                        <td>
                          <Link to={"/user/task/"+dataInfo.authId} title="Manage Task" className="btn btn-sm btn-success"><i className="fa fa-tasks"></i></Link>
                        {/* <UncontrolledDropdown>
                          <DropdownToggle color="default" className="btn-trigger">
                            <img src="/images/more.svg" width="20" alt="more" />
                          </DropdownToggle>
                          <DropdownMenu className="action-dropdown">
                            <DropdownItem onClick={() => { this.handleEditData(index) }} className="edit-btn"><i className="fa fa-pencil"></i> Edit</DropdownItem>
                            <DropdownItem onClick={() => {
                            if (window.confirm('Are you sure you want to delete this record?')) this.handleDeleteData(index) }} className="delete-btn"><i className="fa fa-trash-o"></i> Delete</DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>   */}
                          
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

export default VaLists;
