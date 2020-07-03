import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Form, Button, Input, FormGroup, Label, FormFeedback, InputGroup, InputGroupAddon } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../../core/services/commonService';
import Loader from '../../../Loader/Loader';

import NewApplicationData from './VaMemberList';
import { Link } from 'react-router-dom';


class AssignRequest extends Component {
  constructor(props){
    super(props);
    this.state = {
      vaRequestId: '',
      formField: { organizationId: '', organizationName:'', userName:'', vaRequestId:'', vaType: '', natureOfBusiness: '', engagementType:'', engagementDescription: '', numberOfVA:'', skillSet:'' },
      vaApplicationList:[],
      loading: false,
      errors: {}
    } 
    this.submitFormData = this.submitFormData.bind(this);
  }

  componentDidMount() { 
    const { match: { params } } = this.props;    
    if(params.vaRequestId !== undefined && params.vaRequestId !=="") {
      this.setState({vaRequestId: params.vaRequestId});
      this.getRequestInfo(params.vaRequestId);
    }else 
      this.props.history.push('/admin/va-request');

    this.itemList();
  }
  
  getRequestInfo(vaRequestId){
    this.setState( { loading: true}, () => {
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
          this.setState({vaRequestId: vaRequestId, formField: formField, modal: true,loading: false, formValid: true});
          
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

  /*VA Request List API*/
  itemList(filterItem = {}) {
    let filterQuery = "?pageSize=50";
    if(filterItem.filterVaType !== undefined && filterItem.filterVaType !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&vaType="+filterItem.filterVaType: "&vaType="+filterItem.filterVaType;
    
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('va-application'+filterQuery)
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

  submitFormData(e) {
    e.preventDefault();
    e.target.className += " was-validated";
      if (this.validateForm()) {
        const formInputField = this.state.formField;
        const formData = new FormData();
        formData.append('vaApplicationId', this.state.vaApplicationId);
        formData.append('firstName', formInputField.firstName);
        formData.append('lastName', formInputField.lastName);
        formData.append('email', formInputField.email.toLowerCase());
        formData.append('mobileNumber', formInputField.mobileNumber);
        formData.append('skypeID', formInputField.skypeID);
        formData.append('socialMediaID', formInputField.socialMediaID);
        formData.append('platform', formInputField.platform);
        formData.append('portfolioLink', formInputField.portfolioLink);
        formData.append('status', formInputField.status);
        
      
        this.setState( { loading: true }, () => {
           commonService.putAPIWithAccessToken( `va-request`, formData )
            .then( res => {
              if ( undefined === res.data || !res.data.status ) {
                this.setState( { loading: false } );
                toast.error(res.data.message);
                return;
              }
              this.setState({loading: false, successMessage:res.data.message, errors:'' });
              this.props.history.push('/admin/va-request/');
              toast.success(res.data.message);
              window.scrollTo(0, 0);
            } )
            .catch( err => {
              toast.error(err.message);
              this.setState( { loading: false} );
            } )
        } )
      }else{
        //console.log("Outside validation area.");
      }
  };
 
  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    const formField = this.state.formField
    formField[name] = value;
    this.setState({ formField: formField, } );
  };

  validateForm() {
    let errors = {};
    let formIsValid = true;
    let formField = this.state.formField;
    if (!formField.firstName) {
        formIsValid = false;
        errors["firstName"] = "*Please enter first name.";
    }
    if (typeof formField.firstName !== "undefined") {
        if (!formField.firstName.match(/^[a-zA-Z ]*$/)) {
            formIsValid = false;
            errors["firstName"] = "*Please enter alphabet characters only.";
        }
    }
    if (!formField.lastName) {
      formIsValid = false;
      errors["lastName"] = "*Please enter last name.";
    }
    if (!formField.email) {
        formIsValid = false;
        errors["email"] = "*Please enter your email-ID.";
    }
    if (typeof formField.email !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(formField.email)) {
            formIsValid = false;
            errors["email"] = "*Please enter valid email-ID.";
        }
    }
  
    if (!formField.mobileNumber) {
      formIsValid = false;
      errors["mobileNumber"] = "*Please enter your mobile no.";
    }
    if (typeof formField.mobileNumber !== "undefined") {
      if (!formField.mobileNumber.match(/^[0-9]{10}$/)) {
          formIsValid = false;
          errors["mobileNumber"] = "*Please enter valid mobile no.";
      }
    }
   
    if (!formField.skypeID) {
      formIsValid = false;
      errors["skypeID"] = "*This field is required";
    }
    
    if (!formField.platform) {
      formIsValid = false;
      errors["platform"] = "*This field is required";
    }

    if(formIsValid=== false)
      window.scrollTo(0, 0);
    
    this.setState({
      loading: false,
      errors: errors
    });
    //console.error(errors);
    return formIsValid;
  }
  
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

    const { loading, formField, errors } = this.state;
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
                <strong>VA Assignment</strong>
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.submitFormData22} noValidate>
                    <div  className="form-service-listing">
                        <h2>Client Details:</h2>
                        <Row>
                        <Col md={6}>
                            <FormGroup>
                            <Label htmlFor="userName">Name </Label>
                            <Input type="text" name="userName" id="userName" value={formField.userName} onChange={this.changeHandler} placeholder="Client Name" />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                            <Label htmlFor="organizationName">Organization </Label>
                            <Input type="text" name="organizationName" id="organizationName" value={formField.organizationName} onChange={this.changeHandler} placeholder="Organization Name" />
                            </FormGroup>
                        </Col>
                      </Row>
                      <h2>Request Details:</h2>
                      <Row>  
                        <Col md={6}>
                            <FormGroup>
                              <Label htmlFor="vaType">VA Type *</Label>
                              <Input type="select" name="vaType" id="vaType" className="form-control" value={this.state.formField.vaType} onChange={this.changeHandler} required>
                                <option value="1">Business Support</option>
                                <option value="2">Personal Assistance</option>
                              </Input>      
                            </FormGroup> 
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                            <Label htmlFor="natureOfBusiness">Nature of Business *</Label>
                            <Input type="text" name="natureOfBusiness" id="natureOfBusiness" placeholder="Task Scope" invalid={errors['natureOfBusiness'] !== undefined && errors['natureOfBusiness'] !== ""} value={formField.natureOfBusiness} onChange={this.changeHandler} required />
                            <FormFeedback>{errors['natureOfBusiness']}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup> 
                            <label htmlFor="engagementType">Type of Engagement *</label>
                            <Input type="select" name="engagementType" id="engagementType" value={this.state.formField.engagementType} onChange={this.changeHandler} required>
                              <option value="1">Project-Based</option>
                              <option value="2">Ongoing Task</option>
                            </Input>
                          </FormGroup>  
                        </Col>
                        <Col md={6}>  
                          <FormGroup> 
                            <Label htmlFor="engagementDescription">Engagement Description </Label>   
                            <Input type="textarea" className="form-control" name="engagementDescription" id="engagementDescription" value={this.state.formField.engagementDescription} onChange={this.changeHandler} required />
                          </FormGroup>
                        </Col>
                        <Col md={"6"}>
                          <FormGroup> 
                            <Label htmlFor="numberOfVA">No. of VA Required</Label>            
                            <Input type="number" id="numberOfVA" name="numberOfVA" value={this.state.formField.numberOfVA} onChange={this.changeHandler} />
                          </FormGroup>              
                        </Col>
                        <Col md={"6"}>
                          <FormGroup> 
                            <Label htmlFor="skillSet">Skills Required</Label>            
                            <Input type="text" id="skillSet" name="skillSet" value={this.state.formField.skillSet} onChange={this.changeHandler} />
                          </FormGroup>              
                        </Col>
                      </Row>
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
                                    <Input placeholder="Filter by name or email..." name="filterKey"  />
                                    <InputGroupAddon addonType="prepend"><Button><i className="fa fa-search"></i></Button></InputGroupAddon>
                                  </InputGroup>
                                  </div>
                                </div>
                              </div>
                              <CardBody>
                                <NewApplicationData data={this.state.vaApplicationList} />
                              </CardBody>              
                            </Card>
                          </Col>
                          <Col md="12">
                            <div className="form-group">
                              <Link className="btn btn-danger" to="/admin/va-request">Cancel</Link> &nbsp;
                              <Button className="btn btn-success">Assign</Button>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>  
                  <div className="form-service-listing">
                      <div className="row">
                          <div className="col-md-12">
                              
                          </div>
                      </div>
                  </div>

                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

    )
  }
}

export default AssignRequest;
