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
      dashBoardStats: { requestCount: 0, enquiryCount:0, taskCount:0 },
      vaList: [],
      taskList: []
    };
  }

  componentDidMount() {     
    //this.dashboardData({});
    this.virtdropVaLists({});
    this.vaTaskLists({}); 
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

  /* Virtdrop VA List API */
  virtdropVaLists() {
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('va-assignment/clients-va/?pageSize=5')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            return;
          }   
          this.setState({loading:false, vaList: res.data.data.requestList});     
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
    const { loading, vaList, taskList }  = this.state;
    let loaderElement = '';
    if(loading)        
      loaderElement = <Loader />

    return (
      <div className="dashboard-section">
        {loaderElement}
        <Row>
          <Col sm="3" md="3" lg="3">
            <Card className="vd-card">
              <CardHeader>
                <div className="d-flex align-items-center">
                  <div className="mr-auto">
                      <h4 className="card-title"><img src="/images/user.svg" height="30" alt="" /> Your virtdrop VA</h4>
                  </div>
                  <div className="add-option-info">
                    <Link className="btn-add" to="/user/virdrop-va">View All</Link>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
              <div className="user-card-body">
                {vaList.map((vaInfo, index) => 
                  <div className="user-card-list" key={index}>
                    <div className="user-card">
                      <div className="user-avatar">
                        <span>{vaInfo.firstName.substring(0, 1)+''+vaInfo.lastName.substring(0, 1)}</span>
                      </div>
                      <div className="user-info">
                        <span className="lead-text">{vaInfo.firstName+' '+vaInfo.lastName}</span>
                        <span className="sub-text">{vaInfo.email}</span>
                      </div>
                    </div>
                  </div>
                  )}
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
                <Link to="/user/my-profile"><img src="/images/account.svg" height="50" alt="" /></Link>
                </div>
                <div className="dashboard-card-content">
                  <h2><Link to="/user/my-profile">Account Settings</Link></h2>
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
                    <Link to="/user/task" className="btn-add">More</Link>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
              <div className="card-table-body">
                <div className="card-table table-responsive">
                  <Table size="sm" className="listing-table">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        <th>Task</th>
                        <th style={{width:'110px'}}>Assigning Date</th>
                        <th style={{width:'80px'}}>Due Date</th>
                        <th>Notes</th>
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
                      <td>{taskInfo.description}</td>
                    </tr>
                    )}
                    </tbody>
                  </Table>
                </div>
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
                <div className="card-table-body">
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
                        <td>
                          <span className="sno">1</span>
                        </td>
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
                      </tbody>
                    </Table>
                  </div>
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
