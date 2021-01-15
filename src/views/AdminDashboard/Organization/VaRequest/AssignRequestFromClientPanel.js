import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
// import { Card, CardBody, CardHeader, Col, Row, Button, Input, FormGroup, Label, FormFeedback, InputGroup, InputGroupAddon } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../../core/services/commonService';
import Loader from '../../../Loader/Loader';
import NewApplicationData from './VaMemberList';
//import { Link } from 'react-router-dom';

class AssignRequestFromClientPanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      vaRequestId: '',
      authId:'',
      clientId: '',
      formField: { organizationId: '', organizationName:'', userName:'', vaRequestId:'', vaType: '', natureOfBusiness: '', engagementType:'', engagementDescription: '', numberOfVA:'', skillSet:'' },
      filterItem: { emailOrName: '' },
      vaApplicationList:[],
      loading: false,
      errors: {}
    } 
    //this.submitFormData = this.submitFormData.bind(this);
    this.filterVaMemberList = this.filterVaMemberList.bind(this);
  }

  componentDidMount() { 
    const { match: { params } } = this.props;    
    if(params.vaRequestId !== undefined && params.vaRequestId !=="") {
      this.setState({vaRequestId: params.vaRequestId});
      this.getRequestInfo(params.vaRequestId);
     
    }else {}

    this.itemList();
  }
  
  getRequestInfo(vaRequestId){
    this.setState( { loading: true}, () => {
        // va-request/assign-va-from-clientpanel/
        commonService.getAPIWithAccessToken('va-request/'+vaRequestId)
        .then( res => {
            
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          } 
          const itemInfo = res.data.data;
          const formField = {
            vaRequestId: itemInfo.vaRequestId, 
            organizationId: itemInfo.organizationId,
            organizationName: itemInfo.organizationName,
            userName: itemInfo.userName,
            vaType: itemInfo.vaType, 
            natureOfBusiness: itemInfo.natureOfBusiness, 
            engagementType: itemInfo.engagementType,
            engagementDescription: itemInfo.engagementDescription,
            skillSet: itemInfo.skillSet,
            numberOfVA: itemInfo.numberOfVA,
            status: itemInfo.status,
          };
          this.setState({vaRequestId: vaRequestId, clientId: itemInfo.authId, formField: formField, modal: true,loading: false, formValid: true});
          
        } )
        .catch( err => {               
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }else
            this.setState( { loading: false } );
            toast.error(err.message);
        } )
    } );
  }

  /*VA Member List API*/
  itemList(filterItem = {}) {
    let filterQuery = "?pageSize=50";
    if(filterItem.emailOrName !== undefined && filterItem.emailOrName !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&emailOrName="+filterItem.emailOrName: "&emailOrName="+filterItem.emailOrName;
    
    this.setState( { loading: true}, () => {
      // va-assignment/clients-va
      commonService.getAPIWithAccessToken('va-application/va-member'+filterQuery)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }
          this.setState({loading:false, vaApplicationList: res.data.data.requestList});
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }else {
            this.setState( { loading: false } );
            toast.error(err.message);
          }
        } )
    } )
  }

  filterVaMemberList(){
    const filterItem = this.state.filterItem;
    this.itemList(filterItem);
  }
  
  changeFilterHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    const filterItem = this.state.filterItem
    filterItem[name] = value;
    this.setState({ filterItem: filterItem });
  };

  /* Delete Record*/
  handleDeleteRecord(rowIndex){
    const itemInfo = this.state.itemList[rowIndex];
    let formdata = { "vaApplicationId":itemInfo.vaApplicationId }

    this.setState( { loading: true}, () => {
      commonService.deleteAPIWithAccessToken( 'va-application',formdata)
        .then( res => {
          this.setState({loading: false});
          if ( undefined === res.data || !res.data.status ) {            
             toast.error(res.data.message);      
            return;
          }         
          toast.success(res.data.message);
          this.itemList();
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

  render() {

    const { loading} = this.state;
    // const { loading, formField, errors } = this.state;
    let loaderElement = '';
    if(loading)        
      loaderElement = <Loader />

    return (
      <div className="animated fadeIn">
        <Row>
          
          {loaderElement}
          <Col lg={12}>
            <Card>
              <CardHeader className="mainHeading">
                {/* <strong>VA Assignment</strong> */}
              </CardHeader>
              <CardBody>
                
                    <div  className="form-service-listing">
                        {/* <h2>Client Details:</h2>
                        <Row>
                        <Col md={6}>
                            <FormGroup>
                            <Label htmlFor="userName">Name </Label>
                            <Input type="text" name="userName" id="userName" value={formField.userName} onChange={this.changeHandler} placeholder="Client Name" readOnly />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                            <Label htmlFor="organizationName">Organization </Label>
                            <Input type="text" name="organizationName" id="organizationName" value={formField.organizationName} onChange={this.changeHandler} placeholder="Organization Name" readOnly />
                            </FormGroup>
                        </Col>
                      </Row>
                      <h2>Request Details:</h2>
                      <Row>  
                        <Col md={6}>
                            <FormGroup>
                              <Label htmlFor="vaType">VA Type *</Label>
                              <Input type="select" name="vaType" id="vaType" className="form-control" value={this.state.formField.vaType} onChange={this.changeHandler} readOnly>
                                <option value="1">Business Support</option>
                                <option value="2">Personal Assistance</option>
                              </Input>      
                            </FormGroup> 
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                            <Label htmlFor="natureOfBusiness">Nature of Business *</Label>
                            <Input type="text" name="natureOfBusiness" id="natureOfBusiness" placeholder="Task Scope" invalid={errors['natureOfBusiness'] !== undefined && errors['natureOfBusiness'] !== ""} value={formField.natureOfBusiness} onChange={this.changeHandler} readOnly />
                            <FormFeedback>{errors['natureOfBusiness']}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup> 
                            <label htmlFor="engagementType">Type of Engagement *</label>
                            <Input type="select" name="engagementType" id="engagementType" value={this.state.formField.engagementType} onChange={this.changeHandler} readOnly>
                              <option value="1">Project-Based</option>
                              <option value="2">Ongoing Task</option>
                            </Input>
                          </FormGroup>  
                        </Col>
                        <Col md={6}>  
                          <FormGroup> 
                            <Label htmlFor="engagementDescription">Engagement Description </Label>   
                            <Input type="textarea" className="form-control" name="engagementDescription" id="engagementDescription" value={this.state.formField.engagementDescription} onChange={this.changeHandler}  readOnly />
                          </FormGroup>
                        </Col>
                        <Col md={"6"}>
                          <FormGroup> 
                            <Label htmlFor="numberOfVA">No. of VA Required</Label>            
                            <Input type="number" id="numberOfVA" name="numberOfVA" value={this.state.formField.numberOfVA} onChange={this.changeHandler} readOnly />
                          </FormGroup>              
                        </Col>
                        <Col md={"6"}>
                          <FormGroup> 
                            <Label htmlFor="skillSet">Skills Required</Label>            
                            <Input type="text" id="skillSet" name="skillSet" value={this.state.formField.skillSet} onChange={this.changeHandler}  readOnly />
                          </FormGroup>              
                        </Col>
                      </Row> */}
                       <button className="btn btn-sm btn-secondary pull-right" onClick={() => this.props.history.goBack()}>Go Back</button>
                      <h2 className="mt-5">VA Assignment:</h2>
                      <div className="Enquiries-info">
                        {/* New Enquiries Data */}
                        <Row>
                          <Col md="12">
                            <Card className="vd-card">
                              <div className="card-header">
                                <div className="d-flex align-items-center">
                                  <div className="mr-auto">
                                  <InputGroup>
                                    <Input placeholder="Filter by name or email..." name="emailOrName" value={this.state.filterItem.emailOrName} onChange={this.changeFilterHandler} />
                                    <InputGroupAddon addonType="prepend"><Button onClick={this.filterVaMemberList}><i className="fa fa-search"></i></Button></InputGroupAddon>
                                  </InputGroup>
                                  </div>
                                </div>
                              </div>
                              <CardBody>
                                <NewApplicationData data={this.state.vaApplicationList} vaRequestId={this.state.vaRequestId} clientId={this.state.clientId} />
                              </CardBody>              
                            </Card>
                          </Col>
                          
                        </Row>
                      </div>
                    </div>  
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

    )
  }
}

export default AssignRequestFromClientPanel;

