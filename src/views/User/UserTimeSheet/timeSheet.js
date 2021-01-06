import React, { Component } from 'react';
import {
  Card, CardHeader, CardBody, Button,
} from 'reactstrap';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


class timeSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      itemList: [],
      dataLists: [],
      formProccessing: false,
      loading: false,
      rowIndex: -1,
      filterItem: { filter: '', filterVaType: '', filterNOB: '', filterFrom: '', filterTo: '' }
    }
    // this.setState({
    //     filterItem: { filterFirstName: '', filterEmail: '', filterSkill: '', filterSkill1: '', filterRating: '', filterFrom: '', filterTo: '', filterStatus: '' }
    //   });
    this.filterItemList = this.filterItemList.bind(this);

  }

  componentDidMount() {
    this.itemLists({});
  }

  /* Request List API */
  itemLists(filterItem = {}) {
    let filterQuery = "?pageSize=10000";
    if (filterItem.filterFrom !== undefined && filterItem.filterFrom !== "") {
      let newFromDate = this.getFormatDate(filterItem.filterFrom);
      filterQuery += (filterQuery !== "") ? "&start_date=" + newFromDate : "?start_date=" + newFromDate;
    }
    if (filterItem.filterTo !== undefined && filterItem.filterTo !== "") {
      let newToDate = this.getFormatDate(filterItem.filterTo);
      filterQuery += (filterQuery !== "") ? "&end_date=" + newToDate : "?end_date=" + newToDate;
    }
    if (filterItem.filterVaType !== undefined && filterItem.filterVaType !== "")
      filterQuery += (filterQuery !== "") ? "&vaType=" + filterItem.filterVaType : "?vaType=" + filterItem.filterVaType;

    if (filterItem.filterNOB !== undefined && filterItem.filterNOB !== "")
      filterQuery += (filterQuery !== "") ? "&natureOfBusiness=" + filterItem.filterNOB : "?natureOfBusiness=" + filterItem.filterNOB;

    this.setState({ loading: true }, () => {
      commonService.getAPIWithAccessToken('timesheet' + filterQuery)
        .then(res => {
          if (undefined === res.data.data || !res.data.status) {
            this.setState({ loading: false });
            toast.error(res.data.message);
            return;
          }
          // this.setState({ loading: false, dataLists: res.data.data.requestList });

          const result = res.data.data.requestList.filter(status => (status.status === 1))
          this.setState({ loading: false, dataLists: result });
        })
        .catch(err => {
          if (err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          } else {
            this.setState({ loading: false });
            toast.error(err.message);
          }
        })
    })
  }


  filterItemList() {
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
      filterItem: { filterFrom: '', filterTo: '', filterStatus: '' }
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
    const {dataLists, loading, filterItem } = this.state;
    let loaderElement = '';
    if (loading)
      loaderElement = <Loader />

    return (
      <div className="dashboard-section">
        {loaderElement}

        <Card className="vd-card">
          <CardHeader>
            <div className="d-flex align-items-center">
              <div className="mr-auto">
                <h4 className="card-title"><img src="/images/timesheet1.png" height="30" alt="" />TimeSheet</h4>
              </div>
            </div>
          </CardHeader>
          <CardBody className="item-list-section">
            <div className="Search-filter">
              <div className="row">
                {/* <div className="col-md-3">
                        <div className="form-group">
                          <Input type="text" name="filterName" value={filterItem.filterName} onChange={this.changeFilterHandler} placeholder="Filter by name/email" />
                        </div>
                      </div>
                      <div className="col-md-3">
                          <div className="form-group">
                              <Input type="text" name="filterMobile" value={filterItem.filterMobile} onChange={this.changeFilterHandler} placeholder="Filter by mobile no." />
                          </div>
                      </div> */}
                <div className="col-md-2">
                  <div className="form-group">
                    <DatePicker className="form-control" selected={filterItem.filterFrom} placeholderText="From Date" onChange={this.setFilterFromDate} dateFormat="MM/dd/yyyy" />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <DatePicker className="form-control" selected={filterItem.filterTo} onChange={this.setFilterToDate} dateFormat="MM/dd/yyyy" placeholderText="To Date" />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <button className="search-btn" onClick={this.filterItemList}>Search</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-table table-responsive">
              <table className="table table-orders">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Task name</th>
                    <th>VA name</th>
                    <th>Total working hours</th>
                    <th>Billing hours</th>
                    {/* <th>Status</th> */}
                    <th>Created on</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {

                    dataLists.map((dataInfo, index) =>
                      // let ts =new Date(dataInfo.createdAt),
                      // console.log("Date:",ts.toDateString()),
                      
                      // dataInfo.status === 1 ? (
                        <tr key={index}>
                          <td><span className="sno">{index+1}</span></td>
                          <td>#{dataInfo.taskName}</td>
                          <td>{dataInfo.vaName}</td>
                          {dataInfo.TotalWorkingTime === "00:00:00" ? <td>{dataInfo.duration}</td> : <td>{dataInfo.TotalWorkingTime}</td>}
                          {/* <td>{ dataInfo.duration}</td> */}
                          <td>${dataInfo.billingHours}</td>
                          {/* <td>{dataInfo.status}</td> */}
                          {/* {dataInfo.status===1 ? <td>Approved</td> : '' } */}
                          <td>{new Date(dataInfo.createdAt).toDateString()}</td>
                          {/* <td>{ (dataInfo.status=== 0 ? 'Unpaid' : 'Paid') }</td> */}
                          <td>
                            {/* { (dataInfo.invoiceAttachment!=='' ? <a href={dataInfo.invoiceAttachment} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary" title="Download Invoice"><i className="fa fa-file-pdf-o "></i></a>  : '') } &nbsp;
                        { dataInfo.status===0 &&
                        <Button className="btn-edit" color="success" onClick={() => this.payInvoice(dataInfo.invoiceId, dataInfo.creditCard)}>Pay now</Button>
                        } */}
                          </td>
                        </tr>
                      // ) : ""
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

export default timeSheet;
