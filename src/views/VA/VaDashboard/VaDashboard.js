import React, { Component } from 'react';
import {
  Row, Col, Card, CardHeader, CardBody, Table
} from 'reactstrap';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';
import './Dashboard.css';
import { Link } from 'react-router-dom';

class VaDashboard extends Component {
  constructor(props) {
    super( props );

    this.state = {
      loading: false,
      dashBoardStats: { requestCount: 0, enquiryCount:0, taskCount:0 },
      vaList: [],
      taskList: []
    };
  }

  componentDidMount() {     
    //this.dashboardData({});
    this.vaTaskLists({}); 
  }


  /* VA Task List API */
  vaTaskLists() {
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('va-task/?pageSize=5')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            return;
          }   
          this.setState({loading:false, taskList: res.data.data.requestList});     
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }else {
            this.setState( { loading: false } );
          }
        } )
    } )
  }

  
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    const { loading, taskList }  = this.state;
    let loaderElement = '';
    if(loading)        
      loaderElement = <Loader />

    return (
      <div className="dashboard-section">
        {loaderElement}
        <Row>
          <Col sm="3" md="3" lg="3">
            <div className="dashboard-card">
              <div className="dashboard-card-inner">
                <div className="dashboard-card-icon card-bg">
                <Link to="/user/va-task"><img src="/images/task.svg" height="50" alt="" /></Link>
                </div>
                <div className="dashboard-card-content">
                  <h2><Link to="/user/va-task">Manage Task</Link></h2>
                </div>
              </div>
            </div>	
          </Col>
          <Col sm="3" md="3" lg="3">
            <div className="dashboard-card">
              <div className="dashboard-card-inner">
                <div className="dashboard-card-icon">
                  <Link to="/user/va-timesheet"><img src="/images/timezone.svg" height="50" alt="" /></Link>
                </div>
                <div className="dashboard-card-content">
                  <h2><Link to="/user/va-timesheet">Manage Timesheet</Link></h2>
                </div>
              </div>
            </div>
          </Col>
          <Col sm="3" md="3" lg="3">
            <div className="dashboard-card">
              <div className="dashboard-card-inner">
                <div className="dashboard-card-icon card-bg">
                <Link to="/user/va-profile"><img src="/images/account.svg" height="50" alt="" /></Link>
                </div>
                <div className="dashboard-card-content">
                  <h2><Link to="/user/va-profile">Account Settings</Link></h2>
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

          <Col md="6" lg="6" sm="6">
            <Card className="vd-card">
              <CardHeader>
                <div className="d-flex align-items-center">
                  <div className="mr-auto">
                    <h4 className="card-title"><img src="/images/task.svg" height="30" alt="Task" /> Task Management</h4>
                  </div>
                  <div className="add-option-info">
                    <Link to="/user/va-task" className="btn-add">More</Link>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="card-table table-responsive">
                  <Table size="sm" className="listing-table">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Task</th>
                        <th style={{width:'110px'}}>Assigning Date</th>
                        <th style={{width:'80px'}}>Due Date</th>
                        <th>Assigned By</th>
                      </tr>
                    </thead>
                    <tbody>
                    {taskList.map((taskInfo, index) => 
                    <tr key={index}>
                      <td>
                        <span className="sno">{index+1}</span>
                      </td>
                      <td>{taskInfo.title}</td>
                      <td>{(new Date(taskInfo.createdAt)).toLocaleDateString("en-US")}</td>
                      <td>{ (taskInfo.dueDate!=='' ? (new Date(taskInfo.dueDate)).toLocaleDateString("en-US") : '') }</td>
                      <td>{taskInfo.clientName}</td>
                    </tr>
                    )}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col md="6" lg="6" sm="6">
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
                <div className="card-table table-responsive">
                  <Table size="sm" className="listing-table">
                    <thead>
                      <tr>
                        <th>S.no</th>
                        <th>VA </th>
                        <th>Working Hours</th>
                        <th>Amount</th>
                        <th>Created Date</th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td><span className="sno">1</span></td>
                      <td>Abu Bin Ishtiyak</td>
                      <td>8 Hours</td>
                      <td>$56.00</td>
                      <td>02/11/2020</td>
                    </tr>
                    <tr>
                      <td>
                        <span className="sno">2</span>
                      </td>
                      <td>Abu Bin Ishtiyak</td>
                      <td>8 Hours</td>
                      <td>$56.00</td>
                      <td>02/11/2020</td>
                    </tr>
                    <tr>
                      <td><span className="sno">3</span></td>
                      <td>Abu Bin Ishtiyak</td>
                      <td>8 Hours</td>
                      <td>$56.00</td>
                      <td>02/11/2020</td>
                    </tr>
                    <tr>
                      <td><span className="sno">4</span></td>
                      <td>Abu Bin Ishtiyak</td>
                      <td>8 Hours</td>
                      <td>$56.00</td>
                      <td>02/11/2020</td>
                    </tr>
                    <tr>
                      <td><span className="sno">5</span></td>
                      <td>Abu Bin Ishtiyak</td>
                      <td>8 Hours</td>
                      <td>$56.00</td>
                      <td>02/11/2020</td>
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

export default VaDashboard;
