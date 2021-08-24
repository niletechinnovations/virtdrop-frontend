import React from "react";
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, FormFeedback, Input, Button, Label } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';
import "./VaProfilePage.css";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
const WEB_URL = process.env.WEB_URL;

class VaProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      vaUniqueDetails: '',
      vaAuthId:'',
      skillset_1: '',
      skillset_2: '',
      skillset_3: '',
      flag: false,
      kickoff_visible: false,
      formField: { firstName: '', lastName: '', email: '', phoneNumber: '', interestedOn: 'Business looking to hire', message: '', kickoff_date: '', suggestedDate: '', suggestedTime: '', hireVaId: '', vaAuthId: '' },
      loading: false,
      // kickoffDate:'',
      errors: {}
    };

    this.changeHandler = this.changeHandler.bind(this);
    this.submitContactForm = this.submitContactForm.bind(this);
    this.submitKickoff = this.submitKickoff.bind(this);
    this.setSelectedDate = this.setSelectedDate.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    const { match: { params: { vaProfileId } } } = this.props;
    console.log("Get Params", this.props)
    const getHiveVAId = vaProfileId.split("&")[1].split("=")[1]
    console.log("getvaAuthId", getHiveVAId)

    this.setState({ formField: { hireVaId: getHiveVAId } })
    // console.log("this.props;",vaProfileId.split("&")[0])
    const vaAuthId = vaProfileId.split("&")[0];
    this.setState({ vaAuthId: vaAuthId })


    this.getProfile(vaProfileId)
    this.meetingsLists();
  }

  meetingsLists() {
    this.setState({ loading: true }, () => {
      // console.log("filterQuerydd", filterQuery)
      commonService.getAPIWithAccessToken('schedule-meeting/')
        .then(res => {
          console.log("result====Meeting=======>", res.data.data.requestList);
          if (undefined === res.data.data || !res.data.status) {
            this.setState({ loading: false });
            toast.error(res.data.message);
            return;
          }
          console.log("Form Field===========", this.state.formField.hireVaId)
          //  if(this.state.formField.hireVaId==res.data.data.requestList.map(e=>e.hireVaId))
          const result = res.data.data.requestList.find(e => e.hireVaId==this.state.formField.hireVaId)
          if(result){
              console.log("result====>", result)
            if (result.flag ==true ) {
              this.setState({ flag: true });
            } else { this.setState({ flag: false }) }

            if(result.suggestedDate!=='')
              this.setState({ kickoff_visible: true });
              
          }else { this.setState({ flag: false }) }
          
          this.setState({ loading: false, meetingsLists: res.data.data.requestList });
        })
        .catch(err => {
          // console.log("Meeting------------->", err)
          if (err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          } else {
            this.setState({ loading: false });
            toast.error(err.message);
          }
        })
    })
  }
  getProfile = (vaAuthId) => {
    this.setState({ loading: true }, () => {
      // 'hire/hire-va-request/' + hireVARequestId)
      // commonService.getAPIWithAccessToken('va-assignment/assigned-clients/?clientId='+clientId)
      commonService.getAPIWithAccessToken('va-application/va-unique-member/?vaAuthid=' + vaAuthId)
        .then(res => {
          // console.log("res VA MEMBER111111111", res.data.data.requestList[0])
          if (undefined === res.data.data || !res.data.status) {
            this.setState({ loading: false });
            toast.error(res.data.message);
            return;
          }
          this.setState({ loading: false, vaUniqueDetails: res.data.data.requestList[0] });
          console.log("skill set----->", this.state.vaUniqueDetails.skillSet1)
          const skillSet_1 = this.state.vaUniqueDetails.skillSet1 !=undefined? this.state.vaUniqueDetails.skillSet1.map(e => e.skillName).toString():""
          const skillSet_2 = this.state.vaUniqueDetails.skillSet2 !=undefined? this.state.vaUniqueDetails.skillSet2.map(e => e.skillName).toString():''
          const skillSet_3 = this.state.vaUniqueDetails.skillSet3 !=undefined? this.state.vaUniqueDetails.skillSet3.map(e => e.skillName).toString():''
          console.log("skillset_1",skillSet_1, skillSet_2, skillSet_3)
          this.setState({ skillSet_1: skillSet_1, skillSet_2: skillSet_2, skillSet_3: skillSet_3 });
        })
        .catch(err => {
          console.log("error-------------->",err)
          if (err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          } else {
            this.setState({ loading: false });
            toast.error(err.message);
          }
        })

    })

  }

  setSelectedDate = date => {

    let selectedDate = this.state.formField;
    // selectedDate.kickoff_date = date;
    selectedDate.suggestedDate = date;
    // selectedDate.suggestedTime=date;

    console.log("DATEETEST", selectedDate)
    this.setState({ formField: selectedDate });
  };
  setSelectedDateKickoff = date => {

   
    let selectedDate = this.state.formField;
    selectedDate.kickoff_date = date;
    // selectedDate.suggestedDate = date;
    // selectedDate.suggestedTime=date;

    console.log("DATEETEST", selectedDate)
    this.setState({ formField: selectedDate });
  };

  submitKickoff(e) {
    // e.preventDefault();
    // console.log(this.state.formField.kickoff_date,"kickoffff")
    const formData = {
      // authId: localStorage.getItem("authId"),
      hireVaId: this.state.formField.hireVaId,
      vaAuthId: this.state.vaAuthId,
      kickoff_date: this.state.formField.kickoff_date,
      suggestedDate: this.state.formField.suggestedDate,
      suggestedTime: this.state.formField.suggestedTime,
    }
    this.setState({ loading: true }, () => {
      commonService.postAPI(`va-application/kickoff/`, formData)
        .then(res => {
          this.setState( { flag:res.data.flag});
          if (undefined === res.data || !res.status) {
            this.setState({ loading: false });
            toast.error(res.data.message);
            return false;
          }
          const loggedInfo = res.data;
          if ( undefined === loggedInfo.data.ccNumber || loggedInfo.data.ccNumber==="" ) {
            localStorage.setItem( 'accessToken', loggedInfo.data.accessToken );
            localStorage.setItem( 'role', loggedInfo.data.role );
            localStorage.setItem( 'authId', loggedInfo.data.authId );
            localStorage.setItem( 'userName', loggedInfo.data.firstName+' '+loggedInfo.data.lastName );
            localStorage.setItem( 'userEmail', loggedInfo.data.email );
            localStorage.setItem( 'profilePic', loggedInfo.data.profilePic );
            localStorage.setItem( 'isActivePlan', false );
            localStorage.setItem( 'isOrganization', false );        
            this.setState( { loading: false, loggedIn: true } )
            toast.error(res.data.message);
            this.props.history.push('/user/my-card')
            return;
          }else{
            this.meetingsLists();
            this.getProfile(this.state.vaAuthId)
            toast.success(res.data.message);
          }
        })
        .catch(err => {
          toast.error(err.message);
          this.setState({ loading: false });
        })
    })

    //setTimeout(function(){window.location.reload()},6000)
  }

  submitContactForm(e) {
    e.preventDefault();
    //e.target.className += " was-validated";
    if (this.validateForm()) {
      const formInputField = this.state.formField;
      const formData = {
        contactPerson: formInputField.firstName + ' ' + formInputField.lastName,
        email: formInputField.email.toLowerCase(),
        phone: formInputField.phoneNumber,
        subject: formInputField.interestedOn,
        message: formInputField.message,
      };
      this.setState({ loading: true }, () => {
        commonService.postAPI(`common/contact-us22`, formData)
          .then(res => {
            if (undefined === res.data || !res.data.status) {
              this.setState({ loading: false });
              toast.error(res.data.message);
              return;
            }

            this.props.history.push('/contact-us');
            toast.success(res.data.message);
            this.setState({
              formField: { firstName: '', lastName: '', email: '', phoneNumber: '', interestedOn: '', message: '' },
              loading: false,
              errors: {}
            })
          })
          .catch(err => {
            toast.error(err.message);
            this.setState({ loading: false });
          })
      })
    } else {
      console.log("Outside validation area.");
    }
  };

  validateForm() {
    let errors = {};
    let formIsValid = true;
    const formField = this.state.formField;
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
    if (formField.phoneNumber !== "") {
      if (!formField.phoneNumber.match(/^[0-9]{10}$/)) {
        formIsValid = false;
        errors["phoneNumber"] = "*Please enter valid mobile no.";
      }
    }
    if (!formField.interestedOn) {
      formIsValid = false;
      errors["interestedOn"] = "*Please choose your interest.";
    }
    if (!formField.message) {
      formIsValid = false;
      errors["message"] = "*Please enter your query.";
    }
    this.setState({ loading: false, errors: errors });
    return formIsValid;
  }

  changeHandler(e) {
    console.log("e==========>", e.target)
    const name = e.target.name;
    const value = e.target.value;
    const formField = this.state.formField;
    // const kickoffDate = this.state.kickoffDate
    // kickoffDate=value;
    formField[name] = value;
    console.log("Form FIeld====>", formField)
    this.setState({ formField: formField });
  };


  render() {
    const { loading, formField, errors, vaUniqueDetails, skillSet_1, skillSet_2, skillSet_3, flag } = this.state;
    console.log("Flag==================", flag)
    let loaderElement = '';
    if (loading)
      loaderElement = <Loader />

    return (
      <>
        <ToastContainer />
        {loaderElement}
        <div className="profile-page-section">
          <div className="profile-info-card">
            <Container>
              <div className="profile-info-bg"></div>
              <div className="profile-info-content">
                <div className="profile-item-info">
                  <div className="profile-media">
                    <img src="/images/avatar.jpg" alt="user" className="profile-pic" />
                  </div>
                  <div className="profile-content">
                    <h2>{ (vaUniqueDetails!=='' ?  vaUniqueDetails.firstName + " " + vaUniqueDetails.lastName : '' ) }</h2>
                  </div>
                </div>
              </div>
            </Container>
          </div>

          <Container>
            <Row>
              <Col md="4" lg="4" sm="4">
                <div className="profile-card card-sticky">
                  <div className="profile-card-header">
                    <div className="d-flex align-items-center">
                      <div className="mr-auto">
                        <h4 className="card-title">Personal Information</h4>
                      </div>
                    </div>
                  </div>
                  <div className="profile-card-body">
                    <div className="profile-personal-info">
                      <div className="profile-personal-icon"><i className="fa fa-envelope" aria-hidden="true"></i></div>
                      <div className="profile-personal-text">
                        <h2>Email ID:</h2>
                        <p><a href="#">{vaUniqueDetails.email}</a></p>
                      </div>
                    </div>

                    <div className="profile-personal-info">
                      <div className="profile-personal-icon"><i className="fa fa-phone" aria-hidden="true"></i></div>
                      <div className="profile-personal-text">
                        <h2>Phone No.:</h2>
                        <p><a href="#">{vaUniqueDetails.mobileNumber}</a></p>
                      </div>
                    </div>

                    <div className="profile-personal-info">
                      <div className="profile-personal-icon"><i className="fa fa-skype" aria-hidden="true"></i></div>
                      <div className="profile-personal-text">
                        <h2>Skype ID:</h2>
                        <p>{vaUniqueDetails.skypeID}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md="8" lg="8" sm="8">
                <div className="profile-card">
                  <div className="profile-card-header">
                    <div className="d-flex align-items-center">
                      <div className="mr-auto">
                        <h4 className="card-title">VA Profile</h4>
                      </div>
                    </div>
                  </div>
                  <div className="profile-card-body">
                    <ul className="user-info">
                      <li>
                        <label>Website/ Portfolio Links:</label>
                        <p>{vaUniqueDetails.portfolioLink}</p>
                      </li>
                      <li>
                        <label>Platforms, Tools, Systems , CRM :</label>
                        <p>VA Applcation</p>
                      </li>
                      <li>
                        <label>Skills:</label>
                        <p>{skillSet_1}, {skillSet_2},  {skillSet_3}</p>
                      </li>
                    </ul>
                    <Row>
                    { vaUniqueDetails.audioFile !=='' ?
                      <Col md="3" lg="3" sm="3">
                        <div className="view-attachment-card">
                          <div className="view-attachment-icon">
                            <i className="fa fa-file-audio-o" aria-hidden="true"></i>
                          </div>
                          <div className="view-attachment-text">
                            <p><a href={vaUniqueDetails.audioFile} download="VA Audio clip"><h2>Audio clip editor</h2></a></p>
                            </div>
                        </div>
                      </Col>
                      : '' }
                      
                      { vaUniqueDetails.resumeCV !==undefined && vaUniqueDetails.resumeCV !=='' ?
                      <Col md="3" lg="3" sm="3">
                        <div className="view-attachment-card">
                          <div className="view-attachment-icon">
                            <i className="fa fa-file-word-o" aria-hidden="true"></i>
                          </div>
                          <div className="view-attachment-text">
                            <p><a href={ "https://view.officeapps.live.com/op/embed.aspx?src="+vaUniqueDetails.resumeCV+"&embedded=true" } target="_blank" rel="noopener noreferrer"><h2>Resume / CV</h2></a></p>
                          </div>
                        </div>
                      </Col>
                      : '' }
                    
                      { vaUniqueDetails.intentLetter !=='' ?
                      <Col md="3" lg="3" sm="3">
                        <div className="view-attachment-card">
                          <div className="view-attachment-icon">
                            <i className="fa fa-file-pdf-o" aria-hidden="true"></i>
                          </div>
                          <div className="view-attachment-text">
                            <p><a href={vaUniqueDetails.intentLetter}  download="Intent Lettter"
                              target="_blank" rel="noopener noreferrer" title="Download Intent Letter"><h2>Intent Letter</h2></a></p>
                          </div>
                        </div>
                      </Col>
                      : '' }

                      { vaUniqueDetails.internetSpeedScreenshot !=='' ?
                      <Col md="3" lg="3" sm="3">
                        <div className="view-attachment-card">
                          <div className="view-attachment-icon">
                            <i className="fa fa-picture-o" aria-hidden="true"></i>
                          </div>
                          <div className="view-attachment-text">
                            <p><a href={vaUniqueDetails.internetSpeedScreenshot} download="InternetSpeed Screenshot" target="_blank" rel="noopener noreferrer"><h2>Internet Connection Speed</h2></a></p>
                          </div>
                        </div>
                      </Col>
                    : '' }
                    </Row>
                  </div>
                </div>

                {flag == true ? (<div className="kickoff-date-card">
                {this.state.kickoff_visible == true ?
                <div>
                  <h2>Enter Your Kickoff Date</h2>
                  <div className="date-form-group">    
                    <Row>               
                      <Col md={"6"} className="suggested-date">
                        <FormGroup >
                          <DatePicker className="form-control input-lg"
                            selected={formField.kickoff_date}
                            minDate={(new Date())}
                            onChange={this.setSelectedDateKickoff} dateFormat="MM/dd/yyyy"
                          />
                          <i className="fa fa-calendar"></i>
                        </FormGroup>
                      </Col>
                      <Col md={"6"}>
                        <Button type="submit" className="btn-start" onClick={this.submitKickoff}>Submit</Button>
                      </Col>
                    </Row>
                    </div>
                  </div>
                  : '' }

                </div>) : 

               (<div className="kickoff-date-card">
                  <h2 >Suggested Date & TIme</h2>
                  <div className="date-form-group">
                    <FormGroup >
                      <Row >
                         <Col md={5} className="suggested-date">                           
                            <DatePicker className="form-control input-lg"
                              selected={formField.suggestedDate}
                              minDate={(new Date())}
                              onChange={this.setSelectedDate} dateFormat="MM/dd/yyyy"
                            />
                            <i className="fa fa-calendar"></i>
                        </Col>    
                        <Col md={5}>
                          <input type="time" className="form-control input-lg" name="suggestedTime"
                            value={formField.suggestedTime}
                            onChange={this.changeHandler}
                          />
                        </Col> 
                        <Col md={2}>
                          <Button type="submit" className="btn-start" onClick={this.submitKickoff}>Submit</Button>
                        </Col>
                      </Row>
                        
                     
                        
                      </FormGroup>

                    {/* </Col> */}
                  </div>
                </div>)}
                {/* <div className="kickoff-date-card">
                  <h2>Suggested Time </h2>
                  <div className="date-form-group"> */}
                {/* <input name="kickoff_date" type="date" className="form-control" min={new Date()} value={formField.kickoff_date} onChange={this.changeHandler} />  */}
                {/* <Col md={"12"}>
                                <FormGroup >
                                    <DatePicker className="form-control input-lg" 
                                        selected={formField.kickoff_date}
                                        minDate={(new Date())}
                                        onChange={this.setSelectedDate} dateFormat="MM/dd/yyyy" 
                                        
                                        />
                                         <Button type="submit" className="btn-start" onClick={this.submitKickoff}>Submit</Button>
                                </FormGroup>
                               
                            </Col> */}
                {/* </div>
                </div> */}
              </Col>
            </Row>
          </Container>
        </div>
      </>
    );
  }
}

export default VaProfilePage;
