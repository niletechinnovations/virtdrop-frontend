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
      vaUniqueDetails: '',
      // hireVaId:'',
      skillset_1: '',
      skillset_2: '',
      skillset_3: '',
      flag: false,
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
      commonService.getAPIWithAccessToken('schedule-meeting')
        .then(res => {
          console.log("result====Meeting=======>", res);
          if (undefined === res.data.data || !res.data.status) {
            this.setState({ loading: false });
            toast.error(res.data.message);
            return;
          }
          console.log("Form Field===========", typeof this.state.formField.hireVaId)
          //  if(this.state.formField.hireVaId==res.data.data.requestList.map(e=>e.hireVaId))
          const result = res.data.data.requestList.some(e => e.hireVaId==this.state.formField.hireVaId)
          console.log("result", result)
          if (result == true) {
            this.setState({ flag: true });
          } else { this.setState({ flag: false }) }
          this.setState({ loading: false, meetingsLists: res.data.data.requestList });
        })
        .catch(err => {
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
          console.log("res VA MEMBER111111111", res.data.data.requestList[0])
          if (undefined === res.data.data || !res.data.status) {
            this.setState({ loading: false });
            toast.error(res.data.message);
            return;
          }
          this.setState({ loading: false, vaUniqueDetails: res.data.data.requestList[0] });
          const skillSet_1 = this.state.vaUniqueDetails.skillSet1.map(e => e.skillName).toString()
          const skillSet_2 = this.state.vaUniqueDetails.skillSet2.map(e => e.skillName).toString()
          const skillSet_3 = this.state.vaUniqueDetails.skillSet3.map(e => e.skillName).toString()
          // console.log("skillset_1",skillSet_1, skillSet_2, skillSet_3)
          this.setState({ skillSet_1: skillSet_1, skillSet_2: skillSet_2, skillSet_3: skillSet_3 });
        })
        .catch(err => {
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

    //********************* */
    // const name = date.target.name;
    // const value = date.target.value;
    // const formField = this.state.formField
    // formField[name] = value;
    // console.log("Name and Value", name  , value)
    // this.setState({ formField: formField })

    // ************************
    // console.log("DATEETEST",date)
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
    console.log("formData", formData)
    this.setState({ loading: true }, () => {
      commonService.postAPI(`va-application/kickoff/`, formData)
        .then(res => {
          // console.log("formData VA Profile", res.data.flag)
          // this.setState( { flag:res.data.flag});
          if (undefined === res.data || !res.data.status) {
            this.setState({ loading: false });
            toast.error(res.data.message);
            return;
          }
          // this.props.history.push('/va-profile/');
          toast.success(res.data.message);
          this.setState({
            loading: false,
            errors: {}
          })
        })
        .catch(err => {
          toast.error(err.message);
          this.setState({ loading: false });
        })
    })

    setTimeout(function(){window.location.reload()},6000)
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
    console.log("va unique details", flag)
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
                    <h2>{vaUniqueDetails.firstName + " " + vaUniqueDetails.lastName}</h2>
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
                        <p><a href="tel:+91-8989899899">+91-{vaUniqueDetails.mobileNumber}</a></p>
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
                        {/* <p>https://www.niletechnologies.com/</p> */}
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
                      <Col md="3" lg="3" sm="3">
                        <div className="view-attachment-card">
                          <div className="view-attachment-icon">
                            <i className="fa fa-file-audio-o" aria-hidden="true"></i>
                          </div>
                          <div className="view-attachment-text">
                            {/* <h2>Audio clip editor</h2>  audioFile */}
                            <p><a href={vaUniqueDetails.audioFile} download="VA Audio clip"><h2>Audio clip editor</h2></a></p>
                          </div>
                        </div>
                      </Col>
                      <Col md="3" lg="3" sm="3">
                        <div className="view-attachment-card">
                          <div className="view-attachment-icon">
                            <i className="fa fa-file-word-o" aria-hidden="true"></i>
                          </div>
                          <div className="view-attachment-text">
                            {/* <h2>ResumeCV */}
                            <p><a href="http://localhost:3000/1610693626165Data.csv" download="VA Resume"><h2>ResumeCV</h2></a></p>
                            {/* </h2> */}
                            {/* <p><a href="http://localhost:3000/1610693626165Data.csv" download="VA Resume">ddd</a></p> */}
                          </div>
                        </div>
                      </Col>
                      <Col md="3" lg="3" sm="3">
                        <div className="view-attachment-card">
                          <div className="view-attachment-icon">
                            <i className="fa fa-file-pdf-o" aria-hidden="true"></i>
                          </div>
                          <div className="view-attachment-text">
                            {/* <h2>Intent Letter</h2> */}
                            {/* <p><a href="http://localhost:3000/`${va}` download="VA Resume">ddd</a></p> */}
                            {/* <a href={dataInfo.invoiceAttachment} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary" title="Download Invoice"></a> */}
                            {/* <a href={`http://localhost:3000/va-profile/`+vaUniqueDetails.intentLettr}  */}
                            <p><a href={vaUniqueDetails.intentLetter} download="Intent Lettter"
                              target="_blank" rel="noopener noreferrer" title="Download Intent Letter"><h2>Intent Letter</h2></a></p>
                          </div>
                        </div>
                      </Col>
                      <Col md="3" lg="3" sm="3">
                        <div className="view-attachment-card">
                          <div className="view-attachment-icon">
                            <i className="fa fa-picture-o" aria-hidden="true"></i>
                          </div>
                          <div className="view-attachment-text">
                            {/* <h2>Internet Connection Speed</h2> */}
                            <p><a href={`http://localhost:3000/` + vaUniqueDetails.internetSpeedScreenshot} download="InternetSpeed Screenshot"><h2>Internet Connection Speed</h2></a></p>

                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>

                {flag == true ? (<div className="kickoff-date-card">
                  <h2>Enter Your Kickoff Date</h2>
                  <div className="date-form-group">
                    {/* <input name="kickoff_date" type="date" className="form-control" min={new Date()} value={formField.kickoff_date} onChange={this.changeHandler} />  */}
                   
                      <Col md={"12"}>
                        <FormGroup >
                          <DatePicker className="form-control input-lg"
                            selected={formField.kickoff_date}
                            minDate={(new Date())}
                            onChange={this.setSelectedDateKickoff} dateFormat="MM/dd/yyyy"

                          />
                          <Button type="submit" className="btn-start" onClick={this.submitKickoff}>Submit</Button>
                        </FormGroup>

                      </Col>
                  </div>
                </div>) : 

               (<div className="kickoff-date-card">
                  <h2 style={{marginLeft:"2em"}} >Suggested Date & TIme</h2>
                  <div className="date-form-group">
                    {/* <input name="suggestedDate" type="date" className="form-control" min={new Date()} value={formField.suggestedDate} onChange={this.changeHandler} />  */}
                   <Row>
                    {/* <Col md={"12"}> */}
                      <FormGroup >
                      <Row >
                         <Col  md={6} sm={{ size: '2', offset: 1 }}> 
                          
                            <DatePicker className="form-control input-lg"
                              selected={formField.suggestedDate}
                              minDate={(new Date())}
                              // name="suggestedDate"
                              onChange={this.setSelectedDate} dateFormat="MM/dd/yyyy"
                            // onChange={this.changeHandler} dateFormat="MM/dd/yyyy" 
                            />
                          
                        </Col>
                                                 
                          <Col style={{marginTop:"1em"}} md={6} sm={{ size: '2', offset: 1 }}>
                            <input type="time" className="form-control input-lg" name="suggestedTime"
                              // selected={formField.suggestedTime}
                              value={formField.suggestedTime}
                              // minDate={(new Date())}
                              // timeFormat="HH:mm"
                              // onChange={this.setSelectedTime} 
                              onChange={this.changeHandler}
                            />
                            </Col> 
                         </Row>
                        
                     <Col style={{marginTop:"1em", marginLeft:"5em"}} >
                     <Button type="submit" className="btn-start" onClick={this.submitKickoff}>Submit</Button>
                     </Col>
                        
                      </FormGroup>

                    {/* </Col> */}
                    </Row>
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
