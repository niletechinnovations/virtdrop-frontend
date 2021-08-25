import React, { Component } from 'react';
import {
  Row, Col, Card, CardHeader, CardBody,
  Table, Button
} from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      taskList: [],
      invoiceList: []
    };
  }

  componentDidMount() {   
    const { match: { params } } = this.props;
    //this.dashboardData({});
    this.virtdropVaLists({});
    this.vaTaskLists({}); 
    this.billingLists({}); 
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

  /* Billing List API */
  billingLists() {
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('billing/?pageSize=5')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            return;
          }   
          this.setState({loading:false, invoiceList: res.data.data.rowList});     
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

  //pay with PayPal
  payInvoice(invoiceId, creditCard){
    if(invoiceId){
      const formData = {
        "invoiceId": invoiceId,
      }

      //redirecto to credit card page if no card exist
      if(creditCard==='no'){
        this.props.history.push( '/user/my-card/' );       
        toast.error('Please Add Your Credit Card Details');
        return;
      }else{
        this.setState( { loading:true }, () =>{
          commonService.postAPIWithAccessToken('payment/pay', formData)
          .then( res => {
            if ( undefined === res.data.data || !res.data.status ) {           
              this.setState( { loading: false} );
              toast.error(res.data.message);
              return;
            }
            let paymentData = res.data.data;
            if( paymentData.id !=='' )
              this.props.history.push( '/user/transaction/'+paymentData.id );
          })
          .catch( err => {
            if(err.response !== undefined && err.response.status === 401) {
              localStorage.clear();
              this.props.history.push('/login');
            }else{
              this.setState( { loading: false } );
              toast.error(err.message);
            }
          })
        } );
      }
    }
  }
  
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    const { loading, vaList, taskList, invoiceList }  = this.state;
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
                      <h4 className="card-title"><img src="/images/user.svg" height="30" alt="" />Your virtdrop VA</h4>
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
                  <Link to="/user/my-card"><img src="/images/payment.svg" height="50" alt="" /></Link>
                </div>
                <div className="dashboard-card-content">
                  <h2><Link to="/user/my-card">Manage Card</Link></h2>
                </div>
              </div>
            </div>	
          </Col>

          <Col md="6" lg="6" sm="6">
            <Card className="vd-card">
              <CardHeader>
                <div className="d-flex align-items-center">
                  <div className="mr-auto">
                    <h4 className="card-title"><img src="/images/task.svg" height="30" alt="Task" /> Task</h4>
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
                    <Link to="/user/billing" className="btn-add">More</Link>
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
                          <th>Invoice No. </th>
                          <th>Billing Period	</th>
                          <th>Working Hours</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                      {invoiceList.map((invoiceInfo, index) => 
                      <tr key={index}>
                        <td>
                          <span className="sno">{index+1}</span>
                        </td>
                        <td>#{invoiceInfo.invoiceNo}</td>
                        <td>{ invoiceInfo.billingFrom+' - '+invoiceInfo.billingTo }</td>
                        <td align="center">{ invoiceInfo.billingHours }</td>
                        <td align="center">
                          <strong>${invoiceInfo.amount}</strong> &nbsp; &nbsp;
                          { invoiceInfo.status===0 &&
                          <Button className="btn-edit" size="sm" color="success" onClick={() => this.payInvoice(invoiceInfo.invoiceId, invoiceInfo.creditCard)} title="Pay Now"><i className="fa fa-paypal"></i></Button>
                          }
                          </td>
                      </tr>
                      )}
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
