import React, { Component } from 'react';
import  { Redirect, Link } from 'react-router-dom';
import { Card, CardBody, Col, Row } from 'reactstrap';
//import { PeopleAlt, LocalShipping, MailOutline, SupervisorAccount, Link } from '@material-ui/icons';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import './dashboard.css'

import NewUserData from './NewUsersData';
import NewApplicationData from './NewApplicationData';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
     loading: false,
      dashBoardStats: {organizationCount: 0, vaCount: 0, bookingCount: 0, newsletterCount:0 },
      userList: [],
      enquiryList:[],
      vaApplicationList: []
    };
  }

  componentDidMount() { 
    this.setState( { loading: true}, () => {

      commonService.getAPIWithAccessToken('dashboard')
        .then( res => {
          if( undefined === res.data.data || !res.data.status ){
            this.setState( {loading: false });
            toast.error(res.data.message);
            return;
          }
          const dashData = res.data.data;
          this.setState({ loading:false, dashBoardStats:dashData  })
        }
        )

      commonService.getAPIWithAccessToken('organization?pageNo=1&pageSize=10')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( {  loading: false } );
            toast.error(res.data.message);    
            return;
          }  
          const responseData = res.data.data;
          this.setState({loading:false, userList: responseData.profileList});
        } )
        
      commonService.getAPIWithAccessToken('va-application/?pageNo=1&pageSize=10')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( {  loading: false } );
            toast.error(res.data.message);    
            return;
          }
          //console.log(res.data.data);
          this.setState({loading:false, vaApplicationList: res.data.data.requestList});
      } )
      
    } )
  }
 

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    const { dashBoardStats } = this.state;
    const role = localStorage.getItem( 'role' );
    if ( role!=='admin' ) {
      if(role === "recruitmentAdmin")
        return ( <Redirect to={`/admin/va-request`} noThrow /> )
      else if(role === "recruitmentTeam")
        return ( <Redirect to={`/admin/va-application`} noThrow /> )
      else if(role === "marketingTeam")
        return ( <Redirect to={`/admin/scheduled-booking`} noThrow /> )
      else if(role === "accountingAdmin")
        return ( <Redirect to={`/admin/organization`} noThrow /> )
      else if(role === "teamLead")
        return ( <Redirect to={`/admin/va-task`} noThrow /> )
		} else {
      return (
        <div className="animated fadeIn admin-dashboard">
          <div className="overview-info">
            <Row>
            <Col xs="12" sm="6" lg="3">
              <div className="card-bg-info card-bg-1">
                <div className="card-bg-icon">
                  <img src="/images/user.svg" height="35" alt="" />
                </div>
                <div className="card-bg-content">
                  <h2 className="text-value">{ dashBoardStats.organizationCount}</h2>
                  <p>Total Clients</p>
                </div>
              </div>
            </Col>
            <Col xs="12" sm="6" lg="3">
              <div className="card-bg-info card-bg-3">
                <div className="card-bg-icon">
                  <img src="/images/task.svg" height="35" alt="" />
                </div>
                <div className="card-bg-content">
                  <h2 className="text-value">{ dashBoardStats.vaCount}</h2>
                  <p>VA Applications</p>
                </div>
              </div>
            </Col>
            <Col xs="12" sm="6" lg="3">
              <div className="card-bg-info card-bg-2">
                <div className="card-bg-icon">
                  <img src="/images/payment.svg" height="35" alt="" />
                </div>
                <div className="card-bg-content">
                  <h2 className="text-value">{ dashBoardStats.bookingCount }</h2>
                  <p>Discovery calls</p>
                </div>
              </div>
            </Col>
            <Col xs="12" sm="6" lg="3">
              <div className="card-bg-info card-bg-4">
                  <div className="card-bg-icon">
                  <img src="/images/task.svg" height="35" alt="" />
                  </div>
                  <div className="card-bg-content">
                    <h2 className="text-value">{ dashBoardStats.newsletterCount }</h2>
                    <p>eBook Downloads</p>
                  </div>
              </div>
            </Col>
            </Row>
          </div>

          <div className="Enquiries-info">
            {/* New Enquiries Data */}
            <Row>
              <Col>
                <Card className="vd-card">
                  <div className="card-header">
                    <div className="d-flex align-items-center">
                      <div className="mr-auto">
                          <h4 className="card-title"> New VA Applications</h4>
                      </div>
                      <div className="add-option-info">
                        <Link to="/admin/va-application" className="btn-add" title="View All Applications">View All</Link>
                      </div>
                    </div>
                  </div>
                  <CardBody>
                    <NewApplicationData data={this.state.vaApplicationList} />
                  </CardBody>              
                </Card>
              </Col>
            </Row>
          </div>

          <div className="Users-info">
            {/* New Users Data */}
            <Row>
              <Col>
                <Card className="vd-card">
                  <div className="card-header">
                    <div className="d-flex align-items-center">
                      <div className="mr-auto">
                          <h4 className="card-title"> Recent Joined Members</h4>
                      </div>
                      <div className="add-option-info">
                        <Link to="/admin/organization" className="btn-add view-all-btn" title="View All Members">View All</Link>
                      </div>
                    </div>
                  </div>
                  <CardBody>
                    <NewUserData data={this.state.userList} />
                  </CardBody>              
                </Card>
              </Col>
            </Row>
          </div>      
        </div>
      );
    }
  }
}

export default Dashboard;
