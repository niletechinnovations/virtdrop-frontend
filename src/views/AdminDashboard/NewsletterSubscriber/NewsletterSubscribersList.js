import React, { Component } from 'react';
import { Card, CardBody, Col, Row, Button, Input, FormGroup, Label } from 'reactstrap';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SubscribersData from './SubscribersData';
import Loader from '../../Loader/Loader';

class NewsletterSubscribersList extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      enquiryLists: [],
      loading: true,
      rowIndex: -1,
      filterItem: { filterContactPerson: '', filterEmail:'', filterFrom:'',  filterTo:'' },    
    } 
    this.handleDeleteEnquiry = this.handleDeleteEnquiry.bind(this);
    this.filterEnquiryList = this.filterEnquiryList.bind(this);
  }

  // Fetch the Enquiry List
  componentDidMount() {     
    this.enquiryLists({});   
  }

  /* Enquiry List API */
  enquiryLists(filterItem = {}) {
    let filterQuery = "?pageSize=10000";
    if(filterItem.filterContactPerson !== undefined && filterItem.filterContactPerson !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&contactPerson="+filterItem.filterContactPerson: "&contactPerson="+filterItem.filterContactPerson;
    
      if(filterItem.filterEmail !== undefined && filterItem.filterEmail !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&email="+filterItem.filterEmail: "&email="+filterItem.filterEmail;
    
      if(filterItem.filterFrom !== undefined && filterItem.filterFrom !== "" ){
      let newFromDate = this.getFormatDate( filterItem.filterFrom );
      filterQuery += (filterQuery !=="" ) ? "&start_date="+newFromDate : "?start_date="+newFromDate;
    }
    if(filterItem.filterTo !== undefined && filterItem.filterTo !== "" ){
      let newToDate = this.getFormatDate( filterItem.filterTo );
      filterQuery += (filterQuery !=="" ) ? "&end_date="+newToDate: "?end_date="+newToDate;
    }
    
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('common/newsletter'+filterQuery)
        .then( res => {       
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }   
          this.setState({loading:false, enquiryLists: res.data.data});              
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            //this.props.history.push('/login');
          }
          else {
            this.setState( { loading: false } );
            toast.error(err.message);
          }
        } )
    } )
  } 
  
  handleDeleteEnquiry(rowIndex){
    const rowInfo = this.state.enquiryLists[rowIndex];
    const delFormData = {
      "id": rowInfo.id,
    };
    this.setState( { loading: true}, () => {
      commonService.deleteAPIWithAccessToken( `common/newsletter/`, delFormData)
        .then( res => {
          this.setState({loading: false});
          if ( undefined === res.data || !res.data.status ) {            
             toast.error(res.data.message);      
            return;
          }         
          toast.success(res.data.message);
          this.enquiryLists();
        } )
        .catch( err => {                   
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }else{
            this.setState( { loading: false } );
            toast.error(err.message);
          }
      } )
    })
  }  

  filterEnquiryList(){
    const filterItem = this.state.filterItem;
    this.enquiryLists(filterItem);
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
      filterItem: { filterEmail: '', filterFrom:'',  filterTo:'', filterContactPerson:'' }
    });
    this.enquiryLists();
  }
  
  getFormatDate(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 101).toString().substring(1);
    var day = (date.getDate() + 100).toString().substring(1);
    return year + "-" + month + "-" + day;
  }

  render() {
    const { enquiryLists, loading, filterItem } = this.state;
       
    let loaderElement = '';
    if(loading)        
      loaderElement = <Loader />

    return (
      <div className="user-dashboard">
        {loaderElement}
        <Card className="vd-card ">
          <CardBody>
            <Row>
              <Col md={12}>
                <Row className="filterRow">                      
                  <Col md={"3"}>
                    <FormGroup> 
                      <Label htmlFor="filterEmail">Email ID</Label>            
                      <Input type="email" placeholder="Email Address" id="filterEmail" name="filterEmail" value={filterItem.filterEmail} onChange={this.changeFilterHandler} />
                    </FormGroup>
                  </Col>
                  <Col md={"3"} className="pl-3">
                    <FormGroup> 
                      <Label htmlFor="filterContactPerson">Contact Person</Label>            
                      <Input type="text" placeholder="Contact person" id="filterContactPerson" name="filterContactPerson" value={filterItem.filterContactPerson} onChange={this.changeFilterHandler} />
                    </FormGroup> 
                  </Col>
                  <Col md={"2"}>
                    <FormGroup> 
                      <Label>Date From</Label>
                      <DatePicker className="form-control" selected={ filterItem.filterFrom } onChange={this.setFilterFromDate} dateFormat="MM/dd/yyyy" />
                    </FormGroup>  
                  </Col>
                  <Col md={"2"}>
                    <FormGroup> 
                      <Label>Date To</Label>
                      <DatePicker className="form-control" selected={ filterItem.filterTo } onChange={this.setFilterToDate} dateFormat="MM/dd/yyyy" />
                    </FormGroup>  
                  </Col>
                  <Col md={"1"} className="p-0">
                    <FormGroup> 
                      <Label>&nbsp;</Label><br />
                      <Button color="success" type="button" size="sm" onClick={this.filterEnquiryList} title="Filter Inquiries"><i className="fa fa-search"></i></Button>&nbsp;
                      <Button color="danger" type="reset" size="sm" onClick={this.resetfilterForm} title="Clear Fields"><i className="fa fa-refresh"></i></Button>
                    </FormGroup>             
                  </Col>
                </Row>
              </Col>
              
              <Col md={12}>
                <SubscribersData data={enquiryLists} deleteEnquiryAction={this.handleDeleteEnquiry} dataTableLoadingStatus = {this.state.loading} />
              </Col>
            </Row> 
          </CardBody>
        </Card>
      </div>

    );
  }
}

export default NewsletterSubscribersList;