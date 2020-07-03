import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Form, Button, Input, FormGroup, Label, FormFeedback, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';
import Checkbox from "../../../core/commonComponent/Checkbox";
import "./../../Pages/Frontend/BeAVirtdropVA/BecomeVirtdropPage.css";

const skillArr = ['ECommerce','Data Entry and Research','SEO','Content Writing and Copywriting','Photo & Video Editing','Customer Support','Social Media Marketing and Management','Real Estate','Web Development and Graphics','Telesales and Telemarketing','Lead Generation','Others'];


class EditVaApplication extends Component {
  constructor(props){
    super(props);
    this.state = {
      vaApplicationId: '',
      requestStatus:'',
      formField: { firstName: '', lastName: '', email:'', mobileNumber:'', skypeID:'', socialMediaID:'', platform:'', portfolioLink:'', status:'', skillSet:'' },
      applicationFiles: {audioFile:'', resumeCV:'', intentLetter:'', internetSpeedScreenshot:'' },
      audioFile:'',
      resumeCV:'',
      intentLetter:'',
      internetSpeedScreenshot:'',
      checkboxes: skillArr.reduce(
        (options, option) => ({
          ...options,
          [option]: false
        }),
        {}
      ),
      successMessage: '',
      dropDownOpen: '',
      loading: false,
      errors: {}
    } 
    this.submitFormData = this.submitFormData.bind(this);
  }

