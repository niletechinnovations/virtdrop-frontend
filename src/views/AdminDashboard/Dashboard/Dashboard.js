import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

import { Card, CardBody, Col, Row } from 'reactstrap';
//import { PeopleAlt, LocalShipping, MailOutline, SupervisorAccount, Link } from '@material-ui/icons';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import './dashboard.css'

import NewUserData from './NewUsersData';
import NewApplicationData from './NewApplicationData';

const lineChartData = (labels = [], foodTruckData = [], enquiryData = [] ) =>  {
  return {
    labels: labels,
    datasets: [
      {
        label: 'VA Request',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(57,103,212,0.4)',
        borderColor: 'rgba(57,103,212,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(26, 99, 250,1)',
        pointBackgroundColor: '#1a63fa',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(26, 99, 250,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: foodTruckData,
      },
      {
        label: 'VA Applications',
        fill: false,
        lineTension: 0.1,
        backgroundColor: '#2196f3',
        borderColor: 'rgba(0,33,100,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(0,33,100,1)',
        pointBackgroundColor: '#002164',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(0,33,100,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: enquiryData,
      }
    ],
  }
};

const options = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: true
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
     loading: false,
      dashBoardStats: {organizationCount: 0, usersCount: 0, foodTruckCount: 0, enquiryCount:0 },
      userList: [],
      enquiryList:[],
      lineGraphLabels: [],
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
          this.setState({ loading:false, dashBoardStats:dashData, lineGraphLabels:dashData.foodTruckGraph.labels, foodTruckData:dashData.foodTruckGraph.data, enquiryData:dashData.enquiryGraph.data  })
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
        
      commonService.getAPIWithAccessToken('va-application?pageNo=1&pageSize=10')
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
                <h2 className="text-value">100</h2>
                <p>Total Users</p>
              </div>
            </div>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <div className="card-bg-info card-bg-2">
              <div className="card-bg-icon">
                <img src="/images/timezone.svg" height="35" alt="" />
              </div>
              <div className="card-bg-content">
                <h2 className="text-value">20</h2>
                <p>Total Request</p>
              </div>
            </div>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <div className="card-bg-info card-bg-3">
              <div className="card-bg-icon">
                <img src="/images/task.svg" height="35" alt="" />
              </div>
              <div className="card-bg-content">
                <h2 className="text-value">200</h2>
                <p>Total VA Applications</p>
              </div>
            </div>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <div className="card-bg-info card-bg-4">
                <div className="card-bg-icon">
                <img src="/images/payment.svg" height="35" alt="" />
                </div>
                <div className="card-bg-content">
                  <h2 className="text-value">$300</h2>
                  <p>Total Payment</p>
                </div>
            </div>
          </Col>
          </Row>
        </div>
        <div className="chart-info">
          <Row>
            <Col>
              <Card className="vd-card">
                <CardBody>
                  <div className="chart-wrapper">
                    {/* <Line data={line} options={options} height={85} /> */}
                    <Line data={ lineChartData( this.state.lineGraphLabels, this.state.foodTruckData, this.state.enquiryData )} options={options} height={70} />
                  </div>
                </CardBody>
              </Card>
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
                      <a href="/admin/va-application" className="btn-add" title="View All Applications">View All</a>
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
                      <a href="/admin/organization" className="btn-add view-all-btn" title="View All Members">View All</a>
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

export default Dashboard;
