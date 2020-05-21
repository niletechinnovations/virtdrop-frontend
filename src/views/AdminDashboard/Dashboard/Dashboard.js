import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

import { Card, CardBody, Col, Row } from 'reactstrap';
import { PeopleAlt, LocalShipping, MailOutline, SupervisorAccount } from '@material-ui/icons';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';

import NewUserData from './NewUsersData';
import NewEnquiriesData from './NewEnquiriesData';

const lineChartData = (labels = [], foodTruckData = [], enquiryData = [] ) =>  {
  return {
    labels: labels,
    datasets: [
      {
        label: 'Food Truck Listings',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(213,4,43,0.4)',
        borderColor: 'rgba(213,4,43,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(213,4,43,1)',
        pointBackgroundColor: '#D5042B',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(213,4,43,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: foodTruckData,
      },
      {
        label: 'Food Truck Enquiries',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(0,33,100,0.4)',
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
      foodTruckData: [],
      enquiryData: []
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

      commonService.getAPIWithAccessToken('profile/list?pageNo=1&pageSize=10')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( {  loading: false } );
            toast.error(res.data.message);    
            return;
          }  
          const responseData = res.data.data;
          this.setState({loading:false, userList: responseData.profileList});
        } )
        
      commonService.getAPIWithAccessToken('food-truck/enquiry?pageNo=1&pageSize=10')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( {  loading: false } );
            toast.error(res.data.message);    
            return;
          }
          console.log(res.data.data);
          this.setState({loading:false, enquiryList: res.data.data.enquiryList});
      } )
       

    } )
  }
 

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {

    return (
      <div className="animated fadeIn admin-dashboard">
        <Row>
          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-info">
              <CardBody>
                <div className="float-right">
                  <PeopleAlt />
                </div>
                <div className="text-value">{this.state.dashBoardStats.userCount}</div>
                <div>Total Users</div>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-warning">
              <CardBody>
                <div className="float-right">
                  <SupervisorAccount />
                </div>
                <div className="text-value">{this.state.dashBoardStats.organizationCount}</div>
                <div>Total Food Truck Owners</div>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-success">
              <CardBody>
                <div className="float-right">
                  <LocalShipping />
                </div>
                <div className="text-value">{this.state.dashBoardStats.foodTruckCount}</div>
                <div>Total Food Truck Listings</div>
              </CardBody>              
            </Card>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-danger">
              <CardBody>
                <div className="float-right">
                  <MailOutline />
                </div>
                <div className="text-value">{this.state.dashBoardStats.enquiryCount}</div>
                <div>Total Enquiries</div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardBody>
                <div className="chart-wrapper">
                  {/* <Line data={line} options={options} height={85} /> */}
                  <Line data={ lineChartData( this.state.lineGraphLabels, this.state.foodTruckData, this.state.enquiryData )} options={options} height={70} />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* New Enquiries Data */}
        <Row>
          <Col>
            <Card>
              <CardBody className="dashboard-card-body">
                <NewEnquiriesData data={this.state.enquiryList} />

              </CardBody>              
            </Card>
          </Col>
        </Row>
        
        {/* New Users Data */}
        <Row>
          <Col>
            <Card>
              <CardBody className="dashboard-card-body">
                <NewUserData data={this.state.userList} />

              </CardBody>              
            </Card>
          </Col>
        </Row>

      
      </div>
    );
  }
}

export default Dashboard;
