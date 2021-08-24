import React, { Component } from 'react'
import { Card, CardBody, Col, Row, Button, Input, FormGroup, Label, ModalHeader, Modal, Form, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
// import { FormErrors } from '../../../Formerrors/Formerrors';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loader from '../../Loader/Loader';
import ClienrtVAMeetingData from './ClienrtVAMeetingData';

export class ClientVAMeeting extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      meetingsLists: [],
      loading: true,
      clientId: '',
      vAEmail: '',
      vAName: '',
      clientName: '',
      clientEmail: '',
      change: false,
      rowIndex: -1,
      meetingLink: '',
      formProccessing: false,
      isShown: true,
      filterItem: { filterContactPerson: '', filterPhoneNumber: '', filterFrom: '', filterTo: '', filterEmail: '' },
      formField: { meetingLink: '', clientId: '', clientOrganizationName: '', vAEmail: '', vAMobileNo: '', vAName: '', vAAuthId: '', clientEmail: '', clientName: '', hireVAId: '' },
    }
    this.handleDeleteEnquiry = this.handleDeleteEnquiry.bind(this);
    this.filterEnquiryList = this.filterEnquiryList.bind(this);
    this.handleMeetingMail = this.handleMeetingMail.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.toggle = this.toggle.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  // Fetch the Enquiry List
  componentDidMount() {
    //  this.setState({change:true})
    const { match: { params } } = this.props;
    const { location: { state } } = this.props
    console.log("YOU CALLED", state, params)
    if (params.clientId !== undefined && params.clientId !== "") {
      this.setState({ clientId: params.clientId });
      this.setState({ vAEmail: state.VaEmail, clientEmail: state.clientEmail, clientName: state.clientName, vAName: state.VaName })
      // this.getCreditCardInfo(params.profileId);
      // this.props.history.push(`/admin/schedule-meeting/${params.clientId}`);
      // this.props.history.push(`/admin/schedule-meeting`);
    } else
      // this.props.history.push(`/admin/schedule-meeting`);
      //  console.log("ELSE",state);

      //  console.log("proror",params)   
      this.meetingsLists({});


  }

  /* Meeting Lists API */
  meetingsLists(filterItem = {}) {
    let filterQuery = "?pageSize=10000";
    if (filterItem.filterContactPerson !== undefined && filterItem.filterContactPerson !== "")
      filterQuery += (filterQuery !== "") ? "&firstName=" + filterItem.filterContactPerson : "&firstName=" + filterItem.filterContactPerson;

    if (filterItem.filterEmail !== undefined && filterItem.filterEmail !== "")
      filterQuery += (filterQuery !== "") ? "&clientEmail=" + filterItem.filterEmail : "&clientEmail =" + filterItem.filterEmail;

    if (filterItem.filterPhoneNumber !== undefined && filterItem.filterPhoneNumber !== "")
      filterQuery += (filterQuery !== "") ? "&clientPhoneNumber=" + filterItem.filterPhoneNumber : "&clientPhoneNumber=" + filterItem.filterContactPerson;

    if (filterItem.filterFrom !== undefined && filterItem.filterFrom !== "") {
      let newFromDate = this.getFormatDate(filterItem.filterFrom);
      filterQuery += (filterQuery !== "") ? "&start_date=" + newFromDate : "?start_date=" + newFromDate;
    }
    if (filterItem.filterTo !== undefined && filterItem.filterTo !== "") {
      let newToDate = this.getFormatDate(filterItem.filterTo);
      filterQuery += (filterQuery !== "") ? "&end_date=" + newToDate : "?end_date=" + newToDate;
    }

    this.setState({ loading: true }, () => {
      console.log("filterQuerydd", filterQuery)
      commonService.getAPIWithAccessToken('schedule-meeting' + filterQuery)
        .then(res => {
          console.log("result===========>", res);
          if (undefined === res.data.data || !res.data.status) {
            this.setState({ loading: false });
            toast.error(res.data.message);
            return;
          }
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

  setFilterFromDate = date => {
    let filterFormField = this.state.filterItem;
    console.log("ToDate>>>>>", (this.state.filterItem.filterTo) < Date.parse(date))
    if (Date.parse(this.state.filterItem.filterTo) < Date.parse(date)) {

      alert("To Date should be greater than From Date");
    } else {
      filterFormField.filterFrom = date;
      this.setState({ filterItem: filterFormField });
    }


  };

  setFilterToDate = date => {
    let filterFormField = this.state.filterItem;
    // console.log( Date.parse(this.state.filterItem.filterFrom),"=================",Date.parse(date))
    if (Date.parse(this.state.filterItem.filterFrom) > Date.parse(date)) {

      alert("To Date should be greater than From Date");
    } else {

      filterFormField.filterTo = date;
      this.setState({ filterItem: filterFormField });

    }

  };
  /* Input Field On changes*/
  changeHandler = event => {

    let name = event.target.name;
    let value = event.target.value;
    let formField = this.state.formField;
    formField[name] = value;
    this.setState({ meetingLink: formField })
    // () => { this.validateField(name, value) });
  };

  toggle = () => { this.setState({ modal: false }) };
  closeModal = (e) => {
    this.setState({ isShown: false });
  };

  submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    let formData = this.state.formField;
    if (this.state.formField.meetingLink) {
      this.setState({ loading: true }, () => {
        commonService.postAPIWithAccessToken(`schedule-meeting`, formData)
          .then(res => {
            console.log("res----------------", res)
            this.setState({ loading: false });
            if (undefined === res.data || !res.data.status) {
              toast.error(res.data.message);
              this.props.history.push(`/admin/schedule-meeting`);
              return;
            }
            toast.success(res.data.message);
            // this.meetingsLists();
            this.props.history.push(`/admin/schedule-meeting`);

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

      this.setState({ modal: false, formField: '' })
    }
  }


  handleMeetingMail(link, rowIndex, formValue) {

    // return;
    const rowInfo = this.state.meetingsLists[rowIndex];
    console.log("Test Handle meeting=====", rowInfo)
    const formData = {
      meetingLink: this.state.formField.meetingLink,
      clientId: rowInfo.clientId,
      clientOrganizationName: rowInfo.clientOrganizationName,
      clientEmail: rowInfo.clientEmail,
      clientName: rowInfo.clientFirstName,
      hireVAId: rowInfo.hireVaId,

      //vAEmail: rowInfo.selectedVaDetails.map(e=>e.email),
      //vAMobileNo: rowInfo.selectedVaDetails.map(e=>e.mobileNumber),
      //vAName: rowInfo.selectedVaDetails.map(e=>e.firstName),
      //vAAuthId: rowInfo.selectedVaDetails.map(e=>e.authId),
       vAEmail: rowInfo.vaEmail,
       vAMobileNo: rowInfo.vaMobile,
       vAName: rowInfo.vaName,
       vAAuthId: rowInfo.vaAuthId,
    }
    this.setState({ formField: formData })
    console.log("FORM DATA ", this.state.formField)

    this.setState({ modal: true });
  }

  // delete handler
  handleDeleteEnquiry(rowIndex) {
    // return;
    const rowInfo = this.state.meetingsLists[rowIndex];
    console.log("rowInfo", rowInfo);
    
    const delFormData = {
      '_id': rowInfo.id,
      "hireVaId": rowInfo.hireVaId,
    };
    this.setState({ loading: true }, () => {
      commonService.deleteAPIWithAccessToken(`schedule-meeting`, delFormData)
        .then(res => {
          this.setState({ loading: false });
          if (undefined === res.data || !res.data.status) {
            toast.error(res.data.message);
            return;
          }
          toast.success(res.data.message);
          this.meetingsLists();
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

  filterEnquiryList() {
    const filterItem = this.state.filterItem;
    this.meetingsLists(filterItem);
  }

  changeFilterHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    const filterItem = this.state.filterItem
    filterItem[name] = value;
    this.setState({ filterItem: filterItem });
  };
  // setFilterFromDate = date => {
  //   let filterFormField = this.state.filterItem;
  //   filterFormField.filterFrom = date;
  //   this.setState({ filterItem: filterFormField });
  // };
  // setFilterToDate = date => {
  //   let filterFormField = this.state.filterItem;
  //   filterFormField.filterTo = date;
  //   this.setState({ filterItem: filterFormField });
  // };

  resetfilterForm = () => {
    this.setState({
      filterItem: { filterContactPerson: '', filterEmail: '', filterPhoneNumber: '', filterFrom: '', filterTo: '', filterStatus: '' }
    });
    this.meetingsLists();
  }

  getFormatDate(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 101).toString().substring(1);
    var day = (date.getDate() + 100).toString().substring(1);
    return year + "-" + month + "-" + day;
  }

  render() {
    const { meetingsLists, loading, filterItem, modal, formField, formProccessing } = this.state;

    let loaderElement = '';
    if (loading)
      loaderElement = <Loader />
    const processingBtnText = <>Submit <i className="fa fa-spinner"></i></>;

    return (
      <div className="animated fadeIn">
        {loaderElement}
        <Card className="vd-card ">
          <CardBody>
            <Row>
              <Col md={12}>
                <Row className="filterRow">
                  <Col md={"3"} className="pl-3">
                    <FormGroup>
                      <Label htmlFor="filterContactPerson">Client</Label>
                      <Input type="text" placeholder="Client Name" id="filterContactPerson" name="filterContactPerson" value={filterItem.filterContactPerson} onChange={this.changeFilterHandler} />
                    </FormGroup>
                  </Col>
                  <Col md={"2"}>
                    <FormGroup>
                      <Label htmlFor="filterEmail">Email ID</Label>
                      <Input type="email" placeholder="Email ID" id="filterEmail" name="filterEmail" value={filterItem.filterEmail} onChange={this.changeFilterHandler} />
                    </FormGroup>
                  </Col>
                  <Col md={"2"}>
                    <FormGroup>
                      <Label htmlFor="filterPhoneNumber">Phone no.</Label>
                      <Input type="text" placeholder="Phone number" id="filterPhoneNumber" name="filterPhoneNumber" value={filterItem.filterPhoneNumber} onChange={this.changeFilterHandler} />
                    </FormGroup>
                  </Col>
                  <Col md={"2"}>
                    <FormGroup>
                      <Label>From Date</Label>
                      <DatePicker className="form-control" selected={filterItem.filterFrom} maxDate={(new Date())} onChange={this.setFilterFromDate} dateFormat="MM/dd/yyyy" />
                    </FormGroup>
                  </Col>
                  <Col md={"2"}>
                    <FormGroup>
                      <Label>To Date</Label>
                      <DatePicker className="form-control" selected={filterItem.filterTo} maxDate={(new Date())} onChange={this.setFilterToDate} dateFormat="MM/dd/yyyy" />
                    </FormGroup>
                  </Col>
                  <Col md={"1"} className="p-0">
                    <FormGroup>
                      <Label>&nbsp;</Label><br />
                      <Button color="success" type="button" size="sm" onClick={this.filterEnquiryList} title="Filter Inquiries"><i className="fa fa-search"></i></Button>&nbsp;
                          <Button color="danger" type="reset" size="sm" onClick={this.resetfilterForm} title="Clear Fields"><i className="fa fa-refresh"></i></Button>
                    </FormGroup>
                  </Col>
                </Row>
              </Col>

              <Col md={12}>
                <ClienrtVAMeetingData data={meetingsLists} deleteEnquiryAction={this.handleDeleteEnquiry} MailToAction={this.handleMeetingMail} dataTableLoadingStatus={this.state.loading} />
              </Col>
            </Row>

          </CardBody>
        </Card>

        {/* Meeting Form */}
        <Modal isOpen={modal} toggle={this.toggle} className="full-width-modal-section store-modal">
          <ModalHeader title="Add Meeting" toggle={this.toggle}>Add Meeting</ModalHeader>
          <Form onSubmit={this.submitHandler} noValidate>
            <ModalBody>
              {/* <FormErrors formErrors={this.state.formErrors} /> */}
              <Row>
                <Col md={"12"}>
                  <FormGroup>
                    <Label htmlFor="meetingLink" style={{ "fontSize": "16px" }}>Meeting Link</Label>
                    <Input type="textarea" className="form-control" placeholder="Meeting Link*" value={this.state.formField.meetingLink} name="meetingLink" onChange={this.changeHandler} required>
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">{formProccessing ? processingBtnText : 'Submit'}</Button>
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ClientVAMeeting
