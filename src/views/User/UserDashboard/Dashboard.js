import React, { Component } from 'react';
import {
  Row, Col, Card, CardHeader, CardBody,
  Table
} from 'reactstrap';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';
import './Dashboard.css';
import { Link } from 'react-router-dom';

class Dashboard extends Component {
  constructor(props) {
    super( props );

    this.state = {
      loading: false,
      dashBoardStats: { foodTruckCount: 0, enquiryCount:0, reviewsCount:0 },
      enquiryLists: []
    };
  }

  componentDidMount() {     
    //this.dashboardData({});
    //this.enquiryLists({});   
  }

  /* Get Dashboard data from API */
  dashboardData() {
    commonService.getAPIWithAccessToken('dashboard')
    .then( res => {
      if( undefined === res.data.data || !res.data.status ){
        this.setState( {loading: false });
        return;
      }
      const dashData = res.data.data;
      this.setState({ loading:false, dashBoardStats:dashData  })
    }
    )
  }

  /* Enquiry List API */
  enquiryLists() {
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('food-truck/enquiry?pageSize=10')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            return;
          }   
          this.setState({loading:false, enquiryLists: res.data.data.enquiryList});     
         
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }
          else {
            this.setState( { loading: false } );
          }
        } )
    } )
  }


  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    const { loading }  = this.state;
    let loaderElement = '';
    if(loading)        
      loaderElement = <Loader />

    return (
      <div className="dashboard-section">
        {loaderElement}
        <Row>
          <Col xs="6" sm="3" md="3" lg="3">
            <Card className="vd-card">
              <CardHeader>
                <div className="d-flex align-items-center">
                  <div className="mr-auto">
                      <h4 className="card-title"><img src="/images/user.svg" height="30" alt="" /> Your virtdrop VA</h4>
                  </div>
                  <div className="add-option-info">
                    <a className="btn-add" href="#!">View All</a>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="user-card-list">
                  <div className="user-card">
                    <div className="user-avatar">
                      <span>AB</span>
                    </div>
                    <div className="user-info">
                      <span className="lead-text">Abu Bin Ishtiyak</span>
                      <span className="sub-text">info@softnio.com</span>
                    </div>
                  </div>
                </div>

                <div className="user-card-list">
                  <div className="user-card">
                    <div className="user-avatar">
                      <span>AB</span>
                    </div>
                    <div className="user-info">
                      <span className="lead-text">Abu Bin Ishtiyak</span>
                      <span className="sub-text">Sr. Manager</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col sm="3" md="3" lg="3">
            <div className="dashboard-card">
              <div className="dashboard-card-inner">
                <div className="dashboard-card-icon">
                  <Link to="/user/manage-request"><img src="/images/timezone.svg" height="50" alt="" /></Link>
                </div>
                <div className="dashboard-card-content">
                  <h2><Link to="/user/manage-request">Manage Request</Link></h2>
                </div>
              </div>
            </div>
          </Col>
          <Col sm="3" md="3" lg="3">
            <div className="dashboard-card">
              <div className="dashboard-card-inner">
                <div className="dashboard-card-icon card-bg">
                  <img src="/images/account.svg" height="50" alt="" />
                </div>
                <div className="dashboard-card-content">
                  <h2>Account Settings</h2>
                </div>
              </div>
            </div>	
          </Col>
          <Col sm="3" md="3" lg="3">
            <div className="dashboard-card">
              <div className="dashboard-card-inner">
                <div className="dashboard-card-icon payment-bg">
                  <img src="/images/payment.svg" height="50" alt="" />
                </div>
                <div className="dashboard-card-content">
                  <h2>Manage Payment</h2>
                </div>
              </div>
            </div>	
          </Col>

          <Col md="7" lg="7" sm="7">
            <Card className="vd-card">
              <CardHeader>
                <div className="d-flex align-items-center">
                  <div className="mr-auto">
                    <h4 className="card-title"><img src="/images/task.svg" height="30" alt="Task" /> Task Management</h4>
                  </div>
                  <div className="add-option-info">
                    <a className="btn-add" href="#!">More</a>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="card-table">
                  <Table size="sm" className="listing-table">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Task</th>
                        <th>VA</th>
                        <th>Assigning Date</th>
                        <th>Completion Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>
                        <span className="sno">1</span>
                      </td>
                      <td>Lipsum generator: Lorem Ipsum</td>
                      <td>Abu Bin Ishtiyak</td>
                      <td>02/11/2020</td>
                      <td>02/11/2020</td>
                      <td>
                        <a className="btn btn-trigger" href="#!" data-toggle="dropdown" aria-expanded="false">
                          <img src="/images/more.svg" width="20" alt="" />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="sno">2</span>
                      </td>
                      <td>Lipsum generator: Lorem Ipsum</td>
                      <td>Abu Bin Ishtiyak</td>
                      <td>02/11/2020</td>
                      <td>02/11/2020</td>
                      <td>
                        <a className="btn btn-trigger" href="#!" data-toggle="dropdown" aria-expanded="false">
                          <img src="/images/more.svg" width="20" alt="" />
                        </a>
                      </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="5" lg="5" sm="5">
          <Card className="vd-card">
              <CardHeader>
                <div className="d-flex align-items-center">
                  <div className="mr-auto">
                    <h4 className="card-title"><img src="/images/billing.svg" height="30" alt="Billing" /> Billing</h4>
                  </div>
                  <div className="add-option-info">
                    <a className="btn-add" href="#!">More</a>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="card-table">
                  <Table size="sm" className="listing-table">
                    <thead>
                      <tr>
                        <th>S.no</th>
                        <th>VA </th>
                        <th>Working Hours</th>
                        <th>Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>
                        <span className="sno">1</span>
                      </td>
                      <td>Abu Bin Ishtiyak</td>
                      <td>8 Hours</td>
                      <td>$56.00</td>
                      <td>
                        <a className="btn btn-trigger" href="#!" data-toggle="dropdown" aria-expanded="false">
                          <img src="/images/more.svg" width="20" alt="" />
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="sno">2</span>
                      </td>
                      <td>Abu Bin Ishtiyak</td>
                      <td>8 Hours</td>
                      <td>$56.00</td>
                      <td>
                        <a className="btn btn-trigger" href="#!" data-toggle="dropdown" aria-expanded="false">
                          <img src="/images/more.svg" width="20" alt="" />
                        </a>
                      </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

      </div>
    );
  }
}

export default Dashboard;
