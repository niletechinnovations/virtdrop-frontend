import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Row, Button, Input, FormGroup, Label } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VaApplicationData from './VaApplicationData';

class ApplicationList extends Component {
  constructor(props) {

    super(props);

    this.state = {
      itemList: [],
      itemList1: [],
      itemList2: [],
      itemList3: [],
      loading: true,
      rowIndex: -1,
      filterItem: { filterApplicationId: '', filterFirstName: '', filterEmail: '', filterSkill: '', filterSkill1: '', filterSkill2: '', filterSkill3: '', filterRating: '', filterFrom: '', filterTo: '', filterStatus: '', skillsetId_1: '' },
    }
    this.handleDeleteRecord = this.handleDeleteRecord.bind(this);
    this.filterItemList = this.filterItemList.bind(this);
  }

  componentDidMount() {
    this.itemList({});

  }


  /*VA Application List API*/
  itemList(filterItem = {}) {
    let filterQuery = "?pageSize=10000";
    // console.log("filterItem", filterItem)
    if (filterItem.filterFirstName !== undefined && filterItem.filterFirstName !== "")
      filterQuery += (filterQuery !== "") ? "&firstName=" + filterItem.filterFirstName : "&firstName=" + filterItem.filterFirstName;

    if (filterItem.filterEmail !== undefined && filterItem.filterEmail !== "")
      filterQuery += (filterQuery !== "") ? "&email=" + filterItem.filterEmail : "&email=" + filterItem.filterEmail;

    if (filterItem.filterSkill1 !== undefined && filterItem.filterSkill1 !== "")
      filterQuery += (filterQuery !== "") ? "&filterSkill1=" + filterItem.filterSkill1 : "&filterSkill1=" + filterItem.filterSkill1;

    if (filterItem.filterSkill !== undefined && filterItem.filterSkill !== "") {
      filterQuery += (filterQuery !== "") ? "&filterSkill=" + filterItem.filterSkill : "&filterSkill=" + filterItem.filterSkill;

    }
    if (filterItem.filterRating !== undefined && filterItem.filterRating !== "")
      filterQuery += (filterQuery !== "") ? "&filterRating=" + filterItem.filterRating : "&filterRating=" + filterItem.filterRating;
    if (filterItem.filterFrom !== undefined && filterItem.filterFrom !== "") {
      let newFromDate = this.getFormatDate(filterItem.filterFrom);
      filterQuery += (filterQuery !== "") ? "&start_date=" + newFromDate : "?start_date=" + newFromDate;
    }
    if (filterItem.filterTo !== undefined && filterItem.filterTo !== "") {
      let newToDate = this.getFormatDate(filterItem.filterTo);
      filterQuery += (filterQuery !== "") ? "&end_date=" + newToDate : "?end_date=" + newToDate;
    }
    if (filterItem.filterStatus !== undefined && filterItem.filterStatus !== "")
      filterQuery += (filterQuery !== "") ? "&status=" + filterItem.filterStatus : "?status=" + filterItem.filterStatus;

    this.setState({ loading: true }, () => {
      commonService.getAPIWithAccessToken('va-application/' + filterQuery)
        .then(res => {

          if (undefined === res.data.data || !res.data.status) {
            this.setState({ loading: false });
            toast.error(res.data.message);
            return;
          }
          this.setState({ loading: false, itemList: res.data.data.requestList });
          if (this.state.itemList3.length === 0) {
            this.setState({ loading: false, itemList3: res.data.data.requestList });
            const getSkills = res.data.data.requestList.map(skill => skill.totalSkills)
            const removeEmptyElement = (skillSet) => {
              let index = -1
              const arrayLength = skillSet ? skillSet.length : 0
              let resIndex = -1
              const result = []

              while (++index < arrayLength) {
                let value = skillSet[index];
                if (value) {
                  result[++resIndex] = value;
                }
              }
              return result;
            }
            const withoutEmpty = removeEmptyElement(getSkills)
            this.setState({ itemList3: withoutEmpty })
          }
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
    this.itemList(filterItem);
  }

  changeFilterHandler = event => {
    // event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    const filterItem = this.state.filterItem
    filterItem[name] = value;
    this.setState({ filterItem: filterItem });

  };

  /* Delete Food Truck*/
  handleDeleteRecord(rowIndex) {
    const itemInfo = this.state.itemList[rowIndex];
    let formdata = { "vaApplicationId": itemInfo.vaApplicationId }

    this.setState({ loading: true }, () => {
      commonService.deleteAPIWithAccessToken('va-application', formdata)
        .then(res => {
          this.setState({ loading: false });
          if (undefined === res.data || !res.data.status) {
            toast.error(res.data.message);
            return;
          }
          toast.success(res.data.message);
          this.itemList();
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

  resetfilterForm = (event) => {
    event.preventDefault()
    event.stopPropagation()
    this.setState({
      filterItem: { filterFirstName: '', filterEmail: '', filterSkill: '', filterSkill1: '', filterRating: '', filterFrom: '', filterTo: '', filterStatus: '' }
    });
    this.itemList();
  }

  getFormatDate(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 101).toString().substring(1);
    var day = (date.getDate() + 100).toString().substring(1);
    return year + "-" + month + "-" + day;
  }

  render() {

    const { loading, itemList, itemList3, filterItem } = this.state;
    let loaderElement = '';
    if (loading)
      loaderElement = <Loader />

    return (
      <div className="animated fadeIn">
        <Row>
          {loaderElement}
          <Col lg={12}>
            <Card>
              <CardHeader className="mainHeading">
                <strong>VA Application List</strong>
                <Link className="categoryAdd btn btn-sm btn-primary" to="/admin/va-application/add-new-va"><i className="fa fa-plus"></i> Add New VA</Link>
              </CardHeader>
              <CardBody>

                <Row>
                  <Col md={12}>
                    <Row className="filterRow">
                      <Col md={"2"}>
                        <FormGroup>
                          <Label htmlFor="filterFirstName">Name</Label>
                          <Input type="text" placeholder="Search by Name" id="filterFirstName" name="filterFirstName" value={filterItem.filterFirstName} onChange={this.changeFilterHandler} />
                        </FormGroup>
                      </Col>
                      <Col md={"2"}>
                        <FormGroup>
                          <Label htmlFor="filterEmail">Search by Email</Label>
                          <Input type="text" placeholder="Search by Email Address" id="filterEmail" name="filterEmail" value={filterItem.filterEmail} onChange={this.changeFilterHandler} />
                        </FormGroup>
                      </Col>
                      {/* Add Drop-down on skills */}
                      <div>
                        <Label htmlFor="filterSkill">Skill</Label>
                        <Input type="select" placeholder="Filter by VA" id="filterSkill" name="filterSkill" value={filterItem.filterSkill} onChange={this.changeFilterHandler} >
                          <option value="">All</option>
                          {
                            itemList3.map((skill, index) => (
                              <option id={index} value={skill._id} >{skill.name}</option>
                            ))
                          }

                        </Input>
                      </div>
                      {/* <Col md={"1"}>
                        <FormGroup> 
                          <Label htmlFor="filterSkill">Skill</Label>            
                          <Input type="text" id="filterSkill" name="filterSkill" value={filterItem.filterSkill} onChange={this.changeFilterHandler} />
                        </FormGroup>  
                      </Col> */}
                      {/* <Col md={"1"}>
                        <FormGroup>
                          <Label htmlFor="filterRating">Rating</Label>
                          <Input type="number" min="1" max="5" placeholder="" id="filterRating" name="filterRating" value={filterItem.filterRating} onChange={this.changeFilterHandler} />
                        </FormGroup>
                      </Col> */}
                      <Col md={"1"}>
                        <FormGroup>
                          <Label>Status</Label>
                          <Input type="select" name="filterStatus" value={filterItem.filterStatus} onChange={this.changeFilterHandler}>
                            <option value="">All</option>
                            <option value="2">Approved</option>
                            <option value="1">Pending</option>
                            <option value="4">Passed Initial</option>
                            <option value="5">Passed Second Assessment</option>
                            <option value="6">Passed Final Assessment</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md={"1"}>
                        <FormGroup>
                          <Label>Date From</Label>
                          <DatePicker className="form-control" selected={filterItem.filterFrom} onChange={this.setFilterFromDate} dateFormat="MM/dd/yyyy" />
                        </FormGroup>
                      </Col>
                      <Col md={"1"}>
                        <FormGroup>
                          <Label>Date To</Label>
                          <DatePicker className="form-control" selected={filterItem.filterTo} onChange={this.setFilterToDate} dateFormat="MM/dd/yyyy" />
                        </FormGroup>
                      </Col>
                      <Col md={"1"} className="p-0">
                        <FormGroup>
                          <Label>&nbsp;</Label><br />
                          <Button color="success" type="button" size="sm" onClick={this.filterItemList} title="Filter VA Application"><i className="fa fa-search"></i></Button>&nbsp;
                          <Button color="danger" type="reset" size="sm" onClick={event => this.resetfilterForm(event)} title="Reset Fields"><i className="fa fa-refresh"></i></Button>
                        </FormGroup>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={12}>
                    <VaApplicationData data={itemList} deleteItemAction={this.handleDeleteRecord} dataTableLoadingStatus={this.state.loading} />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

    )
  }
}


export default ApplicationList;
