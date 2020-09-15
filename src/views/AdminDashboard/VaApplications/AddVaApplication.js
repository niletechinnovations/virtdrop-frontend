import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Form, Button, Input, FormGroup, Label, FormFeedback } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';
import "./../../Pages/Frontend/BeAVirtdropVA/BecomeVirtdropPage.css";

const skillArr = ['ECommerce','Data Entry and Research','SEO','Content Writing and Copywriting','Photo & Video Editing','Customer Support','Social Media Marketing and Management','Real Estate','Web Development and Graphics','Telesales and Telemarketing','Lead Generation','Others'];


class AddVaApplication extends Component {
  constructor(props){
    super(props);
    this.state = {
      requestStatus:'',
      formField: { firstName: '', lastName: '', email:'', mobileNumber:'', skypeID:'', socialMediaID:'', platform:'', portfolioLink:'', status:'', skillSet:'',skillSet1:'', skillSet2:'', skillSet3:'', rateSkill1:'', rateSkill2:'', rateSkill3:'', referenceName:'', referenceEmail:'', notes:'' },
      applicationFiles: {audioFile:'', resumeCV:'', intentLetter:'', internetSpeedScreenshot:'' },
      audioFile:'',
      resumeCV:'',
      intentLetter:'',
      internetSpeedScreenshot:'',
      successMessage: '',
      loading: false,
      errors: {}
    } 
    this.submitFormData = this.submitFormData.bind(this);
  }

  componentDidMount() { 

  }
  
  submitFormData(e) {
    e.preventDefault();
    e.target.className += " was-validated";
      if (this.validateForm()) {
        const formInputField = this.state.formField;
        const formData = new FormData();
        formData.append('firstName', formInputField.firstName);
        formData.append('lastName', formInputField.lastName);
        formData.append('email', formInputField.email.toLowerCase());
        formData.append('mobileNumber', formInputField.mobileNumber);
        formData.append('skypeID', formInputField.skypeID);
        formData.append('socialMediaID', formInputField.socialMediaID);
        formData.append('platform', formInputField.platform);
        formData.append('portfolioLink', formInputField.portfolioLink);

        if(formInputField.skillSet1 !== "")
          formData.append('skillSet1', formInputField.skillSet1);
        if(formInputField.skillSet2 !== "")
          formData.append('skillSet2', formInputField.skillSet2);
        if(formInputField.skillSet3 !== "")
          formData.append('skillSet3', formInputField.skillSet3);
        if(formInputField.rateSkill1 !== "")
          formData.append('rateSkill1', formInputField.rateSkill1);
        if(formInputField.rateSkill2 !== "")
          formData.append('rateSkill2', formInputField.rateSkill2);
        if(formInputField.rateSkill3 !== "")
          formData.append('rateSkill3', formInputField.rateSkill3);
        if(formInputField.referenceName !== "")
          formData.append('referenceName', formInputField.referenceName);
        if(formInputField.referenceEmail !== "")
          formData.append('referenceEmail', formInputField.referenceEmail);
        if(formInputField.notes !== "")
          formData.append('notes', formInputField.notes);
        
        
        if(this.state.audioFile !== "")
          formData.append('audioFile', this.state.audioFile);
        if(this.state.resumeCV !== "")
          formData.append('resumeCV', this.state.resumeCV);
        if(this.state.intentLetter !== "")
          formData.append('intentLetter', this.state.intentLetter);
        if(this.state.internetSpeedScreenshot !== "")
          formData.append('internetSpeedScreenshot', this.state.internetSpeedScreenshot);
        
        this.setState( { loading: true }, () => {
           commonService.postAPI( `va-application`, formData )
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
                <strong>Add VA Application</strong>
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
                      <Row>
                        <Col md="4" sm="12">
                          <h4>Skill Set 1</h4>
                          <Row>
                            <Col md="8" sm="6">
                              <FormGroup>
                                <Input type="select" name="skillSet1" value={formField.skillSet1} onChange={this.changeHandler} required invalid={errors['skillSet1'] !== undefined && errors['skillSet1'] !== ""}>
                                  <option value="">Select Skill 1 *</option>
                                  {skillArr.map((skill, index) =>
                                  <option key={index} value={skill}>{skill}</option>
                                  )}
                                </Input>
                                <FormFeedback>{errors['skillSet1']}</FormFeedback>
                              </FormGroup>
                            </Col>
                            <Col md="4" sm="6">
                              <FormGroup>
                                <Input type="number" name="rateSkill1" value={formField.rateSkill1} placeholder="Rating" min="1" max="10" onChange={this.changeHandler} />
                              </FormGroup>
                            </Col>  
                          </Row>
                        </Col>    
                        <Col md="4" sm="12">
                          <h4>Skill Set 2</h4>
                          <Row>
                            <Col md="8" sm="6">
                              <FormGroup>
                                <Input type="select" name="skillSet2" value={formField.skillSet2} onChange={this.changeHandler}>
                                  <option value="">Select Skill 2</option>
                                  {skillArr.map((skill, index) =>
                                  <option key={index} value={skill}>{skill}</option>
                                  )}
                                </Input>
                              </FormGroup>
                            </Col>
                            <Col md="4" sm="6">
                              <FormGroup>
                                <Input type="number" name="rateSkill2" value={formField.rateSkill2} placeholder="Rating" min="1" max="10" onChange={this.changeHandler} />
                              </FormGroup>
                            </Col>  
                          </Row>
                        </Col>
                        <Col md="4" sm="12">
                          <h4>Skill Set 3</h4>
                          <Row>
                            <Col md="8" sm="6">
                              <FormGroup>
                                <Input type="select" name="skillSet3" value={formField.skillSet3} onChange={this.changeHandler}>
                                  <option value="">Select Skill 3</option>
                                  {skillArr.map((skill, index) =>
                                  <option key={index} value={skill}>{skill}</option>
                                  )}
                                </Input>
                              </FormGroup>
                            </Col>
                            <Col md="4" sm="6">
                              <FormGroup>
                                <Input type="number" name="rateSkill3" value={formField.rateSkill3} placeholder="Rating" min="1" max="10" onChange={this.changeHandler} />
                              </FormGroup>
                            </Col>  
                          </Row>
                        </Col>  
                      </Row>
                    </div>

                    <div className="form-service-listing">
                    <h2>Upload</h2>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="file-box">
                                <h3>Audio Clip/File</h3>
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

                  <div  className="form-service-listing">
                    <h2>References</h2>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="referenceName">Name</Label>
                          <Input type="text" name="referenceName" id="referenceName" value={formField.referenceName} onChange={this.changeHandler} placeholder="Reference Name" />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="referenceEmail">Email</Label>
                          <Input type="email" name="referenceEmail" id="referenceEmail" value={formField.referenceEmail} onChange={this.changeHandler} placeholder="Reference Email" />
                        </FormGroup>
                      </Col>
                      <Col md={12}>
                        <FormGroup>
                          <Label htmlFor="notes">Notes</Label>
                          <Input type="textarea" name="notes" id="notes" value={formField.notes} onChange={this.changeHandler} placeholder="Notes" />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr />
                  <div className="form-service-listing">
                      <div className="row">
                          <div className="col-md-12">
                              <div className="form-group pull-right">
                                  <Button className="submit-btn">Submit</Button>
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

export default AddVaApplication;