  componentDidMount() { 
    const { match: { params } } = this.props;    
    if(params.vaApplicationId !== undefined && params.vaApplicationId !=="") {
      this.setState({vaApplicationId: params.vaApplicationId});
      this.getApplicationInfo(params.vaApplicationId);
    }
    else 
        this.props.history.push('/admin/organization/truck-listing');
  }
  
  
  getApplicationInfo(vaApplicationId){
    this.setState( { loading: true}, () => {
        commonService.getAPIWithAccessToken('va-application/'+vaApplicationId)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
           
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          } 
          const appDetail = res.data.data;
          let formField = this.state.formField;
          formField.firstName = appDetail.firstName;
          formField.lastName = appDetail.lastName;
          formField.email = appDetail.email;
          formField.mobileNumber = appDetail.mobileNumber;
          formField.skypeID = appDetail.skypeID;
          formField.socialMediaID = appDetail.socialMediaID;
          formField.platform = appDetail.platform;
          formField.portfolioLink = appDetail.portfolioLink;
          formField.status = appDetail.status;
          
          const listItems = appDetail.skillSet;
          let checkboxes = this.state.checkboxes;
          let availabilityItem = {}
          Object.keys(checkboxes).forEach((key, value) => { 
            if(listItems.indexOf(key) > -1 )
              availabilityItem[key] = true;
            else
              availabilityItem[key] = false;
          });

          let applicationFiles = this.state.applicationFiles;
          applicationFiles.audioFileName = appDetail.audioFileName;
          applicationFiles.audioFile = appDetail.audioFile;
          applicationFiles.resumeCVName = appDetail.resumeCVName;
          applicationFiles.resumeCV = appDetail.resumeCV;
          applicationFiles.intentLetterName = appDetail.intentLetterName;
          applicationFiles.intentLetter = appDetail.intentLetter;
          applicationFiles.internetSpeedScreenshotName = appDetail.internetSpeedScreenshotName;
          applicationFiles.internetSpeedScreenshot = appDetail.internetSpeedScreenshot;
          

          this.setState({ skillSet: listItems, checkboxes: availabilityItem, applicationFiles: applicationFiles });

          const statusBtn = <Button type="button" size="sm" className={ ( appDetail.status ? 'btn-danger' : 'btn-success' )} onClick={() => 
            this.changeFoodTruckStatus(appDetail.vaApplicationId, appDetail.status )} >{ ( appDetail.status ? 'Un-Approve Application' : 'Approve Application' )}</Button>
          
          this.setState({ loading: false, appDetail: appDetail, changeStatusBtn:statusBtn, formValid: true, formField: formField});
        } )
        .catch( err => {               
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }
          else
            this.setState( { loading: false } );
            toast.error(err.message);
        } )
    } );
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
        
        if(this.state.audioFile !== "")
          formData.append('audioFile', this.state.audioFile);
        if(this.state.resumeCV !== "")
          formData.append('resumeCV', this.state.resumeCV);
        if(this.state.intentLetter !== "")
          formData.append('intentLetter', this.state.intentLetter);
        if(this.state.internetSpeedScreenshot !== "")
          formData.append('internetSpeedScreenshot', this.state.internetSpeedScreenshot);
        
        Object.keys(this.state.checkboxes)
        .filter(checkbox => this.state.checkboxes[checkbox])
        .forEach(checkbox => {
          formData.append('skillSet', checkbox );
        });
        //console.log(formData);

        this.setState( { loading: true }, () => {
           commonService.putAPIWithAccessToken( `va-application`, formData )
            .then( res => {
              if ( undefined === res.data || !res.data.status ) {
                this.setState( { loading: false } );
                toast.error(res.data.message);
                return;
              }
              this.setState({loading: false, successMessage:res.data.message, errors:'' });
              this.props.history.push('/admin/va-application/');
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

  handleSkillChange = e => {
    const { name } = e.target;
    this.setState(prevState => ({
      checkboxes: {
        ...prevState.checkboxes,
        [name]: !prevState.checkboxes[name]
      }
    }));
  };

  handleAudioFileChange = (e) => { this.setState({ audioFile: e.target.files[0] }) };
  handleResumeCVeChange = (e) => { this.setState({ resumeCV: e.target.files[0] }) };
  handleIntentLetterChange = (e) => { this.setState({ intentLetter: e.target.files[0] }) };
  handleInternetSpeedScreenshotChange = (e) => { this.setState({ internetSpeedScreenshot: e.target.files[0] }) };
  

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
    return formIsValid;
  }
  
  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    })
  }

  changeApplicationStatus = (requestStatus) => {
    this.setState({
      requestStatus: requestStatus
    })
  }


  render() {

    const { loading, formField, applicationFiles, errors } = this.state;
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
                <strong>Edit VA Application</strong>
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.submitFormData} noValidate>
                    <div  className="form-service-listing">
                        <h2>Personal Information</h2>
                        <Row>
                        <Col md={6}>
                            <FormGroup>
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input type="text" name="firstName" id="firstName" invalid={errors['firstName'] !== undefined && errors['firstName'] !== ""} value={formField.firstName} onChange={this.changeHandler} placeholder="First Name" required />
                            <FormFeedback>{errors['firstName']}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input type="text" name="lastName" id="lastName" value={formField.lastName} invalid={errors['lastName'] !== undefined && errors['lastName'] !== ""} onChange={this.changeHandler} placeholder="Last Name" required />
                            <FormFeedback>{errors['lastName']}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                            <Label htmlFor="mobileNumber">Mobile Number *</Label>
                                <Input type="number" name="mobileNumber" min={1} step="1" id="mobileNumber" invalid={errors['mobileNumber'] !== undefined && errors['mobileNumber'] !== ""} placeholder="Mobile no." value={formField.mobileNumber} onChange={this.changeHandler} required />
                                <FormFeedback>{errors['mobileNumber']}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                            <Label htmlFor="email">Email Address *</Label>
                            <Input type="email" name="email" id="email" placeholder="Email Address" invalid={errors['email'] !== undefined && errors['email'] !== ""} value={formField.email} onChange={this.changeHandler} required />
                            <FormFeedback>{errors['email']}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                            <Label htmlFor="skypeID">Skype ID *</Label>
                            <Input type="text" name="skypeID" invalid={errors['skypeID'] !== undefined && errors['skype'] !== ""} id="skypeID" value={formField.skypeID} onChange={this.changeHandler} placeholder="Skype ID" required />
                            <FormFeedback>{errors['skypeID']}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col md={3}>  
                            <FormGroup>
                            <Label htmlFor="socialMediaID">Social Media IDs (optional)</Label>
                            <Input type="text" name="socialMediaID" id="socialMediaID" value={formField.socialMediaID} placeholder="Social Media IDs" onChange={this.changeHandler} />
                            </FormGroup>
                        </Col>
                        <Col md="12">
                            <FormGroup>
                            <Label>Platforms, Tools, Systems , CRM *</Label>
                            <Input type="textarea" name="platform" value={formField.platform} placeholder="Platforms, Tools, Systems, CRM" onChange={this.changeHandler} required />
                            <FormFeedback>{errors['platform']}</FormFeedback>
                            </FormGroup>
                        </Col>
                        <Col md="12">
                          <FormGroup>
                            <Label>Website/ Portfolio Links </Label>
                            <Input type="text" name="portfolioLink" value={formField.portfolioLink} placeholder="Website/ Portfolio Links" onChange={this.changeHandler} />
                          </FormGroup>
                        </Col>
                        </Row>
                    </div>
                    <div className="form-service-listing">
                    <h4>Skills Sets</h4>
                    <div className="row">
                        <div className="col-md-12">
                        <FormGroup>
                        <ul className="form-checkbox-list">
                        {skillArr.map((skill, index) =>  
                        <li key={index}>
                        <Label check>
                            <Checkbox
                            label={skill}
                            isSelected={ this.state.checkboxes[skill]}
                            onCheckboxChange={this.handleSkillChange}
                            key={skill}
                            />
                        </Label>
                        </li>
                            )}
                        </ul>
                        </FormGroup>
                        </div>  
                    </div>
                    </div>

                    <div className="form-service-listing">
                    <h2>Upload</h2>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="file-box">
                                <h3>Audio Clip/File</h3>
                                { applicationFiles.audioFile!=='' ? <p className="text-center"><a href={ applicationFiles.audioFile } target="_blank" rel="noopener noreferrer">{ applicationFiles.audioFileName }</a></p> : '' }
                                <Input type="file" id="audioFile" name="audioFile" className="inputfile inputfile-4" data-multiple-caption="{count} files selected" onChange={this.handleAudioFileChange} />
                                <label htmlFor="audioFile">
                                    <figure><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></figure> 
                                    <span>{ this.state.audioFile!=='' ? this.state.audioFile.name : 'Choose a file' }&hellip;</span>
                                </label>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="file-box">
                                <h3>Resumes/CVS</h3>
                                { applicationFiles.resumeCV!=='' ? <p className="text-center"><a href={ applicationFiles.resumeCV } target="_blank" rel="noopener noreferrer">{ applicationFiles.resumeCVName }</a></p> : '' }
                                <Input type="file" id="resumeCV" name="resumeCV" className="inputfile inputfile-4" data-multiple-caption="{count} files selected" onChange={this.handleResumeCVeChange} />
                                <label htmlFor="resumeCV">
                                    <figure><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></figure> 
                                    <span>{ this.state.resumeCV!=='' ? this.state.resumeCV.name : 'Choose a file' }&hellip;</span>
                                </label>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="file-box">
                            <h3>Intent Letter </h3>
                            { applicationFiles.intentLetter!=='' ? <p className="text-center"><a href={ applicationFiles.intentLetter } target="_blank" rel="noopener noreferrer">{ applicationFiles.intentLetterName }</a></p> : '' }
                            <Input type="file" id="intentLetter" name="intentLetter" className="inputfile inputfile-4" data-multiple-caption="{count} files selected" onChange={this.handleIntentLetterChange} />
                            <label htmlFor="intentLetter">
                                <figure><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></figure> 
                                <span>{ this.state.intentLetter!=='' ? this.state.intentLetter.name : 'Choose a file' }&hellip;</span>
                            </label>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="file-box">
                                <h3>Internet Connection Speed screenshot </h3>
                                { applicationFiles.internetSpeedScreenshot!=='' ? <p className="text-center"><a href={ applicationFiles.internetSpeedScreenshot } target="_blank" rel="noopener noreferrer">{ applicationFiles.internetSpeedScreenshotName }</a></p> : '' }
                                <Input type="file" id="internetSpeedScreenshot" name="internetSpeedScreenshot" className="inputfile inputfile-4" data-multiple-caption="{count} files selected" onChange={this.handleInternetSpeedScreenshotChange} />
                                <label htmlFor="internetSpeedScreenshot"><figure><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></figure> 
                                    <span>{ this.state.internetSpeedScreenshot!=='' ? this.state.internetSpeedScreenshot.name : 'Choose a file' }&hellip;</span>
                                </label>
                            </div>
                        </div>
                        {/* <Col md="6">
                          <FormGroup>
                            <Label>Status *</Label>
                            <Input type="select" name="status" value={formField.status} onChange={this.changeHandler} required>
                              <option value="1">Pending</option>
                              <option value="2">Approve</option>
                              <option value="3">Reject</option>
                            </Input>
                          </FormGroup>
                        </Col> */}
                    </div>
                  </div>
                  <hr />
                  <div className="form-service-listing">
                      <div className="row">
                          <div className="col-md-6">
                            <ButtonDropdown isOpen={this.state.dropDownOpen} toggle={this.toggle}>
                              <DropdownToggle caret size="md">
                                { (formField.status===1) ? "Pending" : ((formField.status ===2 )  ? "Approved" : "Rejected") }
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem onClick={() => this.changeApplicationStatus(2)}>Approve Application</DropdownItem>
                                <DropdownItem onClick={() => this.changeApplicationStatus(3)}>Reject Application</DropdownItem>
                                <DropdownItem onClick={() => this.changeApplicationStatus(1)}>Make Pending</DropdownItem>
                              </DropdownMenu>
                            </ButtonDropdown>
                          </div>
                          <div className="col-md-6">
                              <div className="form-group pull-right">
                                  <Button className="submit-btn">Save Changes</Button>
                              </div>
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

export default EditVaApplication;
